import {
  BookOpenCheck,
  Calculator,
  ClipboardList,
  Coins,
  Combine,
  Factory,
  Map,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  Wallet,
  Warehouse,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPlan } from './erpPricing'

/**
 * Modulele ANDAXI ERP, așa cum sunt în program.
 *
 * Cheile sunt exact `MODULE_KEYS` din ANDAXI-ERP (packages/shared/src/enums.ts),
 * numele sunt cele din catalogul panoului (rege/src/db.ts → CATALOG), iar
 * dependențele sunt `NECESITA` din același fișier. Rândurile de meniu vin din
 * apps/web/src/components/layout/AppShell.tsx. Când se schimbă acolo, se
 * schimbă și aici.
 *
 * Folosit de: secțiunea de module de pe /erp (ancorele paginii sunt cheile),
 * pachetele „Pe tipul tău de firmă”, /preturi și, mai târziu, demo-ul
 * interactiv de pe /erp/demo (unde fiecare card devine un comutator).
 */

export type ModuleKey =
  | 'core'
  | 'contabilitate'
  | 'gestiune'
  | 'achizitii'
  | 'casierie'
  | 'casa_marcat'
  | 'avize'
  | 'avansuri'
  | 'magazin_online'
  | 'mijloace_fixe'
  | 'reguli_vanzare'
  | 'transformari'
  | 'crm'
  | 'chatbot'

export interface MenuGroup {
  /** Grupul din meniul programului (ex. „Vânzări”). */
  group: string
  /** Rândurile pe care le adaugă modulul în grupul ăsta. */
  items: string[]
}

export interface ErpModule {
  key: ModuleKey
  /** Numele din program. */
  name: string
  icon: LucideIcon
  /** O frază, beneficiul. */
  tagline: string
  description: string
  potrivitPentru: string
  /** Modulele fără de care nu pornește (NECESITA). */
  necesita: ModuleKey[]
  /** Ce apare în meniu când modulul e pornit. */
  menu: MenuGroup[]
  /** Butoane sau locuri din afara meniului pe care le aduce. */
  extra?: string[]
  /** Cheie în src/data/erpShots.ts. */
  screenshot?: string
  /** Capitolele din manualul programului (docs/manual/<capitol>.md). */
  manual: string[]
  /** Fundația: mereu pornită, nu se oprește. */
  alwaysOn?: boolean
  /** Pagină dedicată pe site, dacă are. */
  link?: string
}

export const CORE: ErpModule = {
  key: 'core',
  name: 'Fundația',
  icon: Calculator,
  tagline: 'Nomenclatoare, facturi și financiar. Baza pe care stă tot.',
  description:
    'Clienții, produsele și serviciile, facturile cu e-Factura, banca și sumele de repartizat, rapoartele, utilizatorii și backup-ul.',
  potrivitPentru: 'Orice firmă. De aici pornești.',
  necesita: [],
  menu: [
    { group: 'Nomenclatoare', items: ['Clienți', 'Produse', 'Servicii', 'Liste de referință'] },
    { group: 'Vânzări', items: ['Facturi'] },
    { group: 'Financiar', items: ['Banca', 'Sume nerepartizate'] },
    { group: 'Rapoarte', items: ['Rapoarte'] },
    {
      group: 'Setări',
      items: ['Date firmă', 'e-Factură (ANAF)', 'Utilizatori', 'Importuri', 'Jurnal', 'Backup'],
    },
  ],
  screenshot: 'factura',
  manual: ['facturare', 'banca', 'utilizatori', 'backup'],
  alwaysOn: true,
}

