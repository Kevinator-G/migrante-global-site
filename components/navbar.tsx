'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, MapPin } from 'lucide-react';
import Link from 'next/link';

const paisesUE = [
  'Alemania', 'Austria', 'Bélgica', 'Bulgaria', 'Chipre', 'Croacia', 'Dinamarca',
  'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia', 'Francia', 'Grecia',
  'Hungría', 'Irlanda', 'Italia', 'Letonia', 'Lituania', 'Luxemburgo', 'Malta',
  'Países Bajos', 'Polonia', 'Portugal', 'República Checa', 'Rumanía', 'Suecia'
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-bone flex items-center gap-2">
            <span className="text-red-600">Migrante</span>
            <span className="text-gold">Global</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#servicios" className="text-bone hover:text-gold transition">
              Servicios
            </Link>
            <Link href="/#metodo" className="text-bone hover:text-gold transition">
              Método
            </Link>
            <Link href="/#planes" className="text-bone hover:text-gold transition">
              Planes
            </Link>
            
            {/* Dropdown de países */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 text-bone hover:text-gold transition"
              >
                <MapPin className="w-4 h-4" />
                Países
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full right-0 mt-2 w-64 bg-dark border border-gray rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto"
                >
                  <div className="mb-3">
                    <div className="text-gold font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">🇨🇭</span>
                      Suiza (Principal)
                    </div>
                    <div className="text-bone/80 text-sm">Nuestro enfoque principal</div>
                  </div>
                  <div className="border-t border-gray pt-3">
                    <div className="text-bone/60 text-xs font-semibold mb-2">PAÍSES UE</div>
                    <div className="grid grid-cols-2 gap-2">
                      {paisesUE.map((pais) => (
                        <div key={pais} className="text-bone/70 text-sm hover:text-gold cursor-pointer transition">
                          {pais}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/#contacto" className="btn-primary">
              Contacto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-bone"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/#servicios"
              className="block text-bone hover:text-gold transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="/#metodo"
              className="block text-bone hover:text-gold transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Método
            </Link>
            <Link
              href="/#planes"
              className="block text-bone hover:text-gold transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Planes
            </Link>
            <Link
              href="/#contacto"
              className="block btn-primary inline-block"
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
