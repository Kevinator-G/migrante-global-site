// YouTube Data API v3 — uploads a Short (vertical video ≤ 60s)
// Required env vars:
//   YOUTUBE_API_KEY          — for public API calls (not sufficient for upload)
//   YOUTUBE_ACCESS_TOKEN     — OAuth2 access token with youtube.upload scope
//   YOUTUBE_REFRESH_TOKEN    — for refreshing expired access tokens
//   YOUTUBE_CLIENT_ID        — Google OAuth2 client ID
//   YOUTUBE_CLIENT_SECRET    — Google OAuth2 client secret
//   YOUTUBE_CHANNEL_ID       — target channel ID (optional, defaults to "mine")
//
// Upload flow: we download the rendered MP4 from Shotstack's CDN into memory,
// then stream it to YouTube using the resumable upload API.

const YT_UPLOAD = 'https://www.googleapis.com/upload/youtube/v3/videos'
const YT_TOKEN = 'https://oauth2.googleapis.com/token'

interface PublishResult {
  success: boolean
  platformId?: string
  platformUrl?: string
  error?: string
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN
  const clientId = process.env.YOUTUBE_CLIENT_ID
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET
  if (!refreshToken || !clientId || !clientSecret) return null

  try {
    const res = await fetch(YT_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    const data = await res.json()
    return (data.access_token as string) ?? null
  } catch {
    return null
  }
}

export async function publishToYouTube(
  videoUrl: string,
  title: string,
  description: string,
  tags: string[],
): Promise<PublishResult> {
  let accessToken = process.env.YOUTUBE_ACCESS_TOKEN
  if (!accessToken) {
    // Try to get a fresh token via refresh
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      return { success: false, error: 'YOUTUBE_ACCESS_TOKEN not set and refresh failed' }
    }
    accessToken = refreshed
  }

  try {
    // Download the video buffer from Shotstack CDN
    const videoRes = await fetch(videoUrl)
    if (!videoRes.ok) {
      return { success: false, error: `Could not download video: ${videoRes.status}` }
    }
    const videoBuffer = Buffer.from(await videoRes.arrayBuffer())
    const videoSize = videoBuffer.byteLength

    // Append #shorts to title so YouTube classifies it as a Short
    const shortTitle = title.endsWith('#Shorts') ? title : `${title.slice(0, 90)} #Shorts`

    // Step 1 — initiate resumable upload session
    const metadataRes = await fetch(
      `${YT_UPLOAD}?uploadType=resumable&part=snippet,status`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': 'video/mp4',
          'X-Upload-Content-Length': String(videoSize),
        },
        body: JSON.stringify({
          snippet: {
            title: shortTitle,
            description: `${description}\n\n${tags.map((t) => `#${t}`).join(' ')}\n\n#Shorts`,
            tags: [...tags, 'Shorts', 'MigranteGlobal', 'Suiza', 'Inmigración'],
            categoryId: '22', // People & Blogs
            defaultLanguage: 'es',
          },
          status: {
            privacyStatus: 'public',
            selfDeclaredMadeForKids: false,
          },
        }),
      },
    )

    if (!metadataRes.ok) {
      const err = await metadataRes.text()
      return { success: false, error: `YouTube init failed: ${err}` }
    }

    const uploadUrl = metadataRes.headers.get('Location')
    if (!uploadUrl) {
      return { success: false, error: 'YouTube did not return upload URL' }
    }

    // Step 2 — upload video bytes
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(videoSize),
      },
      body: videoBuffer,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      return { success: false, error: `YouTube upload failed: ${err}` }
    }

    const data = await uploadRes.json()
    const videoId: string = data.id
    if (!videoId) return { success: false, error: 'YouTube did not return video ID' }

    return {
      success: true,
      platformId: videoId,
      platformUrl: `https://www.youtube.com/shorts/${videoId}`,
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown YouTube error' }
  }
}
