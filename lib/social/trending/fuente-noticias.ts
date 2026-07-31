// Fuente C — contexto noticioso del día. Reusa el patrón de fetchGNews de
// lib/social/historia-humana.ts, con queries por tema del nicho (GNews ya indexa
// swissinfo.ch, 20min.ch y prensa suiza en español, así que cubre buena parte de
// la intención de "medios suizos" sin depender de scrapers frágiles por sitio).
//
// Nota: intentamos también el feed WordPress de espanolesensuiza.ch (patrón
// estándar /feed/) como fuente extra, pero es best-effort — si cambia o no
// existe, simplemente no aporta candidatos, sin romper el resto.
//
// A diferencia de A/B, aquí no hay likes/comentarios reales — el score es un
// heurístico de recencia (siempre queda por debajo de A/B a menos que no haya
// nada más), tal como pide el spec: sirve para detectar temas calientes que aún
// no son tendencia en IG.

import type { CandidatoCrudo, Tema } from './types'

// GNews exige que TODAS las palabras del query aparezcan en el artículo (AND
// implícito) y su parser de sintaxis falla con tildes en frases largas — por
// eso son de máximo 2 palabras (verificado 31 jul 2026 junto con historia-humana.ts).
const QUERIES_POR_TEMA: Record<Tema, string> = {
  salud: 'seguro Suiza',
  vivienda: 'alquiler Suiza',
  impuestos: 'impuestos Suiza',
  trabajo: 'trabajo Suiza',
  idioma: 'idioma Suiza',
  tramites: 'permiso Suiza',
}

async function fetchGNewsTema(tema: Tema): Promise<CandidatoCrudo[]> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) return []
  try {
    const params = new URLSearchParams({
      q: QUERIES_POR_TEMA[tema],
      lang: 'es',
      max: '5',
      apikey: apiKey,
    })
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    const articulos: Array<{ title: string; description?: string; url: string; publishedAt?: string }> =
      data.articles ?? []
    return articulos.map((a) => ({
      fuente: 'noticia' as const,
      url: a.url,
      formatoOriginal: null,
      captionOriginal: `${a.title}. ${a.description ?? ''}`.trim(),
      likes: 0,
      comentarios: 0,
      publicadoAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      medianaEngagementCuenta: null,
      __tema: tema,
    })) as (CandidatoCrudo & { __tema: Tema })[]
  } catch {
    return []
  }
}

interface WpFeedItem {
  title?: { rendered?: string } | string
  excerpt?: { rendered?: string } | string
  link?: string
  date?: string
}

async function fetchEspanolesEnSuiza(): Promise<CandidatoCrudo[]> {
  try {
    const res = await fetch('https://espanolesensuiza.ch/wp-json/wp/v2/posts?per_page=8&_fields=title,excerpt,link,date')
    if (!res.ok) return []
    const posts = (await res.json()) as WpFeedItem[]
    const cortaHoras = Date.now() - 72 * 60 * 60 * 1000
    return posts
      .filter((p) => p.date && new Date(p.date).getTime() >= cortaHoras)
      .map((p) => {
        const titulo = typeof p.title === 'string' ? p.title : p.title?.rendered ?? ''
        const extracto = typeof p.excerpt === 'string' ? p.excerpt : p.excerpt?.rendered ?? ''
        return {
          fuente: 'noticia' as const,
          url: p.link ?? '',
          formatoOriginal: null,
          captionOriginal: `${titulo}. ${extracto}`.replace(/<[^>]+>/g, '').trim(),
          likes: 0,
          comentarios: 0,
          publicadoAt: p.date ? new Date(p.date) : new Date(),
          medianaEngagementCuenta: null,
        }
      })
  } catch {
    return [] // patrón best-effort — el sitio puede no exponer la API WP o cambiarla
  }
}

export async function fetchFuenteNoticias(): Promise<Array<CandidatoCrudo & { __tema?: Tema }>> {
  try {
    const temas = Object.keys(QUERIES_POR_TEMA) as Tema[]
    const porTema = await Promise.all(temas.map(fetchGNewsTema))
    const extra = await fetchEspanolesEnSuiza()
    return [...porTema.flat(), ...extra]
  } catch (err) {
    console.warn('[trending/noticias] fuente falló completa, se omite:', err)
    return []
  }
}
