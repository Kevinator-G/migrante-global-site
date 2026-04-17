import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sesiones 1:1 de Consultoría Migración a Suiza | Migrante Global",
  description:
    "Consultoría individual de 60 minutos para resolver tus dudas sobre migración a Suiza. Plan de acción personalizado incluido. Respuestas claras para tu caso específico.",
  keywords: [
    "consultoría migración Suiza",
    "asesoría individual",
    "sesión personalizada migración",
    "coaching migrante",
    "orientación migratoria",
    "plan de acción emigrar Suiza",
    "consultor migración hispanohablantes",
  ],
  openGraph: {
    title: "Sesiones 1:1 de Consultoría Migración a Suiza | Migrante Global",
    description:
      "Resuelve tus dudas sobre emigrar a Suiza en una sesión personalizada de 60 minutos con plan de acción incluido.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
