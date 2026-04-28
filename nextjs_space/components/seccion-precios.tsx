'use client';

import { motion } from 'framer-motion';
import { Check, Home, Package2, Users, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const GOLD = '#c9a96e';

const planes = [
  {
    id: 'solo-alojamiento',
    nombre: 'Solo Alojamiento',
    precio: 290,
    precioEur: 305,
    moneda: 'CHF',
    tipo: 'Pago único',
    descripcion: 'Servicio puntual',
    destacado: false,
    icon: Home,
    caracteristicas: [
      'Asesoría para encontrar alojamiento',
      'Guía de búsqueda de vivienda',
      'Revisión de contratos de alquiler',
      'Orientación sobre zonas y costos',
      'Soporte durante 30 días',
    ],
  },
  {
    id: 'pack-completo',
    nombre: 'Pack Completo',
    precio: 590,
    precioEur: 620,
    moneda: 'CHF',
    tipo: 'Pago único · cuotas disponibles',
    descripcion: 'Reubicación integral',
    destacado: true,
    icon: Package2,
    caracteristicas: [
      'Todo lo de Solo Alojamiento',
      'CV adaptado al formato suizo',
      'Estrategia de búsqueda de empleo',
      'Guía completa de trámites',
      'Acceso a comunidad durante 3 meses',
      '2 sesiones personalizadas 1:1',
      'Soporte prioritario 90 días',
    ],
  },
  {
    id: 'comunidad',
    nombre: 'Comunidad',
    precio: 25,
    precioEur: 26,
    moneda: 'CHF/mes',
    tipo: 'Suscripción mensual',
    descripcion: 'Sin permanencia',
    destacado: false,
    icon: Users,
    caracteristicas: [
      'Acceso a comunidad exclusiva',
      'Eventos mensuales de networking',
      'Recursos y guías actualizadas',
      'Descuentos en servicios adicionales',
      'Cancela cuando quieras',
    ],
  },
];

export function SeccionPrecios() {
  const { addItem, openCart, isInCart } = useCart();

  const handleAddToCart = (plan: typeof planes[0]) => {
    if (isInCart(plan.id)) { openCart(); return; }
    addItem({
      id: plan.id,
      nombre: plan.nombre,
      precio: plan.precio,
      moneda: plan.moneda,
      tipo: plan.tipo,
      emoji: plan.id === 'solo-alojamiento' ? '🏠' : plan.id === 'pack-completo' ? '📦' : '🤝',
    });
  };

  return (
    <section id="planes" className="section" style={{ background: '#111318' }}>
      <div className="max-w-[1100px] mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ y: 15 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">Elige tu acompañamiento</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Planes y <span style={{ color: GOLD }}>Precios</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Precios pensados para que migrar no te cueste el sueldo de un año.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {planes.map((plan, index) => {
            const inCart = isInCart(plan.id);
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.id}
                initial={{ y: 15 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                data-light-card="true"
                className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.destacado ? 'md:-translate-y-2' : ''
                }`}
                style={{
                  background: 'var(--surface-card)',
                  border: plan.destacado
                    ? `1px solid ${GOLD}40`
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: plan.destacado
                    ? `0 0 0 1px ${GOLD}20, 0 24px 48px rgba(0,0,0,0.4)`
                    : 'none',
                }}
              >
                {/* Badge "más popular" */}
                {plan.destacado && (
                  <div
                    className="text-center py-2 text-[11px] font-bold tracking-widest uppercase"
                    style={{ background: GOLD, color: '#111318', letterSpacing: '2.5px' }}
                  >
                    Recomendado
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Icono + nombre */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: plan.destacado
                          ? `${GOLD}12`
                          : 'var(--surface-card-elevated)',
                        border: plan.destacado
                          ? `1px solid ${GOLD}30`
                          : '1px solid rgba(128,128,128,0.15)',
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 ${!plan.destacado ? 'text-white/65' : ''}`}
                        style={{ color: plan.destacado ? GOLD : undefined }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white leading-tight">{plan.nombre}</div>
                      <div className="text-white/35 text-xs mt-0.5">{plan.descripcion}</div>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="mb-6">
                    <div className="flex items-end gap-2">
                      <span
                        className={`text-5xl font-bold leading-none ${!plan.destacado ? 'text-white' : ''}`}
                        style={{ color: plan.destacado ? GOLD : undefined }}
                      >
                        {plan.precio.toLocaleString('es-CH')}
                      </span>
                      <span className="text-white/35 text-sm mb-1">{plan.moneda}</span>
                    </div>
                    <div className="text-white/45 text-xs mt-1">
                      ≈ {plan.precioEur} €{plan.moneda.includes('/mes') ? '/mes' : ''}
                    </div>
                    <div className="text-white/30 text-xs mt-1">{plan.tipo}</div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px mb-5"
                    style={{ background: 'rgba(128,128,128,0.12)' }}
                  />

                  {/* Características */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${!plan.destacado ? 'text-white/35' : ''}`}
                          style={{ color: plan.destacado ? GOLD : undefined }}
                        />
                        {c}
                      </li>
                    ))}
                  </ul>

                  {/* Botón carrito */}
                  <button
                    onClick={() => handleAddToCart(plan)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
                    style={
                      inCart
                        ? {
                            background: 'rgba(201,169,110,0.1)',
                            border: `1px solid ${GOLD}40`,
                            color: GOLD,
                          }
                        : plan.destacado
                        ? {
                            background: GOLD,
                            color: '#111318',
                            fontWeight: 700,
                            boxShadow: `0 4px 12px ${GOLD}30`,
                          }
                        : {
                            background: 'var(--surface-card-elevated)',
                            border: '1px solid rgba(128,128,128,0.2)',
                            color: 'var(--white)',
                          }
                    }
                    onMouseEnter={e => {
                      if (!inCart && !plan.destacado) {
                        (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}50`;
                        (e.currentTarget as HTMLElement).style.color = GOLD;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!inCart && !plan.destacado) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(128,128,128,0.2)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--white)';
                      }
                    }}
                  >
                    {inCart ? (
                      <><CheckCircle2 className="w-4 h-4" /> En tu carrito · Ver</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Agregar al carrito</>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nota legal */}
        <motion.div
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 space-y-1"
        >
          <p className="text-white/30 text-sm">
            * Precios en francos suizos (CHF). Equivalencia en euros aproximada (1 CHF ≈ 1,05 €). Pago coordinado personalmente · Cuotas disponibles en el Pack Completo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
