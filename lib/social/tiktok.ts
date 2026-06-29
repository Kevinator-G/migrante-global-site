// TikTok Content Posting API
// Required env vars:
//   TIKTOK_ACCESS_TOKEN — OAuth2 user access token
//   TIKTOK_OPEN_ID      — user open_id from OAuth2 flow
//
// TikTok API reference:
//   https://developers.tiktok.com/doc/content-posting-api-get-started
//
// IMPORTANT: TikTok videos must be uploaded as a publicly accessible URL
// or via direct file upload (multipart). We use the URL approach.

const INIT_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/'
const STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/'

interface PublishResult {
  success: boolean
  platformId?: string
  platformUrl?: string
  error?: string
}

export async function publishToTikTok(
  videoUrl: string,
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN
  const openId = process.env.TIKTOK_OPEN_ID

  if (!accessToken || !openId) {
    return { success: false, error: 'TIKTOK_ACCESS_TOKEN or TIKTOK_OPEN_ID not set' }
  }

  const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`.slice(0, 2200)

  try {
    // Step 1: Initialize upload
    const initRes = await fetch(INIT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: {
          title: fullCaption,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: videoUrl,
        },
      }),
    })

    const initData = await initRes.json()
    if (!initRes.ok || initData.error?.code !== 'ok') {
      const errMsg = initData.error?.message ?? JSON.stringify(initData)
      return { success: false, error: `TikTok init failed: ${errMsg}` }
    }

    const publishId: string = initData.data?.publish_id
    if (!publishId) return { success: false, error: 'No publish_id returned' }

    // Step 2: Poll for completion (up to 60s)
    const deadline = Date.now() + 60_000
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 5000))

      const statusRes = await fetch(STATUS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ publish_id: publishId }),
      })

      const statusData = await statusRes.json()
      const status: string = statusData.data?.status ?? ''

      if (status === 'PUBLISH_COMPLETE') {
        return {
          success: true,
          platformId: publishId,
          platformUrl: `https://www.tiktok.com/@migranteglobal`,
        }
      }

      if (status === 'FAILED') {
        const failReason = statusData.data?.fail_reason ?? 'Unknown'
        return { success: false, error: `TikTok publish failed: ${failReason}` }
      }
      // statuses: PROCESSING_UPLOAD, PROCESSING_DOWNLOAD, PUBLISH_COMPLETE, FAILED
    }

    return { success: false, error: 'TikTok publish timed out' }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown TikTok error' }
  }
}
