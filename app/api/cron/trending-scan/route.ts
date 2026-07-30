import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { fetchFuenteHashtags } from '@/lib/social/trending/fuente-hashtags'
import { fetchFuenteCuentas } from '@/lib/social/trending/fuente-cuentas'
import { fetchFuenteNoticias } from '@/lib/social/trending/fuente-noticias'
import { calcularTop5 } from '@/lib/social/trending/scoring'

const prisma = new PrismaClient()

// Corre antes de distribute-content (09:30) — barrido diario del nicho.
export const maxDuration = 120

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const authHeader = req.headers.get('authorization')
  if (authHeader === `Bearer ${secret}`) return true
  const querySecret = req.nextUrl.searchParams.get('secret')
  if (querySecret === secret) return true
  const headerSecret = req.headers.get('x-cron-secret')
  if (headerSecret === secret) return true
  return false
}

// Cada fuente ya se protege sola (try/catch interno, devuelve [] si falla) —
// Promise.allSettled es una capa extra de seguridad para que ninguna tumbe al resto.
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [hashtags, cuentas, noticias] = await Promise.allSettled([
    fetchFuenteHashtags(),
    fetchFuenteCuentas(),
    fetchFuenteNoticias(),
  ])

  const crudos = [
    ...(hashtags.status === 'fulfilled' ? hashtags.value : []),
    ...(cuentas.status === 'fulfilled' ? cuentas.value : []),
    ...(noticias.status === 'fulfilled' ? noticias.value : []),
  ]

  const top5 = await calcularTop5(crudos)

  const fecha = new Date().toISOString().slice(0, 10)
  await prisma.trendingScan.upsert({
    where: { fecha },
    create: { fecha, candidatos: top5 as unknown as object },
    update: { candidatos: top5 as unknown as object },
  })

  return NextResponse.json({
    fecha,
    fuentes: {
      hashtags: hashtags.status === 'fulfilled' ? hashtags.value.length : `error: ${String(hashtags.reason)}`,
      cuentas: cuentas.status === 'fulfilled' ? cuentas.value.length : `error: ${String(cuentas.reason)}`,
      noticias: noticias.status === 'fulfilled' ? noticias.value.length : `error: ${String(noticias.reason)}`,
    },
    candidatos: top5,
  })
}
