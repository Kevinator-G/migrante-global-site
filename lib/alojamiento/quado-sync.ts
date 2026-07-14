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

// Respaldo si la fuente no responde y la DB está vacía (datos jul 2026)
const RESPALDO: HabitacionData[] = [
  {
    codigo: 'CS1', tipo: 'singola', disponible: new Date('2026-07-06'), precio: 1250,
    precioDoble: null, deposito: 1000, metros: 15, direccion: 'Haldenstrasse 20, 8620 Wetzikon',
    fotos: [
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/6b141bd3-8b90-4f35-b9d5-c7c23195f251/IMG_9863.jpeg',
      'https://images.squarespace-cdn.com/content/v1/689745af7da5f5244adcce8d/e69954de-addb-4f49-9035-a23d9b2642d9/IMG_9864.jpeg',
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
  const imagenes = [...html.matchAll(
    /https:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^"' )?]+/g,
  )].map((m) => ({ url: m[0], pos: m.index ?? 0 }))

  const fotosDe = (codigo: string): string[] => {
    const idx = codigosHtml.findIndex((c) => c.codigo === codigo)
    if (idx < 0) return []
    const desde = idx > 0 ? codigosHtml[idx - 1].pos : codigosHtml[idx].pos - 30000
    const hasta = codigosHtml[idx].pos
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

    // Dirección: entre "Indirizzo :" y "Maggiori" dentro del bloque siguiente
    const resto = texto.slice(m.index, m.index + 600)
    const dirM = resto.match(/Indirizzo\s*:\s*(.+?)\s*Maggiori/)
    const direccion = (dirM?.[1] ?? '')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+/g, ' ')
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
