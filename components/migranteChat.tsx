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

  function isHotLead(message: string) {
  const text = message.toLowerCase();

  const keywords = [
    "quiero emigrar",
    "quiero irme",
    "quiero mudarme",
    "quiero trabajar en",
    "quiero vivir en",
    "necesito ayuda",
    "asesoría",
    "asesoria",
    "mi caso",
    "proceso migratorio",
    "trabajar en suiza",
    "emigrar a suiza",
    "emigrar a alemania",
    "mudarme a suiza",
    "mudarse a suiza",
  ];

  return keywords.some((keyword) => text.includes(keyword));
}

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    const nextCount = userMessageCount + 1;
    setUserMessageCount(nextCount);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "No pude responder en este momento.",
        },
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
        {
          role: "assistant",
          content: "Hubo un problema al conectar con el asistente.",
        },
      ]);
      console.error("Error en el chat:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !leadForm.name.trim() ||
      !leadForm.currentCountry.trim() ||
      !leadForm.targetCountry.trim() ||
      !leadForm.contact.trim()
    ) {
      return;
    }

    // Por ahora solo lo mostramos en el chat.
    // Luego lo conectamos a una API para guardarlo.
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Gracias. Ya tengo tus datos básicos. El siguiente paso ideal es que te orientemos con más detalle según tu perfil.",
      },
    ]);

    setLeadSent(true);
    setShowLeadForm(false);

    console.log("Lead capturado:", leadForm);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-green-600 px-5 py-3 text-white shadow-lg"
        >
          Mentor Migrante Global
        </button>
      ) : (
        <div className="w-[390px] rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                Mentor Migrante Global
              </h3>
              <p className="text-xs text-gray-500">
                Orientación inicial para migrantes
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 text-sm space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 break-words whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-green-50 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl bg-green-50 px-3 py-2 text-gray-900">
                  Pensando...
                </div>
              </div>
            )}

            {showLeadForm && !leadSent && (
              <form
                onSubmit={handleLeadSubmit}
                className="rounded-xl border p-3 space-y-2 bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
                />

                <input
                  type="text"
                  placeholder="País actual"
                  value={leadForm.currentCountry}
                  onChange={(e) =>
                    setLeadForm((prev) => ({
                      ...prev,
                      currentCountry: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
                />

                <input
                  type="text"
                  placeholder="País al que quieres emigrar"
                  value={leadForm.targetCountry}
                  onChange={(e) =>
                    setLeadForm((prev) => ({
                      ...prev,
                      targetCountry: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
                />

                <input
                  type="text"
                  placeholder="Email o WhatsApp"
                  value={leadForm.contact}
                  onChange={(e) =>
                    setLeadForm((prev) => ({
                      ...prev,
                      contact: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-black py-2 text-sm text-white"
                >
                  Enviar datos
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="w-full rounded-xl border px-3 py-2 text-sm text-gray-900 outline-none disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-green-600 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Pensando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}