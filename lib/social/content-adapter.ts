import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Publicamos un carrusel de texto (estilo elmodolobo) en Instagram y Facebook.
// Dos modos: 'blog' (el artículo del día contado en clave personal, con enlace)
// y 'motivacional' (mentalidad pura para crear conciencia y comunidad).
// Si el carrusel falla, el fallback es un post de imagen simple con el caption.
export type CarouselMode = 'blog' | 'motivacional'

export interface AdaptedContent {
  instagram: {
    caption: string
    hashtags: string[]
  }
  carousel: {
    gancho: string // lámina 1 — para el scroll
    laminas: string[] // 4-6 láminas de desarrollo, una idea por lámina
    cta: string // lámina final
  }
}

const SYSTEM_PROMPT = `Eres el equipo de marketing de Kevin García, consultor de inmigración en Suiza con más de 10 años de experiencia. Kevin habla en primera persona, de forma directa, cercana y honesta. Su audiencia son latinos que quieren migrar a Suiza o ya viven en Suiza.

Para los carruseles usas la fórmula narrativa de las cuentas virales de disciplina (estilo @elmodolobo_):
1. GANCHO DE NEGACIÓN: "No es que X. Es que Y." — le quitas la excusa al lector y le devuelves la responsabilidad o le revelas la verdad que nadie le dijo.
2. Frases cortas y contundentes, una idea por frase. Segunda persona ("tú"). Sin emojis en las láminas.
3. Detalles cotidianos concretos que el lector reconoce al instante.
4. Giro de responsabilidad o de esperanza: el problema tiene nombre y tiene solución.
5. Escalada a la identidad: el detalle pequeño revela quién eres y en quién te estás convirtiendo.
6. Cierre que invita a actuar.

REGLA DE ORO: el tema técnico (visado, seguro, alquiler) es solo la excusa — el protagonista siempre es LA PERSONA: su miedo, su disciplina, su decisión de cambiar de vida. El carrusel debe funcionar como gancho para atraer clientes y curiosos, pero también dejar un mensaje que remueva por dentro.`

// Temas de mentalidad que rotan en los días de carrusel motivacional
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

export async function adaptContentForSocials(
  title: string,
  excerpt: string,
  content: string,
  category: string,
  blogUrl: string,
  modo: CarouselMode = 'blog',
): Promise<AdaptedContent> {
  const prompt = modo === 'motivacional' ? buildPromptMotivacional() : buildPromptBlog(title, excerpt, content, category, blogUrl)

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

function buildPromptBlog(
  title: string,
  excerpt: string,
  content: string,
  category: string,
  blogUrl: string,
): string {
  return `Adapta este artículo de blog para un carrusel de Instagram/Facebook. Devuelve SOLO JSON válido.

TÍTULO: ${title}
CATEGORÍA: ${category}
RESUMEN: ${excerpt}
URL DEL BLOG: ${blogUrl}
CONTENIDO (primeros 1500 chars): ${content.slice(0, 1500)}

Recuerda la REGLA DE ORO: el trámite es la excusa, el protagonista es la persona.

Genera el siguiente JSON exacto:
{
  "instagram": {
    "caption": "Caption para Instagram en primera persona (Kevin habla). Máximo 250 palabras. Sigue la fórmula: gancho de negación en la primera línea, desarrollo en frases cortas separadas por saltos de línea, una pregunta que invite a comentar, y cierra con 'Lee el artículo completo → link en bio 🔗'.",
    "hashtags": ["array", "de", "15", "hashtags", "relevantes", "sin", "el", "símbolo", "#"]
  },
  "carousel": {
    "gancho": "Primera lámina. Fórmula 'No es que X. Es que Y.' u otra verdad incómoda sobre el tema del artículo. MÁXIMO 15 palabras. Sin emojis.",
    "laminas": ["4 a 6 láminas de desarrollo. Cada una es UNA sola idea escrita como aforismo contundente en segunda persona. MÁXIMO 25 palabras por lámina. Sin emojis, sin hashtags. Progresión: problema → detalle concreto → giro hacia la persona → solución.", "lámina 3", "lámina 4", "lámina 5"],
    "cta": "Última lámina. Máximo 15 palabras invitando a leer el artículo completo. Sin emojis. Ejemplo: 'La guía completa está en el blog. No migres a ciegas.'"
  }
}

IMPORTANTE: Devuelve SOLO el JSON. Sin markdown, sin explicaciones.`
}

function buildPromptMotivacional(): string {
  // Rotación determinista por día del año — mismo tema si el cron repite el día
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getUTCFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  const tema = TEMAS_MOTIVACIONALES[dayOfYear % TEMAS_MOTIVACIONALES.length]

  return `Crea un carrusel MOTIVACIONAL puro para Instagram/Facebook (sin trámites, sin datos técnicos). Devuelve SOLO JSON válido.

TEMA DE HOY: ${tema}

Es un mensaje de mentalidad para migrantes latinos: crear conciencia, remover por dentro, cambiar vidas. Kevin también migró y habla desde la experiencia, no desde la teoría.

Genera el siguiente JSON exacto:
{
  "instagram": {
    "caption": "Caption para Instagram en primera persona (Kevin habla). Máximo 200 palabras. Gancho de negación en la primera línea, desarrollo en frases cortas separadas por saltos de línea, y cierra con una pregunta directa que invite a comentar y 'Guarda este post para cuando lo necesites 📌'.",
    "hashtags": ["array", "de", "15", "hashtags", "de", "mentalidad", "y", "migración", "sin", "el", "símbolo", "#"]
  },
  "carousel": {
    "gancho": "Primera lámina. Fórmula 'No es que X. Es que Y.' sobre el tema de hoy. MÁXIMO 15 palabras. Sin emojis.",
    "laminas": ["5 a 6 láminas de desarrollo. Cada una es UN aforismo contundente en segunda persona sobre el tema. MÁXIMO 25 palabras por lámina. Sin emojis. Progresión: verdad incómoda → detalle cotidiano que el lector reconoce → giro de responsabilidad → esperanza ganada, no regalada.", "lámina 3", "lámina 4", "lámina 5", "lámina 6"],
    "cta": "Última lámina. Máximo 12 palabras. Una frase que se quede grabada, no publicidad. Ejemplo: 'Tu nueva vida empieza con una decisión, no con un vuelo.'"
  }
}

IMPORTANTE: Devuelve SOLO el JSON. Sin markdown, sin explicaciones.`
}
