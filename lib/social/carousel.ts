// Prepara las láminas del carrusel: renderiza cada una vía /api/social/carousel-slide,
// la convierte a JPEG (Instagram solo acepta JPEG por URL) y la aloja en Vercel Blob.

import sharp from 'sharp'
import { put } from '@vercel/blob'
import type { AdaptedContent } from './content-adapter'

export interface CarouselSlideDef {
  texto: string
  tipo: 'gancho' | 'idea' | 'cta'
}

export function buildSlides(carousel: AdaptedContent['carousel']): CarouselSlideDef[] {
  // Instagram admite máximo 10 láminas por carrusel: gancho + 8 + cta
  const slides: CarouselSlideDef[] = [
    { texto: carousel.gancho, tipo: 'gancho' },
    ...carousel.laminas.slice(0, 8).map((texto) => ({ texto, tipo: 'idea' as const })),
    { texto: carousel.cta, tipo: 'cta' },
  ]
  return slides.filter((s) => s.texto?.trim())
}

export async function renderCarouselJpegs(
  slides: CarouselSlideDef[],
  postId: string,
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
