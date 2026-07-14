'use client';

import { useState } from 'react';
import { MapPin, Calendar, Maximize2, ChevronLeft, ChevronRight, CreditCard, BedDouble } from 'lucide-react';

// Enlace de pago de Stripe (live) — Consultoría de alojamiento 200 CHF.
// client_reference_id lleva el código de la habitación para verlo en el dashboard.
const STRIPE_CONSULTORIA = 'https://buy.stripe.com/14A7sEaVg5gH2gt6fX5sA01';

export interface HabitacionView {
  codigo: string;
  tipoLabel: string; // 'Individual' | 'Doble' | 'Individual o doble'
  disponible: string; // ya formateada, ej. '01 sep 2026'
  precio: number;
  precioDoble: number | null;
  deposito: number;
  metros: number;
  direccion: string;
  fotos: string[];
}

export function HabitacionCard({ h }: { h: HabitacionView }) {
  const [foto, setFoto] = useState(0);

  const prev = () => setFoto((f) => (f === 0 ? h.fotos.length - 1 : f - 1));
  const next = () => setFoto((f) => (f === h.fotos.length - 1 ? 0 : f + 1));

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f1117] flex flex-col">
      {/* Foto carousel */}
      <div className="relative h-56 bg-black overflow-hidden group">
        {h.fotos.length > 0 ? (
          <img
            src={h.fotos[foto]}
            alt={`Habitación ${h.codigo}`}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1d26] to-[#0f1117]">
            <BedDouble className="w-10 h-10 text-white/20" />
          </div>
        )}
        {h.fotos.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              aria-label="Foto siguiente"
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
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-[#E63946] text-white text-xs font-bold px-2.5 py-1 rounded-full">{h.codigo}</span>
          <span className="bg-black/60 text-white/90 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {h.tipoLabel}
          </span>
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
            <span className="text-white font-bold text-lg">
              {h.precio} CHF<span className="text-white/40 text-xs font-normal">/mes</span>
            </span>
          </div>
          {h.precioDoble && (
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Como doble</span>
              <span className="text-white/80 text-sm">{h.precioDoble} CHF/mes</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Depósito</span>
            <span className="text-white/80 text-sm">{h.deposito} CHF</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-[#F97316] text-sm font-medium">Consultoría Kevin</span>
            <span className="text-[#F97316] font-bold">200 CHF</span>
          </div>
        </div>

        {/* CTA — el pago es el filtro del lead: sin consultoría pagada no hay gestión */}
        <div className="mt-auto flex flex-col gap-2">
          <a
            href={`${STRIPE_CONSULTORIA}?client_reference_id=${h.codigo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6a06] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Reservar esta habitación · 200 CHF
          </a>
          <p className="text-white/35 text-xs text-center">
            Pagas la consultoría y te escribo por WhatsApp en horas para gestionar tu habitación
          </p>
        </div>
      </div>
    </div>
  );
}
