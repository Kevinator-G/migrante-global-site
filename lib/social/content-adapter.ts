import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface AdaptedContent {
  instagram: {
    caption: string
    hashtags: string[]
  }
  tiktok: {
    script: string
    hashtags: string[]
  }
  youtube: {
    script: string
    description: string
    tags: string[]
  }
}

const SYSTEM_PROMPT = `Eres el equipo de marketing de Kevin García, consultor de inmigración en Suiza con más de 10 años de experiencia. Kevin habla en primera persona, de forma directa, cercana y honesta. Su audiencia son latinos que quieren migrar a Suiza.`

export async function adaptContentForSocials(
  title: string,
  excerpt: string,
  content: string,
  category: string,
  blogUrl: string,
): Promise<AdaptedContent> {
  const prompt = `Adapta este artículo de blog para 3 plataformas sociales. Devuelve SOLO JSON válido.

TÍTULO: ${title}
CATEGORÍA: ${category}
RESUMEN: ${excerpt}
URL DEL BLOG: ${blogUrl}
CONTENIDO (primeros 1000 chars): ${content.slice(0, 1000)}

Genera el siguiente JSON exacto:
{
  "instagram": {
    "caption": "Caption para Instagram en primera persona (Kevin habla). Máximo 300 palabras. Empieza con un gancho de 1 línea que pare el scroll. Usa saltos de línea para separar ideas. Termina con 'Lee el artículo completo → link en bio 🔗'. Emoji al inicio de cada párrafo clave.",
    "hashtags": ["array", "de", "15", "hashtags", "relevantes", "sin", "el", "símbolo", "#"]
  },
  "tiktok": {
    "script": "Guión para vídeo de TikTok de 60-75 segundos. Estructura: [GANCHO 0-3s] frase que para el scroll, [PROBLEMA 3-15s] la situación del espectador, [SOLUCIÓN 15-45s] 3 puntos clave del artículo, [CTA 45-60s] seguir para más + ver blog. Escríbelo como Kevin hablaría en cámara, natural, sin formalidades. Marca los tiempos con [XX-XXs].",
    "hashtags": ["array", "de", "8", "hashtags", "para", "tiktok"]
  },
  "youtube": {
    "script": "Guión completo para vídeo de YouTube de 8-12 minutos. Estructura: INTRO (gancho + presentación), DESARROLLO (5-6 secciones con H2), CIERRE (resumen + CTA a consulta). Usa [PAUSA], [PANTALLA: X], [B-ROLL: X] para indicar edición. Voz de Kevin, cercano y directo.",
    "description": "Descripción de YouTube (500 palabras). Incluye: párrafo resumen, índice con timestamps aproximados, links relevantes, hashtags al final.",
    "tags": ["array", "de", "20", "tags", "para", "youtube"]
  }
}

IMPORTANTE: Devuelve SOLO el JSON. Sin markdown, sin explicaciones.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  })

  const raw = completion.choices[0].message.content ?? '{}'
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned) as AdaptedContent
}
