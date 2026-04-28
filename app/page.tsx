import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';
import { SeccionCalculadoraModal } from '@/components/seccion-calculadora-modal';
import { FormularioContacto } from '@/components/formulario-contacto';
import { SeccionValidacion } from '@/components/seccion-validacion';
import { SeccionServicios } from '@/components/seccion-servicios';
import { SeccionMetodo } from '@/components/seccion-metodo';
import { SeccionPrecios } from '@/components/seccion-precios';
import { SeccionTestimonios } from '@/components/seccion-testimonios';
import { SeccionQuienSoy } from '@/components/seccion-quien-soy';
import { SeccionYoutube } from '@/components/seccion-youtube';
import { SeccionFaq } from '@/components/seccion-faq';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SeccionValidacion />
        <SeccionServicios />
        <SeccionCalculadoraModal />
        <SeccionMetodo />
        <SeccionQuienSoy />
        <SeccionYoutube />
        <SeccionTestimonios />
        <SeccionFaq />
        <SeccionPrecios />
        <FormularioContacto />
      </main>
      <Footer />
    </>
  );
}
