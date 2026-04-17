'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Shield } from 'lucide-react';

const GOLD = '#c9a96e';
const GOLD_BG = 'rgba(201,169,110,0.08)';
const GOLD_BORDER = 'rgba(201,169,110,0.25)';
const GOLD_HOVER = 'rgba(201,169,110,0.06)';

const valores = [
  {
    numero: '01',
    icon: Heart,
    titulo: 'Entendemos tu situación',
    descripcion:
      'Migrar no es solo papeleo. Es dejar atrás familia, amigos y lo conocido. Te acompañamos en cada paso, con empatía real.',
  },
  {
    numero: '02',
    icon: Users,
    titulo: 'Experiencia real',
    descripcion:
      'Hemos vivido el proceso de migración. Sabemos qué funciona y qué no. Sin teoría vacía — solo práctica comprobada.',
  },
  {
    numero: '03',
    icon: Shield,
    titulo: 'Transparencia total',
    descripcion:
      'No prometemos empleos ni residencia garantizada. Te guiamos, orientamos y acompañamos honestamente. El resto depende de ti.',
  },
];

export function SeccionValidacion() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'var(--surface-section-dark, #0a0c10)' }}
    >
      {/* Glow sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">Por qué elegirnos</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por qué <span className="text-yellow-500">confiarnos</span> tu proceso
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            No somos una agencia más. Somos personas que han migrado y quieren ayudarte a hacerlo bien.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {valores.map((valor, index) => (
            <motion.div
              key={index}
              data-light-card="true"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative rounded-2xl p-7 flex flex-col transition-all duration-300 cursor-default"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: `2px solid ${GOLD}`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.25), 0 0 0 1px ${GOLD_BORDER}`;
                (e.currentTarget as HTMLElement).style.background = GOLD_HOVER;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.background = 'var(--surface-card)';
              }}
            >
              {/* Número decorativo */}
              <span
                className="absolute top-4 right-5 font-bold select-none pointer-events-none"
                style={{
                  fontSize: '72px',
                  lineHeight: 1,
                  color: GOLD,
                  opacity: 0.05,
                  fontFamily: 'Georgia, serif',
                }}
              >
                {valor.numero}
              </span>

              {/* Icono */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ background: GOLD_BG, border: `1px solid ${GOLD}25` }}
              >
                <valor.icon style={{ color: GOLD }} className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{valor.titulo}</h3>
              <p className="text-white/50 text-[15px] leading-relaxed flex-1">{valor.descripcion}</p>

              {/* Línea animada */}
              <div
                className="mt-6 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {[
            { valor: '150+', label: 'Familias orientadas', color: '#f59e0b' },
            { valor: '10+', label: 'Países de origen', color: '#ef4444' },
            { valor: '0', label: 'Promesas falsas', color: '#60a5fa' },
          ].map((stat, i) => (
            <div
              key={i}
              data-light-card="true"
              className="flex flex-col items-center justify-center py-7 px-4 text-center"
              style={{ background: 'var(--surface-card)' }}
            >
              <span className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.valor}
              </span>
              <span className="text-white/45 text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
