// Sincroniza las habitaciones desde la web de Domenico (quadoimmobilien.com/camere)
// hacia la tabla Habitacion. La página /servicios/alojamiento llama a
// getHabitaciones() en cada render del servidor (con revalidate) — así las
// fechas, precios y habitaciones nuevas se rectifican solas antes de mostrarse.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FUENTE = 'https://www.quadoimmobilien.com/camere'

export interface HabitacionData {
  codigo: string
  tipo: string
  disponible: Date | null
  precio: number
  precioDoble: number | null
  deposito: number
  metros: number
  direccion: string
  fotos: string[]
}

// Respaldo si la fuente no responde y la DB está vacía.
// Barrido manual de quadoimmobilien.com/camere del 3 ago 2026.
const CDN = 'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d'

const RESPALDO: HabitacionData[] = [
  {
    codigo: 'CD1', tipo: 'doppia', disponible: new Date('2026-08-01'), precio: 1650,
    precioDoble: null, deposito: 1000, metros: 23, direccion: 'Haldenstrasse 20, 8620 Wetzikon',
    fotos: [
      `${CDN}/d3069e8d-98c4-46cb-80d5-8272ffab23f9/WhatsApp+Image+2026-07-02+at+14.55.11.jpeg`,
      `${CDN}/5cd1d426-9204-4666-aa84-df323580807b/WhatsApp+Image+2026-07-02+at+19.51.09.jpeg`,
    ],
  },
  {
    codigo: 'CS1', tipo: 'singola', disponible: new Date('2026-09-01'), precio: 1250,
    precioDoble: null, deposito: 1000, metros: 18, direccion: 'Zürichstrasse 22, 8607 Aathal-Seegraben',
    fotos: [
      `${CDN}/1fe9b33e-43d2-4bb0-89fb-19bcb2b66067/WhatsApp+Image+2026-08-01+at+11.30.38+%281%29.jpeg`,
      `${CDN}/939c5618-eb2b-4535-81a1-7d2a53995538/WhatsApp+Image+2026-08-01+at+11.30.38.jpeg`,
    ],
  },
  {
    codigo: 'CS2', tipo: 'singola', disponible: new Date('2026-09-01'), precio: 1150,
    precioDoble: null, deposito: 1000, metros: 15, direccion: 'Tösstalstrasse 4, 8620 Wetzikon',
    fotos: [
      `${CDN}/7b5257e1-cde4-43d2-aab0-ca57fb31753b/WhatsApp+Image+2026-06-18+at+08.19.20+%282%29.jpeg`,
      `${CDN}/b32e5e4b-6452-4c39-8fc9-0017e6393274/WhatsApp+Image+2026-06-18+at+08.19.20+%283%29.jpeg`,
    ],
  },
  {
    codigo: 'CS3', tipo: 'singola', disponible: new Date('2026-09-01'), precio: 1250,
    precioDoble: null, deposito: 1000, metros: 18, direccion: 'Zürichstrasse 22, 8607 Aathal-Seegraben',
    fotos: [
      `${CDN}/b8358f0b-deab-4c81-bce6-b0d70e5f5415/WhatsApp+Image+2026-08-01+at+17.58.40.jpeg`,
      `${CDN}/57ac968f-3148-4505-b577-b5f5854fed71/WhatsApp+Image+2026-08-01+at+17.58.40+%281%29.jpeg`,
    ],
  },
  {
    codigo: 'CS4', tipo: 'singola', disponible: new Date('2026-09-01'), precio: 1250,
    precioDoble: null, deposito: 1000, metros: 18, direccion: 'Zürichstrasse 22, 8607 Aathal-Seegraben',
    fotos: [
      `${CDN}/baf56321-9b30-4f2c-a838-0b3d9ade4e78/WhatsApp+Image+2026-08-01+at+18.04.24+%281%29.jpeg`,
      `${CDN}/5010e752-6202-41f0-9d5e-998e04c0e354/WhatsApp+Image+2026-08-01+at+18.04.24.jpeg`,
    ],
  },
  {
    codigo: 'CS5', tipo: 'singola', disponible: new Date('2026-10-01'), precio: 1250,
    precioDoble: null, deposito: 1000, metros: 20, direccion: 'Tösstalstrasse 4, 8620 Wetzikon',
    fotos: [
      `${CDN}/0fcc3e6f-080b-4f59-907f-05d5985c7a72/WhatsApp+Image+2026-07-01+at+17.43.41.jpeg`,
      `${CDN}/7d10c1d7-a5f8-4fb8-ac4e-80f94d4fdad1/WhatsApp+Image+2026-07-01+at+17.43.41+%281%29.jpeg`,
    ],
  },
]

function limpiarNumero(s: string | undefined): number | null {
  if (!s) return null
  const n = parseInt(s.replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) ? n : null
}

function parsearFecha(s: string): Date | null {
  const m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])))
  return isNaN(d.getTime()) ? null : d
}

