import { NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { allowed } = rateLimit(ip, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento antes de generar otro documento.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const {
      documentType = "vivienda",
      // Datos personales
      name = "",
      email = "",
      phone = "",
      currentAddress = "",
      currentPostalCity = "",
      date = new Date().toLocaleDateString("de-CH"),
      // Destinatario
      recipientName = "",
      recipientAddress = "",
      recipientPostalCity = "",
      // Datos laborales
      profession = "",
      salary = "",
      contractType = "",
      company = "",
      // Datos personales adicionales
      maritalStatus = "",
      householdSize = "",
      smoker = "",
      pets = "",
      // Ciudad destino y mensaje libre
      city = "",
      message = "",
    } = body;

    let systemPrompt = "";
    let userPrompt = "";

    // ──────────────────────────────────────────────
    // CARTA DE VIVIENDA (Deutsch)
    // ──────────────────────────────────────────────
    if (documentType === "vivienda") {
      systemPrompt = `Eres un experto en redacción de cartas formales en alemán para solicitudes de vivienda en Suiza.
Conoces perfectamente las expectativas de los Vermieter (propietarios) e inmobiliarias suizas.
Redactas cartas que generan confianza, transmiten estabilidad económica y responsabilidad personal.
NORMAS CRÍTICAS:
- Usa SIEMPRE la estructura formal suiza: Absender arriba izquierda, fecha arriba derecha, destinatario, Betreff en negrita, Sehr geehrte/r..., cuerpo en 3-4 párrafos, cierre formal Freundliche Grüsse, nombre.
- Escribe en alemán estándar (Hochdeutsch), NO suizo alemán.
- NO inventes datos que no te han dado. Si faltan campos, usa [dato pendiente] como marcador.
- El tono es profesional, cálido y seguro. Nunca suplicante.
- Resalta siempre: ingresos fijos, tipo de contrato, no fumador (si aplica), sin mascotas (si aplica), tamaño del hogar.`;

      userPrompt = `Genera una carta formal de solicitud de vivienda en alemán con TODOS estos datos:

DATOS DEL SOLICITANTE:
- Nombre completo: ${name || "[Nombre completo]"}
- Dirección actual: ${currentAddress || "[Dirección actual]"}, ${currentPostalCity || "[Ciudad y CP actual]"}
- Email: ${email || "[email]"}
- Teléfono: ${phone || "[teléfono]"}
- Fecha: ${date}

DESTINATARIO (propietario/inmobiliaria):
- Nombre/empresa: ${recipientName || "Sehr geehrte Damen und Herren"}
- Dirección: ${recipientAddress || "[Dirección destinatario]"}
- Ciudad: ${recipientPostalCity || city || "[Ciudad destinatario]"}

PERFIL PROFESIONAL Y ECONÓMICO:
- Profesión: ${profession || "[profesión]"}
- Salario mensual neto: ${salary ? salary + " CHF" : "[salario] CHF"}
- Tipo de contrato: ${contractType || "indefinido"}
- Empresa: ${company || "[empresa]"}

SITUACIÓN PERSONAL:
- Estado civil: ${maritalStatus || "[estado civil]"}
- Personas en el hogar: ${householdSize || "1"}
- Fumador/a: ${smoker === "no" || smoker === "No" ? "No (Nichtraucher)" : smoker === "si" || smoker === "Sí" ? "Sí" : "[dato]"}
- Mascotas: ${pets === "no" || pets === "No" ? "No (keine Haustiere)" : pets || "[dato]"}

CIUDAD/ZONA DEL PISO:
${city || "[ciudad]"}

INFORMACIÓN ADICIONAL DEL SOLICITANTE:
${message || "(ninguna adicional)"}

ESTRUCTURA REQUERIDA:
1. Encabezado con datos del remitente y fecha
2. Datos del destinatario
3. Betreff (asunto en negrita): Bewerbung für die Wohnung [dirección si disponible]
4. Anrede formal
5. Párrafo 1: Quién soy, motivación para el piso
6. Párrafo 2: Situación profesional y financiera (ingreso, contrato, estabilidad)
7. Párrafo 3: Situación personal (hogar, estilo de vida, no fumador/sin mascotas si aplica)
8. Párrafo 4: Cierre con disponibilidad para visita/entrevista
9. Freundliche Grüsse + nombre

Genera la carta completa, lista para copiar y enviar.`;
    }

    // ──────────────────────────────────────────────
    // CARTA DE PRESENTACIÓN LABORAL (Deutsch)
    // ──────────────────────────────────────────────
    if (documentType === "trabajo") {
      systemPrompt = `Eres un experto en redacción de Bewerbungsschreiben (cartas de candidatura) en alemán para el mercado laboral suizo.
Conoces el estilo suizo: directo, estructurado, orientado a resultados y sin excesiva elaboración.
NORMAS CRÍTICAS:
- Estructura formal suiza: remitente, fecha, destinatario, Betreff, Sehr geehrte/r..., 3-4 párrafos, cierre.
- Hochdeutsch (no dialecto suizo).
- NO inventes logros, fechas o empresas no mencionados.
- Usa [dato pendiente] para campos faltantes.
- El candidato debe sonar competente, motivado y adaptable al entorno suizo.`;

      userPrompt = `Genera una carta de candidatura laboral en alemán (Bewerbungsschreiben) para Suiza:

DATOS DEL CANDIDATO:
- Nombre: ${name || "[Nombre]"}
- Dirección: ${currentAddress || "[Dirección]"}, ${currentPostalCity || "[CP Ciudad]"}
- Email: ${email || "[email]"}
- Teléfono: ${phone || "[teléfono]"}
- Fecha: ${date}

EMPRESA DESTINATARIA:
- Empresa: ${recipientName || company || "[Nombre empresa]"}
- Dirección empresa: ${recipientAddress || "[Dirección empresa]"}
- Ciudad empresa: ${recipientPostalCity || city || "[Ciudad empresa]"}

PERFIL PROFESIONAL:
- Profesión / puesto al que aplica: ${profession || "[puesto]"}
- Empresa actual o anterior: ${company || "[empresa]"}
- Tipo de contrato deseado: ${contractType || "indefinido a tiempo completo"}
- Salario esperado: ${salary ? salary + " CHF/mes" : "[salario esperado] CHF/mes"}
- Ciudad/zona de trabajo: ${city || "[ciudad]"}

INFORMACIÓN PERSONAL Y ADICIONAL:
${message || "(el candidato no ha añadido más detalles)"}

ESTRUCTURA:
1. Datos remitente + fecha
2. Datos empresa destinataria
3. Betreff: Bewerbung als [profesión] / [referencia si disponible]
4. Sehr geehrte/r...
5. Párrafo 1: Motivación y cómo supo del puesto / por qué esta empresa
6. Párrafo 2: Experiencia relevante, competencias clave y valor aportado
7. Párrafo 3: Encaje cultural/suizo, flexibilidad, motivación de vivir/trabajar en Suiza
8. Párrafo 4: Disponibilidad para entrevista, referencia a CV adjunto
9. Freundliche Grüsse + nombre

Genera la carta completa en alemán.`;
    }

    // ──────────────────────────────────────────────
    // CURRÍCULUM FORMATO SUIZO
    // ──────────────────────────────────────────────
    if (documentType === "cv") {
      systemPrompt = `Eres un experto en CVs para el mercado laboral suizo (Lebenslauf).
El formato suizo es limpio, sin foto obligatoria, cronológico inverso, con secciones bien delimitadas.
NORMAS:
- Genera en español con términos técnicos en alemán donde corresponda.
- Usa formato de texto estructurado con secciones claramente marcadas.
- NO inventes empresas, fechas, títulos ni logros.
- Si falta información, indica [completar] en el campo correspondiente.
- Incluye siempre: datos personales, perfil profesional, experiencia, formación, idiomas, habilidades.`;

      userPrompt = `Genera un Lebenslauf (CV formato suizo) con estos datos:

DATOS PERSONALES:
- Nombre: ${name || "[Nombre completo]"}
- Dirección: ${currentAddress || "[Calle y número]"}, ${currentPostalCity || "[CP Ciudad]"}
- Email: ${email || "[email]"}
- Teléfono: ${phone || "[teléfono]"}
- Estado civil: ${maritalStatus || "[estado civil]"}

PERFIL PROFESIONAL:
- Título / profesión: ${profession || "[profesión]"}
- Empresa actual: ${company || "[empresa actual]"}
- Tipo de contrato: ${contractType || "[tipo de contrato]"}
- Salario de referencia: ${salary ? salary + " CHF" : "[salario]"}
- Zona de trabajo: ${city || "[ciudad/cantón]"}

INFORMACIÓN ADICIONAL (experiencias, idiomas, habilidades, logros, formación):
${message || "(no especificado — usar [completar] en cada sección)"}

SECCIONES A GENERAR:
1. PERSÖNLICHE DATEN / Datos personales (nombre, dirección, contacto, estado civil, nacionalidad si se menciona)
2. BERUFLICHES PROFIL / Perfil profesional (3-4 líneas de resumen ejecutivo)
3. BERUFSERFAHRUNG / Experiencia profesional (cronológico inverso — extraer de la info adicional o usar [completar])
4. AUSBILDUNG / Formación académica (extraer de la info adicional o usar [completar])
5. SPRACHEN / Idiomas (extraer de info adicional — indicar nivel A1-C2)
6. KENNTNISSE / Habilidades y competencias
7. REFERENZEN / Referencias (auf Anfrage / disponibles bajo petición)

Genera el CV completo y estructurado.`;
    }

    // ──────────────────────────────────────────────
    // CARTA PARA TRÁMITES ADMINISTRATIVOS
    // ──────────────────────────────────────────────
    if (documentType === "tramites") {
      systemPrompt = `Eres un experto en redacción de cartas formales administrativas en alemán para instituciones suizas.
Conoces los registros de Gemeinde, el sistema de seguros (Krankenkasse), la migración (Migrationsamt), el RAV (desempleo) y otros organismos.
NORMAS CRÍTICAS:
- Tono muy formal y neutro. Nunca emocional.
- Estructura rigurosa: remitente, fecha, destinatario, número de referencia (si disponible), Betreff claro, cuerpo conciso, documentos adjuntos listados, cierre.
- Alemán estándar, frases cortas y directas.
- NO inventes números de expediente ni datos. Usa [dato pendiente].`;

      userPrompt = `Genera una carta formal para trámite administrativo en Suiza:

DATOS DEL SOLICITANTE:
- Nombre: ${name || "[Nombre completo]"}
- Dirección: ${currentAddress || "[Dirección]"}, ${currentPostalCity || "[CP Ciudad]"}
- Email: ${email || "[email]"}
- Teléfono: ${phone || "[teléfono]"}
- Fecha: ${date}

INSTITUCIÓN DESTINATARIA:
- Nombre: ${recipientName || "[Nombre institución]"}
- Dirección: ${recipientAddress || "[Dirección institución]"}
- Ciudad: ${recipientPostalCity || city || "[Ciudad institución]"}

DATOS RELEVANTES DEL SOLICITANTE:
- Profesión: ${profession || "[profesión]"}
- Empresa: ${company || "[empresa]"}
- Ingresos: ${salary ? salary + " CHF/mes" : "[ingresos]"}
- Estado civil: ${maritalStatus || "[estado civil]"}
- Personas en hogar: ${householdSize || "[número]"}

NATURALEZA DEL TRÁMITE Y DETALLES:
${message || "(describir el trámite — anmeldung, permiso de residencia, baja de seguro, solicitud RAV, etc.)"}

ESTRUCTURA:
1. Datos remitente + fecha
2. Datos institución
3. Referenz/Aktenzeichen: [si se menciona, si no omitir]
4. Betreff muy concreto (ej: Antrag auf Wohnsitzanmeldung / Abmeldung Krankenkasse / etc.)
5. Sehr geehrte Damen und Herren,
6. Párrafo 1: Propósito de la carta (qué solicita, en qué contexto)
7. Párrafo 2: Datos relevantes (situación personal/laboral que justifica el trámite)
8. Párrafo 3: Documentos adjuntos (lista de [Beilage 1], [Beilage 2], etc.)
9. Párrafo 4: Solicitud de confirmación / próximos pasos
10. Freundliche Grüsse + nombre y firma

Carta completa lista para adaptar.`;
    }

    // ──────────────────────────────────────────────
    // CARTA PERSONAL / MOTIVACIÓN
    // ──────────────────────────────────────────────
    if (documentType === "personal") {
      systemPrompt = `Eres un experto en cartas personales y de motivación en contexto migratorio hacia Suiza.
Redactas con claridad, humanidad y autenticidad. El tono es formal pero cercano.
El objetivo es que quien lee entienda la historia, la motivación y el compromiso de la persona.
NORMAS:
- Puede ser en español o alemán según el contexto indicado.
- NO inventes experiencias ni hechos no mencionados.
- Usa [completar] para datos faltantes importantes.
- Estructura: presentación → contexto de vida/migración → motivación concreta → propuesta o petición → cierre.`;

      userPrompt = `Genera una carta personal / de motivación para contexto migratorio:

DATOS DEL AUTOR:
- Nombre: ${name || "[Nombre]"}
- Email: ${email || "[email]"}
- Teléfono: ${phone || "[teléfono]"}
- Dirección actual: ${currentAddress || "[Dirección]"}, ${currentPostalCity || "[Ciudad]"}
- Fecha: ${date}

DESTINATARIO (si aplica):
- ${recipientName || "(carta general / sin destinatario específico)"}
- ${recipientAddress ? recipientAddress + ", " + recipientPostalCity : ""}

PERFIL:
- Profesión: ${profession || "[profesión]"}
- Empresa/institución: ${company || "[empresa o sin empleo actual]"}
- Ingresos actuales: ${salary ? salary + " CHF" : "[dato]"}
- Estado civil: ${maritalStatus || "[estado civil]"}
- Familia/hogar: ${householdSize ? householdSize + " personas" : "[dato]"}
- Ciudad destino: ${city || "[ciudad en Suiza]"}

HISTORIA, MOTIVACIÓN Y CONTEXTO (base principal de la carta):
${message || "(describir aquí: por qué emigrar, historia personal, motivaciones, situación actual, objetivos en Suiza)"}

ESTRUCTURA:
1. Datos contacto + fecha
2. Destinatario (si aplica)
3. Asunto: Carta de motivación / Presentación personal
4. Párrafo 1: Quién soy — presentación concisa y genuina
5. Párrafo 2: Mi contexto y por qué Suiza — motivación real, no genérica
6. Párrafo 3: Lo que ofrezco / lo que busco — perfil profesional y personal
7. Párrafo 4: Compromiso, integración, proyección a futuro
8. Párrafo 5: Cierre con petición concreta y agradecimiento
9. Despedida formal + nombre

Carta completa, auténtica y convincente.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.45,
      max_tokens: 1800,
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
