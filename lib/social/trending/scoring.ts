// Normaliza los candidatos crudos de las 3 fuentes, descarta lo que no aplica,
// le pide a la IA el ángulo/estructura/por_qué_funciona (NUNCA el caption
// original) y devuelve el TOP 5 por score.

import OpenAI from 'openai'
import type { Candidato, CandidatoCrudo, Tema } from './types'
import { TEMAS_NICHO } from './types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const MAX_HORAS = 72
// Fuente A no trae mediana de cuenta (limitación de top_media) — se normaliza
// contra una línea base aproximada del nicho para que no domine el TOP 5 frente
// a la Fuente B, que sí tiene mediana real. Documentado como aproximación.
const BASELINE_ENGAGEMENT_NICHO = 50
// Fuente C (noticias) no tiene engagement — heurístico de recencia solamente,
// a propósito por debajo del rango típico de A/B salvo que no haya nada más.
const SCORE_MAX_NOTICIA = 0.5
const MAX_CANDIDATOS_PARA_IA = 10

function horasDesde(fecha: Date): number {
  return Math.max(1, (Date.now() - fecha.getTime()) / 3_600_000)
}

function scoreCrudo(c: CandidatoCrudo): number {
  const horas = horasDesde(c.publicadoAt)
  if (c.fuente === 'noticia') return SCORE_MAX_NOTICIA / horas
  const engagement = c.likes + c.comentarios * 3
  const divisor = c.medianaEngagementCuenta ?? BASELINE_ENGAGEMENT_NICHO
  return engagement / horas / divisor
}

interface AnguloIA {
  tema: Tema | null
  angulo: string
  estructura: string
  porQueFunciona: string
}

async function generarAngulo(c: CandidatoCrudo, temaSugerido?: Tema): Promise<AnguloIA | null> {
  const prompt = `Analiza este post/noticia del nicho "latinos e hispanohablantes migrando o viviendo en Suiza" (trámites, permisos, seguro médico, impuestos, vivienda, trabajo, idioma, costo de vida). Devuelve SOLO JSON válido.

FUENTE: ${c.fuente}
TEXTO ORIGINAL (solo para tu análisis, NUNCA lo repitas ni lo cites en la respuesta): """${c.captionOriginal.slice(0, 600)}"""
${temaSugerido ? `TEMA YA DETECTADO: ${temaSugerido}` : ''}

Tu tarea: identificar POR QUÉ funciona este contenido — el ángulo y la estructura narrativa — sin copiar ni parafrasear el texto. Si el contenido NO toca ninguno de los temas del nicho (salud, vivienda, impuestos, trabajo, idioma, tramites), o si no puedes formular un ángulo propio y honesto sobre el tema, responde con "tema": null.

Genera el siguiente JSON exacto:
{
  "tema": "salud" | "vivienda" | "impuestos" | "trabajo" | "idioma" | "tramites" | null,
  "angulo": "UNA frase describiendo qué hace funcionar este contenido, en tus propias palabras, sin citar el texto original",
  "estructura": "el orden de las ideas, ej: 'pregunta → 3 errores → CTA'",
  "porQueFunciona": "UNA frase explicando el mecanismo (curiosidad, urgencia, identificación, etc.)"
}

IMPORTANTE: Devuelve SOLO el JSON. Sin markdown, sin explicaciones, sin citar el texto original.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un analista de contenido para redes sociales. Extraes estructura y ángulo, nunca copy. Si no puedes hacerlo con honestidad, respondes tema: null.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 300,
    })
    const raw = completion.choices[0].message.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
    const parsed = JSON.parse(cleaned) as AnguloIA
    if (!parsed.tema || !TEMAS_NICHO.includes(parsed.tema)) return null
    return parsed
  } catch {
    return null // si la IA falla o no formula ángulo, se descarta el candidato
  }
}

export async function calcularTop5(
  crudos: Array<CandidatoCrudo & { __tema?: Tema }>,
): Promise<Candidato[]> {
  const cortaHoras = Date.now() - MAX_HORAS * 60 * 60 * 1000
  const vigentes = crudos.filter((c) => c.publicadoAt.getTime() >= cortaHoras)

  // Pre-ordenamos por score crudo y solo gastamos llamadas de IA en los mejores
  // candidatos (evita cientos de llamadas si un barrido trae mucho volumen).
  const preOrdenados = vigentes
    .map((c) => ({ crudo: c, scoreCrudo: scoreCrudo(c) }))
    .sort((a, b) => b.scoreCrudo - a.scoreCrudo)
    .slice(0, MAX_CANDIDATOS_PARA_IA)

  const conAngulo: Candidato[] = []
  for (const { crudo, scoreCrudo: score } of preOrdenados) {
    const ia = await generarAngulo(crudo, crudo.__tema)
    if (!ia || !ia.tema) continue
    conAngulo.push({
      fuente: crudo.fuente,
      url: crudo.url,
      formatoOriginal: crudo.formatoOriginal,
      tema: ia.tema,
      angulo: ia.angulo,
      estructura: ia.estructura,
      score,
      porQueFunciona: ia.porQueFunciona,
    })
  }

  return conAngulo.sort((a, b) => b.score - a.score).slice(0, 5)
}
