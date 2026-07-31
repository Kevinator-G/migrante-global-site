import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { error: 'Error al obtener leads' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, contactado } = (await req.json()) as { id?: string; contactado?: boolean };
    if (!id || typeof contactado !== 'boolean') {
      return NextResponse.json({ error: 'id y contactado son requeridos' }, { status: 400 });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { respondidoAt: contactado ? new Date() : null },
    });

    return NextResponse.json({ lead }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar lead:', error);
    return NextResponse.json({ error: 'Error al actualizar lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Lead eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar lead:', error);
    return NextResponse.json(
      { error: 'Error al eliminar lead' },
      { status: 500 }
    );
  }
}
