'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { UploadCloud, Trash2, Film, ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const GOLD = '#c9a96e';
const BG = '#0d1117';

const CATEGORIAS = [
  'General',
  'Visas y permisos',
  'Mercado laboral',
  'Homologación de títulos',
  'Bienestar y salud',
  'Educación y familia',
  'Finanzas y vivienda',
  'Noticias Suiza',
  'Cultura y adaptación',
  'Emprendimiento',
  'Impuestos',
];

interface Asset {
  id: string;
  url: string;
  type: 'foto' | 'video';
  category: string | null;
  filename: string;
  timesUsed: number;
  createdAt: string;
}

export default function MediaPage() {
  const { status } = useSession();
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categoria, setCategoria] = useState('General');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const cargar = useCallback(async () => {
    const res = await fetch('/api/admin/media');
    if (res.ok) {
      const { assets } = await res.json();
      setAssets(assets);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
    if (status === 'authenticated') cargar();
  }, [status, router, cargar]);

  const subir = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSubiendo(true);
    setError('');

    const cat = categoria === 'General' ? '' : categoria;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgreso(`Subiendo ${i + 1}/${files.length}: ${file.name}`);
      try {
        // Subida directa a Vercel Blob (sin pasar por la función → sin límite de 4.5 MB)
        const blob = await upload(`media/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/media',
        });
        // Registrar en la biblioteca
        await fetch('/api/admin/media', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: blob.url,
            filename: file.name,
            contentType: file.type,
            category: cat,
          }),
        });
      } catch (e) {
        setError(`Error con ${file.name}: ${e instanceof Error ? e.message : 'desconocido'}`);
      }
    }

    setSubiendo(false);
    setProgreso('');
    if (fileRef.current) fileRef.current.value = '';
    cargar();
  };

  const borrar = async (id: string) => {
    if (!confirm('¿Borrar este archivo de la biblioteca?')) return;
    await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-yellow-500 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al panel
        </Link>

        <h1 className="text-2xl font-bold text-white mb-1">Biblioteca de medios</h1>
        <p className="text-white/50 text-sm mb-8 max-w-2xl">
          Tus fotos y clips se usan automáticamente en el blog y en los videos de redes —
          siempre antes que las fotos de stock. Los clips de video entran en la escena de gancho del reel.
        </p>

        {/* Subida */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: '#13151b', border: `1px solid rgba(201,169,110,0.25)` }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Categoría del material
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white"
                style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="text-white/30 text-xs mt-1.5">
                «General» sirve para cualquier artículo. Fotos: JPG/PNG/WebP · Videos: MP4/MOV (máx. 500 MB)
              </p>
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime,video/webm"
                onChange={(e) => subir(e.target.files)}
                className="hidden"
                id="media-upload"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={subiendo}
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-xl transition disabled:opacity-50"
                style={{ background: GOLD, color: '#111318' }}
              >
                {subiendo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {subiendo ? 'Subiendo…' : 'Subir archivos'}
              </button>
            </div>
          </div>
          {progreso && <p className="text-white/50 text-xs mt-3">{progreso}</p>}
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        </div>

        {/* Grid */}
        {assets.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-16">
            La biblioteca está vacía — sube tu primer lote de fotos o clips.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((a) => (
              <div
                key={a.id}
                className="rounded-xl overflow-hidden group relative"
                style={{ background: '#13151b', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="relative h-36 bg-black">
                  {a.type === 'video' ? (
                    <video src={a.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.url} alt={a.filename} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  <span
                    className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: a.type === 'video' ? 'rgba(220,38,38,0.85)' : 'rgba(0,0,0,0.6)' }}
                  >
                    {a.type === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {a.type}
                  </span>
                  <button
                    onClick={() => borrar(a.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Borrar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-white/70 text-xs truncate" title={a.filename}>{a.filename}</p>
                  <p className="text-white/30 text-[11px] mt-0.5">
                    {a.category ?? 'General'} · usada {a.timesUsed} {a.timesUsed === 1 ? 'vez' : 'veces'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
