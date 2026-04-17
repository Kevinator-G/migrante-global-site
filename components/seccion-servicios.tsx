'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  Video,
  Home,
  FilePenLine,
  FileCheck,
  Languages,
  Plane,
  Users,
  Globe,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

/* ─── Servicios destacados (gancho) ─────────────────────────── */
const destacados = [
  {
    icon: Briefcase,
    titulo: 'Orientación Laboral',
    descripcion:
      'Estrategia personalizada para encontrar empleo en el mercado laboral suizo. CV, búsqueda, entrevistas.',
    link: '/servicios/orientacion-laboral',
    accentColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.12)',
    tag: 'Más solicitado',
    tagColor: '#f59e0b',
  },
  {
    icon: FileText,
    titulo: 'CV Formato Suizo',
    descripcion:
      'Adapta tu currículum a los estándares suizos. Aumenta tu tasa de respuesta con un CV que abre puertas.',
    link: '/servicios/cv-formato-suizo',
    accentColor: '#dc2626',
    iconBg: 'rgba(220,38,38,0.12)',
    tag: 'Alta demanda',
    tagColor: '#ef4444',
  },
  {
    icon: Video,
    titulo: 'Sesiones 1:1',
    descripcion:
      'Videollamadas personalizadas con orientadores que ya viven en Suiza. Tus dudas, resueltas en tiempo real.',
    link: '/servicios/sesiones-uno-a-uno',
    accentColor: '#3b82f6',
    iconBg: 'rgba(59,130,246,0.12)',
    tag: 'Incluido en planes',
    tagColor: '#60a5fa',
  },
];

/* ─── Servicios adicionales (expandibles) ───────────────────── */
const adicionales = [
  { icon: Home,        titulo: 'Gestión de Alojamiento',   link: '/servicios/alojamiento',              descripcion: 'Encuentra tu primer alojamiento en Suiza.' },
  { icon: FilePenLine, titulo: 'Generador de Documentos',  link: '/servicios/generador-documentos',     descripcion: 'Cartas para vivienda, empleo y trámites con IA.' },
  { icon: FileCheck,   titulo: 'Acompañamiento en Trámites', link: '/servicios/tramites',               descripcion: 'Trámites administrativos paso a paso.' },
  { icon: Languages,   titulo: 'Clases de Alemán',         link: '/servicios/clases-aleman',            descripcion: 'Clases personalizadas con profesora nativa.' },
  { icon: Users,       titulo: 'Comunidad de Apoyo',       link: '/servicios/comunidad-apoyo',          descripcion: 'Red exclusiva de migrantes y eventos mensuales.' },
  { icon: Plane,       titulo: 'Recogida en Aeropuerto',   link: '/servicios/recogida-aeropuerto',      descripcion: 'Traslado desde el aeropuerto a tu alojamiento.' },
  { icon: Globe,       titulo: 'Otros Países',             link: '/servicios/orientacion-otros-paises', descripcion: 'Orientación para migrar a otros países europeos.' },
];

export function SeccionServicios() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="servicios" className="section" style={{ background: 'var(--dark, #1b1d24)' }}>
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="section-tag">Lo que hacemos</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Acompañamiento integral para cada fase de tu proceso de migración a Suiza
          </p>
        </motion.div>

        {/* ── 3 Tarjetas destacadas ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {destacados.map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 15 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Link href={s.link} className="group block h-full">
                <div
                  className="h-full rounded-2xl p-6 flex flex-col transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    background: 'var(--surface-card, #161a20)',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderTop: `3px solid ${s.accentColor}`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${s.accentColor}40`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        color: s.tagColor,
                        background: `${s.tagColor}15`,
                        border: `1px solid ${s.tagColor}30`,
                      }}
                    >
                      {s.tag}
                    </span>
                  </div>

                  {/* Icono */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: s.iconBg }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: s.accentColor }} />
                  </div>

                  {/* Texto */}
                  <h3 className="font-bold text-white text-lg mb-2 leading-snug">{s.titulo}</h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{s.descripcion}</p>

                  {/* CTA */}
                  <div
                    className="mt-5 flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                    style={{ color: s.accentColor }}
                  >
                    Ver detalles
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Botón "Ver más servicios" ── */}
        <motion.div
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <button
            onClick={() => setExpanded(!expanded)}
            className="group flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            style={{
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#f59e0b';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.06)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
            {expanded ? 'Ocultar servicios' : `Ver los ${adicionales.length} servicios adicionales`}
          </button>
        </motion.div>

        {/* ── Grid expandible ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-2">
                {adicionales.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link href={s.link} className="group block">
                      <div
                        className="rounded-xl p-4 transition-all duration-200 group-hover:-translate-y-0.5"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.25)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                        }}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(245,158,11,0.1)' }}
                          >
                            <s.icon className="w-4 h-4 text-yellow-500" />
                          </div>
                          <span className="font-semibold text-white text-xs leading-tight">{s.titulo}</span>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{s.descripcion}</p>
                        <div className="mt-2.5 text-yellow-500/70 text-xs font-medium group-hover:text-yellow-500 transition-colors">
                          Ver más →
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Link catálogo completo ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Link
            href="/servicios"
            className="group inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c9a96e')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
          >
            Ver catálogo completo con precios
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
