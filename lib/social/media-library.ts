// Biblioteca de medios propios — selección de la foto de hero del blog.
// Rota por "menos usado recientemente" para no repetir, y si no hay material
// propio disponible el llamador cae a Unsplash con el query del tema.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// No repetir la misma foto de hero del blog en menos de 14 días
const BLOG_REUSE_MS = 14 * 24 * 60 * 60 * 1000

const ordenMenosUsado = [
  { lastUsedAt: { sort: 'asc' as const, nulls: 'first' as const } },
  { timesUsed: 'asc' as const },
]

// Hasta n fotos propias de la categoría exacta para los fondos del carrusel
export async function pickCarouselFotos(category: string, n: number): Promise<string[]> {
  try {
    const fotos = await prisma.mediaAsset.findMany({
      where: { type: 'foto', category },
      orderBy: ordenMenosUsado,
      take: n,
    })
    if (fotos.length > 0) {
      await prisma.mediaAsset.updateMany({
        where: { id: { in: fotos.map((f) => f.id) } },
        data: { timesUsed: { increment: 1 }, lastUsedAt: new Date() },
      })
    }
    return fotos.map((f) => f.url)
  } catch {
    return []
  }
}

// Foto propia para el hero del artículo del blog, o null (→ Unsplash).
// Solo fotos etiquetadas con la categoría EXACTA del artículo — las genéricas
// sin categoría (paisajes, etc.) no encajan con temas concretos como seguros.
export async function pickBlogFoto(category: string): Promise<string | null> {
  try {
    const asset = await prisma.mediaAsset.findFirst({
      where: { type: 'foto', category },
      orderBy: ordenMenosUsado,
    })
    if (!asset) return null
    // Si hasta la menos usada se usó hace poco, mejor variar con Unsplash
    if (asset.lastUsedAt && Date.now() - asset.lastUsedAt.getTime() < BLOG_REUSE_MS) {
      return null
    }
    await prisma.mediaAsset.update({
      where: { id: asset.id },
      data: { timesUsed: { increment: 1 }, lastUsedAt: new Date() },
    })
    return asset.url
  } catch {
    return null
  }
}
