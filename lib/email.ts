import { Resend } from "resend";

// Lazy init — instanciar en import rompe el build cuando RESEND_API_KEY no existe en el entorno
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kagm94@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Migrante Global <noreply@migranteglobal.ch>";

// Los datos de leads/compras vienen de formularios públicos y se interpolan
// directo en HTML de email — sin escapar, alguien podría meter un <a> o
// <script> en el campo "mensaje" y que se renderice como HTML real en la
// bandeja de entrada de Kevin.
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Publish failure alert (Instagram/Facebook) ──────────────────────────────
// El token de Meta es permanente (no tiene fecha de vencimiento), pero puede
// invalidarse por otras razones (revisión de permisos, revocación manual).
// Este alert avisa por email en vez de que el fallo pase en silencio.
export async function sendPublishFailureAlert(platform: string, context: string, error: string) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ Falló publicación en ${platform}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#dc2626;border-bottom:2px solid #dc2626;padding-bottom:8px">
            Publicación fallida — ${platform}
          </h2>
          <p style="color:#666">${esc(context)}</p>
          <pre style="background:#f9f9f9;padding:12px;border-radius:6px;white-space:pre-wrap;color:#991b1b">${esc(error)}</pre>
          <p style="color:#666;margin-top:16px">
            Si esto se repite, revisa el token de Meta en SocialCredential (tabla 'meta_page') —
            puede que haya que regenerarlo en /api/social/meta.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendPublishFailureAlert error:", err);
  }
}

// ── Reply to a lead, sent from the admin panel ──────────────────────────────
export async function sendLeadReply(lead: { nombre: string; email: string }, respuesta: string) {
  await getResend().emails.send({
    // Se manda desde hola@ (no noreply@) a propósito: Kevin quiere que la gente
    // pueda responder directo a ese correo y seguir la conversación con él.
    from: 'Migrante Global <hola@migranteglobal.ch>',
    to: lead.email,
    subject: `Respuesta de Migrante Global`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a;border-bottom:2px solid #f59e0b;padding-bottom:8px">
          Migrante Global
        </h2>
        <p style="color:#444">Hola ${esc(lead.nombre)},</p>
        <p style="color:#444;line-height:1.6;white-space:pre-wrap">${esc(respuesta)}</p>
        <p style="color:#888;font-size:13px;margin-top:24px">
          Si tienes más preguntas, responde directamente a este correo o escríbenos a WhatsApp
          al <strong>+41 77 233 73 53</strong>.
        </p>
        <p style="color:#bbb;font-size:12px;margin-top:24px">
          Migrante Global — Acompañándote en tu proceso de migración
        </p>
      </div>
    `,
  });
}

// ── Lead notification ────────────────────────────────────────────────────────

interface LeadData {
  nombre: string;
  email: string;
  telefono?: string | null;
  pais?: string | null;
  mensaje: string;
}

export async function sendLeadNotification(lead: LeadData) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🔔 Nuevo contacto: ${esc(lead.nombre)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;border-bottom:2px solid #f59e0b;padding-bottom:8px">
            Nuevo contacto — Migrante Global
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr>
              <td style="padding:8px 0;color:#666;width:120px">Nombre</td>
              <td style="padding:8px 0;font-weight:600">${esc(lead.nombre)}</td>
            </tr>
            <tr style="background:#f9f9f9">
              <td style="padding:8px 0;color:#666">Email</td>
              <td style="padding:8px 0">
                <a href="mailto:${esc(lead.email)}" style="color:#f59e0b">${esc(lead.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666">Teléfono</td>
              <td style="padding:8px 0">${lead.telefono ? esc(lead.telefono) : "—"}</td>
            </tr>
            <tr style="background:#f9f9f9">
              <td style="padding:8px 0;color:#666">País</td>
              <td style="padding:8px 0">${lead.pais ? esc(lead.pais) : "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;vertical-align:top">Mensaje</td>
              <td style="padding:8px 0">${esc(lead.mensaje)}</td>
            </tr>
          </table>
          <div style="margin-top:24px">
            <a href="https://wa.me/41772337553?text=Hola%20${encodeURIComponent(lead.nombre)},%20te%20contacto%20desde%20Migrante%20Global"
               style="background:#25d366;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block">
              Responder por WhatsApp
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendLeadNotification error:", err);
  }
}

// ── Purchase notification (to admin) ────────────────────────────────────────

interface PurchaseData {
  clientEmail: string;
  clientName: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  stripeSessionId: string;
}

export async function sendPurchaseNotification(order: PurchaseData) {
  try {
    const itemRows = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee">${esc(item.name)}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${item.price} CHF</td>
          </tr>`
      )
      .join("");

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `💳 Nueva compra: ${esc(order.clientName)} — ${order.total} CHF`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;border-bottom:2px solid #10b981;padding-bottom:8px">
            ¡Nueva compra! — Migrante Global
          </h2>
          <p style="color:#666">
            <strong>${esc(order.clientName)}</strong> (${esc(order.clientEmail)}) acaba de completar un pago.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            ${itemRows}
            <tr>
              <td style="padding:12px 0;font-weight:700;font-size:16px">Total</td>
              <td style="padding:12px 0;font-weight:700;font-size:16px;text-align:right;color:#10b981">
                ${order.total} CHF
              </td>
            </tr>
          </table>
          <div style="margin-top:24px;display:flex;gap:12px">
            <a href="mailto:${esc(order.clientEmail)}"
               style="background:#f59e0b;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;margin-right:12px">
              Contactar al cliente
            </a>
            <a href="https://wa.me/41772337553"
               style="background:#25d366;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block">
              Abrir WhatsApp
            </a>
          </div>
          <p style="color:#aaa;font-size:12px;margin-top:24px">
            Stripe session: ${order.stripeSessionId}
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendPurchaseNotification error:", err);
  }
}

