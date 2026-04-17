import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Encontrar Alojamiento en Suiza | Guía para Migrantes | Migrante Global",
  description:
    "Orientación completa para encontrar vivienda en Suiza sin riesgos. Plataformas, contratos de alquiler, depósitos de garantía y derechos del inquilino explicados.",
  keywords: [
    "alojamiento en Suiza",
    "buscar piso en Suiza",
    "vivienda para migrantes",
    "contrato de alquiler suizo",
    "depósito de garantía Suiza",
    "derechos inquilino Suiza",
    "Mietwohnung Schweiz",
    "cómo alquilar en Suiza",
  ],
  openGraph: {
    title: "Cómo Encontrar Alojamiento en Suiza | Guía para Migrantes",
    description:
      "Todo lo que necesitas saber para encontrar vivienda en Suiza: plataformas, contratos, depósitos y derechos.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
