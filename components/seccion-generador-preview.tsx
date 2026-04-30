'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FilePenLine, FileText, Home, ClipboardList, Sparkles, ArrowRight, User } from 'lucide-react';

const GOLD = '#c9a96e';

const tipos = [
  { value: 'vivienda', label: 'Carta para vivienda', icon: Home, desc: 'Para propietarios e inmobiliarias suizas en alemán formal' },
  { value: 'trabajo',  label: 'Carta de presentación', icon: FilePenLine, desc: 'Bewerbungsschreiben profesional para candidaturas' },
  { value: 'tramites', label: 'Carta para trámites', icon: ClipboardList, desc: 'Anmeldung, seguros, RAV, migraciones y más' },
  { value: 'cv',       label: 'CV formato suizo', icon: FileText, desc: 'Lebenslauf adaptado al estándar profesional suizo' },
];

export function SeccionGeneradorPreview() {
  const [selected, setSelected] = useState('vivienda');

  return (
    <section
      id="generador"
      className="relative overflow-hidden"
      style={{ background: '#0d1117', padding: '80px 0' }}
    >
      {/* Glow dorado sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 55% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Izquierda: presentación ── */}
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
              <Sparkles className="w-3 h-3" />
              Herramienta gratuita con IA
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Genera tu documento{' '}
              <span style={{ color: GOLD }}>en segundos</span>
            </h2>

            <p className="text-white/55 text-base leading-relaxed mb-6">
              Cartas para vivienda, presentaciones laborales y trámites adaptados a tu perfil real.
              En alemán formal, listas para enviar.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Carta para vivienda en alemán (Hochdeutsch) → más respuestas de propietarios',
                'CV formato Lebenslauf con la estructura exacta que piden los empleadores suizos',
                'Cartas para Anmeldung, seguros, RAV y otros trámites',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gratuito · Sin registro
              </div>
              <span className="text-white/30 text-xs">Generado con Claude AI</span>
            </div>
          </motion.div>

          {/* ── Derecha: mini selector interactivo ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(201,169,110,0.2)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Selector de tipo */}
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">
                ¿Qué documento necesitas?
              </p>

              <div className="space-y-2 mb-6">
                {tipos.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selected === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setSelected(t.value)}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200"
                      style={{
                        background: isSelected ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? `1px solid rgba(201,169,110,0.4)` : '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: isSelected ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.05)' }}
                      >
                        <Icon className="w-4 h-4" style={{ color: isSelected ? GOLD : 'rgba(255,255,255,0.4)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold" style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.6)' }}>
                          {t.label}
                        </div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {t.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Preview nombre */}
              <div className="rounded-xl px-4 py-3 mb-5 flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <User className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Tu nombre · Tu profesión · Tu situación real…
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/servicios/generador-documentos?tipo=${selected}`}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all duration-200 group active:scale-95"
                style={{ background: GOLD, color: '#111318' }}
              >
                <Sparkles className="w-4 h-4" />
                Generar mi documento gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-white/25 text-xs mt-3">
                Sin registro · Descarga en PDF · Listo en 30 segundos
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
