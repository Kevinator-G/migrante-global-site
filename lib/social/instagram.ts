// Instagram Graph API — publishes an image post to a Business account
// Token: usa el token de página permanente de SocialCredential ('meta_page')
// con fallback a INSTAGRAM_ACCESS_TOKEN. INSTAGRAM_ACCOUNT_ID sigue en env.

import { getInstagramToken } from './meta-token'

const BASE = 'https://graph.facebook.com/v19.0'

interface PublishResult {
  success: boolean
  platformId?: string
  platformUrl?: string
  error?: string
}

// El media-id no forma una URL /p/ válida — el permalink real hay que pedirlo
async function fetchPermalink(mediaId: string, token: string): Promise<string> {
  try {
    const res = await fetch(`${BASE}/${mediaId}?fields=permalink&access_token=${token}`)
    const data = await res.json()
    if (data.permalink) return data.permalink as string
  } catch {
    // no fatal — caemos a la URL construida
  }
  return `https://www.instagram.com/p/${mediaId}/`
}

// Step 1: create a media container
async function createMediaContainer(
  accountId: string,
  token: string,
  imageUrl: string,
  caption: string,
): Promise<string> {
  const res = await fetch(`${BASE}/${accountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption,
      access_token: token,
    }),
  })
  const data = await res.json()
  if (!res.ok || !data.id) throw new Error(data.error?.message ?? 'Failed to create container')
  return data.id as string
}

// Step 2: publish the container
async function publishContainer(
  accountId: string,
  token: string,
  containerId: string,
): Promise<string> {
  const res = await fetch(`${BASE}/${accountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: token,
    }),
  })
  const data = await res.json()
  if (!res.ok || !data.id) throw new Error(data.error?.message ?? 'Failed to publish')
  return data.id as string
}

// Carrusel: contenedor hijo por lámina → contenedor CAROUSEL → publicar.
// Las URLs deben ser JPEG públicos (las prepara lib/social/carousel.ts).
export async function publishCarouselToInstagram(
  imageUrls: string[],
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = await getInstagramToken()
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID

  if (!token || !accountId) {
    return { success: false, error: 'Token de Instagram no disponible o INSTAGRAM_ACCOUNT_ID not set' }
  }
  if (imageUrls.length < 2 || imageUrls.length > 10) {
    return { success: false, error: `Carrusel requiere 2-10 láminas, hay ${imageUrls.length}` }
  }

  try {
    const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

    // 1. Contenedor por cada lámina
    const children: string[] = []
    for (const imageUrl of imageUrls) {
      const res = await fetch(`${BASE}/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          is_carousel_item: true,
          access_token: token,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.id) {
        throw new Error(data.error?.message ?? 'Failed to create carousel item')
      }
      children.push(data.id as string)
    }

    // 2. Contenedor padre CAROUSEL
    const parentRes = await fetch(`${BASE}/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'CAROUSEL',
        children,
        caption: fullCaption,
        access_token: token,
      }),
    })
    const parentData = await parentRes.json()
    const parentId: string = parentData.id
    if (!parentRes.ok || !parentId) {
      throw new Error(parentData.error?.message ?? 'Failed to create carousel container')
    }

    // 3. Esperar a que el contenedor esté listo (hasta 60s)
    const deadline = Date.now() + 60_000
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 4000))
      const statusRes = await fetch(
        `${BASE}/${parentId}?fields=status_code&access_token=${token}`,
      )
      const statusData = await statusRes.json()
      if (statusData.status_code === 'FINISHED') break
      if (statusData.status_code === 'ERROR') {
        throw new Error('Instagram carousel container processing failed')
      }
    }

    // 4. Publicar
    const postId = await publishContainer(accountId, token, parentId)
    return {
      success: true,
      platformId: postId,
      platformUrl: await fetchPermalink(postId, token),
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Instagram carousel error',
    }
  }
}

export async function publishToInstagram(
  imageUrl: string,
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = await getInstagramToken()
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID

  if (!token || !accountId) {
    return { success: false, error: 'Token de Instagram no disponible o INSTAGRAM_ACCOUNT_ID not set' }
  }

  try {
    const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

    const containerId = await createMediaContainer(accountId, token, imageUrl, fullCaption)

    // Instagram requires a short wait between container creation and publish
    await new Promise((r) => setTimeout(r, 3000))

    const postId = await publishContainer(accountId, token, containerId)

    return { success: true, platformId: postId, platformUrl: await fetchPermalink(postId, token) }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Instagram error',
    }
  }
}
