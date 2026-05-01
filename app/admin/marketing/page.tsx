'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Instagram, Youtube, CheckCircle2, Clock, XCircle,
  SkipForward, RefreshCw, Copy, ExternalLink, ChevronDown, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const GOLD = '#c9a96e';
const BG = '#0d1117';

interface SocialPost {
  id: string;
  platform: string;
  status: string;
  caption: string | null;
  script: string | null;
  hashtags: string[];
  platformUrl: string | null;
  error: string | null;
  publishedAt: string | null;
  createdAt: string;
  blogPost: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    category: string;
  };
}

interface Stats {
  instagram: { published: number; failed: number; skipped: number };
  tiktok: { pending: number };
  youtube: { pending: number };
  total: number;
}

const PLATFORM_CONFIG = {
  instagram: {
    label: 'Instagram',
    color: 'rgb(225,48,108)',
    bg: 'rgba(225,48,108,0.08)',
    border: 'rgba(225,48,108,0.25)',
    icon: Instagram,
  },
  tiktok: {
    label: 'TikTok',
    color: 'rgba(255,255,255,0.85)',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.12)',
    icon: () => (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
      </svg>
    ),
  },
  youtube: {
    label: 'YouTube',
    color: 'rgb(220,38,38)',
    bg: 'rgba(220,38,38,0.08)',
    border: 'rgba(220,38,38,0.25)',
    icon: Youtube,
  },
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
  published: { label: 'Publicado', icon: CheckCircle2, color: 'rgb(52,211,153)' },
  pending_script: { label: 'Script listo', icon: Clock, color: GOLD },
  failed: { label: 'Error', icon: XCircle, color: 'rgb(239,68,68)' },
  skipped: { label: 'Omitido', icon: SkipForward, color: 'rgba(255,255,255,0.35)' },
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function ScriptCard({ post }: { post: SocialPost }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = post.script ?? post.caption ?? '';
  const cfg = PLATFORM_CONFIG[post.platform as keyof typeof PLATFORM_CONFIG];
  const Icon = cfg?.icon ?? (() => null);

  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: cfg?.bg ?? 'rgba(255,255,255,0.04)', border: `1px solid ${cfg?.border ?? 'rgba(255,255,255,0.08)'}` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div style={{ color: cfg?.color }}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-white text-sm font-medium truncate">{post.blogPost.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}>
            Script listo
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <pre className="text-white/65 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-black/30 rounded-lg p-3 max-h-64 overflow-y-auto">
            {text}
          </pre>
          {post.hashtags.length > 0 && (
            <p className="text-[11px]" style={{ color: GOLD }}>
              {post.hashtags.map((h) => `#${h}`).join(' ')}
            </p>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: copied ? 'rgb(52,211,153)' : 'rgba(255,255,255,0.65)' }}
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? '¡Copiado!' : 'Copiar script'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MarketingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [distributing, setDistributing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'tiktok' | 'youtube'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/social-posts');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPosts(data.posts ?? []);
      setStats(data.stats ?? null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const triggerDistribute = async () => {
    setDistributing(true);
    try {
      const res = await fetch('/api/admin/social-posts/distribute', { method: 'POST' });
      const data = await res.json();
      if (data.success) await load();
    } finally {
      setDistributing(false);
    }
  };

  const filtered = activeTab === 'all' ? posts : posts.filter((p) => p.platform === activeTab);
  const published = filtered.filter((p) => p.status === 'published');
  const pending = filtered.filter((p) => p.status === 'pending_script');
  const failed = filtered.filter((p) => p.status === 'failed');

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-white/40 text-sm hover:text-white/70 transition-colors mb-1 block">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Marketing Automático</h1>
            <p className="text-white/45 text-sm mt-1">Posts y scripts generados por IA para cada red social</p>
          </div>
          <button
            onClick={triggerDistribute}
            disabled={distributing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: GOLD, color: '#111318' }}
          >
            {distributing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Distribuir último post
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Instagram publicados', value: stats.instagram.published, color: 'rgb(225,48,108)' },
              { label: 'TikTok pendientes', value: stats.tiktok.pending, color: GOLD },
              { label: 'YouTube pendientes', value: stats.youtube.pending, color: 'rgb(220,38,38)' },
              { label: 'Total generados', value: stats.total, color: 'rgba(255,255,255,0.6)' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/40 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['all', 'instagram', 'tiktok', 'youtube'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab
                ? { background: GOLD, color: '#111318' }
                : { color: 'rgba(255,255,255,0.5)' }}
            >
              {tab === 'all' ? 'Todos' : PLATFORM_CONFIG[tab]?.label}
            </button>
          ))}
        </div>

        {/* Published */}
        {published.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Publicados</h2>
            <div className="space-y-2">
              {published.map((p) => {
                const cfg = PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
                const Icon = cfg?.icon ?? (() => null);
                return (
                  <div key={p.id} className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.15)' }}>
                    <div style={{ color: cfg?.color }}><Icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.blogPost.title}</p>
                      <p className="text-white/35 text-xs mt-0.5">{p.blogPost.category} · {new Date(p.publishedAt!).toLocaleDateString('es-ES')}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'rgb(52,211,153)' }} />
                    {p.platformUrl && (
                      <a href={p.platformUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 text-white/30 hover:text-white/70 transition-colors" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Pending scripts */}
        {pending.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Scripts listos para grabar</h2>
            <div className="space-y-2">
              {pending.map((p) => <ScriptCard key={p.id} post={p} />)}
            </div>
          </section>
        )}

        {/* Failed */}
        {failed.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Fallidos</h2>
            <div className="space-y-2">
              {failed.map((p) => {
                const cfg = PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
                const Icon = cfg?.icon ?? (() => null);
                return (
                  <div key={p.id} className="flex items-start gap-4 rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div style={{ color: cfg?.color }}><Icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.blogPost.title}</p>
                      <p className="text-red-400/70 text-xs mt-0.5">{p.error}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-white/30">
            <p className="text-lg">Sin posts distribuidos aún.</p>
            <p className="text-sm mt-1">Pulsa "Distribuir último post" para empezar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
