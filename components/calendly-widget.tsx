'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/gtag';

export const CALENDLY_URL = 'https://calendly.com/migranteglobal/30min';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

/** Abre el popup de Calendly; source identifica qué CTA lo disparó (para GA y UTM en Calendly). */
export function openCalendly(source: string) {
  if (typeof window === 'undefined') return;
  const url = `${CALENDLY_URL}?utm_source=migranteglobal_site&utm_content=${encodeURIComponent(source)}`;
  trackEvent('calendly_open', { source });
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function CalendlyWidget() {
  useEffect(() => {
    if (document.getElementById('calendly-widget-css')) return;
    const link = document.createElement('link');
    link.id = 'calendly-widget-css';
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
  }, []);

  return <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />;
}
