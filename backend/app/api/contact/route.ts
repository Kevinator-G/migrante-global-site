import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, pais, mensaje, consentimiento } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: 'El email no es válido' }, { status: 400 });
    }

    if (!consentimiento) {
      return NextResponse.json(
        { error: 'Debe aceptar la política de privacidad' },
        { status: 400 }
      );
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

    return NextResponse.json(
      { message: 'Mensaje enviado exitosamente', leadId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al guardar lead:', error);
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}
