'use client';

import { Video } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function SesionesUnoAUnoPage() {
  return (
    <ServicioTemplate
      id="sesiones-1-1"
      titulo="Sesiones 1:1"
      subtitulo="Consultoría personalizada para resolver tus dudas específicas de migración"
      tagline="60 minutos de atención directa, sin guiones, sin respuestas genéricas"
      icon={Video}
      categoria="Consultoría Personal"
      precio={120}
      moneda="€ / sesión"
      precioTipo="Por sesión de 60 minutos · agendamiento en 48h"
      valorMercado="Consultoría de migración en Europa: €200–350/sesión"
      problema={{
        titulo: '¿Por qué necesitas orientación personalizada?',
        descripcion:
          'Cada proceso de migración es distinto. Tienes dudas específicas sobre tu perfil, tu sector, tu situación familiar o tu momento. La información general en internet no responde a tu caso concreto. Una sesión contigo permite dar respuestas reales a preguntas reales — no plantillas.',
      }}
      beneficios={[
        'Respuestas adaptadas exactamente a tu perfil y situación actual',
        'Plan de acción concreto que puedes ejecutar desde el día siguiente',
        'Ahorro de meses de búsqueda de información contradictoria',
        'Grabación de la sesión para que puedas revisarla cuando quieras',
        'Seguimiento por email post-sesión incluido sin coste adicional',
      ]}
      incluye={[
        'Sesión de 60 minutos por videollamada (Zoom / Google Meet)',
        'Análisis personalizado de tu caso antes de la llamada',
        'Respuestas directas a tus preguntas prioritarias',
        'Plan de acción escrito y enviado por email',
        'Grabación de la sesión (previa autorización)',
        'Soporte por email durante 15 días post-sesión',
      ]}
      noIncluye={[
        'No ofrecemos asesoría legal migratoria — solo orientación práctica',
        'No gestionamos trámites ni papelería en tu nombre',
        'No garantizamos resultados específicos de empleo o residencia',
        'Las sesiones requieren agendar con mínimo 48h de anticipación',
      ]}
      paraQuien={[
        'Personas con dudas muy específicas que el contenido general no responde',
        'Quienes están en un momento clave de decisión (¿me voy? ¿cuándo? ¿cómo?)',
        'Profesionales que quieren una estrategia de migración a medida',
      ]}
      foto="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1400&q=80"
      fotoAlt="Consulta personalizada por videollamada"
      planInfo={{
        inicio: 'Disponible como servicio individual a 120€/sesión.',
        estrategia: '2 sesiones incluidas en el plan, adicionales con descuento del 20%.',
        comunidad: 'Sesiones con descuento del 15% para miembros activos.',
      }}
    />
  );
}
