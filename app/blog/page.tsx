import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
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

const categoryColors: Record<string, string> = {
  'Visas y permisos':      'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Mercado laboral':       'bg-green-500/20 text-green-300 border-green-500/30',
  'Finanzas y vivienda':   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Homologación de títulos':'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Bienestar y salud':     'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Educación y familia':   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Noticias Suiza':        'bg-red-500/20 text-red-300 border-red-500/30',
  'Cultura y adaptación':  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Emprendimiento':        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Impuestos':             'bg-slate-500/20 text-slate-300 border-slate-500/30',
  // legacy slugs
  noticias:                'bg-blue-500/20 text-blue-300 border-blue-500/30',
  trabajo:                 'bg-green-500/20 text-green-300 border-green-500/30',
  vivienda:                'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function categoryColor(cat: string) {
  return categoryColors[cat] ?? 'bg-white/10 text-white/60 border-white/10';
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
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
  });

  const featured = posts[0];
  const rest = posts.slice(1);

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

        <div className="max-w-[1200px] mx-auto px-6 pb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-yellow-500/40 mx-auto mb-4" />
              <p className="text-white/40 text-lg">El primer artículo se publicará mañana a las 8:00.</p>
            </div>
          ) : (
            <>
              {/* ── Post destacado ── */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
                  <div
                    className="rounded-2xl overflow-hidden transition-all group-hover:border-yellow-500/40"
                    style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {/* Imagen destacada */}
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
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <div
                        className="rounded-xl overflow-hidden h-full flex flex-col transition-all group-hover:border-yellow-500/30"
                        style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {/* Imagen de tarjeta */}
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
                          /* Placeholder cuando no hay imagen */
                          <div
                            className="w-full h-44 flex-shrink-0 flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)' }}
                          >
                            <span className="text-4xl opacity-20">🇨🇭</span>
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
                            {post.aiGenerated && <Sparkles className="w-3.5 h-3.5 text-yellow-500/50" />}
                          </div>
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
