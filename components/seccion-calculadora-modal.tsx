'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, TrendingUp, ArrowRight, Globe } from 'lucide-react';
import { Calculadora } from '@/components/calculadora';

/* Comparaciones de ejemplo para el teaser */
const ejemplos = [
  {
    pais: '🇦🇷 Argentina',
    salarioOrigen: '400 €',
    salarioSuiza: '6.905 CHF',
    diferencia: '+1.626%',
    sector: 'Salario medio',
  },
  {
    pais: '🇲🇽 México',
    salarioOrigen: '600 €',
    salarioSuiza: '6.905 CHF',
    diferencia: '+1.051%',
    sector: 'Salario medio',
  },
  {
    pais: '🇨🇴 Colombia',
    salarioOrigen: '450 €',
    salarioSuiza: '9.200 CHF',
    diferencia: '+1.944%',
    sector: 'Tecnología / IT',
  },
];

export function SeccionCalculadoraModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── TEASER SECTION ── */}
      <section className="section relative overflow-hidden" style={{ background: '#0d1117' }}>
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(220,38,38,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ y: 15 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="section-tag">Herramienta gratuita</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Cuánto ganarías{' '}
              <span className="text-yellow-500">trabajando en Suiza?</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Compara tu salario actual con los promedios suizos por sector y país. Datos orientativos.
            </p>
          </motion.div>

          {/* Preview cards */}
          <motion.div
            initial={{ y: 15 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-10"
          >
            {ejemplos.map((ej, i) => (
              <div
                key={i}
                className="rounded-xl p-5 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onClick={() => setIsOpen(true)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-white text-sm">{ej.pais}</span>
                  <Globe className="w-4 h-4 text-white/20" />
                </div>

                <div className="flex items-end justify-between mb-1">
                  <div>
                    <div className="text-white/40 text-xs mb-1">{ej.sector}</div>
                    <div className="text-white/70 text-sm line-through">{ej.salarioOrigen}</div>
                    <div className="text-yellow-500 font-bold text-xl">{ej.salarioSuiza}</div>
                  </div>
                  <div
                    className="text-right px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    <div className="text-emerald-400 font-bold text-sm">{ej.diferencia}</div>
                  </div>
                </div>

                {/* Hover line */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }}
                />
              </div>
            ))}
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #c41f1f 100%)',
                color: 'white',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 0 #7f1d1d, 0 8px 16px rgba(0,0,0,0.35)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow =
                  'inset 0 1px 0 rgba(255,255,255,0.25), 0 9px 0 #7f1d1d, 0 12px 24px rgba(0,0,0,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow =
                  'inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 0 #7f1d1d, 0 8px 16px rgba(0,0,0,0.35)';
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(4px)';
                (e.currentTarget as HTMLElement).style.boxShadow =
                  'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 0 #7f1d1d, 0 3px 8px rgba(0,0,0,0.3)';
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow =
                  'inset 0 1px 0 rgba(255,255,255,0.25), 0 9px 0 #7f1d1d, 0 12px 24px rgba(0,0,0,0.45)';
              }}
            >
              <Calculator className="w-5 h-5" />
              Abrir calculadora completa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-white/30 text-xs">
              Gratis · Sin registro · Datos orientativos
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="modal-backdrop fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="modal-panel fixed inset-x-4 top-4 bottom-4 md:inset-x-8 md:top-6 md:bottom-6 lg:inset-x-16 z-[90] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#0e1117', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Modal header */}
              <div
                className="modal-header flex items-center justify-between px-6 py-4 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111318' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(220,38,38,0.15)' }}
                  >
                    <Calculator className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Calculadora de salarios</div>
                    <div className="text-white/40 text-xs">Datos orientativos · No asesoramiento financiero</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Calculator content — scrollable */}
              <div className="flex-1 overflow-y-auto">
                <Calculadora compact onClose={() => setIsOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
