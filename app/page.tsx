import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';
import { SeccionCalculadoraModal } from '@/components/seccion-calculadora-modal';
import { FormularioContacto } from '@/components/formulario-contacto';
import { SeccionValidacion } from '@/components/seccion-validacion';
import { SeccionServicios } from '@/components/seccion-servicios';
import { SeccionQueHacemos } from '@/components/seccion-que-hacemos';
import { SeccionMetodo } from '@/components/seccion-metodo';
import { SeccionPrecios } from '@/components/seccion-precios';
import { SeccionTransparencia } from '@/components/seccion-transparencia';
import { SeccionCTA } from '@/components/seccion-cta';
import { SeccionTestimonios } from '@/components/seccion-testimonios';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SeccionValidacion />
        <SeccionServicios />
        <SeccionCalculadoraModal />
        <SeccionQueHacemos />
        <SeccionMetodo />
        <SeccionTestimonios />
        <SeccionPrecios />
        <SeccionTransparencia />
        <FormularioContacto />
        <SeccionCTA />
      </main>
      <Footer />
    </>
  );
}
