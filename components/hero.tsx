'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/39919fa1-7821-4836-ab40-5c8f6e62b2e1.png"
            alt="Zurich, Suiza"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Tu camino a <span className="text-gold">Suiza</span>
            <br />
            empieza <span className="text-red-600">aquí</span>
          </h1>
          <p className="text-xl md:text-2xl text-bone/90 mb-8 max-w-3xl mx-auto">
            Acompañamiento profesional y honesto para tu proceso de migración.
            Sin promesas falsas, con transparencia total.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/#planes" className="btn-primary text-lg px-8 py-4">
              Ver Planes
            </Link>
            <Link href="/#calculadora" className="btn-secondary text-lg px-8 py-4">
              Calcular Salarios
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-bone/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-bone/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
