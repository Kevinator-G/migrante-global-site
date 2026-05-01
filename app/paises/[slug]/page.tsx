import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

// ── Country data ───────────────────────────────────────────────────────────
interface CountryInfo {
  name: string;
  emoji: string;
  heroImage: string;
  tipoAcceso: string;
  permisoInicial: string;
  idiomaPrincipal: string;
  dificultad: 'Baja' | 'Media' | 'Alta' | 'Muy alta';
  puntosClave: string[];
  advertencia?: string;
  destacado?: boolean;
}

const COUNTRIES: Record<string, CountryInfo> = {
  suiza: {
    name: 'Suiza',
    emoji: '🇨🇭',
    heroImage: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE/AELC + cuotas para no-comunitarios',
    permisoInicial: 'Permiso B (residencia temporal, 1 año renovable)',
    idiomaPrincipal: 'Alemán · Francés · Italiano (según cantón)',
    dificultad: 'Media',
    destacado: true,
    puntosClave: [
      'Salario mínimo sectorial entre 3.500–5.000 CHF/mes',
      'Calidad de vida top 3 mundial según EIU',
      'Permiso B con contrato de trabajo — proceso en 1–3 meses',
      'Seguro médico obligatorio desde el día 1 (~350–550 CHF/mes)',
      'Alemán básico (A2) recomendado para la mayoría de sectores',
      'Gran demanda en sanidad, IT, construcción e ingeniería',
    ],
  },
  alemania: {
    name: 'Alemania',
    emoji: '🇩🇪',
    heroImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Visa de trabajo para no-comunitarios',
    permisoInicial: 'Niederlassungserlaubnis o Aufenthaltserlaubnis',
    idiomaPrincipal: 'Alemán (B1-B2 para la mayoría de trabajos)',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo legal: 12,41 €/hora (2024)',
      'Visado de oportunidad (Chancenkarte) para no-comunitarios cualificados',
      'Reconocimiento de títulos vía Anabin y KMK',
      'Sistema de salud público de alta calidad',
      'Alta demanda de técnicos, enfermeros e ingenieros',
    ],
    advertencia: 'El nivel de alemán requerido es más alto que en Suiza para trabajos de oficina.',
  },
  austria: {
    name: 'Austria',
    emoji: '🇦🇹',
    heroImage: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Sistema de puntos (Rot-Weiß-Rot) para no-comunitarios',
    permisoInicial: 'Rot-Weiß-Rot Karte (Tarjeta Rojo-Blanco-Rojo)',
    idiomaPrincipal: 'Alemán',
    dificultad: 'Media',
    puntosClave: [
      'Sistema de puntos para trabajadores cualificados no-UE',
      'Salario mínimo sectorial según convenio',
      'Alta calidad de vida, especialmente en Viena',
      'Demanda en sanidad, turismo e IT',
    ],
    advertencia: 'El proceso de puntos puede tardar 3–6 meses. Requiere planificación anticipada.',
  },
  francia: {
    name: 'Francia',
    emoji: '🇫🇷',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Visa Talent Passport para no-comunitarios',
    permisoInicial: 'Titre de séjour (tarjeta de residencia)',
    idiomaPrincipal: 'Francés (esencial para vivir y trabajar)',
    dificultad: 'Alta',
    puntosClave: [
      'Salario mínimo (SMIC): 11,65 €/hora (2024)',
      'Passport Talent para trabajadores altamente cualificados',
      'Sistema de salud público (Sécurité Sociale) de alta calidad',
      'París: hub financiero y tecnológico europeo',
    ],
    advertencia: 'Sin nivel B2 de francés, las oportunidades laborales se reducen drásticamente.',
  },
  espana: {
    name: 'España',
    emoji: '🇪🇸',
    heroImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Sin restricciones para latinoamericanos con doble nacionalidad UE · Visa para el resto',
    permisoInicial: 'Tarjeta de residencia o NIE',
    idiomaPrincipal: 'Español (ventaja para latinos)',
    dificultad: 'Baja',
    puntosClave: [
      'Sin barrera de idioma para hispanohablantes',
      'Visa Digital Nomad para trabajadores remotos (+€2.160/mes)',
      'Salario mínimo: 1.134 €/mes (2024)',
      'Alta tasa de desempleo vs. Suiza — mercado más competitivo',
      'Puerta de entrada al espacio Schengen',
    ],
    advertencia: 'El salario medio es significativamente menor que en Suiza o Alemania. Muchos lo usan como trampolín hacia Europa central.',
  },
  italia: {
    name: 'Italia',
    emoji: '🇮🇹',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Decreto Flujos (cuotas anuales) para no-comunitarios',
    permisoInicial: 'Permesso di Soggiorno',
    idiomaPrincipal: 'Italiano',
    dificultad: 'Alta',
    puntosClave: [
      'Salario mínimo no unificado (varía por convenio sectorial)',
      'Sistema Decreto Flujos: cuotas muy limitadas para no-comunitarios',
      'Alta burocracia administrativa',
      'Norte de Italia (Milán, Turín) con más oportunidades laborales',
    ],
    advertencia: 'El Decreto Flujos abre ventanas muy cortas y con alta demanda. La burocracia es significativa.',
  },
  portugal: {
    name: 'Portugal',
    emoji: '🇵🇹',
    heroImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Visado D (incluyendo D8 para nómadas digitales)',
    permisoInicial: 'Autorização de Residência',
    idiomaPrincipal: 'Portugués (comprensible para hispanohablantes)',
    dificultad: 'Baja',
    puntosClave: [
      'Salario mínimo: 820 €/mes (2024)',
      'Comunidad latinoamericana muy establecida',
      'Proceso de residencia relativamente ágil',
      'Lisboa y Oporto: ecosistema startup en crecimiento',
      'Costo de vida más bajo que Europa central',
    ],
    advertencia: 'Los salarios son notablemente más bajos que en Suiza o Alemania.',
  },
  'paises-bajos': {
    name: 'Países Bajos',
    emoji: '🇳🇱',
    heroImage: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · MVV (permiso temporal) para no-comunitarios',
    permisoInicial: 'Verblijfsvergunning (permiso de residencia)',
    idiomaPrincipal: 'Neerlandés · Inglés ampliamente aceptado en empresas',
    dificultad: 'Media',
    puntosClave: [
      'Ámsterdam: hub internacional con muchas empresas en inglés',
      'Salario mínimo: 13,27 €/hora (2024)',
      'Régimen 30% ruling para trabajadores internacionales cualificados',
      'Alta calidad de vida y excelente transporte público',
    ],
    advertencia: 'El mercado de vivienda en Ámsterdam es muy competitivo y caro.',
  },
  belgica: {
    name: 'Bélgica',
    emoji: '🇧🇪',
    heroImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Autorización de trabajo para no-comunitarios',
    permisoInicial: 'Titre de séjour / Verblijfstitel',
    idiomaPrincipal: 'Francés · Neerlandés · Alemán (según región)',
    dificultad: 'Alta',
    puntosClave: [
      'Sede de la UE y OTAN — muchas organizaciones internacionales',
      'Salario mínimo: 1.985 €/mes (2024)',
      'Complejidad administrativa alta por estructura federal',
      'Bruselas funciona principalmente en inglés y francés',
    ],
    advertencia: 'La complejidad lingüística y burocrática de Bélgica es significativa.',
  },
  luxemburgo: {
    name: 'Luxemburgo',
    emoji: '🇱🇺',
    heroImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Autorización de trabajo para no-comunitarios',
    permisoInicial: 'Autorisation de séjour',
    idiomaPrincipal: 'Luxemburgués · Francés · Alemán',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo más alto de la UE: ~2.570 €/mes',
      'Hub financiero europeo — muchos empleos en banca y finanzas',
      'Muchos residentes trabajan en Luxemburgo y viven en países vecinos',
      'Alta calidad de vida y ambiente multicultural',
    ],
  },
  irlanda: {
    name: 'Irlanda',
    emoji: '🇮🇪',
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Visa Critical Skills para no-comunitarios',
    permisoInicial: 'Irish Residence Permit (IRP) — tarjeta de residencia anual renovable',
    idiomaPrincipal: 'Inglés (gran ventaja para personas con nivel B2+)',
    dificultad: 'Media',
    puntosClave: [
      'Hub tecnológico europeo: sede de Google, Meta, Apple, Microsoft y LinkedIn',
      'Salario mínimo: 12,70 €/hora (2024)',
      'Visa Critical Skills: vía rápida para perfiles IT, ingeniería y sanidad',
      'Permiso de trabajo en 8–12 semanas con oferta de empleo en mano',
      'Sin barrera de idioma para quienes tienen inglés B2+',
      'Acceso directo al mercado laboral del Reino Unido (zona CTA)',
    ],
    advertencia: 'El coste de vivienda en Dublín es muy alto. Planifica al menos 3–4 meses de ahorro previo.',
  },
  suecia: {
    name: 'Suecia',
    emoji: '🇸🇪',
    heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Uppehållstillstånd (permiso de residencia)',
    idiomaPrincipal: 'Sueco · Inglés muy extendido en empresas',
    dificultad: 'Media',
    puntosClave: [
      'No hay salario mínimo legal — se negocia por convenio',
      'Alta demanda en IT, ingeniería y sanidad',
      'Excelente conciliación laboral y sistema de bienestar',
      'Inglés ampliamente hablado en el entorno laboral',
    ],
  },
  dinamarca: {
    name: 'Dinamarca',
    emoji: '🇩🇰',
    heroImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE · Pay Limit Scheme / Positive List para no-comunitarios',
    permisoInicial: 'Opholdstilladelse (permiso de residencia)',
    idiomaPrincipal: 'Danés · Inglés muy extendido',
    dificultad: 'Media',
    puntosClave: [
      'Uno de los salarios medios más altos de Europa',
      'Pay Limit Scheme: salario mínimo de ~445.000 DKK anuales para no-UE',
      'Flexicurity: alta flexibilidad laboral con protección social',
      'Muy alta calidad de vida y bienestar',
    ],
  },
  grecia: {
    name: 'Grecia',
    emoji: '🇬🇷',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Visado de trabajo para no-comunitarios',
    permisoInicial: 'Άδεια Διαμονής (Permiso de residencia)',
    idiomaPrincipal: 'Griego · Inglés en turismo y empresas internacionales',
    dificultad: 'Alta',
    puntosClave: [
      'Salario mínimo: 830 €/mes (2024)',
      'Alta tasa de desempleo — mercado laboral reducido',
      'Economía basada en turismo, transporte marítimo y agricultura',
      'Atenas y Tesalónica concentran la mayor oferta laboral',
      'Burocracia administrativa lenta y compleja',
    ],
    advertencia: 'El mercado laboral es muy reducido. Se recomienda solo si ya tienes trabajo asegurado o trabajas de forma remota.',
  },
  chipre: {
    name: 'Chipre',
    emoji: '🇨🇾',
    heroImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Visado temporal para no-comunitarios',
    permisoInicial: 'Άδεια Παραμονής (Permiso de residencia chipriota)',
    idiomaPrincipal: 'Griego · Inglés muy extendido (legado británico)',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 1.000 €/mes (2024)',
      'Inglés ampliamente hablado — gran ventaja para migrantes',
      'Sector financiero y tecnológico en crecimiento (Limassol)',
      'Impuesto de sociedades bajo: 12,5% — hub para empresas europeas',
      'Coste de vida moderado comparado con Europa occidental',
    ],
    advertencia: 'Chipre está dividida políticamente. El norte (República Turca de Chipre del Norte) no es reconocido por la UE.',
  },
  eslovenia: {
    name: 'Eslovenia',
    emoji: '🇸🇮',
    heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso único para no-comunitarios',
    permisoInicial: 'Dovoljenje za prebivanje (Permiso de residencia)',
    idiomaPrincipal: 'Esloveno · Inglés en empresas internacionales',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 1.253 €/mes (2024)',
      'Una de las economías más sólidas del antiguo bloque del Este',
      'Liubliana: ciudad pequeña con alta calidad de vida',
      'Alta demanda en IT, manufactura y turismo',
      'Naturaleza excepcional — Lago Bled, Alpes Julianos, costa adriática',
    ],
  },
  estonia: {
    name: 'Estonia',
    emoji: '🇪🇪',
    heroImage: 'https://images.unsplash.com/photo-1550240804-20dd49f71f7c?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · e-Residency + Digital Nomad Visa para no-comunitarios',
    permisoInicial: 'Elamisluba (Permiso de residencia)',
    idiomaPrincipal: 'Estonio · Inglés muy extendido en empresas y gobierno',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 820 €/mes (2024)',
      'País más digitalizado de Europa — gobierno 100% online',
      'e-Residency: gestiona una empresa europea desde cualquier país',
      'Tallin: ecosistema startup de primer nivel (Skype, TransferWise nacieron aquí)',
      'Impuestos corporativos 0% sobre beneficios reinvertidos',
      'Digital Nomad Visa para trabajadores remotos',
    ],
  },
  hungria: {
    name: 'Hungría',
    emoji: '🇭🇺',
    heroImage: 'https://images.unsplash.com/photo-1541956064527-f54898a5e3e8?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Tartózkodási engedély (Permiso de residencia)',
    idiomaPrincipal: 'Húngaro · Inglés en Budapest y multinacionales',
    dificultad: 'Alta',
    puntosClave: [
      'Salario mínimo: ~700 €/mes (2024)',
      'Budapest: ciudad vibrante con coste de vida bajo para la región',
      'Sector de manufactura, tecnología y servicios compartidos en crecimiento',
      'Muchas empresas multinacionales tienen centros de operaciones en Budapest',
      'El húngaro es uno de los idiomas más difíciles de aprender en Europa',
    ],
    advertencia: 'El húngaro es extremadamente difícil. Sin inglés fluido o sin empresa internacional, la integración es complicada.',
  },
  lituania: {
    name: 'Lituania',
    emoji: '🇱🇹',
    heroImage: 'https://images.unsplash.com/photo-1592396437994-10b7c2abb4a6?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Leidimas gyventi (Permiso de residencia)',
    idiomaPrincipal: 'Lituano · Inglés en empresas internacionales y Vilnius',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 924 €/mes (2024)',
      'Economía de más rápido crecimiento entre los países bálticos',
      'Vilnius: hub fintech y startup emergente reconocido en Europa',
      'Coste de vida significativamente más bajo que Europa occidental',
      'Comunidad expat activa en la capital',
    ],
  },
  malta: {
    name: 'Malta',
    emoji: '🇲🇹',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Single Permit para no-comunitarios',
    permisoInicial: 'Residence Permit — Identità Malta',
    idiomaPrincipal: 'Maltés · Inglés cooficial (legado británico)',
    dificultad: 'Baja',
    puntosClave: [
      'Inglés como idioma oficial — sin barrera lingüística para B2+',
      'Salario mínimo: 1.077 €/mes (2024)',
      'Hub europeo de gaming, iGaming y fintech',
      'Clima mediterráneo excepcional durante todo el año',
      'Proceso de residencia relativamente ágil',
    ],
  },
  polonia: {
    name: 'Polonia',
    emoji: '🇵🇱',
    heroImage: 'https://images.unsplash.com/photo-1562566218-dbfd5c5b7d87?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Zezwolenie na pobyt (Permiso de residencia temporal)',
    idiomaPrincipal: 'Polaco · Inglés en grandes ciudades y empresas',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 4.300 PLN/mes (~1.000 €) (2024)',
      'Una de las economías de más rápido crecimiento en la UE',
      'Varsovia y Cracovia: grandes centros de servicios y tecnología',
      'Alta demanda en IT, manufactura y logística',
      'Coste de vida más bajo que Europa occidental',
    ],
    advertencia: 'El polaco es difícil para hispanohablantes. En ciudades grandes el inglés es suficiente, pero no en zonas rurales.',
  },
  'republica-checa': {
    name: 'República Checa',
    emoji: '🇨🇿',
    heroImage: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Povolení k pobytu (Permiso de residencia)',
    idiomaPrincipal: 'Checo · Inglés en Praga y empresas internacionales',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: ~750 €/mes (2024)',
      'Praga: una de las ciudades más bellas y visitadas de Europa',
      'Economía estable con baja tasa de desempleo',
      'Alta demanda en IT, manufactura y turismo',
      'Coste de vida moderado comparado con Europa occidental',
    ],
    advertencia: 'El checo es difícil de aprender. Sin inglés, moverse fuera de Praga puede ser complicado.',
  },
  bulgaria: {
    name: 'Bulgaria',
    emoji: '🇧🇬',
    heroImage: 'https://images.unsplash.com/photo-1578615437406-511b09e9db9c?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Разрешение за пребиваване (Permiso de residencia)',
    idiomaPrincipal: 'Búlgaro · Inglés en Sofía y empresas internacionales',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo más bajo de la UE: ~477 €/mes (2024)',
      'Sofía: hub tecnológico emergente con costes muy bajos',
      'Impuesto sobre la renta plano del 10% — muy atractivo',
      'Costa del Mar Negro con turismo creciente',
      'Alta demanda en IT outsourcing y servicios empresariales',
    ],
    advertencia: 'Sueldos bajos para estándares europeos. Es ventajoso para nómadas digitales con ingresos extranjeros.',
  },
  eslovaquia: {
    name: 'Eslovaquia',
    emoji: '🇸🇰',
    heroImage: 'https://images.unsplash.com/photo-1592598419690-7c07b8de3c98?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Povolenie na pobyt (Permiso de residencia)',
    idiomaPrincipal: 'Eslovaco · Inglés en Bratislava y empresas',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 750 €/mes (2024)',
      'Bratislava: capital pequeña con acceso directo a Viena (1h)',
      'Sector del automóvil muy desarrollado (VW, Stellantis, Kia)',
      'Coste de vida bajo comparado con Austria y Alemania',
      'Alta demanda en manufactura, IT y logística',
    ],
  },
  croacia: {
    name: 'Croacia',
    emoji: '🇭🇷',
    heroImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Dozvola za boravak (Permiso de residencia)',
    idiomaPrincipal: 'Croata · Inglés en zonas turísticas y Zagreb',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: ~840 €/mes (2024)',
      'Miembro de la zona euro desde 2023 — economía en transición',
      'Zagreb: capital con mercado laboral creciente en IT y servicios',
      'Costa dálmata: turismo y hostelería como sectores clave',
      'Dubrovnik y Split: destinos premium del Mediterráneo',
    ],
    advertencia: 'Fuera de Zagreb y la costa, las oportunidades laborales se reducen considerablemente.',
  },
  finlandia: {
    name: 'Finlandia',
    emoji: '🇫🇮',
    heroImage: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de residencia para no-comunitarios',
    permisoInicial: 'Oleskelulupa (Permiso de residencia)',
    idiomaPrincipal: 'Finés · Sueco cooficial · Inglés muy extendido',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo negociado por convenio (~2.100 €/mes de media)',
      'Sistema educativo y de bienestar de los mejores del mundo',
      'Helsinki: hub tecnológico y de startups (Nokia, Supercell)',
      'Alta demanda en IT, ingeniería y sanidad',
      'El finés es difícil, pero en empresas internacionales se trabaja en inglés',
    ],
    advertencia: 'Los inviernos son largos y oscuros. El impacto en el ánimo es real — infórmate bien antes de decidir.',
  },
  letonia: {
    name: 'Letonia',
    emoji: '🇱🇻',
    heroImage: 'https://images.unsplash.com/photo-1564594985645-4427056e22e2?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de residencia para no-comunitarios',
    permisoInicial: 'Uzturēšanās atļauja (Permiso de residencia)',
    idiomaPrincipal: 'Letón · Inglés extendido · Ruso hablado por muchos',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: 700 €/mes (2024)',
      'Riga: centro histórico patrimonio UNESCO y hub báltico',
      'Economía en crecimiento con sector de IT y logística activo',
      'Coste de vida asequible para estándares europeos',
      'Comunidad expat en expansión en Riga',
    ],
  },
  rumania: {
    name: 'Rumanía',
    emoji: '🇷🇴',
    heroImage: 'https://images.unsplash.com/photo-1555785020-d7a4e2b8cce8?w=1920&q=85&auto=format&fit=crop',
    tipoAcceso: 'Libre circulación UE para comunitarios · Permiso de trabajo para no-comunitarios',
    permisoInicial: 'Permis de ședere (Permiso de residencia)',
    idiomaPrincipal: 'Rumano (lengua romance — comprensible para hispanohablantes) · Inglés en ciudades',
    dificultad: 'Media',
    puntosClave: [
      'Salario mínimo: ~700 €/mes (2024)',
      'Bucarest: uno de los mayores hubs de IT outsourcing de Europa',
      'El rumano es una lengua romance — aprendizaje más fácil para hispanohablantes',
      'Coste de vida muy bajo comparado con Europa occidental',
      'Transilvânia: paisaje y patrimonio cultural excepcional',
    ],
    advertencia: 'Aunque está en la UE, Rumanía aún no forma parte del espacio Schengen en su totalidad.',
  },
};

