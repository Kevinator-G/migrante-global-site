'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

type SectorKey =
  | 'general'
  | 'tech'
  | 'finance'
  | 'health'
  | 'eng'
  | 'hospitality'
  | 'construction'
  | 'logistics'
  | 'sales';

type CountryData = {
  name: string;
  region: 'hispano' | 'ue';
  costIdx: number;
} & Record<SectorKey, number>;

type RegionFilter = 'hispano' | 'ue' | 'all';
type Mode = 'ch' | 'pvp'; // CH vs País | País vs País

function fmt(n: number) {
  return n.toLocaleString('es-ES');
}

/**
 * Multiplicadores para convertir "general" -> sector.
 * Ajustables cuando quieras.
 */
const sectorMultipliers: Record<SectorKey, number> = {
  general: 1.0,
  tech: 1.35,
  finance: 1.55,
  health: 1.12,
  eng: 1.28,
  hospitality: 0.55,
  construction: 0.72,
  logistics: 0.65,
  sales: 0.82,
};

const sectorNames: Record<SectorKey, string> = {
  general: 'Salario medio general',
  tech: 'Tecnología / IT',
  finance: 'Finanzas / Banca',
  health: 'Salud / Medicina',
  eng: 'Ingeniería',
  hospitality: 'Hostelería',
  construction: 'Construcción',
  logistics: 'Logística',
  sales: 'Comercio / Ventas',
};

/**
 * País base
 * - general: salario mensual promedio (referencial) en €
 * - costIdx: índice coste de vida (referencial)
 */
type BaseCountry = {
  name: string;
  region: 'hispano' | 'ue';
  general: number;
  costIdx?: number;
};

/**
 * UE (27) + países hispanohablantes (soberanos) + Guinea Ecuatorial
 * Nota: España ya está en UE.
 */
