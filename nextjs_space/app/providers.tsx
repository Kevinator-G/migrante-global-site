'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CartProvider } from '@/lib/cart-context';
import { CartDrawer } from '@/components/cart-drawer';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Restore saved theme on mount
    const saved = localStorage.getItem('mg-theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