export const MODULES: ErpModule[] = [
  {
    // Pe site e modul separat. În program ține încă de fundație; modulul
    // „contabilitate” din MODULE_KEYS vine odată cu separarea lui acolo.
    key: 'contabilitate',
    name: 'Contabilitate',
    icon: BookOpenCheck,
    tagline: 'Note, balanțe, TVA și declarații, din aceleași date.',
    description:
      'Notele contabile ies din documente, automat sau cu un clic. Închideri de lună și de an, balanțe, fișe și registre, decontul de TVA, declarațiile D300, D394, D390 și D406 gata de depus, plus bilanțul.',
    potrivitPentru: 'Firme care țin contabilitatea în program, cu contabilul lor sau intern.',
    necesita: [],
    menu: [
      {
        group: 'Contabilitate',
        items: ['Note contabile', 'Închideri', 'Balanțe și jurnale', 'Decont TVA', 'Declarații', 'Bilanț'],
      },
    ],
    screenshot: 'contabilitate',
    manual: ['note-contabile', 'balante'],
  },
  {
    key: 'gestiune',
    name: 'Gestiune',
    icon: Warehouse,
    tagline: 'Știi exact ce ai pe raft, pe fiecare lot și în fiecare depozit.',
    description:
      'Stocul ținut în program: gestiuni multiple, loturi cu data expirării, transferuri, PV-uri, bonuri de consum și rapoarte de stoc. Factura și bonul scad singure marfa, pe gestiune și pe lot.',
    potrivitPentru: 'Magazine, depozite și distribuitori care vor stocul la zi.',
    necesita: [],
    menu: [
      {
        group: 'Gestiune',
        items: ['Stoc', 'Mișcări', 'Gestiuni', 'Bonuri de consum', 'PV intrare', 'PV ieșire'],
      },
      { group: 'Setări', items: ['Reguli de facturare'] },
    ],
    extra: ['Gestiunea, lotul și data expirării pe factură și pe bon'],
    screenshot: 'gestiune',
    manual: ['stoc', 'miscari-stoc', 'gestiuni', 'pv-stoc', 'bonuri-consum', 'rapoarte-stoc'],
  },
  {
    key: 'achizitii',
    name: 'Achiziții',
    icon: ShoppingCart,
    tagline: 'Factura furnizorului devine NIR fără să tastezi nimic de două ori.',
    description:
      'Facturile de la furnizori cu recepția mărfii (NIR), facturile externe cu vamă și curs, seriile NIR și e-Facturile primite din SPV, din care faci recepția direct. Transportul venit mai târziu se împarte pe NIR, deci costul e cel real.',
    potrivitPentru: 'Firme care cumpără marfă și vor costul real al fiecărui produs.',
    necesita: [],
    menu: [
      {
        group: 'Achiziții',
        items: ['Facturi furnizori', 'Facturi externe furnizori', 'Serii NIR'],
      },
      { group: 'Nomenclatoare', items: ['Furnizori'] },
      { group: 'Financiar', items: ['Compensări'] },
    ],
    extra: ['E-Facturi primite din SPV, din Facturi furnizori'],
    screenshot: 'efacturi-primite',
    manual: ['furnizori-facturi', 'furnizori-externe', 'serii-nir', 'e-facturi', 'furnizori'],
  },
  {
    key: 'casierie',
    name: 'Casierie',
    icon: Wallet,
    tagline: 'Sertarul cu bani, ținut la leu: chitanțe, dispoziții, registru.',
    description:
      'Încasările și plățile în numerar, cu chitanță sau dispoziție, registrul de casă pe zile și soldul inițial. O factură o încasezi în numerar direct de pe ea.',
    potrivitPentru: 'Firme care primesc sau plătesc cash.',
    necesita: [],
    menu: [{ group: 'Financiar', items: ['Casa', 'Registru de casă'] }],
    screenshot: 'casierie',
    manual: ['casa'],
  },
  {
    key: 'casa_marcat',
    name: 'Casă de marcat',
    icon: Receipt,
    tagline: 'Vinzi la tejghea, bonul iese pe Datecs, banii intră singuri în casă.',
    description:
      'Bonul fiscal din program, tipărit pe casa Datecs de un mic agent instalat lângă ea. Pică internetul? Bonurile așteaptă la coadă și nu se pierde niciunul. Plus Rapoartele Z.',
    potrivitPentru: 'Magazine și puncte de vânzare cu tejghea.',
    necesita: ['casierie'],
    menu: [
      { group: 'Vânzări', items: ['Bon fiscal'] },
      { group: 'Financiar', items: ['Rapoarte Z'] },
      { group: 'Setări', items: ['Casă de marcat'] },
    ],
    screenshot: 'casa-marcat',
    manual: ['vanzare-la-casa', 'casa-marcat', 'rapoarte-z'],
  },
  {
    key: 'avize',
    name: 'Avize clienți',
    icon: ClipboardList,
    tagline: 'Marfa pleacă azi, factura o faci când vrei, dintr-un clic.',
    description:
      'Avizul scade marfa din stoc la validare, iar factura se face apoi din aviz, cu „Facturează”. Cu retur de aviz, aviz de mostre și aviz de însoțire pentru factura emisă.',
    potrivitPentru: 'Distribuitori care livrează înainte să factureze.',
    necesita: ['gestiune'],
    menu: [{ group: 'Vânzări', items: ['Avize clienți'] }],
    extra: ['Butonul „Emite aviz” pe factura emisă'],
    manual: ['avize'],
  },
  {
    key: 'avansuri',
    name: 'Avansuri clienți',
    icon: Coins,
    tagline: 'Iei avansul acum, iar la livrare se scade singur.',
    description:
      'Facturi de avans cu 30%, 50% sau 100% dintr-un clic. Când pleacă marfa, „Livrează marfa” pregătește factura finală cu avansul deja scăzut.',
    potrivitPentru: 'Firme care lucrează pe comandă sau cu precomenzi.',
    necesita: [],
    menu: [{ group: 'Vânzări', items: ['Avansuri clienți'] }],
    extra: ['Butonul „Avans” pe factură'],
    manual: ['avansuri'],
  },
  {
    key: 'magazin_online',
    name: 'Magazin online',
    icon: ShoppingBag,
    tagline: 'Comenzile de pe site intră singure, cu marfa deja rezervată.',
    description:
      'Comanda ajunge în program cu stocul rezervat pe lot. O aprobi: se emite factura, marfa iese din gestiune, iar AWB-ul se întoarce pe comandă. Borderourile curierilor se potrivesc singure pe facturi.',
    potrivitPentru: 'Firme care vând online. Magazinele făcute de noi se leagă direct.',
    necesita: ['gestiune'],
    menu: [
      { group: 'Vânzări', items: ['Comenzi site'] },
      { group: 'Financiar', items: ['Încasări curieri și procesatori'] },
      { group: 'Setări', items: ['Setări site'] },
    ],
    extra: ['Butonul „Import din site” la Produse'],
    screenshot: 'comenzi-site',
    manual: ['comenzi-site', 'setari-site', 'curieri', 'import-site'],
  },
  {
    key: 'mijloace_fixe',
    name: 'Mijloace fixe',
    icon: Factory,
    tagline: 'Amortizarea se face în fiecare lună, fără calculator în mână.',
    description:
      'Registrul mijloacelor fixe și al obiectelor de inventar. Rulezi amortizarea lunii și nota contabilă iese gata. Fișa bunului o faci direct de pe factura furnizorului.',
    potrivitPentru: 'Firme cu echipamente, mașini, mobilier sau obiecte de inventar.',
    necesita: [],
    menu: [
      {
        group: 'Mijloace fixe',
        items: ['Mijloace fixe', 'Amortizări', 'Obiecte de inventar'],
      },
    ],
    screenshot: 'mijloace-fixe',
    manual: ['mijloace-fixe', 'amortizari', 'obiecte-inventar'],
  },
  {
    key: 'reguli_vanzare',
    name: 'Reguli de vânzare și agenți',
    icon: Tag,
    tagline: 'Fiecare client primește prețul lui, fără să-l mai cauți în Excel.',
    description:
      'Agenți, echipe, reguli de vânzare și cataloage de prețuri. Prețul preferențial al clientului se pune singur pe factură, iar vânzările le vezi pe fiecare agent.',
    potrivitPentru: 'Firme cu agenți de vânzări și prețuri diferite pe client.',
    necesita: [],
    menu: [{ group: 'Nomenclatoare', items: ['Agenți', 'Echipe', 'Reguli de vânzare'] }],
    extra: ['Câmpul „Agent” pe factură'],
    manual: ['agenti', 'echipe', 'reguli-vanzare'],
  },
  {
    key: 'transformari',
    name: 'Transformări',
    icon: Combine,
    tagline: 'Din materie primă iese produs finit, cu lot și cost calculat.',
    description:
      'Combini produse din stoc și obții altele. Costul intrărilor trece pe produsul rezultat, cu lot. Rețetele care se repetă le salvezi ca șabloane.',
    potrivitPentru: 'Producție, ambalare, kituri și pachete.',
    necesita: ['gestiune'],
    menu: [{ group: 'Gestiune', items: ['Transformări'] }],
    manual: ['transformari'],
  },
  {
    key: 'crm',
    name: 'CRM',
    icon: Map,
    tagline: 'Vezi ce vinde fiecare agent de pe teren, cu datele din ERP.',
    description:
      'Legătura cu ANDAXI CRM, aplicația separată pentru agenții de pe teren. În ERP vezi vânzările pe agent, comenzile zilei și stocul agenților.',
    potrivitPentru: 'Echipe de agenți pe teren.',
    necesita: [],
    menu: [
      { group: 'CRM', items: ['Vânzări agent', 'Comenzi (zi)', 'Stoc agenți', 'Import vânzări'] },
    ],
    manual: ['module'],
    link: '/crm',
  },
  {
    key: 'chatbot',
    name: 'Asistent AI',
    icon: Sparkles,
    tagline: 'Întrebi cu vorbele tale, primești răspunsul din manual.',
    description:
      'Asistentul din colțul ecranului răspunde din manualul programului: unde e un ecran, ce înseamnă un mesaj, ce faci mai departe. Nu umblă în datele tale. Manualul rămâne deschis și fără el.',
    potrivitPentru: 'Echipe noi sau oricine vrea un răspuns acum, nu mâine.',
    necesita: [],
    menu: [{ group: 'Setări', items: ['Asistent AI'] }],
    extra: ['Asistentul din bara de sus'],
    manual: ['asistent-ai'],
  },
]

