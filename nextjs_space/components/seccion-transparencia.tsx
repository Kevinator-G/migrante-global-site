'use client';

import { motion } from 'framer-motion';
import { Shield, XCircle, Heart, Clock, BookOpen, Lock, MessageSquare } from 'lucide-react';

const principios = [
  {
    icon: XCircle,
    titulo: 'No Somos Agencia',
    descripcion:
      'No conseguimos empleos, no somos inmobiliaria, no gestionamos permisos legales. Solo orientamos y acompañamos.',
  },
  {
    icon: Shield,
    titulo: 'Sin Garantías',
    descripcion:
      'No garantizamos empleo, residencia ni aprobación de trámites. El éxito depende de tu preparación, experiencia y esfuerzo.',
  },
  {
    icon: Heart,
    titulo: 'Con Honestidad',
    descripcion:
      'Te diremos la verdad, incluso si no es lo que quieres escuchar. Mejor una realidad dura que una promesa falsa.',
  },
];

const compromisos = [
  {
    icon: Clock,
    titulo: 'Respuestas en 48h',
    texto: 'Contestamos tus dudas en un máximo de 2 días hábiles.',
  },
  {
    icon: BookOpen,
    titulo: 'Información actualizada',
    texto: 'Nuestros recursos y guías se actualizan continuamente.',
  },
  {
    icon: Lock,
    titulo: 'Confidencialidad',
    texto: 'Tu información personal está protegida y nunca se comparte.',
  },
  {
    icon: MessageSquare,
    titulo: 'Soporte real',
    texto: 'Hablamos contigo directamente, no con bots ni respuestas automáticas.',
  },
];

export function SeccionTransparencia() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #111318 0%, #0d1015 100%)' }}
    >
      {/* Glow central */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,240,232,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">

        {/* ── Header centrado ── */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">Nuestro compromiso</span>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="w-7 h-7" style={{ color: '#c9a96e' }} />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Transparencia Total</h2>
          </div>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Lo que necesitas saber antes de trabajar con nosotros
          </p>
        </motion.div>

        {/* ── 3 principios — tarjetas centradas ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {principios.map((p, i) => (
            <motion.div
              key={i}
              initial={{ y: 15 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              data-light-card="true"
              className="group relative rounded-2xl p-7 text-center flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.25)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              {/* Icono */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: 'var(--surface-card-elevated)',
                  border: '1px solid rgba(128,128,128,0.15)',
                }}
              >
                <p.icon className="w-5 h-5 text-white/70" />
              </div>

              <h3 className="font-semibold text-white text-lg mb-3">{p.titulo}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{p.descripcion}</p>

              {/* Línea decorativa inferior */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Compromisos — grid 4 columnas ── */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          data-light-card="true"
          className="rounded-2xl p-8"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: '#c9a96e', letterSpacing: '3px' }}
          >
            Compromisos de calidad
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {compromisos.map((c, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(201,169,110,0.08)',
                    border: '1px solid rgba(201,169,110,0.2)',
                  }}
                >
                  <c.icon className="w-4 h-4" style={{ color: '#c9a96e' }} />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{c.titulo}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{c.texto}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
