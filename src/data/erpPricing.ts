import type { ModuleKey } from './erpModules'

/**
 * Abonamentul ANDAXI ERP pe module. Toate prețurile stau aici: calculatorul de
 * pe /preturi, cardurile pachetelor și datele structurate (src/seo.ts) citesc
 * de aici. Prețurile sunt în euro, pe lună, fără TVA.
 *
 * Abonamentul = baza (cu primul om) + modulele alese (sau un pachet, dacă iese
 * mai ieftin) + aparatele și magazinele în plus + oamenii în plus, apoi
 * reducerea perioadei de plată.
 */

/** Cursul folosit doar ca să arătăm aproximativ și suma în lei. */
export const CURS_EUR_LEI = 5.3

/** Baza: facturi și e-Factura, contabilitate, bancă, declarații. Cu 1 om. */
export const PRET_BAZA = 29

/** Implementarea, migrarea și instruirea, când plata e lunară sau pe 6 luni. */
export const PRET_IMPLEMENTARE = 149

/** Modulele care se pot alege (trunchiul e baza). */
export type ModulPlatit = Exclude<ModuleKey, 'core'>

export interface PretModul {
  pret: number
  /** O jumătate de rând, pentru lista din calculator. */
  scurt: string
  /** Ce se mai poate adăuga la modul, pe bucată (aparate, magazine). */
  extra?: { eticheta: string; pret: number }
  /** Nu are preț lunar: se plătește fiecare întrebare reușită (asistentul AI).
   *  Prețul pe întrebare îl stabilim la ofertă, de aceea nu apare pe site. */
  peIntrebare?: boolean
}

export const PRETURI_MODULE: Record<ModulPlatit, PretModul> = {
  gestiune: { pret: 15, scurt: 'stoc pe loturi, expirare, gestiuni' },
  achizitii: { pret: 8, scurt: 'NIR, e-Facturi primite din SPV' },
  casierie: { pret: 4, scurt: 'chitanțe, registru de casă' },
  casa_marcat: {
    pret: 10,
    scurt: 'bonuri pe Datecs, rapoarte Z',
    extra: { eticheta: 'Case de marcat în plus', pret: 5 },
  },
  avize: { pret: 4, scurt: 'marfa pleacă înaintea facturii' },
  avansuri: { pret: 4, scurt: 'facturi de avans, scăzute la livrare' },
  magazin_online: {
    pret: 15,
    scurt: 'comenzi de pe site, stoc rezervat, AWB',
    extra: { eticheta: 'Magazine online în plus', pret: 8 },
  },
  mijloace_fixe: { pret: 6, scurt: 'registru, amortizare lunară' },
  reguli_vanzare: { pret: 15, scurt: 'prețuri pe client, agenți, echipe' },
  transformari: { pret: 20, scurt: 'producție: rețete, lot și cost' },
  crm: { pret: 10, scurt: 'legătura cu ANDAXI CRM al agenților' },
  chatbot: { pret: 0, scurt: 'răspunde din manual, în program', peIntrebare: true },
}

/** Prețul modulului, scurt: „15 €” sau „pe întrebare”. */
export const etichetaPret = (k: ModulPlatit, peLuna = false) =>
  PRETURI_MODULE[k].peIntrebare
    ? 'pe întrebare'
    : `${PRETURI_MODULE[k].pret} €${peLuna ? '/lună' : ''}`

export interface PlanErp {
  key: string
  name: string
  /** Pentru cine e, pe scurt. */
  pentru: string
  pret: number
  modules: ModulPlatit[]
  /** Planul scos în față. */
  recomandat?: boolean
}

const TOATE = Object.keys(PRETURI_MODULE) as ModulPlatit[]

/**
 * Pachetele. Primele patru apar ca planuri pe /preturi, restul ca scurtături.
 * Pachetele pe tip de firmă de pe /erp (BUNDLES din erpModules.ts) au aceleași
 * module și aceleași prețuri: le iau de aici.
 */
export const PLANURI: PlanErp[] = [
  {
    key: 'start',
    name: 'Start',
    pentru: 'Firmă mică: facturi, stoc și casă.',
    pret: 39,
    modules: ['gestiune', 'casierie', 'avize'],
  },
  {
    key: 'retail',
    name: 'Retail',
    pentru: 'Magazin fizic, cu casă de marcat.',
    pret: 55,
    modules: ['gestiune', 'achizitii', 'casierie', 'casa_marcat', 'avize'],
    recomandat: true,
  },
  {
    key: 'distributie',
    name: 'Distribuție',
    pentru: 'Depozit, agenți, prețuri pe client.',
    pret: 69,
    modules: ['gestiune', 'achizitii', 'avize', 'avansuri', 'casierie', 'reguli_vanzare', 'crm'],
  },
  {
    key: 'complet',
    name: 'Complet',
    pentru: 'Tot programul, toate modulele.',
    pret: 109,
    modules: TOATE,
  },
  {
    key: 'servicii',
    name: 'Servicii',
    pentru: 'Fără marfă: consultanță, service.',
    pret: 45,
    modules: ['avansuri', 'casierie', 'crm', 'mijloace_fixe', 'chatbot'],
  },
  {
    key: 'magazin-online',
    name: 'Magazin online',
    pentru: 'Vinzi pe site și prin curier.',
    pret: 65,
    modules: ['gestiune', 'achizitii', 'casierie', 'casa_marcat', 'avize', 'magazin_online'],
  },
  {
    key: 'productie',
    name: 'Producție',
    pentru: 'Faci produse din materie primă.',
    pret: 69,
    modules: ['gestiune', 'achizitii', 'avize', 'casierie', 'transformari', 'mijloace_fixe'],
  },
]

