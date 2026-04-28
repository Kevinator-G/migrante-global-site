'use client';

import { Languages } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function ClasesAlemanPage() {
  return (
    <ServicioTemplate
      id="clases-aleman"
      titulo="Clases de Alemán"
      subtitulo="Aprende alemán con enfoque práctico para vivir y trabajar en Suiza"
      tagline="No es solo un idioma — es tu pasaporte a mejores oportunidades laborales y sociales"
      icon={Languages}
      categoria="Idiomas e Integración"
      precio={47}
      moneda="€ / hora"
      precioTipo="Por hora · paquetes mínimos de 5 horas recomendados"
      valorMercado="Clases de alemán privadas en Suiza: €60–100/hora"
      problema={{
        titulo: '¿Por qué el alemán define tu futuro en Suiza?',
        descripcion:
          'Aunque hay regiones francófonas e italófonas, el alemán (Hochdeutsch) es clave para el mercado laboral suizo en la mayor parte del país. Sin un nivel básico funcional, accedes a empleos de menor calificación, te quedas fuera de networking real y la integración se vuelve aislante. Cuanto antes empieces, más se amplían tus opciones.',
      }}
      beneficios={[
        'Evaluación de tu nivel actual y diseño de plan de aprendizaje realista',
        'Clases personalizadas 1:1 enfocadas en el alemán que se usa en la vida real',
        'Vocabulario específico para tu sector profesional y situación diaria',
        'Preparación estructurada para certificaciones A1, A2 y B1 si lo necesitas',
        'Horarios flexibles adaptados a tu zona horaria actual',
      ]}
      incluye={[
        'Evaluación de nivel inicial (diagnóstico gratuito)',
        'Clases personalizadas 1:1 online (Zoom / Google Meet)',
        'Material didáctico digital incluido en el precio',
        'Enfoque práctico: situaciones reales de vida en Suiza',
        'Preparación estructurada para certificaciones (A1, A2, B1)',
        'Flexibilidad horaria total — tú eliges cuándo',
      ]}
      noIncluye={[
        'No incluye el costo de certificaciones oficiales (exámenes Goethe, TELC)',
        'No ofrecemos clases grupales — solo atención individual 1:1',
        'No enseñamos suizo-alemán avanzado (Schweizerdeutsch dialect)',
        'Paquetes mínimos de 5 horas recomendados para progreso real',
      ]}
      paraQuien={[
        'Personas que quieren aprender alemán antes de mudarse a Suiza',
        'Migrantes en Suiza que necesitan mejorar rápido para el trabajo',
        'Profesionales que necesitan alemán para ascender o cambiar de sector',
      ]}
      planInfo={{
        inicio: 'Disponible como servicio adicional con tarifa estándar.',
        estrategia: 'Descuento del 15% en paquetes de clases para clientes del plan.',
        comunidad: 'Descuento del 20% en paquetes de clases para miembros activos.',
      }}
    />
  );
}
