'use client';

import { Home } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function AlojamientoPage() {
  return (
    <ServicioTemplate
      titulo="Gestión de Alojamiento"
      subtitulo="Te ayudamos a encontrar y gestionar tu primer alojamiento en Suiza"
      icon={Home}
      problema={{
        titulo: '¿Por qué es difícil encontrar alojamiento en Suiza?',
        descripcion:
          'El mercado inmobiliario suizo es competitivo, caro y requiere documentación específica. Sin conocer el idioma ni el sistema, es fácil caer en estafas o pagar de más. Te orientamos para evitar errores costosos.',
      }}
      incluye={[
        'Asesoría sobre zonas y precios según tu presupuesto',
        'Guía paso a paso para buscar alojamiento',
        'Revisión de contratos de alquiler (traducciones básicas)',
        'Orientación sobre depósitos de garantía',
        'Listado de plataformas y recursos confiables',
        'Soporte durante 30 días',
      ]}
      noIncluye={[
        'No somos inmobiliaria (no alquilamos ni gestionamos propiedades)',
        'No pagamos depósitos ni fianzas por ti',
        'No garantizamos que encuentres alojamiento',
        'No negociamos contratos en tu nombre',
      ]}
      paraQuien={[
        'Personas que van a mudarse a Suiza y necesitan alojamiento temporal o permanente',
        'Quienes no hablan alemán/francés y necesitan apoyo con contratos',
        'Personas que quieren evitar estafas o sobrepagar',
      ]}
      planes={{
        inicio: 'Este servicio está incluido en este plan como servicio principal.',
        estrategia: 'Incluye orientación de alojamiento junto con otros servicios de reubicación.',
        perfecto: 'Disponible como servicio adicional con descuento para miembros.',
      }}
    />
  );
}