export const ALL_MODULES: ErpModule[] = [CORE, ...MODULES]

const BY_KEY = Object.fromEntries(ALL_MODULES.map((m) => [m.key, m])) as Record<
  ModuleKey,
  ErpModule
>

export const getModule = (key: ModuleKey): ErpModule => BY_KEY[key]

export const isModuleKey = (value: string): value is ModuleKey => value in BY_KEY

/** Modulele care au nevoie de `key` (nu se pot opri cât sunt pornite). */
export const requiredBy = (key: ModuleKey): ModuleKey[] =>
  MODULES.filter((m) => m.necesita.includes(key)).map((m) => m.key)

/** Lista, cu dependențele adăugate, în ordinea din MODULES. */
export const withDependencies = (keys: ModuleKey[]): ModuleKey[] => {
  const set = new Set<ModuleKey>()
  const add = (k: ModuleKey) => {
    if (set.has(k)) return
    set.add(k)
    getModule(k).necesita.forEach(add)
  }
  keys.forEach(add)
  return MODULES.filter((m) => set.has(m.key)).map((m) => m.key)
}

/** Ordinea grupurilor din meniul programului (AppShell.tsx). */
export const MENU_ORDER = [
  'Nomenclatoare',
  'Vânzări',
  'Achiziții',
  'Gestiune',
  'Contabilitate',
  'Financiar',
  'Mijloace fixe',
  'Rapoarte',
  'CRM',
  'Setări',
] as const

