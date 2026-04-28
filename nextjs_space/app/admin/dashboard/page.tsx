'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Download,
  Trash2,
  LogOut,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Loader,
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

export default function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchLeads();
    }
  }, [status, session]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data?.leads ?? []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLeads(leads.filter((lead) => lead.id !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return null;
  }

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

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-gold/20 to-dark">
            <h3 className="text-lg font-semibold mb-2 text-bone/80">Total de Leads</h3>
            <p className="text-4xl font-bold text-gold">{leads?.length ?? 0}</p>
          </div>
          <div className="card">
            <button
              onClick={handleExport}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar a CSV
            </button>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Contactos Recibidos</h2>
          {leads?.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="w-16 h-16 text-bone/30 mx-auto mb-4" />
              <p className="text-bone/50">No hay leads registrados aún</p>
            </div>
          ) : (
            leads?.map((lead) => (
              <div key={lead.id} className="card hover:border-gold/30 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-bone">{lead.nombre}</h3>
                    <p className="text-bone/50 text-sm">
                      {new Date(lead.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    disabled={deletingId === lead.id}
                    className="text-red-600 hover:text-red-400 transition p-2"
                  >
                    {deletingId === lead.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 text-bone/70 text-sm">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                    <a href={`mailto:${lead.email}`} className="hover:text-gold transition">
                      {lead.email}
                    </a>
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
            )) ?? []
          )}
        </div>
      </div>
    </div>
  );
}
