'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Shield } from 'lucide-react';

export function SeccionValidacion() {
  const valores = [
    {
      icon: Heart,
      titulo: 'Entendemos tu situación',
      descripcion: 'Migrar no es solo papeleo. Es dejar atrás familia, amigos y lo conocido. Te acompañamos en cada paso.',
    },
    {
      icon: Users,
      titulo: 'Experiencia real',
      descripcion: 'Hemos vivido el proceso de migración. Sabemos qué funciona y qué no. Sin teoría, solo práctica.',
    },
    {
      icon: Shield,
      titulo: 'Transparencia total',
      descripcion: 'No prometemos empleos ni residencia. Te guiamos, orientamos y acompañamos. El resto depende de ti.',
    },
  ];

  return (
    <section className="section bg-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por qué <span className="text-gold">confiarnos</span> tu proceso
          </h2>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            No somos una agencia más. Somos personas que han migrado y quieren ayudarte a hacerlo bien.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {valores.map((valor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card text-center"
            >
              <div className="bg-gradient-to-br from-gold/20 to-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <valor.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{valor.titulo}</h3>
              <p className="text-bone/70">{valor.descripcion}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
