import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Solo publicamos imagen + caption en Instagram y Facebook (comparten texto),
// enlazando al artículo del blog. El pipeline de video se eliminó.
export interface AdaptedContent {
  instagram: {
    caption: string
    hashtags: string[]
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
  const prompt = `Adapta este artículo de blog para una publicación de Instagram/Facebook. Devuelve SOLO JSON válido.

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
    max_tokens: 1000,
  })

  const raw = completion.choices[0].message.content ?? '{}'
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned) as AdaptedContent
}
