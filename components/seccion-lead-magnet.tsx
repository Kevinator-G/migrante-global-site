'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, CheckCircle, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';

const GOLD = '#c9a96e';

const puntos = [
  'Los 7 errores que cometen los latinos al migrar a Suiza',
  'Qué sectores contratan sin hablar alemán',
  'Cuánto dinero necesitas ahorrar antes de llegar',
  'Cómo encontrar piso antes de salir de tu país',
  'El orden exacto de los trámites en los primeros 30 días',
];

export function SeccionLeadMagnet() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          nombre: nombre.trim() || 'Sin nombre',
          telefono: '',
          pais: '',
          mensaje: 'Solicitud guía gratuita: Los 7 errores al migrar a Suiza',
          consentimiento: true,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="guia-gratuita"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #111318 100%)', padding: '80px 0' }}
    >
      {/* Glow dorado */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Izquierda — contenido */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[2.5px] uppercase mb-5"
              style={{ background: 'rgba(201,169,110,0.12)', border: `1px solid rgba(201,169,110,0.3)`, color: GOLD }}
            >
              <FileText className="w-3 h-3" />
              Guía gratuita
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Descarga gratis:{' '}
              <span style={{ color: GOLD }}>
                Los 7 errores que cometen los latinos al migrar a Suiza
              </span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-6">
              Una guía honesta y directa basada en 3 años viviendo en Suiza y más de 150 personas acompañadas.
              Lo que nadie te cuenta antes de comprar el billete.
            </p>

            <ul className="space-y-2.5 mb-0">
              {puntos.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Derecha — formulario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="rounded-2xl p-7"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(201,169,110,0.2)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,169,110,0.08)`,
              }}
            >
              {status === 'success' ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: GOLD }} />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {nombre ? `¡Listo, ${nombre.split(' ')[0]}!` : '¡Listo!'}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    Tu guía está lista. Haz clic para descargarla ahora.
                  </p>
                  <a
                    href="/7 errores al llegar a suiza.pdf"
                    download="Guia-Migrante-Global-7-Errores.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                    style={{ background: GOLD, color: '#111318' }}
                  >
                    <FileText className="w-4 h-4" />
                    Descargar guía gratis
                  </a>
                  <p className="text-white/25 text-xs mt-4">
                    La descarga comenzará automáticamente.
                  </p>
                </div>
              ) : (
                <>
                  {/* Portada visual de la guía */}
                  <div
                    className="rounded-xl p-5 mb-6 text-center"
                    style={{ background: 'rgba(201,169,110,0.06)', border: `1px solid rgba(201,169,110,0.15)` }}
                  >
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.25) 0%, rgba(201,169,110,0.08) 100%)', border: `1px solid rgba(201,169,110,0.35)` }}>
                      <BookOpen className="w-7 h-7" style={{ color: GOLD }} />
                    </div>
                    <div className="font-bold text-white text-sm">Guía Migrante Global</div>
                    <div className="text-white/40 text-xs mt-0.5">PDF · Gratis · Descarga inmediata</div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Tu nombre <span className="text-white/30">(opcional)</span></label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="¿Cómo te llamas?"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Tu email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                      style={{ background: GOLD, color: '#111318' }}
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-[#111318]/30 border-t-[#111318] rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Quiero la guía gratis
                        </>
                      )}
                    </button>

                    {status === 'error' && (
                      <p className="text-red-400 text-xs text-center">
                        Algo falló. Escríbenos a hola@migranteglobal.ch
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-white/30 text-xs">
                      <ShieldCheck className="w-3 h-3" />
                      Sin spam. Cancelar cuando quieras.
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
