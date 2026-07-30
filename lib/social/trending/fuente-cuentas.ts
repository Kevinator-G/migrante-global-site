// Fuente B — cuentas de referencia del nicho, vía Bright Data (Dataset API v3:
// /datasets/v3/trigger + /datasets/v3/snapshot). Requiere BRIGHTDATA_API_KEY y
// BRIGHTDATA_DATASET_ID_INSTAGRAM_POSTS en el entorno — mientras no existan, esta
// fuente devuelve [] sin romper el resto del barrido (continue on fail).
//
// A diferencia de la Fuente A, aquí sí tenemos los últimos posts de cada cuenta,
// así que se puede calcular la mediana de engagement por cuenta y aplicar la
// fórmula de score completa del spec.

import type { CandidatoCrudo } from './types'

const BASE = 'https://api.brightdata.com/datasets/v3'

// Cuentas de referencia del nicho (español + suizo) — lista pendiente de Kevin,
// se completa cuando confirme los handles reales. Máx. 10-15 cuentas.
const CUENTAS_REFERENCIA: string[] = []

const MAX_HORAS = 72
const POLL_INTERVAL_MS = 5000
const POLL_TIMEOUT_MS = 60_000

interface BrightDataPost {
  url?: string
  post_url?: string
  caption?: string
  description?: string
  likes?: number
  num_likes?: number
  comments?: number
  num_comments?: number
  date_posted?: string
  timestamp?: string
  content_type?: string
  input?: { url?: string }
}

async function triggerYEsperarSnapshot(apiKey: string, datasetId: string, urls: string[]): Promise<BrightDataPost[]> {
  const triggerRes = await fetch(`${BASE}/trigger?dataset_id=${datasetId}&include_errors=true`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(urls.map((url) => ({ url }))),
  })
  if (!triggerRes.ok) throw new Error(`trigger falló: ${triggerRes.status}`)
  const { snapshot_id: snapshotId } = await triggerRes.json()
  if (!snapshotId) throw new Error('trigger sin snapshot_id')

  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const progressRes = await fetch(`${BASE}/progress/${snapshotId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    const progress = await progressRes.json().catch(() => ({}))
    if (progress.status === 'ready') {
      const snapshotRes = await fetch(`${BASE}/snapshot/${snapshotId}?format=json`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!snapshotRes.ok) return []
      return (await snapshotRes.json()) as BrightDataPost[]
    }
    if (progress.status === 'failed') return []
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
  return [] // timeout — no bloqueamos el barrido por un job lento
}

function mediana(nums: number[]): number {
  if (nums.length === 0) return 0
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

export async function fetchFuenteCuentas(): Promise<CandidatoCrudo[]> {
  const apiKey = process.env.BRIGHTDATA_API_KEY
  const datasetId = process.env.BRIGHTDATA_DATASET_ID_INSTAGRAM_POSTS
  if (!apiKey || !datasetId || CUENTAS_REFERENCIA.length === 0) {
    console.warn('[trending/cuentas] falta BRIGHTDATA_API_KEY, dataset id o lista de cuentas — fuente omitida')
    return []
  }

  try {
    const urls = CUENTAS_REFERENCIA.map((u) => `https://www.instagram.com/${u}/`)
    const posts = await triggerYEsperarSnapshot(apiKey, datasetId, urls)

    // Agrupar por cuenta (por input.url) para calcular la mediana de engagement propia.
    const porCuenta = new Map<string, BrightDataPost[]>()
    for (const p of posts) {
      const cuenta = p.input?.url ?? 'desconocida'
      if (!porCuenta.has(cuenta)) porCuenta.set(cuenta, [])
      porCuenta.get(cuenta)!.push(p)
    }

    const cortaHoras = Date.now() - MAX_HORAS * 60 * 60 * 1000
    const candidatos: CandidatoCrudo[] = []

    for (const cuentaPosts of porCuenta.values()) {
      const engagements = cuentaPosts.map((p) => (p.likes ?? p.num_likes ?? 0) + (p.comments ?? p.num_comments ?? 0) * 3)
      const medianaCuenta = mediana(engagements) || 1 // evitar división por cero

      for (const p of cuentaPosts) {
        const fecha = p.date_posted ?? p.timestamp
        if (!fecha) continue
        const publicadoAt = new Date(fecha)
        if (isNaN(publicadoAt.getTime()) || publicadoAt.getTime() < cortaHoras) continue

        candidatos.push({
          fuente: 'cuenta',
          url: p.url ?? p.post_url ?? '',
          formatoOriginal: p.content_type === 'Reel' ? 'reel' : p.content_type === 'Carousel' ? 'carrusel' : 'foto',
          captionOriginal: p.caption ?? p.description ?? '',
          likes: p.likes ?? p.num_likes ?? 0,
          comentarios: p.comments ?? p.num_comments ?? 0,
          publicadoAt,
          medianaEngagementCuenta: medianaCuenta,
        })
      }
    }

    return candidatos
  } catch (err) {
    console.warn('[trending/cuentas] fuente falló completa, se omite:', err)
    return []
  }
}
