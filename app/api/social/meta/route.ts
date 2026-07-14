// Genera el token de página PERMANENTE de Meta (Facebook + Instagram) y lo
// guarda en SocialCredential — se acabó el token que caduca cada 60 días.
//
// Cómo funciona: con un token de usuario de larga duración válido (el
// INSTAGRAM_ACCESS_TOKEN actual), GET /me/accounts devuelve el token de cada
// página administrada. Ese token de página NO caduca.
//
// Uso: GET /api/social/meta?secret=<CRON_SECRET>
//   — opcionalmente ?token=<user_token> para usar un token recién generado
//     en Graph API Explorer en vez del de las env vars.

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE = 'https://graph.facebook.com/v19.0'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || params.get('secret') !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userToken = params.get('token') ?? process.env.INSTAGRAM_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID
  if (!userToken) {
    return NextResponse.json({ error: 'No hay token de usuario (INSTAGRAM_ACCESS_TOKEN o ?token=)' }, { status: 400 })
  }

  try {
    // ¿Qué es este token? (diagnóstico útil si algo falla)
    const meRes = await fetch(`${BASE}/me?fields=id,name&access_token=${userToken}`)
    const me = await meRes.json()
    if (me.error) {
      return NextResponse.json({ error: 'Token inválido', detail: me.error.message }, { status: 400 })
    }

    // Páginas administradas — el access_token de cada una es permanente
    const accRes = await fetch(`${BASE}/me/accounts?fields=id,name,access_token&access_token=${userToken}`)
    const acc = await accRes.json()
    if (acc.error) {
      return NextResponse.json(
        {
          error: 'No se pudieron listar las páginas',
          detail: acc.error.message,
          hint: 'El token debe ser de USUARIO con permisos pages_show_list y pages_manage_posts. Genera uno en Graph API Explorer y pásalo como ?token=',
          tokenInfo: me,
        },
        { status: 400 },
      )
    }

    const paginas: Array<{ id: string; name: string; access_token: string }> = acc.data ?? []
    const pagina = pageId ? paginas.find((p) => p.id === pageId) : paginas[0]
    if (!pagina) {
      return NextResponse.json(
        { error: 'La página no aparece entre las administradas', paginas: paginas.map((p) => ({ id: p.id, name: p.name })) },
        { status: 404 },
      )
    }

    // Verificar que la página tiene la cuenta de Instagram vinculada
    const igRes = await fetch(
      `${BASE}/${pagina.id}?fields=instagram_business_account&access_token=${pagina.access_token}`,
    )
    const ig = await igRes.json()

    await prisma.socialCredential.upsert({
      where: { platform: 'meta_page' },
      update: { accessToken: pagina.access_token, openId: pagina.id, expiresAt: null },
      create: { platform: 'meta_page', accessToken: pagina.access_token, openId: pagina.id, expiresAt: null },
    })

    return NextResponse.json({
      success: true,
      message: 'Token de página permanente guardado — Facebook e Instagram publican con él desde ahora',
      pagina: { id: pagina.id, name: pagina.name },
      instagramVinculado: ig.instagram_business_account?.id ?? null,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
