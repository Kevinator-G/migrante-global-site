"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type LeadForm = {
  name: string;
  currentCountry: string;
  targetCountry: string;
  contact: string;
};

export default function MigranteChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy Mentor Migrante Global. ¿Estás pensando emigrar o ya vives en otro país?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: "",
    currentCountry: "",
    targetCountry: "",
    contact: "",
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showLeadForm]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    const nextCount = userMessageCount + 1;
    setUserMessageCount(nextCount);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "No pude responder en este momento." },
      ]);

      if (nextCount >= 3 && !leadSent) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Si quieres, puedo orientarte mejor con 4 datos rápidos. Así podremos ayudarte de forma más precisa.",
            },
          ]);
          setShowLeadForm(true);
        }, 500);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un problema al conectar con el asistente." },
      ]);
      console.error("Error en el chat:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.currentCountry.trim() || !leadForm.targetCountry.trim() || !leadForm.contact.trim()) return;

    try {
      const lastUserMessage =
        [...messages].reverse().find((msg) => msg.role === "user")?.content ||
        `Interesado en emigrar desde ${leadForm.currentCountry} hacia ${leadForm.targetCountry}`;

      const isEmail = leadForm.contact.includes("@");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: leadForm.name,
          email: isEmail
            ? leadForm.contact
            : `${leadForm.name.trim().toLowerCase().replace(/\s+/g, ".")}@sin-email.com`,
          telefono: isEmail ? "" : leadForm.contact,
          pais: leadForm.currentCountry,
          mensaje: `${lastUserMessage}\nDestino deseado: ${leadForm.targetCountry}`,
          consentimiento: true,
        }),
      });

      if (!res.ok) throw new Error("No se pudo guardar el lead");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Gracias. Ya tengo tus datos básicos. Desde Migrante Global podremos orientarte de forma más precisa según tu caso. Si quieres avanzar más rápido, también puedes escribirnos directamente por WhatsApp.",
        },
      ]);
      setLeadSent(true);
      setShowLeadForm(false);
    } catch (error) {
      console.error("Error al enviar lead:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un problema al guardar tus datos. Inténtalo de nuevo en unos segundos." },
      ]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón de apertura */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-trigger rounded-full px-5 py-3 text-white shadow-2xl transition-all hover:scale-105"
        >
          💬 Mentor Migrante Global
        </button>
      ) : (
        <div className="chat-widget w-[360px] rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="chat-header flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="chat-avatar w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                MG
              </div>
              <div>
                <h3 className="chat-title font-semibold text-sm">Mentor Migrante Global</h3>
                <p className="chat-subtitle text-xs">Orientación inicial · En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close w-7 h-7 rounded-full flex items-center justify-center text-sm transition hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div className="chat-messages h-72 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] break-words whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "chat-bubble-user text-white"
                      : "chat-bubble-assistant"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-assistant rounded-2xl px-3 py-2 text-sm flex gap-1 items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {showLeadForm && !leadSent && (
              <form
                onSubmit={handleLeadSubmit}
                className="chat-lead-form space-y-2 rounded-xl p-3"
              >
                <p className="chat-lead-label text-xs font-semibold mb-2">📋 4 datos rápidos</p>
                {[
                  { placeholder: "Tu nombre", key: "name", value: leadForm.name },
                  { placeholder: "País actual", key: "currentCountry", value: leadForm.currentCountry },
                  { placeholder: "País al que quieres emigrar", key: "targetCountry", value: leadForm.targetCountry },
                  { placeholder: "Email o WhatsApp", key: "contact", value: leadForm.contact },
                ].map(({ placeholder, key, value }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="chat-lead-input w-full rounded-lg px-3 py-2 text-sm outline-none"
                  />
                ))}
                <button
                  type="submit"
                  className="w-full rounded-lg py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: '#dc2626' }}
                >
                  Enviar datos →
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer / Input */}
          <div className="chat-footer p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="chat-input flex-1 rounded-xl px-3 py-2 text-sm outline-none disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="chat-send-btn rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "···" : "↑"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
