'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('La confirmación no coincide con la nueva contraseña.');
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Error al cambiar la contraseña.' }));
        setErrorMessage(error);
        setSubmitStatus('error');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSubmitStatus('success');
    } catch {
      setErrorMessage('Error de red al cambiar la contraseña.');
      setSubmitStatus('error');
    }
  };

  if (status !== 'authenticated' || session?.user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-dark border-b border-gray">
        <div className="max-w-[700px] mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-bone/60 hover:text-gold transition flex items-center gap-1.5 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>
          <span className="text-bone/40">|</span>
          <h1 className="text-xl font-semibold text-bone">Configuración</h1>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto px-6 py-10">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gold/15">
              <KeyRound className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-bone">Cambiar contraseña</h2>
              <p className="text-bone/50 text-sm">{session.user?.email}</p>
            </div>
          </div>

          {submitStatus === 'success' ? (
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">Contraseña actualizada correctamente.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-bone/80 mb-2 text-sm">Contraseña actual</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-bone/80 mb-2 text-sm">Contraseña nueva (mínimo 12 caracteres)</label>
                <input
                  type="password"
                  required
                  minLength={12}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-bone/80 mb-2 text-sm">Confirmar contraseña nueva</label>
                <input
                  type="password"
                  required
                  minLength={12}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              {submitStatus === 'error' && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="btn-primary w-full"
              >
                {submitStatus === 'loading' ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
