import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import { pickBlogFoto } from '@/lib/social/media-library'

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

// Las URLs de Unsplash llevan un parámetro ixid que cambia en cada petición —
// para comparar si una foto ya se usó hay que quedarse con la parte estable.
function unsplashPhotoKey(url: string): string {
  return url.split('?')[0]
}

// ── Unsplash — una búsqueda, devuelve solo fotos NO usadas todavía ────────
async function buscarUnsplash(
  query: string,
  usedKeys: Set<string>,
): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return []

  try {
    const params = new URLSearchParams({
      query,
      per_page: '30',
      orientation: 'landscape',
    })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    const results: Array<{ urls: { regular: string } }> = data.results ?? []
    // Solo las que no se hayan publicado ya (comparando la foto, no la URL con ixid)
    return results
      .map((r) => r.urls.regular)
      .filter((u) => !usedKeys.has(unsplashPhotoKey(u)))
  } catch {
    return []
  }
}

// Variantes de búsqueda: el query principal y luego los imageTags que la IA
// genera para el artículo. Ampliar los tags multiplica el pool de fotos — si
// "apartment keys rental contract" ya se agotó, se prueba "moving boxes
// apartment", "signing lease paperwork"... así dos artículos del mismo tema
// casi nunca caen en la misma imagen.
// Los `tags` en español NO se usan para buscar: Unsplash indexa en inglés y
// devolvería resultados aleatorios sin relación con el tema.
function construirQueries(
  imageQuery: string | undefined,
  fallback: string,
  imageTags: unknown,
): string[] {
  const base = (imageQuery ?? '').trim()
  const visuales = (Array.isArray(imageTags) ? imageTags : [])
    .map((t) => String(t).trim())
    .filter((t) => t.length > 2 && t.length < 60 && /^[\x20-\x7E]+$/.test(t))

  const variantes = [base, ...visuales, fallback]

  // Sin duplicados ni vacíos, manteniendo el orden de preferencia
  return [...new Set(variantes.map((v) => v.replace(/\s+/g, ' ').trim()))].filter(Boolean)
}

// Recorre las variantes hasta encontrar una foto que no se haya usado nunca.
// Solo si TODAS fallan se permite repetir (mejor una foto repetida que ninguna).
async function elegirFotoUnica(
  queries: string[],
  usedKeys: Set<string>,
): Promise<string | null> {
  for (const q of queries) {
    const libres = await buscarUnsplash(q, usedKeys)
    if (libres.length > 0) {
      return libres[Math.floor(Math.random() * libres.length)]
    }
  }
  // Último recurso: cualquier resultado del primer query, aunque repita
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey || queries.length === 0) return null
  try {
    const params = new URLSearchParams({ query: queries[0], per_page: '30', orientation: 'landscape' })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    const results: Array<{ urls: { regular: string } }> = data.results ?? []
    return results[Math.floor(Math.random() * results.length)]?.urls.regular ?? null
  } catch {
    return null
  }
}

// GNews puede matchear artículos donde las palabras del query aparecen sueltas
// sin que el artículo trate realmente el tema (ej. "Suiza" mencionada de pasada
// en una noticia de otro país). Este filtro descarta esos falsos positivos antes
// de usar el artículo como tema del blog — verificado en vivo el 31 jul 2026
// junto con el mismo problema en historia-humana.ts.
async function esRelevante(categoria: string, articulo: { title: string; description: string }): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Respondes SOLO "si" o "no", sin explicación. Evalúas si una noticia es genuinamente relevante para un blog de inmigración de latinos en Suiza — no basta con que mencione Suiza de pasada.',
        },
        {
          role: 'user',
          content: `Categoría del blog: ${categoria}\n\n¿Esta noticia trata genuinamente ese tema para latinos que migran o viven en Suiza? Responde "no" si Suiza o el tema solo se mencionan de pasada (ej. un país más en una lista, algo de otro contexto).\n\nTítulo: ${articulo.title}\nDescripción: ${articulo.description}`,
        },
      ],
      temperature: 0,
      max_tokens: 5,
    })
    return (completion.choices[0].message.content ?? '').trim().toLowerCase().startsWith('si')
  } catch {
    return false // ante la duda, se usa el fallbackTopic en vez del artículo
  }
}

