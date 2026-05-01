import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendWelcomeMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // ── Handle events ────────────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutComplete(session);
    } catch (err) {
      console.error("Error processing checkout.session.completed:", err);
      return new Response("Internal error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email =
    session.customer_details?.email || session.customer_email || null;
  const name = session.customer_details?.name || null;
  const phone = session.customer_details?.phone || null;
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : null;
  const stripePaymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : null;

  const items = (() => {
    try {
      return JSON.parse(session.metadata?.items || "[]");
    } catch {
      return [];
    }
  })();

  const total = (session.amount_total || 0) / 100;

  if (!email) {
    console.warn("Webhook: no email found on session", session.id);
    return;
  }

  // ── Find or create user ──────────────────────────────────────────────
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Auto-create account with random password — user can reset via "forgot password"
    const tempPassword = crypto.randomBytes(24).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        phone: phone ?? undefined,
        password: hashedPassword,
        autoCreated: true,
        stripeCustomerId,
      },
    });

    console.log(`Auto-created user for ${email} (id: ${user.id})`);
  } else if (stripeCustomerId && !user.stripeCustomerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId, ...(phone && !user.phone ? { phone } : {}) },
    });
  } else if (phone && !user.phone) {
    await prisma.user.update({ where: { id: user.id }, data: { phone } });
  }

  // ── Create subscription record ───────────────────────────────────────
  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSessionId: session.id,
        stripeCustomerId,
        stripePaymentIntentId,
        status: "active",
        items,
        total,
        currency: "CHF",
      },
    });

    console.log(`Subscription created for ${email} — total: ${total} CHF`);

    // Send WhatsApp welcome message (fire-and-forget)
    const userPhone = phone || user.phone;
    if (userPhone && items.length > 0) {
      const serviceName = items.map((i: { nombre: string }) => i.nombre).join(' + ');
      sendWelcomeMessage(userPhone, user.name ?? 'cliente', serviceName, user.id)
        .then((r) => { if (!r.success) console.warn('WhatsApp send failed:', r.error); })
        .catch(() => {});
    }
  }
}
