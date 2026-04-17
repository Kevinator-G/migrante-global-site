"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  CheckCircle,
  Package,
  MessageCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Receipt,
} from "lucide-react";

type PurchasedItem = {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  emoji: string;
};

type OrderData = {
  email: string;
  name: string | null;
  items: PurchasedItem[];
  total: number;
  currency: string;
  createdAt: string;
  autoCreated: boolean;
};

const WHATSAPP_NUMBER = "41791234567"; // ← cambia por tu número real

function DashboardContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isSuccess = searchParams.get("success") === "1";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 6; // retry for ~30s (webhook may take a moment)

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/order?session_id=${sessionId}`);

        if (res.status === 404 && attempts < MAX_ATTEMPTS) {
          // Webhook not processed yet — retry after 5s
          attempts++;
          setTimeout(fetchOrder, 5000);
          return;
        }

        if (!res.ok) throw new Error("No se pudo cargar el pedido");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("No pudimos cargar los detalles de tu pedido. Por favor contáctanos por WhatsApp.");
      } finally {
        if (attempts === 0 || attempts >= MAX_ATTEMPTS) {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [sessionId]);

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen pt-20 pb-16"
        style={{ background: "var(--black)", color: "var(--bone)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          {/* Back link */}
          <div className="flex items-center gap-2 mb-8 pt-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--light-gray)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>

          {/* ── Success banner ── */}
          {isSuccess && (
            <div
              className="flex items-start gap-4 rounded-2xl p-5 mb-8"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }} />
              <div>
                <p className="font-bold text-base" style={{ color: "#22c55e" }}>
                  ¡Pago completado con éxito!
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--light-gray)" }}>
                  Tu pedido ha sido registrado. Un asesor de Migrante Global se
                  pondrá en contacto contigo en las próximas horas para activar
                  tu servicio.
                </p>
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-20">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#c9a96e" }} />
              <span style={{ color: "var(--light-gray)" }}>
                Cargando tu pedido...
              </span>
            </div>
          )}

          {/* ── Error ── */}
          {error && !loading && (
            <div
              className="flex items-start gap-4 rounded-2xl p-5 mb-8"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" />
              <p className="text-sm" style={{ color: "var(--light-gray)" }}>{error}</p>
            </div>
          )}

          {/* ── Order details ── */}
          {order && !loading && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  Tu pedido
                </h1>
                <p className="text-sm" style={{ color: "var(--light-gray)" }}>
                  {order.email}
                </p>
              </div>

              {/* Services card */}
              <div
                className="rounded-2xl p-6 mb-5"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid rgba(128,128,128,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e" }}
                  >
                    <Package className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold">Servicios contratados</h2>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl p-4"
                      style={{
                        background: "var(--surface-card-elevated)",
                        border: "1px solid rgba(128,128,128,0.12)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="font-semibold text-sm">{item.nombre}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--light-gray)" }}>
                            {item.tipo}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-sm" style={{ color: "#c9a96e" }}>
                        {item.precio.toLocaleString("es-CH")} CHF
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between pt-4 mt-4"
                  style={{ borderTop: "1px solid rgba(128,128,128,0.12)" }}
                >
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--light-gray)" }}>
                    <Receipt className="w-4 h-4" />
                    Total pagado
                  </div>
                  <span className="text-xl font-bold">
                    {order.total.toLocaleString("es-CH")} {order.currency}
                  </span>
                </div>
              </div>

              {/* Date / info card */}
              <div
                className="rounded-2xl p-5 mb-5 flex items-center gap-3 text-sm"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid rgba(128,128,128,0.15)",
                  color: "var(--light-gray)",
                }}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  Pedido registrado el{" "}
                  {new Date(order.createdAt).toLocaleDateString("es-CH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Account created notice */}
              {order.autoCreated && (
                <div
                  className="rounded-2xl p-5 mb-5 text-sm"
                  style={{
                    background: "rgba(201,169,110,0.08)",
                    border: "1px solid rgba(201,169,110,0.25)",
                    color: "#c9a96e",
                  }}
                >
                  <strong>Cuenta creada automáticamente</strong>
                  <p className="mt-1 font-normal" style={{ color: "var(--light-gray)" }}>
                    Hemos creado una cuenta con tu email{" "}
                    <strong style={{ color: "var(--bone)" }}>{order.email}</strong>.
                    Pronto recibirás instrucciones para establecer tu contraseña
                    y acceder a tu panel de cliente.
                  </p>
                </div>
              )}

              {/* WhatsApp CTA */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid rgba(128,128,128,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-5 h-5" style={{ color: "#22c55e" }} />
                  <h3 className="font-semibold">¿Necesitas ayuda?</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: "var(--light-gray)" }}>
                  Escríbenos directamente por WhatsApp y un asesor te atenderá
                  en breve.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20acabo%20de%20contratar%20un%20servicio%20en%20Migrante%20Global%20(${sessionId})%20y%20quiero%20más%20información.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "#16a34a" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contactar por WhatsApp
                </a>
              </div>
            </>
          )}

          {/* ── No session ── */}
          {!sessionId && !loading && (
            <div className="text-center py-20">
              <div
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
                style={{ background: "var(--surface-card)" }}
              >
                <Package className="w-8 h-8" style={{ color: "var(--light-gray)" }} />
              </div>
              <h1 className="text-2xl font-bold mb-2">Tu panel</h1>
              <p className="text-sm mb-6" style={{ color: "var(--light-gray)" }}>
                Aquí verás tus servicios una vez hayas realizado un pago.
              </p>
              <Link
                href="/#planes"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)" }}
              >
                Ver planes
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
