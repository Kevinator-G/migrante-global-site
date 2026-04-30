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
import { SeccionGeneradorPreview } from '@/components/seccion-generador-preview';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — captura atención y define la promesa */}
        <Hero />
        {/* 2. Validación — prueba social inmediata (150+ personas, 3 años) */}
        <SeccionValidacion />
        {/* 3. Quién soy — humaniza la marca antes de vender */}
        <SeccionQuienSoy />
        {/* 4. Calculadora — enganche emocional: muestra el gap salarial */}
        <SeccionCalculadoraModal />
        {/* 5. Método — elimina el miedo al proceso */}
        <SeccionMetodo />
        {/* 6. Servicios — qué ofrezco, con contexto y confianza ya construidos */}
        <SeccionServicios />
        {/* 7. Testimonios — prueba social de clientes reales */}
        <SeccionTestimonios />
        {/* 8. YouTube — prueba social en video */}
        <SeccionYoutube />
        {/* 9. Precios — inversión, después de haber construido valor */}
        <SeccionPrecios />
        {/* 10. FAQ — elimina objeciones antes del cierre */}
        <SeccionFaq />
        {/* 11. Generador — herramienta gratuita que engancha y captura leads */}
        <SeccionGeneradorPreview />
        {/* 12. Lead magnet — captura emails de los que no están listos aún */}
        <SeccionLeadMagnet />
        {/* 13. Contacto — acción final */}
        <FormularioContacto />
      </main>
      <Footer />
    </>
  );
}
