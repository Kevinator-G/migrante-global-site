import { NextResponse } from 'next/server';

type Lead = {
  id: string | number;
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  mensaje: string;
  fecha?: string;       // si ya la guardas como texto
  createdAt?: string;   // o si viene como ISO string
};

function toCsvCell(v: unknown) {
  const s = String(v ?? '');
  // Escapar comillas dobles para CSV y envolver en comillas
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  // ⚠️ Ajusta esto según cómo estés obteniendo "leads" hoy.
  // Si ya tienes tu lógica arriba en el archivo, deja tu fetch tal cual
  // y SOLO usa el tipado y la parte del CSV de abajo.

  const leads: Lead[] = []; // <-- aquí normalmente tú ya cargas los leads

  const headers: string[] = ['ID', 'Nombre', 'Email', 'Teléfono', 'País', 'Mensaje', 'Fecha'];

  const rows: (string | number)[][] = leads.map((lead: Lead) => [
    lead.id,
    lead.nombre,
    lead.email,
    lead.telefono,
    lead.pais,
    lead.mensaje,
    lead.fecha ?? lead.createdAt ?? '',
  ]);

  const csvLines: string[] = [
    headers.map(toCsvCell).join(','),
    ...rows.map((row: (string | number)[]) => row.map(toCsvCell).join(',')),
  ];

  const csv = csvLines.join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads.csv"',
    },
  });
}