// Shotstack — generates a 45-60s vertical video (9:16) from blog content
// Required env vars:
//   SHOTSTACK_API_KEY  — from shotstack.io
//   SHOTSTACK_ENV      — "stage" (free/test) or "v1" (production)

const BASE = 'https://api.shotstack.io'

interface VideoInput {
  title: string
  excerpt: string
  imageUrl: string
  audioUrl?: string   // hosted MP3 from ElevenLabs (optional)
  audioBase64?: string // base64 MP3 (fallback)
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

  // Truncate title and excerpt to safe lengths for overlays
  const titleText = input.title.slice(0, 80)
  const excerptText = input.excerpt.slice(0, 160)

  // Build Shotstack Edit JSON
  // Vertical 1080×1920 (9:16) — suitable for TikTok, Instagram Reels, YouTube Shorts
  const tracks: object[] = [
    // Track 0 — background image with Ken Burns effect
    {
      clips: [
        {
          asset: {
            type: 'image',
            src: input.imageUrl,
          },
          start: 0,
          length: 45,
          effect: 'zoomIn',
          transition: { in: 'fade', out: 'fade' },
        },
      ],
    },
    // Track 1 — dark overlay for text readability
    {
      clips: [
        {
          asset: {
            type: 'html',
            html: '<div style="width:100%;height:100%;background:rgba(0,0,0,0.45)"></div>',
            width: 1080,
            height: 1920,
          },
          start: 0,
          length: 45,
        },
      ],
    },
    // Track 2 — brand logo / channel name
    {
      clips: [
        {
          asset: {
            type: 'html',
            html: '<p style="font-family:sans-serif;font-size:36px;font-weight:700;color:#F97316;letter-spacing:2px;text-transform:uppercase">MIGRANTE GLOBAL</p>',
            width: 900,
            height: 80,
          },
          start: 0,
          length: 45,
          position: 'top',
          offset: { y: 0.08 },
          transition: { in: 'slideDown' },
        },
      ],
    },
    // Track 3 — main title
    {
      clips: [
        {
          asset: {
            type: 'html',
            html: `<p style="font-family:sans-serif;font-size:58px;font-weight:800;color:#FFFFFF;text-align:center;line-height:1.2;text-shadow:2px 2px 8px rgba(0,0,0,0.8)">${titleText}</p>`,
            width: 960,
            height: 500,
          },
          start: 0.5,
          length: 44,
          position: 'center',
          offset: { y: -0.1 },
          transition: { in: 'slideUp' },
        },
      ],
    },
    // Track 4 — excerpt / subtitle
    {
      clips: [
        {
          asset: {
            type: 'html',
            html: `<p style="font-family:sans-serif;font-size:38px;color:#E5E7EB;text-align:center;line-height:1.4;text-shadow:1px 1px 4px rgba(0,0,0,0.6)">${excerptText}</p>`,
            width: 900,
            height: 300,
          },
          start: 1.5,
          length: 42,
          position: 'center',
          offset: { y: 0.22 },
          transition: { in: 'fade' },
        },
      ],
    },
    // Track 5 — CTA at bottom
    {
      clips: [
        {
          asset: {
            type: 'html',
            html: '<p style="font-family:sans-serif;font-size:36px;font-weight:700;color:#F97316;text-align:center">👇 Link en bio — migranteglobal.ch</p>',
            width: 900,
            height: 80,
          },
          start: 38,
          length: 7,
          position: 'bottom',
          offset: { y: -0.08 },
          transition: { in: 'slideUp', out: 'fade' },
        },
      ],
    },
  ]

  // Add audio track if we have an MP3
  if (input.audioUrl) {
    tracks.push({
      clips: [
        {
          asset: {
            type: 'audio',
            src: input.audioUrl,
            volume: 1,
          },
          start: 0,
          length: 45,
        },
      ],
    })
  }

  const editPayload = {
    timeline: {
      soundtrack: {
        // Soft background music — royalty-free from Shotstack's library
        src: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/unminus/ambisonic.mp3',
        effect: 'fadeOut',
        volume: input.audioUrl ? 0.1 : 0.3, // lower music if voiceover present
      },
      tracks,
    },
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
    const videoUrl = await pollRender(renderId, apiKey, env)
    if (!videoUrl) {
      return { success: false, renderId, error: 'Render timed out or failed' }
    }

    return { success: true, renderId, videoUrl }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
