import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rotación diaria de categorías y temas — 10 categorías, ciclo de 10 días
const CATEGORIES = [
  {
    key: 'trabajo',
    label: 'Trabajo',
    topics: [
      'Cómo encontrar trabajo en Suiza siendo extranjero: guía paso a paso',
      'Los sectores con más demanda laboral en Suiza para hispanohablantes',
      'Diferencias entre contrato fijo e indefinido en Suiza',
      'Cómo funciona el desempleo en Suiza: prestaciones y requisitos',
      'Salarios mínimos en Suiza por sector en 2025',
      'Cómo usar LinkedIn y Jobs.ch para buscar trabajo en Suiza',
      'Trabajar en Suiza sin hablar alemán: sectores y consejos',
    ],
  },
  {
    key: 'vivienda',
    label: 'Vivienda',
    topics: [
      'Cómo alquilar un piso en Suiza: guía completa para extranjeros',
      'El depósito de alquiler en Suiza: SwissCaution y otras opciones',
      'Cuánto cuesta vivir en Zúrich vs Berna vs Ginebra en 2025',
      'Plataformas para buscar piso en Suiza: Homegate, ImmoScout24 y más',
      'Qué es el Nebenkosten y qué gastos incluye tu alquiler suizo',
      'Comprar vs alquilar en Suiza: ¿qué conviene más como emigrante?',
    ],
  },
  {
    key: 'tramites',
    label: 'Trámites',
    topics: [
      'Permisos de residencia en Suiza: tipos L, B, C y G explicados',
      'Cómo registrarse en el municipio al llegar a Suiza (Einwohnerkontrolle)',
      'Reagrupación familiar en Suiza: requisitos y proceso',
      'Cómo obtener el permiso de trabajo en Suiza paso a paso',
      'Renovar el permiso de residencia en Suiza: plazos y documentos',
      'Naturalización suiza: requisitos para obtener la ciudadanía',
      'Qué hacer en Suiza los primeros 30 días: trámites esenciales',
    ],
  },
  {
    key: 'medicina',
    label: 'Medicina',
    topics: [
      'El seguro de salud obligatorio en Suiza (LAMal): cómo funciona',
      'Cómo elegir la mejor caja de seguro médico en Suiza',
      'Ayudas para pagar el seguro de salud en Suiza (Prämienverbilligung)',
      'Sistema de salud suizo para extranjeros: médico de cabecera y especialistas',
      'Seguro dental en Suiza: qué cubre y qué no',
      'Baja por enfermedad en Suiza: derechos y procedimiento',
      'Medicamentos en Suiza: cómo funcionan las recetas y la farmacia',
    ],
  },
  {
    key: 'finanzas',
    label: 'Finanzas',
    topics: [
      'Cómo hacer la declaración de impuestos en Suiza como extranjero',
      'Deducciones fiscales permitidas en Suiza que debes aprovechar',
      'El sistema de pensiones suizo: pilares 1, 2 y 3 explicados',
      'Cómo abrir una cuenta bancaria en Suiza siendo extranjero',
      'Impuesto en la fuente (Quellensteuer): qué es y cómo recuperarlo',
      'Enviar dinero desde Suiza a Latinoamérica: mejores opciones y costes',
      'Cómo ahorrar dinero viviendo en Suiza: consejos prácticos',
    ],
  },
  {
    key: 'alemán',
    label: 'Alemán',
    topics: [
      'Cómo aprender alemán rápido para trabajar en Suiza',
      'Diferencias entre el alemán estándar y el Schweizerdeutsch',
      'Las mejores apps y recursos gratuitos para aprender alemán suizo',
      'Nivel de alemán necesario para trabajar en Suiza según el sector',
      'Cursos de alemán subvencionados para emigrantes en Suiza',
      'Vocabulario laboral esencial en alemán para el trabajo en Suiza',
    ],
  },
  {
    key: 'vida-en-suiza',
    label: 'Conocer Suiza',
    topics: [
      'Las mejores ciudades de Suiza para vivir como hispanohablante',
      'Cultura suiza: costumbres y normas que debes conocer al llegar',
      'Transporte público en Suiza: el Halbtax, GA y cómo moverse',
      'Ocio y tiempo libre en Suiza sin gastar una fortuna',
      'Integración en Suiza: cómo hacer amigos y crear red social',
      'Comparativa: vivir en Zúrich vs Lausanne vs Basilea',
      'Los mejores mercados y tiendas baratas para hacer la compra en Suiza',
    ],
  },
  {
    key: 'reglas-normas',
    label: 'Reglas y Normas',
    topics: [
      'Normas de convivencia en Suiza que todo emigrante debe conocer',
      'Las leyes de ruido en Suiza: qué puedes y qué no puedes hacer',
      'Multas y sanciones más comunes para extranjeros en Suiza',
      'Derechos laborales en Suiza: lo que la empresa no puede hacerte',
      'Reciclaje y separación de residuos en Suiza: guía práctica',
      'Conducir en Suiza: canje del carnet extranjero y normas de tráfico',
    ],
  },
  {
    key: 'noticias',
    label: 'Noticias',
    topics: [
      'Cambios en las leyes de inmigración suiza en 2025',
      'Novedades en el mercado laboral suizo para extranjeros este año',
      'Actualización del coste de vida en Suiza: qué ha cambiado',
      'Nuevas ayudas y subvenciones para emigrantes en Suiza en 2025',
      'Cambios en el seguro médico suizo que te afectan como extranjero',
    ],
  },
  {
    key: 'herramientas',
    label: 'Herramientas',
    topics: [
      'Las mejores apps imprescindibles para vivir en Suiza',
      'Herramientas online para calcular tu salario neto en Suiza',
      'Comparadores de seguros médicos en Suiza: cuál usar',
      'Plataformas para aprender alemán online desde Latinoamérica',
      'Recursos oficiales del gobierno suizo que todo emigrante debe conocer',
      'Comunidades y grupos de hispanohablantes en Suiza: dónde encontrarlos',
    ],
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

function pickTodayCategory() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const cat = CATEGORIES[dayOfYear % CATEGORIES.length];
  const topic = cat.topics[dayOfYear % cat.topics.length];
  return { category: cat, topic };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { category, topic } = pickTodayCategory();

  const prompt = `Eres un experto en migración a Suiza y redactor de contenido en español para hispanohablantes.

Escribe un artículo de blog completo, informativo y útil sobre:
"${topic}"

El artículo debe:
- Estar en español neutro (válido para España y Latinoamérica)
- Tener entre 700 y 1000 palabras
- Ser práctico con datos reales y actuales sobre Suiza
- Incluir subtítulos con ## para estructurar el contenido
- Dirigirse a personas que quieren emigrar o ya viven en Suiza
- Terminar con una llamada a la acción sutil hacia Migrante Global

Responde ÚNICAMENTE con JSON en este formato exacto:
{
  "title": "Título del artículo (atractivo, SEO-friendly, en español)",
  "excerpt": "Resumen de 1-2 frases del artículo (máx 160 caracteres)",
  "content": "Contenido completo del artículo en Markdown",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;
    if (!raw) throw new Error('Respuesta vacía de OpenAI');

    const generated = JSON.parse(raw);
    const baseSlug = slugify(generated.title);
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const post = await prisma.blogPost.create({
      data: {
        title: generated.title,
        slug: uniqueSlug,
        excerpt: generated.excerpt,
        content: generated.content,
        category: category.key,
        tags: generated.tags || [],
        published: false,
        aiGenerated: true,
        sourceTitle: topic,
      },
    });

    return NextResponse.json({ success: true, category: category.label, post: { id: post.id, title: post.title } });
  } catch (error) {
    console.error('Error generando blog post:', error);
    return NextResponse.json({ error: 'Error generando post' }, { status: 500 });
  }
}
