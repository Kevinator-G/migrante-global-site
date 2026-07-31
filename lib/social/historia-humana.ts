// Post diario de "historia humana" (estilo espanolesensuiza.ch): una noticia
// REAL con protagonista humano, contada en la voz de Kevin con análisis
// equilibrado, pregunta final para los comentarios y fuente citada.
// Nunca se inventan testimonios — si no hay historia real, no hay post.

import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'
import { publishToInstagram } from './instagram'
import { publishToFacebook } from './facebook'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface Historia {
  title: string
  description: string
  url: string
  source: string
}

// Búsquedas rotadas por día — historias con personas, no comunicados.
// GNews exige que TODAS las palabras del query aparezcan en el artículo (AND
// implícito) y su parser de sintaxis falla con algunas tildes en frases largas —
// por eso son de máximo 2 palabras (verificado 31 jul 2026: 4 palabras nunca
// encontraba nada, "médico" con 4 palabras daba error de sintaxis).
const QUERIES = [
  'inmigrante Suiza',
  'latino Suiza',
  'extranjero Suiza',
  'migrante Suiza',
  'colombiano Suiza',
  'trabajador Suiza',
  'familia Suiza',
]

async function fetchGNews(query: string): Promise<Historia[]> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) return []
  try {
    const params = new URLSearchParams({ q: query, lang: 'es', max: '10', apikey: apiKey })
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.articles ?? []).map(
      (a: { title: string; description?: string; url: string; source?: { name?: string } }) => ({
        title: a.title,
        description: a.description ?? '',
        url: a.url,
        source: a.source?.name ?? 'prensa suiza',
      }),
    )
  } catch {
    return []
  }
}

async function fetchUnsplashFoto(keywords: string[]): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey || keywords.length === 0) return null
  try {
    const params = new URLSearchParams({
      query: keywords.slice(0, 4).join(' '),
      per_page: '10',
      orientation: 'landscape',
    })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    const pool: Array<{ urls?: { regular?: string } }> = data.results ?? []
    const pick = pool[Math.floor(Math.random() * pool.length)]
    return pick?.urls?.regular ?? null
  } catch {
    return null
  }
}

// GNews con queries de 2 palabras a veces matchea artículos donde "Suiza" solo
// aparece de pasada (ej. un escándalo de viajes de congresistas peruanos que
// mencionaba Suiza como uno de varios destinos). Este filtro descarta esos
// falsos positivos antes de gastar la generación completa del post.
async function esRelevante(articulo: Historia): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Respondes SOLO "si" o "no", sin explicación. Evalúas si una noticia es genuinamente relevante para latinos inmigrantes o residentes en Suiza — no basta con que mencione la palabra Suiza de pasada.',
        },
        {
          role: 'user',
          content: `¿Esta noticia trata genuinamente sobre migración, vida de extranjeros/latinos en Suiza, o tiene un protagonista humano cuya historia resuena con esa comunidad? Responde "no" si Suiza solo se menciona de pasada (ej. un país más en una lista, un viaje puntual, deporte, etc).\n\nTítulo: ${articulo.title}\nDescripción: ${articulo.description}`,
        },
      ],
      temperature: 0,
      max_tokens: 5,
    })
    return (completion.choices[0].message.content ?? '').trim().toLowerCase().startsWith('si')
  } catch {
    return false // ante la duda, no se publica
  }
}

interface HistoriaGenerada {
  titulo: string
  cuerpo: string
  hashtags: string[]
  keywords: string[]
}

