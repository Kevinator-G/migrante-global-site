'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
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
      <div className="max-w-[800px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Contáctanos</h2>
          <p className="text-bone/70 text-lg">
            ¿Tienes dudas o quieres empezar tu proceso? Escríbenos y te responderemos pronto.
          </p>
        </motion.div>
        

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
                Gracias por contactarnos. Te responderemos pronto.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-primary"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-bone/80 mb-2 text-sm">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+41 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-bone/80 mb-2 text-sm">País de Origen</label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    placeholder="Tu país"
                  />
                </div>
              </div>

              <div>
                <label className="block text-bone/80 mb-2 text-sm">Mensaje *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Cuéntanos sobre tu situación y cómo podemos ayudarte..."
                  className="resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentimiento"
                  required
                  checked={formData.consentimiento}
                  onChange={(e) =>
                    setFormData({ ...formData, consentimiento: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <label htmlFor="consentimiento" className="text-bone/70 text-sm cursor-pointer">
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
                    Enviar Mensaje
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
