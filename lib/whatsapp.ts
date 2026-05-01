// Meta WhatsApp Cloud API
// Env vars required:
//   WHATSAPP_TOKEN    — permanent system user token from Meta Business Manager
//   WHATSAPP_PHONE_ID — phone number ID (not the phone number itself)
//   WHATSAPP_VERIFY_TOKEN — any string you choose, used to verify the webhook

import { prisma } from '@/lib/db'

const BASE = 'https://graph.facebook.com/v19.0'

// Normalize phone: strips spaces, dashes, parentheses; removes leading +
function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, '').replace(/^\+/, '')
}

// ── Template messages (business-initiated, require Meta approval) ──────────
export interface TemplateComponent {
  type: 'body'
  parameters: Array<{ type: 'text'; text: string }>
}

export async function sendTemplate(
  phone: string,
  templateName: string,
  languageCode: string,
  bodyParams: string[],
  userId?: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) {
    return { success: false, error: 'WHATSAPP_TOKEN or WHATSAPP_PHONE_ID not set' }
  }

  const to = normalizePhone(phone)
  const components: TemplateComponent[] = bodyParams.length
    ? [{
        type: 'body',
        parameters: bodyParams.map((text) => ({ type: 'text' as const, text })),
      }]
    : []

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  }

  try {
    const res = await fetch(`${BASE}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMsg = data.error?.message ?? 'WhatsApp API error'
      await prisma.whatsappLog.create({
        data: { phone: to, direction: 'outbound', type: 'template', templateName, body: JSON.stringify(bodyParams), status: 'failed', error: errorMsg, userId },
      })
      return { success: false, error: errorMsg }
    }

    const messageId = data.messages?.[0]?.id as string | undefined
    await prisma.whatsappLog.create({
      data: { phone: to, direction: 'outbound', type: 'template', templateName, body: JSON.stringify(bodyParams), status: 'sent', waMessageId: messageId, userId },
    })
    return { success: true, messageId }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    await prisma.whatsappLog.create({
      data: { phone: to, direction: 'outbound', type: 'template', templateName, body: JSON.stringify(bodyParams), status: 'failed', error: errorMsg, userId },
    })
    return { success: false, error: errorMsg }
  }
}

// ── Free-form text (only within 24h of customer message) ──────────────────
export async function sendText(
  phone: string,
  text: string,
  userId?: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) {
    return { success: false, error: 'WHATSAPP_TOKEN or WHATSAPP_PHONE_ID not set' }
  }

  const to = normalizePhone(phone)

  try {
    const res = await fetch(`${BASE}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMsg = data.error?.message ?? 'WhatsApp API error'
      await prisma.whatsappLog.create({
        data: { phone: to, direction: 'outbound', type: 'text', body: text, status: 'failed', error: errorMsg, userId },
      })
      return { success: false, error: errorMsg }
    }

    const messageId = data.messages?.[0]?.id as string | undefined
    await prisma.whatsappLog.create({
      data: { phone: to, direction: 'outbound', type: 'text', body: text, status: 'sent', waMessageId: messageId, userId },
    })
    return { success: true, messageId }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: errorMsg }
  }
}

// ── Convenience: post-purchase welcome message ─────────────────────────────
// Template name: bienvenida_migrante (submit to Meta for approval)
// Body: "¡Hola {{1}}! Soy Kevin de Migrante Global. Tu *{{2}}* está confirmado..."
export async function sendWelcomeMessage(
  phone: string,
  nombre: string,
  servicio: string,
  userId?: string,
) {
  return sendTemplate(phone, 'bienvenida_migrante', 'es', [nombre, servicio], userId)
}

// Template name: seguimiento_migrante (submit to Meta for approval)
// Body: "Hola {{1}}, ¿cómo vas con {{2}}? ¿Tienes alguna duda? Aquí estoy. — Kevin"
export async function sendFollowUp(
  phone: string,
  nombre: string,
  servicio: string,
  userId?: string,
) {
  return sendTemplate(phone, 'seguimiento_migrante', 'es', [nombre, servicio], userId)
}
