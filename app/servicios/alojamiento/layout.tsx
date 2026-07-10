import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habitaciones en Zúrich para Migrantes | Alojamiento Verificado | Migrante Global",
  description:
    "Habitaciones amuebladas disponibles en Wetzikon (cantón de Zúrich) desde 1.150 CHF/mes. Acompañamiento en español: contrato, depósito y llegada sin riesgos.",
  keywords: [
    "habitaciones en Zúrich",
    "alojamiento en Suiza",
    "habitación amueblada Wetzikon",
    "alquilar habitación Suiza",
    "vivienda para migrantes",
    "contrato de alquiler suizo",
    "depósito de garantía Suiza",
    "WG Zimmer Zürich",
  ],
  openGraph: {
    title: "Habitaciones en Zúrich para Migrantes | Alojamiento Verificado",
    description:
      "Habitaciones amuebladas en Wetzikon desde 1.150 CHF/mes con acompañamiento en español: contrato, depósito y llegada.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
