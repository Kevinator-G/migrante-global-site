import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Formato Suizo: Revisión y Adaptación Profesional | Migrante Global",
  description:
    "Adaptamos tu currículum al formato suizo estándar (Lebenslauf). Estructura, foto, experiencia y carta de presentación. Revisión por expertos en mercado laboral suizo.",
  keywords: [
    "CV formato suizo",
    "Lebenslauf",
    "currículum Suiza",
    "adaptación CV profesional",
    "plantilla CV suizo",
    "CV para trabajar en Suiza",
    "revisión currículum",
    "Bewerbungsunterlagen",
  ],
  openGraph: {
    title: "CV Formato Suizo: Revisión y Adaptación Profesional | Migrante Global",
    description:
      "Tu CV adaptado al estándar suizo. Estructura, foto, descripción de experiencias y carta de presentación incluidos.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
