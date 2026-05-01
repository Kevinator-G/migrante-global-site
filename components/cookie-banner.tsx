'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Shield, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ConsentState = 'pending' | 'accepted' | 'rejected' | 'custom';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (!stored) setVisible(true);
  }, []);

  const save = (state: ConsentState, analyticsVal = false) => {
    localStorage.setItem('cookie-consent', state);
    localStorage.setItem('cookie-analytics', String(analyticsVal));
    window.dispatchEvent(new Event('cookie-consent-updated'));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div
            className="max-w-[900px] mx-auto rounded-2xl p-5 md:p-6"
            style={{
              background: 'rgba(15,17,22,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {!showDetails ? (
              /* Vista principal */
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Usamos cookies</p>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Usamos cookies esenciales para que el sitio funcione y, con tu permiso, cookies
                      analíticas para mejorar tu experiencia. Los videos de YouTube pueden cargar
                      cookies de Google.{' '}
                      <Link href="/legal/cookies" className="text-yellow-500 hover:underline">
                        Política de cookies
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => setShowDetails(true)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white/60 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    Personalizar
                  </button>
                  <button
                    onClick={() => save('rejected')}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white/60 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    Solo esenciales
                  </button>
                  <button
                    onClick={() => save('accepted', true)}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: '#c9a96e', color: '#111318' }}
                  >
                    Aceptar todas
                  </button>
                </div>
              </div>
            ) : (
              /* Vista detalle */
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-bold text-sm">Preferencias de cookies</h3>
                  <button onClick={() => setShowDetails(false)}>
                    <X className="w-4 h-4 text-white/40 hover:text-white/70" />
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  {/* Esenciales — siempre activas */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-xs font-semibold mb-0.5">Cookies esenciales</p>
                        <p className="text-white/40 text-xs leading-relaxed">
                          Necesarias para el funcionamiento básico: sesión, carrito, consentimiento. No se pueden desactivar.
                        </p>
                      </div>
                    </div>
                    <span className="text-green-400 text-xs font-semibold flex-shrink-0">Siempre activas</span>
                  </div>

                  {/* Analíticas — opcionales */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start gap-3">
                      <BarChart2 className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-xs font-semibold mb-0.5">Cookies analíticas</p>
                        <p className="text-white/40 text-xs leading-relaxed">
                          Nos ayudan a entender cómo se usa el sitio para mejorarlo. Incluye videos de YouTube (Google).
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAnalytics(!analytics)}
                      className="flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 relative"
                      style={{ background: analytics ? '#c9a96e' : 'rgba(255,255,255,0.15)' }}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{ transform: analytics ? 'translateX(22px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5">
                  <button
                    onClick={() => save('custom', analytics)}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: '#c9a96e', color: '#111318' }}
                  >
                    Guardar preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
