'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

const garantias = [
  'Orientación honesta, sin promesas vacías',
  'Personas reales que han migrado a Suiza',
  'Respuesta en menos de 24 horas',
];

export function SeccionCTA() {
  return (
    <section className="section bg-gradient-to-br from-red-950/40 via-black to-black border-t border-red-900/20">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* AIDA: Atención */}
          <span className="inline-block text-red-500 text-sm font-semibold tracking-widest uppercase mb-4">
            El momento de actuar es ahora
          </span>

          {/* AIDA: Interés */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            ¿Sigues postergando tu{' '}
            <span className="text-yellow-500">decisión</span>?
          </h2>

          {/* AIDA: Deseo */}
          <p className="text-xl text-white/70 mb-6 max-w-2xl mx-auto">
            Cada mes que esperas es un mes menos de salario suizo, una oportunidad que alguien más toma.
            La migración no se improvisa — <strong className="text-white">se planifica.</strong>
          </p>

          {/* Garantías */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            {garantias.map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{g}</span>
              </div>
            ))}
          </div>

          {/* AIDA: Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#contacto"
              className="btn-primary text-lg px-10 py-4 flex items-center gap-2 group"
            >
              Quiero orientación ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="/#planes" className="btn-secondary text-lg px-10 py-4">
              Ver Planes y Precios
            </Link>
          </div>

          <p className="text-white/30 text-sm mt-6">
            Consulta inicial gratuita · Sin compromiso · Respuesta en 24h
          </p>
        </motion.div>
      </div>
    </section>
  );
}
