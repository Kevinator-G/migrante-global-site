import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── GNews ──────────────────────────────────────────────────────────────────
async function fetchTrendingNews(query: string): Promise<{
  title: string
  description: string
  url: string
  source: string
} | null> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) return null

  try {
    const params = new URLSearchParams({
      q: query,
      lang: 'es',
      country: 'ch',
      max: '5',
      apikey: apiKey,
    })
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.articles?.length) return null
    const article = data.articles[0]
    return {
      title: article.title,
      description: article.description ?? '',
      url: article.url,
      source: article.source?.name ?? '',
    }
  } catch {
    return null
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
    searchQuery: 'permiso residencia Suiza inmigrante 2024',
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
    searchQuery: 'noticias Suiza latinos hispanos comunidad',
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
  newsContext: string
): string {
  return `Eres Kevin García, consultor de inmigración en Suiza con 10 años de experiencia ayudando a latinos a migrar de forma segura y ordenada. Escribes de forma directa, cercana y honesta — sin corporativismo ni jerga burocrática. Usas "tú", párrafos cortos, y abres cada artículo con un gancho que para al lector en seco.

CATEGORÍA: ${category}
TEMA: ${topic}
${newsContext ? `CONTEXTO DE ACTUALIDAD:\n${newsContext}\n` : ''}

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

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Authorize cron calls
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const categoryNames = Object.keys(CATEGORIES)
  const results: Array<{
    category: string
    title?: string
    hasTrend: boolean
    hasImage: boolean
    error?: string
  }> = []

  for (const categoryName of categoryNames) {
    try {
      const config = CATEGORIES[categoryName]

      // 1. Try to get trending news
      const news = await fetchTrendingNews(config.searchQuery)
      const hasTrend = !!news

      const topic = hasTrend
        ? `${news!.title} — ${news!.description}`
        : config.fallbackTopic

      const newsContext = hasTrend
        ? `Fuente: ${news!.source}\nURL: ${news!.url}\nTítulo: ${news!.title}\nDescripción: ${news!.description}`
        : ''

      // 2. Generate content with GPT-4o
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: buildPrompt(categoryName, topic, newsContext) }],
        temperature: 0.75,
        max_tokens: 2000,
      })

      const raw = completion.choices[0].message.content ?? '{}'
      const parsed = JSON.parse(raw)

      const { title, excerpt, content, imageQuery, tags } = parsed

      // 3. Fetch real image from Unsplash
      const imageSearchQuery = imageQuery || config.imageQuery
      const imageUrl = await fetchUnsplashImage(imageSearchQuery)
      const hasImage = !!imageUrl

      // 4. Create slug
      const slug =
        title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .slice(0, 80) +
        '-' +
        Date.now()

      // 5. Save to database
      await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          imageUrl: imageUrl ?? null,
          category: categoryName,
          tags: tags ?? [],
          published: true,
          readTime: Math.ceil(content.split(' ').length / 200),
        },
      })

      results.push({ category: categoryName, title, hasTrend, hasImage })
    } catch (err) {
      results.push({
        category: categoryName,
        hasTrend: false,
        hasImage: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return NextResponse.json({
    success: true,
    generated: results.filter((r) => !r.error).length,
    failed: results.filter((r) => r.error).length,
    results,
  })
}
