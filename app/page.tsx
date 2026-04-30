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
import { SeccionLeadMagnet } from '@/components/seccion-lead-magnet';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — captura atención */}
        <Hero />
        {/* 2. Servicios — qué ofrecemos */}
        <SeccionServicios />
        {/* 3. Por qué elegirnos — refuerza lo que acaban de ver */}
        <SeccionValidacion />
        {/* 4. Calculadora — enganche emocional con datos reales */}
        <SeccionCalculadoraModal />
        {/* 5. Cómo trabajamos — elimina dudas del proceso */}
        <SeccionMetodo />
        {/* 6. Quién soy — humaniza la marca */}
        <SeccionQuienSoy />
        {/* 7. YouTube — prueba social en video */}
        <SeccionYoutube />
        {/* 8. Testimonios — prueba social de clientes */}
        <SeccionTestimonios />
        {/* 9. Lead magnet — captura emails antes de precios */}
        <SeccionLeadMagnet />
        {/* 10. FAQ — elimina objeciones */}
        <SeccionFaq />
        {/* 11. Precios — conversión con contexto y garantía */}
        <SeccionPrecios />
        {/* 12. Contacto — acción final */}
        <FormularioContacto />
      </main>
      <Footer />
    </>
  );
}
