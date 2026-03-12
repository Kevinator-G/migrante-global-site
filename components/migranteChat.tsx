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

  try {
    const lastUserMessage =
      [...messages].reverse().find((msg) => msg.role === "user")?.content ||
      `Interesado en emigrar desde ${leadForm.currentCountry} hacia ${leadForm.targetCountry}`;

    const isEmail = leadForm.contact.includes("@");

    console.log("ENVIANDO LEAD:", {
      nombre: leadForm.name,
      currentCountry: leadForm.currentCountry,
      targetCountry: leadForm.targetCountry,
      contact: leadForm.contact,
    });

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    console.log("RESPUESTA /api/leads:", res.status);

    if (!res.ok) {
      throw new Error("No se pudo guardar el lead");
    }

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
      {
        role: "assistant",
        content:
          "Hubo un problema al guardar tus datos. Inténtalo de nuevo en unos segundos.",
      },
    ]);
  }
}

   return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-red-500/40 bg-red-600 px-5 py-3 text-white shadow-2xl transition hover:bg-red-700"
        >
          Mentor Migrante Global
        </button>
      ) : (
        <div className="w-[390px] rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-white">
                Mentor Migrante Global
              </h3>
              <p className="text-xs text-zinc-400">
                Orientación inicial para migrantes
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="h-80 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] break-words whitespace-pre-wrap rounded-2xl px-3 py-2 ${
                    msg.role === "user"
                      ? "border border-red-500/30 bg-red-600 text-white"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100">
                  Pensando...
                </div>
              </div>
            )}

            {showLeadForm && !leadSent && (
              <form
                onSubmit={handleLeadSubmit}
                className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3"
              >
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500"
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
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500"
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
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500"
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
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Enviar datos
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-zinc-800 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500 disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-red-600 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Pensando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}