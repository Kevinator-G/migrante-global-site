import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCatalogItem } from "@/lib/service-catalog";

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

    // El precio SIEMPRE sale del catálogo del servidor, nunca de lo que
    // manda el cliente — si no, cualquiera podría pagar lo que quisiera.
    const unknownId = (items as CartItem[]).find((item) => !getCatalogItem(item.id));
    if (unknownId) {
      return NextResponse.json(
        { error: `Servicio desconocido: ${unknownId.id}` },
        { status: 400 }
      );
    }

    const catalogItems = (items as CartItem[]).map((item) => ({
      ...item,
      ...getCatalogItem(item.id)!,
    }));

    if (catalogItems.some((item) => item.precio <= 0)) {
      return NextResponse.json(
        { error: "Uno de los servicios en el carrito es gratuito y no requiere pago." },
        { status: 400 }
      );
    }

    const lineItems = catalogItems.map(
      (item) => ({
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
      // Sin payment_method_types: Stripe muestra lo activado en el dashboard
      // (tarjeta, Klarna a plazos, TWINT...) — activa Klarna en Settings → Payment methods
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${appUrl}/dashboard?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?cart=1`,
      locale: "es",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: {
        items: JSON.stringify(
          catalogItems.map((i) => ({
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
