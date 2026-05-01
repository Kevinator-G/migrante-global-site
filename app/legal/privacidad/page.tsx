import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | Migrante Global',
  description: 'Cómo Migrante Global trata y protege tus datos personales.',
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20" style={{ background: '#0a0c10', minHeight: '100vh' }}>
        <div className="max-w-[780px] mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
          <p className="text-white/40 text-sm mb-10">Última actualización: abril 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-white/70 text-sm leading-relaxed">

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Responsable del tratamiento</h2>
              <p>
                <strong className="text-white">Migrante Global</strong><br />
                Zúrich, Suiza<br />
                Email: <a href="mailto:hola@migranteglobal.ch" className="text-yellow-500 hover:underline">hola@migranteglobal.ch</a><br />
                WhatsApp: +41 77 233 73 53
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Datos que recopilamos</h2>
              <ul className="list-disc list-inside space-y-1 text-white/55">
                <li><strong className="text-white/80">Formulario de contacto:</strong> nombre, email, teléfono, país de origen y mensaje</li>
                <li><strong className="text-white/80">Carrito de servicios:</strong> servicios seleccionados (almacenados localmente)</li>
                <li><strong className="text-white/80">Datos de uso:</strong> páginas visitadas, tiempo en el sitio (solo con consentimiento analítico)</li>
                <li><strong className="text-white/80">Comunicaciones:</strong> mensajes enviados por email o WhatsApp</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Finalidad y base legal</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-white/80 font-semibold text-xs mb-1">Responder consultas y prestar servicios</p>
                  <p className="text-xs text-white/45">Base legal: ejecución de contrato / interés legítimo (art. 6.1.b y 6.1.f RGPD · art. 31 nLPD)</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-white/80 font-semibold text-xs mb-1">Mejora del sitio web (analítica)</p>
                  <p className="text-xs text-white/45">Base legal: consentimiento explícito (art. 6.1.a RGPD). Puedes retirarlo en cualquier momento.</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-white/80 font-semibold text-xs mb-1">Comunicaciones comerciales</p>
                  <p className="text-xs text-white/45">Solo si has dado tu consentimiento explícito. Puedes darte de baja en cualquier momento.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Conservación de datos</h2>
              <p>
                Conservamos tus datos el tiempo necesario para prestarte el servicio y cumplir con las
                obligaciones legales aplicables, un máximo de <strong className="text-white">3 años</strong> desde
                el último contacto, salvo que ejercites tu derecho de supresión antes.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Terceros y transferencias</h2>
              <p>No vendemos ni cedemos tus datos a terceros. Trabajamos con los siguientes proveedores que pueden acceder a datos en calidad de encargados:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/55">
                <li><strong className="text-white/80">Brevo (Sendinblue):</strong> envío de emails. Política: <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">brevo.com</a></li>
                <li><strong className="text-white/80">Vercel:</strong> alojamiento del sitio web. Política: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">vercel.com</a></li>
                <li><strong className="text-white/80">Google (YouTube):</strong> videos embebidos. Política: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">policies.google.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Tus derechos</h2>
              <p>De acuerdo con el RGPD y la nLPD suiza, tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/55">
                <li><strong className="text-white/80">Acceso:</strong> saber qué datos tenemos sobre ti</li>
                <li><strong className="text-white/80">Rectificación:</strong> corregir datos inexactos</li>
                <li><strong className="text-white/80">Supresión:</strong> solicitar el borrado de tus datos</li>
                <li><strong className="text-white/80">Portabilidad:</strong> recibir tus datos en formato estructurado</li>
                <li><strong className="text-white/80">Oposición:</strong> oponerte al tratamiento basado en interés legítimo</li>
                <li><strong className="text-white/80">Retirada de consentimiento:</strong> en cualquier momento, sin efecto retroactivo</li>
              </ul>
              <p className="mt-3">
                Para ejercer cualquier derecho, escríbenos a{' '}
                <a href="mailto:hola@migranteglobal.ch" className="text-yellow-500 hover:underline">hola@migranteglobal.ch</a>.
                Responderemos en un plazo máximo de 30 días.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Seguridad</h2>
              <p>
                Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos: conexión HTTPS,
                acceso restringido y almacenamiento seguro. Ningún sistema es 100% seguro, pero hacemos todo
                lo razonablemente posible para proteger tu información.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Cookies</h2>
              <p>
                Para información detallada sobre las cookies que utilizamos, consulta nuestra{' '}
                <Link href="/legal/cookies" className="text-yellow-500 hover:underline">
                  Política de Cookies
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">Cambios en esta política</h2>
              <p>
                Podemos actualizar esta política en cualquier momento. La fecha de actualización al inicio
                de esta página siempre refleja la versión vigente. Te notificaremos los cambios relevantes
                por email si eres cliente.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
