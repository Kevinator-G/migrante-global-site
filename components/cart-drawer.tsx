'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Trash2, ShoppingCart, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, removeItem, clearCart, isOpen, closeCart, total, itemCount } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (checkoutLoading || items.length === 0) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al iniciar el pago');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('No pudimos conectar con el servidor de pagos. Inténtalo de nuevo.');
      setCheckoutLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] flex flex-col shadow-2xl"
            style={{ background: '#13161b', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-white text-lg">Tu selección</span>
                {itemCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingCart className="w-12 h-12 text-white/15" />
                  <p className="text-white/40 text-sm">Tu carrito está vacío</p>
                  <button
                    onClick={closeCart}
                    className="text-yellow-500 text-sm hover:text-yellow-400 transition-colors"
                  >
                    Explorar planes →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start gap-4 rounded-xl p-4 group"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {/* Emoji / Icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: 'rgba(245,158,11,0.12)' }}
                      >
                        {item.emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm">{item.nombre}</div>
                        <div className="text-white/40 text-xs mt-0.5">{item.tipo}</div>
                        <div className="mt-2 font-bold text-yellow-500">
                          {item.precio.toLocaleString('es-CH')} {item.moneda}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Total */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/50 text-sm">Total estimado</span>
                  <span className="text-2xl font-bold text-white">
                    {total.toLocaleString('es-CH')} CHF
                  </span>
                </div>
                {items.some(i => i.tipo.toLowerCase().includes('mensual') || i.tipo.toLowerCase().includes('suscripción')) && (
                  <p className="text-white/30 text-xs mb-4">* Incluye suscripciones mensuales</p>
                )}
                <p className="text-white/30 text-xs mb-5">
                  Pago seguro con Stripe. Recibirás confirmación por email.
                </p>

                {/* Error */}
                {checkoutError && (
                  <p className="text-red-400 text-xs mb-3 text-center">{checkoutError}</p>
                )}

                {/* CTA principal → Stripe Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-black mb-3 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 5px 0 #92400e, 0 7px 14px rgba(0,0,0,0.3)',
                  }}
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirigiendo...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pagar ahora
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Vaciar */}
                <button
                  onClick={clearCart}
                  className="w-full text-center text-white/25 text-xs hover:text-white/50 transition-colors py-2"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
