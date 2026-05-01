'use client';

import { Plane } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';

export default function RecogidaAeropuertoPage() {
  return (
    <>
      <Navbar />

      {/* Video Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <video
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-black/50 to-black/20" />

        {/* Text sobre el video */}
        <div className="relative z-10 w-full max-w-[960px] mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e' }}
            >
              <Plane className="w-3.5 h-3.5" />
              Bienvenida a Suiza
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
            >
              Recogida en Aeropuerto
            </h1>
            <p className="text-white/75 text-lg max-w-xl"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            >
              Tu primer día en Suiza, sin estrés y con alguien que ya conoce el camino.
            </p>
          </motion.div>
        </div>
      </section>

      <ServicioTemplate
        id="recogida-aeropuerto"
        titulo="Recogida en Aeropuerto"
        subtitulo="Tu primer día en Suiza, sin estrés y con alguien que ya conoce el camino"
        tagline="Llegada calmada, orientación real, primer paso con el pie derecho"
        icon={Plane}
        categoria="Bienvenida a Suiza"
        precio={177}
        moneda="€"
        precioTipo="Por traslado · hasta 4h de orientación · aeropuertos principales"
        valorMercado="Servicios de recepción y orientación en Suiza: €200–450"
        hideNavbar
        hideHero
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
        foto="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80"
        fotoAlt="Aeropuerto internacional"
        planInfo={{
          inicio: 'Disponible como servicio adicional a precio estándar.',
          estrategia: 'Incluido con descuento del 50% dentro del Pack Completo.',
          comunidad: 'Disponible con descuento para miembros que lo soliciten.',
        }}
      />
    </>
  );
}
