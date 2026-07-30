import OpenAI from 'openai'
import type { Formato } from './format-cycle'
import type { ReferenciaTrending } from './trending/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Publicamos en Instagram y Facebook siguiendo el ciclo de 8 formatos
// (lib/social/format-cycle.ts: carrusel/foto/dato). Dos modos de contenido,
// ortogonales al formato: 'blog' (el artículo del día contado en clave
// personal, con enlace) y 'motivacional' (mentalidad pura, sin trámites).
// Si el carrusel falla al renderizar, el fallback es imagen simple con caption.
export type CarouselMode = 'blog' | 'motivacional'

export interface AdaptedContent {
  instagram: {
    caption: string
    hashtags: string[]
  }
  carousel?: {
    gancho: string // lámina 1 — para el scroll
    laminas: string[] // 4-6 láminas de desarrollo, una idea por lámina
    cta: string // lámina final
    keywords: string[] // términos en inglés para las fotos de fondo
  }
  foto?: {
    keywords: string[] // términos en inglés para la foto suelta
  }
  dato?: {
    cifra: string // el dato/cifra central de la lámina, corto
    texto: string // 1-2 frases de contexto sobre la cifra
    keywords: string[]
  }
}

export interface Historial {
  ultimosTemas: string[]
  ultimosGanchos: string[]
}

const SYSTEM_PROMPT = `Eres el equipo de marketing de Kevin García, consultor de inmigración en Suiza con más de 10 años de experiencia. Kevin habla en primera persona, de forma directa, cercana y honesta. Su audiencia son latinos que quieren migrar a Suiza o ya viven en Suiza.

Para el contenido usas el estilo de las cuentas virales de disciplina (estilo @elmodolobo_):
1. Frases cortas y contundentes, una idea por frase. Segunda persona ("tú"). Sin emojis en las láminas.
2. Detalles cotidianos concretos que el lector reconoce al instante.
3. Giro de responsabilidad o de esperanza: el problema tiene nombre y tiene solución.
4. Escalada a la identidad: el detalle pequeño revela quién eres y en quién te estás convirtiendo.
5. Cierre que invita a actuar.

REGLA DE ORO: el tema técnico (visado, seguro, alquiler) es solo la excusa — el protagonista siempre es LA PERSONA: su miedo, su disciplina, su decisión de cambiar de vida. El contenido debe funcionar como gancho para atraer clientes y curiosos, pero también dejar un mensaje que remueva por dentro.`

// Temas de mentalidad que rotan en los días de contenido motivacional
const TEMAS_MOTIVACIONALES = [
  'El miedo a empezar de cero en otro país — y por qué quedarse quieto también tiene precio',
  'La disciplina silenciosa: lo que haces cuando nadie te mira decide tu vida en el extranjero',
  'Identidad: quién eres cuando estás lejos de casa y nadie sabe tu nombre',
  'El sacrificio por la familia: migrar no es abandonar, es construir',
  'La constancia gana a la motivación: el proceso migratorio como maestro de paciencia',
  'Decidir vs soñar: la diferencia entre los que hablan de irse y los que se van',
  'Mentalidad de escasez vs abundancia: el dinero, el idioma y las excusas',
  'Empezar tarde no existe: cada año que esperas también es una decisión',
]

function temaMotivacionalDelDia(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getUTCFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  return TEMAS_MOTIVACIONALES[dayOfYear % TEMAS_MOTIVACIONALES.length]
}

function buildHistorialYReferencia(historial: Historial | undefined, referencia: ReferenciaTrending | null): string {
  const historialBlock = `HISTORIAL (para que varíes el lenguaje, no repitas lo mismo):
  últimos temas usados: ${historial?.ultimosTemas.length ? historial.ultimosTemas.join(', ') : 'sin datos'}
  últimos ganchos usados: ${historial?.ultimosGanchos.length ? historial.ultimosGanchos.join(' | ') : 'sin datos'}`

  const referenciaBlock = `REFERENCIA EN TENDENCIA (puede venir null):
  tema: ${referencia?.tema ?? 'null'}
  ángulo: ${referencia?.angulo ?? 'null'}
  estructura: ${referencia?.estructura ?? 'null'}
  por qué funciona: ${referencia?.porQueFunciona ?? 'null'}

CÓMO USARLA
- Es una referencia de TEMA y ÁNGULO, no de formato. El formato asignado manda.
- Adapta el ángulo al contexto suizo-latino y a la experiencia de Kevin. Si el
  ángulo no se puede aterrizar a ese contexto con honestidad, ignóralo y usa el
  banco evergreen.
- Puedes tomar prestada la ESTRUCTURA (el orden de las ideas). Nunca el copy.
- Prohibido mencionar, citar o aludir a la cuenta original.
- Si la referencia es null, trabaja normal con el banco de temas evergreen.`

  return `${historialBlock}\n\n${referenciaBlock}`
}

