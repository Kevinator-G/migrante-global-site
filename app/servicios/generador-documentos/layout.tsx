import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generador de Documentos con IA para Migrantes | Cartas en Alemán | Migrante Global",
  description:
    "Genera cartas profesionales en español y alemán para vivienda, empleo y trámites en Suiza. Powered by IA. Adaptadas a tu perfil y situación. Completamente gratis.",
  keywords: [
    "generador documentos migración",
    "cartas en alemán online",
    "Bewerbungsschreiben generador",
    "carta de presentación alemán",
    "documentos trámites Suiza",
    "carta vivienda Suiza",
    "IA para migrantes",
    "cartas formales alemán automáticas",
  ],
  openGraph: {
    title: "Generador de Documentos con IA para Migrantes | Cartas en Alemán",
    description:
      "Crea cartas profesionales en alemán y español para todos tus trámites en Suiza. Gratis y con IA.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
