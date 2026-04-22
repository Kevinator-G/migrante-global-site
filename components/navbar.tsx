'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Menu, X, MapPin, ShoppingCart, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const paisesUE = [
  'Alemania', 'Austria', 'Bélgica', 'Bulgaria', 'Chipre', 'Croacia', 'Dinamarca',
  'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia', 'Francia', 'Grecia',
  'Hungría', 'Irlanda', 'Italia', 'Letonia', 'Lituania', 'Luxemburgo', 'Malta',
  'Países Bajos', 'Polonia', 'Portugal', 'República Checa', 'Rumanía', 'Suecia',
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('mg-theme');
    setIsDark(saved !== 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('light');
      localStorage.setItem('mg-theme', 'light');
      setIsDark(false);
    } else {
      html.classList.remove('light');
      localStorage.setItem('mg-theme', 'dark');
      setIsDark(true);
    }
  }, [isDark]);

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
          <Link href="/" className="text-2xl font-bold flex items-center gap-1">
            <span className="text-red-600">Migrante</span>
            <span className="text-yellow-500">Global</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/servicios" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Servicios
            </Link>
            <Link href="/#metodo" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Método
            </Link>
            <Link href="/#planes" className="text-white/80 hover:text-yellow-500 transition text-sm font-medium">
              Planes
            </Link>

            {/* Dropdown países */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center gap-1.5 text-white/80 hover:text-yellow-500 transition text-sm font-medium"
              >
                <MapPin className="w-3.5 h-3.5" />
                Países
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-xl p-4 max-h-96 overflow-y-auto"
                  style={{ background: '#1b1d24', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="mb-3">
                    <div className="text-yellow-500 font-semibold mb-1 flex items-center gap-2 text-sm">
                      <span style={{ fontWeight: 800, fontSize: 10, padding: '1px 5px', border: '1px solid currentColor', borderRadius: 3, opacity: 0.8 }}>CH</span>
                      Suiza (Principal)
                    </div>
                    <div className="text-white/50 text-xs">Nuestro enfoque principal</div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="text-white/40 text-xs font-semibold mb-2 tracking-wider">PAÍSES UE</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {paisesUE.map(pais => (
                        <div key={pais} className="text-white/60 text-xs hover:text-yellow-500 cursor-pointer transition py-0.5">
                          {pais}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-yellow-500 transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

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

          {/* Mobile: theme + cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
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
              { href: '/#metodo', label: 'Método' },
              { href: '/#planes', label: 'Planes' },
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
