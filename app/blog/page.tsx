import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

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

const CATEGORIES = [
  { key: 'trabajo', label: 'Trabajo', color: 'bg-green-500/20 text-green-300 border-green-500/30', active: 'bg-green-500 text-white border-green-500' },
  { key: 'vivienda', label: 'Vivienda', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', active: 'bg-purple-500 text-white border-purple-500' },
  { key: 'tramites', label: 'Trámites', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', active: 'bg-orange-500 text-white border-orange-500' },
  { key: 'medicina', label: 'Medicina', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30', active: 'bg-pink-500 text-white border-pink-500' },
  { key: 'finanzas', label: 'Finanzas', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', active: 'bg-emerald-500 text-white border-emerald-500' },
  { key: 'alemán', label: 'Alemán', color: 'bg-red-500/20 text-red-300 border-red-500/30', active: 'bg-red-500 text-white border-red-500' },
  { key: 'vida-en-suiza', label: 'Conocer Suiza', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', active: 'bg-yellow-500 text-black border-yellow-500' },
  { key: 'reglas-normas', label: 'Reglas y Normas', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', active: 'bg-slate-500 text-white border-slate-500' },
  { key: 'noticias', label: 'Noticias', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', active: 'bg-blue-500 text-white border-blue-500' },
  { key: 'herramientas', label: 'Herramientas', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', active: 'bg-cyan-500 text-white border-cyan-500' },
];

const categoryMap = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

export default async function BlogPage({ searchParams }: { searchParams: { categoria?: string } }) {
  const activeCategory = searchParams.categoria ?? null;

  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      ...(activeCategory ? { category: activeCategory } : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      tags: true,
      aiGenerated: true,
      createdAt: true,
    },
  });

  const featured = !activeCategory ? posts[0] : null;
  const grid = !activeCategory ? posts.slice(1) : posts;

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

        {/* Category filter tabs */}
        <div className="max-w-[1200px] mx-auto px-6 mb-10">
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
            {CATEGORIES.map(cat => (
              <Link
                key={cat.key}
                href={`/blog?categoria=${cat.key}`}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                  activeCategory === cat.key
                    ? cat.active
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 pb-20">
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
              {/* Post destacado (solo en vista "Todos") */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
                  <div
                    className="rounded-2xl p-8 md:p-10 transition-all group-hover:border-yellow-500/40"
                    style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryMap[featured.category]?.color || 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                        {categoryMap[featured.category]?.label || featured.category}
                      </span>
                      {featured.aiGenerated && (
                        <span className="text-xs text-yellow-500/70 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Generado con IA
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition">
                      {featured.title}
                    </h2>
                    <p className="text-white/55 mb-6 text-lg leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/35 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(featured.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <span className="text-yellow-500 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                        Leer artículo <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid de posts */}
              {grid.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grid.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <div
                        className="rounded-xl p-6 h-full flex flex-col transition-all group-hover:border-yellow-500/30"
                        style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryMap[post.category]?.color || 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                            {categoryMap[post.category]?.label || post.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-white/50 text-sm flex-1 line-clamp-3 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                          {post.aiGenerated && <Sparkles className="w-3.5 h-3.5 text-yellow-500/50" />}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
