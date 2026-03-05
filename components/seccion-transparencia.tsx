'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Heart } from 'lucide-react';

export function SeccionTransparencia() {
  return (
    <section className="section bg-dark">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-gold" />
            <h2 className="text-4xl font-bold">Transparencia Total</h2>
          </div>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Lo que necesitas saber antes de contratar nuestros servicios
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card bg-gradient-to-br from-red/10 to-dark border border-red/20"
          >
            <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">No Somos Agencia</h3>
            <p className="text-bone/70 text-sm">
              No conseguimos empleos, no somos inmobiliaria, no gestionamos permisos legales. Solo
              orientamos y acompañamos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card bg-gradient-to-br from-gold/10 to-dark border border-gold/20"
          >
            <Shield className="w-10 h-10 text-gold mb-4" />
            <h3 className="text-xl font-bold mb-3">Sin Garantías</h3>
            <p className="text-bone/70 text-sm">
              No garantizamos empleo, residencia ni aprobación de trámites. El éxito depende de tu
              preparación, experiencia y esfuerzo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card bg-gradient-to-br from-green/10 to-dark border border-green/20"
          >
            <Heart className="w-10 h-10 text-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Con Honestidad</h3>
            <p className="text-bone/70 text-sm">
              Te diremos la verdad, incluso si no es lo que quieres escuchar. Mejor una realidad dura
              que una promesa falsa.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 card bg-gradient-to-r from-dark to-gray border border-bone/10"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Compromiso de Calidad
          </h3>
          <div className="text-bone/70 space-y-2 text-sm">
            <p>
              • <strong>Respuestas en 48h:</strong> Contestamos tus dudas en un máximo de 2 días
              hábiles.
            </p>
            <p>
              • <strong>Información actualizada:</strong> Nuestros recursos se actualizan
              continuamente.
            </p>
            <p>
              • <strong>Confidencialidad:</strong> Tu información personal está protegida y nunca se
              comparte.
            </p>
            <p>
              • <strong>Soporte real:</strong> Hablamos contigo, no con bots ni respuestas
              automáticas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
