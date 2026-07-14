// TikTok Content Posting API
//
// Conexión de cuenta (una sola vez):
//   1. Crear app en https://developers.tiktok.com con Login Kit + Content Posting API
//   2. Configurar en Vercel: TIKTOK_CLIENT_KEY y TIKTOK_CLIENT_SECRET
//   3. Visitar https://migranteglobal.ch/api/social/tiktok?secret=<CRON_SECRET>
//      y autorizar la cuenta — los tokens quedan guardados en la tabla SocialCredential
//
// El access token de TikTok caduca cada 24h; aquí se refresca automáticamente
// con el refresh token (válido 365 días).
//
// IMPORTANTE: mientras la app no pase la auditoría de TikTok, solo se permite
// publicar en privado (SELF_ONLY). Cuando TikTok apruebe la app, configura
// TIKTOK_PRIVACY_LEVEL=PUBLIC_TO_EVERYONE en Vercel.
//
// API reference: https://developers.tiktok.com/doc/content-posting-api-get-started

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const INIT_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/'
const STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/'

interface PublishResult {
  success: boolean
  platformId?: string
  platformUrl?: string
  error?: string
}

type TikTokAuth = { accessToken: string } | { error: string }

// Devuelve un access token vigente: lee la credencial guardada y la refresca
// si está por caducar. Mantiene el fallback a las env vars antiguas.
async function getTikTokAuth(): Promise<TikTokAuth> {
  const cred = await prisma.socialCredential
    .findUnique({ where: { platform: 'tiktok' } })
    .catch(() => null)

  if (cred) {
    const expiresSoon =
      !cred.expiresAt || cred.expiresAt.getTime() < Date.now() + 10 * 60_000

    if (!expiresSoon) return { accessToken: cred.accessToken }

    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET

    if (clientKey && clientSecret && cred.refreshToken) {
      try {
        const res = await fetch(TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: cred.refreshToken,
          }),
        })
        const data = await res.json()

        if (data.access_token) {
          await prisma.socialCredential.update({
            where: { platform: 'tiktok' },
            data: {
              accessToken: data.access_token,
              refreshToken: data.refresh_token ?? cred.refreshToken,
              openId: data.open_id ?? cred.openId,
              expiresAt: new Date(Date.now() + (data.expires_in ?? 86_400) * 1000),
            },
          })
          return { accessToken: data.access_token }
        }

        return {
          error: `TikTok token refresh failed: ${data.error_description ?? JSON.stringify(data)}`,
        }
      } catch (err) {
        return {
          error: `TikTok token refresh error: ${err instanceof Error ? err.message : String(err)}`,
        }
      }
    }

    return {
      error:
        'TikTok token caducado y sin TIKTOK_CLIENT_KEY/TIKTOK_CLIENT_SECRET para refrescarlo — reconecta en /api/social/tiktok',
    }
  }

  // Fallback legado: token estático por env var (caduca a las 24h)
  const envToken = process.env.TIKTOK_ACCESS_TOKEN
  if (envToken) return { accessToken: envToken }

  return {
    error:
      'TikTok no conectado — configura TIKTOK_CLIENT_KEY/SECRET y autoriza en /api/social/tiktok?secret=<CRON_SECRET>',
  }
}

export async function publishToTikTok(
  videoUrl: string,
  caption: string,
  hashtags: string[],
): Promise<PublishResult> {
  const auth = await getTikTokAuth()
  if ('error' in auth) return { success: false, error: auth.error }

  const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`.slice(0, 2200)

  // Apps sin auditar solo pueden publicar en privado — TikTok rechaza el resto
  const privacyLevel = process.env.TIKTOK_PRIVACY_LEVEL ?? 'SELF_ONLY'

  try {
    // Step 1: Initialize upload
    const initRes = await fetch(INIT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: {
          title: fullCaption,
          privacy_level: privacyLevel,
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
          Authorization: `Bearer ${auth.accessToken}`,
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
