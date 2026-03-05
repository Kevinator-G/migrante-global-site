'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Star, Zap } from 'lucide-react';

export function SeccionPrecios() {
  const planes = [
    {
      nombre: 'Solo Alojamiento',
      precio: '780',
      moneda: 'CHF',
      tipo: 'Pago único',
      descripcion: 'Servicio puntual',
      destacado: false,
      icon: Check,
      caracteristicas: [
        'Asesoría para encontrar alojamiento',
        'Guía de búsqueda de vivienda',
        'Revisión de contratos de alquiler',
        'Orientación sobre zonas y costos',
        'Soporte durante 30 días',
      ],
    },
    {
      nombre: 'Pack Completo',
      precio: '1,280',
      moneda: 'CHF',
      tipo: 'Pago único',
      descripcion: 'Reubicación integral',
      destacado: true,
      icon: Star,
      caracteristicas: [
        'Todo lo de Solo Alojamiento',
        'CV adaptado al formato suizo',
        'Estrategia de búsqueda de empleo',
        'Guía completa de trámites',
        'Acceso a comunidad durante 3 meses',
        '2 sesiones personalizadas 1:1',
        'Soporte prioritario 90 días',
      ],
    },
    {
      nombre: 'Comunidad',
      precio: '80',
      moneda: 'CHF',
      tipo: 'Suscripción mensual',
      descripcion: 'Sin permanencia',
      destacado: false,
      icon: Zap,
      caracteristicas: [
        'Acceso a comunidad exclusiva',
        'Eventos mensuales de networking',
        'Recursos y guías actualizadas',
        'Descuentos en servicios adicionales',
        'Cancela cuando quieras',
      ],
    },
  ];

  return (
    <section id="planes" className="section bg-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Planes y <span className="text-gold">Precios</span>
          </h2>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu situación y necesidades
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {planes.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`card relative ${
                plan.destacado
                  ? 'border-2 border-gold bg-gradient-to-br from-dark via-gray to-dark scale-105'
                  : 'border border-gray/30'
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold to-red px-6 py-2 rounded-full text-black font-bold text-sm shadow-lg">
                  🌟 MÁS POPULAR
                </div>
              )}

              <div className="text-center mb-6 mt-2">
                <div className="bg-gradient-to-br from-gold/20 to-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.nombre}</h3>
                <p className="text-bone/60 text-sm mb-4">{plan.descripcion}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gold">{plan.precio}</span>
                  <span className="text-bone/70 ml-2">{plan.moneda}</span>
                </div>
                <p className="text-bone/50 text-sm">{plan.tipo}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.caracteristicas.map((caracteristica, i) => (
                  <li key={i} className="flex items-start gap-3 text-bone/80 text-sm">
                    <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                    <span>{caracteristica}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/#contacto"
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
                  plan.destacado
                    ? 'bg-gradient-to-r from-gold to-red text-black hover:shadow-lg hover:scale-105'
                    : 'bg-gray text-bone hover:bg-gold hover:text-black'
                }`}
              >
                Comenzar Ahora
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-bone/60 text-sm">
            * Todos los precios son en francos suizos (CHF). Servicios adicionales disponibles bajo demanda.
          </p>
          <p className="text-bone/50 text-xs mt-2">
            No garantizamos empleo, residencia ni aprobación de trámites. Ofrecemos orientación y acompañamiento.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
