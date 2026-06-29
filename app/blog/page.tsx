import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

const categoryFallbackImages: Record<string, string> = {
  'Visas y permisos':        'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=70',
  'Mercado laboral':         'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=70',
  'Finanzas y vivienda':     'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=600&q=70',
  'Homologación de títulos': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=70',
  'Bienestar y salud':       'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=70',
  'Educación y familia':     'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=70',
  'Noticias Suiza':          'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=70',
  'Cultura y adaptación':    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=70',
  'Emprendimiento':          'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=70',
  'Impuestos':               'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70',
  // legacy slugs
  noticias:       'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=70',
  trabajo:        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=70',
  vivienda:       'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=600&q=70',
  tramites:       'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=70',
  medicina:       'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=70',
  finanzas:       'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70',
  'alemán':       'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=70',
  'vida-en-suiza':'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70',
  'reglas-normas':'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=70',
  herramientas:   'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=70',
};

function getCategoryImage(category: string): string {
  return categoryFallbackImages[category]
    ?? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70';
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog sobre Suiza | Migrante Global',
  description: 'Guías, noticias y recursos actualizados cada día sobre trabajo, alojamiento, trámites y vida en Suiza para hispanohablantes.',
  openGraph: {
    title: 'Blog sobre Suiza — Migrante Global',
    description: 'Contenido diario sobre cómo vivir y trabajar en Suiza. Actualizado con IA cada mañana.',
    url: 'https://migranteglobal.ch/blog',
    siteName: 'Migrante Global',
    images: [{ url: 'https://migranteglobal.ch/og-image.png', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
};

const categoryColors: Record<string, string> = {
  'Visas y permisos':       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Mercado laboral':        'bg-green-500/20 text-green-300 border-green-500/30',
  'Finanzas y vivienda':    'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Homologación de títulos':'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Bienestar y salud':      'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Educación y familia':    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Noticias Suiza':         'bg-red-500/20 text-red-300 border-red-500/30',
  'Cultura y adaptación':   'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Emprendimiento':         'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Impuestos':              'bg-slate-500/20 text-slate-300 border-slate-500/30',
  // legacy slugs
  noticias:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  trabajo:   'bg-green-500/20 text-green-300 border-green-500/30',
  vivienda:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  tramites:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  medicina:  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  finanzas:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'alemán':  'bg-red-500/20 text-red-300 border-red-500/30',
  'vida-en-suiza': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'reglas-normas': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  herramientas: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

const categoryActiveColors: Record<string, string> = {
  'Visas y permisos':       'bg-blue-500 text-white border-blue-500',
  'Mercado laboral':        'bg-green-500 text-white border-green-500',
  'Finanzas y vivienda':    'bg-purple-500 text-white border-purple-500',
  'Homologación de títulos':'bg-orange-500 text-white border-orange-500',
  'Bienestar y salud':      'bg-pink-500 text-white border-pink-500',
  'Educación y familia':    'bg-yellow-500 text-black border-yellow-500',
  'Noticias Suiza':         'bg-red-500 text-white border-red-500',
  'Cultura y adaptación':   'bg-cyan-500 text-white border-cyan-500',
  'Emprendimiento':         'bg-emerald-500 text-white border-emerald-500',
  'Impuestos':              'bg-slate-500 text-white border-slate-500',
};

function categoryColor(cat: string) {
  return categoryColors[cat] ?? 'bg-white/10 text-white/60 border-white/10';
}

function categoryActiveColor(cat: string) {
  return categoryActiveColors[cat] ?? 'bg-yellow-500 text-black border-yellow-500';
}

const PAGE_SIZE = 12;

export default async function BlogPage({ searchParams }: { searchParams: { categoria?: string; pagina?: string } }) {
  const activeCategory = searchParams.categoria ?? null;
  const currentPage = Math.max(1, Number(searchParams.pagina ?? 1));

  const where = {
    published: true,
    ...(activeCategory ? { category: activeCategory } : {}),
  };

  const [posts, totalCount, categoryCounts] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        tags: true,
        imageUrl: true,
        aiGenerated: true,
        createdAt: true,
      },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { id: true },
      orderBy: { category: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const totalAll = categoryCounts.reduce((sum, c) => sum + c._count.id, 0);
  const categories = categoryCounts.map(c => ({ name: c.category, count: c._count.id }));
  const featured = !activeCategory && currentPage === 1 ? posts[0] : null;
  const grid = featured ? posts.slice(1) : posts;

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: '#0d1117', paddingTop: '80px' }}>

        {/* Header */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 text-center">
          <span className="section-tag mb-4">Actualización diaria con IA</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog sobre <span className="text-yellow-400">Suiza</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Noticias, guías y recursos actualizados cada día para hispanohablantes que viven o quieren vivir en Suiza.
          </p>
        </section>

        {/* ── Layout: sidebar + contenido ── */}
        <div className="max-w-[1200px] mx-auto px-6 pb-20 flex gap-8 items-start">

          {/* ── Sidebar izquierda ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4 px-1">Categorías</p>
            <nav className="flex flex-col gap-1">
              <Link
                href="/blog"
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !activeCategory
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Todos</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${!activeCategory ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/8 text-white/30'}`}>
                  {totalAll}
                </span>
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  href={`/blog?categoria=${encodeURIComponent(cat.name)}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.name
                      ? `border ${categoryActiveColor(cat.name)}`
                      : 'text-white/55 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="leading-snug">{cat.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ml-2 ${
                    activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-white/8 text-white/30'
                  }`}>
                    {cat.count}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* ── Mobile: tabs horizontales (solo < lg) ── */}
          {categories.length > 0 && (
            <div className="lg:hidden w-full mb-8">
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                    !activeCategory
                      ? 'bg-yellow-500 text-black border-yellow-500'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  Todos
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.name}
                    href={`/blog?categoria=${encodeURIComponent(cat.name)}`}
                    className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                      activeCategory === cat.name
                        ? categoryActiveColor(cat.name)
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Contenido principal ── */}
          <div className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-yellow-500/40 mx-auto mb-4" />
              <p className="text-white/40 text-lg">
                {activeCategory
                  ? `Aún no hay artículos en esta categoría.`
                  : 'El primer artículo se publicará mañana a las 8:00.'}
              </p>
              {activeCategory && (
                <Link href="/blog" className="mt-4 inline-block text-yellow-500 hover:text-yellow-400 text-sm transition">
                  Ver todos los artículos →
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* ── Post destacado (solo vista "Todos") ── */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
                  <div
                    className="rounded-2xl overflow-hidden transition-all group-hover:border-yellow-500/40"
                    style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {featured.imageUrl && (
                      <div className="relative w-full h-72 md:h-96">
                        <Image
                          src={featured.imageUrl}
                          alt={featured.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 1200px"
                          priority
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #13151b 0%, transparent 60%)' }} />
                      </div>
                    )}

                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColor(featured.category)}`}>
                          {featured.category}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition">
                        {featured.title}
                      </h2>
                      <p className="text-white/55 mb-6 text-lg leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/35 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(featured.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </div>
                        <span className="text-yellow-500 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                          Leer artículo <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Grid de posts ── */}
              {grid.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grid.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <div
                        className="rounded-xl overflow-hidden h-full flex flex-col transition-all group-hover:border-yellow-500/30"
                        style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {post.imageUrl ? (
                          <div className="relative w-full h-44 flex-shrink-0">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #13151b 0%, transparent 50%)' }} />
                          </div>
                        ) : (
                          <div className="relative w-full h-44 flex-shrink-0">
                            <Image
                              src={getCategoryImage(post.category)}
                              alt={post.category}
                              fill
                              className="object-cover opacity-60"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #13151b 0%, transparent 50%)' }} />
                          </div>
                        )}

                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor(post.category)}`}>
                              {post.category}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mb-2 group-hover:text-yellow-400 transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-white/50 text-sm flex-1 line-clamp-3 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-white/30 text-xs flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        {/* ── Paginación ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8 pb-4">
            {currentPage > 1 && (
              <Link
                href={`/blog?${activeCategory ? `categoria=${encodeURIComponent(activeCategory)}&` : ''}pagina=${currentPage - 1}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
              >
                ← Anterior
              </Link>
            )}
            <span className="text-white/35 text-sm px-3">
              Página {currentPage} de {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/blog?${activeCategory ? `categoria=${encodeURIComponent(activeCategory)}&` : ''}pagina=${currentPage + 1}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
              >
                Siguiente →
              </Link>
            )}
          </div>
        )}
          </div>{/* fin contenido principal */}
        </div>{/* fin layout flex */}
      </main>
      <Footer />
    </>
  );
}
