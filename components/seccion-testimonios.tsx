'use client';

import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';

const GOLD = '#c9a96e';

// Agregar testimonios reales aquí cuando estén disponibles
const testimonios: {
  nombre: string;
  pais: string;
  texto: string;
  servicio: string;
  estrellas: number;
}[] = [];

export function SeccionTestimonios() {
  if (testimonios.length > 0) {
    return null; // activar renderizado completo cuando haya datos reales
  }

  return (
    <section className="section bg-[#0e1014]">
      <div className="max-w-[720px] mx-auto px-6 text-center">

        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="section-tag">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            150+ personas ya <span className="text-yellow-500">dieron el paso</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Estamos recopilando historias reales. Si pasaste por el proceso con Kevin,
            tu experiencia puede ayudar a alguien más a decidirse.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex flex-col items-center gap-5 rounded-2xl px-10 py-8"
          style={{
            background: 'rgba(201,169,110,0.05)',
            border: '1px solid rgba(201,169,110,0.18)',
          }}
        >
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            ¿Trabajaste con nosotros? Comparte tu historia —
            nos encantaría publicarla aquí.
          </p>
          <a
            href="mailto:hola@migranteglobal.ch?subject=Mi experiencia con Migrante Global"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: GOLD,
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Compartir mi historia
          </a>
        </motion.div>

      </div>
    </section>
  );
}
