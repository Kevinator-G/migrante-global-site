import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Migración Comparativa Europa: Suiza, Alemania, Países Bajos y Más | Migrante Global",
  description:
    "Análisis de viabilidad para emigrar a Europa. Comparativa entre Suiza, Alemania, Austria, Países Bajos y Portugal: salarios, visados, calidad de vida y requisitos.",
  keywords: [
    "emigrar a Europa",
    "migración Alemania",
    "trabajar en Países Bajos",
    "emigrar Portugal",
    "comparativa migración Europa",
    "visados trabajo Europa",
    "salarios Europa hispanohablantes",
    "Austria migrantes",
    "migración comparativa",
  ],
  openGraph: {
    title: "Migración Comparativa Europa: Suiza, Alemania, Países Bajos y Más",
    description:
      "¿Cuál país europeo es mejor para ti? Comparativa real de Suiza, Alemania, Países Bajos, Austria y Portugal.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
