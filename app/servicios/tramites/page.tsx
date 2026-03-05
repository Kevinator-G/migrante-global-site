'use client';

import { FileCheck } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function TramitesPage() {
  return (
    <ServicioTemplate
      titulo="Acompañamiento en Trámites"
      subtitulo="Te guiamos en los trámites administrativos necesarios para tu migración"
      icon={FileCheck}
      problema={{
        titulo: '¿Por qué los trámites en Suiza son complicados?',
        descripcion:
          'La burocracia suiza es eficiente pero compleja. Desde registros comunales hasta seguros de salud, cada cantón tiene sus propias reglas. Sin orientación, es fácil cometer errores costosos. Te explicamos todo paso a paso.',
      }}
      incluye={[
        'Guía completa de trámites por cantón',
        'Checklist de documentos necesarios',
        'Orientación sobre registro comunal (Anmeldung)',
        'Información sobre seguros de salud obligatorios',
        'Guía de apertura de cuenta bancaria',
        'Soporte por email durante 45 días',
      ]}
      noIncluye={[
        'No somos asesoría legal (no gestionamos permisos de residencia)',
        'No llenamos formularios por ti (te orientamos)',
        'No garantizamos aprobación de trámites',
        'No ofrecemos servicio de traducción oficial',
      ]}
      paraQuien={[
        'Personas que acaban de llegar a Suiza y no saben por dónde empezar',
        'Quienes necesitan entender qué trámites son obligatorios',
        'Personas que quieren evitar multas o problemas administrativos',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional.',
        estrategia: 'Incluido con guía completa y soporte de 45 días.',
        perfecto: 'Incluido con soporte prioritario y sesiones de consulta.',
      }}
    />
  );
}
