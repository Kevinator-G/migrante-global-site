'use client';

import { FileCheck } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function TramitesPage() {
  return (
    <ServicioTemplate
      id="tramites-suiza"
      titulo="Acompañamiento en Trámites"
      subtitulo="Navega la burocracia suiza con claridad, sin errores y sin perder tiempo"
      tagline="Cada cantón tiene sus propias reglas — conocerlas de antemano vale oro"
      icon={FileCheck}
      categoria="Trámites Administrativos"
      precio={197}
      moneda="€"
      precioTipo="Pago único · 45 días de soporte activo"
      valorMercado="Servicios de orientación administrativa para migrantes: €300–600"
      problema={{
        titulo: '¿Por qué los trámites en Suiza pueden hundirte?',
        descripcion:
          'La burocracia suiza es eficiente pero implacable. El Anmeldung, el seguro de salud obligatorio, la cuenta bancaria, los seguros sociales — cada uno tiene plazos, formularios y requisitos específicos que varían por cantón. Un error o un retraso puede derivar en multas, problemas con permisos o retrasos en beneficios. La orientación correcta desde el inicio es la diferencia entre avanzar o estancarse.',
      }}
      beneficios={[
        'Checklist completo y personalizado de trámites según tu cantón y situación',
        'Guía paso a paso del Anmeldung (registro comunal obligatorio)',
        'Orientación sobre seguros de salud: qué elegir, cuándo y cómo',
        'Guía de apertura de cuenta bancaria para recién llegados',
        'Soporte por email durante 45 días para resolver dudas que surjan',
      ]}
      incluye={[
        'Checklist personalizado de trámites según tu cantón de residencia',
        'Guía detallada del registro comunal (Anmeldung / Anmeldestelle)',
        'Información sobre seguros de salud obligatorios y cómo compararlos',
        'Orientación para apertura de cuenta bancaria (PostFinance, Neon, etc.)',
        'Documentos necesarios para cada trámite y dónde conseguirlos',
        'Soporte por email durante 45 días desde el inicio del servicio',
      ]}
      noIncluye={[
        'No somos asesoría legal — no gestionamos permisos de residencia',
        'No rellenamos formularios por ti — te orientamos para hacerlo correctamente',
        'No garantizamos aprobación de ningún trámite',
        'No ofrecemos servicio de traducción oficial certificada',
      ]}
      paraQuien={[
        'Personas que acaban de llegar a Suiza y no saben por dónde empezar',
        'Quienes necesitan entender qué trámites son obligatorios y en qué orden',
        'Migrantes que quieren evitar multas o complicaciones administrativas',
      ]}
      foto="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80"
      fotoAlt="Documentos y trámites administrativos"
      planInfo={{
        inicio: 'Disponible como servicio adicional.',
        estrategia: 'Incluido con guía completa, checklist y soporte de 45 días.',
        comunidad: 'Acceso a guías de trámites actualizadas dentro de la comunidad.',
      }}
    />
  );
}
