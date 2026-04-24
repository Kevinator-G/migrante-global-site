'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Map, Rocket, ArrowRight, Clock, BookOpen, Lock, MessageSquare } from 'lucide-react';

const GOLD = '#c9a96e';

const fases = [
  {
    numero: '01',
    icon: Search,
    titulo: 'Evaluación',
    pregunta: '¿Por dónde empiezo?',
    descripcion:
      'Analizamos tu perfil real: tu experiencia, tu idioma, tu situación y tus objetivos. No genérico — concreto para ti.',
    obtienes: [
      'Mapa claro de qué pasos dar y en qué orden',
      'Análisis de qué sectores te abren puertas en Suiza',
      'Plan personalizado con plazos realistas',
    ],
    link: '/servicios/sesiones-uno-a-uno',
    linkLabel: 'Ver Sesiones 1:1',
    gradientFrom: 'rgba(245,158,11,0.12)',
    gradientTo: 'rgba(245,158,11,0.03)',
    iconColor: '#f59e0b',
  },
  {
    numero: '02',
    icon: Map,
    titulo: 'Preparación',
    pregunta: '¿Cómo me presento al mercado suizo?',
    descripcion:
      'Te preparamos con las herramientas concretas que necesitas: CV adaptado, estrategia laboral y guía de trámites paso a paso.',
    obtienes: [
      'CV en formato suizo que abre entrevistas',
      'Estrategia de búsqueda de empleo por sector',
      'Guía de trámites (Anmeldung, seguro, banco)',
    ],
    link: '/servicios/cv-formato-suizo',
    linkLabel: 'Ver CV Formato Suizo',
    gradientFrom: 'rgba(220,38,38,0.12)',
    gradientTo: 'rgba(220,38,38,0.03)',
    iconColor: '#ef4444',
  },
  {
    numero: '03',
    icon: Rocket,
    titulo: 'Acompañamiento',
    pregunta: '¿Estaré solo una vez en Suiza?',
    descripcion:
      'No llegas solo. Tendrás a alguien respondiendo tus dudas, revisando tu progreso y empujando cuando lo necesites.',
    obtienes: [
      'Soporte directo durante tu proceso de adaptación',
      'Acceso a comunidad de migrantes que ya están allá',
      'Sesiones de seguimiento según tu plan',
    ],
    link: '/servicios/comunidad-apoyo',
    linkLabel: 'Ver Comunidad de Apoyo',
    gradientFrom: 'rgba(59,130,246,0.12)',
    gradientTo: 'rgba(59,130,246,0.03)',
    iconColor: '#60a5fa',
  },
];

const compromisos = [
  { icon: Clock, titulo: 'Respuesta en 48h', desc: 'Cada mensaje recibe respuesta dentro de 48 horas laborables.' },
  { icon: BookOpen, titulo: 'Info actualizada', desc: 'Datos sobre Suiza revisados y actualizados constantemente.' },
  { icon: Lock, titulo: 'Confidencialidad', desc: 'Tus datos y tu historia se quedan entre tú y nosotros.' },
  { icon: MessageSquare, titulo: 'Soporte humano', desc: 'Hablas con personas, no con bots ni respuestas automáticas.' },
];

export function SeccionMetodo() {
  return (
    <section id="metodo" className="section" style={{ background: '#111318' }}>
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">Cómo trabajamos</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            ¿Qué hacemos <span style={{ color: GOLD }}>por ti?</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            De la duda a la llegada, en 3 etapas concretas. Cada una con entregables claros.
          </p>
        </motion.div>

        {/* Fases */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {fases.map((fase, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative rounded-2xl flex flex-col overflow-hidden"
              style={{
                background: `linear-gradient(160deg, ${fase.gradientFrom} 0%, #161a20 60%)`,
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Número decorativo */}
              <span
                className="absolute top-3 right-4 font-bold select-none pointer-events-none"
                style={{ fontSize: '64px', lineHeight: 1, color: fase.iconColor, opacity: 0.08, fontFamily: 'Georgia, serif' }}
              >
                {fase.numero}
              </span>

              <div className="p-6 flex flex-col flex-1">
                {/* Icono */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: `${fase.iconColor}15`, border: `1px solid ${fase.iconColor}30` }}
                >
                  <fase.icon className="w-5 h-5" style={{ color: fase.iconColor }} />
                </div>

                {/* Título + pregunta */}
                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: fase.iconColor }}>
                    Fase {fase.numero}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{fase.titulo}</h3>
                  <p className="text-sm font-medium" style={{ color: fase.iconColor }}>{fase.pregunta}</p>
                </div>

                <p className="text-white/55 text-sm leading-relaxed mb-5">{fase.descripcion}</p>

                {/* Lo que obtienes */}
                <div className="mb-5 flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">
                    Lo que obtienes
                  </div>
                  <ul className="space-y-2">
                    {fase.obtienes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: fase.iconColor }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Link al servicio */}
                <Link
                  href={fase.link}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
                  style={{ color: fase.iconColor }}
                >
                  {fase.linkLabel}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compromisos */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {compromisos.map((c, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${GOLD}12` }}
                >
                  <c.icon className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div className="font-bold text-white text-sm mb-1">{c.titulo}</div>
                <div className="text-white/45 text-xs leading-snug">{c.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
