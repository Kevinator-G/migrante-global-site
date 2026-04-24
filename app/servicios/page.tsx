'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  Video,
  Home,
  Languages,
  Plane,
  FileCheck,
  Users,
  Globe,
  FilePenLine,
  Map,
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useCart } from '@/lib/cart-context';

const GOLD = '#c9a96e';
const GOLD_BG = 'rgba(201,169,110,0.08)';
const GOLD_BORDER = 'rgba(201,169,110,0.25)';

const servicios = [
  {
    id: 'orientacion-laboral',
    href: '/servicios/orientacion-laboral',
    icon: Briefcase,
    categoria: 'Empleo',
    titulo: 'Orientación Laboral',
    descripcion:
      'Estrategia personalizada para entrar al mercado laboral suizo: portales, networking, entrevistas y plan de acción.',
    precio: 350,
    moneda: 'CHF',
    precioTipo: 'Pago único',
    tag: 'Empleo',
    tagColor: GOLD,
    destacado: true,
  },
  {
    id: 'cv-formato-suizo',
    href: '/servicios/cv-formato-suizo',
    icon: FileText,
    categoria: 'Empleo',
    titulo: 'CV Formato Suizo',
    descripcion:
      'Revisión y adaptación de tu CV al formato exacto que usan los empleadores suizos. Estructura, foto, longitud y contenido.',
    precio: 290,
    moneda: 'CHF',
    precioTipo: 'Pago único',
    tag: 'Documentos',
    tagColor: '#ef4444',
    destacado: true,
  },
  {
    id: 'sesiones-1-1',
    href: '/servicios/sesiones-uno-a-uno',
    icon: Video,
    categoria: 'Consultoría',
    titulo: 'Sesiones 1:1',
    descripcion:
      'Consultoría personalizada de 60 minutos para resolver tus dudas específicas. Plan de acción y grabación incluida.',
    precio: 110,
    moneda: 'CHF/sesión',
    precioTipo: 'Por sesión',
    tag: 'Incluido en planes',
    tagColor: '#60a5fa',
    destacado: true,
  },
  {
    id: 'solo-alojamiento',
    href: '/servicios/alojamiento',
    icon: Home,
    categoria: 'Vivienda',
    titulo: 'Gestión de Alojamiento',
    descripcion:
      'Orientación completa para encontrar tu primer alojamiento en Suiza sin caer en trampas ni sobrepagar.',
    precio: 290,
    precioEur: 305,
    moneda: 'CHF',
    precioTipo: 'Pago único',
    tag: null,
    tagColor: '',
    destacado: false,
  },
  {
    id: 'clases-aleman',
    href: '/servicios/clases-aleman',
    icon: Languages,
    categoria: 'Idiomas',
    titulo: 'Clases de Alemán',
    descripcion:
      'Clases 1:1 personalizadas con enfoque práctico para vivir y trabajar en Suiza. Preparación para A1, A2 y B1.',
    precio: 65,
    moneda: 'CHF/hora',
    precioTipo: 'Por hora',
    tag: null,
    tagColor: '',
    destacado: false,
  },
  {
    id: 'recogida-aeropuerto',
    href: '/servicios/recogida-aeropuerto',
    icon: Plane,
    categoria: 'Llegada',
    titulo: 'Recogida en Aeropuerto',
    descripcion:
      'Alguien que ya conoce Suiza te espera en el aeropuerto y te acompaña hasta tu alojamiento. Primer día sin estrés.',
    precio: 120,
    moneda: 'CHF',
    precioTipo: 'Por traslado',
    tag: null,
    tagColor: '',
    destacado: false,
  },
  {
    id: 'tramites-suiza',
    href: '/servicios/tramites',
    icon: FileCheck,
    categoria: 'Trámites',
    titulo: 'Acompañamiento en Trámites',
    descripcion:
      'Guía completa del Anmeldung, seguros de salud, cuenta bancaria y demás trámites obligatorios. 45 días de soporte.',
    precio: 320,
    moneda: 'CHF',
    precioTipo: 'Pago único',
    tag: null,
    tagColor: '',
    destacado: false,
  },
  {
    id: 'comunidad',
    href: '/servicios/comunidad-apoyo',
    icon: Users,
    categoria: 'Comunidad',
    titulo: 'Comunidad de Apoyo',
    descripcion:
      'Acceso mensual a nuestra red de migrantes latinos en Suiza. Networking, eventos y recursos actualizados.',
    precio: 25,
    precioEur: 26,
    moneda: 'CHF/mes',
    precioTipo: 'Suscripción · cancela cuando quieras',
    tag: null,
    tagColor: '',
    destacado: false,
  },
  {
    id: 'guia-turistica',
    href: '/servicios/guia-turistica',
    icon: Map,
    categoria: 'Experiencias',
    titulo: 'Guía Turística Local',
    descripcion:
      'Descubre Suiza con alguien que ya vive aquí. Rincones reales, anécdotas locales y los lugares donde van los suizos de verdad.',
    precio: 150,
    precioEur: 158,
    moneda: 'CHF',
    precioTipo: 'Por jornada · hasta 4 personas',
    tag: 'Nuevo',
    tagColor: '#10b981',
    destacado: false,
  },
  {
    id: 'orientacion-otros-paises',
    href: '/servicios/orientacion-otros-paises',
    icon: Globe,
    categoria: 'Europa',
    titulo: 'Orientación Otros Países',
    descripcion:
      'Análisis comparativo de Suiza vs Alemania, Austria, Países Bajos y Portugal según tu perfil. Incluye sesión 1:1.',
    precio: 250,
    moneda: 'CHF',
    precioTipo: 'Pago único',
    tag: null,
    tagColor: '',
    destacado: false,
  },
  {
    id: 'generador-documentos',
    href: '/servicios/generador-documentos',
    icon: FilePenLine,
    categoria: 'Herramientas',
    titulo: 'Generador de Documentos',
    descripcion:
      'Crea cartas de vivienda, presentación laboral y trámites adaptadas a tu perfil con inteligencia artificial.',
    precio: 0,
    moneda: '',
    precioTipo: 'Herramienta gratuita',
    tag: 'Gratis',
    tagColor: '#10b981',
    destacado: false,
  },
];

