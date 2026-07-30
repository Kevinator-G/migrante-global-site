// Prepara las láminas del carrusel: renderiza cada una vía /api/social/carousel-slide,
// la convierte a JPEG (Instagram solo acepta JPEG por URL) y la aloja en Vercel Blob.

import sharp from 'sharp'
import { put } from '@vercel/blob'
import type { AdaptedContent } from './content-adapter'
import { pickCarouselFotos } from './media-library'

export interface CarouselSlideDef {
  texto: string
  tipo: 'gancho' | 'idea' | 'cta'
}

export function buildSlides(carousel: NonNullable<AdaptedContent['carousel']>): CarouselSlideDef[] {
  // Instagram admite máximo 10 láminas por carrusel: gancho + 8 + cta
  const slides: CarouselSlideDef[] = [
    { texto: carousel.gancho, tipo: 'gancho' },
    ...carousel.laminas.slice(0, 8).map((texto) => ({ texto, tipo: 'idea' as const })),
    { texto: carousel.cta, tipo: 'cta' },
  ]
  return slides.filter((s) => s.texto?.trim())
}

// Fondos para las láminas: fotos propias de la categoría primero, Unsplash
// (por las keywords del tema) de relleno; se ciclan si no alcanzan. Si no hay
// ninguna, las láminas salen con el fondo negro liso de siempre.
export async function gatherSlideImages(
  category: string,
  keywords: string[],
  n: number,
): Promise<string[]> {
  const pool = await pickCarouselFotos(category, n)
  if (pool.length < n && keywords.length > 0) {
    pool.push(...(await fetchUnsplashPortraits(keywords, n - pool.length)))
  }
  if (pool.length === 0) return []
  return Array.from({ length: n }, (_, i) => pool[i % pool.length])
}

async function fetchUnsplashPortraits(keywords: string[], count: number): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return []
  try {
    const params = new URLSearchParams({
      query: keywords.slice(0, 4).join(' '),
      per_page: String(Math.min(count, 10)),
      orientation: 'portrait',
    })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.results ?? [])
      .map((r: { urls?: { regular?: string } }) => r.urls?.regular)
      .filter((u: string | undefined): u is string => Boolean(u))
  } catch {
    return []
  }
}

export async function renderCarouselJpegs(
  slides: CarouselSlideDef[],
  postId: string,
  imagenes: string[] = [],
): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN no configurado — no se puede alojar el carrusel')
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://migranteglobal.ch'
  const urls: string[] = []

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i]
    const qs = new URLSearchParams({
      texto: s.texto,
      tipo: s.tipo,
      n: String(i + 1),
      total: String(slides.length),
    })
    if (imagenes[i]) qs.set('img', imagenes[i])
    const res = await fetch(`${base}/api/social/carousel-slide?${qs}`)
    if (!res.ok) throw new Error(`Render de lámina ${i + 1} falló: HTTP ${res.status}`)
    const png = Buffer.from(await res.arrayBuffer())
    const jpeg = await sharp(png).jpeg({ quality: 90 }).toBuffer()
    const blob = await put(`social/carrusel-${postId}-${i + 1}.jpg`, jpeg, {
      access: 'public',
      contentType: 'image/jpeg',
      allowOverwrite: true,
    })
    urls.push(blob.url)
  }

  return urls
}
