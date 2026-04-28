import Link from 'next/link';
import { Mail, MapPin, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0a0b0d] border-t border-white/5 py-14">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-red-600">Migrante</span>
              <span className="text-yellow-500"> Global</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Orientación profesional y honesta para hispanohablantes que quieren emigrar a Suiza y Europa.
              La migración no se improvisa — se planifica.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.instagram.com/kevin.migranteglobal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Migrante Global"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-600/40 flex items-center justify-center text-white/50 hover:text-red-400 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/migranteglobal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Migrante Global"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-600/40 flex items-center justify-center text-white/50 hover:text-blue-400 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/41000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Migrante Global"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-green-600/20 border border-white/10 hover:border-green-600/40 flex items-center justify-center text-white/50 hover:text-green-400 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Servicios</h4>
            <div className="space-y-2.5">
              {[
                ['Orientación Laboral', '/servicios/orientacion-laboral'],
                ['CV Formato Suizo', '/servicios/cv-formato-suizo'],
                ['Trámites', '/servicios/tramites'],
                ['Alojamiento', '/servicios/alojamiento'],
                ['Comunidad de Apoyo', '/servicios/comunidad-apoyo'],
                ['Sesiones 1:1', '/servicios/sesiones-uno-a-uno'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-white/45 hover:text-yellow-500 transition text-sm"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-white/45 text-sm">
                <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Servicios digitales para hispanohablantes en proceso de migración</span>
              </div>
              <div className="flex items-start gap-3 text-white/45 text-sm">
                <Mail className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:hola@migranteglobal.ch"
                  className="hover:text-yellow-500 transition"
                >
                  hola@migranteglobal.ch
                </a>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/#contacto"
                className="inline-block btn-primary text-sm px-5 py-2.5"
              >
                Contactar ahora
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-sm">
          <p>&copy; {new Date().getFullYear()} Migrante Global. Todos los derechos reservados.</p>
          <p className="text-xs text-center md:text-right">
            No somos agencia de empleo, inmobiliaria ni asesoría legal. Ofrecemos orientación y acompañamiento.
          </p>
        </div>
      </div>
    </footer>
  );
}
