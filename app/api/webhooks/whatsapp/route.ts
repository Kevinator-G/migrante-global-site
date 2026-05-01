import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
  try {
    const body = await req.json()

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