// ── Purchase confirmation (to client) ───────────────────────────────────────

export async function sendPurchaseConfirmation(order: PurchaseData) {
  try {
    const itemRows = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee">${esc(item.name)}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${item.price} CHF</td>
          </tr>`
      )
      .join("");

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.clientEmail,
      subject: `✅ Confirmación de compra — Migrante Global`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;border-bottom:2px solid #f59e0b;padding-bottom:8px">
            ¡Gracias por tu compra, ${esc(order.clientName)}!
          </h2>
          <p style="color:#444;line-height:1.6">
            Hemos recibido tu pago correctamente. Aquí tienes el resumen de lo que adquiriste:
          </p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            ${itemRows}
            <tr>
              <td style="padding:12px 0;font-weight:700;font-size:16px">Total pagado</td>
              <td style="padding:12px 0;font-weight:700;font-size:16px;text-align:right;color:#f59e0b">
                ${order.total} CHF
              </td>
            </tr>
          </table>

          <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px;margin:24px 0;border-radius:4px">
            <strong style="color:#065f46">¿Qué pasa ahora?</strong>
            <p style="color:#065f46;margin:8px 0 0">
              Nos pondremos en contacto contigo por WhatsApp en las próximas <strong>24 horas</strong>
              para coordinar el inicio de tu servicio.
            </p>
          </div>

          <a href="https://wa.me/41772337553?text=Hola,%20acabo%20de%20comprar%20en%20Migrante%20Global"
             style="background:#25d366;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;margin-bottom:24px">
            Escríbenos por WhatsApp
          </a>

          <p style="color:#888;font-size:13px">
            Si tienes alguna pregunta, responde directamente a este email o escríbenos a WhatsApp
            al <strong>+41 77 233 73 53</strong>.
          </p>
          <p style="color:#bbb;font-size:12px;margin-top:24px">
            Migrante Global — Acompañándote en tu proceso de migración
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendPurchaseConfirmation error:", err);
  }
}
