'use client';

import { Video } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function SesionesUnoAUnoPage() {
  return (
    <ServicioTemplate
      titulo="Sesiones 1:1"
      subtitulo="Sesiones personalizadas para resolver tus dudas específicas"
      icon={Video}
      problema={{
        titulo: '¿Por qué necesitas sesiones personalizadas?',
        descripcion:
          'Cada proceso de migración es único. Tienes dudas específicas sobre tu perfil, sector o situación que no se resuelven con información general. Las sesiones 1:1 te dan respuestas adaptadas a ti.',
      }}
      incluye={[
        'Sesiones de 45-60 minutos por videollamada',
        'Análisis personalizado de tu caso',
        'Respuestas a tus dudas específicas',
        'Plan de acción adaptado a tu situación',
        'Grabación de la sesión para que la revises',
        'Seguimiento por email después de la sesión',
      ]}
      noIncluye={[
        'No ofrecemos asesoría legal migratoria',
        'No gestionamos trámites en tu nombre',
        'No garantizamos resultados específicos',
        'Las sesiones se agendan con mínimo 48h de anticipación',
      ]}
      paraQuien={[
        'Personas con dudas muy específicas sobre su proceso',
        'Quienes necesitan orientación personalizada urgente',
        'Profesionales buscando estrategia laboral a medida',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional (€80/sesión).',
        estrategia: '2 sesiones incluidas, adicionales con descuento.',
        perfecto: 'Sesiones ilimitadas durante la suscripción.',
      }}
    />
  );
}
