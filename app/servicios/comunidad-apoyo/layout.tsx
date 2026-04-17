import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidad de Migrantes Latinos en Suiza | Red de Apoyo | Migrante Global",
  description:
    "Únete a nuestra red privada de migrantes hispanohablantes en Suiza. Eventos mensuales, recursos compartidos, networking y apoyo emocional entre personas que ya vivieron el proceso.",
  keywords: [
    "comunidad migrantes Suiza",
    "latinos en Suiza",
    "red de apoyo migrantes",
    "networking hispanohablantes Suiza",
    "eventos migrantes",
    "apoyo emocional migración",
    "comunidad española en Suiza",
    "hispanohablantes Europa",
  ],
  openGraph: {
    title: "Comunidad de Migrantes Latinos en Suiza | Red de Apoyo",
    description:
      "Conecta con otros hispanohablantes que ya viven en Suiza. Eventos, recursos y apoyo real.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
