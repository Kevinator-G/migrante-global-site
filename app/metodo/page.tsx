import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SeccionMetodo } from '@/components/seccion-metodo';
import { SeccionYoutube } from '@/components/seccion-youtube';
import { SeccionFaq } from '@/components/seccion-faq';

export const metadata: Metadata = {
  title: 'Nuestro Método | Cómo Trabajamos | Migrante Global',
  description:
    'Así te acompañamos paso a paso en tu migración a Suiza: método probado con más de 150 personas, contenido real en YouTube y respuestas a las preguntas más frecuentes.',
  alternates: { canonical: 'https://migranteglobal.ch/metodo' },
};

// Método, videos y FAQ — movidos desde la home para aligerar el scroll
export default function MetodoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <SeccionMetodo />
        <SeccionYoutube />
        <SeccionFaq />
      </main>
      <Footer />
    </>
  );
}
