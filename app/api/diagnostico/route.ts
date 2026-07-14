// Guarda el lead del quiz de viabilidad antes de enviarlo al pago del
// diagnóstico (47 €) — así el lead queda capturado aunque no complete el pago.

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, etapa, pasaporte, sector, presupuesto } = await req.json()

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Nombre y email son obligatorios' }, { status: 400 })
    }

    await prisma.lead.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        pais: null,
        mensaje: `[DIAGNÓSTICO 47 CHF] Etapa: ${etapa} · Pasaporte: ${pasaporte} · Sector: ${sector} · Presupuesto: ${presupuesto}`,
        consentimiento: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error guardando el lead' },
      { status: 500 },
    )
  }
}
