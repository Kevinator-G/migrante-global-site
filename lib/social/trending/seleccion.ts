// Tarea 2 — cruza el TOP 5 del barrido diario con el estado de la rotación
// (últimos temas, últimos ángulos usados) y decide si hay referencia_trending
// para el post de hoy. NUNCA decide el formato — eso ya lo resolvió
// format-cycle.ts antes de llegar aquí. Si algo falla, devuelve null: el
// generador sigue con el banco evergreen como si no hubiera trending.

import { PrismaClient } from '@prisma/client'
import type { Candidato, ReferenciaTrending } from './types'

const prisma = new PrismaClient()

const VENTANA_TEMAS_RECIENTES = 4
const VENTANA_DEDUP_DIAS = 14

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

function fechaAyer(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export async function selectReferencia(): Promise<ReferenciaTrending | null> {
  try {
    let scan = await prisma.trendingScan.findUnique({ where: { fecha: fechaHoy() } })
    if (!scan) scan = await prisma.trendingScan.findUnique({ where: { fecha: fechaAyer() } })
    if (!scan) return null

    const candidatos = scan.candidatos as unknown as Candidato[]
    if (!Array.isArray(candidatos) || candidatos.length === 0) return null

    const recientes = await prisma.socialPost.findMany({
      where: { platform: 'instagram', status: 'published', tema: { not: null } },
      select: { tema: true },
      orderBy: { createdAt: 'desc' },
      take: VENTANA_TEMAS_RECIENTES,
    })
    const ultimosTemas = new Set(recientes.map((r) => r.tema))

    const desdeDedup = new Date(Date.now() - VENTANA_DEDUP_DIAS * 24 * 60 * 60 * 1000)
    const usadosRecientes = await prisma.socialPost.findMany({
      where: {
        platform: 'instagram',
        status: 'published',
        referenciaUrl: { not: null },
        createdAt: { gte: desdeDedup },
      },
      select: { referenciaUrl: true },
    })
    const urlsUsadas = new Set(usadosRecientes.map((r) => r.referenciaUrl))

    const supervivientes = candidatos
      .filter((c) => !ultimosTemas.has(c.tema))
      .filter((c) => !urlsUsadas.has(c.url))
      .sort((a, b) => b.score - a.score)

    if (supervivientes.length === 0) return null

    const elegido = supervivientes[0]
    return {
      tema: elegido.tema,
      angulo: elegido.angulo,
      estructura: elegido.estructura,
      porQueFunciona: elegido.porQueFunciona,
      url: elegido.url,
      score: elegido.score,
      fuente: elegido.fuente,
    }
  } catch (err) {
    console.warn('[trending/seleccion] falló, se usa banco evergreen:', err)
    return null
  }
}
