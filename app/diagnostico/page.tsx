'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CheckCircle2, ArrowRight, Loader2, Stethoscope } from 'lucide-react';

// Enlace de pago de Stripe (live) — Diagnóstico de viabilidad 47 CHF (antes 47 EUR)
const STRIPE_DIAGNOSTICO = 'https://buy.stripe.com/00w5kwbZk8sTcV733L5sA03';

const PREGUNTAS = [
  {
    id: 'etapa',
    titulo: '¿En qué etapa estás?',
    opciones: ['Todavía estoy explorando', 'Decidido, planeando la llegada', 'Ya estoy en Suiza'],
  },
  {
    id: 'pasaporte',
    titulo: '¿Qué pasaporte tienes?',
    opciones: ['UE / AELC (España, Italia...)', 'Latinoamericano', 'Doble nacionalidad', 'Otro'],
  },
  {
    id: 'sector',
    titulo: '¿En qué sector trabajas o quieres trabajar?',
    opciones: ['Salud / cuidados', 'Construcción / oficios', 'Gastronomía / hotelería', 'Oficina / IT', 'Otro'],
  },
  {
    id: 'presupuesto',
    titulo: '¿Con cuánto ahorro cuentas para el proyecto?',
    opciones: ['Menos de 3.000 CHF', 'Entre 3.000 y 8.000 CHF', 'Más de 8.000 CHF'],
  },
] as const;

export default function DiagnosticoPage() {
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [pagoOk, setPagoOk] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('pago') === 'exitoso') setPagoOk(true);
  }, []);

  const completo = PREGUNTAS.every((p) => respuestas[p.id]) && nombre.trim() && email.trim();

  const enviar = async () => {
    if (!completo || enviando) return;
    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, ...respuestas }),
      });
      if (!res.ok) throw new Error('No se pudo guardar tu información');
      window.location.href = `${STRIPE_DIAGNOSTICO}?prefilled_email=${encodeURIComponent(email)}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setEnviando(false);
    }
  };

  if (pagoOk) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#080a0f] pt-32 px-6 pb-20">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto mb-5" />
            <h1 className="text-3xl font-bold text-white mb-4">¡Diagnóstico reservado!</h1>
            <p className="text-white/60 leading-relaxed">
              Recibí tu pago y tus respuestas. En las próximas <b className="text-white">24 horas</b> te
              escribo por WhatsApp con tu diagnóstico personalizado: si tu proyecto es viable, qué camino
              te conviene y tu siguiente paso concreto. Los 47 CHF se descuentan de cualquier servicio que contrates.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#080a0f] pt-28 px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e' }}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Diagnóstico de viabilidad
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Tu proyecto de migrar a Suiza es viable?
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Responde 4 preguntas y recibe en 24h mi diagnóstico honesto: si conviene, cuándo y por dónde
              empezar — o si mejor no (también te lo diré). <b className="text-white">47 CHF que se descuentan de cualquier servicio.</b>
            </p>
          </div>

          {/* Quiz */}
          <div className="flex flex-col gap-8">
            {PREGUNTAS.map((p, idx) => (
              <div key={p.id}>
                <p className="text-white font-semibold mb-3">
                  <span className="text-[#c9a96e] mr-2">{idx + 1}.</span>
                  {p.titulo}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.opciones.map((op) => {
                    const activa = respuestas[p.id] === op;
                    return (
                      <button
                        key={op}
                        onClick={() => setRespuestas((r) => ({ ...r, [p.id]: op }))}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={
                          activa
                            ? { background: '#c9a96e', color: '#111318' }
                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
                        }
                      >
                        {op}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Datos de contacto */}
            <div className="grid sm:grid-cols-3 gap-3 mt-2">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Tu email"
                className="rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="WhatsApp (opcional)"
                className="rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={enviar}
              disabled={!completo || enviando}
              className="w-full sm:w-auto sm:mx-auto inline-flex items-center justify-center gap-2 font-bold px-10 py-4 rounded-xl transition disabled:opacity-40"
              style={{ background: '#c9a96e', color: '#111318' }}
            >
              {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {enviando ? 'Guardando…' : 'Recibir mi diagnóstico · 47 CHF'}
            </button>
            <p className="text-white/30 text-xs text-center -mt-4">
              Pago seguro con Stripe · Si tu proyecto no es viable, te lo digo igual — sin venderte humo.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
