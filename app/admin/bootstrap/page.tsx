'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminBootstrapPage() {
  const [bootstrapSecret, setBootstrapSecret] = useState('');
  const [email, setEmail] = useState('admin@migranteglobal.com');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bootstrap-secret': bootstrapSecret,
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Error desconocido.' }));
        setErrorMessage(error);
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('Error de red.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold inline-block mb-2">
            <span className="text-red-600">Migrante</span>
            <span className="text-gold"> Global</span>
          </Link>
          <h2 className="text-2xl font-semibold text-bone">Recuperar acceso admin</h2>
          <p className="text-bone/50 text-sm mt-2">
            Requiere el secreto ADMIN_BOOTSTRAP_SECRET configurado en Vercel.
          </p>
        </div>

        <div className="card">
          {status === 'success' ? (
            <div>
              <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-300 text-sm">
                  Cuenta admin creada/actualizada. Ya puedes iniciar sesión con esa contraseña.
                </p>
              </div>
              <Link href="/admin/login" className="btn-primary w-full block text-center">
                Ir a iniciar sesión
              </Link>
              <p className="text-bone/40 text-xs text-center mt-4">
                Importante: borra ahora la variable ADMIN_BOOTSTRAP_SECRET de Vercel —
                dejarla activa es una puerta de entrada permanente.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-bone/80 mb-2 text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Secreto de arranque
                </label>
                <input
                  type="password"
                  required
                  value={bootstrapSecret}
                  onChange={(e) => setBootstrapSecret(e.target.value)}
                  placeholder="El valor de ADMIN_BOOTSTRAP_SECRET"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-bone/80 mb-2 text-sm">Email de la cuenta admin</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-bone/80 mb-2 text-sm">Nueva contraseña (mínimo 12 caracteres)</label>
                <input
                  type="password"
                  required
                  minLength={12}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                {status === 'loading' ? 'Creando...' : 'Crear / resetear cuenta admin'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-bone/60 hover:text-gold transition text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
