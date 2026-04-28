import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios de Migración a Suiza | Migrante Global",
  description:
    "Todos nuestros servicios para emigrar a Suiza: orientación laboral, CV suizo, clases de alemán, alojamiento, trámites administrativos, recogida en aeropuerto y comunidad de apoyo.",
  keywords: [
    "servicios migración Suiza",
    "consultoría migración",
    "paquetes asesoría emigrar",
    "CV suizo",
    "clases alemán",
    "alojamiento Suiza",
    "trámites Suiza",
    "orientación laboral Suiza",
  ],
  openGraph: {
    title: "Servicios de Migración a Suiza | Migrante Global",
    description:
      "Todo lo que necesitas para emigrar a Suiza con éxito. Orientación laboral, CV, alemán, trámites y más.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
