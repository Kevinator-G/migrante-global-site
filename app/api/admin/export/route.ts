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

    // Crear CSV
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'País', 'Mensaje', 'Fecha'];
    const rows = leads.map((lead) => [
      lead.id,
      lead.nombre,
      lead.email,
      lead.telefono || '',
      lead.pais || '',
      lead.mensaje.replace(/\n/g, ' ').replace(/,/g, ';'),
      new Date(lead.createdAt).toLocaleString('es-ES'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error al exportar leads:', error);
    return NextResponse.json(
      { error: 'Error al exportar leads' },
      { status: 500 }
    );
  }
}