const baseCountries: Record<string, BaseCountry> = {
  // ======== UNIÓN EUROPEA (27) ========
  alemania: { name: 'Alemania', region: 'ue', general: 3800, costIdx: 120 },
  austria: { name: 'Austria', region: 'ue', general: 3600, costIdx: 118 },
  belgica: { name: 'Bélgica', region: 'ue', general: 3500, costIdx: 118 },
  bulgaria: { name: 'Bulgaria', region: 'ue', general: 900, costIdx: 75 },
  chipre: { name: 'Chipre', region: 'ue', general: 2000, costIdx: 95 },
  croacia: { name: 'Croacia', region: 'ue', general: 1300, costIdx: 85 },
  dinamarca: { name: 'Dinamarca', region: 'ue', general: 5200, costIdx: 135 }, // (no UE actualmente, pero la tenías en la lista UE antes)
  // ✅ Si prefieres “UE estricta”, dime y la saco. Mantengo tu intención original.
  eslovaquia: { name: 'Eslovaquia', region: 'ue', general: 1300, costIdx: 85 },
  eslovenia: { name: 'Eslovenia', region: 'ue', general: 1800, costIdx: 92 },
  espana: { name: 'España', region: 'ue', general: 1800, costIdx: 100 },
  estonia: { name: 'Estonia', region: 'ue', general: 1600, costIdx: 90 },
  finlandia: { name: 'Finlandia', region: 'ue', general: 3800, costIdx: 125 },
  francia: { name: 'Francia', region: 'ue', general: 3200, costIdx: 115 },
  grecia: { name: 'Grecia', region: 'ue', general: 1200, costIdx: 88 },
  hungria: { name: 'Hungría', region: 'ue', general: 1200, costIdx: 82 },
  irlanda: { name: 'Irlanda', region: 'ue', general: 4000, costIdx: 130 },
  italia: { name: 'Italia', region: 'ue', general: 2500, costIdx: 105 },
  letonia: { name: 'Letonia', region: 'ue', general: 1300, costIdx: 85 },
  lituania: { name: 'Lituania', region: 'ue', general: 1500, costIdx: 88 },
  luxemburgo: { name: 'Luxemburgo', region: 'ue', general: 5500, costIdx: 145 },
  malta: { name: 'Malta', region: 'ue', general: 1800, costIdx: 95 },
  paisesbajos: { name: 'Países Bajos', region: 'ue', general: 3700, costIdx: 125 },
  polonia: { name: 'Polonia', region: 'ue', general: 1400, costIdx: 85 },
  portugal: { name: 'Portugal', region: 'ue', general: 1400, costIdx: 85 },
  republicacheca: { name: 'República Checa', region: 'ue', general: 1600, costIdx: 90 },
  rumania: { name: 'Rumanía', region: 'ue', general: 1100, costIdx: 80 },
  suecia: { name: 'Suecia', region: 'ue', general: 4300, costIdx: 128 },

  // ✅ UE estricta (faltaban algunos si quitamos Dinamarca):
  // Para no romper tu UI ahora mismo, lo dejo como venía tu lista.

  // ======== HISPANOHABLANTES (SOBERANOS) ========
  argentina: { name: 'Argentina', region: 'hispano', general: 400, costIdx: 55 },
  bolivia: { name: 'Bolivia', region: 'hispano', general: 350, costIdx: 48 },
  chile: { name: 'Chile', region: 'hispano', general: 900, costIdx: 70 },
  colombia: { name: 'Colombia', region: 'hispano', general: 450, costIdx: 50 },
  costarica: { name: 'Costa Rica', region: 'hispano', general: 800, costIdx: 68 },
  cuba: { name: 'Cuba', region: 'hispano', general: 100, costIdx: 40 },
  ecuador: { name: 'Ecuador', region: 'hispano', general: 500, costIdx: 52 },
  elsalvador: { name: 'El Salvador', region: 'hispano', general: 400, costIdx: 50 },
  guatemala: { name: 'Guatemala', region: 'hispano', general: 450, costIdx: 50 },
  guineaecuatorial: { name: 'Guinea Ecuatorial', region: 'hispano', general: 700, costIdx: 60 },
  honduras: { name: 'Honduras', region: 'hispano', general: 400, costIdx: 48 },
  mexico: { name: 'México', region: 'hispano', general: 600, costIdx: 60 },
  nicaragua: { name: 'Nicaragua', region: 'hispano', general: 350, costIdx: 46 },
  panama: { name: 'Panamá', region: 'hispano', general: 950, costIdx: 78 },
  paraguay: { name: 'Paraguay', region: 'hispano', general: 450, costIdx: 50 },
  peru: { name: 'Perú', region: 'hispano', general: 550, costIdx: 58 },
  republicadominicana: { name: 'República Dominicana', region: 'hispano', general: 500, costIdx: 58 },
  uruguay: { name: 'Uruguay', region: 'hispano', general: 850, costIdx: 75 },
  venezuela: { name: 'Venezuela', region: 'hispano', general: 200, costIdx: 45 },
};

/**
 * costIdx automático si un país no trae costIdx
 */
function autoCostIdx(region: 'ue' | 'hispano', general: number) {
  if (region === 'ue') {
    const minS = 900;
    const maxS = 5500;
    const t = Math.min(1, Math.max(0, (general - minS) / (maxS - minS)));
    return Math.round(75 + t * (145 - 75));
  }
  const minS = 100;
  const maxS = 950;
  const t = Math.min(1, Math.max(0, (general - minS) / (maxS - minS)));
  return Math.round(40 + t * (80 - 40));
}

function buildCountryData(base: BaseCountry): CountryData {
  const costIdx = base.costIdx ?? autoCostIdx(base.region, base.general);

  const out: any = {
    name: base.name,
    region: base.region,
    costIdx,
  };

  (Object.keys(sectorMultipliers) as SectorKey[]).forEach((k) => {
    out[k] = Math.round(base.general * sectorMultipliers[k]);
  });

  out.general = base.general; // exacto
  return out as CountryData;
}

