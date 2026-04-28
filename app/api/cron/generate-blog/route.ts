import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

async function fetchSwissNews(): Promise<{ title: string; url: string; description: string } | null> {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    // Sin API key, usamos un tema de tendencia genérico sobre Suiza
    const fallbackTopics = [
      'Mercado laboral en Suiza 2025: sectores con más demanda',
      'Cómo funciona el sistema de pensiones en Suiza',
      'Los mejores cantones para vivir en Suiza según tu presupuesto',
      'Guía completa: permisos de residencia en Suiza para hispanohablantes',
      'Coste real de vida en Zúrich, Ginebra y Berna en 2025',
      'Cómo aprender alemán rápido para trabajar en Suiza',
      'Todo sobre el seguro de salud obligatorio en Suiza (LAMal)',
      'Trámites imprescindibles al llegar a Suiza por primera vez',
    ];
    const topic = fallbackTopics[new Date().getDate() % fallbackTopics.length];
    return { title: topic, url: '', description: topic };
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=Suiza+emigrantes+OR+Switzerland+trabajo+OR+permiso+residencia&language=es&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    );
    const data = await res.json();
    if (data.articles && data.articles.length > 0) {
      const article = data.articles[0];
      return {
        title: article.title,
        url: article.url,
        description: article.description || article.title,
      };
    }
  } catch {
    // Si falla NewsAPI, continuamos con fallback
  }

  return null;
}

export async function GET(req: NextRequest) {
  // Vercel Cron autentica con esta cabecera
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const news = await fetchSwissNews();
  if (!news) {
    return NextResponse.json({ error: 'No se pudo obtener noticia' }, { status: 500 });
  }

  const prompt = `Eres un experto en migración a Suiza y redactor de contenido en español para hispanohablantes.

Escribe un artículo de blog completo, informativo y útil sobre el siguiente tema:
"${news.title}"

El artículo debe:
- Estar en español neutro (válido para España y Latinoamérica)
- Tener entre 600 y 900 palabras
- Ser práctico, honesto y con datos reales actuales sobre Suiza
- Incluir subtítulos con ## para estructurar el contenido
- Dirigirse a personas que quieren emigrar o ya viven en Suiza
- Terminar con una llamada a la acción sutil hacia Migrante Global (migrante que ayuda a otros migrantes)

Responde ÚNICAMENTE con JSON en este formato exacto:
{
  "title": "Título del artículo (atractivo, SEO-friendly, en español)",
  "excerpt": "Resumen de 1-2 frases del artículo (máx 160 caracteres)",
  "content": "Contenido completo del artículo en Markdown",
  "category": "una de: noticias | trabajo | vivienda | tramites | vida-en-suiza | finanzas | alemán",
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
        category: generated.category || 'noticias',
        tags: generated.tags || [],
        published: false,
        aiGenerated: true,
        sourceUrl: news.url || null,
        sourceTitle: news.title,
      },
    });

    return NextResponse.json({ success: true, post: { id: post.id, title: post.title } });
  } catch (error) {
    console.error('Error generando blog post:', error);
    return NextResponse.json({ error: 'Error generando post' }, { status: 500 });
  }
}
