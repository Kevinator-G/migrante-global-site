// Renderiza una lámina del carrusel de Instagram como PNG 1080x1350.
// Estética elmodolobo: fondo negro, serif blanca grande, marca discreta.
// La consume distribute-content, que convierte a JPEG y aloja en Blob.

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// Edge runtime: evita el bug de @vercel/og en Node con rutas Windows con
// espacios, y en Vercel renderiza más rápido
export const runtime = 'edge'

// Google Fonts sirve TTF a user-agents desconocidos; satori necesita el binario
let fontCache: Promise<{ serif: ArrayBuffer; sans: ArrayBuffer }> | null = null

async function loadGoogleFont(css2Url: string): Promise<ArrayBuffer> {
  const css = await (await fetch(css2Url)).text()
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)
  if (!match) throw new Error('No se encontró la URL de la fuente en el CSS de Google Fonts')
  const res = await fetch(match[1])
  if (!res.ok) throw new Error(`Fuente no descargada: ${res.status}`)
  return res.arrayBuffer()
}

function getFonts() {
  fontCache ??= Promise.all([
    loadGoogleFont('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700'),
    loadGoogleFont('https://fonts.googleapis.com/css2?family=Inter:wght@500'),
  ]).then(([serif, sans]) => ({ serif, sans }))
  return fontCache
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const texto = (sp.get('texto') ?? '').slice(0, 400)
  const tipo = sp.get('tipo') ?? 'idea' // gancho | idea | cta
  const n = Math.max(1, Number(sp.get('n') ?? '1') || 1)
  const total = Math.max(n, Number(sp.get('total') ?? '1') || 1)

  if (!texto) {
    return new Response('texto requerido', { status: 400 })
  }

  const { serif, sans } = await getFonts()
  const esGancho = tipo === 'gancho'
  const esCta = tipo === 'cta'
  // Gancho más grande; textos largos bajan de cuerpo para no desbordar
  const fontSize = esGancho ? (texto.length > 80 ? 66 : 78) : texto.length > 140 ? 48 : 56

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0b',
          backgroundImage: 'radial-gradient(circle at 50% 38%, #1c1c1f 0%, #0a0a0b 68%)',
          padding: '90px 96px',
          color: '#f4efe6',
          fontFamily: 'Playfair',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 26,
              letterSpacing: 10,
              color: '#8a857a',
            }}
          >
            MIGRANTE GLOBAL
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                fontSize,
                textAlign: 'center',
                lineHeight: 1.3,
                margin: 0,
                maxWidth: 880,
              }}
            >
              {texto}
            </p>
            {esCta && (
              <span
                style={{
                  fontFamily: 'Inter',
                  fontSize: 34,
                  color: '#c9a96a',
                  marginTop: 56,
                  letterSpacing: 2,
                }}
              >
                migranteglobal.ch
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 26, color: '#8a857a' }}>
            migranteglobal.ch
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: 26, color: '#8a857a' }}>
            {esGancho ? 'Desliza →' : `${n}/${total}`}
          </span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: 'Playfair', data: serif, weight: 700, style: 'normal' },
        { name: 'Inter', data: sans, weight: 500, style: 'normal' },
      ],
    },
  )
}