const destacados = servicios.filter(s => s.destacado);
const adicionales = servicios.filter(s => !s.destacado);

function ServiceCard({
  servicio,
  index,
  compact = false,
}: {
  servicio: (typeof servicios)[0] & { precioEur?: number };
  index: number;
  compact?: boolean;
}) {
  const { addItem, openCart, isInCart } = useCart();
  const inCart = isInCart(servicio.id);
  const Icon = servicio.icon;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (servicio.precio === 0) return;
    if (inCart) { openCart(); return; }
    addItem({
      id: servicio.id,
      nombre: servicio.titulo,
      precio: servicio.precio,
      moneda: servicio.moneda,
      tipo: servicio.precioTipo,
      emoji: '⭐',
    });
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        data-light-card="true"
        className="rounded-xl transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: 'var(--surface-card)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link href={servicio.href} className="block p-5">
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
            >
              <Icon className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-white text-sm leading-tight">
                  {servicio.titulo}
                </h3>
                {servicio.precio > 0 && (
                  <span
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: GOLD }}
                  >
                    {servicio.precio.toLocaleString('es-CH')} {servicio.moneda}
                  </span>
                )}
                {servicio.precio === 0 && (
                  <span className="text-xs font-semibold text-emerald-400">
                    Gratis
                  </span>
                )}
              </div>
              <p className="text-white/45 text-xs leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      data-light-card="true"
      className="relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(160deg, var(--surface-card-elevated) 0%, var(--surface-card) 100%)',
        border: `1px solid ${GOLD_BORDER}`,
        boxShadow: `0 0 0 1px rgba(201,169,110,0.08), 0 20px 40px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Tag */}
      {servicio.tag && (
        <div
          className="px-4 py-2 text-center text-[10px] font-bold tracking-widest uppercase"
          style={{
            background: servicio.tagColor,
            color: servicio.tagColor === GOLD ? '#111318' : '#ffffff',
            letterSpacing: '2px',
          }}
        >
          {servicio.tag}
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Icon + categoria */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
          >
            <Icon className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-white/30">
              {servicio.categoria}
            </div>
            <div className="font-bold text-white text-base leading-tight">
              {servicio.titulo}
            </div>
          </div>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-6 flex-1">
          {servicio.descripcion}
        </p>

        {/* Price */}
        <div className="mb-5 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-bold" style={{ color: GOLD }}>
              {servicio.precio.toLocaleString('es-CH')}
            </span>
            {servicio.moneda && (
              <span className="text-white/40 text-sm">{servicio.moneda}</span>
            )}
          </div>
          {'precioEur' in servicio && servicio.precioEur && (
            <div className="text-white/35 text-xs mt-0.5">
              ≈ {servicio.precioEur} €{servicio.moneda?.includes('/mes') ? '/mes' : ''}
            </div>
          )}
          <div className="text-white/25 text-xs mt-0.5">{servicio.precioTipo}</div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-5"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={servicio.href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = GOLD_BORDER;
              (e.currentTarget as HTMLElement).style.color = GOLD;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor =
                'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
            }}
          >
            Ver detalles <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {servicio.precio > 0 && (
            <button
              onClick={handleCart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
              style={
                inCart
                  ? { background: GOLD_BG, border: `1px solid ${GOLD_BORDER}`, color: GOLD }
                  : { background: GOLD, color: '#111318', boxShadow: `0 2px 12px rgba(201,169,110,0.3)` }
              }
            >
              {inCart ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> En carrito</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Añadir</>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main
        className="pt-20"
        data-light-card="true"
        style={{ background: '#0a0c10', minHeight: '100vh' }}
      >
        {/* ─── HERO ─── */}
        <section
          className="relative overflow-hidden"
          style={{ padding: '90px 0 80px' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 65%)',
            }}
          />
          <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}`, color: GOLD }}
              >
                Catálogo de servicios
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Servicios que{' '}
                <span style={{ color: GOLD }}>resuelven problemas reales</span>
              </h1>
              <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
                Desde tu búsqueda de trabajo hasta el primer día en el aeropuerto —
                cada servicio está diseñado para una etapa concreta de tu migración.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── SERVICIOS DESTACADOS ─── */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="max-w-[1100px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: GOLD }}>
                Más solicitados
              </p>
              <h2 className="text-2xl font-bold text-white">Servicios principales</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {destacados.map((s, i) => (
                <ServiceCard key={s.id} servicio={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── TODOS LOS SERVICIOS ─── */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="max-w-[1100px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: GOLD }}>
                Servicios adicionales
              </p>
              <h2 className="text-2xl font-bold text-white">
                Más formas de ayudarte
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-3">
              {adicionales.map((s, i) => (
                <ServiceCard key={s.id} servicio={s} index={i} compact />
              ))}
            </div>
          </div>
        </section>

        {/* ─── PLANES CTA ─── */}
        <section style={{ padding: '60px 0 80px' }}>
          <div className="max-w-[800px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-8 text-center"
              style={{
                background:
                  'linear-gradient(145deg, var(--surface-card-elevated) 0%, var(--surface-card) 100%)',
                border: `1px solid ${GOLD_BORDER}`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
              >
                <ShoppingCart className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                ¿Prefieres un paquete completo?
              </h2>
              <p className="text-white/50 text-sm mb-7 max-w-md mx-auto leading-relaxed">
                Nuestros planes combinan varios servicios a mejor precio. El Pack
                Completo incluye alojamiento, CV, orientación laboral, sesiones 1:1 y
                comunidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#planes" className="btn-primary text-sm px-8 py-3">
                  Ver planes y precios
                </Link>
                <Link href="/#contacto" className="btn-secondary text-sm px-8 py-3">
                  Hablar con nosotros
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div style={{ padding: '24px 0' }}>
          <p className="text-white/20 text-xs text-center max-w-[800px] mx-auto px-6">
            Todos los precios en CHF · Equivalencia en euros aproximada · Pago coordinado personalmente
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
