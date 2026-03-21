"use client";

import { useState } from "react";
import { FilePenLine, ShieldCheck, Sparkles } from "lucide-react";
import jsPDF from "jspdf";

export default function GeneradorDocumentosPage() {
const [form, setForm] = useState({
  documentType: "vivienda",
  name: "",
  currentAddress: "",
  currentPostalCity: "",
  email: "",
  phone: "",
  date: "",
  profession: "",
  salary: "",
  contractType: "",
  company: "",
  city: "",
  recipientName: "",
  recipientAddress: "",
  recipientPostalCity: "",
  maritalStatus: "",
  householdSize: "",
  smoker: "",
  pets: "",
  message: "",
});

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(result, maxWidth);

    let y = 50;

    lines.forEach((line: string) => {
      if (y > 780) {
        doc.addPage();
        y = 50;
      }
      doc.text(line, margin, y);
      y += 18;
    });

    doc.save(`documento-${form.documentType}.pdf`);
  };

  return (
    <main className="min-h-screen bg-[#07111F] text-[#F8FAFC] px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#D4A84F]">
            <Sparkles className="h-4 w-4" />
            Herramienta premium con IA
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
            Generador de <span className="text-[#D4A84F]">Documentos</span>
          </h1>

          <p className="mt-4 max-w-2xl text-[#B8C2D1] text-lg leading-relaxed">
            Crea documentos profesionales para vivienda, empleo, trámites y más,
            adaptados a tu perfil.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <section className="rounded-3xl border border-white/10 bg-[#0D1728] shadow-[0_10px_30px_rgba(0,0,0,0.28)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4A84F]/15 text-[#D4A84F]">
                <FilePenLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Completa tu información</h2>
                <p className="text-sm text-[#B8C2D1]">
                  Cuanto más preciso seas, mejor saldrá el documento.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Tipo de documento
                </label>
                <select
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#111D31] border border-white/10 px-4 py-3 text-white focus:border-[#2F6FED] outline-none"
                >
                  <option value="vivienda">Carta para vivienda</option>
                  <option value="trabajo">Carta de presentación laboral</option>
                  <option value="cv">Currículum formato suizo</option>
                  <option value="tramites">Carta para trámites</option>
                  <option value="personal">Carta personal / motivación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Nombre completo
                </label>
                <input
                  name="name"
                  placeholder="Ej. Kevin García"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#111D31] border border-white/10 px-4 py-3 outline-none text-white placeholder:text-[#7E8AA0] focus:border-[#2F6FED] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Profesión
                </label>
                <input
                  name="profession"
                  placeholder="Ej. Ingeniero electrónico"
                  value={form.profession}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#111D31] border border-white/10 px-4 py-3 outline-none text-white placeholder:text-[#7E8AA0] focus:border-[#2F6FED] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Salario mensual (CHF)
                </label>
                <input
                  name="salary"
                  placeholder="Ej. 5000"
                  value={form.salary}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#111D31] border border-white/10 px-4 py-3 outline-none text-white placeholder:text-[#7E8AA0] focus:border-[#2F6FED] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Ciudad o zona
                </label>
                <input
                  name="city"
                  placeholder="Ej. Uster"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#111D31] border border-white/10 px-4 py-3 outline-none text-white placeholder:text-[#7E8AA0] focus:border-[#2F6FED] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Información adicional
                </label>
                <textarea
                  name="message"
                  placeholder="Ej. Estoy casado, no fumo, somos una familia tranquila y responsable..."
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl bg-[#111D31] border border-white/10 px-4 py-3 outline-none text-white placeholder:text-[#7E8AA0] focus:border-[#2F6FED] transition resize-none"
                />
              </div>

              <button
                onClick={generateDocument}
                disabled={loading}
                className="mt-2 rounded-xl bg-[#D92D20] text-white font-semibold px-5 py-3.5 hover:bg-[#b42318] transition disabled:opacity-50 shadow-lg"
              >
                {loading ? "Generando..." : "Generar documento"}
              </button>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-[#0D1728] shadow-[0_10px_30px_rgba(0,0,0,0.28)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F6FED]/15 text-[#2F6FED]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Qué obtienes</h2>
                <p className="text-sm text-[#B8C2D1]">
                  Un borrador profesional listo para adaptar.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#B8C2D1]">
              <div className="rounded-2xl border border-white/10 bg-[#111D31] p-4">
                Documentos para vivienda, empleo, trámites y cartas personales.
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#111D31] p-4">
                Texto estructurado para que puedas copiar, editar o enviar.
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#111D31] p-4">
                Base perfecta para futuras versiones premium con más campos y exportación.
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/10 p-4">
              <p className="text-sm text-[#F3E7C2]">
                Consejo: añade datos reales y concretos. Cuanto mejor describas tu
                perfil, más sólido y útil será el documento.
              </p>
            </div>
          </aside>
        </div>

        {result && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-[#0D1728] shadow-[0_10px_30px_rgba(0,0,0,0.28)] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
              <div>
                <h2 className="text-2xl font-semibold">Resultado</h2>
                <p className="text-sm text-[#B8C2D1]">
                  Revisa el borrador y ajusta los datos que quieras personalizar.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="rounded-xl border border-white/10 bg-white/5 text-white px-4 py-2 font-medium hover:bg-white/10 transition"
                >
                  Copiar
                </button>

                <button
                  onClick={downloadPDF}
                  className="rounded-xl bg-[#D4A84F] text-[#07111F] px-4 py-2 font-semibold hover:opacity-90 transition"
                >
                  Descargar PDF
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111D31] p-5">
              <pre className="whitespace-pre-wrap text-sm text-[#E8EDF5] font-sans leading-7">
                {result}
              </pre>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}