// ── Category config ────────────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear()

const CATEGORIES: Record<
  string,
  { searchQuery: string; fallbackTopic: string; imageQuery: string }
> = {
  'Visas y permisos': {
    searchQuery: `permiso residencia Suiza inmigrante ${CURRENT_YEAR}`,
    fallbackTopic: `Los nuevos cambios en el sistema de permisos B y C en Suiza para ${CURRENT_YEAR}`,
    imageQuery: 'passport visa stamp documents',
  },
  'Mercado laboral': {
    searchQuery: `empleo trabajo Suiza salario extranjero ${CURRENT_YEAR}`,
    fallbackTopic: 'Cómo encontrar trabajo en Suiza sin hablar alemán: lo que nadie te dice',
    imageQuery: 'job interview office professionals',
  },
  'Homologación de títulos': {
    searchQuery: 'homologación título universitario Suiza reconocimiento',
    fallbackTopic: 'Paso a paso: cómo homologar tu título universitario en Suiza',
    imageQuery: 'university degree diploma certificate',
  },
  'Bienestar y salud': {
    searchQuery: 'seguro salud Suiza inmigrante KVG',
    fallbackTopic: 'Cómo funciona el seguro médico en Suiza y qué cubre para los recién llegados',
    imageQuery: 'doctor health insurance card clinic',
  },
  'Educación y familia': {
    searchQuery: 'educación hijos Suiza familia reagrupación',
    fallbackTopic: 'Reagrupación familiar en Suiza: qué necesitas saber antes de empezar',
    imageQuery: 'family children school classroom',
  },
  'Finanzas y vivienda': {
    searchQuery: 'alquiler piso Suiza caro vivienda inmigrante',
    fallbackTopic: 'Cómo alquilar un piso en Suiza siendo extranjero: errores que cometen todos',
    imageQuery: 'apartment keys rental contract',
  },
  'Noticias Suiza': {
    searchQuery: `noticias Suiza latinos hispanos comunidad ${CURRENT_YEAR}`,
    fallbackTopic: 'Lo que está pasando en Suiza que afecta directamente a los inmigrantes latinos',
    imageQuery: 'swiss flag newspaper government',
  },
  'Cultura y adaptación': {
    searchQuery: 'cultura suiza adaptación extranjero integración',
    fallbackTopic: 'Choques culturales reales que nadie te advierte antes de llegar a Suiza',
    imageQuery: 'diverse people community meeting',
  },
  Emprendimiento: {
    searchQuery: 'emprender negocio Suiza startup extranjero',
    fallbackTopic: 'Cómo registrar una empresa en Suiza siendo extranjero y no morir en el intento',
    imageQuery: 'entrepreneur laptop business plan',
  },
  Impuestos: {
    searchQuery: `impuestos declaración renta Suiza inmigrante ${CURRENT_YEAR}`,
    fallbackTopic: `Declaración de impuestos en Suiza: guía clara para ${CURRENT_YEAR}`,
    imageQuery: 'tax forms calculator documents',
  },
}

