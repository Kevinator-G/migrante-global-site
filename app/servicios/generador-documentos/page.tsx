"use client";

import { useState } from "react";
import { FilePenLine, ShieldCheck, Sparkles, ArrowLeft, Copy, Download, CheckCircle } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import { Navbar } from "@/components/navbar";

// Campos visibles por tipo de documento
const CAMPOS_POR_TIPO: Record<string, string[]> = {
  vivienda:  ["name","email","phone","currentAddress","currentPostalCity","recipientName","recipientAddress","recipientPostalCity","profession","salary","contractType","company","maritalStatus","householdSize","smoker","pets","city","message"],
  trabajo:   ["name","email","phone","currentAddress","currentPostalCity","recipientName","recipientAddress","recipientPostalCity","profession","salary","contractType","company","city","message"],
  cv:        ["name","email","phone","currentAddress","currentPostalCity","profession","salary","contractType","company","maritalStatus","city","message"],
  tramites:  ["name","email","phone","currentAddress","currentPostalCity","recipientName","recipientAddress","recipientPostalCity","profession","salary","company","maritalStatus","householdSize","city","message"],
  personal:  ["name","email","phone","currentAddress","currentPostalCity","recipientName","profession","company","salary","maritalStatus","householdSize","city","message"],
};

const LABELS: Record<string, { label: string; placeholder: string; type?: string }> = {
  name:               { label: "Nombre completo *", placeholder: "Ej. Kevin García" },
  email:              { label: "Email", placeholder: "kevin@email.com", type: "email" },
  phone:              { label: "Teléfono", placeholder: "+41 79 123 45 67" },
  currentAddress:     { label: "Tu dirección actual (calle y número)", placeholder: "Ej. Bahnhofstrasse 12" },
  currentPostalCity:  { label: "CP y ciudad actual", placeholder: "Ej. 8001 Zürich" },
  recipientName:      { label: "Destinatario (nombre o empresa)", placeholder: "Ej. Immobilien AG / Gemeinde Uster" },
  recipientAddress:   { label: "Dirección del destinatario", placeholder: "Ej. Musterstrasse 5" },
  recipientPostalCity:{ label: "CP y ciudad del destinatario", placeholder: "Ej. 8610 Uster" },
  profession:         { label: "Profesión *", placeholder: "Ej. Ingeniero electrónico" },
  salary:             { label: "Salario mensual neto (CHF) *", placeholder: "Ej. 5500", type: "number" },
  contractType:       { label: "Tipo de contrato", placeholder: "Ej. indefinido, temporal, 80%..." },
  company:            { label: "Empresa actual / empresa a la que aplicas", placeholder: "Ej. Siemens AG" },
  maritalStatus:      { label: "Estado civil", placeholder: "Ej. soltero/a, casado/a, pareja de hecho" },
  householdSize:      { label: "Personas en el hogar", placeholder: "Ej. 2 (adultos), 1 niño" },
  city:               { label: "Ciudad / cantón de destino", placeholder: "Ej. Uster, Zúrich, Berna..." },
};

const TIPO_INFO: Record<string, { titulo: string; desc: string; idioma: string; consejos: string[] }> = {
  vivienda: {
    titulo: "Carta de vivienda",
    desc: "Genera en alemán formal (Hochdeutsch) para propietarios o inmobiliarias suizas.",
    idioma: "🇩🇪 Se generará en alemán",
    consejos: [
      "Menciona tu contrato indefinido — es el argumento más fuerte.",
      "Indica si no fumas y no tienes mascotas explícitamente.",
      "Añade tu ratio ingreso/alquiler (idealmente tu salario es 3x el alquiler).",
      "Si tienes aval o Betreibungsauszug limpio, menciónalo.",
    ],
  },
  trabajo: {
    titulo: "Carta de presentación laboral",
    desc: "Bewerbungsschreiben profesional en alemán para candidaturas en Suiza.",
    idioma: "🇩🇪 Se generará en alemán",
    consejos: [
      "Especifica el puesto exacto al que aplicas en 'Profesión'.",
      "Añade en 'Información adicional' tus 2-3 logros más relevantes.",
      "Menciona cuántos años de experiencia tienes.",
      "Indica disponibilidad y si ya vives en Suiza.",
    ],
  },
  cv: {
    titulo: "Currículum formato suizo",
    desc: "Lebenslauf estructurado con el estándar profesional suizo.",
    idioma: "🇪🇸 Se generará en español con estructura suiza",
    consejos: [
      "Detalla tu experiencia laboral en 'Información adicional'.",
      "Lista tus idiomas con nivel (A1-C2). El alemán es clave.",
      "Incluye formación, cursos y certificaciones.",
      "Menciona habilidades técnicas y blandas relevantes.",
    ],
  },
  tramites: {
    titulo: "Carta para trámites",
    desc: "Carta administrativa formal para Gemeinde, seguros, RAV, migración, etc.",
    idioma: "🇩🇪 Se generará en alemán formal",
    consejos: [
      "Indica exactamente qué trámite es (Anmeldung, permiso, baja de seguro...).",
      "Menciona tu número AHV o de referencia si lo tienes.",
      "Lista los documentos que adjuntarás.",
      "Cuanto más preciso sea el trámite, mejor la carta.",
    ],
  },
  personal: {
    titulo: "Carta personal / motivación",
    desc: "Carta de presentación humana y auténtica para contexto migratorio.",
    idioma: "🇪🇸 Se generará en español (o indica alemán en el mensaje)",
    consejos: [
      "Cuéntanos tu historia real — por qué Suiza, qué buscas.",
      "Menciona tu familia, valores y proyecto de vida.",
      "Indica a quién va dirigida si tienes destinatario específico.",
      "Sé específico: fechas, países, experiencias concretas.",
    ],
  },
};

