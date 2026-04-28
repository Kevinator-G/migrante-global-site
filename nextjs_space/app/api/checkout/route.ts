import { NextResponse } from "next/server";
import Stripe from "stripe";

type CartItem = {
  id: string;
  nombre: string;
  precio: number;
  moneda: string;
  tipo: string;
  emoji: string;
};

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
  try {
    const { items, customerEmail } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const lineItems = items.map(
      (item: CartItem) => ({
        price_data: {
          currency: "chf",
          product_data: {
            name: `${item.emoji} ${item.nombre}`,
            description: item.tipo,
          },
          unit_amount: Math.round(item.precio * 100), // CHF in centimes
        },
        quantity: 1,
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${appUrl}/dashboard?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?cart=1`,
      locale: "es",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      metadata: {
        items: JSON.stringify(
          items.map((i: CartItem) => ({
            id: i.id,
            nombre: i.nombre,
            tipo: i.tipo,
            precio: i.precio,
            emoji: i.emoji,
          }))
        ),
      },
      custom_text: {
        submit: {
          message:
            "Al pagar, un asesor de Migrante Global se pondrá en contacto contigo para activar tu servicio.",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Error al iniciar el pago" },
      { status: 500 }
    );
  }
}
