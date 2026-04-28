'use client';

import { motion } from 'framer-motion';
import { Star, Youtube, MessageCircle, ArrowRight } from 'lucide-react';

const GOLD = '#c9a96e';

// Placeholder para testimonios reales — agregar cuando estén disponibles
const testimonios: {
  nombre: string;
  pais: string;
  texto: string;
  servicio: string;
  estrellas: number;
}[] = [];

export function SeccionTestimonios() {
  if (testimonios.length > 0) {
    // Renderizado completo con tarjetas — activar cuando haya testimonios reales
    return null;
  }

  return (
    <section className="section bg-[#0e1014]">
      <div className="max-w-[1200px] mx-auto px-6">

        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-tag">Comunidad real</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Más de <span className="text-yellow-500">150 personas</span> ya dieron el paso
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Cada semana acompañamos a hispanohablantes que deciden migrar a Suiza con
            información real, sin promesas vacías.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Proof via YouTube */}
          <motion.a
            href="https://www.youtube.com/@migranteglobal"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 15 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6 }}
            className="group flex flex-col justify-between rounded-2xl p-7 border border-white/[0.07] hover:border-[#c9a96e]/30 transition-all duration-300 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)' }}
                >
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">YouTube · @migranteglobal</div>
                  <div className="text-white/40 text-xs">La comunidad habla por nosotros</div>
                </div>
              </div>
              <p className="text-white/65 text-sm leading-relaxed">
                Miles de personas siguen el canal para aprender sobre la vida real en Suiza.
                Los comentarios de cada video reflejan la experiencia de nuestra comunidad —
                sin editar, sin filtrar.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 text-sm font-semibold group-hover:gap-3 transition-all duration-200" style={{ color: GOLD }}>
              Ver comentarios en YouTube <ArrowRight className="w-4 h-4" />
            </div>
          </motion.a>

          {/* Invitación a compartir */}
          <motion.div
            initial={{ y: 15 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl p-7"
            style={{
              background: 'rgba(201,169,110,0.04)',
              border: '1px solid rgba(201,169,110,0.18)',
            }}
          >
            <div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                ¿Trabajaste con nosotros?
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Si pasaste por el proceso con Kevin, tu historia puede ayudar a alguien más
                a tomar la decisión correcta. Nos encantaría escucharte.
              </p>
            </div>
            <a
              href="mailto:hola@migranteglobal.ch?subject=Mi experiencia con Migrante Global"
              className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 w-fit"
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
      </div>
    </section>
  );
}
