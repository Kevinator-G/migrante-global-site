'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    pregunta: '¿Necesito hablar alemán para trabajar en Suiza?',
    respuesta:
      'Depende del sector. En hostelería, construcción, logística y algunos trabajos técnicos puedes empezar sin alemán. Para oficina, salud o educación necesitas mínimo A2-B1. Lo primero que hacemos contigo es identificar tu sector y qué nivel real necesitas.',
  },
  {
    pregunta: '¿Cuánto tiempo tarda conseguir trabajo desde fuera de Suiza?',
    respuesta:
      'El proceso realista es 2–6 meses desde que empiezas a buscar en serio. Factores clave: tu profesión, nivel de alemán, red de contactos y si tienes el CV adaptado al formato suizo. Con orientación correcta se acorta bastante.',
  },
  {
    pregunta: '¿Qué permiso de residencia necesito para trabajar en Suiza?',
    respuesta:
      'Los ciudadanos de la UE/AELC tienen acceso simplificado mediante el Acuerdo de Libre Circulación. Si tienes contrato de trabajo, el permiso B (residencia temporal) se tramita en la oficina de migración de tu cantón. Para no comunitarios el proceso es más complejo.',
  },
  {
    pregunta: '¿Cuánto cuesta vivir en Suiza?',
    respuesta:
      'Un soltero en Zúrich necesita entre 2.500 y 3.500 CHF/mes para vivir cómodamente (alquiler, comida, transporte, seguros). El salario mínimo sectorial suele superar los 3.500–4.500 CHF, así que la ecuación funciona si tienes trabajo.',
  },
  {
    pregunta: '¿Puedo contratar vuestros servicios desde Latinoamérica?',
    respuesta:
      'Sí, todos nuestros servicios son 100% remotos. Trabajamos con personas desde España, México, Colombia, Argentina y el resto de Latinoamérica. Las sesiones son por videollamada y los documentos se revisan online.',
  },
  {
    pregunta: '¿Qué diferencia a Migrante Global de otras asesorías?',
    respuesta:
      'No somos una agencia — soy Kevin, una persona real que vivió el proceso. Llevo más de 10 años en Europa y 3 en Suiza. No te vendo un sueño: te doy orientación honesta, incluyendo cuándo Suiza no es la mejor opción para tu caso.',
  },
];

export function SeccionFaq() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section className="section" style={{ background: '#0e1014' }}>
      <div className="max-w-[780px] mx-auto px-6">
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="section-tag">Preguntas frecuentes</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dudas que todos <span className="text-yellow-500">tienen</span>
          </h2>
          <p className="text-white/55 text-lg">
            Respuestas directas, sin rodeos.
          </p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
            >
              <button
                onClick={() => setAbierto(abierto === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-white/85 text-sm leading-snug">{faq.pregunta}</span>
                <motion.span
                  animate={{ rotate: abierto === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-yellow-500" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {abierto === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">
                      {faq.respuesta}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
