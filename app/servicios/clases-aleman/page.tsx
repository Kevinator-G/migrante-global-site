'use client';

import { Languages } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function ClasesAlemanPage() {
  return (
    <ServicioTemplate
      titulo="Clases de Alemán"
      subtitulo="Clases personalizadas para aprender o mejorar tu nivel de alemán"
      icon={Languages}
      problema={{
        titulo: '¿Por qué necesitas alemán en Suiza?',
        descripcion:
          'Aunque hay zonas francófonas e italófonas, el alemán (especialmente el suizo-alemán) es clave para integrarte laboralmente y socialmente. Sin un nivel básico, tus oportunidades se reducen drásticamente. Te ayudamos a empezar.',
      }}
      incluye={[
        'Evaluación de nivel inicial',
        'Clases personalizadas 1:1 online',
        'Material didáctico incluido',
        'Enfoque práctico para la vida diaria en Suiza',
        'Preparación para certificaciones (A1, A2, B1)',
        'Flexibilidad de horarios',
      ]}
      noIncluye={[
        'No incluimos certificaciones oficiales (solo preparación)',
        'No ofrecemos clases grupales (solo 1:1)',
        'No enseñamos suizo-alemán avanzado (dialecto)',
        'Las clases se cotizan por separado según horas',
      ]}
      paraQuien={[
        'Personas que quieren aprender alemán antes de migrar',
        'Quienes ya están en Suiza y necesitan mejorar rápido',
        'Profesionales que necesitan alemán para sus empleos',
      ]}
      planes={{
        inicio: 'Disponible como servicio adicional con tarifa especial.',
        estrategia: 'Descuento del 15% en paquetes de clases.',
        perfecto: 'Descuento del 25% en paquetes de clases.',
      }}
    />
  );
}
