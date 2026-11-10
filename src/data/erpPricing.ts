import type { ModuleKey } from './erpModules'

/**
 * Abonamentul ANDAXI ERP pe module. Toate prețurile stau aici: calculatorul de
 * pe /preturi, tipurile de firmă de pe /erp și datele structurate (src/seo.ts) citesc
 * de aici. Prețurile sunt în euro, pe lună, fără TVA.
 *
 * Abonamentul = fundația (cu primul om) + modulele alese, fiecare la prețul
 * lui + casele de marcat în plus + oamenii în plus, apoi reducerea
 * perioadei de plată. Fără pachete și fără reduceri de pachet: tipurile de
 * firmă de mai jos doar bifează modulele potrivite.
 */

/** Cursul folosit doar ca să arătăm aproximativ și suma în lei. */
export const CURS_EUR_LEI = 5.3

/** Fundația: nomenclatoare, facturi cu e-Factura, financiar. Cu primul om.
 *  Contabilitatea e modul separat (vezi PRETURI_MODULE). */
export const PRET_BAZA = 12

/** Implementarea, migrarea și instruirea, când plata e lunară sau pe 6 luni. */
export const PRET_IMPLEMENTARE = 149

/** Modulele care se pot alege (fundația e mereu inclusă). */
export type ModulPlatit = Exclude<ModuleKey, 'core'>

export interface PretModul {
  pret: number
  /** O jumătate de rând, pentru lista din calculator. */
  scurt: string
  /** Ce se mai poate adăuga la modul, pe bucată (case de marcat). */
  extra?: { eticheta: string; pret: number }
  /** Nu are preț lunar: se plătește fiecare întrebare reușită (asistentul AI).
   *  Prețul pe întrebare îl stabilim la ofertă, de aceea nu apare pe site. */
  peIntrebare?: boolean
}

export const PRETURI_MODULE: Record<ModulPlatit, PretModul> = {
  contabilitate: { pret: 28, scurt: 'note, balanțe, decont TVA, declarații, bilanț' },
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
  magazin_online: { pret: 15, scurt: 'comenzi de pe site, stoc rezervat, AWB' },
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

/** Tipul firmei: o scurtătură care bifează modulele potrivite și pune numărul
 *  de oameni din exemplu. Prețul e suma modulelor, fără reducere. */
export interface TipFirma {
  key: string
  name: string
  /** Firme de felul ăsta, ca exemplu. */
  exemple: string
  /** Cazul concret de pe card. */
  scenariu: string
  oameni: number
  modules: ModulPlatit[]
  /** Cardul scos în față. */
  recomandat?: boolean
}

export const TIPURI_FIRMA: TipFirma[] = [
  {
    key: 'retail',
    name: 'Magazin cu tejghea',
    exemple: 'Ex.: minimarket, florărie, farmacie, butic',
    scenariu: 'Minimarket cu 3 oameni și o casă de marcat',
    oameni: 3,
    modules: ['gestiune', 'achizitii', 'casierie', 'casa_marcat', 'avize'],
    recomandat: true,
  },
  {
    key: 'distributie',
    name: 'Distribuitor',
    exemple: 'Ex.: distribuție alimentară, cosmetice, materiale',
    scenariu: 'Depozit cu 6 oameni, din care 3 agenți pe teren',
    oameni: 6,
    modules: ['gestiune', 'achizitii', 'avize', 'avansuri', 'casierie', 'reguli_vanzare', 'crm'],
  },
  {
    key: 'magazin-online',
    name: 'Magazin online',
    exemple: 'Ex.: cosmetice, suplimente, piese, cu site și curier',
    scenariu: 'Magazin online cu showroom, 3 oameni',
    oameni: 3,
    modules: ['gestiune', 'achizitii', 'casierie', 'casa_marcat', 'avize', 'magazin_online'],
  },
  {
    key: 'productie',
    name: 'Producător',
    exemple: 'Ex.: brutărie, atelier de mobilă, ambalare',
    scenariu: 'Atelier cu 5 oameni, cu utilajele în evidență',
    oameni: 5,
    modules: ['gestiune', 'achizitii', 'avize', 'casierie', 'transformari', 'mijloace_fixe'],
  },
  {
    key: 'servicii',
    name: 'Firmă de servicii',
    exemple: 'Ex.: service auto, consultanță, agenție, IT',
    scenariu: 'Service cu 4 oameni, avansuri pe lucrări',
    oameni: 4,
    modules: ['avansuri', 'casierie', 'mijloace_fixe'],
  },
  {
    key: 'mica',
    name: 'Firmă mică cu marfă',
    exemple: 'Ex.: revânzător, depozit mic, PFA cu stoc',
    scenariu: 'Un singur om, factură și stoc',
    oameni: 1,
    modules: ['gestiune', 'casierie', 'avize'],
  },
]

export const getTipFirma = (key: string): TipFirma | undefined =>
  TIPURI_FIRMA.find((t) => t.key === key)

/** Toate modulele, cu prețul lor (pentru „de la … până la …”). */
export const TOATE_MODULELE = Object.keys(PRETURI_MODULE) as ModulPlatit[]

/** Fundația + modulele date, fără oameni și fără reducere. */
export const pretModule = (keys: readonly ModulPlatit[]) =>
  PRET_BAZA + keys.reduce((s, k) => s + PRETURI_MODULE[k].pret, 0)

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
  /** Prețul modulelor bifate (fără fundație). */
  module: number
  extra: number
  oameni: number
  brut: number
  perioada: PerioadaPlata
  lunar: number
  /** Cât plătești o dată, pe toată perioada. */
  platit: number
  implementare: number
}

/** Calculul abonamentului. `sel` are deja dependențele (vezi cuDependente). */
export function calculeaza(
  sel: Set<ModulPlatit>,
  nrOameni: number,
  perioadaKey: string,
  bucatiExtra: Partial<Record<ModulPlatit, number>>,
): Calcul {
  const module = pretModule([...sel]) - PRET_BAZA
  const extra = [...sel].reduce(
    (s, k) => s + (PRETURI_MODULE[k].extra ? (bucatiExtra[k] ?? 0) * PRETURI_MODULE[k].extra!.pret : 0),
    0,
  )
  const oameni = costOameni(nrOameni)
  const brut = PRET_BAZA + module + extra + oameni
  const perioada = PERIOADE.find((p) => p.key === perioadaKey) ?? PERIOADE[0]
  const lunar = brut * (1 - perioada.reducere)
  return {
    module,
    extra,
    oameni,
    brut,
    perioada,
    lunar,
    platit: lunar * perioada.luni,
    implementare: perioada.luni >= LUNI_IMPLEMENTARE_GRATUITA ? 0 : PRET_IMPLEMENTARE,
  }
}

/** Prețul exemplului de pe card: modulele și oamenii lui, cu reducerea perioadei. */
export function pretTip(T: TipFirma, perioadaKey: string): number {
  const perioada = PERIOADE.find((p) => p.key === perioadaKey) ?? PERIOADE[0]
  return (pretModule(T.modules) + costOameni(T.oameni)) * (1 - perioada.reducere)
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