function buildContexto(
  modo: CarouselMode,
  title: string,
  excerpt: string,
  content: string,
  category: string,
  blogUrl: string,
): string {
  if (modo === 'motivacional') {
    const tema = temaMotivacionalDelDia()
    return `TEMA DE HOY: ${tema}

Es un mensaje de mentalidad para migrantes latinos: crear conciencia, remover por dentro, cambiar vidas. Kevin también migró y habla desde la experiencia, no desde la teoría. Sin trámites, sin datos técnicos.`
  }
  return `TÍTULO: ${title}
CATEGORÍA: ${category}
RESUMEN: ${excerpt}
URL DEL BLOG: ${blogUrl}
CONTENIDO (primeros 1500 chars): ${content.slice(0, 1500)}

Recuerda la REGLA DE ORO: el trámite es la excusa, el protagonista es la persona.`
}

export async function adaptContentForSocials(
  title: string,
  excerpt: string,
  content: string,
  category: string,
  blogUrl: string,
  modo: CarouselMode,
  formato: Formato,
  ganchoTexto: string,
  referencia: ReferenciaTrending | null,
  historial?: Historial,
): Promise<AdaptedContent> {
  const contexto = buildContexto(modo, title, excerpt, content, category, blogUrl)
  const historialYReferencia = buildHistorialYReferencia(historial, referencia)
  const salida = buildSalida(formato, ganchoTexto)

  const prompt = `Genera contenido para Instagram/Facebook. Devuelve SOLO JSON válido.

${contexto}

${historialYReferencia}

${salida}

IMPORTANTE: Devuelve SOLO el JSON. Sin markdown, sin explicaciones.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: modo === 'motivacional' ? 0.85 : 0.7,
    max_tokens: 1600,
  })

  const raw = completion.choices[0].message.content ?? '{}'
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned) as AdaptedContent
}

function buildSalida(formato: Formato, ganchoTexto: string): string {
  if (formato === 'foto') return buildSalidaFoto(ganchoTexto)
  if (formato === 'dato') return buildSalidaDato(ganchoTexto)
  return buildSalidaCarrusel(ganchoTexto)
}

function buildSalidaCarrusel(ganchoTexto: string): string {
  return `Genera el siguiente JSON exacto:
{
  "instagram": {
    "caption": "Caption para Instagram en primera persona (Kevin habla). Máximo 250 palabras. Gancho en la primera línea, desarrollo en frases cortas separadas por saltos de línea, una pregunta que invite a comentar, y cierra invitando a leer más o guardar el post.",
    "hashtags": ["array", "de", "15", "hashtags", "relevantes", "sin", "el", "símbolo", "#"]
  },
  "carousel": {
    "gancho": "Primera lámina. Sigue esta fórmula de apertura: ${ganchoTexto} MÁXIMO 15 palabras. Sin emojis.",
    "laminas": ["4 a 6 láminas de desarrollo. Cada una es UNA sola idea escrita como aforismo contundente en segunda persona. MÁXIMO 25 palabras por lámina. Sin emojis, sin hashtags. Progresión: problema → detalle concreto → giro hacia la persona → solución.", "lámina 3", "lámina 4", "lámina 5"],
    "cta": "Última lámina. Máximo 15 palabras invitando a actuar (leer el blog, guardar el post, etc). Sin emojis.",
    "keywords": ["3-4 términos EN INGLÉS que describan VISUALMENTE el tema concreto para buscar fotos de fondo. Objetos y personas del tema, NO paisajes"]
  }
}`
}

function buildSalidaFoto(ganchoTexto: string): string {
  return `Genera el siguiente JSON exacto:
{
  "instagram": {
    "caption": "Caption para Instagram en primera persona (Kevin habla). Máximo 200 palabras. Sigue esta fórmula de apertura en la primera línea: ${ganchoTexto} Desarrollo en frases cortas separadas por saltos de línea, una pregunta que invite a comentar, y cierra invitando a actuar.",
    "hashtags": ["array", "de", "15", "hashtags", "relevantes", "sin", "el", "símbolo", "#"]
  },
  "foto": {
    "keywords": ["3-4 términos EN INGLÉS que describan VISUALMENTE el tema concreto para buscar la foto. Objetos y personas del tema, NO paisajes genéricos"]
  }
}`
}

function buildSalidaDato(ganchoTexto: string): string {
  return `Genera el siguiente JSON exacto:
{
  "instagram": {
    "caption": "Caption para Instagram en primera persona (Kevin habla). Máximo 180 palabras. Sigue esta fórmula de apertura en la primera línea: ${ganchoTexto} Desarrolla el dato con contexto honesto, una pregunta que invite a comentar, y cierra invitando a actuar.",
    "hashtags": ["array", "de", "15", "hashtags", "relevantes", "sin", "el", "símbolo", "#"]
  },
  "dato": {
    "cifra": "El dato o cifra central en muy pocas palabras (ej: '8.7% más caras las primas en 2026'). Debe ser verificable o presentarse como estimación razonable, nunca inventada como si fuera oficial.",
    "texto": "1-2 frases de contexto sobre qué significa esta cifra para alguien viviendo o migrando a Suiza.",
    "keywords": ["3-4 términos EN INGLÉS que describan VISUALMENTE el tema para buscar foto de fondo"]
  }
}`
}
