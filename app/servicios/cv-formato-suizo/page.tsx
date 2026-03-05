'use client';

import { FileText } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function CVFormatoSuizoPage() {
  return (
    <ServicioTemplate
      titulo="CV Formato Suizo"
      subtitulo="Adapta tu currículum a los estándares suizos para aumentar tus oportunidades"
      icon={FileText}
      problema={{
        titulo: '¿Por qué tu CV actual no funciona en Suiza?',
        descripcion:
          'El mercado laboral suizo valora la precisión, la estructura y la adaptación cultural. Un CV latinoamericano o español no tiene el formato esperado, lo que reduce tus posibilidades. Te enseñamos a adaptarlo correctamente.',
      }}
      incluye={[
        'Revisión completa de tu CV actual',
        'Adaptación al formato suizo estándar',
        'Optimización de descripción de experiencias',
        'Traducción de títulos y cargos al contexto suizo',
        'Consejos sobre foto, estructura y longitud',
        '1 revisión adicional incluida',
      ]}
      noIncluye={[
        'No escribimos tu CV desde cero (debes tener uno base)',
        'No garantizamos entrevistas ni empleo',
        'No traducimos el CV completo a alemán/francés (solo orientamos)',
        'No ofrecemos servicio de carta de presentación (se cotiza aparte)',
      ]}
      paraQuien={[
        'Profesionales que quieren aplicar a empleos en Suiza',
        'Personas con experiencia pero sin formato adecuado',
        'Quienes han enviado CVs sin resultados y necesitan mejorar',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional.',
        estrategia: 'Incluido completamente en este plan con 1 revisión adicional.',
        perfecto: 'Incluido con revisiones ilimitadas durante 3 meses.',
      }}
    />
  );
}
