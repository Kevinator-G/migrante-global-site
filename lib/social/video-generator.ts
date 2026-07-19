// Shotstack — genera un video vertical de 45s (9:16) desde el contenido del blog
//
// Estructura del video (5 escenas, no una sola imagen con zoom):
//   0–6s    GANCHO      — frase que para el scroll, imagen 1
//   6–17s   PUNTO 1     — imagen 2
//   17–28s  PUNTO 2     — imagen 3
//   28–38s  PUNTO 3     — imagen 4
//   38–45s  CTA         — vuelve a la imagen 1
// Cada escena usa una imagen y un efecto de movimiento distintos.
// Si solo hay una imagen disponible, se reutiliza variando el efecto.
//
// Required env vars:
//   SHOTSTACK_API_KEY  — from shotstack.io
//   SHOTSTACK_ENV      — "stage" (free/test) or "v1" (production)
//
// NOTA sandbox (stage): solo assets tipo 'title'/'image'/'audio' con URLs
// públicas; nada de soundtrack ni html (ver commits jul 2026).

const BASE = 'https://api.shotstack.io'

const DURATION = 45
// [inicio, fin] de cada escena
const SCENES: Array<[number, number]> = [
  [0, 6],
  [6, 17],
  [17, 28],
  [28, 38],
  [38, DURATION],
]
// Efectos válidos de Shotstack — solo slides para evitar que el zoom corte el texto
const EFFECTS = ['slideLeft', 'slideRight', 'slideLeft', 'slideRight', 'slideLeft']

interface VideoInput {
  title: string
  excerpt: string
  imageUrl: string
  imageUrls?: string[]  // imágenes extra (biblioteca propia o Unsplash) — una por escena
  clipUrl?: string      // clip de video propio para la escena del gancho (se silencia)
  gancho?: string       // textos de escena generados por el content-adapter
  puntos?: string[]
  cta?: string
  audioUrl?: string     // MP3 de ElevenLabs alojado en Vercel Blob
}

interface VideoResult {
  success: boolean
  renderId?: string
  videoUrl?: string
  error?: string
}

// Poll for render completion, up to maxWaitMs
async function pollRender(
  renderId: string,
  apiKey: string,
  env: string,
  maxWaitMs = 90_000,
): Promise<string | null> {
  const deadline = Date.now() + maxWaitMs
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 4000))
    const res = await fetch(`${BASE}/${env}/render/${renderId}`, {
      headers: { 'x-api-key': apiKey },
    })
    if (!res.ok) break
    const data = await res.json()
    const status: string = data.response?.status ?? ''
    if (status === 'done') return data.response.url as string
    if (status === 'failed') break
  }
  return null
}

