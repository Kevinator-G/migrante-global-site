import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function toCsvCell(v: unknown) {
  const s = String(v ?? '');
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'País', 'Mensaje', 'Consentimiento', 'Fecha'];

    const rows = leads.map((lead) => [
      lead.id,
      lead.nombre,
      lead.email,
      lead.telefono ?? '',
      lead.pais ?? '',
      lead.mensaje,
      lead.consentimiento ? 'Sí' : 'No',
      lead.createdAt.toISOString(),
    ]);

    const csvLines = [
      headers.map(toCsvCell).join(','),
      ...rows.map((row) => row.map(toCsvCell).join(',')),
    ];

    const csv = csvLines.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  } catch (error) {
    console.error('Error al exportar leads:', error);
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 });
  }
}
