'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Download, Trash2, LogOut, Mail, Phone, MapPin,
  MessageSquare, Loader, FileText, Eye, EyeOff,
  Sparkles, CheckCircle, XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  pais: string | null;
  mensaje: string;
  consentimiento: boolean;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  published: boolean;
  aiGenerated: boolean;
  sourceTitle: string | null;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  noticias: 'Noticias', trabajo: 'Trabajo', vivienda: 'Vivienda',
  tramites: 'Trámites', 'vida-en-suiza': 'Vida en Suiza',
  finanzas: 'Finanzas', 'alemán': 'Alemán',
};

export default function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'blog'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchLeads();
      fetchPosts();
    }
  }, [status, session]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) setLeads((await res.json())?.leads ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) setPosts((await res.json())?.posts ?? []);
    } catch {}
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('¿Eliminar este lead?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
    if (res.ok) setLeads(leads.filter(l => l.id !== id));
    setDeletingId(null);
  };

  const handleTogglePost = async (id: string, published: boolean) => {
    setTogglingId(id);
    const res = await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !published }),
    });
    if (res.ok) setPosts(posts.map(p => p.id === id ? { ...p, published: !published } : p));
    setTogglingId(null);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('¿Eliminar este post?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    if (res.ok) setPosts(posts.filter(p => p.id !== id));
    setDeletingId(null);
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch {}
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') return null;

  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts = posts.filter(p => !p.published).length;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-dark border-b border-gray">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-red-600">Migrante</span>
              <span className="text-gold"> Global</span>
            </Link>
            <span className="text-bone/40">|</span>
            <h1 className="text-xl font-semibold text-bone">Panel de Administración</h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-bone/70 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-gold/20 to-dark">
            <h3 className="text-sm font-semibold mb-1 text-bone/60">Total Leads</h3>
            <p className="text-3xl font-bold text-gold">{leads.length}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold mb-1 text-bone/60">Posts Publicados</h3>
            <p className="text-3xl font-bold text-green-400">{publishedPosts}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold mb-1 text-bone/60">Borradores</h3>
            <p className="text-3xl font-bold text-yellow-400">{draftPosts}</p>
          </div>
          <div className="card">
            <button onClick={handleExport} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'leads' ? 'bg-gold text-black' : 'bg-white/5 text-bone/60 hover:text-bone'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'blog' ? 'bg-gold text-black' : 'bg-white/5 text-bone/60 hover:text-bone'
            }`}
          >
            <FileText className="w-4 h-4" /> Blog ({posts.length})
            {draftPosts > 0 && (
              <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {draftPosts}
              </span>
            )}
          </button>
        </div>

        {/* Leads tab */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="card text-center py-12">
                <MessageSquare className="w-16 h-16 text-bone/30 mx-auto mb-4" />
                <p className="text-bone/50">No hay leads registrados aún</p>
              </div>
            ) : (
              leads.map(lead => (
                <div key={lead.id} className="card hover:border-gold/30 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-bone">{lead.nombre}</h3>
                      <p className="text-bone/50 text-sm">{new Date(lead.createdAt).toLocaleString('es-ES')}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={deletingId === lead.id}
                      className="text-red-600 hover:text-red-400 transition p-2"
                    >
                      {deletingId === lead.id ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-bone/70 text-sm">
                      <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                      <a href={`mailto:${lead.email}`} className="hover:text-gold transition">{lead.email}</a>
                    </div>
                    {lead.telefono && (
                      <div className="flex items-center gap-3 text-bone/70 text-sm">
                        <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{lead.telefono}</span>
                      </div>
                    )}
                    {lead.pais && (
                      <div className="flex items-center gap-3 text-bone/70 text-sm">
                        <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{lead.pais}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray/50 p-4 rounded-lg">
                    <p className="text-bone/80 text-sm whitespace-pre-wrap">{lead.mensaje}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Blog tab */}
        {activeTab === 'blog' && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="card text-center py-12">
                <Sparkles className="w-12 h-12 text-bone/30 mx-auto mb-4" />
                <p className="text-bone/50 mb-2">No hay posts aún</p>
                <p className="text-bone/30 text-sm">El agente IA generará el primer post mañana a las 8:00</p>
              </div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  className={`card transition flex items-start gap-4 ${
                    post.published ? 'border-green-500/20' : 'border-yellow-500/20'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {post.published ? (
                        <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Publicado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Borrador
                        </span>
                      )}
                      <span className="text-xs text-bone/30 bg-white/5 px-2 py-0.5 rounded-full">
                        {categoryLabels[post.category] || post.category}
                      </span>
                      {post.aiGenerated && (
                        <span className="text-xs text-yellow-500/60 flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" /> IA
                        </span>
                      )}
                    </div>
                    <h3 className="text-bone font-semibold text-sm mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-bone/40 text-xs line-clamp-2">{post.excerpt}</p>
                    <p className="text-bone/25 text-xs mt-1">
                      {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-bone/40 hover:text-gold transition"
                        title="Ver post"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleTogglePost(post.id, post.published)}
                      disabled={togglingId === post.id}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                        post.published
                          ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                      title={post.published ? 'Despublicar' : 'Publicar'}
                    >
                      {togglingId === post.id ? (
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                      ) : post.published ? (
                        <><EyeOff className="w-3.5 h-3.5" /> Ocultar</>
                      ) : (
                        <><Eye className="w-3.5 h-3.5" /> Publicar</>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingId === post.id}
                      className="p-2 text-red-600/60 hover:text-red-400 transition"
                    >
                      {deletingId === post.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
