import type { ModuleKey } from './erpModules'

/**
 * Capturile de ecran din ANDAXI ERP pentru prezentarea de pe /erp.
 *
 * Imaginile stau în public/img/erp/<key>.webp (1600×1000), făcute pe o firmă
 * demo. Ordinea contează: filele prezentării sunt pașii firmei (`flow`, din
 * src/data/erpFlow.ts), iar ecranele aceluiași pas se derulează unul după
 * altul. Dacă o imagine lipsește sau nu se încarcă, componenta desenează în
 * locul ei o schiță a ecranului, cu aceleași proporții.
 *
 * Titlurile și explicațiile vin din manifestul capturilor; două au fost
 * îndreptate după program: pe factură lotul nu se propune după expirare (doar
 * la casă), iar recepțiile se contează cu un clic, nu singure.
 */
export interface ErpShot {
  key: string
  /** Pasul din fluxul firmei pe care îl ilustrează. */
  flow: string
  module: ModuleKey
  title: string
  caption: string
  /** Adresa din bara browserului, ca în program. */
  path: string
  image?: string
  /** Pentru schița de rezervă: eticheta stării evidențiate. */
  pill?: string
  /** Pentru schița de rezervă: capetele de tabel. */
  columns?: string[]
}

const img = (key: string) => `/img/erp/${key}.webp`

