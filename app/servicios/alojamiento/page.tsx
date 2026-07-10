'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { MapPin, Calendar, Maximize2, ChevronLeft, ChevronRight, MessageCircle, CheckCircle2, Home, FileText, ChevronDown } from 'lucide-react';

const WHATSAPP = '+41772337353';

const habitaciones = [
  {
    codigo: 'CS1',
    disponible: '06 jul 2026',
    precio: 1250,
    deposito: 1000,
    metros: 15,
    direccion: 'Haldenstrasse 20, 8620 Wetzikon',
    fotos: [
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/6b141bd3-8b90-4f35-b9d5-c7c23195f251/IMG_9863.jpeg',
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/e69954de-addb-4f49-9035-a23d9b2642d9/IMG_9864.jpeg',
    ],
  },
  {
    codigo: 'CS2',
    disponible: '01 ago 2026',
    precio: 1250,
    deposito: 1000,
    metros: 15,
    direccion: 'Haldenstrasse 20, 8620 Wetzikon',
    fotos: [
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/83ce783d-851a-4ebc-8a9e-8e3da04c30a0/IMG_9861.jpeg',
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/7f3bf664-b359-4d27-a2e7-c1fdcc22d5c8/IMG_9862.jpeg',
    ],
  },
  {
    codigo: 'CS3',
    disponible: '01 ago 2026',
    precio: 1250,
    deposito: 1000,
    metros: 23,
    direccion: 'Tösstalstrasse 4, 8620 Wetzikon',
    fotos: [
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/e58c613b-6c9a-4790-b704-2482e862256d/WhatsApp+Image+2026-06-30+at+21.10.44.jpeg',
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/decb8e2f-f64f-476d-8ef3-b34d5433846a/WhatsApp+Image+2026-06-30+at+21.10.44+%281%29.jpeg',
    ],
  },
  {
    codigo: 'CS4',
    disponible: '01 sep 2026',
    precio: 1150,
    deposito: 1000,
    metros: 15,
    direccion: 'Tösstalstrasse 4, 8620 Wetzikon',
    fotos: [
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/7b5257e1-cde4-43d2-aab0-ca57fb31753b/WhatsApp+Image+2026-06-18+at+08.19.20+%282%29.jpeg',
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/b32e5e4b-6452-4c39-8fc9-0017e6393274/WhatsApp+Image+2026-06-18+at+08.19.20+%283%29.jpeg',
    ],
  },
];

function HabitacionCard({ h }: { h: (typeof habitaciones)[0] }) {
  const [foto, setFoto] = useState(0);

  const prev = () => setFoto((f) => (f === 0 ? h.fotos.length - 1 : f - 1));
  const next = () => setFoto((f) => (f === h.fotos.length - 1 ? 0 : f + 1));

  const mensaje = encodeURIComponent(
    `Hola Kevin, me interesa la habitación ${h.codigo} en ${h.direccion} (${h.precio} CHF/mes). ¿Podemos hablar?`
  );
  const waUrl = `https://wa.me/${WHATSAPP.replace('+', '')}?text=${mensaje}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f1117] flex flex-col">
      {/* Foto carousel */}
      <div className="relative h-56 bg-black overflow-hidden group">
        <img
          src={h.fotos[foto]}
          alt={`Habitación ${h.codigo}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        {h.fotos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {h.fotos.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === foto ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
        {/* Badge código */}
        <div className="absolute top-3 left-3 bg-[#E63946] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {h.codigo}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2 text-white/60 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#E63946]" />
            <span>{h.direccion}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-[#E63946]" />
              {h.metros} m²
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E63946]" />
              Disponible {h.disponible}
            </span>
          </div>
        </div>

        {/* Precios */}
        <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Alquiler mensual</span>
            <span className="text-white font-bold text-lg">{h.precio} CHF<span className="text-white/40 text-xs font-normal">/mes</span></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Depósito</span>
            <span className="text-white/80 text-sm">{h.deposito} CHF</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-[#F97316] text-sm font-medium">Consultoría Kevin</span>
            <span className="text-[#F97316] font-bold">200 CHF</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Me interesa esta habitación
        </a>
      </div>
    </div>
  );
}

export default function AlojamientoPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center bg-[#080a0f]">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', color: '#E63946' }}>
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
            { num: '2', texto: 'Me escribes por WhatsApp — hablamos y te oriento' },
            { num: '3', texto: 'Te conecto con el propietario y cierras el contrato' },
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

      {/* Grid habitaciones */}
      <section className="py-16 px-6 bg-[#080a0f]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Habitaciones disponibles</h2>
          <p className="text-white/50 text-sm mb-10">Actualizadas en julio 2026 · Wetzikon, cantón de Zúrich</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {habitaciones.map((h) => (
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
                a: 'La consultoría se paga una sola vez, directamente conmigo (Twint o transferencia), cuando decides avanzar con una habitación. Es independiente del alquiler: el precio de la habitación lo pagas directamente al propietario.',
              },
              {
                q: '¿Qué pasa si la habitación que quiero ya está ocupada?',
                a: 'Las habitaciones se actualizan cada mes. Si la que te interesa ya no está disponible, te aviso apenas se libere una similar y te ayudo a buscar alternativas en la zona.',
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