export const PLANURI_PRINCIPALE = ['start', 'retail', 'distributie', 'complet']

export const getPlan = (key: string): PlanErp | undefined => PLANURI.find((p) => p.key === key)

export interface PerioadaPlata {
  key: string
  label: string
  luni: number
  reducere: number
}

export const PERIOADE: PerioadaPlata[] = [
  { key: '1', label: 'Lunar', luni: 1, reducere: 0 },
  { key: '6', label: '6 luni', luni: 6, reducere: 0.05 },
  { key: '12', label: '12 luni', luni: 12, reducere: 0.15 },
  { key: '24', label: '24 luni', luni: 24, reducere: 0.2 },
]

/** De la câte luni implementarea e gratuită. */
export const LUNI_IMPLEMENTARE_GRATUITA = 12

/** Treptele pentru oamenii în plus: fiecare treaptă se aplică doar oamenilor
 *  din ea, deci un om în plus nu scade niciodată totalul. */
export const TREPTE_OAMENI = [
  { pana: 5, pret: 25 },
  { pana: 10, pret: 22 },
  { pana: Infinity, pret: 19 },
]

/** Cât costă oamenii în plus (primul e în bază). */
export function costOameni(n: number): number {
  let s = 0
  for (let i = 2; i <= n; i++) s += TREPTE_OAMENI.find((t) => i <= t.pana)!.pret
  return s
}

/** Spațiul rămâne ca până acum: pe numărul de oameni. */
export function spatiuInclus(n: number): string {
  return n <= 5 ? '2 GB' : n <= 10 ? '10 GB' : '15 GB'
}

/** Modulele alese, cu cele fără de care nu pornesc. */
export function cuDependente(sel: Iterable<ModulPlatit>, necesita: (k: ModulPlatit) => ModulPlatit[]) {
  const out = new Set<ModulPlatit>()
  const add = (k: ModulPlatit) => {
    if (out.has(k)) return
    out.add(k)
    necesita(k).forEach(add)
  }
  for (const k of sel) add(k)
  return out
}

export interface Calcul {
  /** Baza + fiecare modul luat separat. */
  separat: number
  /** Cel mai ieftin drum: separat sau un pachet plus ce lipsește din el. */
  pret: number
  pachet: PlanErp | null
  /** Ce dă pachetul peste ce ai ales. */
  inPlus: ModulPlatit[]
  /** Modulele alese care nu sunt în pachet. */
  pestePachet: ModulPlatit[]
  extra: number
  oameni: number
  brut: number
  perioada: PerioadaPlata
  lunar: number
  /** Cât plătești o dată, pe toată perioada. */
  platit: number
  implementare: number
  economiePachet: number
}

/** Calculul abonamentului. `sel` are deja dependențele (vezi cuDependente). */
export function calculeaza(
  sel: Set<ModulPlatit>,
  nrOameni: number,
  perioadaKey: string,
  bucatiExtra: Partial<Record<ModulPlatit, number>>,
): Calcul {
  const pretModule = (keys: ModulPlatit[]) => keys.reduce((s, k) => s + PRETURI_MODULE[k].pret, 0)
  const separat = PRET_BAZA + pretModule([...sel])
  let best: Pick<Calcul, 'pret' | 'pachet' | 'inPlus' | 'pestePachet'> = {
    pret: separat,
    pachet: null,
    inPlus: [],
    pestePachet: [...sel],
  }
  for (const P of PLANURI) {
    const peste = [...sel].filter((k) => !P.modules.includes(k))
    const pret = P.pret + pretModule(peste)
    if (pret < best.pret) {
      best = { pret, pachet: P, inPlus: P.modules.filter((k) => !sel.has(k)), pestePachet: peste }
    }
  }
  const extra = [...sel].reduce(
    (s, k) => s + (PRETURI_MODULE[k].extra ? (bucatiExtra[k] ?? 0) * PRETURI_MODULE[k].extra!.pret : 0),
    0,
  )
  const oameni = costOameni(nrOameni)
  const brut = best.pret + extra + oameni
  const perioada = PERIOADE.find((p) => p.key === perioadaKey) ?? PERIOADE[0]
  const lunar = brut * (1 - perioada.reducere)
  return {
    separat,
    ...best,
    extra,
    oameni,
    brut,
    perioada,
    lunar,
    platit: lunar * perioada.luni,
    implementare: perioada.luni >= LUNI_IMPLEMENTARE_GRATUITA ? 0 : PRET_IMPLEMENTARE,
    economiePachet: separat - best.pret,
  }
}

/** Prețul unui plan, așa cum apare pe card: cu oamenii și reducerea alese. */
export function pretPlan(P: PlanErp, nrOameni: number, perioadaKey: string): number {
  const perioada = PERIOADE.find((p) => p.key === perioadaKey) ?? PERIOADE[0]
  return (P.pret + costOameni(nrOameni)) * (1 - perioada.reducere)
}

/** Baza + modulele planului luate separat (fără oameni). */
export function pretSeparat(P: PlanErp): number {
  return PRET_BAZA + P.modules.reduce((s, k) => s + PRETURI_MODULE[k].pret, 0)
}

/** Euro în stil românesc: virgulă zecimală, punct la mii. */
export const eur = (v: number) => {
  const r = Math.round(v * 100) / 100
  return `${r.toLocaleString('ro-RO', {
    minimumFractionDigits: Number.isInteger(r) ? 0 : 2,
    maximumFractionDigits: 2,
  })} €`
}

export const lei = (v: number) => `${Math.round(v * CURS_EUR_LEI).toLocaleString('ro-RO')} lei`
