'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type CalendlyGateContextType = {
  isOpen: boolean;
  source: string | null;
  requestCalendly: (source: string) => void;
  close: () => void;
};

const CalendlyGateContext = createContext<CalendlyGateContextType | null>(null);

export function CalendlyGateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<string | null>(null);

  const requestCalendly = useCallback((src: string) => {
    setSource(src);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <CalendlyGateContext.Provider value={{ isOpen, source, requestCalendly, close }}>
      {children}
    </CalendlyGateContext.Provider>
  );
}

export function useCalendlyGate() {
  const ctx = useContext(CalendlyGateContext);
  if (!ctx) throw new Error('useCalendlyGate debe usarse dentro de CalendlyGateProvider');
  return ctx;
}
