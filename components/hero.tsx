'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Globe, Star } from 'lucide-react';

const stats = [
  { icon: Users, value: '150+', label: 'Personas orientadas' },
  { icon: Globe, value: '10+', label: 'Países destino' },
  { icon: Star, value: '3 años', label: 'De experiencia' },
];

export function Hero() {
  return (
    <section data-hero="true" className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src="/20260402_150057.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Fallback image si el vídeo no carga */}
        <Image
          src="/zurich-ch-hero.ffeOwgdK.webp"
          alt="Vista aérea de Zúrich, Suiza al atardecer"
          fill
          className="object-cover object-center -z-10"
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
            Acompañamiento profesional y honesto para tu proceso de migración.
            <br className="hidden md:block" />
            Sin promesas falsas, con transparencia total.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-14">
            <Link
              href="/#contacto"
              className="btn-primary text-base font-semibold px-8 py-4 min-w-[200px] text-center"
            >
              Agenda tu consulta
            </Link>
            <Link
              href="/#planes"
              className="btn-secondary text-base font-semibold px-8 py-4 min-w-[200px] text-center"
            >
              Ver Planes
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
