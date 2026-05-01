// Instagram Graph API — publishes an image post to a Business account
// Required env vars:
//   INSTAGRAM_ACCESS_TOKEN  — long-lived token (60 days), refresh before expiry
//   INSTAGRAM_ACCOUNT_ID    — numeric ID of the Instagram Business Account

const BASE = 'https://graph.facebook.com/v19.0'

interface PublishResult {
  success: boolean
  platformId?: string
  platformUrl?: string
  error?: string
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

export async function publishToInstagram(
  imageUrl: string,
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID

  if (!token || !accountId) {
    return { success: false, error: 'INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID not set' }
  }

  try {
    const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

    const containerId = await createMediaContainer(accountId, token, imageUrl, fullCaption)

    // Instagram requires a short wait between container creation and publish
    await new Promise((r) => setTimeout(r, 3000))

    const postId = await publishContainer(accountId, token, containerId)
    const platformUrl = `https://www.instagram.com/p/${postId}/`

    return { success: true, platformId: postId, platformUrl }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Instagram error',
    }
  }
}
