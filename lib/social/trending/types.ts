// Tipos compartidos por el barrido de tendencias (Fuentes A/B/C + scoring + selección).
// El trending decide TEMA y ÁNGULO, nunca el formato — eso lo manda siempre el
// ciclo de 8 (lib/social/format-cycle.ts).

export type FuenteTrending = 'hashtag' | 'cuenta' | 'noticia'
export type FormatoOriginal = 'reel' | 'carrusel' | 'foto' | null
export type Tema = 'salud' | 'vivienda' | 'impuestos' | 'trabajo' | 'idioma' | 'tramites'

export const TEMAS_NICHO: Tema[] = ['salud', 'vivienda', 'impuestos', 'trabajo', 'idioma', 'tramites']

// Candidato crudo, antes de que la IA redacte ángulo/estructura/por_que_funciona.
export interface CandidatoCrudo {
  fuente: FuenteTrending
  url: string
  formatoOriginal: FormatoOriginal
  captionOriginal: string // solo para que la IA redacte el ángulo — NUNCA se expone en el output
  likes: number
  comentarios: number
  publicadoAt: Date
  // Solo disponible cuando ya tenemos la mediana de la cuenta (Fuente B) — si es
  // null, el score de esa fuente es velocidad cruda, sin normalizar.
  medianaEngagementCuenta: number | null
}

// Candidato final, tal como lo pide el spec de salida del barrido.
export interface Candidato {
  fuente: FuenteTrending
  url: string
  formatoOriginal: FormatoOriginal
  tema: Tema
  angulo: string // una frase, redactada por IA — nunca el caption original
  estructura: string // ej: "pregunta → 3 errores → CTA"
  score: number
  porQueFunciona: string
}

export interface TrendingScanResult {
  fecha: string // 'YYYY-MM-DD'
  candidatos: Candidato[]
}

export interface ReferenciaTrending {
  tema: Tema
  angulo: string
  estructura: string
  porQueFunciona: string
  url: string
  score: number
  fuente: FuenteTrending
}
