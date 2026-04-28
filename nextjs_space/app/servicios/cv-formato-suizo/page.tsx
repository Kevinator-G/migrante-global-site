'use client';

import { FileText } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function CVFormatoSuizoPage() {
  return (
    <ServicioTemplate
      id="cv-formato-suizo"
      titulo="CV Formato Suizo"
      subtitulo="Adapta tu currículum a los estándares suizos y multiplica tus respuestas"
      tagline="Un CV mal formateado descarta tu candidatura antes de que lean la primera línea"
      icon={FileText}
      categoria="Empleo en Suiza"
      precio={97}
      moneda="€"
      precioTipo="Pago único · incluye 1 revisión adicional"
      valorMercado="Servicios de CV profesional en Europa: €250–500"
      problema={{
        titulo: '¿Por qué tu CV actual no funciona en Suiza?',
        descripcion:
          'El mercado laboral suizo es preciso, estructurado y culturalmente muy específico. Un CV latinoamericano o español — aunque sea brillante en contenido — tiene el formato equivocado: demasiado largo, sin foto correcta, con estructura que no sigue los estándares locales. Resultado: carpeta de rechazados sin siquiera ser leído.',
      }}
      beneficios={[
        'Tu CV adaptado al formato exacto que usan los empleadores suizos',
        'Descripción de experiencias con lenguaje y estructura locales',
        'Corrección de foto, longitud, secciones y orden de contenido',
        'Traducción contextual de títulos y cargos al sistema suizo',
        'Una revisión adicional incluida hasta que quedes satisfecho',
      ]}
      incluye={[
        'Revisión completa de tu CV actual (estructura, contenido, formato)',
        'Adaptación al formato suizo estándar (Europass / local)',
        'Optimización de la descripción de cada experiencia laboral',
        'Traducción contextual de títulos universitarios y cargos',
        'Consejos sobre foto, longitud (máx. 2 páginas), secciones clave',
        '1 revisión adicional incluida (ajustes después del primer entregable)',
      ]}
      noIncluye={[
        'No escribimos tu CV desde cero — necesitas tener uno base',
        'No garantizamos entrevistas ni respuestas de empleadores',
        'No traducimos el CV completo a alemán/francés (solo orientamos)',
        'La carta de presentación se cotiza aparte (47€)',
      ]}
      paraQuien={[
        'Profesionales que aplican a empleos suizos sin obtener respuesta',
        'Personas con experiencia sólida pero CV con formato inadecuado',
        'Quienes quieren maximizar sus posibilidades antes de aplicar masivamente',
      ]}
      planInfo={{
        inicio: 'Disponible como servicio adicional al plan de alojamiento.',
        estrategia: 'Incluido con revisiones adicionales y seguimiento de 90 días.',
        comunidad: 'Acceso a plantillas de CV actualizadas dentro de la comunidad.',
      }}
    />
  );
}
