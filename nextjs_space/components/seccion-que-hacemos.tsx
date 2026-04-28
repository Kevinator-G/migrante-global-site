'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, BookOpen, Lock, MessageSquare } from 'lucide-react';

export function SeccionQueHacemos() {
  const compromisos = [
    { icon: Clock, titulo: 'Respuesta en 48h', desc: 'Cada mensaje recibe respuesta dentro de 48 horas laborables.' },
    { icon: BookOpen, titulo: 'Información actualizada', desc: 'Revisamos y actualizamos los datos sobre Suiza de forma constante.' },
    { icon: Lock, titulo: 'Confidencialidad', desc: 'Tus datos y tu historia se quedan entre tú y nosotros.' },
    { icon: MessageSquare, titulo: 'Soporte humano real', desc: 'Hablas con personas, no con bots ni respuestas automáticas.' },
  ];

  const queHacemos = [
    'Estrategia personalizada para encontrar empleo en el mercado suizo',
    'Adaptamos tu CV al formato que abren los reclutadores suizos',
    'Te guiamos paso a paso en los trámites de llegada y adaptación',
    'Acceso a una comunidad real de migrantes que ya están allá',
    'Te explicamos cómo funciona el sistema suizo desde adentro',
    'Acompañamiento desde antes de salir hasta que estés instalado',
  ];

  return (
    <section className="section bg-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Cómo te <span className="text-yellow-500">acompañamos</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Cada servicio está diseñado para una etapa concreta de tu proceso migratorio.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {queHacemos.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-white/75 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compromisos de calidad */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-center text-xl font-bold mb-8 text-bone/90">
            Nuestros compromisos contigo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {compromisos.map((c, i) => (
              <div
                key={i}
                className="rounded-xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.12)' }}
                >
                  <c.icon className="w-5 h-5" style={{ color: '#c9a96e' }} />
                </div>
                <div className="font-bold text-white text-sm mb-1">{c.titulo}</div>
                <div className="text-white/50 text-xs leading-snug">{c.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
