// Ciclo de 8 formatos + banco de 10 ganchos para el post diario de IG/FB.
// El trending (lib/social/trending/) puede sugerir tema y ángulo, pero NUNCA
// el formato: eso lo manda siempre este ciclo.
//
// La posición en el ciclo se deriva de un contador acumulado (posts con formato
// ya asignado), no del día del año — así un cron que falla un día no desalinea
// la secuencia.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type Formato = 'carrusel' | 'foto' | 'dato'

// Posición original de "reel" (índice 4) sustituida por "dato" — el pipeline de
// video fue eliminado a propósito el 24 jul 2026 y no se reactiva sin pedirlo.
export const CICLO_FORMATOS: Formato[] = [
  'carrusel',
  'foto',
  'dato',
  'carrusel',
  'dato',
  'foto',
  'carrusel',
  'foto',
]

// Fórmulas narrativas de apertura — variaciones sobre el estilo elmodolobo ya
// usado en content-adapter.ts. Son instrucciones de estructura para la IA, no copy.
export const BANCO_GANCHOS: string[] = [
  'Negación: "No es que X. Es que Y." — le quitas la excusa al lector y le devuelves la responsabilidad.',
  'Pregunta directa que incomoda: obliga al lector a responderse en silencio antes de seguir leyendo.',
  'Cifra o dato shock: un número concreto que contradice lo que la mayoría cree.',
  'Error común: "El error no es X, es Y" — señala algo que el lector probablemente está haciendo mal ahora mismo.',
  'Confesión personal de Kevin: un momento propio de duda o fracaso que humaniza antes de enseñar.',
  'Antes / después: dos frases que contrastan cómo era vs cómo es, sin explicar el proceso todavía.',
  'Mito vs realidad: enuncia la creencia popular y la desmiente en la misma línea.',
  'Lo que nadie te dice: promete una verdad incómoda que no sale en las guías oficiales.',
  'Urgencia con plazo: ancla el gancho a una fecha, cambio de ley o ventana que se cierra.',
  'Historia en dos líneas: arranca a media escena, como si el lector entrara a mitad de una conversación real.',
]

const ANTI_REPEAT_WINDOW = 3

function elegirGancho(cicloCount: number, usados: Set<number | null>): number {
  let ganchoId = cicloCount % BANCO_GANCHOS.length
  for (let i = 0; i < BANCO_GANCHOS.length; i++) {
    const candidato = (cicloCount + i) % BANCO_GANCHOS.length
    if (!usados.has(candidato)) {
      ganchoId = candidato
      break
    }
  }
  return ganchoId
}

export async function getFormatoYGancho(): Promise<{
  formato: Formato
  ganchoId: number
  ganchoTexto: string
  cicloCount: number
}> {
  const cicloCount = await prisma.socialPost.count({
    where: { platform: 'instagram', status: 'published', formato: { not: null } },
  })
  const formato = CICLO_FORMATOS[cicloCount % CICLO_FORMATOS.length]

  const recientes = await prisma.socialPost.findMany({
    where: { platform: 'instagram', status: 'published', ganchoId: { not: null } },
    select: { ganchoId: true },
    orderBy: { createdAt: 'desc' },
    take: ANTI_REPEAT_WINDOW,
  })
  const usados = new Set(recientes.map((r) => r.ganchoId))
  const ganchoId = elegirGancho(cicloCount, usados)

  return { formato, ganchoId, ganchoTexto: BANCO_GANCHOS[ganchoId], cicloCount }
}

// Simulación pura (sin tocar DB) de los próximos N slots del ciclo, partiendo de
// cicloCount — usada solo para el dry run de verificación, nunca en producción.
export function simularCiclo(
  cicloCount: number,
  n: number,
): Array<{ formato: Formato; ganchoId: number; ganchoTexto: string }> {
  const resultado: Array<{ formato: Formato; ganchoId: number; ganchoTexto: string }> = []
  const ventana: number[] = []
  for (let i = 0; i < n; i++) {
    const pos = cicloCount + i
    const formato = CICLO_FORMATOS[pos % CICLO_FORMATOS.length]
    const usados = new Set(ventana.slice(-ANTI_REPEAT_WINDOW))
    const ganchoId = elegirGancho(pos, usados)
    ventana.push(ganchoId)
    resultado.push({ formato, ganchoId, ganchoTexto: BANCO_GANCHOS[ganchoId] })
  }
  return resultado
}
