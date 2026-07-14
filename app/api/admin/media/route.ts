// Biblioteca de medios — API del panel admin
//
// POST   → genera el token para subir DIRECTO a Vercel Blob desde el navegador
//          (evita el límite de 4.5 MB de las funciones de Vercel; sirve para clips pesados)
// PUT    → registra el asset subido en la tabla MediaAsset (idempotente por url)
// GET    → lista la biblioteca
// DELETE → borra asset (Blob + fila)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { del } from '@vercel/blob'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const session = await getServerSession(authOptions)
        if (!session) throw new Error('No autorizado')
        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/avif',
            'video/mp4', 'video/quicktime', 'video/webm',
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB por archivo
        }
      },
      // El registro en DB lo hace el cliente vía PUT (funciona también en local);
      // este callback no corre en localhost.
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error de subida' },
      { status: 400 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url, filename, contentType, category } = await req.json()
  if (!url || !filename) {
    return NextResponse.json({ error: 'url y filename requeridos' }, { status: 400 })
  }

  const type = String(contentType ?? '').startsWith('video') ? 'video' : 'foto'

  const asset = await prisma.mediaAsset.upsert({
    where: { url },
    update: { category: category || null },
    create: { url, filename, type, category: category || null },
  })

  return NextResponse.json({ asset })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ assets })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const asset = await prisma.mediaAsset.findUnique({ where: { id } })
  if (!asset) return NextResponse.json({ error: 'No existe' }, { status: 404 })

  try {
    await del(asset.url)
  } catch {
    // si el blob ya no existe, igual borramos la fila
  }
  await prisma.mediaAsset.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
