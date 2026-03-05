'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SeccionCTA() {
  return (
    <section className="section bg-gradient-to-br from-black via-dark to-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para dar el <span className="text-gold">primer paso</span>?
          </h2>
          <p className="text-xl text-bone/80 mb-8 max-w-2xl mx-auto">
            Miles de personas han migrado a Suiza. Tú puedes ser el siguiente. Déjanos ayudarte a
            hacerlo bien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#contacto"
              className="btn-primary text-lg px-10 py-4 flex items-center gap-2 group"
            >
              Contactar Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="/#planes" className="btn-secondary text-lg px-10 py-4">
              Ver Planes
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