// Parsea el HTML de la página de Quado y devuelve las habitaciones publicadas
export function parsearQuado(html: string): HabitacionData[] {
  // Texto plano para los datos
  const texto = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|[​-‍﻿]/g, ' ')
    .replace(/\s+/g, ' ')

  // Posición de cada código y de cada imagen en el HTML crudo (la galería de
  // cada habitación aparece ANTES de su bloque de texto)
  const codigosHtml = [...html.matchAll(/cod\.?\s*(C[SD]+\d+)/g)].map((m) => ({
    codigo: m[1],
    pos: m.index ?? 0,
  }))
  const todasImagenes = [...html.matchAll(
    /https:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^"' )?]+/g,
  )].map((m) => ({ url: m[0], pos: m.index ?? 0 }))

  // El logo de la cabecera se repite en los tres bloques de navegación y en el
  // pie. Sin filtrarlo se colaba como "foto" de la primera habitación, que es
  // la única cuya ventana de búsqueda no tiene un código anterior que la acote.
  const veces = new Map<string, number>()
  for (const i of todasImagenes) veces.set(i.url, (veces.get(i.url) ?? 0) + 1)
  const imagenes = todasImagenes.filter((i) => (veces.get(i.url) ?? 0) < 3)

  const fotosDe = (codigo: string): string[] => {
    const idx = codigosHtml.findIndex((c) => c.codigo === codigo)
    if (idx < 0) return []
    const hasta = codigosHtml[idx].pos
    // Para la primera ficha no hay código anterior: se limita la mirada atrás
    // en vez de barrer media página hacia arriba.
    const desde = idx > 0 ? codigosHtml[idx - 1].pos : hasta - 8000
    const enVentana = imagenes.filter((i) => i.pos > desde && i.pos < hasta)
    return [...new Set(enVentana.map((i) => i.url))].slice(-3)
  }

  const listado: HabitacionData[] = []
  const re =
    /Camera\s+([A-Za-zÀ-ÿ ]+?)\s*-?\s*cod\.?\s*(C[SD]+\d+)\s*Data di entrata:\s*([\d/]+)\s*Prezzo\s*:\s*([\d'.]+)\s*CHF(?:\s*singola\s*-\s*([\d'.]+)\s*CHF\s*doppia)?\s*Cauzione\s*:\s*([\d'.]+)\s*CHF\s*Grandezza\s*:\s*(\d+)\s*m/g

  let m: RegExpExecArray | null
  while ((m = re.exec(texto)) !== null) {
    const [, tipoRaw, codigo, fecha, precioRaw, precioDobleRaw, depositoRaw, metrosRaw] = m
    const precio = limpiarNumero(precioRaw)
    const metros = limpiarNumero(metrosRaw)
    if (!precio || !metros) continue

    // Dirección: entre "Indirizzo :" y "Maggiori" dentro del bloque siguiente.
    // En varias fichas (CS1, CS3, CS4 en ago-2026) Domenico pega el enlace de
    // Google Maps como texto plano detrás de la dirección, a veces repetido —
    // hay que quitarlo o la tarjeta muestra la URL cruda junto a la calle.
    const resto = texto.slice(m.index, m.index + 800)
    const dirM = resto.match(/Indirizzo\s*:\s*(.+?)\s*Maggiori/)
    const direccion = (dirM?.[1] ?? '')
      .replace(/https?:\/\/\S+/g, ' ')
      // Squarespace mete separadores invisibles (&zwnj;, &zwj;, &nbsp;) delante
      // de la calle, tanto en carácter como en entidad — fuera los dos
      .replace(/&(?:zwnj|zwj|nbsp|#8204|#8205|#160);/gi, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+/g, ' ')
      .replace(/^[\s,]+|[\s,]+$/g, '')
      .trim()

    listado.push({
      codigo,
      tipo: tipoRaw.trim().toLowerCase(),
      disponible: parsearFecha(fecha),
      precio,
      precioDoble: limpiarNumero(precioDobleRaw),
      deposito: limpiarNumero(depositoRaw) ?? 1000,
      metros,
      direccion: direccion || 'Wetzikon, cantón de Zúrich',
      fotos: fotosDe(codigo),
    })
  }

  return listado
}

// Sincroniza la fuente con la DB y devuelve las habitaciones activas.
// Si la fuente falla, devuelve lo último guardado (o el respaldo).
export async function getHabitaciones(): Promise<HabitacionData[]> {
  try {
    const res = await fetch(FUENTE, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MigranteGlobal/1.0)' },
      next: { revalidate: 3600 }, // rectificación horaria
    })
    if (res.ok) {
      const html = await res.text()
      const listado = parsearQuado(html)

      if (listado.length > 0) {
        for (const h of listado) {
          const { codigo, ...datos } = h
          // Si la fuente no trae fotos para una habitación, conservar las guardadas
          const update =
            datos.fotos.length > 0 ? datos : { ...datos, fotos: undefined }
          await prisma.habitacion.upsert({
            where: { codigo },
            update: { ...update, activa: true },
            create: { codigo, ...datos },
          })
        }
        // Las que ya no están publicadas se desactivan
        await prisma.habitacion.updateMany({
          where: { codigo: { notIn: listado.map((h) => h.codigo) } },
          data: { activa: false },
        })
      }
    }
  } catch {
    // sin red o fuente caída — seguimos con lo guardado
  }

  try {
    const guardadas = await prisma.habitacion.findMany({
      where: { activa: true },
      orderBy: { disponible: 'asc' },
    })
    if (guardadas.length > 0) return guardadas
  } catch {
    // tabla aún no creada — usar respaldo
  }

  return RESPALDO
}
