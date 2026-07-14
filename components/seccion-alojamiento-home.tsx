import Link from 'next/link';
import { getHabitaciones } from '@/lib/alojamiento/quado-sync';
import { MapPin, Maximize2, Calendar, ArrowRight, Home } from 'lucide-react';

// Escaparate de habitaciones en la home — lee los mismos datos rectificados
// que /servicios/alojamiento y muestra las 3 próximas a liberarse.
export async function SeccionAlojamientoHome() {
  const habitaciones = (await getHabitaciones()).slice(0, 3);
  if (habitaciones.length === 0) return null;

  const fecha = (d: Date | null) =>
    d
      ? new Intl.DateTimeFormat('es-CH', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(d)
      : 'a confirmar';

  return (
    <section className="section relative overflow-hidden" style={{ background: '#0a0c10' }}>
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', color: '#E63946' }}
          >
            <Home className="w-3.5 h-3.5" />
            Disponibles ahora
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Habitaciones <span className="text-yellow-500">listas para entrar</span> en Zúrich
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Amuebladas, verificadas y con acompañamiento en español. La disponibilidad se actualiza directamente del propietario.
          </p>
        </div>

        {/* Cards compactas */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {habitaciones.map((h) => (
            <Link
              key={h.codigo}
              href="/servicios/alojamiento"
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0f1117] hover:border-[#E63946]/40 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative h-44 bg-black overflow-hidden">
                {h.fotos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.fotos[0]}
                    alt={`Habitación ${h.codigo} en ${h.direccion}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                <span className="absolute top-3 left-3 bg-[#E63946] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {h.codigo}
                </span>
                <div
                  className="absolute inset-x-0 bottom-0 h-16"
                  style={{ background: 'linear-gradient(to top, rgba(15,17,23,0.95), transparent)' }}
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-white font-bold">
                    {h.precio} CHF<span className="text-white/50 text-xs font-normal">/mes</span>
                  </span>
                  <span className="text-white/70 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {fecha(h.disponible)}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between text-sm text-white/55">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  <span className="truncate">{h.direccion}</span>
                </span>
                <span className="flex items-center gap-1 shrink-0 ml-3">
                  <Maximize2 className="w-3.5 h-3.5 text-[#E63946]" /> {h.metros} m²
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/servicios/alojamiento"
            className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#d32836] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Ver todas las habitaciones y reservar
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-white/30 text-xs mt-3">Reserva con la consultoría de 200 CHF · contrato revisado antes de firmar</p>
        </div>
      </div>
    </section>
  );
}
