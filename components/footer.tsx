import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-red-600">Migrante</span>
              <span className="text-gold"> Global</span>
            </h3>
            <p className="text-bone/70 text-sm">
              Acompañamiento profesional y honesto para tu proceso de migración a Suiza.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-bone font-semibold mb-4">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <Link href="/#servicios" className="block text-bone/70 hover:text-gold transition text-sm">
                Servicios
              </Link>
              <Link href="/#metodo" className="block text-bone/70 hover:text-gold transition text-sm">
                Método
              </Link>
              <Link href="/#planes" className="block text-bone/70 hover:text-gold transition text-sm">
                Planes y Precios
              </Link>
              <Link href="/#contacto" className="block text-bone/70 hover:text-gold transition text-sm">
                Contacto
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-bone font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-bone/70 text-sm">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>Servicios de migración a Suiza</span>
              </div>
              <div className="flex items-start gap-3 text-bone/70 text-sm">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>Contáctanos por el formulario</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray pt-8 text-center text-bone/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Migrante Global. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">
            No somos una agencia de empleo, inmobiliaria ni asesoría legal. Ofrecemos orientación y acompañamiento.
          </p>
        </div>
      </div>
    </footer>
  );
}
