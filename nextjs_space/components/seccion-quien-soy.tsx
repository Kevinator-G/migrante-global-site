'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, Youtube, ArrowRight } from 'lucide-react';

const GOLD = '#c9a96e';
const BG = '#0d1117';

const stats = [
  { icon: Calendar, value: '3+ años', label: 'En el sector suizo' },
  { icon: MapPin, value: '10+ años', label: 'Recorriendo Europa' },
  { icon: Users, value: '150+', label: 'Personas acompañadas' },
];

export function SeccionQuienSoy() {
  return (
    <section
      id="quien-soy"
      className="relative overflow-hidden"
      style={{ background: BG, padding: '80px 0' }}
    >
      {/* Glow sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 80% 30%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-[10px] font-bold tracking-[3px] uppercase px-4 py-1.5 rounded-full mb-4"
            style={{
              background: 'rgba(201,169,110,0.12)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: GOLD,
            }}
          >
            Quién está detrás
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Hola, soy <span style={{ color: GOLD }}>Kevin</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Migrante, consultor y fundador de Migrante Global. Detrás de cada mensaje y cada llamada hay una persona real, no un equipo de marketing.
          </p>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[280px_1fr] gap-8 items-start rounded-2xl p-6 md:p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Foto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            whileHover={{ scale: 1.02, rotate: 0.5 }}
            className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mx-auto max-w-[280px] group cursor-pointer"
            style={{
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD}25`,
            }}
          >
            {/* Glow dorado pulsante */}
            <motion.div
              className="absolute -inset-4 pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${GOLD}30 0%, transparent 60%)`,
                filter: 'blur(20px)',
              }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <Image
              src="/kevin-perfil.jpg"
              alt="Kevin García, fundador de Migrante Global"
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 280px, 280px"
              style={{ filter: 'contrast(1.2) saturate(1.1) brightness(1.05)' }}
            />

            {/* Viñeta radial — resalta el centro */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 85% 65% at 50% 40%, transparent 35%, rgba(0,0,0,0.5) 100%)',
              }}
            />
            {/* Degradado inferior para el badge */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.8) 100%)' }}
            />

            {/* Borde dorado animado */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ border: `1.5px solid ${GOLD}`, opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Brillo diagonal al hover */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
              }}
            />

            {/* Badge disponible */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-white text-xs font-medium">Disponible para consultas</span>
            </div>
          </motion.div>

          {/* Texto */}
          <div>
            <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Llevo más de <strong className="text-white">10 años recorriendo Europa</strong> y los últimos{' '}
              <strong className="text-white">3+ años viviendo y trabajando en Suiza</strong>. He pasado por
              lo que tú estás a punto de pasar: las dudas, los trámites, las llegadas en frío, las
              entrevistas en alemán, los contratos que no entiendes y las decisiones difíciles.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Por eso fundé <strong style={{ color: GOLD }}>Migrante Global</strong>: para que nadie tenga
              que migrar a ciegas. Te acompaño con la información que a mí me hubiera gustado tener,
              sin promesas falsas y sin venderte un sueño que no se sostiene.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <s.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: GOLD }} />
                  <div className="font-bold text-sm text-white">{s.value}</div>
                  <div className="text-[11px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@migranteglobal"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl p-4 mb-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(220,38,38,0.07)',
                border: '1px solid rgba(220,38,38,0.2)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'rgba(220,38,38,0.15)' }}
              >
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white">Migrante Global · YouTube</div>
                <p className="text-xs leading-snug mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Vídeos sobre la vida real en Suiza, trabajo, trámites y lo que nadie te cuenta.{' '}
                  <span className="text-red-400 font-semibold">@migranteglobal</span>
                </p>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0 text-red-500/40 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200" />
            </a>

            {/* CTA */}
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 group"
              style={{ background: GOLD, color: '#111318' }}
            >
              Hablemos directamente
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
