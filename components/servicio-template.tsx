'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Users,
  CheckCircle2,
  Star,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { useCart } from '@/lib/cart-context';

const GOLD = '#c9a96e';
const GOLD_BG = 'rgba(201,169,110,0.08)';
const GOLD_BORDER = 'rgba(201,169,110,0.25)';

interface PlanInfo {
  inicio: string;
  estrategia: string;
  comunidad: string;
}

export interface ServicioTemplateProps {
  id: string;
  titulo: string;
  subtitulo: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  categoria: string;
  precio: number;
  moneda: string;
  precioTipo: string;
  valorMercado: string;
  problema: { titulo: string; descripcion: string };
  beneficios: string[];
  incluye: string[];
  noIncluye: string[];
  paraQuien: string[];
  planInfo: PlanInfo;
  foto?: string;
  fotoAlt?: string;
  hideNavbar?: boolean;
  hideHero?: boolean;
}

export function ServicioTemplate({
  id,
  titulo,
  subtitulo,
  tagline,
  icon: Icon,
  categoria,
  precio,
  moneda,
  precioTipo,
  valorMercado,
  problema,
  beneficios,
  incluye,
  noIncluye,
  paraQuien,
  planInfo,
  foto,
  fotoAlt,
  hideNavbar = false,
  hideHero = false,
}: ServicioTemplateProps) {
  const { addItem, openCart, isInCart } = useCart();
  const inCart = isInCart(id);

  const handleCartAction = () => {
    if (inCart) { openCart(); return; }
    addItem({
      id,
      nombre: titulo,
      precio,
      moneda,
      tipo: precioTipo,
      emoji: '⭐',
    });
  };

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main
        className={hideNavbar ? '' : 'pt-20'}
        data-light-card="true"
        style={{ background: '#0a0c10', minHeight: '100vh' }}
      >
        {/* ─── HERO ─── */}
        {!hideHero && <section
          className="relative overflow-hidden"
          style={{ padding: '80px 0 70px' }}
        >
          {/* Background photo */}
          {foto && (
            <>
              <img
                src={foto}
                alt={fotoAlt ?? titulo}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.35 }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,12,16,0.3) 0%, rgba(10,12,16,0.80) 100%)' }} />
            </>
          )}
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 max-w-[960px] mx-auto px-6">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 text-sm mb-10 transition-all duration-200 group"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLElement).style.color = GOLD)
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'rgba(255,255,255,0.4)')
                }
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Todos los servicios
              </Link>
            </motion.div>

            <div className="text-center">
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-6"
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                  style={{
                    background: GOLD_BG,
                    border: `1px solid ${GOLD_BORDER}`,
                    color: GOLD,
                  }}
                >
                  {categoria}
                </span>
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: GOLD_BG,
                  border: `1px solid ${GOLD_BORDER}`,
                  boxShadow: `0 0 40px rgba(201,169,110,0.12)`,
                }}
              >
                <Icon className="w-9 h-9" style={{ color: GOLD }} />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
              >
                {titulo}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg mb-2 text-white/60 max-w-xl mx-auto"
              >
                {subtitulo}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-sm text-white/30 mb-10 italic max-w-lg mx-auto"
              >
                {tagline}
              </motion.p>

              {/* Price + Cart CTA */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <span
                      className="text-5xl font-bold leading-none"
                      style={{ color: GOLD }}
                    >
                      {precio.toLocaleString('es-CH')}
                    </span>
                    <span className="text-white/55 text-base font-medium">
                      {moneda}
                    </span>
                  </div>
                  <div className="text-white/25 text-xs text-center">{precioTipo}</div>
                </div>

                <button
                  onClick={handleCartAction}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                  style={
                    inCart
                      ? {
                          background: GOLD_BG,
                          border: `1px solid ${GOLD_BORDER}`,
                          color: GOLD,
                        }
                      : {
                          background: GOLD,
                          color: '#111318',
                          boxShadow: `0 4px 20px rgba(201,169,110,0.35)`,
                        }
                  }
                >
                  {inCart ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Reservado · Ver resumen
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Quiero este servicio
                    </>
                  )}
                </button>

                <p className="text-white/25 text-xs text-center max-w-xs">
                  {valorMercado}
                </p>
              </motion.div>
            </div>
          </div>
        </section>}

        {/* ─── PROBLEMA + BENEFICIOS ─── */}
        <section style={{ padding: '70px 0' }}>
          <div className="max-w-[960px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="section-tag">Por qué importa</span>
              <h2 className="text-2xl font-bold text-white">
                El problema que resolvemos
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Problem card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl p-7"
                style={{
                  background: 'rgba(220,38,38,0.05)',
                  border: '1px solid rgba(220,38,38,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-white/40">
                    El desafío
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {problema.titulo}
                </h3>
                <p className="text-white/55 leading-relaxed text-sm">
                  {problema.descripcion}
                </p>
              </motion.div>

              {/* Benefits card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl p-7"
                style={{
                  background: GOLD_BG,
                  border: `1px solid ${GOLD_BORDER}`,
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: GOLD }}
                  />
                  <span
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: GOLD }}
                  >
                    Nuestra respuesta
                  </span>
                </div>
                <ul className="space-y-3.5">
                  {beneficios.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: GOLD }}
                      />
                      <span className="text-white/75">{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── QUÉ INCLUYE / NO INCLUYE ─── */}
        <section style={{ padding: '70px 0' }}>
          <div className="max-w-[960px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="section-tag">Alcance del servicio</span>
              <h2 className="text-2xl font-bold text-white">
                ¿Qué cubre este servicio?
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-7"
              data-light-card="true"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: GOLD_BG,
                    border: `1px solid ${GOLD_BORDER}`,
                  }}
                >
                  <Check className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <h3 className="font-bold text-white text-lg">Qué incluye</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {incluye.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <ChevronRight
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: GOLD }}
                    />
                    <span className="text-white/70">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ─── PARA QUIÉN ─── */}
        <section style={{ padding: '70px 0' }}>
          <div className="max-w-[960px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
              >
                <Users className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¿Para quién es este servicio?
              </h2>
              <p className="text-white/40 text-sm">
                Diseñado para personas en estas situaciones
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {paraQuien.map((perfil, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  data-light-card="true"
                  className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'var(--surface-card)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: GOLD_BG }}
                  >
                    <Star className="w-3.5 h-3.5" style={{ color: GOLD }} />
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed">{perfil}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING DESTACADO ─── */}
        <section style={{ padding: '70px 0' }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-tag">Inversión</span>
              <h2 className="text-3xl font-bold text-white mb-2">
                Precio del servicio
              </h2>
              <p className="text-white/35 text-sm mb-8 max-w-sm mx-auto">
                {valorMercado}
              </p>

              {/* Pricing card */}
              <div
                className="rounded-2xl p-8 mb-5"
                style={{
                  background:
                    'linear-gradient(145deg, var(--surface-card-elevated) 0%, var(--surface-card) 100%)',
                  border: `1px solid ${GOLD_BORDER}`,
                  boxShadow: `0 0 0 1px rgba(201,169,110,0.08), 0 24px 48px rgba(0,0,0,0.4)`,
                }}
              >
                <div className="flex flex-col items-center gap-1 mb-3">
                  <div className="flex items-baseline justify-center gap-2">
                    <span
                      className="text-6xl font-bold leading-none"
                      style={{ color: GOLD }}
                    >
                      {precio.toLocaleString('es-CH')}
                    </span>
                    <span className="text-white/55 text-lg font-medium">
                      {moneda}
                    </span>
                  </div>
                  <div className="text-white/25 text-xs text-center">{precioTipo}</div>
                </div>
                <p className="text-white/30 text-xs mb-7">
                  El pago se coordina personalmente — sin plataformas, sin sorpresas
                </p>
                <button
                  onClick={handleCartAction}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                  style={
                    inCart
                      ? {
                          background: GOLD_BG,
                          border: `1px solid ${GOLD_BORDER}`,
                          color: GOLD,
                        }
                      : {
                          background: GOLD,
                          color: '#111318',
                          boxShadow: `0 4px 20px rgba(201,169,110,0.3)`,
                        }
                  }
                >
                  {inCart ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      En tu carrito · Ver resumen
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al carrito
                    </>
                  )}
                </button>
              </div>

              {/* Plans integration */}
              <div
                className="rounded-2xl p-6 text-left"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  className="text-xs uppercase tracking-widest font-semibold mb-5 text-center"
                  style={{ color: GOLD, letterSpacing: '2.5px' }}
                >
                  También disponible en nuestros planes
                </p>
                <div className="space-y-3.5">
                  {[
                    { plan: 'Solo Alojamiento — 149 €', info: planInfo.inicio },
                    { plan: 'Pack Completo — 347 €', info: planInfo.estrategia },
                    { plan: 'Comunidad — 17 €/mes', info: planInfo.comunidad },
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: GOLD, opacity: 0.5 }}
                      />
                      <div>
                        <span className="text-white/50 font-medium">{p.plan}:</span>{' '}
                        <span className="text-white/30">{p.info}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-5 pt-4 flex justify-center"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <Link
                    href="/#planes"
                    className="text-sm font-semibold transition-all duration-200 hover:opacity-80"
                    style={{ color: GOLD }}
                  >
                    Ver todos los planes →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA FINAL ─── */}
        <section style={{ padding: '70px 0' }}>
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
              >
                <MessageCircle className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                ¿Tienes preguntas antes de decidir?
              </h2>
              <p className="text-white/45 mb-8 text-sm leading-relaxed max-w-md mx-auto">
                Escríbenos sin compromiso. Te explicamos exactamente qué puedes
                esperar y si este servicio es el adecuado para tu situación.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contacto"
                  className="btn-primary text-sm px-8 py-3"
                >
                  Contactar ahora
                </Link>
                <Link
                  href="/servicios"
                  className="btn-secondary text-sm px-8 py-3"
                >
                  Ver todos los servicios
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <div style={{ padding: '28px 0' }}>
          <div className="max-w-[960px] mx-auto px-6 text-center">
            <p className="text-white/18 text-xs leading-relaxed">
              Migrante Global no es agencia de empleo, inmobiliaria ni asesoría legal.
              Ofrecemos orientación y acompañamiento. No garantizamos empleo, residencia
              ni aprobación de trámites. Todos los precios en euros (€).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
