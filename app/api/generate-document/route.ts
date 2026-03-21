import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      documentType = "vivienda",
      name,
      profession,
      salary,
      city,
      message,
    } = body;

    let systemPrompt = "";
    let userPrompt = "";

    if (documentType === "vivienda") {
      systemPrompt =
        "Eres un experto en redacción formal de cartas en alemán para solicitudes de vivienda en Suiza. Redactas textos profesionales, humanos, claros y convincentes, con estilo apropiado para caseros e inmobiliarias suizas.";

      userPrompt = `
Escribe una carta formal en alemán para aplicar a un apartamento en ${city}.

Datos del solicitante:
- Nombre: ${name}
- Profesión: ${profession}
- Salario mensual: ${salary} CHF
- Información adicional: ${message}

Requisitos:
- Tono respetuoso, profesional y natural.
- Enfatiza estabilidad, responsabilidad y fiabilidad.
- Usa formato de carta formal.
- No inventes datos no proporcionados.
`;
    }

    if (documentType === "trabajo") {
      systemPrompt =
        "Eres un experto en redacción de cartas de presentación en alemán para candidaturas laborales en Suiza. Debes sonar profesional, claro y orientado al mercado suizo.";

      userPrompt = `
Escribe una carta de presentación laboral en alemán para una candidatura en Suiza.

Datos del candidato:
- Nombre: ${name}
- Profesión: ${profession}
- Salario objetivo o actual: ${salary} CHF
- Ciudad o zona: ${city}
- Información adicional: ${message}

Requisitos:
- Tono profesional y convincente.
- Enfatiza motivación, experiencia y encaje cultural/laboral.
- Estructura de carta formal.
`;
    }

    if (documentType === "cv") {
      systemPrompt =
        "Eres un experto en CVs para Suiza. Generas un currículum claro, profesional y estructurado, con estilo suizo y formato limpio.";

      userPrompt = `
Crea un borrador de CV en español con estructura profesional suiza.

Datos:
- Nombre: ${name}
- Profesión: ${profession}
- Salario de referencia: ${salary} CHF
- Ciudad o zona: ${city}
- Información adicional: ${message}

Requisitos:
- Estructúralo con secciones claras.
- Incluye perfil profesional, experiencia, habilidades y observaciones.
- No inventes empresas ni fechas.
- Si faltan datos, deja campos sugeridos para completar.
`;
    }

    if (documentType === "tramites") {
      systemPrompt =
        "Eres un experto en redacción formal de cartas administrativas para Suiza. Redactas textos claros, educados y bien estructurados para instituciones.";

      userPrompt = `
Escribe una carta formal para trámites administrativos en Suiza.

Datos:
- Nombre: ${name}
- Profesión: ${profession}
- Ciudad o zona: ${city}
- Información adicional: ${message}

Requisitos:
- Tono muy formal y administrativo.
- Estructura de carta formal.
- Clara, respetuosa y lista para adaptar a Gemeinde, seguros o migración.
- No inventes números de expediente ni datos inexistentes.
`;
    }

    if (documentType === "personal") {
      systemPrompt =
        "Eres un experto en cartas personales y de motivación para contexto migratorio en Suiza. Redactas con claridad, humanidad y elegancia.";

      userPrompt = `
Escribe una carta personal o de motivación formal.

Datos:
- Nombre: ${name}
- Profesión: ${profession}
- Ciudad o zona: ${city}
- Información adicional: ${message}

Requisitos:
- Tono humano, formal y bien estructurado.
- Útil para explicar una situación, presentarse o expresar motivación.
- No inventes hechos no proporcionados.
`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: "Error al generar documento" },
      { status: 500 }
    );
  }
}