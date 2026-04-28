"use client";

import { useState } from "react";

export default function GeneradorDocumentos() {
  const [form, setForm] = useState({
    name: "",
    profession: "",
    salary: "",
    city: "",
    message: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDocument = async () => {
    try {
      setLoading(true);
      setResult("");

      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar documento");
      }

      setResult(data.text || "");
    } catch (error) {
      console.error(error);
      setResult("Hubo un error al generar el documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
        <input
          name="name"
          placeholder="Tu nombre"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 outline-none text-white"
        />

        <input
          name="profession"
          placeholder="Tu profesión"
          value={form.profession}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 outline-none text-white"
        />

        <input
          name="salary"
          placeholder="Tu salario mensual (CHF)"
          value={form.salary}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 outline-none text-white"
        />

        <input
          name="city"
          placeholder="Ciudad (ej. Zúrich)"
          value={form.city}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 outline-none text-white"
        />

        <textarea
          name="message"
          placeholder="Cuéntanos algo adicional sobre ti"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 outline-none text-white"
        />

        <button
          onClick={generateDocument}
          disabled={loading}
          className="rounded-lg bg-white text-black font-semibold px-4 py-3 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar carta"}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Resultado</h2>
          <pre className="whitespace-pre-wrap text-sm font-sans">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}