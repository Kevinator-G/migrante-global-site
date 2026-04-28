'use client';

import { Map } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';

export default function GuiaTuristicaPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d1117 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 30% 70%, rgba(201,169,110,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-[960px] mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
              style={{
                background: 'rgba(201,169,110,0.12)',
                border: '1px solid rgba(201,169,110,0.3)',
                color: '#c9a96e',
              }}
            >
              <Map className="w-3.5 h-3.5" />
              Vive Suiza desde adentro
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
            >
              Guía Turística Local
            </h1>
            <p
              className="text-white/75 text-lg max-w-xl"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            >
              Descubre Suiza con alguien que ya vive aquí. Sin recorridos turísticos genéricos, sin trampas para guiris.
            </p>
          </motion.div>
        </div>
      </section>

      <ServicioTemplate
        id="guia-turistica"
        titulo="Guía Turística Local"
        subtitulo="Descubre Suiza con alguien que ya vive aquí"
        tagline="Rincones reales, anécdotas locales y los lugares donde van los suizos de verdad"
        icon={Map}
        categoria="Experiencias en Suiza"
        precio={97}
        moneda="€"
        precioTipo="Por jornada · grupos hasta 4 personas"
        valorMercado="Tours guiados privados en Suiza: €200–400/día"
        hideNavbar
        hideHero
        problema={{
          titulo: '¿Por qué un guía local cambia todo?',
          descripcion:
            'Los tours convencionales te llevan a los mismos miradores que salen en Google Imágenes, te cobran de más y te dejan con la sensación de que viste Suiza por encima. Conmigo verás los pueblos donde los suizos pasan los domingos, los miradores sin filas, los lugares para comer fondue donde no eres turista — eres un parcero más.',
        }}
        beneficios={[
          'Recorrido personalizado según tus intereses (naturaleza, ciudad, gastronomía, historia)',
          'Anécdotas reales de alguien que vive aquí, no de un guion memorizado',
          'Te enseño a moverte en transporte público para que después puedas hacerlo solo',
          'Recomendaciones de restaurantes y cafés sin precio inflado para turistas',
          'Fotos en los mejores ángulos — sé dónde y a qué hora se ve mejor cada lugar',
          'En español, sin barreras de idioma ni malentendidos',
        ]}
        incluye={[
          'Jornada completa (hasta 8 horas) acompañándote',
          'Planificación previa por videollamada (30 min)',
          'Itinerario personalizado según tus gustos y nivel físico',
          'Guía en español durante todo el recorrido',
          'Recomendaciones de comida, compras y souvenirs locales',
          'Soporte por WhatsApp durante tu estancia',
        ]}
        noIncluye={[
          'No incluye transporte público (lo pagas tú · puedo ayudarte a comprar el Swiss Travel Pass)',
          'No incluye comidas, entradas a museos ni actividades pagadas',
          'No es un tour cerrado — diseñamos juntos qué hacer',
          'No realizamos rutas de alta montaña ni actividades de riesgo',
        ]}
        paraQuien={[
          'Latinos de visita en Suiza que quieren aprovechar de verdad sus días',
          'Familias que prefieren que alguien les guíe sin estrés',
          'Personas considerando migrar que quieren conocer el país antes de decidir',
          'Migrantes ya instalados que tienen visita y quieren mostrarles algo distinto',
        ]}
        foto="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"
        fotoAlt="Paisaje suizo con montañas y lago"
        planInfo={{
          inicio: 'Servicio independiente · ideal si vienes de visita por unos días.',
          estrategia: 'Descuento del 30% si lo combinas con el Pack Completo de migración.',
          comunidad: 'Miembros de la comunidad Parceros Viajeros tienen tarifa preferente.',
        }}
      />
    </>
  );
}