export interface BuiltMenuGroup {
  group: string
  items: { label: string; module: ModuleKey }[]
}

/** Meniul programului cu fundația și modulele date pornite. */
export const buildMenu = (active: ModuleKey[]): BuiltMenuGroup[] => {
  const on = [CORE, ...MODULES.filter((m) => active.includes(m.key))]
  return MENU_ORDER.map((group) => ({
    group,
    items: on.flatMap((m) =>
      m.menu
        .filter((g) => g.group === group)
        .flatMap((g) => g.items.map((label) => ({ label, module: m.key }))),
    ),
  })).filter((g) => g.items.length > 0)
}

/* ------------------------------------------------------------------------ */
/* Pachete pe tip de firmă                                                   */
/* ------------------------------------------------------------------------ */

export interface ErpBundle {
  key: string
  name: string
  tagline: string
  description: string
  /** Modulele pachetului (fundația e mereu inclusă). Vin din PLANURI
   *  (erpPricing.ts), ca pachetul de pe /erp să fie același cu cel de pe
   *  /preturi, cu același preț. */
  modules: ModuleKey[]
  /** Prețul pachetului, cu primul om, pe lună (din PLANURI). */
  pret: number
  /** Bune de adăugat, dacă e cazul. */
  optional: ModuleKey[]
}

const dinPlan = (key: string): Pick<ErpBundle, 'modules' | 'pret'> => {
  const plan = getPlan(key)!
  return { modules: plan.modules, pret: plan.pret }
}

export const BUNDLES: ErpBundle[] = [
  {
    key: 'retail',
    name: 'Retail',
    tagline: 'Magazin cu tejghea și raft plin.',
    description:
      'Bonul iese pe casa de marcat, stocul scade pe lot, iar NIR-ul îl faci din factura furnizorului.',
    ...dinPlan('retail'),
    optional: ['reguli_vanzare', 'mijloace_fixe'],
  },
  {
    key: 'distributie',
    name: 'Distribuție',
    tagline: 'Depozit, agenți și livrări cu aviz.',
    description:
      'Marfa pleacă cu aviz, fiecare client are prețul lui, iar agenții își văd vânzările.',
    ...dinPlan('distributie'),
    optional: ['mijloace_fixe', 'chatbot'],
  },
  {
    key: 'magazin-online',
    name: 'Magazin online',
    tagline: 'Comenzi de pe site, facturate la aprobare.',
    description:
      'Comenzile intră singure, cu marfa rezervată, iar rambursurile se potrivesc singure pe facturi. Vinzi și la tejghea, pe casa de marcat.',
    ...dinPlan('magazin-online'),
    optional: ['avansuri', 'reguli_vanzare'],
  },
  {
    key: 'productie',
    name: 'Producție',
    tagline: 'Din materie primă, produs finit cu cost real.',
    description:
      'Transformi materia primă în produs finit, cu lot și cost calculat, și ții registrul utilajelor.',
    ...dinPlan('productie'),
    optional: ['reguli_vanzare', 'avansuri'],
  },
  {
    key: 'servicii',
    name: 'Servicii',
    tagline: 'Fără stoc, cu facturi și bani la zi.',
    description:
      'Facturezi servicii, iei avansuri pe proiect, ții casa și echipamentele. Gestiunea nu-ți încurcă meniul.',
    ...dinPlan('servicii'),
    optional: ['achizitii'],
  },
]
