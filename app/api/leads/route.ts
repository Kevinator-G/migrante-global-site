import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY LEAD RECIBIDO:", body);

    const { nombre, email, telefono, pais, mensaje, consentimiento } = body;

    if (!nombre || !email || !mensaje) {
      console.log("FALTAN CAMPOS OBLIGATORIOS");
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        nombre: String(nombre).trim(),
        email: String(email).trim(),
        telefono: telefono ? String(telefono).trim() : null,
        pais: pais ? String(pais).trim() : null,
        mensaje: String(mensaje).trim(),
        consentimiento: Boolean(consentimiento),
      },
    });

    console.log("LEAD GUARDADO:", lead);

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("LEAD ERROR:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el lead." },
      { status: 500 }
    );
  }
}