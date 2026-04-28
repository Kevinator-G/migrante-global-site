import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, pais, mensaje, consentimiento } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        nombre: String(nombre).trim().slice(0, 200),
        email: String(email).trim().slice(0, 200),
        telefono: telefono ? String(telefono).trim().slice(0, 50) : null,
        pais: pais ? String(pais).trim().slice(0, 100) : null,
        mensaje: String(mensaje).trim().slice(0, 2000),
        consentimiento: Boolean(consentimiento),
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar lead:", error);
    return NextResponse.json({ error: "No se pudo guardar el lead." }, { status: 500 });
  }
}
