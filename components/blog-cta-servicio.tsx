// CTA contextual al final de cada artículo del blog: según la categoría del
// post muestra el servicio que resuelve ese problema. Con un artículo diario
// automatizado, este puente blog → servicio trabaja solo.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServicioCta {
  titulo: string;
  pitch: string;
  href: string;
  boton: string;
}

const porCategoria: Record<string, ServicioCta> = {
  'Visas y permisos': {
    titulo: 'Acompañamiento en Trámites',
    pitch: 'Anmeldung, permisos, seguros y banco — el paso a paso completo con 45 días de soporte.',
    href: '/servicios/tramites',
    boton: 'Ver el acompañamiento',
  },
  'Mercado laboral': {
    titulo: 'Orientación Laboral',
    pitch: 'Estrategia personalizada para entrar al mercado suizo: portales, networking y plan de acción.',
    href: '/servicios/orientacion-laboral',
    boton: 'Ver la orientación laboral',
  },
  'Finanzas y vivienda': {
    titulo: 'Habitaciones en Suiza',
    pitch: 'Habitaciones amuebladas verificadas en el cantón de Zúrich desde 1.150 CHF/mes, con acompañamiento en el contrato.',
    href: '/servicios/alojamiento',
    boton: 'Ver habitaciones disponibles',
  },
  'Homologación de títulos': {
    titulo: 'Orientación Laboral',
    pitch: 'Te ayudo a mover tu título y tu experiencia al mercado suizo — qué homologar y qué no hace falta.',
    href: '/servicios/orientacion-laboral',
    boton: 'Ver la orientación laboral',
  },
  'Bienestar y salud': {
    titulo: 'Acompañamiento en Trámites',
    pitch: 'El seguro médico es obligatorio y elegir mal cuesta caro — te guío para contratar el correcto.',
    href: '/servicios/tramites',
    boton: 'Ver el acompañamiento',
  },
  'Educación y familia': {
    titulo: 'Sesión 1:1',
    pitch: 'Cada familia es un caso distinto. En 60 minutos armamos tu plan concreto, con grabación incluida.',
    href: '/servicios/sesiones-uno-a-uno',
    boton: 'Reservar una sesión',
  },
  'Noticias Suiza': {
    titulo: 'Comunidad de Apoyo',
    pitch: 'Mantente al día con nuestra red de latinos en Suiza: eventos, avisos y recursos actualizados.',
    href: '/servicios/comunidad-apoyo',
    boton: 'Conocer la comunidad',
  },
  'Cultura y adaptación': {
    titulo: 'Comunidad de Apoyo',
    pitch: 'La adaptación es más fácil acompañado — networking, eventos y gente que ya pasó por lo mismo.',
    href: '/servicios/comunidad-apoyo',
    boton: 'Conocer la comunidad',
  },
  'Emprendimiento': {
    titulo: 'Sesión 1:1',
    pitch: 'Montar negocio en Suiza tiene sus reglas. En una sesión revisamos tu idea y los pasos legales.',
    href: '/servicios/sesiones-uno-a-uno',
    boton: 'Reservar una sesión',
  },
  'Impuestos': {
    titulo: 'Sesión 1:1',
    pitch: 'Impuestos, deducciones y cantones: resuelve tus dudas concretas en una sesión personalizada.',
    href: '/servicios/sesiones-uno-a-uno',
    boton: 'Reservar una sesión',
  },
};

export function BlogCtaServicio({ category }: { category: string }) {
  const servicio = porCategoria[category];

  // Sin mapeo conocido → CTA general a consulta
  if (!servicio) {
    return (
      <div
        className="mt-14 rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(201,169,110,0.1), rgba(220,38,38,0.06))',
          border: '1px solid rgba(201,169,110,0.2)',
        }}
      >
        <h3 className="text-xl font-bold text-white mb-2">¿Listo para dar el paso?</h3>
        <p className="text-white/55 mb-6 text-sm max-w-sm mx-auto">
          Agenda una consulta gratuita y recibe orientación personalizada para tu proceso a Suiza.
        </p>
        <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
          Agenda tu consulta gratuita <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className="mt-14 rounded-2xl p-8"
      style={{
        background: 'linear-gradient(135deg, rgba(201,169,110,0.1), rgba(220,38,38,0.06))',
        border: '1px solid rgba(201,169,110,0.2)',
      }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#c9a96e' }}>
        Sobre este tema te puedo ayudar
      </p>
      <h3 className="text-xl font-bold text-white mb-2">{servicio.titulo}</h3>
      <p className="text-white/55 mb-6 text-sm max-w-lg">{servicio.pitch}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={servicio.href} className="btn-primary inline-flex items-center justify-center gap-2 text-sm">
          {servicio.boton} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/#contacto"
          className="inline-flex items-center justify-center gap-2 text-sm text-white/50 hover:text-yellow-500 transition px-4 py-2"
        >
          o agenda una consulta gratuita
        </Link>
      </div>
    </div>
  );
}
