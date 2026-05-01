import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Auth helper ────────────────────────────────────────────────────────────
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

// ── GNews — returns up to 5 candidates ────────────────────────────────────
async function fetchNewsArticles(query: string): Promise<Array<{
  title: string
  description: string
  url: string
  source: string
}>> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) return []

  try {
    const params = new URLSearchParams({
      q: query,
      lang: 'es',
      country: 'ch',
      max: '5',
      apikey: apiKey,
    })
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    if (!data.articles?.length) return []
    return data.articles.map((a: { title: string; description?: string; url: string; source?: { name?: string } }) => ({
      title: a.title,
      description: a.description ?? '',
      url: a.url,
      source: a.source?.name ?? '',
    }))
  } catch {
    return []
  }
}

// ── Unsplash ───────────────────────────────────────────────────────────────
async function fetchUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return null

  try {
    const params = new URLSearchParams({
      query: `Switzerland ${query}`,
      per_page: '1',
      orientation: 'landscape',
    })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.results?.[0]?.urls?.regular ?? null
  } catch {
    return null
  }
}

// ── Category config ────────────────────────────────────────────────────────
const CATEGORIES: Record<
  string,
  { searchQuery: string; fallbackTopic: string; imageQuery: string }
> = {
  'Visas y permisos': {
    searchQuery: 'permiso residencia Suiza inmigrante 2025',
    fallbackTopic: 'Los nuevos cambios en el sistema de permisos B y C en Suiza para 2025',
    imageQuery: 'visa permit document Switzerland',
  },
  'Mercado laboral': {
    searchQuery: 'empleo trabajo Suiza salario extranjero',
    fallbackTopic: 'Cómo encontrar trabajo en Suiza sin hablar alemán: lo que nadie te dice',
    imageQuery: 'Switzerland office work professionals',
  },
  'Homologación de títulos': {
    searchQuery: 'homologación título universitario Suiza reconocimiento',
    fallbackTopic: 'Paso a paso: cómo homologar tu título universitario en Suiza',
    imageQuery: 'university degree diploma Switzerland',
  },
  'Bienestar y salud': {
    searchQuery: 'seguro salud Suiza inmigrante KVG',
    fallbackTopic: 'Cómo funciona el seguro médico en Suiza y qué cubre para los recién llegados',
    imageQuery: 'Switzerland health insurance medical',
  },
  'Educación y familia': {
    searchQuery: 'educación hijos Suiza familia reagrupación',
    fallbackTopic: 'Reagrupación familiar en Suiza: qué necesitas saber antes de empezar',
    imageQuery: 'Switzerland family education children',
  },
  'Finanzas y vivienda': {
    searchQuery: 'alquiler piso Suiza caro vivienda inmigrante',
    fallbackTopic: 'Cómo alquilar un piso en Suiza siendo extranjero: errores que cometen todos',
    imageQuery: 'Switzerland apartment housing city',
  },
  'Noticias Suiza': {
    searchQuery: 'noticias Suiza latinos hispanos comunidad 2025',
    fallbackTopic: 'Lo que está pasando en Suiza que afecta directamente a los inmigrantes latinos',
    imageQuery: 'Switzerland news city landscape',
  },
  'Cultura y adaptación': {
    searchQuery: 'cultura suiza adaptación extranjero integración',
    fallbackTopic: 'Choques culturales reales que nadie te advierte antes de llegar a Suiza',
    imageQuery: 'Switzerland culture integration people',
  },
  Emprendimiento: {
    searchQuery: 'emprender negocio Suiza startup extranjero',
    fallbackTopic: 'Cómo registrar una empresa en Suiza siendo extranjero y no morir en el intento',
    imageQuery: 'Switzerland business startup entrepreneur',
  },
  Impuestos: {
    searchQuery: 'impuestos declaración renta Suiza inmigrante',
    fallbackTopic: 'Declaración de impuestos en Suiza: guía clara para quien lleva menos de 2 años',
    imageQuery: 'Switzerland tax finance money',
  },
}

// ── Prompt (Kevin's voice) ─────────────────────────────────────────────────
function buildPrompt(
  category: string,
  topic: string,
  newsContext: string,
  recentTitles: string[],
): string {
  const avoidSection = recentTitles.length
    ? `\nTEMAS YA PUBLICADOS — NO repitas estos ángulos, escribe desde una perspectiva diferente:\n${recentTitles.map((t) => `- ${t}`).join('\n')}\n`
    : ''

  return `Eres Kevin García, consultor de inmigración en Suiza con 10 años de experiencia ayudando a latinos a migrar de forma segura y ordenada. Escribes de forma directa, cercana y honesta — sin corporativismo ni jerga burocrática. Usas "tú", párrafos cortos, y abres cada artículo con un gancho que para al lector en seco.

CATEGORÍA: ${category}
TEMA: ${topic}
${newsContext ? `CONTEXTO DE ACTUALIDAD:\n${newsContext}\n` : ''}${avoidSection}
Escribe un artículo de blog en español (mínimo 600 palabras) con esta estructura JSON exacta:

{
  "title": "Título directo y específico — sin clickbait barato, pero que genere urgencia real",
  "excerpt": "Resumen de 1-2 frases que engancha sin revelar todo",
  "content": "Contenido completo en Markdown. Empieza con un párrafo gancho de 2-3 líneas que describe la situación del lector. Sigue con H2 para cada sección. Termina con una llamada a la acción natural hacia una consulta personalizada.",
  "imageQuery": "2-3 palabras en inglés para buscar una foto real en Unsplash (ej: 'Zurich street immigrants')",
  "tags": ["tag1", "tag2", "tag3"]
}

REGLAS DE VOZ:
- Párrafos de máximo 3 líneas
- Nada de "En el competitivo mundo de..." — entra directo al problema
- Usa datos concretos cuando los tengas
- Humaniza: "yo lo he visto decenas de veces", "mis clientes me preguntan esto constantemente"
- El CTA final debe sentirse como un consejo de amigo, no como publicidad

Devuelve SOLO el JSON. Sin markdown extra, sin explicaciones fuera del JSON.`
}

