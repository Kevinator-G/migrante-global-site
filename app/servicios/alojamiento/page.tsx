import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { HabitacionCard, type HabitacionView } from '@/components/habitacion-card';
import { PagoBanner } from '@/components/pago-banner';
import { getHabitaciones } from '@/lib/alojamiento/quado-sync';
import { MessageCircle, CheckCircle2, Home, FileText, ChevronDown } from 'lucide-react';

// La página se auto-rectifica: en cada revalidación vuelve a leer la web de
// Domenico (quadoimmobilien.com/camere), actualiza fechas/precios/habitaciones
// en la DB y recién entonces las muestra.
export const revalidate = 3600;

const WHATSAPP = '+41772337353';

const TIPO_LABEL: Record<string, string> = {
  singola: 'Individual',
  doppia: 'Doble',
  'singola o doppia': 'Individual o doble',
};

function formatearFecha(d: Date | null): string {
  if (!d) return 'a confirmar';
  return new Intl.DateTimeFormat('es-CH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export default async function AlojamientoPage() {
  const habitaciones = await getHabitaciones();

  const vistas: HabitacionView[] = habitaciones.map((h) => ({
    codigo: h.codigo,
    tipoLabel: TIPO_LABEL[h.tipo] ?? 'Individual',
    disponible: formatearFecha(h.disponible),
    precio: h.precio,
    precioDoble: h.precioDoble,
    deposito: h.deposito,
    metros: h.metros,
    direccion: h.direccion,
    fotos: h.fotos,
  }));

  const mesActual = new Intl.DateTimeFormat('es-CH', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <>
      <Navbar />
      <PagoBanner />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center bg-[#080a0f]">
        <div className="max-w-2xl mx-auto">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', color: '#E63946' }}
          >
            <Home className="w-3.5 h-3.5" />
            Habitaciones disponibles en Suiza
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Encuentra tu habitación<br />con acompañamiento real
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Habitaciones verificadas en el cantón de Zúrich. Yo me encargo de orientarte, revisar el contrato y acompañarte en el proceso — tú decides.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-10 px-6 bg-[#0a0c12] border-y border-white/5">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { num: '1', texto: 'Elige la habitación que te interesa' },
            { num: '2', texto: 'Reservas pagando la consultoría (200 CHF) — online y seguro' },
            { num: '3', texto: 'Te escribo en horas: reviso el contrato y te conecto con el propietario' },
          ].map((paso) => (
            <div key={paso.num} className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center text-white font-bold text-sm">
                {paso.num}
              </div>
              <p className="text-white/70 text-sm">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid habitaciones — datos rectificados desde la fuente */}
      <section className="py-16 px-6 bg-[#080a0f]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Habitaciones disponibles</h2>
          <p className="text-white/50 text-sm mb-10">
            Disponibilidad verificada · {mesActual} · Cantón de Zúrich
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {vistas.map((h) => (
              <HabitacionCard key={h.codigo} h={h} />
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye la consultoría */}
      <section className="py-16 px-6 bg-[#0a0c12]">
        <div className="max-w-2xl mx-auto">
          <div className="border border-[#F97316]/30 rounded-2xl p-8 bg-[#F97316]/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <p className="text-[#F97316] text-xs font-bold tracking-widest uppercase">Consultoría de acompañamiento</p>
                <p className="text-white font-bold text-xl">200 CHF · Pago único</p>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                'Orientación sobre el proceso de alquiler en Suiza (Kaution, contrato, derechos)',
                'Revisión del contrato de alquiler antes de firmar',
                'Acompañamiento durante la comunicación con el propietario',
                'Guía de primeros pasos en la zona (transporte, supermercados, servicios)',
                'Soporte por WhatsApp durante 30 días desde el primer contacto',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#F97316] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-white/40 text-xs">
              La consultoría es independiente del alquiler. El precio de la habitación lo pagas directamente al propietario.
            </p>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-16 px-6 bg-[#080a0f]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Qué necesitas para alquilar</h2>
          <p className="text-white/50 text-sm mb-8">Documentos que el propietario suele pedir antes de firmar</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { titulo: 'Documento de identidad', detalle: 'Pasaporte o cédula vigente' },
              { titulo: 'Permiso de residencia', detalle: 'Permiso B, L o visa en trámite — te oriento si aún no lo tienes' },
              { titulo: 'Comprobante de ingresos', detalle: 'Contrato de trabajo o extractos bancarios recientes' },
              { titulo: 'Depósito (Kaution)', detalle: '1.000 CHF que se devuelven al terminar el contrato' },
            ].map((req) => (
              <div key={req.titulo} className="border border-white/10 rounded-xl p-5 bg-[#0f1117] flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#E63946] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{req.titulo}</p>
                  <p className="text-white/50 text-sm">{req.detalle}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-white/40 text-xs">
            ¿Te falta alguno? Escríbeme igual — parte de mi consultoría es ayudarte a preparar el expediente para que el propietario te acepte.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-[#0a0c12] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Preguntas frecuentes</h2>
          <div className="flex flex-col gap-3">
            {[
              {
                q: '¿Puedo reservar una habitación si todavía no estoy en Suiza?',
                a: 'Sí. Muchos de mis clientes cierran el contrato antes de llegar. Yo reviso el contrato, verifico la habitación y te acompaño en todo el proceso a distancia para que llegues con tu alojamiento resuelto.',
              },
              {
                q: '¿El precio del alquiler incluye los gastos (agua, luz, internet)?',
                a: 'Las habitaciones son amuebladas y el precio incluye los gastos básicos (Nebenkosten). Los detalles exactos los confirmamos con el propietario antes de firmar — eso es parte de lo que reviso contigo.',
              },
              {
                q: '¿Qué es el depósito y cuándo lo recupero?',
                a: 'El depósito (Kaution) es una garantía de 1.000 CHF que pide el propietario. Se devuelve al terminar el contrato si la habitación queda en buen estado. En Suiza es una práctica estándar y está regulada por ley.',
              },
              {
                q: '¿Cómo y cuándo pago la consultoría de 200 CHF?',
                a: 'Se paga una sola vez, online con tarjeta desde el botón "Reservar" de cada habitación (pago seguro con Stripe). Con el pago aseguras mi acompañamiento y te contacto en horas. Es independiente del alquiler: el precio de la habitación lo pagas directamente al propietario.',
              },
              {
                q: '¿Qué pasa si la habitación que quiero ya está ocupada?',
                a: 'La disponibilidad se sincroniza directamente con el propietario. Si la que te interesa ya no está disponible, te aviso apenas se libere una similar y te ayudo a buscar alternativas en la zona.',
              },
            ].map((faq) => (
              <details key={faq.q} className="group border border-white/10 rounded-xl bg-[#0f1117] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none text-white font-medium text-sm hover:bg-white/5 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-[#E63946] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          {/* CTA final */}
          <div className="mt-10 text-center">
            <a
              href={`https://wa.me/${WHATSAPP.replace('+', '')}?text=${encodeURIComponent('Hola Kevin, tengo una pregunta sobre las habitaciones en Wetzikon.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              ¿Otra duda? Escríbeme por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
