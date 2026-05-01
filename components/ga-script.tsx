'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function GaScript({ gaId }: { gaId: string }) {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const check = () => {
      const consent = localStorage.getItem('cookie-consent');
      const analytics = localStorage.getItem('cookie-analytics');
      setAnalyticsAllowed(consent === 'accepted' || analytics === 'true');
    };

    check();
    // Escucha cambios del banner de cookies en la misma pestaña
    window.addEventListener('storage', check);
    // Escucha el evento personalizado que emite el banner al guardar
    window.addEventListener('cookie-consent-updated', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('cookie-consent-updated', check);
    };
  }, []);

  if (!analyticsAllowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { page_path: window.location.pathname });
          `,
        }}
      />
    </>
  );
}
