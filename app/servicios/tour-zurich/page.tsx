'use client';

import { Navbar } from '@/components/navbar';
import { MapPin, Clock, Users, Globe, Coffee, Star, ChevronRight, MessageCircle, CheckCircle2 } from 'lucide-react';

const WHATSAPP = '+41772337353';
const AIRBNB_URL = 'https://www.airbnb.com/experiences'; // actualizar con link real
const GYG_URL = 'https://www.getyourguide.com'; // actualizar con link real

const waMsg = encodeURIComponent('Hola Kevin, me interesa el tour por Zúrich. ¿Tienes disponibilidad?');
const waUrl = `https://wa.me/${WHATSAPP.replace('+', '')}?text=${waMsg}`;

const paradas = [
  {
    numero: '01',
    lugar: 'Flussbad Oberer Letten',
    descripcion: 'El punto de inicio — la piscina fluvial más icónica de Zúrich. Donde los locales nadan, leen y desconectan del mundo.',
  },
  {
    numero: '02',
    lugar: 'Ribera del Limmat',
    descripcion: 'Caminamos río abajo por caminos que no salen en los mapas turísticos. Rincones tranquilos, arte callejero, vistas sin filtros.',
  },
  {
    numero: '03',
    lugar: 'Zúrich-West',
    descripcion: 'El antiguo barrio industrial reconvertido en hub creativo. Cafés de especialidad, locales auténticos y la Zúrich que no aparece en las postales.',
  },
  {
    numero: '04',
    lugar: 'Parada de café local',
    descripcion: 'Un café o té en un sitio que recomendaría a cualquier amigo — no una trampa para turistas.',
  },
];

const incluye = [
  'Tour guiado de 3 horas (inglés o español)',
  'Café o té en una parada local a orillas del río',
  'Recomendaciones personalizadas post-tour (enviadas por WhatsApp)',
  'Consejos reales sobre vivir, trabajar y moverse en Zúrich',
];

const trae = [
  'Calzado cómodo para caminar',
  'Ropa según el tiempo (caminamos al aire libre)',
  'Botella de agua',
];

export default function TourZurichPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 bg-[#080a0f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E63946]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', color: '#E63946' }}>
            <MapPin className="w-3.5 h-3.5" />
            Experiencia local · Zúrich
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Hidden Zürich:<br />
            <span className="text-[#E63946]">Real Local Walk</span> Along the Limmat
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Zúrich con los ojos de alguien que emigró y aprendió a conocerla de verdad. Sin guías de cartón. Sin trampas para turistas.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: Clock, texto: '3 horas' },
              { icon: Users, texto: '2 – 8 personas' },
              { icon: Globe, texto: 'Español · English' },
              { icon: Coffee, texto: 'Café incluido' },
            ].map(({ icon: Icon, texto }) => (
              <div key={texto} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/70 text-sm">
                <Icon className="w-4 h-4 text-[#E63946]" />
                {texto}
              </div>
            ))}
          </div>

          {/* Precio y CTAs */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-center mb-1">
              <span className="text-4xl font-bold text-white">55</span>
              <span className="text-white/50 text-sm ml-1">CHF / persona</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e04e53] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c1.243 0 2.25 1.007 2.25 2.25S13.243 9 12 9 9.75 7.993 9.75 6.75 10.757 4.5 12 4.5zm5.998 13.5c-.42 1.5-2.25 2.25-5.998 2.25s-5.578-.75-5.998-2.25c-.181-.646.002-1.326.496-1.822l3.004-3.004c.293-.293.677-.454 1.084-.454h2.828c.406 0 .791.161 1.084.454l3.004 3.004c.494.496.677 1.176.496 1.822z"/></svg>
                Reservar en Airbnb
              </a>
              <a
                href={GYG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55f2c] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Reservar en GetYourGuide
              </a>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/10"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Ruta */}
      <section className="py-16 px-6 bg-[#0a0c12]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#E63946] text-xs font-bold tracking-widest uppercase mb-2">La ruta</p>
          <h2 className="text-2xl font-bold text-white mb-10">Qué haremos</h2>
          <div className="flex flex-col gap-0">
            {paradas.map((p, i) => (
              <div key={p.numero} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {p.numero}
                  </div>
                  {i < paradas.length - 1 && (
                    <div className="w-px flex-1 bg-[#E63946]/20 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-white font-semibold mb-1">{p.lugar}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{p.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quién soy */}
      <section className="py-16 px-6 bg-[#080a0f]">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          <div className="w-20 h-20 rounded-full bg-[#E63946]/20 flex items-center justify-center shrink-0 text-3xl">
            🇨🇴
          </div>
          <div>
            <p className="text-[#E63946] text-xs font-bold tracking-widest uppercase mb-2">Tu guía</p>
            <h3 className="text-xl font-bold text-white mb-3">Kevin García</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Emigré de Latinoamérica a Suiza y pasé años aprendiendo cómo funciona esta ciudad de verdad — no solo lo que dice la guía turística. Fundé Migrante Global para ayudar a hispanohablantes a entender Suiza desde adentro. Este tour es mi forma de compartir lo que descubrí caminando, preguntando y equivocándome.
            </p>
            <div className="flex items-center gap-1 mt-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
              ))}
              <span className="text-white/40 text-xs ml-2">Experiencia verificada en Airbnb</span>
            </div>
          </div>
        </div>
      </section>

      {/* Incluye + trae */}
      <section className="py-16 px-6 bg-[#0a0c12]">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-[#E63946] text-xs font-bold tracking-widest uppercase mb-4">Incluido</p>
            <ul className="flex flex-col gap-3">
              {incluye.map(item => (
                <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[#F97316] text-xs font-bold tracking-widest uppercase mb-4">Qué traer</p>
            <ul className="flex flex-col gap-3">
              {trae.map(item => (
                <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#F97316] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Punto de encuentro */}
      <section className="py-12 px-6 bg-[#080a0f] border-t border-white/5">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[#E63946] text-xs font-bold tracking-widest uppercase mb-1">Punto de encuentro</p>
            <p className="text-white font-semibold">Flussbad Oberer Letten</p>
            <p className="text-white/50 text-sm">Lettensteg, 8037 Zúrich · Entrada principal</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#e04e53] text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              Airbnb · 55 CHF
            </a>
            <a
              href={GYG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55f2c] text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              GetYourGuide · 55 CHF
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 rounded-xl transition-colors border border-white/10 text-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
