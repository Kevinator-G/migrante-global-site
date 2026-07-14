'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Compass, CalendarCheck, MapPin, ArrowRight } from 'lucide-react';

const GOLD = '#c9a96e';
const GOLD_BG = 'rgba(201,169,110,0.08)';
const GOLD_BORDER = 'rgba(201,169,110,0.25)';

const etapas = [
  {
    icon: Compass,
    etiqueta: 'Etapa 1',
    titulo: 'Estoy planeando',
    descripcion: 'Aún estás en tu país y quieres saber si Suiza es para ti — y qué necesitas para lograrlo.',
    pasos: ['Evalúa tu perfil y tu sector', 'Calcula el presupuesto real', 'Define tu plan de idioma'],
    links: [
      { label: 'Orientación laboral', href: '/servicios/orientacion-laboral' },
      { label: '¿Suiza u otro país?', href: '/servicios/orientacion-otros-paises' },
    ],
  },
  {
    icon: CalendarCheck,
    etiqueta: 'Etapa 2',
    titulo: 'Ya tengo fecha',
    descripcion: 'La decisión está tomada. Ahora toca conseguir empleo, vivienda y aterrizar sin sorpresas.',
    pasos: ['Adapta tu CV al formato suizo', 'Asegura tu primera vivienda', 'Organiza la llegada'],
    links: [
      { label: 'CV formato suizo', href: '/servicios/cv-formato-suizo' },
      { label: 'Habitaciones disponibles', href: '/servicios/alojamiento' },
      { label: 'Recogida en aeropuerto', href: '/servicios/recogida-aeropuerto' },
    ],
  },
  {
    icon: MapPin,
    etiqueta: 'Etapa 3',
    titulo: 'Ya estoy en Suiza',
    descripcion: 'Llegaste. Los primeros 90 días definen todo: trámites, seguro, banco e integración.',
    pasos: ['Completa el Anmeldung a tiempo', 'Contrata seguro y abre cuenta', 'Conecta con la comunidad'],
    links: [
      { label: 'Acompañamiento en trámites', href: '/servicios/tramites' },
      { label: 'Alemán para migrantes', href: '/servicios/clases-aleman' },
      { label: 'Comunidad de apoyo', href: '/servicios/comunidad-apoyo' },
    ],
  },
];

export function SeccionEtapas() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'var(--surface-section-dark, #0a0c10)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,169,110,0.05) 0%, transparent 70%)',
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
          <span className="section-tag">Empieza aquí</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿En qué <span className="text-yellow-500">etapa</span> estás?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Cada etapa del camino tiene sus propios pasos. Elige la tuya y te muestro exactamente qué hacer — en orden.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {etapas.map((etapa, index) => {
            const Icon = etapa.icon;
            return (
              <motion.div
                key={etapa.titulo}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-light-card="true"
                className="rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(160deg, var(--surface-card-elevated, #14161c) 0%, var(--surface-card, #101216) 100%)',
                  border: `1px solid ${GOLD_BORDER}`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
                      {etapa.etiqueta}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight">{etapa.titulo}</h3>
                  </div>
                </div>

                <p className="text-white/55 text-sm leading-relaxed mb-5">{etapa.descripcion}</p>

                {/* Pasos en orden */}
                <ol className="flex flex-col gap-2 mb-6">
                  {etapa.pasos.map((paso, i) => (
                    <li key={paso} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                        style={{ background: GOLD_BG, color: GOLD, border: `1px solid ${GOLD_BORDER}` }}
                      >
                        {i + 1}
                      </span>
                      {paso}
                    </li>
                  ))}
                </ol>

                {/* Links a servicios */}
                <div className="mt-auto flex flex-col gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {etapa.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between text-sm font-medium text-white/60 hover:text-yellow-500 transition-colors group"
                    >
                      {link.label}
                      <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA diagnóstico — el filtro pago de leads */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-center justify-between gap-5"
          style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
        >
          <div>
            <p className="text-white font-bold text-lg mb-1">¿No sabes si tu proyecto es viable?</p>
            <p className="text-white/55 text-sm max-w-lg">
              Responde 4 preguntas y en 24h te doy mi diagnóstico honesto — incluso si la respuesta es que Suiza no te conviene. Los 47 € se descuentan de cualquier servicio.
            </p>
          </div>
          <Link
            href="/diagnostico"
            className="shrink-0 inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl transition hover:-translate-y-0.5"
            style={{ background: GOLD, color: '#111318' }}
          >
            Hacer el diagnóstico <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
