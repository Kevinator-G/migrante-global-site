'use client';

import { Briefcase } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function OrientacionLaboralPage() {
  return (
    <ServicioTemplate
      titulo="Orientación Laboral"
      subtitulo="Guía personalizada para buscar empleo en el mercado laboral suizo"
      icon={Briefcase}
      problema={{
        titulo: '¿Por qué es tan difícil encontrar empleo en Suiza?',
        descripcion:
          'El mercado laboral suizo es exigente, competitivo y muy diferente a otros países. Sin conocer las plataformas correctas, el idioma o las expectativas culturales, es fácil perderse. Te ayudamos a navegar este proceso.',
      }}
      incluye={[
        'Análisis de tu perfil profesional y viabilidad',
        'Estrategia personalizada de búsqueda de empleo',
        'Listado de portales de empleo y recursos clave',
        'Consejos sobre networking y LinkedIn en Suiza',
        'Preparación para entrevistas (cultural y técnica)',
        'Seguimiento durante 60 días',
      ]}
      noIncluye={[
        'No somos agencia de empleo (no conseguimos trabajo)',
        'No contactamos empresas en tu nombre',
        'No garantizamos ofertas de trabajo',
        'No gestionamos visados laborales',
      ]}
      paraQuien={[
        'Profesionales buscando trabajo en Suiza desde su país',
        'Personas que ya están en Suiza pero no encuentran empleo',
        'Quienes quieren entender cómo funciona el mercado laboral suizo',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional.',
        estrategia: 'Incluido completamente con seguimiento de 60 días.',
        perfecto: 'Incluido con sesiones 1:1 adicionales y soporte extendido.',
      }}
    />
  );
}
