'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Users, MapPin, Clock, ArrowRight } from 'lucide-react';

const stats = [
  { icon: Users,  value: '150+',    label: 'Personas acompañadas' },
  { icon: MapPin, value: '3+ años', label: 'Viviendo en Suiza'     },
  { icon: Clock,  value: '48 h',    label: 'Tiempo de respuesta'   },
];

export function Hero() {
  return (
    <section data-hero="true" className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/zurich-ch-hero.ffeOwgdK.webp"
          alt="Vista aérea de Zúrich, Suiza al atardecer"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Capa 1: degradado vertical base */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/90"></div>
        {/* Capa 2: oscurecimiento radial en el centro donde vive el título */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0.50) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.7)' }}
          >
            Tu camino a <span className="text-yellow-400">Suiza</span>
            <br />
            empieza <span className="text-red-500">aquí</span>
          </h1>
          <p
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}
          >
            Acompañamiento real de alguien que ya vivió el proceso.{' '}
            <br className="hidden md:block" />
            Más de 10 años en Europa, 3 años viviendo y trabajando en Suiza.
          </p>

          {/* Bundling tagline */}
          <p className="text-white/80 text-sm mb-8 tracking-wide" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
            Empleo · Alojamiento · Alemán · Trámites — todo en un solo lugar
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 mb-14">
            <Link
              href="/#contacto"
              className="btn-primary text-base font-semibold px-10 py-4 min-w-[260px] text-center"
            >
              Agenda tu consulta gratuita
            </Link>
            <Link
              href="/#planes"
              className="flex items-center gap-1.5 text-white/50 hover:text-yellow-400 transition-colors duration-200 text-sm font-medium"
            >
              Ver planes y precios <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto border border-white/10 rounded-2xl bg-black/40 backdrop-blur-sm px-6 py-5"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-1">
                  <stat.icon className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"></div>
      </motion.div>
    </section>
  );
}
