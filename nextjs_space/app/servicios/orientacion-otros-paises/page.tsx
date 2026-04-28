'use client';

import { Globe } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function OrientacionOtrosPaisesPage() {
  return (
    <ServicioTemplate
      id="orientacion-otros-paises"
      titulo="Orientación para Otros Países"
      subtitulo="¿Suiza no es tu opción? Te ayudamos a encontrar el país que sí lo es"
      tagline="Alemania, Austria, Países Bajos, Portugal — cada país tiene su propio camino"
      icon={Globe}
      categoria="Migración Europea"
      precio={147}
      moneda="€"
      precioTipo="Pago único · incluye 1 sesión de consultoría"
      valorMercado="Consultoría de migración comparativa en Europa: €200–400"
      problema={{
        titulo: '¿Por qué Suiza no es la única opción — ni siempre la mejor?',
        descripcion:
          'Suiza tiene uno de los costos de vida más altos de Europa, idiomas complejos, y una competencia laboral muy exigente. Para muchos perfiles — especialmente jóvenes, técnicos, o personas sin experiencia previa en Europa — Alemania, Austria, Países Bajos o Portugal pueden ser destinos más accesibles, con mercados laborales igual de sólidos y procesos de visa más claros. No migres al país que todos mencionan — migra al que funciona para ti.',
      }}
      beneficios={[
        'Análisis comparativo de 4–6 países según tu perfil, sector y situación familiar',
        'Información real sobre mercados laborales, costos de vida y calidad migratoria',
        'Orientación sobre requisitos de visa y permisos de trabajo en cada destino',
        'Recomendación personalizada con justificación clara y honesta',
        '1 sesión de consultoría 1:1 incluida para resolver tus dudas en profundidad',
      ]}
      incluye={[
        'Análisis de viabilidad para Alemania, Austria, Países Bajos, Portugal y Suiza',
        'Comparativa de mercados laborales, salarios y costos de vida por país',
        'Orientación sobre requisitos básicos de migración por destino',
        'Recomendación personalizada según tu perfil profesional y objetivos',
        '1 sesión de consultoría 1:1 incluida (60 minutos)',
        'Recursos y contactos de referencia para los países recomendados',
      ]}
      noIncluye={[
        'No gestionamos visados ni permisos — solo orientación y contexto',
        'No ofrecemos servicios de reubicación en otros países (aún en desarrollo)',
        'No garantizamos empleo en ningún destino europeo',
        'La información de países fuera de Suiza está en expansión — puede ser limitada',
      ]}
      paraQuien={[
        'Personas considerando Suiza pero abiertas a explorar alternativas más accesibles',
        'Quienes no califican para Suiza pero sí podrían calificar para otros países UE',
        'Profesionales buscando el país europeo que mejor se adapta a su sector',
      ]}
      planInfo={{
        inicio: 'Disponible como servicio adicional (actualmente en desarrollo para más países).',
        estrategia: 'Consulta comparativa incluida con análisis de alternativas a Suiza.',
        comunidad: 'Acceso a recursos y testimonios de migrantes en otros países europeos.',
      }}
    />
  );
}
