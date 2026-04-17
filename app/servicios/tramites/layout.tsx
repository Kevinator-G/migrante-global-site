import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trámites Administrativos en Suiza: Anmeldung, Seguros y Más | Migrante Global",
  description:
    "Acompañamiento en los trámites al llegar a Suiza: Anmeldung (registro comunal), seguros de salud (Krankenkasse), cuenta bancaria y burocracia cantonal paso a paso.",
  keywords: [
    "trámites en Suiza",
    "Anmeldung Suiza",
    "registro comunal Suiza",
    "Krankenkasse seguro de salud",
    "burocracia suiza migrantes",
    "permisos de residencia",
    "cuenta bancaria Suiza",
    "trámites para hispanohablantes",
  ],
  openGraph: {
    title: "Trámites Administrativos en Suiza: Anmeldung, Seguros y Más",
    description:
      "Guía completa de trámites al llegar a Suiza. Anmeldung, seguro de salud, cuenta bancaria y más.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