export async function generateVideo(input: VideoInput): Promise<VideoResult> {
  const apiKey = process.env.SHOTSTACK_API_KEY
  if (!apiKey) return { success: false, error: 'SHOTSTACK_API_KEY not set' }

  const env = process.env.SHOTSTACK_ENV ?? 'stage'

  // Textos por escena — con fallback al comportamiento anterior (título + excerpt)
  const gancho = (input.gancho ?? input.title).slice(0, 80)
  const puntos = (input.puntos && input.puntos.length >= 3
    ? input.puntos
    : [input.excerpt.slice(0, 90), 'Te lo explico paso a paso', 'Sin promesas falsas — información real']
  ).map((p) => p.slice(0, 100))
  const cta = (input.cta ?? 'Lee la guía completa en migranteglobal.ch').slice(0, 60)

  // Pool de imágenes: la del blog + extras; se recicla si faltan
  const pool = [input.imageUrl, ...(input.imageUrls ?? [])].filter(Boolean)
  const imageFor = (i: number) => pool[i % pool.length]
  // La escena CTA vuelve a la primera imagen para cerrar el círculo
  const sceneImages = [imageFor(0), imageFor(1), imageFor(2), imageFor(3), imageFor(0)]

  const sceneTexts = [gancho, puntos[0], puntos[1], puntos[2], cta]

  // Track 0 — fondo de cada escena con efectos alternados. Si hay un clip de
  // video propio, abre el gancho (silenciado — la voz en off va aparte).
  const imageClips = SCENES.map(([start, end], i) => {
    if (i === 0 && input.clipUrl) {
      return {
        asset: { type: 'video', src: input.clipUrl, volume: 0, trim: 0 },
        start,
        length: end - start,
        transition: { in: 'fade', out: 'fade' },
      }
    }
    return {
      asset: { type: 'image', src: sceneImages[i] },
      start,
      length: end - start,
      effect: EFFECTS[i],
      transition: { in: 'fade', out: 'fade' },
    }
  })

  // Track 1 — texto principal de cada escena
  // style 'minimal' es el más fiable en sandbox — 'blockbuster' desborda el frame 9:16
  const textClips = SCENES.map(([start, end], i) => ({
    asset: {
      type: 'title',
      text: sceneTexts[i],
      style: 'minimal',
      color: i === SCENES.length - 1 ? '#F97316' : '#FFFFFF',
      size: i === 0 ? 'large' : 'medium',
    },
    start: start + 0.3,
    length: end - start - 0.3,
    position: 'center',
    transition: { in: 'slideUp', out: 'fade' },
  }))

  // Track 2 — numeración de los puntos (1/3, 2/3, 3/3) para dar progresión
  const counterClips = [1, 2, 3].map((n, i) => {
    const [start, end] = SCENES[i + 1]
    return {
      asset: {
        type: 'title',
        text: `${n}/3`,
        style: 'minimal',
        color: '#F97316',
        size: 'small',
      },
      start: start + 0.3,
      length: end - start - 0.3,
      position: 'top',
      offset: { y: -0.18 },
      transition: { in: 'fade', out: 'fade' },
    }
  })

  const tracks: object[] = [
    { clips: textClips },
    { clips: counterClips },
    // Marca siempre visible
    {
      clips: [
        {
          asset: {
            type: 'title',
            text: 'MIGRANTE GLOBAL',
            style: 'minimal',
            color: '#F97316',
            size: 'x-small',
          },
          start: 0,
          length: DURATION,
          position: 'top',
          offset: { y: 0.08 },
          transition: { in: 'slideDown' },
        },
      ],
    },
    // Dominio en la escena final
    {
      clips: [
        {
          asset: {
            type: 'title',
            text: 'migranteglobal.ch',
            style: 'minimal',
            color: '#FFFFFF',
            size: 'small',
          },
          start: SCENES[4][0],
          length: DURATION - SCENES[4][0],
          position: 'bottom',
          offset: { y: -0.1 },
          transition: { in: 'slideUp', out: 'fade' },
        },
      ],
    },
    { clips: imageClips },
  ]

  // Voz en off (si el MP3 quedó alojado)
  if (input.audioUrl) {
    tracks.push({
      clips: [
        {
          asset: { type: 'audio', src: input.audioUrl, volume: 1 },
          start: 0,
          length: DURATION,
        },
      ],
    })
  }

  const editPayload = {
    timeline: { tracks },
    output: {
      format: 'mp4',
      resolution: '1080',
      aspectRatio: '9:16',
      fps: 30,
    },
  }

  try {
    const renderRes = await fetch(`${BASE}/${env}/render`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editPayload),
    })

    if (!renderRes.ok) {
      const err = await renderRes.text()
      return { success: false, error: `Shotstack render failed: ${err}` }
    }

    const renderData = await renderRes.json()
    const renderId: string = renderData.response?.id
    if (!renderId) return { success: false, error: 'No render ID returned' }

    // Wait for the video to finish rendering
    const videoUrl = await pollRender(renderId, apiKey, env, 180_000)
    if (!videoUrl) {
      return { success: false, renderId, error: 'Render timed out or failed' }
    }

    return { success: true, renderId, videoUrl }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
