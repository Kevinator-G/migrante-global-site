import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

// Verifica que la petición venga realmente de Meta, comparando la firma
// HMAC-SHA256 del cuerpo crudo contra el header X-Hub-Signature-256.
// Sin esto cualquiera que adivine la URL puede falsificar mensajes entrantes.
// App Secret: developers.facebook.com → tu app → Configuración básica.
function verifyMetaSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) {
    console.error('WHATSAPP_APP_SECRET no configurado — rechazando webhook de WhatsApp por seguridad.')
    return false
  }
  if (!signatureHeader?.startsWith('sha256=')) return false

  const expected = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')
  const received = signatureHeader.slice('sha256='.length)

  const expectedBuf = Buffer.from(expected, 'hex')
  const receivedBuf = Buffer.from(received, 'hex')
  if (expectedBuf.length !== receivedBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}

// ── GET — Meta webhook verification ───────────────────────────────────────
// Meta sends a GET with hub.challenge when you set up the webhook in the dashboard
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? '', { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

// ── POST — incoming messages from clients ──────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifyMetaSignature(rawBody, req.headers.get('x-hub-signature-256'))) {
    console.error('WhatsApp webhook: firma inválida o ausente — petición rechazada.')
    return NextResponse.json({ status: 'invalid_signature' }, { status: 401 })
  }

  try {
    const body = JSON.parse(rawBody)

    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value?.messages?.length) {
      return NextResponse.json({ status: 'no_message' })
    }

    for (const msg of value.messages) {
      const phone = msg.from as string
      const text = msg.type === 'text' ? (msg.text?.body as string) : `[${msg.type}]`
      const waMessageId = msg.id as string

      // Find user by phone
      const user = await prisma.user.findFirst({
        where: { phone: { endsWith: phone.slice(-9) } },
        select: { id: true, name: true, email: true },
      })

      await prisma.whatsappLog.create({
        data: {
          phone,
          direction: 'inbound',
          type: 'text',
          body: text,
          status: 'delivered',
          waMessageId,
          userId: user?.id,
        },
      })

      console.log(`WhatsApp inbound from ${phone}: "${text}" (user: ${user?.email ?? 'unknown'})`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    return NextResponse.json({ status: 'error' }, { status: 200 }) // always 200 to Meta
  }
}
