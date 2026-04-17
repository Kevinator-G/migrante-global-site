import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orientación Laboral en Suiza | Estrategia de Búsqueda de Empleo | Migrante Global",
  description:
    "Guía personalizada para entrar al mercado laboral suizo. Portales de empleo, networking, preparación para entrevistas y seguimiento de 60 días. Para hispanohablantes.",
  keywords: [
    "empleo en Suiza",
    "mercado laboral suizo",
    "búsqueda de trabajo Suiza",
    "networking profesional",
    "entrevistas de trabajo Suiza",
    "orientación laboral migrantes",
    "trabajo para hispanohablantes Suiza",
    "Jobs Schweiz",
  ],
  openGraph: {
    title: "Orientación Laboral en Suiza | Estrategia de Búsqueda de Empleo",
    description:
      "Estrategia personalizada para conseguir empleo en Suiza. Portales, red de contactos, entrevistas y más.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