export const ERP_SHOTS: ErpShot[] = [
  // 01 · Vinzi
  {
    key: 'factura',
    flow: 'vinzi',
    module: 'core',
    title: 'Factură cu e-Factura',
    caption:
      'Fiecare linie poartă gestiunea și lotul, iar XML-ul e-Factura se generează, se validează și se trimite în SPV din aceeași pagină.',
    path: '/facturare/2417',
    image: img('factura'),
    pill: 'Acceptată ANAF',
    columns: ['Număr', 'Client', 'Total', 'e-Factura'],
  },
  {
    key: 'factura-loturi',
    flow: 'vinzi',
    module: 'gestiune',
    title: 'Linii de factură pe lot',
    caption:
      'Pe fiecare linie alegi gestiunea și lotul, cu data de expirare și costul lotului alături. Dacă lotul nu ajunge, programul îți propune loturile care expiră primul.',
    path: '/facturare/nou',
    image: img('factura-loturi'),
  },
  {
    key: 'casa-marcat',
    flow: 'vinzi',
    module: 'casa_marcat',
    title: 'Bon fiscal',
    caption:
      'Scanezi produsele, lotul se alege singur după expirare, iar bonul pleacă la casa de marcat cu numerar, card sau plată mixtă.',
    path: '/facturare/bon-fiscal',
    image: img('casa-marcat'),
  },
  {
    key: 'comenzi-site',
    flow: 'vinzi',
    module: 'magazin_online',
    title: 'Comenzi din magazinul online',
    caption:
      'Comenzile de pe site intră singure în ERP, iar clienții marcați cu risc ies în evidență înainte de aprobare.',
    path: '/comenzi-site',
    image: img('comenzi-site'),
  },

  // 02 · Cumperi
  {
    key: 'efacturi-primite',
    flow: 'cumperi',
    module: 'achizitii',
    title: 'e-Facturi primite din SPV',
    caption:
      'Facturile furnizorilor vin din SPV și se leagă de recepția existentă sau devin NIR cu un clic.',
    path: '/achizitii/e-facturi',
    image: img('efacturi-primite'),
    pill: 'Legat',
    columns: ['Data', 'Furnizor', 'Total', 'Status'],
  },
  {
    key: 'achizitii',
    flow: 'cumperi',
    module: 'achizitii',
    title: 'Recepție NIR — furnizor UE',
    caption:
      'Factura intracomunitară intră pe NIR cu lot și expirare, iar TVA-ul se autocolectează singur prin taxare inversă.',
    path: '/achizitii/facturi-furnizori',
    image: img('achizitii'),
  },
  {
    key: 'transport-nir',
    flow: 'cumperi',
    module: 'achizitii',
    title: 'Transport repartizat pe NIR',
    caption:
      'Factura de transport venită ulterior se împarte pe loturi după valoare, cantitate sau greutate și urcă automat costul mărfii.',
    path: '/achizitii/facturi-furnizori',
    image: img('transport-nir'),
  },

  // 03 · Stoc
  {
    key: 'gestiune',
    flow: 'stoc',
    module: 'gestiune',
    title: 'Stoc pe gestiuni și loturi',
    caption:
      'Stocul fiecărei gestiuni se desface pe loturi, cu data de expirare și cantitățile rezervate pentru comenzile online.',
    path: '/gestiune/gestiuni',
    image: img('gestiune'),
    pill: 'Expiră primul',
    columns: ['Produs', 'Gestiune', 'Lot', 'Expirare'],
  },
  {
    key: 'produs',
    flow: 'stoc',
    module: 'gestiune',
    title: 'Fișa produsului',
    caption:
      'Pentru fiecare lot vezi prețul de pe factură, costul complet cu transportul repartizat și adaosul la vânzare.',
    path: '/nomenclatoare/produse',
    image: img('produs'),
  },

  // 04 · Bani
  {
    key: 'banca',
    flow: 'bani',
    module: 'core',
    title: 'Bancă — import extras de cont',
    caption:
      'Încarci extrasul primit de la bancă (CSV/XLS) și tranzacțiile devin operațiuni gata de repartizat pe facturi.',
    path: '/financiar/banca',
    image: img('banca'),
    pill: 'Validată',
    columns: ['Data', 'Explicație', 'Încasări', 'Plăți'],
  },
  {
    key: 'casierie',
    flow: 'bani',
    module: 'casierie',
    title: 'Casa',
    caption:
      'Chitanțe, dispoziții de plată și bonuri fiscale într-un singur registru, cu soldul de casă la fiecare operațiune.',
    path: '/financiar/casa',
    image: img('casierie'),
  },

  // 05 · Contabilitate
  {
    key: 'contabilitate',
    flow: 'contabilitate',
    module: 'core',
    title: 'Balanța de verificare',
    caption:
      'Balanța sintetică și analitică, din notele contabile: cele mai multe vin singure din documente, restul cu un clic pe „Contează”.',
    path: '/contabilitate/balanta',
    image: img('contabilitate'),
    pill: 'Total general',
    columns: ['Cont', 'Denumire', 'Debit', 'Credit'],
  },
  {
    key: 'mijloace-fixe',
    flow: 'contabilitate',
    module: 'mijloace_fixe',
    title: 'Registrul mijloacelor fixe',
    caption:
      'Registrul arată valoarea de intrare, amortizarea cumulată și valoarea rămasă, iar amortizarea lunară se contează automat.',
    path: '/mijloace-fixe',
    image: img('mijloace-fixe'),
  },
  {
    key: 'rapoarte',
    flow: 'contabilitate',
    module: 'core',
    title: 'Vânzări – Încasări – Datorii',
    caption:
      'Rapoarte interactive cu grupări, totaluri și export în Excel sau PDF, de la vânzări pe client la datorii.',
    path: '/rapoarte',
    image: img('rapoarte'),
  },

  // 06 · ANAF
  {
    key: 'declaratii',
    flow: 'anaf',
    module: 'core',
    title: 'Decontul de TVA (D300)',
    caption:
      'D300, D394, D390 și SAF-T (D406) se generează din jurnalele lunii, gata de depus la ANAF.',
    path: '/contabilitate/tva/declaratii',
    image: img('declaratii'),
    pill: 'Validată',
    columns: ['Declarație', 'Perioadă', 'XML', 'PDF'],
  },
  {
    key: 'declaratii-istoric',
    flow: 'anaf',
    module: 'core',
    title: 'Istoricul declarațiilor',
    caption:
      'Fiecare XML și PDF generat intră în istoric, de unde îl descarci din nou. Pe cele de care ai nevoie le marchezi „Păstrează” și nu se mai șterg.',
    path: '/contabilitate/istoric-generari',
    image: img('declaratii-istoric'),
  },
]
