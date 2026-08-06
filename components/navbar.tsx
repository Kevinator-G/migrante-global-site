'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--nav-bg,rgba(17,19,24,0.97))] backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <Link href="/" className="text-2xl font-bold flex items-center gap-1 select-none">
              <span
                className="text-red-600"
                style={{ textShadow: '0 0 18px rgba(220,38,38,0.5), 0 2px 4px rgba(0,0,0,0.4)' }}
              >
                Migrante
              </span>
              <span
                className="text-yellow-500"
                style={{ textShadow: '0 0 18px rgba(245,158,11,0.5), 0 2px 4px rgba(0,0,0,0.4)' }}
              >
                Global
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/servicios" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Servicios
            </Link>
            <Link href="/servicios/alojamiento" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Alojamiento
            </Link>
            <Link href="/blog" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Blog
            </Link>
            <Link href="/metodo" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Método
            </Link>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-yellow-500 transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              title="Ver carrito"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <Link href="/#contacto" className="btn-primary text-sm px-5 py-2.5">
              Contacto
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/60"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 w-9 h-9 flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden mt-3 pb-4 rounded-xl px-4 py-4 space-y-3"
            style={{ background: 'rgba(17,19,24,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              { href: '/servicios', label: 'Servicios' },
              { href: '/servicios/alojamiento', label: 'Alojamiento' },
              { href: '/blog', label: 'Blog' },
              { href: '/metodo', label: 'Método' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/80 hover:text-yellow-500 transition py-2 text-sm font-medium border-b border-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/#contacto"
              className="block btn-primary text-center mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
