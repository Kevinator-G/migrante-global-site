'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

// Banner de confirmación al volver del pago de Stripe (?pago=exitoso)
export function PagoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('pago') === 'exitoso') {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)]">
      <div className="flex items-start gap-3 bg-[#0f1117] border border-[#25D366]/50 rounded-2xl p-5 shadow-2xl">
        <CheckCircle2 className="w-5 h-5 text-[#25D366] mt-0.5 shrink-0" />
        <div>
          <p className="text-white font-semibold text-sm mb-1">¡Pago recibido — gracias por tu confianza!</p>
          <p className="text-white/60 text-sm">
            Te escribo por WhatsApp en las próximas horas para arrancar con tu habitación. Si quieres adelantar,
            mándame un mensaje con el código de la habitación que te interesa.
          </p>
        </div>
      </div>
    </div>
  );
}
