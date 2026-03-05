'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  FileText,
  Briefcase,
  FileCheck,
  Languages,
  Plane,
  Users,
  Video,
  Globe,
} from 'lucide-react';

export function SeccionServicios() {
  const servicios = [
    {
      icon: Home,
      titulo: 'Gestión de Alojamiento',
      descripcion: 'Te ayudamos a encontrar y gestionar tu primer alojamiento en Suiza.',
      link: '/servicios/alojamiento',
      destacado: false,
    },
    {
      icon: FileText,
      titulo: 'CV Formato Suizo',
      descripcion: 'Adapta tu currículum a los estándares suizos para aumentar tus oportunidades.',
      link: '/servicios/cv-formato-suizo',
      destacado: true,
    },
    {
      icon: Briefcase,
      titulo: 'Orientación Laboral',
      descripcion: 'Guía personalizada para buscar empleo en el mercado laboral suizo.',
      link: '/servicios/orientacion-laboral',
      destacado: true,
    },
    {
      icon: FileCheck,
      titulo: 'Acompañamiento en Trámites',
      descripcion: 'Te guiamos en los trámites administrativos necesarios para tu migración.',
      link: '/servicios/tramites',
      destacado: false,
    },
    {
      icon: Languages,
      titulo: 'Clases de Alemán',
      descripcion: 'Clases personalizadas para aprender o mejorar tu nivel de alemán.',
      link: '/servicios/clases-aleman',
      destacado: false,
    },
    {
      icon: Plane,
      titulo: 'Recogida en Aeropuerto',
      descripcion: 'Servicio de recepción y traslado desde el aeropuerto a tu alojamiento.',
      link: '/servicios/recogida-aeropuerto',
      destacado: false,
    },
    {
      icon: Users,
      titulo: 'Comunidad de Apoyo',
      descripcion: 'Acceso exclusivo a nuestra comunidad de migrantes y eventos.',
      link: '/servicios/comunidad-apoyo',
      destacado: true,
    },
    {
      icon: Video,
      titulo: 'Sesiones 1:1',
      descripcion: 'Sesiones personalizadas para resolver tus dudas específicas.',
      link: '/servicios/sesiones-uno-a-uno',
      destacado: true,
    },
    {
      icon: Globe,
      titulo: 'Otros Países',
      descripcion: 'Orientación para procesos de migración a otros países europeos.',
      link: '/servicios/orientacion-otros-paises',
      destacado: false,
    },
  ];

  return (
    <section id="servicios" className="section bg-dark">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Acompañamiento integral para cada fase de tu proceso de migración a Suiza
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {servicios.map((servicio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={servicio.link} className="block h-full">
                <div
                  className={`card h-full ${
                    servicio.destacado
                      ? 'border-2 border-gold/30 bg-gradient-to-br from-dark to-gray'
                      : ''
                  }`}
                >
                  {servicio.destacado && (
                    <div className="text-xs font-semibold text-gold mb-2">✨ INCLUIDO EN PLANES</div>
                  )}
                  <div className="bg-gradient-to-br from-gold/20 to-red/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <servicio.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{servicio.titulo}</h3>
                  <p className="text-bone/70 text-sm">{servicio.descripcion}</p>
                  <div className="mt-4 text-gold text-sm font-semibold inline-flex items-center">
                    Ver más →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