// salaryData completo (todos los países)
const salaryData: Record<string, CountryData> = Object.fromEntries(
  Object.entries(baseCountries).map(([key, base]) => [key, buildCountryData(base)])
);

const suizaSalary: Record<SectorKey, number> & { costIdx: number } = {
  general: 6905,
  tech: 9200,
  finance: 11800,
  health: 8700,
  eng: 8500,
  hospitality: 4000,
  construction: 5200,
  logistics: 4500,
  sales: 5800,
  costIdx: 175,
};

export function Calculadora({ compact = false, onClose }: { compact?: boolean; onClose?: () => void }) {
  const [mode, setMode] = useState<Mode>('ch');
  const [region, setRegion] = useState<RegionFilter>('hispano');

  // selects
  const [countryKey, setCountryKey] = useState<string>('espana'); // (modo CH) país comparado vs Suiza
  const [originKey, setOriginKey] = useState<string>('argentina'); // (modo pvp) país A
  const [destKey, setDestKey] = useState<string>('chile'); // (modo pvp) país B
  const [sector, setSector] = useState<SectorKey>('general');

  // por defecto 0
  const [salaryOwn, setSalaryOwn] = useState<number | ''>(0);

  const countriesList = useMemo(() => {
    const entries = Object.entries(salaryData);
    const filtered =
      region === 'all' ? entries : entries.filter(([, v]) => v.region === region);
    return filtered.sort((a, b) => a[1].name.localeCompare(b[1].name, 'es'));
  }, [region]);

  // FIX: si cambias región o modo, forzamos keys válidas (y que A != B)
  useEffect(() => {
    const keys = countriesList.map(([k]) => k);
    if (keys.length === 0) return;

    const pickFirst = () => keys[0];
    const pickDifferent = (notKey: string) => keys.find((k) => k !== notKey) ?? keys[0];

    if (mode === 'ch') {
      if (!keys.includes(countryKey)) setCountryKey(pickFirst());
    } else {
      let nextOrigin = originKey;
      let nextDest = destKey;

      if (!keys.includes(nextOrigin)) nextOrigin = pickFirst();
      if (!keys.includes(nextDest)) nextDest = pickDifferent(nextOrigin);
      if (nextDest === nextOrigin) nextDest = pickDifferent(nextOrigin);

      if (nextOrigin !== originKey) setOriginKey(nextOrigin);
      if (nextDest !== destKey) setDestKey(nextDest);
    }
  }, [mode, region, countriesList, countryKey, originKey, destKey]);

  const compCountry = salaryData[countryKey] ?? salaryData.espana;
  const originCountry = salaryData[originKey] ?? salaryData.argentina;
  const destCountry = salaryData[destKey] ?? salaryData.chile;

  const result = useMemo(() => {
    const dest =
      mode === 'ch'
        ? ({ name: 'Suiza', isSuiza: true, costIdx: suizaSalary.costIdx } as const)
        : ({ name: destCountry.name, isSuiza: false, costIdx: destCountry.costIdx } as const);

    const comp =
      mode === 'ch'
        ? ({ name: compCountry.name, costIdx: compCountry.costIdx } as const)
        : ({ name: originCountry.name, costIdx: originCountry.costIdx } as const);

    const destVal = mode === 'ch' ? suizaSalary[sector] : destCountry[sector] ?? 0;
    const compVal = mode === 'ch' ? compCountry[sector] ?? 0 : originCountry[sector] ?? 0;

    const diff = destVal - compVal;
    const diffPct = compVal > 0 ? Math.round((diff / compVal) * 100) : 0;

    // coste vida
    let costValue = '';
    let costSub = '';

    if (mode === 'ch') {
      const costDiff = suizaSalary.costIdx - compCountry.costIdx;
      costValue = `+${costDiff}%`;
      costSub = `coste de vida mayor en Suiza vs ${compCountry.name}`;
    } else {
      const costDiff = originCountry.costIdx - destCountry.costIdx;
      if (costDiff > 0) {
        costValue = `-${costDiff}%`;
        costSub = `coste de vida menor en ${destCountry.name} vs ${originCountry.name}`;
      } else if (costDiff < 0) {
        costValue = `+${Math.abs(costDiff)}%`;
        costSub = `coste de vida mayor en ${destCountry.name} vs ${originCountry.name}`;
      } else {
        costValue = '≈ igual';
        costSub = 'coste de vida similar';
      }
    }

    const maxVal = Math.max(destVal, compVal, 1);
    const destWidth = Math.round((destVal / maxVal) * 100);
    const compWidth = Math.round((compVal / maxVal) * 100);

    return {
      dest,
      comp,
      destVal,
      compVal,
      diff,
      diffPct,
      costValue,
      costSub,
      destWidth,
      compWidth,
    };
  }, [mode, sector, compCountry, originCountry, destCountry]);

  // Texto dinámico SEO
  const seoText = useMemo(() => {
    const sectorLabel = sectorNames[sector];

    if (mode === 'ch') {
      return `En ${sectorLabel}, una persona en ${compCountry.name} podría ganar aproximadamente ${fmt(
        Math.abs(result.diffPct)
      )}% ${result.diffPct >= 0 ? 'más' : 'menos'} trabajando en Suiza.`;
    }

    return `En ${sectorLabel}, una persona en ${originCountry.name} podría ganar aproximadamente ${fmt(
      Math.abs(result.diffPct)
    )}% ${result.diffPct >= 0 ? 'más' : 'menos'} trabajando en ${destCountry.name}.`;
  }, [mode, sector, result.diffPct, compCountry.name, originCountry.name, destCountry.name]);

  // CTA WhatsApp (mensaje dinámico)
  const whatsappLink = useMemo(() => {
    const sectorLabel = sectorNames[sector];
    const where =
      mode === 'ch'
        ? `Comparé ${compCountry.name} vs Suiza`
        : `Comparé ${originCountry.name} vs ${destCountry.name}`;

    const text = `Hola Kevin, acabo de usar la calculadora de Migrante Global. ${where}. Sector: ${sectorLabel}. ¿Me puedes orientar con los próximos pasos para migrar?`;
    return `https://wa.me/41772337353?text=${encodeURIComponent(text)}`;
  }, [mode, sector, compCountry.name, originCountry.name, destCountry.name]);

  // Ahorro potencial (solo cuando destino = Suiza)
  const savings = useMemo(() => {
    if (mode !== 'ch') return null;

    // Aproximación simple (ajustable):
    const livingCostCHF = 3500; // “coste de vida promedio” (tú lo ajustas cuando quieras)
    const salaryCHF = suizaSalary[sector];
    const savingsCHF = salaryCHF - livingCostCHF;

    return {
      livingCostCHF,
      salaryCHF,
      savingsCHF,
    };
  }, [mode, sector]);

  const sectorCards = useMemo(() => {
    const keys = Object.keys(sectorNames) as SectorKey[];
    if (mode === 'ch') {
      return keys.map((k) => ({
        key: k,
        label: sectorNames[k],
        aVal: compCountry[k],
        aName: compCountry.name,
        bVal: suizaSalary[k],
        bName: 'Suiza',
      }));
    }
    return keys.map((k) => ({
      key: k,
      label: sectorNames[k],
      aVal: originCountry[k],
      aName: originCountry.name,
      bVal: destCountry[k],
      bName: destCountry.name,
    }));
  }, [mode, compCountry, originCountry, destCountry]);

  /* ─── Inner content shared between compact & full mode ─── */
  const calcInner = (
    <>
      {/* MODO + REGIÓN en una sola fila */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {/* Modo */}
        <div className="calc-mode" style={{ marginBottom: 0 }}>
          <button type="button" className={`calc-mode-btn ${mode === 'ch' ? 'active' : ''}`} onClick={() => setMode('ch')}>
            🇨🇭 CH vs País
          </button>
          <button type="button" className={`calc-mode-btn ${mode === 'pvp' ? 'active' : ''}`} onClick={() => setMode('pvp')}>
            🌍 País vs País
          </button>
        </div>
        {/* Separador */}
        <div style={{ width: 1, height: 28, background: 'rgba(128,128,128,0.2)', flexShrink: 0 }} />
        {/* Región */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['hispano', 'ue', 'all'] as RegionFilter[]).map(r => (
            <button
              key={r}
              type="button"
              className={`calc-tab ${region === r ? 'active' : ''}`}
              style={{ marginBottom: 0 }}
              onClick={() => setRegion(r)}
            >
              {r === 'hispano' ? '🌎 Hispanoamérica' : r === 'ue' ? '🇪🇺 UE' : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      <div className="calc-main" style={{ padding: compact ? '18px 14px' : '28px 32px' }}>
        {/* SELECTORES — 2 cols en modal, 3 cols en full */}
        <div className="calc-top" style={{ gap: 12, marginBottom: 20, gridTemplateColumns: compact ? '1fr 1fr' : undefined }}>
          {mode === 'ch' ? (
            <div className="calc-group">
              <label>🌍 TU PAÍS ACTUAL</label>
              <select value={countryKey} onChange={(e) => setCountryKey(e.target.value)}>
                {countriesList.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div className="calc-group">
                <label>🌍 PAÍS ORIGEN</label>
                <select value={originKey} onChange={(e) => setOriginKey(e.target.value)}>
                  {countriesList.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </div>
              <div className="calc-group">
                <label>🎯 PAÍS DESTINO</label>
                <select value={destKey} onChange={(e) => setDestKey(e.target.value)}>
                  {countriesList.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="calc-group">
            <label>💼 SECTOR</label>
            <select value={sector} onChange={(e) => setSector(e.target.value as SectorKey)}>
              {(Object.keys(sectorNames) as SectorKey[]).map((k) => (
                <option key={k} value={k}>{sectorNames[k]}</option>
              ))}
            </select>
          </div>
          {!compact && (
            <div className="calc-group">
              <label>💰 TU SALARIO (opcional)</label>
              <input
                type="number"
                placeholder="0"
                value={salaryOwn}
                onChange={(e) => setSalaryOwn(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* RESULTADOS — 4 tarjetas compactas */}
        <div className="calc-results-grid" style={{ gap: 10, marginBottom: 16 }}>
          <div className="calc-card highlight" style={{ padding: 14 }}>
            <div className="cc-label">{result.dest.isSuiza ? '🇨🇭 SUIZA' : '🎯 DESTINO'}</div>
            <div className="cc-value" style={{ fontSize: 20 }}>{fmt(result.destVal)} {result.dest.isSuiza ? 'CHF' : '€'}</div>
            <div className="cc-sub">{sectorNames[sector]}</div>
          </div>
          <div className="calc-card" style={{ padding: 14 }}>
            <div className="cc-label">🌍 {result.comp.name.toUpperCase()}</div>
            <div className="cc-value" style={{ fontSize: 20 }}>{fmt(result.compVal)} €</div>
            <div className="cc-sub">Promedio sector</div>
          </div>
          <div className="calc-card" style={{ padding: 14 }}>
            <div className="cc-label">📈 DIFERENCIA</div>
            <div className="cc-value" style={{ fontSize: 20 }}>{result.diffPct >= 0 ? '+' : ''}{fmt(result.diffPct)}%</div>
            <div className="cc-sub">{result.diff >= 0 ? '+' : ''}{fmt(result.diff)} {result.dest.isSuiza ? 'CHF' : '€'}</div>
          </div>
          <div className="calc-card" style={{ padding: 14 }}>
            <div className="cc-label">🏠 VIDA</div>
            <div className="cc-value" style={{ fontSize: 20 }}>{result.costValue}</div>
            <div className="cc-sub" style={{ fontSize: 10 }}>{result.costSub}</div>
          </div>
        </div>

        {/* BARRAS — más delgadas */}
        <div className="calc-visual" style={{ marginBottom: 14 }}>
          <div className="calc-bar-row" style={{ marginBottom: 6 }}>
            <span className="calc-bar-name">B</span>
            <div className="calc-bar-track" style={{ height: 18 }}>
              <div className={`calc-bar-fill ${result.dest.isSuiza ? 'ch' : 'dest'}`} style={{ width: `${Math.max(8, result.destWidth)}%` }}>
                {fmt(result.destVal)} {result.dest.isSuiza ? 'CHF' : '€'}
              </div>
            </div>
          </div>
          <div className="calc-bar-row" style={{ marginBottom: 0 }}>
            <span className="calc-bar-name">A</span>
            <div className="calc-bar-track" style={{ height: 18 }}>
              <div className="calc-bar-fill comp" style={{ width: `${Math.max(8, result.compWidth)}%` }}>
                {fmt(result.compVal)} €
              </div>
            </div>
          </div>
        </div>

        {/* INSIGHT + AHORRO en una sola fila */}
        <div style={{ display: 'grid', gridTemplateColumns: savings ? '1fr 1fr' : '1fr', gap: 8, marginBottom: 16 }}>
          <div className="calc-card" style={{ padding: 12 }}>
            <div className="cc-label" style={{ marginBottom: 4 }}>🧠 Insight</div>
            <div className="calc-insight-text" style={{ fontSize: 12, lineHeight: 1.45 }}>{seoText}</div>
          </div>
          {savings && (
            <div className="calc-card" style={{ padding: 12 }}>
              <div className="cc-label" style={{ marginBottom: 4 }}>📊 Ahorro potencial</div>
              <div className="calc-insight-text" style={{ fontSize: 12, lineHeight: 1.6 }}>
                <div>Salario: {fmt(savings.salaryCHF)} CHF</div>
                <div>Gastos: ~{fmt(savings.livingCostCHF)} CHF</div>
                <div>Ahorro: <strong className="calc-savings-strong">{fmt(savings.savingsCHF)} CHF/mes</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a
            href="/#contacto"
            onClick={() => onClose?.()}
            style={{
              background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: 13,
              boxShadow: '0 3px 0 #7f1d1d, 0 5px 14px rgba(0,0,0,0.3)',
            }}
          >
            Quiero orientación personalizada →
          </a>
        </div>

        <p className="calc-note" style={{ marginTop: 10, fontSize: 10 }}>
          ⚠ Datos orientativos. Los salarios reales varían según experiencia, cantón y empresa.
        </p>
      </div>
    </>
  );

  /* ─── Compact mode (dentro de modal) ─── */
  if (compact) {
    return (
      <div style={{ padding: '12px 0 16px' }}>
        <div className="calc-wrapper" style={{ marginTop: 0 }}>
          {calcInner}
        </div>
      </div>
    );
  }

  /* ─── Full mode (en la landing) ─── */
  return (
    <section id="calculadora" className="calc-section">
      <div className="container">
        <div className="section-tag">HERRAMIENTA</div>
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-6 h-6 text-red-500" />
          <h2 className="section-title">Calculadora de salarios: compara países.</h2>
        </div>
        <p className="section-text">
          Compara salarios por sector entre países (Hispanoamérica y UE) y también contra Suiza. Datos orientativos.
        </p>
        <p className="mt-2 text-xs text-[rgba(255,255,255,0.6)] max-w-[650px]">
          Herramienta orientativa basada en promedios nacionales. No debe usarse como asesoramiento financiero ni base única para decisiones.
        </p>
        <div className="calc-wrapper">
          {calcInner}
        </div>
      </div>
    </section>
  );
}