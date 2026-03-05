'use client';

import { Globe } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function OrientacionOtrosPaisesPage() {
  return (
    <ServicioTemplate
      titulo="Orientación para Otros Países"
      subtitulo="Orientación para procesos de migración a otros países europeos"
      icon={Globe}
      problema={{
        titulo: '¿Por qué considerar otros países europeos?',
        descripcion:
          'Suiza no es para todos: costo de vida alto, idiomas complejos, competencia laboral. Alemania, Países Bajos, Austria o Portugal pueden ser mejores opciones según tu perfil. Te orientamos sobre alternativas.',
      }}
      incluye={[
        'Análisis de viabilidad para otros países UE',
        'Comparativa de mercados laborales y costos de vida',
        'Orientación sobre requisitos de migración',
        'Recursos y contactos en otros países',
        'Recomendación personalizada según tu perfil',
        '1 sesión de consultoría incluida',
      ]}
      noIncluye={[
        'No gestionamos visados ni permisos (solo orientamos)',
        'No ofrecemos servicios de reubicación en otros países (aún)',
        'No garantizamos empleo en otros destinos',
        'Este servicio está en fase beta (información limitada)',
      ]}
      paraQuien={[
        'Personas considerando Suiza pero abiertas a alternativas',
        'Quienes no califican para Suiza pero sí para otros países UE',
        'Profesionales buscando el mejor país según su sector',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional (próximamente).',
        estrategia: 'Consulta incluida con análisis comparativo.',
        perfecto: 'Orientación completa con seguimiento y recursos.',
      }}
    />
  );
}
