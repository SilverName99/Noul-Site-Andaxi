import { BookText, Landmark, Package, ShoppingCart, Wallet, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleKey } from './erpModules'

/**
 * Drumul unei firme prin ANDAXI ERP: Vinzi → Cumperi → Stoc → Bani →
 * Contabilitate → ANAF. Fiecare afirmație de aici e verificată în manualul
 * programului (ANDAXI-ERP/docs/manual), nu din amintiri.
 */

export interface FlowPoint {
  title: string
  text: string
}

export interface FlowStep {
  /** Ancora secțiunii pe /erp. */
  id: string
  /** Eticheta scurtă din navigatorul de flux. */
  label: string
  icon: LucideIcon
  title: string
  intro: string
  points: FlowPoint[]
  /** Modulele care țin de pasul ăsta (fundația = 'core'). */
  modules: ModuleKey[]
}

export const FLOW: FlowStep[] = [
  {
    id: 'vinzi',
    label: 'Vinzi',
    icon: FileText,
    title: 'Factura pleacă în SPV din același ecran.',
    intro:
      'Scrii factura, o emiți și o trimiți la ANAF.',
    points: [
      {
        title: 'e-Factura, cu răspunsul ANAF pe factură',
        text: 'Apeși „Trimite în SPV” și vezi starea: în prelucrare, acceptată sau respinsă, cu motivul respingerii.',
      },
      {
        title: 'Stocul scade automat, pe gestiune și pe lot',
        text: 'La emitere marfa iese din lotul ales. Dacă lotul nu ajunge, programul te oprește și îți arată loturile care expiră primul.',
      },
      {
        title: 'Bon fiscal la tejghea',
        text: 'Scanezi, încasezi numerar, card sau amândouă, iar bonul iese pe casa.',
      },
      {
        title: 'Aviz azi, factură mâine',
        text: 'Marfa pleacă cu aviz, iar factura o faci din aviz cu un clic. Sau iei avans și îl scazi la livrare.',
      },
      {
        title: 'Prețul fiecărui client, pus singur',
        text: 'Cataloagele și regulile de vânzare dau prețul preferențial direct pe factură.',
      },
      {
        title: 'Fără vânzări sub cost',
        text: 'Pui un adaos minim, iar factura care ar pleca sub el nu se emite.',
      },
    ],
    modules: ['core', 'casa_marcat', 'avize', 'avansuri', 'magazin_online', 'reguli_vanzare'],
  },
  {
    id: 'cumperi',
    label: 'Cumperi',
    icon: ShoppingCart,
    title: 'Factura furnizorului devine NIR, automat.',
    intro:
      'Aduci din SPV facturile primite și faci recepția direct din ele. Costul fiecărui produs iese corect, cu tot cu vamă și transport.',
    points: [
      {
        title: 'Recepție (NIR) din e-Factura primită',
        text: 'Tragi facturile din SPV cu un clic. Furnizorul și produsele cunoscute se potrivesc singure.',
      },
      {
        title: 'Lot, expirare și fabricație pe fiecare linie',
        text: 'Le scrii o dată, la recepție. Lotul și expirarea le regăsești apoi pe stoc, pe factură și pe bon.',
      },
      {
        title: 'Facturi externe, cu curs și vamă',
        text: 'Cursul BNR vine singur. Taxa vamală, accizele și comisionul vamal intră în costul mărfii.',
      },
      {
        title: 'Transportul venit după recepție',
        text: 'Factura de transport sosește peste trei zile? O repartizezi pe NIR după valoare, cantitate sau greutate. Costul devine cel real, și pentru marfa deja vândută.',
      },
      {
        title: 'Retururi și note de credit',
        text: 'Nota de credit și marfa întoarsă furnizorului le treci pe același ecran, pe lotul de unde pleacă.',
      },
      {
        title: 'Mijloace fixe direct de pe factură',
        text: 'Faci fișa mijlocului fix sau a obiectului de inventar chiar de pe linia facturii.',
      },
    ],
    modules: ['achizitii', 'mijloace_fixe'],
  },
  {
    id: 'stoc',
    label: 'Stoc',
    icon: Package,
    title: 'Știi ce ai, unde e și când expiră.',
    intro:
      'Stocul ținut pe gestiuni și pe loturi, cu data expirării. Fiecare mișcare are documentul ei și omul care a făcut-o.',
    points: [
      {
        title: 'Gestiuni multiple',
        text: 'Depozitul, magazinul, mașina agentului.',
      },
      {
        title: 'Loturi cu data expirării (FEFO)',
        text: 'La casă se propune singur lotul care expiră primul. Loturile expirate apar cu roșu și nu se aleg niciodată singure.',
      },
      {
        title: 'PV-uri și bonuri de consum',
        text: 'Bagi marfă fără factură, scoți marfa stricată sau lipsă, consumi materiale intern.',
      },
      {
        title: 'Transformări cu cost calculat',
        text: 'Din materie primă iese produs finit, cu lot și cu costul intrărilor trecut pe el.',
      },
      {
        title: 'Rapoarte de stoc',
        text: 'Balanță de mărfuri și stoc la orice dată, în Excel și PDF, cu semnătura gestionarului.',
      },
      {
        title: 'Vinzi fără stoc în program?',
        text: 'Se poate. Oprești Gestiunea, iar contabilul trece stocul numărat prin inventar intermitent.',
      },
    ],
    modules: ['gestiune', 'transformari'],
  },
  {
    id: 'bani',
    label: 'Bani',
    icon: Wallet,
    title: 'Vezi cine ți-e dator și cât, fără Excel.',
    intro:
      'Banca, casa și curierii într-un singur loc. Știi oricând ce facturi sunt neîncasate și de când.',
    points: [
      {
        title: 'Import extras bancar (CSV, XLS, XLSX)',
        text: 'Tranzacțiile intră singure în program. Le legi de facturi cu un clic: „Stinge de la cel mai vechi”.',
      },
      {
        title: 'Casa, cu chitanțe și registru',
        text: 'Încasări și plăți în numerar, dispoziții și registrul de casă pe zile.',
      },
      {
        title: 'Rambursurile curierilor, potrivite singure',
        text: 'Borderoul de la curier se potrivește pe facturi după AWB, apoi după client și sumă.',
      },
      {
        title: 'Compensări',
        text: 'Clientul e și furnizor? Stingi datoria cu creanța și scoți procesul-verbal.',
      },
      {
        title: 'Scadențar, confirmări de sold și somații',
        text: 'Vezi vechimea fiecărei datorii și scoți confirmarea de sold sau somația în PDF, gata de trimis.',
      },
      {
        title: 'Valută, cu curs BNR adus zilnic',
        text: 'Plătești sau încasezi în euro, iar diferențele de curs se calculează singure.',
      },
    ],
    modules: ['core', 'casierie', 'magazin_online'],
  },
  {
    id: 'conta',
    label: 'Contabilitate',
    icon: BookText,
    title: 'Documentele ajung singure în contabilitate. Sau cu un clic.',
    intro:
      'Monografia vine completată la instalare. Majoritatea documentelor se contează singure, iar restul așteaptă un singur clic.',
    points: [
      {
        title: 'Automat',
        text: 'Facturile, banca, casa, compensările, amortizările și închiderile scriu singure nota contabilă.',
      },
      {
        title: 'Cu un clic pe „Contează”',
        text: 'NIR-urile, PV-urile de intrare și bonurile de consum. Ecranul Verificări îți arată ce a rămas.',
      },
      {
        title: 'Balanțe, fișe și registre',
        text: 'Balanță de verificare și pe parteneri, fișă de cont, registru-jurnal, registru fiscal, bilanț.',
      },
      {
        title: 'Închideri de lună și de an',
        text: 'Închidere de TVA, venituri și cheltuieli, reevaluări valutare, impozit pe profit sau pe venit, dividende.',
      },
    ],
    modules: ['contabilitate', 'mijloace_fixe'],
  },
  {
    id: 'anaf',
    label: 'ANAF',
    icon: Landmark,
    title: 'Declarațiile ies gata de depus.',
    intro:
      'Decontul, D394, D390 și SAF-T ies din aceleași date, fără să le mai introduci o dată. Tu doar le încarci.',
    points: [
      {
        title: 'e-Factura direct în SPV',
        text: 'Trimiți din program și urmărești răspunsul ANAF pe fiecare factură. Pe cele primite le aduci tot de acolo.',
      },
      {
        title: 'D300, D394, D390, D100, D101, D205 și SAF-T (D406)',
        text: 'D300, D394, D390 și D406 se generează din datele tale; la D100, D101 și D205 completezi un formular. Primești XML-ul și PDF-ul oficial cu cod de bare, făcut prin validatorul ANAF (DUKIntegrator).',
      },
      {
        title: 'Jurnale și decont de TVA',
        text: 'Jurnalul de vânzări, jurnalul de cumpărări și decontul, în Excel și PDF.',
      },
    ],
    modules: ['core', 'contabilitate'],
  },
]
