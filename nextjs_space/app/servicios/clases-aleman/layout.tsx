import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clases de Alemán Online para Migrantes en Suiza | Migrante Global",
  description:
    "Clases de alemán 1:1 online enfocadas en la vida diaria y laboral en Suiza. Hochdeutsch, preparación A1-B1, vocabulario práctico para migrantes hispanohablantes.",
  keywords: [
    "clases de alemán online",
    "alemán para migrantes",
    "Hochdeutsch",
    "aprender alemán Suiza",
    "certificación A1 A2 B1",
    "clases alemán hispanohablantes",
    "alemán para trabajar en Suiza",
  ],
  openGraph: {
    title: "Clases de Alemán Online para Migrantes en Suiza | Migrante Global",
    description:
      "Aprende alemán con enfoque práctico para vivir y trabajar en Suiza. Clases 1:1 con instructores especializados.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
