'use client';

import { Users } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function ComunidadApoyoPage() {
  return (
    <ServicioTemplate
      id="comunidad"
      titulo="Comunidad de Apoyo"
      subtitulo="Conecta con personas que ya han vivido lo que tú estás viviendo"
      tagline="Migrar en red es más fácil, más rápido y mucho menos solitario"
      icon={Users}
      categoria="Red y Comunidad"
      precio={17}
      moneda="€ / mes"
      precioTipo="Suscripción mensual · cancela cuando quieras"
      valorMercado="Membresías de comunidades para migrantes: €60–150/mes"
      problema={{
        titulo: '¿Por qué la comunidad es el recurso más infravalorodo en migración?',
        descripcion:
          'Migrar es profundamente solitario. El apoyo emocional, los contactos laborales, los tips prácticos del día a día — todo lo que antes venía de amigos y familia, ahora tienes que construirlo desde cero. Sin una red, el proceso es más largo, más duro y más costoso. Las personas que migran con comunidad llegan antes y llegan mejor.',
      }}
      beneficios={[
        'Acceso inmediato a una red de migrantes reales con experiencia en Suiza',
        'Eventos mensuales de networking online y (cuando es posible) presenciales',
        'Respuestas rápidas a dudas prácticas de personas que ya las vivieron',
        'Recursos, guías y actualizaciones sobre vida en Suiza compartidos en tiempo real',
        'Descuentos en servicios adicionales de Migrante Global',
      ]}
      incluye={[
        'Acceso al grupo privado de WhatsApp/Telegram de la comunidad',
        'Eventos mensuales de networking (online y presenciales cuando aplica)',
        'Conexión con migrantes latinos en Suiza y en proceso de mudarse',
        'Recursos compartidos: guías, contactos, actualizaciones por cantón',
        'Soporte emocional y motivacional dentro del grupo',
        'Descuentos del 15–20% en servicios adicionales de Migrante Global',
      ]}
      noIncluye={[
        'No garantizamos empleo a través de los contactos de la comunidad',
        'No ofrecemos terapia psicológica — somos una comunidad de pares, no clínicos',
        'Los eventos presenciales pueden tener costo adicional de acceso',
        'No organizamos eventos fuera de Suiza',
      ]}
      paraQuien={[
        'Personas que ya están en Suiza y se sienten solas o aisladas',
        'Quienes buscan networking genuino en el entorno suizo',
        'Personas planificando migrar que quieren hacer contactos antes de llegar',
      ]}
      planInfo={{
        inicio: 'Acceso de prueba durante 30 días incluido con el plan.',
        estrategia: 'Acceso durante 3 meses incluido dentro del Pack Completo.',
        comunidad: 'Este servicio es el núcleo del plan Comunidad (17€/mes).',
      }}
    />
  );
}
