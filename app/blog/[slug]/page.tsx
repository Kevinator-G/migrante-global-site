import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Calendar, ArrowLeft, Tag, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    select: { title: true, excerpt: true, slug: true, imageUrl: true },
  });
  if (!post) return {};
  const ogImage = post.imageUrl || 'https://migranteglobal.ch/og-image.png';
  return {
    title: `${post.title} | Migrante Global`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://migranteglobal.ch/blog/${post.slug}`,
      siteName: 'Migrante Global',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'es_ES',
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [ogImage] },
  };
}

const categoryColors: Record<string, string> = {
  'Visas y permisos':       'bg-blue-500/25 text-blue-300 border-blue-500/40',
  'Mercado laboral':        'bg-green-500/25 text-green-300 border-green-500/40',
  'Finanzas y vivienda':    'bg-purple-500/25 text-purple-300 border-purple-500/40',
  'Homologación de títulos':'bg-orange-500/25 text-orange-300 border-orange-500/40',
  'Bienestar y salud':      'bg-pink-500/25 text-pink-300 border-pink-500/40',
  'Educación y familia':    'bg-yellow-500/25 text-yellow-300 border-yellow-500/40',
  'Noticias Suiza':         'bg-red-500/25 text-red-300 border-red-500/40',
  'Cultura y adaptación':   'bg-cyan-500/25 text-cyan-300 border-cyan-500/40',
  'Emprendimiento':         'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
  'Impuestos':              'bg-slate-500/25 text-slate-300 border-slate-500/40',
};

function categoryColor(cat: string) {
  return categoryColors[cat] ?? 'bg-white/10 text-white/60 border-white/20';
}

// Fallback images per category when the post has no imageUrl
const CATEGORY_FALLBACKS: Record<string, string> = {
  'Visas y permisos':       'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=1600&q=80&auto=format&fit=crop',
  'Mercado laboral':        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop',
  'Finanzas y vivienda':    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80&auto=format&fit=crop',
  'Homologación de títulos':'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80&auto=format&fit=crop',
  'Bienestar y salud':      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80&auto=format&fit=crop',
  'Educación y familia':    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80&auto=format&fit=crop',
  'Noticias Suiza':         'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80&auto=format&fit=crop',
  'Cultura y adaptación':   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80&auto=format&fit=crop',
  'Emprendimiento':         'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80&auto=format&fit=crop',
  'Impuestos':              'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=80&auto=format&fit=crop',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80&auto=format&fit=crop';

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-10 mb-3 pb-2" style="border-bottom:1px solid rgba(255,255,255,0.07)">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-yellow-400 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-white/80 italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="text-white/65 ml-5 list-disc mb-1.5 leading-relaxed">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="mb-5 space-y-1">$&</ul>')
    .replace(/\n\n/g, '</p><p class="text-white/65 leading-relaxed mb-5 text-[15px]">')
    .replace(/^(?!<[h|u|l])(.+)$/gm, '<p class="text-white/65 leading-relaxed mb-5 text-[15px]">$1</p>');
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  const heroImage = post.imageUrl || CATEGORY_FALLBACKS[post.category] || DEFAULT_FALLBACK;

  const related = await prisma.blogPost.findMany({
    where: { published: true, category: post.category, NOT: { id: post.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, category: true, createdAt: true },
  });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: heroImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `https://migranteglobal.ch/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: 'Kevin García',
      url: 'https://migranteglobal.ch',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Migrante Global',
      logo: { '@type': 'ImageObject', url: 'https://migranteglobal.ch/favicon.svg' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://migranteglobal.ch/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', ') ?? post.category,
    articleSection: post.category,
    inLanguage: 'es',
  };

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      </head>
      <Navbar />
      <main className="min-h-screen" style={{ background: '#0d1117' }}>

        {/* ── Hero image ── */}
        <div className="relative w-full h-[62vh] min-h-[420px] overflow-hidden">
          <Image
            src={heroImage}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient: navbar clearance top, heavy dark at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.6) 65%, #0d1117 100%)',
            }}
          />

          {/* Back link — top left over image */}
          <div className="absolute top-0 left-0 right-0 pt-24 px-6 max-w-[820px] mx-auto w-full">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-yellow-400 transition text-sm"
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al blog
            </Link>
          </div>

          {/* Title block — bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 pb-10 px-6">
            <div className="max-w-[820px] mx-auto">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColor(post.category)}`}
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  {post.category}
                </span>
                {post.aiGenerated && (
                  <span
                    className="text-xs text-yellow-400/80 flex items-center gap-1 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                  >
                    <Sparkles className="w-3 h-3" /> IA
                  </span>
                )}
                <span
                  className="text-white/50 text-xs flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                >
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 max-w-[720px]"
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
              >
                {post.title}
              </h1>

              {/* Excerpt */}
              <p
                className="text-white/75 text-base max-w-[620px] leading-relaxed border-l-2 border-yellow-500/60 pl-4"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* ── Article body ── */}
        <article className="max-w-[720px] mx-auto px-6 py-12">
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Tag className="w-4 h-4 text-white/25 mt-0.5" />
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Fuente */}
          {post.sourceUrl && (
            <div className="mt-5 text-xs text-white/30">
              Fuente:{' '}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-500 transition inline-flex items-center gap-1"
              >
                {post.sourceTitle || post.sourceUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* CTA */}
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.1), rgba(220,38,38,0.06))',
              border: '1px solid rgba(201,169,110,0.2)',
            }}
          >
            <h3 className="text-xl font-bold text-white mb-2">¿Listo para dar el paso?</h3>
            <p className="text-white/55 mb-6 text-sm max-w-sm mx-auto">
              Agenda una consulta gratuita y recibe orientación personalizada para tu proceso a Suiza.
            </p>
            <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
              Agenda tu consulta gratuita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* ── Artículos relacionados ── */}
        {related.length > 0 && (
          <div className="max-w-[720px] mx-auto px-6 pb-20">
            <h2 className="text-lg font-bold text-white mb-5">Artículos relacionados</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(r => {
                const thumb = r.imageUrl || CATEGORY_FALLBACKS[r.category] || DEFAULT_FALLBACK;
                return (
                  <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                    <div
                      className="rounded-xl overflow-hidden transition-all group-hover:border-yellow-500/30 flex flex-col"
                      style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full h-32 flex-shrink-0">
                        <Image
                          src={thumb}
                          alt={r.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 240px"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, #13151b 0%, transparent 60%)' }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 transition line-clamp-2 mb-1.5">
                          {r.title}
                        </h4>
                        <p className="text-white/40 text-xs line-clamp-2">{r.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
