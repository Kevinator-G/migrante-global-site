'use client';

import { Plane } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function RecogidaAeropuertoPage() {
  return (
    <ServicioTemplate
      titulo="Recogida en Aeropuerto"
      subtitulo="Servicio de recepción y traslado desde el aeropuerto a tu alojamiento"
      icon={Plane}
      problema={{
        titulo: '¿Por qué es útil este servicio?',
        descripcion:
          'Llegar a un país nuevo, cansado del viaje, con maletas y sin conocer el transporte público puede ser estresante. Te recogemos, te orientamos sobre la ciudad y te llevamos directo a tu alojamiento. Un inicio tranquilo.',
      }}
      incluye={[
        'Recogida en aeropuerto (Zurich, Ginebra, Basilea)',
        'Traslado a tu alojamiento',
        'Orientación básica sobre transporte público',
        'Ayuda con tarjetas de transporte si es necesario',
        'Bienvenida y primera orientación sobre la ciudad',
      ]}
      noIncluye={[
        'No incluye costo de transporte público (lo pagas tú)',
        'No ofrecemos servicio de taxi privado (usamos transporte público)',
        'No cargamos maletas pesadas (solo acompañamiento)',
        'Limitado a aeropuertos principales (otros se consultan)',
      ]}
      paraQuien={[
        'Personas que llegan por primera vez a Suiza',
        'Quienes prefieren un recibimiento amigable y orientación inicial',
        'Familias con niños o personas mayores',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional.',
        estrategia: 'Incluido con descuento del 50%.',
        perfecto: 'Incluido completamente sin costo adicional.',
      }}
    />
  );
}
