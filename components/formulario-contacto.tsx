'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export function FormularioContacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    pais: '',
    mensaje: '',
    consentimiento: false,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Error al enviar mensaje');
      }

      setStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        pais: '',
        mensaje: '',
        consentimiento: false,
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al enviar mensaje'
      );
    }
  };

  return (
    <section id="contacto" className="section bg-black">
      <div className="max-w-[700px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: '#ef4444' }}>
            Hablemos
          </span>
          <h2 className="text-4xl font-bold mb-4 text-white">¿Empezamos?</h2>
          <p className="text-white/60 text-lg">
            Cuéntanos tu situación y te respondemos en menos de 48 horas con orientación real — sin compromiso.
          </p>
        </motion.div>

        {/* Contacto directo */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.a
            href="https://wa.me/41772337353"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, scale: 1.02, boxShadow: '0 16px 40px rgba(37,211,102,0.15)' }}
            className="flex items-center gap-4 rounded-2xl p-5 cursor-pointer"
            style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.18)' }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.2) 0%, rgba(37,211,102,0.08) 100%)', border: '1px solid rgba(37,211,102,0.3)' }}>
                <svg className="w-7 h-7" fill="#25d366" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              {/* Pulsing online dot */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-black"></span>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm mb-0.5">WhatsApp</div>
              <div className="text-white/45 text-xs mb-1.5">+41 77 233 73 53</div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(37,211,102,0.15)', color: '#25d366', border: '1px solid rgba(37,211,102,0.25)' }}>
                Respuesta ~2h
              </span>
            </div>
          </motion.a>

          <motion.a
            href="mailto:hola@migranteglobal.ch"
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02, boxShadow: '0 16px 40px rgba(201,169,110,0.12)' }}
            className="flex items-center gap-4 rounded-2xl p-5 cursor-pointer"
            style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.18)' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.06) 100%)', border: '1px solid rgba(201,169,110,0.3)' }}>
              <Mail className="w-7 h-7" style={{ color: '#c9a96e' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm mb-0.5">Email</div>
              <div className="text-white/45 text-xs mb-1.5">hola@migranteglobal.ch</div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.25)' }}>
                24–48h respuesta
              </span>
            </div>
          </motion.a>
        </div>

        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green mb-2">¡Mensaje enviado!</h3>
              <p className="text-bone/70 mb-6">
                Gracias por escribirnos. Kevin te responderá en menos de 48 horas.
              </p>
              <button onClick={() => setStatus('idle')} className="btn-primary">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-bone/80 mb-2 text-sm">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-bone/80 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-bone/80 mb-2 text-sm">¿Cuál es tu situación? *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Cuéntanos brevemente de dónde eres, en qué trabajas y qué te está frenando para migrar a Suiza..."
                  className="resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentimiento"
                  required
                  checked={formData.consentimiento}
                  onChange={(e) => setFormData({ ...formData, consentimiento: e.target.checked })}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <label htmlFor="consentimiento" className="text-bone/60 text-sm cursor-pointer leading-relaxed">
                  Acepto que mis datos sean almacenados para poder contactarme. Migrante Global
                  respetará tu privacidad y no compartirá tu información con terceros.
                </label>
              </div>

              {status === 'error' && (
                <div className="bg-red/10 border border-red/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red flex-shrink-0 mt-0.5" />
                  <p className="text-red text-sm">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
