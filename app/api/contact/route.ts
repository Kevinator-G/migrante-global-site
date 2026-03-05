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

    if (!consentimiento) {
      return NextResponse.json(
        { error: 'Debe aceptar la política de privacidad' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        pais: pais || null,
        mensaje,
        consentimiento,
      },
    });

    return NextResponse.json(
      { message: 'Mensaje enviado exitosamente', leadId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al guardar lead:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}
