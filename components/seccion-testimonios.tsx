'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonios = [
  {
    nombre: 'Andrés M.',
    pais: '🇨🇴 Colombia → 🇨🇭 Suiza',
    texto:
      'Llegué a Zúrich sin conocer a nadie. Migrante Global me ayudó a entender el sistema, adaptar mi CV y encontrar las primeras ofertas laborales. En 4 meses ya tenía empleo.',
    servicio: 'Pack Completo',
    estrellas: 5,
  },
  {
    nombre: 'Valeria R.',
    pais: '🇲🇽 México → 🇨🇭 Suiza',
    texto:
      'Lo que más valoro es que me explicaron exactamente cómo funciona el mercado suizo, los sectores donde hay más oportunidades y cómo presentarme. Esa claridad fue lo que me dio confianza para dar el paso.',
    servicio: 'Sesiones 1:1',
    estrellas: 5,
  },
  {
    nombre: 'Diego F.',
    pais: '🇦🇷 Argentina → 🇨🇭 Suiza',
    texto:
      'La calculadora de salarios y la orientación laboral me abrieron los ojos. Sabía exactamente cuánto pedir y en qué sectores enfocarme. Un antes y un después en mi proceso.',
    servicio: 'Orientación Laboral',
    estrellas: 5,
  },
  {
    nombre: 'Carolina T.',
    pais: '🇻🇪 Venezuela → 🇨🇭 Suiza',
    texto:
      'La comunidad de apoyo fue fundamental. Poder hablar con personas que ya habían pasado por lo mismo fue invaluable. No me sentí sola en ningún momento del proceso.',
    servicio: 'Comunidad',
    estrellas: 5,
  },
];

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

        <div className="grid md:grid-cols-2 gap-6">
          {testimonios.map((t, i) => (
            <motion.div
              key={i}
              initial={{ y: 15 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="card border border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition-colors duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-yellow-500/10 group-hover:text-yellow-500/20 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.estrellas }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-white/80 text-[15px] leading-relaxed mb-6 italic">
                &ldquo;{t.texto}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{t.nombre}</div>
                  <div className="text-sm text-white/50 mt-0.5">{t.pais}</div>
                </div>
                <span className="text-xs bg-red-600/15 text-red-400 border border-red-600/20 px-3 py-1 rounded-full font-medium">
                  {t.servicio}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ y: 5 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-white/30 text-sm mt-10"
        >
          * Nombres abreviados por privacidad. Casos reales de clientes de Migrante Global.
        </motion.p>
      </div>
    </section>
  );
}
