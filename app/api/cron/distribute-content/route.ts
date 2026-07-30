import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { adaptContentForSocials, type CarouselMode, type Historial } from '@/lib/social/content-adapter'
import { publishToInstagram, publishCarouselToInstagram } from '@/lib/social/instagram'
import { publishToFacebook, publishCarouselToFacebook } from '@/lib/social/facebook'
import { buildSlides, gatherSlideImages, renderCarouselJpegs, type CarouselSlideDef } from '@/lib/social/carousel'
import { getFormatoYGancho, simularCiclo, BANCO_GANCHOS } from '@/lib/social/format-cycle'
import { selectReferencia } from '@/lib/social/trending/seleccion'
import type { ReferenciaTrending } from '@/lib/social/trending/types'

const prisma = new PrismaClient()

// Renderizar ~8 láminas + polling del contenedor de Instagram tarda un rato
export const maxDuration = 300

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

async function buildHistorial(): Promise<Historial> {
  const [temas, ganchos] = await Promise.all([
    prisma.socialPost.findMany({
      where: { platform: 'instagram', status: 'published', tema: { not: null } },
      select: { tema: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.socialPost.findMany({
      where: { platform: 'instagram', status: 'published', ganchoId: { not: null } },
      select: { ganchoId: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])
  return {
    ultimosTemas: temas.map((t) => t.tema).filter((t): t is string => Boolean(t)),
    ultimosGanchos: ganchos
      .map((g) => (g.ganchoId != null ? BANCO_GANCHOS[g.ganchoId]?.slice(0, 60) : null))
      .filter((g): g is string => Boolean(g)),
  }
}

// Lógica compartida por POST (id explícito) y GET (último post publicado).
// Corre en el mismo proceso — la versión anterior se llamaba a sí misma por HTTP
// con NEXT_PUBLIC_SITE_URL sin definir (localhost) y la distribución nunca corría.
async function distributeBlogPost(blogPostId: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id: blogPostId },
    include: { socialPosts: { select: { platform: true, status: true } } },
  })

  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  // Solo lo PUBLICADO cuenta como distribuido — los intentos fallidos se reintentan
  const alreadyDistributed = post.socialPosts
    .filter((s) => s.status === 'published')
    .map((s) => s.platform)
  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://migranteglobal.ch'}/blog/${post.slug}`

  // 1 de cada 3 días el contenido es motivacional puro (mentalidad, sin trámites)
  // — gancho pasivo de clientes los demás días, conciencia y comunidad ese día.
  // Esto es ORTOGONAL al formato: el formato lo manda siempre el ciclo de 8.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getUTCFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  const modo: CarouselMode = dayOfYear % 3 === 0 ? 'motivacional' : 'blog'

  const { formato, ganchoId, ganchoTexto } = await getFormatoYGancho()

  // El barrido de tendencias NUNCA puede tumbar el post — si falla, referencia = null
  // y el generador sigue con el banco evergreen, como si no hubiera trending.
  let referencia: ReferenciaTrending | null = null
  try {
    referencia = await selectReferencia()
  } catch (err) {
    console.error('[trending] selección falló, se usa banco evergreen:', err)
  }

  const historial = await buildHistorial().catch(() => undefined)

  let adapted
  try {
    adapted = await adaptContentForSocials(
      post.title,
      post.excerpt,
      post.content,
      post.category,
      blogUrl,
      modo,
      formato,
      ganchoTexto,
      referencia,
      historial,
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Content adaptation failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }

  const results: Record<string, unknown> = { modo, formato, ganchoId, referencia: referencia?.url ?? null }

  const camposReferencia = {
    formato,
    ganchoId,
    tema: referencia?.tema ?? null,
    referenciaUrl: referencia?.url ?? null,
    referenciaAngulo: referencia?.angulo ?? null,
    referenciaScore: referencia?.score ?? null,
    referenciaFuente: referencia?.fuente ?? null,
  }

  // ── Preparar la imagen/imágenes según el formato asignado por el ciclo ─────
  // 'carrusel': varias láminas (texto + gancho/laminas/cta). 'dato': UNA lámina
  // (cifra + contexto). 'foto': una sola foto suelta, sin lámina renderizada.
  // Si el render de carrusel/dato falla, cae a imagen simple (post.imageUrl).
  let imagenesUrls: string[] | null = null
  let esCarruselMultiFoto = false

  if (formato === 'carrusel' && adapted.carousel?.gancho && adapted.carousel?.laminas?.length) {
    try {
      const slides = buildSlides(adapted.carousel)
      const imagenes = await gatherSlideImages(post.category, adapted.carousel.keywords ?? [], slides.length)
      imagenesUrls = await renderCarouselJpegs(slides, post.id, imagenes)
      esCarruselMultiFoto = true
      console.log(`[carrusel] ${imagenesUrls.length} láminas listas (${imagenes.length} con foto)`)
    } catch (err) {
      console.error('[carrusel] render falló, fallback a imagen simple:', err)
    }
  } else if (formato === 'dato' && adapted.dato?.cifra) {
    try {
      const slide: CarouselSlideDef[] = [
        { texto: `${adapted.dato.cifra}\n\n${adapted.dato.texto ?? ''}`.trim(), tipo: 'gancho' },
      ]
      const imagenes = await gatherSlideImages(post.category, adapted.dato.keywords ?? [], 1)
      const urls = await renderCarouselJpegs(slide, post.id, imagenes)
      imagenesUrls = urls
      console.log(`[dato] lámina lista (${imagenes.length} con foto)`)
    } catch (err) {
      console.error('[dato] render falló, fallback a imagen simple:', err)
    }
  } else if (formato === 'foto') {
    const foto = await fetchUnsplashFoto(adapted.foto?.keywords ?? [])
    if (foto) imagenesUrls = [foto]
  }

  // ── Instagram ────────────────────────────────────────────────────────────
  if (!alreadyDistributed.includes('instagram')) {
    let igStatus = 'failed'
    let igPlatformId: string | undefined
    let igPlatformUrl: string | undefined
    let igError: string | undefined

    if (esCarruselMultiFoto && imagenesUrls && imagenesUrls.length >= 2) {
      const igResult = await publishCarouselToInstagram(imagenesUrls, adapted.instagram.caption, adapted.instagram.hashtags)
      igStatus = igResult.success ? 'published' : 'failed'
      igPlatformId = igResult.platformId
      igPlatformUrl = igResult.platformUrl
      igError = igResult.error
    } else if (imagenesUrls && imagenesUrls[0]) {
      const igResult = await publishToInstagram(imagenesUrls[0], adapted.instagram.caption, adapted.instagram.hashtags)
      igStatus = igResult.success ? 'published' : 'failed'
      igPlatformId = igResult.platformId
      igPlatformUrl = igResult.platformUrl
      igError = igResult.error
    } else if (post.imageUrl) {
      const igResult = await publishToInstagram(post.imageUrl, adapted.instagram.caption, adapted.instagram.hashtags)
      igStatus = igResult.success ? 'published' : 'failed'
      igPlatformId = igResult.platformId
      igPlatformUrl = igResult.platformUrl
      igError = igResult.error
    } else {
      igStatus = 'skipped'
      igError = 'No imagen disponible para el post de Instagram'
    }

    await prisma.socialPost.create({
      data: {
        blogPostId: post.id,
        platform: 'instagram',
        status: igStatus,
        caption: adapted.instagram.caption,
        hashtags: adapted.instagram.hashtags,
        platformId: igPlatformId,
        platformUrl: igPlatformUrl,
        error: igError,
        publishedAt: igStatus === 'published' ? new Date() : undefined,
        ...camposReferencia,
      },
    })

    results.instagram = { status: igStatus, url: igPlatformUrl, error: igError }
  }

  // ── Facebook ─────────────────────────────────────────────────────────────
  if (!alreadyDistributed.includes('facebook')) {
    let fbStatus = 'failed'
    let fbPlatformId: string | undefined
    let fbPlatformUrl: string | undefined
    let fbError: string | undefined

    if (esCarruselMultiFoto && imagenesUrls && imagenesUrls.length >= 2) {
      const fbResult = await publishCarouselToFacebook(imagenesUrls, adapted.instagram.caption, adapted.instagram.hashtags)
      fbStatus = fbResult.success ? 'published' : 'failed'
      fbPlatformId = fbResult.platformId
      fbPlatformUrl = fbResult.platformUrl
      fbError = fbResult.error
    } else if (imagenesUrls && imagenesUrls[0]) {
      const fbResult = await publishToFacebook(imagenesUrls[0], adapted.instagram.caption, adapted.instagram.hashtags)
      fbStatus = fbResult.success ? 'published' : 'failed'
      fbPlatformId = fbResult.platformId
      fbPlatformUrl = fbResult.platformUrl
      fbError = fbResult.error
    } else if (post.imageUrl) {
      const fbResult = await publishToFacebook(post.imageUrl, adapted.instagram.caption, adapted.instagram.hashtags)
      fbStatus = fbResult.success ? 'published' : 'failed'
      fbPlatformId = fbResult.platformId
      fbPlatformUrl = fbResult.platformUrl
      fbError = fbResult.error
    } else {
      fbStatus = 'skipped'
      fbError = 'No imagen disponible para el post de Facebook'
    }

    await prisma.socialPost.create({
      data: {
        blogPostId: post.id,
        platform: 'facebook',
        status: fbStatus,
        caption: adapted.instagram.caption,
        hashtags: adapted.instagram.hashtags,
        platformId: fbPlatformId,
        platformUrl: fbPlatformUrl,
        error: fbError,
        publishedAt: fbStatus === 'published' ? new Date() : undefined,
        ...camposReferencia,
      },
    })

    results.facebook = { status: fbStatus, url: fbPlatformUrl, error: fbError }
  }

  return NextResponse.json({ success: true, blogPostId, results })
}

// Dry run — no publica ni escribe en DB. Muestra qué asignaría el ciclo hoy
// (formato, gancho, referencia) y simula los próximos 8 slots del ciclo.
async function dryRunPlan() {
  const { formato, ganchoId, ganchoTexto, cicloCount } = await getFormatoYGancho()
  const referencia = await selectReferencia().catch(() => null)
  const simulacion8 = simularCiclo(cicloCount, 8)

  return NextResponse.json({
    hoy: { formato, ganchoId, ganchoTexto, referencia },
    simulacion8: simulacion8.map((s, i) => ({
      dia: i + 1,
      ...s,
      referencia: i === 0 ? referencia : null,
      nota: i === 0 ? undefined : 'la referencia de días futuros depende del barrido de ese día',
    })),
  })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { blogPostId } = body as { blogPostId?: string }

  if (!blogPostId) {
    return NextResponse.json({ error: 'blogPostId required' }, { status: 400 })
  }

  return distributeBlogPost(blogPostId)
}

// GET — distribuye el último post publicado (lo invoca el cron de Vercel a diario).
// ?dryRun=1 devuelve el plan (formato/gancho/referencia + simulación) sin publicar.
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (req.nextUrl.searchParams.get('dryRun')) {
    return dryRunPlan()
  }

  const latest = await prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  })

  if (!latest) {
    return NextResponse.json({ error: 'No published posts found' }, { status: 404 })
  }

  const res = await distributeBlogPost(latest.id)
  const data = await res.json()
  return NextResponse.json({ post: latest.title, ...data }, { status: res.status })
}