// Generic fallback image for unknown countries
const FALLBACK_HERO = 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=1920&q=85&auto=format&fit=crop';

function getCountryInfo(slug: string): CountryInfo {
  if (COUNTRIES[slug]) return COUNTRIES[slug];
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return {
    name,
    emoji: '🇪🇺',
    heroImage: FALLBACK_HERO,
    tipoAcceso: 'Libre circulación UE para comunitarios · Visado de trabajo para no-comunitarios',
    permisoInicial: 'Permiso de residencia según normativa local',
    idiomaPrincipal: 'Idioma oficial del país',
    dificultad: 'Media',
    puntosClave: [
      'Acceso al espacio Schengen',
      'Mercado laboral europeo',
      'Derechos laborales según normativa UE',
      'Posibilidad de moverse a otros países UE una vez establecido',
    ],
    advertencia: 'Consulta los requisitos específicos de este país antes de tomar decisiones.',
  };
}

const difficultyColor: Record<string, string> = {
  Baja: 'bg-green-500/20 text-green-400 border-green-500/30',
  Media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Alta: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Muy alta': 'bg-red-500/20 text-red-400 border-red-500/30',
};

// ── Static params — pre-genera las 28 páginas en build ────────────────────
export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((slug) => ({ slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const info = getCountryInfo(params.slug);
  return {
    title: `Emigrar a ${info.name} | Guía para hispanohablantes — Migrante Global`,
    description: `Requisitos, permisos y consejos reales para emigrar a ${info.name}. Orientación honesta para hispanohablantes de la mano de Kevin García, experto en migración europea.`,
    alternates: { canonical: `https://migranteglobal.ch/paises/${params.slug}` },
    openGraph: {
      title: `Emigrar a ${info.name} | Migrante Global`,
      description: `Guía honesta para hispanohablantes sobre cómo emigrar a ${info.name}: permisos, acceso, idioma y consejos prácticos.`,
      url: `https://migranteglobal.ch/paises/${params.slug}`,
      siteName: 'Migrante Global',
      locale: 'es_ES',
      type: 'website',
      images: [{ url: 'https://migranteglobal.ch/og-image.png', width: 1200, height: 630, alt: `Emigrar a ${info.name} — Migrante Global` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Emigrar a ${info.name} | Migrante Global`,
      description: `Guía honesta para hispanohablantes sobre cómo emigrar a ${info.name}.`,
      images: ['https://migranteglobal.ch/og-image.png'],
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PaisPage({ params }: { params: { slug: string } }) {
  const info = getCountryInfo(params.slug);
  const isSwiss = params.slug === 'suiza';

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: '#0d1117' }}>

        {/* ── Hero con imagen ── */}
        <section className="relative h-[65vh] min-h-[480px] flex items-end overflow-hidden">
          {/* Imagen de fondo */}
          <Image
            src={info.heroImage}
            alt={`${info.name} — Migrante Global`}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Overlay gradient — más oscuro abajo para leer el texto, ligero arriba */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.30) 40%, rgba(13,17,23,0.88) 80%, #0d1117 100%)',
            }}
          />

          {/* Contenido hero */}
          <div className="relative z-10 max-w-[900px] mx-auto px-6 pb-14 w-full">
            {isSwiss && (
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                style={{
                  background: 'rgba(201,169,110,0.2)',
                  color: '#c9a96e',
                  border: '1px solid rgba(201,169,110,0.4)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Nuestro destino principal
              </span>
            )}

            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl drop-shadow-lg">{info.emoji}</span>
              <h1
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
              >
                Emigrar a{' '}
                <span style={{ color: isSwiss ? '#c9a96e' : '#facc15' }}>
                  {info.name}
                </span>
              </h1>
            </div>

            <p
              className="text-white/75 text-lg max-w-xl mb-6"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
            >
              Guía honesta para hispanohablantes — lo que necesitas saber antes de tomar la decisión.
            </p>

            {/* Pills de info rápida */}
            <div className="flex flex-wrap gap-2">
              <span
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <MapPin className="w-3.5 h-3.5 opacity-70" />
                {info.idiomaPrincipal}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${difficultyColor[info.dificultad]}`}
                style={{ backdropFilter: 'blur(10px)' }}
              >
                Dificultad: {info.dificultad}
              </span>
            </div>
          </div>
        </section>

        {/* ── Contenido principal ── */}
        <section className="max-w-[900px] mx-auto px-6 py-12 space-y-8">

          {/* Advertencia */}
          {info.advertencia && (
            <div
              className="flex items-start gap-3 rounded-xl px-5 py-4"
              style={{
                background: 'rgba(251,146,60,0.08)',
                border: '1px solid rgba(251,146,60,0.25)',
              }}
            >
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-orange-300/90 text-sm">{info.advertencia}</p>
            </div>
          )}

          {/* Acceso y permiso */}
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-6"
              style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                Tipo de acceso
              </div>
              <p className="text-white text-sm leading-relaxed">{info.tipoAcceso}</p>
            </div>
            <div
              className="rounded-xl p-6"
              style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                Permiso inicial
              </div>
              <p className="text-white text-sm leading-relaxed">{info.permisoInicial}</p>
            </div>
          </div>

          {/* Puntos clave */}
          <div
            className="rounded-xl p-7"
            style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="text-white font-bold text-lg mb-5">Lo que necesitas saber</h2>
            <ul className="space-y-3">
              {info.puntosClave.map((punto, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: '#c9a96e' }}
                  />
                  {punto}
                </li>
              ))}
            </ul>
          </div>

          {/* Bloque especial Suiza */}
          {isSwiss && (
            <div
              className="rounded-xl p-7"
              style={{
                background: 'rgba(201,169,110,0.05)',
                border: '1px solid rgba(201,169,110,0.2)',
              }}
            >
              <h2 className="font-bold text-white text-lg mb-4">
                ¿Por qué Suiza y no otro país europeo?
              </h2>
              <div className="space-y-3 text-white/65 text-sm leading-relaxed">
                <p>
                  Suiza tiene el salario medio más alto de Europa. Una persona con experiencia media gana entre 4.500 y 7.000 CHF netos al mes. Eso, aunque el coste de vida es alto, deja un margen de ahorro real que en España o Italia simplemente no existe.
                </p>
                <p>
                  El sistema de permisos es claro: con un contrato de trabajo firmado, el proceso es predecible. No hay cuotas que esperar ni loterías de visados. Si te contratan, te dan el permiso.
                </p>
                <p>
                  La estabilidad política, el franco suizo, y un sistema de salud que funciona hacen de Suiza uno de los destinos migratorios más seguros del mundo. No es fácil entrar, pero una vez dentro, el sistema juega a tu favor.
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'rgba(201,169,110,0.06)',
              border: '1px solid rgba(201,169,110,0.2)',
            }}
          >
            <h2 className="text-white font-bold text-xl mb-3">
              ¿Estás pensando en emigrar a {info.name}?
            </h2>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
              En una sesión de orientación analizamos tu situación concreta — perfil profesional, país de origen, idiomas — y te doy un plan de acción claro.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#contacto"
                className="btn-primary px-8 py-3.5 font-semibold text-sm flex items-center justify-center gap-2"
              >
                Agenda tu orientación gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#planes"
                className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Ver planes de acompañamiento
              </Link>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center justify-center gap-3 text-white/40 text-sm">
            <Phone className="w-4 h-4" />
            <span>¿Prefieres hablar directamente?</span>
            <a
              href="https://wa.me/41772337353"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition font-medium"
            >
              WhatsApp +41 77 233 73 53
            </a>
          </div>
        </section>

        {/* ── Otros destinos ── */}
        <section className="max-w-[900px] mx-auto px-6 pb-16">
          <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">
            Otros destinos
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { slug: 'suiza', name: '🇨🇭 Suiza' },
              { slug: 'alemania', name: '🇩🇪 Alemania' },
              { slug: 'austria', name: '🇦🇹 Austria' },
              { slug: 'francia', name: '🇫🇷 Francia' },
              { slug: 'paises-bajos', name: '🇳🇱 Países Bajos' },
              { slug: 'belgica', name: '🇧🇪 Bélgica' },
              { slug: 'portugal', name: '🇵🇹 Portugal' },
              { slug: 'espana', name: '🇪🇸 España' },
              { slug: 'italia', name: '🇮🇹 Italia' },
              { slug: 'luxemburgo', name: '🇱🇺 Luxemburgo' },
              { slug: 'irlanda', name: '🇮🇪 Irlanda' },
              { slug: 'suecia', name: '🇸🇪 Suecia' },
              { slug: 'dinamarca', name: '🇩🇰 Dinamarca' },
              { slug: 'grecia', name: '🇬🇷 Grecia' },
              { slug: 'chipre', name: '🇨🇾 Chipre' },
              { slug: 'eslovenia', name: '🇸🇮 Eslovenia' },
              { slug: 'estonia', name: '🇪🇪 Estonia' },
              { slug: 'hungria', name: '🇭🇺 Hungría' },
              { slug: 'lituania', name: '🇱🇹 Lituania' },
              { slug: 'malta', name: '🇲🇹 Malta' },
              { slug: 'polonia', name: '🇵🇱 Polonia' },
              { slug: 'republica-checa', name: '🇨🇿 Rep. Checa' },
              { slug: 'bulgaria', name: '🇧🇬 Bulgaria' },
              { slug: 'eslovaquia', name: '🇸🇰 Eslovaquia' },
              { slug: 'croacia', name: '🇭🇷 Croacia' },
              { slug: 'finlandia', name: '🇫🇮 Finlandia' },
              { slug: 'letonia', name: '🇱🇻 Letonia' },
              { slug: 'rumania', name: '🇷🇴 Rumanía' },
            ]
              .filter((c) => c.slug !== params.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/paises/${c.slug}`}
                  className="text-sm px-4 py-2 rounded-lg transition-all hover:border-yellow-500/40 hover:text-yellow-400"
                  style={{
                    background: '#13151b',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
