import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';
import { SeccionCalculadoraModal } from '@/components/seccion-calculadora-modal';
import { FormularioContacto } from '@/components/formulario-contacto';
import { SeccionEtapas } from '@/components/seccion-etapas';
import { SeccionAlojamientoHome } from '@/components/seccion-alojamiento-home';
import { SeccionServicios } from '@/components/seccion-servicios';
import { SeccionPrecios } from '@/components/seccion-precios';
import { SeccionTestimonios } from '@/components/seccion-testimonios';
import { SeccionQuienSoy } from '@/components/seccion-quien-soy';
import { SeccionLeadMagnet } from '@/components/seccion-lead-magnet';

// Las habitaciones de la home se rectifican desde la fuente cada hora
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — captura atención y define la promesa */}
        <Hero />
        {/* 2. Etapas — "¿En qué etapa estás?": guía al visitante a su camino */}
        <SeccionEtapas />
        {/* 4. Alojamiento — habitaciones reales disponibles, producto estrella */}
        <SeccionAlojamientoHome />
        {/* 5. Quién soy — humaniza la marca antes de vender */}
        <SeccionQuienSoy />
        {/* 6. Calculadora — enganche emocional: muestra el gap salarial */}
        <SeccionCalculadoraModal />
        {/* 7. Servicios — qué ofrezco, con contexto y confianza ya construidos */}
        <SeccionServicios />
        {/* 8. Testimonios — prueba social de clientes reales */}
        <SeccionTestimonios />
        {/* 9. Precios — inversión, después de haber construido valor */}
        <SeccionPrecios />
        {/* 10. Lead magnet — captura emails de los que no están listos aún */}
        <SeccionLeadMagnet />
        {/* 11. Contacto — acción final */}
        <FormularioContacto />
        {/* Método, FAQ y YouTube viven ahora en /metodo — menos scroll aquí */}
      </main>
      <Footer />
    </>
  );
}
