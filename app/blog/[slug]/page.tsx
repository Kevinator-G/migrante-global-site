import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Calendar, ArrowLeft, Tag, Sparkles, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

const categoryLabels: Record<string, string> = {
  noticias: 'Noticias',
  trabajo: 'Trabajo',
  vivienda: 'Vivienda',
  tramites: 'Trámites',
  'vida-en-suiza': 'Vida en Suiza',
  finanzas: 'Finanzas',
  'alemán': 'Alemán',
};

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-yellow-400 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-white/80 italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="text-white/65 ml-4 list-disc mb-1">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="mb-4 space-y-1">$&</ul>')
    .replace(/\n\n/g, '</p><p class="text-white/65 leading-relaxed mb-4">')
    .replace(/^(?!<[h|u|l])(.+)$/gm, '<p class="text-white/65 leading-relaxed mb-4">$1</p>');
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  const related = await prisma.blogPost.findMany({
    where: { published: true, category: post.category, NOT: { id: post.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, createdAt: true },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: '#0d1117', paddingTop: '80px' }}>
        <article className="max-w-[780px] mx-auto px-6 py-12">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-yellow-500 transition text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver al blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
              {categoryLabels[post.category] || post.category}
            </span>
            {post.aiGenerated && (
              <span className="text-xs text-yellow-500/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Generado con IA
              </span>
            )}
            <span className="text-white/30 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
          <p className="text-white/55 text-lg mb-8 leading-relaxed border-l-2 border-yellow-500/40 pl-4">{post.excerpt}</p>

          {/* Content */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/8">
              <Tag className="w-4 h-4 text-white/30 mt-0.5" />
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Fuente */}
          {post.sourceUrl && (
            <div className="mt-6 text-xs text-white/30">
              Fuente:{' '}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition inline-flex items-center gap-1">
                {post.sourceTitle || post.sourceUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* CTA */}
          <div
            className="mt-12 rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.1), rgba(220,38,38,0.08))', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <h3 className="text-xl font-bold text-white mb-2">¿Listo para dar el paso?</h3>
            <p className="text-white/55 mb-6 text-sm">Agenda una consulta gratuita y recibe orientación personalizada para tu proceso a Suiza.</p>
            <Link href="/#contacto" className="btn-primary inline-block">
              Agenda tu consulta gratuita
            </Link>
          </div>
        </article>

        {/* Posts relacionados */}
        {related.length > 0 && (
          <div className="max-w-[780px] mx-auto px-6 pb-20">
            <h2 className="text-xl font-bold text-white mb-6">Artículos relacionados</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <div
                    className="rounded-xl p-5 transition-all group-hover:border-yellow-500/30"
                    style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 transition line-clamp-2 mb-2">{r.title}</h4>
                    <p className="text-white/40 text-xs line-clamp-2">{r.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
