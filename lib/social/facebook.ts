// Facebook Graph API — publishes photo and video posts to a Facebook Page
// Token: usa el token de página permanente de SocialCredential ('meta_page')
// con fallback a FACEBOOK_PAGE_ACCESS_TOKEN. FACEBOOK_PAGE_ID sigue en env.

import { getFacebookToken } from './meta-token'

const BASE = 'https://graph.facebook.com/v19.0'

interface PublishResult {
  success: boolean
  platformId?: string
  platformUrl?: string
  error?: string
}

export async function publishToFacebook(
  imageUrl: string,
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = await getFacebookToken()
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    return { success: false, error: 'Token de Facebook no disponible o FACEBOOK_PAGE_ID not set' }
  }

  try {
    const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

    const res = await fetch(`${BASE}/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        caption: fullCaption,
        access_token: token,
      }),
    })

    const data = await res.json()
    if (!res.ok || !data.id) {
      throw new Error(data.error?.message ?? 'Failed to publish to Facebook')
    }

    const postId = data.post_id ?? data.id
    return {
      success: true,
      platformId: postId,
      platformUrl: `https://www.facebook.com/${pageId}/posts/${postId}`,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Facebook error',
    }
  }
}

// Carrusel como post multi-foto: cada foto se sube sin publicar y luego un
// post del feed las agrupa con attached_media.
export async function publishCarouselToFacebook(
  imageUrls: string[],
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = await getFacebookToken()
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    return { success: false, error: 'Token de Facebook no disponible o FACEBOOK_PAGE_ID not set' }
  }

  try {
    const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

    const mediaIds: string[] = []
    for (const imageUrl of imageUrls) {
      const res = await fetch(`${BASE}/${pageId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imageUrl,
          published: false,
          access_token: token,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.id) {
        throw new Error(data.error?.message ?? 'Failed to upload carousel photo')
      }
      mediaIds.push(data.id as string)
    }

    const feedRes = await fetch(`${BASE}/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: fullCaption,
        attached_media: mediaIds.map((id) => ({ media_fbid: id })),
        access_token: token,
      }),
    })
    const feedData = await feedRes.json()
    if (!feedRes.ok || !feedData.id) {
      throw new Error(feedData.error?.message ?? 'Failed to publish carousel post')
    }

    return {
      success: true,
      platformId: feedData.id,
      platformUrl: `https://www.facebook.com/${feedData.id}`,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Facebook carousel error',
    }
  }
}

// Publica el video vertical en la página (el mismo que va a Reels/TikTok/Shorts).
// Se sube por URL — el video ya está alojado públicamente en Shotstack.
export async function publishVideoToFacebook(
  videoUrl: string,
  description: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = await getFacebookToken()
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    return { success: false, error: 'Token de Facebook no disponible o FACEBOOK_PAGE_ID not set' }
  }

  try {
    const fullDescription = `${description}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

    const res = await fetch(`${BASE}/${pageId}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_url: videoUrl,
        description: fullDescription,
        access_token: token,
      }),
    })

    const data = await res.json()
    if (!res.ok || !data.id) {
      throw new Error(data.error?.message ?? 'Failed to publish video to Facebook')
    }

    return {
      success: true,
      platformId: data.id,
      platformUrl: `https://www.facebook.com/${pageId}/videos/${data.id}`,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Facebook video error',
    }
  }
}