// ── Prompt (Kevin's voice) ─────────────────────────────────────────────────
function buildPrompt(
  category: string,
  topic: string,
  newsContext: string,
  recentTitles: string[],
): string {
  const year = new Date().getFullYear()
  const avoidSection = recentTitles.length
    ? `\nTEMAS YA PUBLICADOS — NO repitas estos ángulos, escribe desde una perspectiva diferente:\n${recentTitles.map((t) => `- ${t}`).join('\n')}\n`
    : ''

  return `Eres Kevin García, consultor de inmigración en Suiza con 10 años de experiencia ayudando a latinos a migrar de forma segura y ordenada. Escribes de forma directa, cercana y honesta — sin corporativismo ni jerga burocrática. Usas "tú", párrafos cortos, y abres cada artículo con un gancho que para al lector en seco.

AÑO ACTUAL: ${year} — usa siempre ${year} cuando menciones el año. Nunca escribas años anteriores.

CATEGORÍA: ${category}
TEMA: ${topic}
${newsContext ? `CONTEXTO DE ACTUALIDAD:\n${newsContext}\n` : ''}${avoidSection}
Escribe un artículo de blog en español (mínimo 600 palabras) con esta estructura JSON exacta:

{
  "title": "Título directo y específico — sin clickbait barato, pero que genere urgencia real",
  "excerpt": "Resumen de 1-2 frases que engancha sin revelar todo",
  "content": "Contenido completo en Markdown. Empieza con un párrafo gancho de 2-3 líneas que describe la situación del lector. Sigue con H2 para cada sección. Termina con una llamada a la acción natural hacia una consulta personalizada.",
  "imageQuery": "3-5 palabras en inglés que describan VISUALMENTE el tema concreto del artículo para buscar en Unsplash. Objetos y personas del tema, NUNCA paisajes ni montañas (ej: seguro médico → 'doctor health insurance card', vivienda → 'apartment keys rental contract', permisos → 'passport residence permit stamp')",
  "tags": ["6 a 8 tags", "en español, específicos del artículo", "sirven para el SEO y para variar la foto de portada"],
  "imageTags": ["4 a 6 términos VISUALES en inglés, distintos entre sí y distintos del imageQuery", "cada uno debe evocar una foto diferente del mismo tema", "ej. para vivienda: 'moving boxes apartment', 'signing lease paperwork', 'landlord handing keys', 'empty living room sunlight'"]
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
      select: { title: true, sourceUrl: true, imageUrl: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })

    const usedSourceUrls = new Set(recentPosts.map((p) => p.sourceUrl).filter(Boolean) as string[])
    const recentTitles = recentPosts.map((p) => p.title)

    // Las fotos ya usadas hay que mirarlas en TODO el blog, no solo en esta
    // categoría: si no, la misma imagen aparecía en "Impuestos" y en "Finanzas
    // y vivienda" sin que el filtro se enterara. Ventana amplia (1 año) porque
    // el catálogo de Unsplash por query es corto y se agota rápido.
    const postsConFoto = await prisma.blogPost.findMany({
      where: {
        imageUrl: { not: null },
        createdAt: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      },
      select: { imageUrl: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    // Clave estable de cada foto ya usada (sin el ixid variable de Unsplash)
    const usedImageUrls = new Set(
      (postsConFoto.map((p) => p.imageUrl).filter(Boolean) as string[]).map(unsplashPhotoKey),
    )

    const config = CATEGORIES[categoryName]

    // Fetch news candidates and pick the first unused, genuinely relevant article
    const articles = await fetchNewsArticles(config.searchQuery)
    let freshArticle: (typeof articles)[number] | null = null
    for (const candidato of articles) {
      if (usedSourceUrls.has(candidato.url)) continue
      if (await esRelevante(categoryName, candidato)) {
        freshArticle = candidato
        break
      }
    }
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
    const { title, excerpt, content, imageQuery, tags, imageTags } = parsed

    // Imagen del hero: primero foto propia DE LA MISMA categoría; si no hay,
    // Unsplash con el query específico del tema del artículo (generado por la IA)
    // y como último recurso el query temático de la categoría. Nunca paisajes genéricos.
    const fotoPropia = await pickBlogFoto(categoryName)
    const imageUrl =
      fotoPropia ??
      (await elegirFotoUnica(
        construirQueries(imageQuery, config.imageQuery, imageTags),
        usedImageUrls,
      ))
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
