// Catálogo autoritativo de precios — fuente de verdad para el checkout.
// El cliente nunca decide el precio que se cobra; solo puede pedir un id
// de este catálogo. Mantener sincronizado con los ids usados en
// components/servicio-template.tsx, app/servicios/page.tsx y sus páginas.

export type CatalogItem = {
  nombre: string;
  precio: number;
  moneda: string;
};

export const SERVICE_CATALOG: Record<string, CatalogItem> = {
  'orientacion-laboral': { nombre: 'Orientación Laboral', precio: 197, moneda: 'CHF' },
  'cv-formato-suizo': { nombre: 'CV Formato Suizo', precio: 147, moneda: 'CHF' },
  'sesiones-1-1': { nombre: 'Sesiones 1:1', precio: 147, moneda: 'CHF/sesión' },
  'tramites-suiza': { nombre: 'Acompañamiento en Trámites', precio: 247, moneda: 'CHF' },
  'empleo-vip': { nombre: 'Búsqueda de Empleo VIP', precio: 397, moneda: 'CHF' },
  comunidad: { nombre: 'Comunidad de Apoyo', precio: 0, moneda: '' },
  'clases-aleman': { nombre: 'Alemán para Migrantes', precio: 0, moneda: '' },
  'generador-documentos': { nombre: 'Generador de Documentos', precio: 0, moneda: '' },
};

export function getCatalogItem(id: string): CatalogItem | null {
  return SERVICE_CATALOG[id] ?? null;
}
