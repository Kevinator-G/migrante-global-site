// Conexión OAuth de la cuenta de TikTok (una sola vez, o para reconectar)
//
// Uso:
//   1. En Vercel deben existir TIKTOK_CLIENT_KEY y TIKTOK_CLIENT_SECRET
//      (de la app creada en https://developers.tiktok.com)
//   2. La app de TikTok debe tener como Redirect URI:
//      https://migranteglobal.ch/api/social/tiktok
//   3. Visitar en el navegador:
//      https://migranteglobal.ch/api/social/tiktok?secret=<CRON_SECRET>
//   4. Autorizar con la cuenta @migranteglobal — los tokens quedan en la
//      tabla SocialCredential y se refrescan solos en cada publicación.

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/'
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'

function redirectUri(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://migranteglobal.ch'
  return `${base}/api/social/tiktok`
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET
  const cronSecret = process.env.CRON_SECRET

  if (!clientKey || !clientSecret) {
    return NextResponse.json(
      { error: 'TIKTOK_CLIENT_KEY o TIKTOK_CLIENT_SECRET no configurados en Vercel' },
      { status: 500 },
    )
  }
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 500 })
  }

  const code = params.get('code')

  // ── Paso 1: sin code → redirigir a TikTok para autorizar ────────────────
  if (!code) {
    if (params.get('secret') !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(AUTHORIZE_URL)
    url.searchParams.set('client_key', clientKey)
    url.searchParams.set('scope', 'user.info.basic,video.publish')
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('redirect_uri', redirectUri())
    url.searchParams.set('state', cronSecret)
    return NextResponse.redirect(url)
  }

  // ── Paso 2: callback de TikTok → canjear code por tokens ────────────────
  if (params.get('state') !== cronSecret) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 401 })
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri(),
      }),
    })
    const data = await res.json()

    if (!data.access_token) {
      return NextResponse.json(
        { error: 'TikTok no devolvió access_token', detail: data },
        { status: 502 },
      )
    }

    await prisma.socialCredential.upsert({
      where: { platform: 'tiktok' },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? null,
        openId: data.open_id ?? null,
        expiresAt: new Date(Date.now() + (data.expires_in ?? 86_400) * 1000),
      },
      create: {
        platform: 'tiktok',
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? null,
        openId: data.open_id ?? null,
        expiresAt: new Date(Date.now() + (data.expires_in ?? 86_400) * 1000),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cuenta de TikTok conectada — los posts automáticos ya pueden publicarse',
      openId: data.open_id,
      scope: data.scope,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
