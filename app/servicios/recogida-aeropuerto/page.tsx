'use client';

import { Plane } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function RecogidaAeropuertoPage() {
  return (
    <ServicioTemplate
      id="recogida-aeropuerto"
      titulo="Recogida en Aeropuerto"
      subtitulo="Tu primer día en Suiza, sin estrés y con alguien que ya conoce el camino"
      tagline="Llegada calmada, orientación real, primer paso con el pie derecho"
      icon={Plane}
      categoria="Bienvenida a Suiza"
      precio={120}
      moneda="CHF"
      precioTipo="Por traslado · aeropuertos principales"
      valorMercado="Servicios de recepción de migrantes: CHF 100–200"
      problema={{
        titulo: '¿Por qué tu primer día importa más de lo que crees?',
        descripcion:
          'Llegar a un país nuevo cansado, con maletas, sin conocer el transporte público, con el idioma encima y sin saber dónde ir es una de las experiencias más abrumadoras de cualquier proceso migratorio. Un mal primer día puede costarte tiempo, dinero y energía emocional. Ese primer día puede ser tranquilo si no entras solo.',
      }}
      beneficios={[
        'Alguien esperándote en el aeropuerto que ya ha vivido lo que tú estás viviendo',
        'Orientación inmediata sobre transporte, tarjetas y primeros pasos en la ciudad',
        'Traslado acompañado a tu alojamiento sin necesidad de improvisar',
        'Primera conversación real sobre qué esperar en tus próximas semanas',
        'Tranquilidad para ti y para tu familia que te despidió desde lejos',
      ]}
      incluye={[
        'Recogida en aeropuerto (Zúrich, Ginebra o Basilea)',
        'Acompañamiento hasta tu alojamiento en transporte público',
        'Orientación sobre cómo funciona el transporte (SBB, tram, bus)',
        'Ayuda con tarjetas de transporte si lo necesitas',
        'Primera orientación sobre la ciudad y barrio de llegada',
        'Llamada pre-llegada para coordinar y prepararte',
      ]}
      noIncluye={[
        'No incluye el coste del transporte público (lo pagas tú)',
        'No ofrecemos servicio de taxi privado — usamos transporte público',
        'No cargamos maletas pesadas — el servicio es de acompañamiento',
        'Aeropuertos fuera de los tres principales se consultan por separado',
      ]}
      paraQuien={[
        'Personas que llegan por primera vez a Suiza y prefieren no llegar solas',
        'Familias con niños pequeños o personas mayores que necesitan apoyo',
        'Quienes llegan sin hablar alemán y temen no poder comunicarse',
      ]}
      planInfo={{
        inicio: 'Disponible como servicio adicional a precio estándar.',
        estrategia: 'Incluido con descuento del 50% dentro del Pack Completo.',
        comunidad: 'Disponible con descuento para miembros que lo soliciten.',
      }}
    />
  );
}
