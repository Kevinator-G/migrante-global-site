'use client';

import { Users } from 'lucide-react';
import { ServicioTemplate } from '@/components/servicio-template';

export default function ComunidadApoyoPage() {
  return (
    <ServicioTemplate
      titulo="Comunidad de Apoyo"
      subtitulo="Acceso exclusivo a nuestra comunidad de migrantes y eventos"
      icon={Users}
      problema={{
        titulo: '¿Por qué es importante tener una comunidad?',
        descripcion:
          'Migrar es solitario. Estar lejos de familia y amigos, sin red de apoyo, afecta tu bienestar y motivación. Nuestra comunidad te conecta con personas en tu misma situación, eventos y networking real.',
      }}
      incluye={[
        'Acceso a grupo privado de WhatsApp/Telegram',
        'Eventos mensuales de networking (online y presenciales)',
        'Conexión con otros migrantes en Suiza',
        'Recursos compartidos y actualizaciones',
        'Soporte emocional y motivacional',
        'Descuentos en servicios adicionales',
      ]}
      noIncluye={[
        'No garantizamos empleo a través de la comunidad',
        'No ofrecemos terapia psicológica profesional',
        'No organizamos eventos pagos fuera de Suiza',
        'Los eventos presenciales pueden tener costo adicional',
      ]}
      paraQuien={[
        'Personas que ya migraron y se sienten solas',
        'Quienes buscan networking real en Suiza',
        'Personas que quieren conocer otros migrantes antes de llegar',
      ]}
      planes={{
        inicio: 'Acceso durante 30 días como prueba.',
        estrategia: 'Acceso durante 3 meses incluido.',
        perfecto: 'Acceso mensual incluido mientras mantengas la suscripción.',
      }}
    />
  );
}
