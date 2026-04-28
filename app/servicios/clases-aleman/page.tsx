'use client';

import { Languages } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function ClasesAlemanPage() {
  return (
    <ServicioTemplate
      id="clases-aleman"
      titulo="Alemán para Migrantes"
      subtitulo="Te conectamos con profesores certificados de alemán especializados en hispanohablantes"
      tagline="No es solo un idioma — es tu pasaporte a mejores oportunidades laborales y sociales en Suiza"
      icon={Languages}
      categoria="Idiomas e Integración"
      precio={0}
      moneda=""
      precioTipo="Consulta gratuita · te orientamos sin compromiso"
      valorMercado="Clases de alemán privadas en Suiza: €40–100/hora"
      problema={{
        titulo: '¿Por qué el alemán define tu futuro en Suiza?',
        descripcion:
          'Aunque hay regiones francófonas e italófonas, el alemán (Hochdeutsch) es clave para el mercado laboral suizo en la mayor parte del país. Sin un nivel básico funcional, accedes a empleos de menor calificación, te quedas fuera de networking real y la integración se vuelve aislante. El problema es que no todos los profesores entienden el contexto de un hispanohablante que migra — nosotros sí sabemos a quién recomendarte.',
      }}
      beneficios={[
        'Te conectamos con profesores certificados que entienden tu punto de partida como hispanohablante',
        'Profesores especializados en alemán para la vida y el trabajo en Suiza',
        'Orientación sobre qué nivel necesitas según tu sector profesional',
        'Preparación estructurada hacia certificaciones A1, A2 y B1',
        'Horarios flexibles adaptados a tu zona horaria actual',
      ]}
      incluye={[
        'Diagnóstico gratuito de tu nivel actual y objetivos',
        'Recomendación personalizada de profesor según tu perfil',
        'Orientación sobre plataformas y recursos gratuitos para empezar',
        'Guía de certificaciones necesarias según tu cantón y sector',
        'Seguimiento de tu progreso durante los primeros 30 días',
      ]}
      noIncluye={[
        'No damos clases directamente — somos intermediarios de confianza',
        'El costo de las clases lo acuerdas directamente con el profesor',
        'No incluye el costo de certificaciones oficiales (exámenes Goethe, TELC)',
        'No garantizamos plazas inmediatas — dependemos de disponibilidad',
      ]}
      paraQuien={[
        'Personas que quieren aprender alemán antes de mudarse a Suiza',
        'Migrantes en Suiza que necesitan mejorar rápido para el trabajo',
        'Profesionales que necesitan alemán para ascender o cambiar de sector',
      ]}
      foto="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1400&q=80"
      fotoAlt="Aprendizaje de idiomas alemán"
      planInfo={{
        inicio: 'Consulta gratuita — te orientamos y recomendamos el mejor profesor para tu caso.',
        estrategia: 'Incluido como servicio de orientación dentro del Pack Completo.',
        comunidad: 'Miembros de la comunidad tienen acceso a nuestra red de profesores con tarifas preferentes.',
      }}
    />
  );
}