// ── Selección diaria de categoría ─────────────────────────────────────────
// Determinista: misma categoría si el cron corre varias veces el mismo día.
function pickCategoryForToday(): string {
  const categoryNames = Object.keys(CATEGORIES)
  const now = new Date()
  const start = new Date(now.getUTCFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return categoryNames[dayOfYear % categoryNames.length]
}

// ── Core generation logic ──────────────────────────────────────────────────
async function generatePosts() {
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)

  const categoryName = pickCategoryForToday()

  const results: Array<{
    category: string
    title?: string
    hasTrend: boolean
    hasImage: boolean
    skipped?: boolean
    error?: string
  }> = []

  try {
    // Skip if a post for this category was already generated today
    const existingToday = await prisma.blogPost.findFirst({
      where: { category: categoryName, createdAt: { gte: todayStart } },
      select: { id: true, title: true },
    })

    if (existingToday) {
      results.push({ category: categoryName, title: existingToday.title, hasTrend: false, hasImage: false, skipped: true })
      return results
    }

    // Load recent posts for deduplication (last 60 days, up to 30)
    const recentPosts = await prisma.blogPost.findMany({
      where: {
        category: categoryName,
        createdAt: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      },
      select: { title: true, sourceUrl: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })

    const usedSourceUrls = new Set(recentPosts.map((p) => p.sourceUrl).filter(Boolean) as string[])
    const recentTitles = recentPosts.map((p) => p.title)

    const config = CATEGORIES[categoryName]

    // Fetch news candidates and pick the first unused article
    const articles = await fetchNewsArticles(config.searchQuery)
    const freshArticle = articles.find((a) => !usedSourceUrls.has(a.url)) ?? null
    const hasTrend = !!freshArticle

    const topic = hasTrend
      ? `${freshArticle!.title} — ${freshArticle!.description}`
      : config.fallbackTopic

    const newsContext = hasTrend
      ? `Fuente: ${freshArticle!.source}\nURL: ${freshArticle!.url}\nTítulo: ${freshArticle!.title}\nDescripción: ${freshArticle!.description}`
      : ''

    // Generate content with GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: buildPrompt(categoryName, topic, newsContext, recentTitles) }],
      temperature: 0.75,
      max_tokens: 2000,
    })

    const raw = completion.choices[0].message.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
    const parsed = JSON.parse(cleaned)
    const { title, excerpt, content, imageQuery, tags } = parsed

    // Fetch real image from Unsplash
    const imageSearchQuery = imageQuery || config.imageQuery
    const imageUrl = await fetchUnsplashImage(imageSearchQuery)
    const hasImage = !!imageUrl

    // Create unique slug from title + date
    const dateStr = new Date().toISOString().slice(0, 10)
    const titleSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)
    const slug = `${titleSlug}-${dateStr}`

    // Save to database (skip if slug already exists)
    await prisma.blogPost.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        excerpt,
        content,
        imageUrl: imageUrl ?? null,
        category: categoryName,
        tags: tags ?? [],
        published: true,
        aiGenerated: true,
        sourceUrl: freshArticle?.url ?? null,
        sourceTitle: freshArticle?.source ?? null,
      },
    })

    results.push({ category: categoryName, title, hasTrend, hasImage })

    // Trigger social media distribution asynchronously (fire-and-forget)
    const savedPost = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })
    if (savedPost) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
      fetch(`${baseUrl}/api/cron/distribute-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${process.env.CRON_SECRET ?? ''}`,
        },
        body: JSON.stringify({ blogPostId: savedPost.id }),
      }).catch(() => {}) // non-blocking
    }
  } catch (err) {
    results.push({
      category: categoryName,
      hasTrend: false,
      hasImage: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }

  return results
}

// ── GET — called by Vercel Cron or manually ────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = await generatePosts()

  return NextResponse.json({
    success: true,
    generated: results.filter((r) => !r.error && !r.skipped).length,
    skipped: results.filter((r) => r.skipped).length,
    failed: results.filter((r) => r.error).length,
    results,
  })
}

// ── POST — kept for backwards compatibility ────────────────────────────────
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = await generatePosts()

  return NextResponse.json({
    success: true,
    generated: results.filter((r) => !r.error && !r.skipped).length,
    skipped: results.filter((r) => r.skipped).length,
    failed: results.filter((r) => r.error).length,
    results,
  })
}
