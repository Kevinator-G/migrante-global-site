'use client';

import { motion } from 'framer-motion';
import { Search, Map, Rocket } from 'lucide-react';

export function SeccionMetodo() {
  const fases = [
    {
      numero: '01',
      icon: Search,
      titulo: 'Evaluación',
      descripcion:
        'Analizamos tu perfil, experiencia y objetivos. Definimos un plan personalizado para tu migración.',
      items: ['Revisión de perfil', 'Análisis de viabilidad', 'Plan personalizado'],
    },
    {
      numero: '02',
      icon: Map,
      titulo: 'Preparación',
      descripcion:
        'Te ayudamos a preparar toda la documentación y estrategia necesaria para tu llegada a Suiza.',
      items: ['CV formato suizo', 'Estrategia laboral', 'Guía de trámites'],
    },
    {
      numero: '03',
      icon: Rocket,
      titulo: 'Acompañamiento',
      descripcion:
        'Te apoyamos durante todo el proceso: desde tu llegada hasta tu adaptación completa.',
      items: ['Soporte continuo', 'Comunidad de apoyo', 'Sesiones 1:1'],
    },
  ];

  return (
    <section id="metodo" className="section bg-dark">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Nuestro <span className="text-gold">Método</span> en 3 Fases
          </h2>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Un proceso estructurado y probado para maximizar tus posibilidades de éxito
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {fases.map((fase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card relative"
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-gold to-red rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                {fase.numero}
              </div>
              <div className="mt-8">
                <div className="bg-gradient-to-br from-gold/20 to-red/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <fase.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{fase.titulo}</h3>
                <p className="text-bone/70 mb-6">{fase.descripcion}</p>
                <ul className="space-y-2">
                  {fase.items.map((item, i) => (
                    <li key={i} className="text-bone/80 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
