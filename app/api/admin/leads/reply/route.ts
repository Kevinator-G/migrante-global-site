import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { sendLeadReply } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, respuesta } = (await req.json()) as { id?: string; respuesta?: string };
    if (!id || !respuesta?.trim()) {
      return NextResponse.json({ error: 'id y respuesta son requeridos' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    await sendLeadReply({ nombre: lead.nombre, email: lead.email }, respuesta.trim());

    const updated = await prisma.lead.update({
      where: { id },
      data: { respuesta: respuesta.trim(), respondidoAt: new Date() },
    });

    return NextResponse.json({ lead: updated }, { status: 200 });
  } catch (error) {
    console.error('Error al responder lead:', error);
    return NextResponse.json({ error: 'No se pudo enviar la respuesta' }, { status: 500 });
  }
}
