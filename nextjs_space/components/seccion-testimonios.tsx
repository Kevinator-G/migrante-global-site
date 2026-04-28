'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonios: {
  nombre: string;
  pais: string;
  texto: string;
  servicio: string;
  estrellas: number;
}[] = [];

export function SeccionTestimonios() {
  return (
    <section className="section bg-[#0e1014]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-tag">Testimonios reales</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Personas que ya <span className="text-yellow-500">dieron el paso</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Historias reales de migrantes hispanohablantes que trabajaron con nosotros.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 px-6 rounded-2xl border border-white/5"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex justify-center gap-1 mb-5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className="w-6 h-6 text-yellow-500/30 fill-yellow-500/30" />
            ))}
          </div>
          <h3 className="text-white/70 text-lg font-semibold mb-3">
            Sé el primero en compartir tu experiencia
          </h3>
          <p className="text-white/35 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Estamos comenzando. Si has trabajado con nosotros o seguido nuestro contenido,
            nos encantaría escuchar tu historia.
          </p>
          <a
            href="mailto:hola@migranteglobal.ch?subject=Mi experiencia con Migrante Global"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: '#c9a96e',
            }}
          >
            Compartir mi experiencia →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