export default function GeneradorDocumentosPage() {
  const [form, setForm] = useState({
    documentType: "vivienda",
    name: "", email: "", phone: "",
    currentAddress: "", currentPostalCity: "",
    recipientName: "", recipientAddress: "", recipientPostalCity: "",
    profession: "", salary: "", contractType: "", company: "",
    maritalStatus: "", householdSize: "",
    smoker: "", pets: "",
    city: "", message: "",
    date: new Date().toLocaleDateString("de-CH"),
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const info = TIPO_INFO[form.documentType];
  const camposVisibles = CAMPOS_POR_TIPO[form.documentType] || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDocument = async () => {
    if (!form.name.trim() || !form.profession.trim()) {
      alert("Por favor completa al menos el nombre y la profesión.");
      return;
    }
    try {
      setLoading(true);
      setResult("");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar documento");
      setResult(data.text || "");
    } catch (error) {
      console.error(error);
      setResult("Hubo un error al generar el documento. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 50;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(result, maxWidth);
    let y = 60;
    lines.forEach((line: string) => {
      if (y > 780) { doc.addPage(); y = 60; }
      doc.text(line, margin, y);
      y += 17;
    });
    doc.save(`${form.documentType}-migrante-global.pdf`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16" style={{ background: 'var(--black)', color: 'var(--bone)' }}>
        <div className="max-w-5xl mx-auto px-6">

          {/* Breadcrumb / back */}
          <div className="flex items-center gap-2 mb-8 pt-4">
            <Link
              href="/servicios"
              className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--light-gray)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Servicios
            </Link>
            <span style={{ color: 'var(--mid-gray)' }}>/</span>
            <span className="text-sm" style={{ color: 'var(--light-gray)' }}>Generador de Documentos</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm mb-5"
              style={{
                background: 'rgba(201,169,110,0.08)',
                borderColor: 'rgba(201,169,110,0.25)',
                color: '#c9a96e',
              }}
            >
              <Sparkles className="h-4 w-4" />
              Herramienta premium con IA
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Generador de{" "}
              <span style={{ color: '#c9a96e' }}>Documentos</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--light-gray)' }}>
              Documentos profesionales para vivienda, empleo, trámites y más —
              adaptados a tu perfil real con IA.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">

            {/* ── Formulario ── */}
            <section
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid rgba(128,128,128,0.15)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(201,169,110,0.12)', color: '#c9a96e' }}
                >
                  <FilePenLine className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--bone)' }}>
                    Completa tu información
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--light-gray)' }}>
                    Cuanto más preciso seas, mejor saldrá el documento
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* Tipo de documento */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--bone)' }}>
                    Tipo de documento
                  </label>
                  <select
                    name="documentType"
                    value={form.documentType}
                    onChange={e => { handleChange(e); setResult(""); }}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                    style={{
                      background: 'var(--surface-card-elevated)',
                      border: '1px solid rgba(128,128,128,0.2)',
                      color: 'var(--bone)',
                    }}
                  >
                    <option value="vivienda">Carta para vivienda</option>
                    <option value="trabajo">Carta de presentación laboral</option>
                    <option value="cv">Currículum formato suizo</option>
                    <option value="tramites">Carta para trámites administrativos</option>
                    <option value="personal">Carta personal / motivación</option>
                  </select>
                  <p className="text-xs mt-1.5" style={{ color: '#c9a96e' }}>{info.idioma}</p>
                </div>

                {/* Separador secciones */}
                {camposVisibles.some(c => ["name","email","phone"].includes(c)) && (
                  <p className="text-xs font-semibold uppercase tracking-widest pt-2" style={{ color: 'var(--light-gray)' }}>
                    Tus datos personales
                  </p>
                )}

                {/* Campos dinámicos */}
                {camposVisibles.map(campo => {
                  if (campo === "message") return null; // al final
                  if (campo === "smoker" || campo === "pets") {
                    return (
                      <div key={campo}>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--bone)' }}>
                          {campo === "smoker" ? "¿Fumas?" : "¿Tienes mascotas?"}
                        </label>
                        <select
                          name={campo}
                          value={form[campo as keyof typeof form]}
                          onChange={handleChange}
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                          style={{
                            background: 'var(--surface-card-elevated)',
                            border: '1px solid rgba(128,128,128,0.2)',
                            color: 'var(--bone)',
                          }}
                        >
                          <option value="">Selecciona...</option>
                          <option value="no">No</option>
                          <option value="si">Sí</option>
                        </select>
                      </div>
                    );
                  }

                  // Separadores de sección
                  const separadores: Record<string, string> = {
                    recipientName: "Destinatario",
                    profession: "Perfil profesional",
                    maritalStatus: "Situación personal",
                    city: "Destino",
                  };

                  const labelConfig = LABELS[campo];
                  if (!labelConfig) return null;

                  return (
                    <div key={campo}>
                      {separadores[campo] && (
                        <p className="text-xs font-semibold uppercase tracking-widest pt-2 pb-1" style={{ color: 'var(--light-gray)' }}>
                          {separadores[campo]}
                        </p>
                      )}
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--bone)' }}>
                        {labelConfig.label}
                      </label>
                      <input
                        name={campo}
                        type={labelConfig.type || "text"}
                        placeholder={labelConfig.placeholder}
                        value={form[campo as keyof typeof form]}
                        onChange={handleChange}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                        style={{
                          background: 'var(--surface-card-elevated)',
                          border: '1px solid rgba(128,128,128,0.2)',
                          color: 'var(--bone)',
                        }}
                      />
                    </div>
                  );
                })}

                {/* Información adicional */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--bone)' }}>
                    Información adicional y contexto *
                  </label>
                  <textarea
                    name="message"
                    placeholder={
                      form.documentType === "vivienda"
                        ? "Ej. Somos una pareja tranquila y responsable. No fumamos, no tenemos mascotas. Buscamos el piso por..."
                        : form.documentType === "trabajo"
                        ? "Ej. Tengo 5 años de experiencia en automatización industrial. Logré reducir costes un 20% en mi empresa anterior..."
                        : form.documentType === "cv"
                        ? "Ej. Experiencia: 2019-2022 ABB AG como técnico... Idiomas: español (nativo), alemán (B2), inglés (C1)..."
                        : form.documentType === "tramites"
                        ? "Ej. Necesito hacer la Anmeldung en la Gemeinde de Uster. Me mudo el 1 de mayo. Adjunto contrato de alquiler y pasaporte."
                        : "Ej. Emigré de Colombia hace 2 años. Busco estabilidad para mi familia. Mi objetivo es integrarme y trabajar en mi profesión..."
                    }
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
                    style={{
                      background: 'var(--surface-card-elevated)',
                      border: '1px solid rgba(128,128,128,0.2)',
                      color: 'var(--bone)',
                    }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--light-gray)' }}>
                    Este campo es el más importante — cuanta más información real incluyas, mejor será el resultado.
                  </p>
                </div>

                <button
                  onClick={generateDocument}
                  disabled={loading}
                  className="w-full rounded-xl font-bold py-4 text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                  style={{
                    background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                    boxShadow: '0 4px 0 #7f1d1d, 0 6px 16px rgba(220,38,38,0.3)',
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generando documento...
                    </span>
                  ) : (
                    "✨ Generar documento"
                  )}
                </button>
              </div>
            </section>

            {/* ── Sidebar info ── */}
            <aside className="space-y-5 sticky top-24">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid rgba(128,128,128,0.15)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: 'rgba(220,38,38,0.10)', color: '#dc2626' }}
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm" style={{ color: 'var(--bone)' }}>
                      {info.titulo}
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--light-gray)' }}>{info.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {info.consejos.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl p-3 text-xs leading-relaxed"
                      style={{
                        background: 'var(--surface-card-elevated)',
                        border: '1px solid rgba(128,128,128,0.12)',
                        color: 'var(--light-gray)',
                      }}
                    >
                      <span className="mt-0.5 flex-shrink-0 text-base">
                        {["💼", "📋", "🏠", "💡"][i] || "✅"}
                      </span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Aviso */}
              <div
                className="rounded-2xl p-4 text-xs leading-relaxed"
                style={{
                  background: 'rgba(201,169,110,0.08)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  color: '#c9a96e',
                }}
              >
                <strong>Importante:</strong> Este documento es un borrador generado por IA.
                Revísalo, personalízalo y asegúrate de que los datos son correctos antes de enviarlo.
                Migrante Global no se hace responsable del uso final del documento.
              </div>
            </aside>
          </div>

          {/* ── Resultado ── */}
          {result && (
            <section
              className="mt-8 rounded-2xl p-6 md:p-8"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid rgba(128,128,128,0.15)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--bone)' }}>
                    Documento generado
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--light-gray)' }}>
                    Revisa, edita lo que necesites y descarga o copia el texto.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: 'var(--surface-card-elevated)',
                      border: '1px solid rgba(128,128,128,0.2)',
                      color: 'var(--bone)',
                    }}
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#c9a96e', color: '#111318' }}
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </button>
                </div>
              </div>

              <div
                className="rounded-xl p-5"
                style={{
                  background: 'var(--surface-card-elevated)',
                  border: '1px solid rgba(128,128,128,0.12)',
                }}
              >
                <pre
                  className="whitespace-pre-wrap text-sm leading-7 font-sans"
                  style={{ color: 'var(--bone)' }}
                >
                  {result}
                </pre>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
