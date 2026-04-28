'use client';

import { Home } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function AlojamientoPage() {
  return (
    <ServicioTemplate
      id="solo-alojamiento"
      titulo="Gestión de Alojamiento"
      subtitulo="Te orientamos para encontrar tu primer alojamiento en Suiza sin caer en trampas"
      tagline="El mercado inmobiliario suizo es el más competitivo de Europa — no entres solo"
      icon={Home}
      categoria="Vivienda en Suiza"
      precio={149}
      moneda="€"
      precioTipo="Pago único · 30 días de soporte activo"
      valorMercado="Servicios de relocalización residencial en Suiza: €800–2.000"
      problema={{
        titulo: '¿Por qué encontrar alojamiento en Suiza es tan difícil?',
        descripcion:
          'El mercado inmobiliario suizo es de los más competitivos y caros de Europa. Sin hablar el idioma local, sin historial de crédito suizo, sin conocer las zonas ni los documentos requeridos, las probabilidades de caer en estafas o pagar el doble de lo necesario son muy altas. Muchos migrantes pierden semanas —y dinero— por no saber cómo funciona el sistema.',
      }}
      beneficios={[
        'Orientación sobre zonas, precios reales y qué esperar según tu presupuesto',
        'Guía detallada del proceso de búsqueda de vivienda en Suiza',
        'Revisión de contratos de alquiler para entender qué estás firmando',
        'Listado de plataformas confiables y cómo presentar tu candidatura correctamente',
        'Orientación sobre depósitos de garantía y derechos del inquilino',
      ]}
      incluye={[
        'Asesoría sobre zonas y precios según tu presupuesto y cantón destino',
        'Guía paso a paso de búsqueda de alojamiento (temporal y permanente)',
        'Revisión y explicación de contratos de alquiler (traducciones básicas)',
        'Orientación sobre depósitos de garantía (Kaution) y derechos',
        'Listado de plataformas verificadas (Homegate, ImmoScout24, etc.)',
        'Soporte por email durante 30 días desde el primer contacto',
      ]}
      noIncluye={[
        'No somos inmobiliaria — no alquilamos ni gestionamos propiedades',
        'No pagamos depósitos, fianzas ni ningún coste por ti',
        'No garantizamos que encontrarás alojamiento en plazo determinado',
        'No negociamos contratos directamente con propietarios en tu nombre',
      ]}
      paraQuien={[
        'Personas que se mudan a Suiza y necesitan encontrar alojamiento desde fuera',
        'Quienes no hablan alemán/francés y necesitan apoyo para entender contratos',
        'Migrantes que quieren evitar estafas y sobrepagar por desconocimiento',
      ]}
      planInfo={{
        inicio: 'Este servicio es el núcleo del plan Solo Alojamiento (149€).',
        estrategia: 'Incluido dentro del Pack Completo con soporte extendido.',
        comunidad: 'Acceso a recursos de vivienda compartidos dentro de la comunidad.',
      }}
    />
  );
}
