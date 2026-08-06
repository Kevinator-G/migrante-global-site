'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/cart-context';
import { CartDrawer } from '@/components/cart-drawer';
import { CalendlyGateProvider } from '@/lib/calendly-gate-context';
import { CalendlyLeadGateModal } from '@/components/calendly-lead-gate-modal';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <CalendlyGateProvider>
          {children}
          <CartDrawer />
          <CalendlyLeadGateModal />
        </CalendlyGateProvider>
      </CartProvider>
    </SessionProvider>
  );
}
