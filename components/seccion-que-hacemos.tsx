'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export function SeccionQueHacemos() {
  const queHacemos = [
    'Te orientamos en el proceso de búsqueda de empleo',
    'Adaptamos tu CV al formato suizo',
    'Te guiamos en los trámites administrativos',
    'Te conectamos con una comunidad de apoyo',
    'Te enseñamos cómo funciona el sistema suizo',
    'Te acompañamos en tu adaptación cultural',
  ];

  const queNoHacemos = [
    'No conseguimos empleos (no somos agencia de empleo)',
    'No gestionamos contratos laborales',
    'No somos inmobiliaria (te orientamos, no alquilamos)',
    'No gestionamos permisos de residencia (no somos asesoría legal)',
    'No garantizamos resultados (el éxito depende de ti)',
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
            Qué hacemos <span className="text-red-600">(y qué no)</span>
          </h2>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Transparencia ante todo. Queremos que sepas exactamente qué esperar de nuestros servicios.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Qué hacemos */}
          <motion.div
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.6 }}
            className="card bg-gradient-to-br from-green/10 to-dark border border-green/20"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-green" />
              Qué SÍ hacemos
            </h3>
            <ul className="space-y-4">
              {queHacemos.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-bone/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Qué NO hacemos */}
          <motion.div
            initial={{ x: 20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.6 }}
            className="card bg-gradient-to-br from-red/10 to-dark border border-red/20"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <XCircle className="w-7 h-7 text-red-600" />
              Qué NO hacemos
            </h3>
            <ul className="space-y-4">
              {queNoHacemos.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-bone/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
