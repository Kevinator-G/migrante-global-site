'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { useCalendlyGate } from '@/lib/calendly-gate-context';
import { openCalendly } from '@/components/calendly-widget';

const SOURCE_LABELS: Record<string, string> = {
  hero_consulta_gratuita: 'CTA principal (hero)',
  navbar_contacto: 'Botón Contacto (navbar)',
  navbar_mobile_contacto: 'Botón Contacto (navbar móvil)',
  footer_contacto: 'Botón Contacto (footer)',
  'plan_pack-completo': 'Plan Pack Completo',
  'plan_llegada-completa': 'Plan Llegada Completa',
};

// Captura nombre + email ANTES de abrir Calendly, y lo guarda como lead
// propio — así queda registrado en el panel aunque la persona no termine
// de agendar en Calendly (antes ese tramo era invisible para nosotros).
export function CalendlyLeadGateModal() {
  const { isOpen, source, close } = useCalendlyGate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          mensaje: `Quiere agendar una llamada gratuita — origen: ${
            source ? SOURCE_LABELS[source] ?? source : 'desconocido'
          }`,
          consentimiento: true,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Error al guardar tus datos.' }));
        setErrorMessage(error);
        setStatus('error');
        return;
      }

      const sourceToOpen = source ?? 'unknown';
      setNombre('');
      setEmail('');
      setStatus('idle');
      close();
      openCalendly(sourceToOpen);
    } catch {
      setErrorMessage('Error de red, intenta de nuevo.');
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={close}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#14161c', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Antes de agendar...</h3>
          <button onClick={close} className="text-white/40 hover:text-white transition" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-white/50 text-sm mb-5">
          Déjanos tu nombre y email — así te contactamos si algo se complica con la reserva.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full"
          />
          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          {status === 'error' && <p className="text-red-400 text-xs">{errorMessage}</p>}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Guardando...
              </>
            ) : (
              'Continuar a la agenda'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
