import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recogida en el Aeropuerto de Suiza | Llegada sin Estrés | Migrante Global",
  description:
    "Alguien de confianza te espera en el aeropuerto suizo y te acompaña hasta tu alojamiento. Orientación en transporte público, tarjetas SIM y primeros pasos.",
  keywords: [
    "recogida aeropuerto Suiza",
    "traslado aeropuerto migrantes",
    "llegada Suiza primera vez",
    "asistencia llegada Zurich",
    "bienvenida migrantes Suiza",
    "aeropuerto Zurich Geneva",
    "primera llegada a Suiza",
  ],
  openGraph: {
    title: "Recogida en el Aeropuerto de Suiza | Llegada sin Estrés",
    description:
      "Llegada tranquila a Suiza: alguien te espera, te orienta y te acompaña hasta tu nuevo hogar.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
