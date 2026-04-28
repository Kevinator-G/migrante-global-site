import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Cookies | Migrante Global',
  description: 'Información sobre las cookies que utiliza Migrante Global y cómo gestionarlas.',
};

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20" style={{ background: '#0a0c10', minHeight: '100vh' }}>
        <div className="max-w-[780px] mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Política de Cookies</h1>
          <p className="text-white/40 text-sm mb-10">Última actualización: abril 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-white/70 text-sm leading-relaxed">

            <section>
              <h2 className="text-white text-lg font-bold mb-3">¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas.
                Sirven para recordar preferencias, mantener sesiones activas y recopilar información sobre cómo se utiliza el sitio.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Cookies que utilizamos</h2>

              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="text-white font-semibold mb-1 text-sm">🔒 Cookies esenciales (siempre activas)</h3>
                  <p className="text-xs text-white/50 mb-3">Necesarias para el funcionamiento básico del sitio. No requieren consentimiento.</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/40">
                        <th className="text-left pb-2">Nombre</th>
                        <th className="text-left pb-2">Finalidad</th>
                        <th className="text-left pb-2">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/55 space-y-1">
                      <tr><td className="py-1 pr-4 font-mono">cookie-consent</td><td className="pr-4">Almacena tu preferencia de cookies</td><td>1 año</td></tr>
                      <tr><td className="py-1 pr-4 font-mono">next-auth.session</td><td className="pr-4">Gestión de sesión de usuario</td><td>Sesión</td></tr>
                      <tr><td className="py-1 pr-4 font-mono">cart-items</td><td className="pr-4">Contenido del carrito de servicios</td><td>7 días</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="text-white font-semibold mb-1 text-sm">📊 Cookies analíticas (opcionales)</h3>
                  <p className="text-xs text-white/50 mb-3">Solo se activan si das tu consentimiento. Nos ayudan a mejorar el sitio.</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/40">
                        <th className="text-left pb-2">Proveedor</th>
                        <th className="text-left pb-2">Finalidad</th>
                        <th className="text-left pb-2">Política</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/55">
                      <tr><td className="py-1 pr-4">Google (YouTube)</td><td className="pr-4">Reproducción de videos embebidos</td><td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">Ver política</a></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Cookies de terceros — YouTube</h2>
              <p>
                Nuestro sitio incluye videos embebidos de YouTube (Google LLC). Cuando reproduces un video,
                YouTube puede instalar cookies en tu dispositivo para rastrear visualizaciones y mostrarte
                publicidad personalizada. Estas cookies están sujetas a la{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">
                  Política de Privacidad de Google
                </a>
                . Solo se activan si aceptas las cookies analíticas.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Cómo gestionar tus cookies</h2>
              <p>Puedes modificar tus preferencias en cualquier momento:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/55">
                <li>Borrando las cookies desde la configuración de tu navegador</li>
                <li>Contactándonos en <a href="mailto:hola@migranteglobal.ch" className="text-yellow-500 hover:underline">hola@migranteglobal.ch</a> para restablecer tu consentimiento</li>
              </ul>
              <p className="mt-3">
                Ten en cuenta que desactivar las cookies esenciales puede afectar al funcionamiento del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Base legal</h2>
              <p>
                El uso de cookies esenciales se basa en nuestro interés legítimo para proporcionar el servicio
                solicitado (art. 6.1.f RGPD / nLPD suiza). Las cookies analíticas se procesan únicamente
                con tu consentimiento explícito (art. 6.1.a RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Contacto</h2>
              <p>
                Para cualquier consulta sobre el uso de cookies o tus datos personales, escríbenos a{' '}
                <a href="mailto:hola@migranteglobal.ch" className="text-yellow-500 hover:underline">
                  hola@migranteglobal.ch
                </a>
                . También puedes consultar nuestra{' '}
                <Link href="/legal/privacidad" className="text-yellow-500 hover:underline">
                  Política de Privacidad
                </Link>
                .
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
