// Facebook Graph API — publishes photo and video posts to a Facebook Page
// Required env vars:
//   FACEBOOK_PAGE_ACCESS_TOKEN — Page token with pages_manage_posts permission
//   FACEBOOK_PAGE_ID           — numeric Page ID

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
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    return { success: false, error: 'FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID not set' }
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

// Publica el video vertical en la página (el mismo que va a Reels/TikTok/Shorts).
// Se sube por URL — el video ya está alojado públicamente en Shotstack.
export async function publishVideoToFacebook(
  videoUrl: string,
  description: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    return { success: false, error: 'FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID not set' }
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