async function generarPost(articulo: Historia): Promise<HistoriaGenerada> {
  const prompt = `Convierte esta noticia REAL en un post de Facebook/Instagram de historia humana. Devuelve SOLO JSON válido.

NOTICIA:
Título: ${articulo.title}
Descripción: ${articulo.description}
Fuente: ${articulo.source}

Estilo (como los posts virales de espanolesensuiza.ch):
1. Titular corto con gancho humano, tipo "18 años trabajando... y contando cada franco".
2. La historia de la persona con sus datos concretos (números, años, ciudad) — SOLO datos que estén en la noticia, NUNCA inventes detalles.
3. Por qué esta historia es relevante para los latinos en Suiza.
4. Un matiz honesto: qué NO cuenta la noticia o qué habría que saber para juzgar bien (asignaciones, ayudas, contexto).
5. Pregunta final directa que invite a comentar, en tuteo latino ("¿Qué opinas? ¿Crees que...?").

Genera el siguiente JSON exacto:
{
  "titulo": "Titular de máximo 60 caracteres con gancho humano",
  "cuerpo": "El post completo en 4-5 párrafos cortos (máximo 200 palabras) siguiendo la estructura de arriba. Voz de Kevin: directa, cercana, respetuosa con la persona de la historia. Sin emojis o máximo 1.",
  "hashtags": ["10", "hashtags", "relevantes", "sin", "símbolo"],
  "keywords": ["3-4 términos EN INGLÉS que describan VISUALMENTE la escena de la historia para buscar foto (ej: 'tram driver zurich street', 'nurse hospital corridor')"]
}

IMPORTANTE: Devuelve SOLO el JSON. Sin markdown.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'Eres el equipo de contenido de Kevin García, consultor de inmigración en Suiza. Kevin humaniza las noticias para su comunidad latina: cuenta historias reales con respeto, añade contexto honesto y pregunta la opinión de su audiencia. Nunca inventa datos.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 900,
  })

  const raw = completion.choices[0].message.content ?? '{}'
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned) as HistoriaGenerada
}

export async function publicarHistoria(articulo: Historia, imageOverride?: string) {
  const gen = await generarPost(articulo)
  const imageUrl = imageOverride ?? (await fetchUnsplashFoto(gen.keywords))

  if (!imageUrl) {
    return { error: 'Sin imagen disponible para la historia', titulo: gen.titulo }
  }

  const caption = `${gen.titulo}\n\n${gen.cuerpo}\n\nFuente: ${articulo.source}`

  const ig = await publishToInstagram(imageUrl, caption, gen.hashtags)
  const fb = await publishToFacebook(imageUrl, caption, gen.hashtags)

  for (const [platform, r] of [
    ['instagram_historia', ig],
    ['facebook_historia', fb],
  ] as const) {
    await prisma.socialPost.create({
      data: {
        platform,
        status: r.success ? 'published' : 'failed',
        caption,
        hashtags: gen.hashtags,
        sourceUrl: articulo.url,
        platformId: r.platformId,
        platformUrl: r.platformUrl,
        error: r.error,
        publishedAt: r.success ? new Date() : undefined,
      },
    })
  }

  return {
    titulo: gen.titulo,
    fuente: articulo.source,
    instagram: { status: ig.success ? 'published' : 'failed', url: ig.platformUrl, error: ig.error },
    facebook: { status: fb.success ? 'published' : 'failed', url: fb.platformUrl, error: fb.error },
  }
}

export async function runHistoriaHumana() {
  // Una historia al día como máximo
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const yaHoy = await prisma.socialPost.findFirst({
    where: {
      platform: 'instagram_historia',
      status: 'published',
      createdAt: { gte: todayStart },
    },
    select: { id: true },
  })
  if (yaHoy) return { skipped: true, reason: 'Historia de hoy ya publicada' }

  // Fuentes ya usadas (últimas 200) para no repetir noticia
  const usadas = new Set(
    (
      await prisma.socialPost.findMany({
        where: { platform: { in: ['instagram_historia', 'facebook_historia'] } },
        select: { sourceUrl: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      })
    )
      .map((s) => s.sourceUrl)
      .filter(Boolean) as string[],
  )

  // Query preferida del día primero, luego el resto como respaldo
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getUTCFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  const rotadas = [
    QUERIES[dayOfYear % QUERIES.length],
    ...QUERIES.filter((_, i) => i !== dayOfYear % QUERIES.length),
  ]

  let articulo: Historia | null = null
  for (const q of rotadas) {
    const articulos = await fetchGNews(q)
    for (const candidato of articulos) {
      if (usadas.has(candidato.url)) continue
      if (await esRelevante(candidato)) {
        articulo = candidato
        break
      }
    }
    if (articulo) break
  }

  if (!articulo) {
    return { skipped: true, reason: 'Sin historias humanas nuevas en GNews hoy' }
  }

  return publicarHistoria(articulo)
}
