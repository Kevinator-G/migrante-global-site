// Fuente A — Instagram Graph API (ig_hashtag_search + top_media).
//
// Limitaciones documentadas de la API oficial (revisar vigencia en la doc de Meta
// antes de subir el tope): Meta permite consultar ~30 hashtags únicos por ventana
// de 7 días por IG User, así que cacheamos el hashtag_id resuelto en HashtagCache
// y limitamos cuántos hashtags NUEVOS resolvemos por corrida. Además, top_media no
// trae el engagement normalizado por cuenta de terceros — el score de esta fuente
// es velocidad cruda (likes + comentarios*3 / horas), sin dividir por mediana de
// cuenta como sí se puede hacer en la Fuente B.

import { PrismaClient } from '@prisma/client'
import { getInstagramToken } from '../meta-token'
import type { CandidatoCrudo } from './types'

const prisma = new PrismaClient()
const BASE = 'https://graph.facebook.com/v19.0'

const HASHTAGS_SEMILLA = [
  'suizaparalatinos',
  'latinosensuiza',
  'vivirensuiza',
  'migraraSuiza',
  'trabajarensuiza',
  'expatsuiza',
  'permisoB',
  'seguromedicosuiza',
  'costodevidasuiza',
]

const MAX_HORAS = 72
// Tope conservador de lookups nuevos por corrida para no acercarse al límite de 30/7 días.
const MAX_LOOKUPS_NUEVOS_POR_CORRIDA = 4
const CACHE_VALIDO_DIAS = 7

async function resolverHashtagId(tag: string, userId: string, token: string): Promise<string | null> {
  const cached = await prisma.hashtagCache.findUnique({ where: { tag } })
  if (cached) {
    const edadDias = (Date.now() - cached.updatedAt.getTime()) / 86_400_000
    if (edadDias < CACHE_VALIDO_DIAS) return cached.hashtagId
  }
  return null
}

interface TopMediaItem {
  id: string
  caption?: string
  like_count?: number
  comments_count?: number
  timestamp?: string
  media_type?: string
  permalink?: string
}

async function fetchTopMedia(hashtagId: string, userId: string, token: string): Promise<TopMediaItem[]> {
  const params = new URLSearchParams({
    user_id: userId,
    fields: 'id,caption,like_count,comments_count,timestamp,media_type,permalink',
    access_token: token,
  })
  const res = await fetch(`${BASE}/${hashtagId}/top_media?${params}`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.data ?? []) as TopMediaItem[]
}

export async function fetchFuenteHashtags(): Promise<CandidatoCrudo[]> {
  try {
    const token = await getInstagramToken()
    const userId = process.env.INSTAGRAM_ACCOUNT_ID
    if (!token || !userId) {
      console.warn('[trending/hashtags] falta token o INSTAGRAM_ACCOUNT_ID — fuente omitida')
      return []
    }

    // Primero los que ya tenemos cacheados (gratis), después gastamos el cupo del día
    // en resolver hashtags nuevos o vencidos.
    const conCache: string[] = []
    const sinCache: string[] = []
    for (const tag of HASHTAGS_SEMILLA) {
      const id = await resolverHashtagId(tag, userId, token)
      if (id) conCache.push(tag)
      else sinCache.push(tag)
    }

    const hashtagIds = new Map<string, string>()
    for (const tag of conCache) {
      const cached = await prisma.hashtagCache.findUnique({ where: { tag } })
      if (cached) hashtagIds.set(tag, cached.hashtagId)
    }

    let nuevosResueltos = 0
    for (const tag of sinCache) {
      if (nuevosResueltos >= MAX_LOOKUPS_NUEVOS_POR_CORRIDA) break
      try {
        const params = new URLSearchParams({ user_id: userId, q: tag, access_token: token })
        const res = await fetch(`${BASE}/ig_hashtag_search?${params}`)
        if (!res.ok) continue
        const data = await res.json()
        const hashtagId = data?.data?.[0]?.id as string | undefined
        if (!hashtagId) continue
        await prisma.hashtagCache.upsert({
          where: { tag },
          create: { tag, hashtagId },
          update: { hashtagId },
        })
        hashtagIds.set(tag, hashtagId)
        nuevosResueltos++
      } catch {
        // un hashtag fallido no detiene al resto
      }
    }

    const cortaHoras = Date.now() - MAX_HORAS * 60 * 60 * 1000
    const candidatos: CandidatoCrudo[] = []

    for (const [tag, hashtagId] of hashtagIds) {
      try {
        const media = await fetchTopMedia(hashtagId, userId, token)
        for (const item of media) {
          if (!item.timestamp) continue
          const publicadoAt = new Date(item.timestamp)
          if (publicadoAt.getTime() < cortaHoras) continue
          candidatos.push({
            fuente: 'hashtag',
            url: item.permalink ?? `https://www.instagram.com/p/${item.id}/`,
            formatoOriginal: item.media_type === 'CAROUSEL_ALBUM' ? 'carrusel' : item.media_type === 'VIDEO' ? 'reel' : 'foto',
            captionOriginal: item.caption ?? '',
            likes: item.like_count ?? 0,
            comentarios: item.comments_count ?? 0,
            publicadoAt,
            medianaEngagementCuenta: null,
          })
        }
      } catch (err) {
        console.warn(`[trending/hashtags] top_media falló para #${tag}:`, err)
      }
    }

    return candidatos
  } catch (err) {
    console.warn('[trending/hashtags] fuente falló completa, se omite:', err)
    return []
  }
}
