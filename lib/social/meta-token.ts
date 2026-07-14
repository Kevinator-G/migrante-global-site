// Token de Meta (Facebook + Instagram) — lee primero el token de página
// permanente guardado en SocialCredential (platform 'meta_page') y cae a las
// env vars antiguas si aún no se ha generado.
//
// El token permanente se genera una sola vez en /api/social/meta?secret=<CRON_SECRET>
// y no caduca — se acabó renovar tokens cada 60 días.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMetaPageToken(): Promise<string | undefined> {
  try {
    const cred = await prisma.socialCredential.findUnique({ where: { platform: 'meta_page' } })
    if (cred?.accessToken) return cred.accessToken
  } catch {
    // tabla no disponible — usar env
  }
  return undefined
}

export async function getInstagramToken(): Promise<string | undefined> {
  return (await getMetaPageToken()) ?? process.env.INSTAGRAM_ACCESS_TOKEN
}

export async function getFacebookToken(): Promise<string | undefined> {
  return (await getMetaPageToken()) ?? process.env.FACEBOOK_PAGE_ACCESS_TOKEN
}
