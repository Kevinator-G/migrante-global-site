'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Instagram, Youtube } from 'lucide-react';

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
            Historias reales, <span className="text-yellow-500">en construcción</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Preferimos no publicar aquí nada que no puedas verificar. Cada testimonio
            que veas en esta sección será de alguien real que pasó por el proceso —
            mientras tanto, puedes ver conversaciones y contenido real en nuestras redes.
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
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/kevin.migranteglobal/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Migrante Global"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', color: GOLD }}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@migranteglobal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Migrante Global"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', color: GOLD }}
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            ¿Trabajaste con nosotros? Comparte tu historia —
            nos encantaría publicarla aquí con tu nombre real.
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
