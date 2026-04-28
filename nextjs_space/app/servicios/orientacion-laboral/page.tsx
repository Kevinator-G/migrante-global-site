'use client';

import { Briefcase } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function OrientacionLaboralPage() {
  return (
    <ServicioTemplate
      id="orientacion-laboral"
      titulo="Orientación Laboral"
      subtitulo="Guía personalizada para entrar al mercado laboral suizo con estrategia real"
      tagline="Más que información — una hoja de ruta adaptada a tu perfil y sector"
      icon={Briefcase}
      categoria="Empleo en Suiza"
      precio={350}
      moneda="CHF"
      precioTipo="Pago único · 60 días de seguimiento"
      valorMercado="Servicios equivalentes en el mercado: CHF 400–700"
      problema={{
        titulo: '¿Por qué es tan difícil encontrar empleo en Suiza?',
        descripcion:
          'El mercado laboral suizo es exigente, altamente competitivo y muy diferente al latinoamericano o español. Sin conocer las plataformas correctas, los códigos culturales locales o cómo presentar tu candidatura, las puertas se cierran antes de que puedas abrirlas. No es falta de talento — es falta de contexto.',
      }}
      beneficios={[
        'Análisis personalizado de tu perfil y viabilidad real en Suiza',
        'Estrategia de búsqueda paso a paso adaptada a tu sector',
        'Portales, redes y contactos clave que funcionan en Suiza',
        'Preparación cultural y técnica para entrevistas suizas',
        'Seguimiento activo durante 60 días con soporte por email',
      ]}
      incluye={[
        'Diagnóstico inicial de tu perfil profesional (30 min)',
        'Estrategia personalizada de búsqueda de empleo',
        'Listado de portales y plataformas clave (Jobs.ch, LinkedIn CH, etc.)',
        'Guía de networking profesional en Suiza',
        'Preparación para entrevistas: qué esperan los empleadores suizos',
        'Seguimiento y soporte por email durante 60 días',
      ]}
      noIncluye={[
        'No somos agencia de empleo — no conseguimos trabajo por ti',
        'No contactamos empresas ni enviamos tu CV en tu nombre',
        'No garantizamos ofertas de trabajo ni entrevistas',
        'No gestionamos visados laborales ni permisos',
      ]}
      paraQuien={[
        'Profesionales que planean buscar trabajo en Suiza desde su país de origen',
        'Personas que ya están en Suiza pero no logran entrar al mercado laboral',
        'Quienes han enviado CVs sin respuesta y quieren saber qué está fallando',
      ]}
      planInfo={{
        inicio: 'Disponible como servicio adicional al plan de alojamiento.',
        estrategia: 'Incluido completamente con seguimiento extendido de 60 días.',
        comunidad: 'Acceso a recursos laborales y networking dentro de la comunidad.',
      }}
    />
  );
}
