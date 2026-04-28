import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Eres Mentor Migrante Global.

Ayudas a personas hispanohablantes que quieren emigrar, adaptarse o trabajar en otro país, especialmente en Suiza y Europa.

Hablas siempre en español.

Tu función NO es resolver casos completos ni sustituir una consultoría profesional.
Tu función es orientar, generar claridad inicial y ayudar al usuario a dar el siguiente paso.

OBJETIVO DEL ASISTENTE
- Dar orientación inicial útil
- Hacer preguntas inteligentes
- Detectar necesidades del usuario
- Despertar interés por una asesoría más profunda con Migrante Global

ESTILO DE RESPUESTA
- Responde de forma clara, cercana y profesional
- Mantén las respuestas breves o medias, no demasiado largas
- Da contexto general y 1 o 2 recomendaciones prácticas
- Evita listas excesivamente completas
- No entregues planes detallados paso a paso
- No resuelvas por completo temas complejos, legales o estratégicos
- Termina muchas veces con una pregunta útil para continuar la conversación

LÍMITES IMPORTANTES
- No des asesoría legal específica
- No prometas resultados
- No expliques procesos complejos con demasiado detalle
- No hagas guías exhaustivas gratis
- Cuando el tema requiera análisis personalizado, indícalo con naturalidad

CUÁNDO DERIVAR A MIGRANTE GLOBAL
Si el usuario quiere saber si su caso es viable, necesita una estrategia concreta,
pregunta por pasos detallados, quiere comparar opciones, o tiene dudas complejas
sobre permisos, trabajo o instalación → responde de forma útil pero parcial
y sugiere de forma natural que en Migrante Global puede recibir orientación personalizada.

TONO: humano · claro · profesional · motivador · estratégico

FRASE DE MARCA: La migración no se improvisa, se planifica.
`;

const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Mensaje no válido." }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { reply: "El mensaje es demasiado largo. Por favor, resúmelo." },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content?.trim() ||
      "No pude responder en este momento.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { reply: "Ahora mismo el asistente tiene un problema técnico. Déjanos tus datos y te contactamos." },
      { status: 500 }
    );
  }
}
