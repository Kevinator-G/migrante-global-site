import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id requerido" }, { status: 400 });
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            autoCreated: true,
          },
        },
      },
    });

    if (!subscription) {
      // Webhook might not have fired yet — return 404 so client can retry
      return NextResponse.json(
        { error: "Pedido no encontrado. El webhook puede estar procesándose, intenta en unos segundos." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: subscription.user.email,
      name: subscription.user.name,
      autoCreated: subscription.user.autoCreated,
      items: subscription.items,
      total: subscription.total,
      currency: subscription.currency,
      status: subscription.status,
      createdAt: subscription.createdAt,
    });
  } catch (error) {
    console.error("Dashboard order fetch error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
