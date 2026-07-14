// Biblioteca de medios propios — selección de fotos/clips para el blog y los
// videos sociales. Rota por "menos usado recientemente" para no repetir, y si
// no hay material propio disponible el llamador cae a Unsplash.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// No repetir la misma foto de hero del blog en menos de 14 días
const BLOG_REUSE_MS = 14 * 24 * 60 * 60 * 1000

function whereCategoria(type: string, category: string) {
  return {
    type,
    OR: [{ category }, { category: null }],
  }
}

const ordenMenosUsado = [
  { lastUsedAt: { sort: 'asc' as const, nulls: 'first' as const } },
  { timesUsed: 'asc' as const },
]

async function marcarUsados(ids: string[]) {
  if (ids.length === 0) return
  await prisma.mediaAsset.updateMany({
    where: { id: { in: ids } },
    data: { timesUsed: { increment: 1 }, lastUsedAt: new Date() },
  })
}

// Foto propia para el hero del artículo del blog, o null (→ Unsplash)
export async function pickBlogFoto(category: string): Promise<string | null> {
  try {
    const asset = await prisma.mediaAsset.findFirst({
      where: whereCategoria('foto', category),
      orderBy: ordenMenosUsado,
    })
    if (!asset) return null
    // Si hasta la menos usada se usó hace poco, mejor variar con Unsplash
    if (asset.lastUsedAt && Date.now() - asset.lastUsedAt.getTime() < BLOG_REUSE_MS) {
      return null
    }
    await marcarUsados([asset.id])
    return asset.url
  } catch {
    return null
  }
}

// Material propio para el video vertical: hasta 4 fotos + 1 clip para el gancho
export async function pickVideoMedia(
  category: string,
): Promise<{ fotos: string[]; clip?: string }> {
  try {
    const fotos = await prisma.mediaAsset.findMany({
      where: whereCategoria('foto', category),
      orderBy: ordenMenosUsado,
      take: 4,
    })
    const clip = await prisma.mediaAsset.findFirst({
      where: whereCategoria('video', category),
      orderBy: ordenMenosUsado,
    })

    await marcarUsados([...fotos.map((f) => f.id), ...(clip ? [clip.id] : [])])

    return { fotos: fotos.map((f) => f.url), clip: clip?.url }
  } catch {
    return { fotos: [] }
  }
}
