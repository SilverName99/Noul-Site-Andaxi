import type { LucideIcon } from 'lucide-react'
import {
  CalendarClock,
  ChartColumn,
  Cloud,
  CreditCard,
  FileQuestion,
  Gem,
  Gift,
  HeartHandshake,
  IdCard,
  LayoutTemplate,
  Link2,
  Mail,
  Megaphone,
  MessageCircle,
  Network,
  Newspaper,
  PenLine,
  PersonStanding,
  Rocket,
  Scale,
  ShoppingBag,
  Star,
  Store,
  TicketPercent,
  Truck,
  UserRound,
  Boxes,
} from 'lucide-react'

/**
 * ANDAXI CMS: pachetele de site și plugin-urile, cu prețurile lor. Toate
 * prețurile stau aici: pagina /cms, calculatorul live și secțiunea de pe
 * /preturi citesc de aici. În euro; plugin-urile pe lună, fără TVA.
 *
 * Prețul unui site = pachetul (o dată + găzduirea lunară) + plugin-urile
 * bifate, fiecare la prețul lui pe lună. Ce e inclus în pachet nu se mai plătește.
 */

export type PachetKey = 'landing' | 'prezentare' | 'magazin'

export interface Pachet {
  key: PachetKey
  name: string
  icon: LucideIcon
  /** Plătit o singură dată (realizarea site-ului). */
  oData: number
  /** Găzduire & mentenanță, pe lună. La magazin: „de la”. */
  lunar: number
  lunarDeLa?: boolean
  scurt: string
  /** Plugin-urile incluse în preț. */
  incluse: PluginKey[]
}

export type PluginKey =
  | 'catalog'
  | 'cereri_oferta'
  | 'recenzii'
  | 'precomenzi'
  | 'oferte_bbd'
  | 'pachete_produse'
  | 'produse_promo'
  | 'manechin'
  | 'livrare_fan'
  | 'plata_bt'
  | 'plata_stripe'
  | 'plata_euplatesc'
  | 'link_plata'
  | 'conturi_clienti'
  | 'fidelitate'
  | 'cupoane'
  | 'newsletter'
  | 'campanii'
  | 'chat_live'
  | 'blog'
  | 'donatii'
  | 'membri'
  | 'fisiere_cloud'
  | 'acorduri_gdpr'
  | 'statistici'
  | 'concurenta'
  | 'erp'

export type Categorie = 'produse' | 'plati' | 'clienti' | 'continut' | 'analiza'

export const CATEGORII: { key: Categorie; name: string }[] = [
  { key: 'produse', name: 'Produse și vânzare' },
  { key: 'plati', name: 'Plăți și livrare' },
  { key: 'clienti', name: 'Clienți și marketing' },
  { key: 'continut', name: 'Conținut și comunitate' },
  { key: 'analiza', name: 'Analiză și legături' },
]

export interface Plugin {
  key: PluginKey
  name: string
  icon: LucideIcon
  categorie: Categorie
  /** Pe lună, în euro. */
  pret: number
  /** O jumătate de rând, pentru liste. */
  scurt: string
  /** Ce apare pe site când îl pornești: textul din calculatorul live. */
  explicatie: string
  /** Unde se vede în previzualizare: pe site sau în panoul de administrare. */
  zona: 'site' | 'admin'
  /** Plugin-urile fără de care nu merge (se bifează singure). */
  necesita?: PluginKey[]
  /** Merge doar pe un magazin online (coș, comenzi). */
  doarMagazin?: boolean
  /** Procesator de plăți cu cardul: unul e inclus în pachetul Magazin. */
  procesator?: boolean
}

export const PACHETE: Pachet[] = [
  {
    key: 'landing',
    name: 'Landing page',
    icon: Rocket,
    oData: 250,
    lunar: 50,
    scurt: 'O singură pagină care convinge',
    incluse: [],
  },
  {
    key: 'prezentare',
    name: 'Site de prezentare',
    icon: LayoutTemplate,
    oData: 500,
    lunar: 100,
    scurt: 'Până la 7 pagini, cu blog',
    incluse: ['blog'],
  },
  {
    key: 'magazin',
    name: 'Magazin online',
    icon: ShoppingBag,
    oData: 3000,
    lunar: 150,
    lunarDeLa: true,
    scurt: 'Coș, plăți, curier și ERP',
    incluse: ['catalog', 'blog', 'livrare_fan', 'cupoane', 'erp'],
  },
]

export const PLUGINS: Plugin[] = [
  // ---- Produse și vânzare ----
  {
    key: 'catalog',
    name: 'Catalog de produse',
    icon: Store,
    categorie: 'produse',
    pret: 10,
    scurt: 'produse, categorii, filtre și căutare',
    explicatie:
      'Produsele tale apar pe site, pe categorii, cu filtre și căutare. Fără coș: bun când vrei doar să-ți arăți oferta.',
    zona: 'site',
  },
  {
    key: 'cereri_oferta',
    name: 'Cereri de ofertă',
    icon: FileQuestion,
    categorie: 'produse',
    pret: 5,
    scurt: 'buton „Cere ofertă” pe fiecare produs',
    explicatie:
      'Pe fiecare produs apare butonul „Cere ofertă”. Clientul completează un formular, iar cererea ajunge la tine în admin.',
    zona: 'site',
    necesita: ['catalog'],
  },
  {
    key: 'recenzii',
    name: 'Recenzii',
    icon: Star,
    categorie: 'produse',
    pret: 5,
    scurt: 'stele și păreri, cu moderare',
    explicatie:
      'Clienții lasă stele și păreri la produse. Tu le aprobi înainte să apară, iar spam-ul e oprit automat.',
    zona: 'site',
    necesita: ['catalog'],
  },
  {
    key: 'precomenzi',
    name: 'Precomenzi',
    icon: CalendarClock,
    categorie: 'produse',
    pret: 5,
    scurt: 'vinzi înainte să vină marfa',
    explicatie:
      'Vinzi produse care nu sunt încă pe stoc. Comenzile așteaptă și le eliberezi când vine marfa.',
    zona: 'site',
    doarMagazin: true,
  },
  {
    key: 'oferte_bbd',
    name: 'Oferte cu termen scurt',
    icon: TicketPercent,
    categorie: 'produse',
    pret: 8,
    scurt: 'loturi aproape de expirare, la preț redus',
    explicatie:
      'Produsele cu termen de valabilitate apropiat se vând la preț redus, dintr-un panou „Oferte”. Scapi de stoc, nu de bani.',
    zona: 'site',
    doarMagazin: true,
  },
  {
    key: 'pachete_produse',
    name: 'Pachete de produse',
    icon: Boxes,
    categorie: 'produse',
    pret: 5,
    scurt: 'mai multe produse, vândute împreună',
    explicatie: 'Faci pachete din mai multe produse, cu preț de pachet. Clientul le adaugă în coș dintr-un clic.',
    zona: 'site',
    doarMagazin: true,
  },
  {
    key: 'manechin',
    name: 'Recomandări pe manechin',
    icon: PersonStanding,
    categorie: 'produse',
    pret: 10,
    scurt: 'clientul alege zona corpului',
    explicatie:
      'Clientul apasă pe o zonă a corpului și vede produsele recomandate pentru ea. Ideal pentru farmacii și produse naturiste.',
    zona: 'site',
    necesita: ['catalog'],
  },
  {
    key: 'produse_promo',
    name: 'Mostre și cadouri',
    icon: Gift,
    categorie: 'produse',
    pret: 5,
    scurt: 'adaugi mostre în colete, cu istoric',
    explicatie:
      'În admin adaugi mostre și cadouri în comenzi și vezi tot ce a primit fiecare client, comandă cu comandă.',
    zona: 'admin',
    doarMagazin: true,
  },

  // ---- Plăți și livrare ----
  {
    key: 'livrare_fan',
    name: 'Livrare FAN Courier',
    icon: Truck,
    categorie: 'plati',
    pret: 10,
    scurt: 'AWB automat, FANbox, urmărire colet',
    explicatie:
      'Clientul alege curier la adresă sau FANbox. AWB-ul se face automat, iar clientul își urmărește coletul.',
    zona: 'site',
    doarMagazin: true,
  },
  {
    key: 'plata_bt',
    name: 'Card prin Banca Transilvania',
    icon: CreditCard,
    categorie: 'plati',
    pret: 5,
    scurt: 'card, rate și puncte STAR',
    explicatie:
      'Plata cu cardul prin BT, cu rate și puncte STAR. Banii se încasează abia când aprobi comanda.',
    zona: 'site',
    doarMagazin: true,
    procesator: true,
  },
  {
    key: 'plata_stripe',
    name: 'Card prin Stripe',
    icon: CreditCard,
    categorie: 'plati',
    pret: 5,
    scurt: 'card, Apple Pay și Google Pay',
    explicatie: 'Plata cu cardul prin Stripe, cu Apple Pay și Google Pay. Merge și pentru donații și cotizații.',
    zona: 'site',
    procesator: true,
  },
  {
    key: 'plata_euplatesc',
    name: 'Card prin EuPlătesc',
    icon: CreditCard,
    categorie: 'plati',
    pret: 5,
    scurt: 'card, cu orice bancă',
    explicatie: 'Plata cu cardul prin EuPlătesc, procesatorul românesc folosit de multe magazine.',
    zona: 'site',
    doarMagazin: true,
    procesator: true,
  },
  {
    key: 'link_plata',
    name: 'Link de plată',
    icon: Link2,
    categorie: 'plati',
    pret: 5,
    scurt: 'trimiți clientului un link să plătească',
    explicatie:
      'Dacă unui client nu i-a trecut plata sau mai are de dat o diferență, îi trimiți din comandă un link de plată.',
    zona: 'admin',
    doarMagazin: true,
  },

  // ---- Clienți și marketing ----
  {
    key: 'conturi_clienti',
    name: 'Conturi de clienți',
    icon: UserRound,
    categorie: 'clienti',
    pret: 8,
    scurt: 'cont, adrese, istoric, logare cu Google',
    explicatie:
      'Clienții își fac cont (și cu Google), își salvează adresele și își văd comenzile. Tu îi ai pe toți într-o listă.',
    zona: 'site',
  },
  {
    key: 'fidelitate',
    name: 'Puncte de fidelitate',
    icon: Gem,
    categorie: 'clienti',
    pret: 10,
    scurt: 'puncte la comenzi, folosite la următoarele',
    explicatie: 'Clienții strâng puncte la fiecare comandă și le folosesc ca reducere data viitoare. Revin mai des.',
    zona: 'site',
    doarMagazin: true,
    necesita: ['conturi_clienti'],
  },
  {
    key: 'cupoane',
    name: 'Cupoane de reducere',
    icon: TicketPercent,
    categorie: 'clienti',
    pret: 5,
    scurt: 'coduri de reducere, și unice din Excel',
    explicatie: 'În coș apare câmpul pentru cod de reducere. Faci coduri generale sau unice, încărcate din Excel.',
    zona: 'site',
    doarMagazin: true,
  },
  {
    key: 'newsletter',
    name: 'Newsletter',
    icon: Mail,
    categorie: 'clienti',
    pret: 10,
    scurt: 'abonați, campanii pe email, statistici',
    explicatie: 'Formular de abonare pe site, liste de abonați și campanii pe email, cu statistici de deschidere.',
    zona: 'site',
  },
  {
    key: 'campanii',
    name: 'Campanii pe site',
    icon: Megaphone,
    categorie: 'clienti',
    pret: 8,
    scurt: 'banner și insigne, pornite și oprite singure',
    explicatie:
      'Programezi o campanie (de exemplu Black Friday): bannerul și insignele apar singure la data de început și dispar la final.',
    zona: 'site',
  },
  {
    key: 'chat_live',
    name: 'Chat live',
    icon: MessageCircle,
    categorie: 'clienti',
    pret: 3,
    scurt: 'vorbești cu vizitatorii, pe loc',
    explicatie: 'O fereastră de chat în colțul site-ului: vizitatorii te întreabă direct, tu răspunzi și de pe telefon.',
    zona: 'site',
  },

  // ---- Conținut și comunitate ----
  {
    key: 'blog',
    name: 'Blog',
    icon: Newspaper,
    categorie: 'continut',
    pret: 5,
    scurt: 'articole, categorii, autori',
    explicatie: 'Scrii articole pe care le citesc clienții și Google. Aduc vizitatori noi, fără reclame plătite.',
    zona: 'site',
  },
  {
    key: 'donatii',
    name: 'Donații',
    icon: HeartHandshake,
    categorie: 'continut',
    pret: 10,
    scurt: 'o dată sau lunar, cu cardul',
    explicatie: 'Oamenii donează o dată sau lunar, cu cardul, și își văd istoricul în cont. Pentru asociații și ONG-uri.',
    zona: 'site',
    necesita: ['plata_stripe'],
  },
  {
    key: 'membri',
    name: 'Membri',
    icon: IdCard,
    categorie: 'continut',
    pret: 15,
    scurt: 'cotizații și pagini doar pentru membri',
    explicatie: 'Oamenii devin membri, plătesc cotizația online și văd paginile și documentele doar pentru membri.',
    zona: 'site',
    necesita: ['conturi_clienti', 'plata_stripe'],
  },
  {
    key: 'acorduri_gdpr',
    name: 'Acorduri semnate online',
    icon: PenLine,
    categorie: 'continut',
    pret: 8,
    scurt: 'formulare semnate, export Excel',
    explicatie: 'Partenerii tăi semnează online un acord sau un formular, iar tu le ai pe toate, cu export Excel.',
    zona: 'site',
  },
  {
    key: 'fisiere_cloud',
    name: 'Fișiere în cloud',
    icon: Cloud,
    categorie: 'continut',
    pret: 15,
    scurt: 'foldere cu parolă, versiuni, aplicație Windows',
    explicatie: 'Foldere în cloud, cu parolă și versiuni, pentru echipă sau clienți. Plus o aplicație pentru Windows.',
    zona: 'admin',
  },

  // ---- Analiză și legături ----
  {
    key: 'statistici',
    name: 'Statistici',
    icon: ChartColumn,
    categorie: 'analiza',
    pret: 8,
    scurt: 'vizitatori și surse, fără cookie-uri',
    explicatie:
      'Vezi câți vizitatori ai, de unde vin (Google, Facebook, TikTok) și câte comenzi aduce fiecare sursă. Fără cookie-uri.',
    zona: 'admin',
  },
  {
    key: 'concurenta',
    name: 'Prețurile concurenței',
    icon: Scale,
    categorie: 'analiza',
    pret: 15,
    scurt: 'compari prețurile tale cu ale lor',
    explicatie: 'Vezi prețurile concurenților lângă ale tale, produs cu produs, și știi unde ești mai scump.',
    zona: 'admin',
    necesita: ['catalog'],
  },
  {
    key: 'erp',
    name: 'Legătura cu ANDAXI ERP',
    icon: Network,
    categorie: 'analiza',
    pret: 10,
    scurt: 'comenzile și stocul, direct în ERP',
    explicatie:
      'Comenzile intră singure în ANDAXI ERP, stocul se actualizează pe site, iar factura se emite la aprobare.',
    zona: 'admin',
    doarMagazin: true,
  },
]

export const PLUGIN_ORDINE = PLUGINS.map((p) => p.key)

const BY_KEY = Object.fromEntries(PLUGINS.map((p) => [p.key, p])) as Record<PluginKey, Plugin>

export const getPlugin = (k: PluginKey): Plugin => BY_KEY[k]
export const isPluginKey = (k: string): k is PluginKey => k in BY_KEY
export const getPachet = (k: PachetKey): Pachet => PACHETE.find((p) => p.key === k) ?? PACHETE[1]
export const isPachetKey = (k: string): k is PachetKey => PACHETE.some((p) => p.key === k)

/** Merge pe pachetul ăsta? Cele de magazin cer pachetul Magazin. */
export const disponibil = (k: PluginKey, pachet: PachetKey) => !getPlugin(k).doarMagazin || pachet === 'magazin'

/** Plugin-urile alese, cu cele fără de care nu merg și cu cele incluse în pachet. */
export function cuDependente(sel: Iterable<PluginKey>, pachet: PachetKey): Set<PluginKey> {
  const out = new Set<PluginKey>()
  const add = (k: PluginKey) => {
    if (out.has(k) || !disponibil(k, pachet)) return
    out.add(k)
    getPlugin(k).necesita?.forEach(add)
  }
  getPachet(pachet).incluse.forEach(add)
  for (const k of sel) add(k)
  // Magazinul are nevoie de cel puțin o plată cu cardul: BT, dacă nu e aleasă alta.
  if (pachet === 'magazin' && !PLUGINS.some((p) => p.procesator && out.has(p.key))) add('plata_bt')
  return out
}

/** Plugin-urile care au nevoie de `k`: pleacă odată cu el. */
export const depindDe = (k: PluginKey) => PLUGINS.filter((p) => p.necesita?.includes(k)).map((p) => p.key)

/** E inclus în prețul pachetului? (Prima plată cu cardul e inclusă la magazin.) */
export function inclus(k: PluginKey, pachet: PachetKey, sel: Set<PluginKey>): boolean {
  if (getPachet(pachet).incluse.includes(k)) return true
  if (pachet === 'magazin' && getPlugin(k).procesator) {
    const primul = PLUGINS.find((p) => p.procesator && sel.has(p.key))
    return primul?.key === k
  }
  return false
}

/** Nu se poate scoate: inclus în pachet sau singura plată cu cardul a magazinului. */
export function blocat(k: PluginKey, pachet: PachetKey, sel: Set<PluginKey>): boolean {
  if (getPachet(pachet).incluse.includes(k)) return true
  if (pachet === 'magazin' && getPlugin(k).procesator) {
    return PLUGINS.filter((p) => p.procesator && sel.has(p.key)).length === 1 && sel.has(k)
  }
  return false
}

export interface CalculCms {
  pachet: Pachet
  oData: number
  /** Plugin-urile plătite (fără cele incluse), pe lună. */
  pluginuri: number
  platite: PluginKey[]
  incluse: PluginKey[]
  lunar: number
}

export function calculeazaCms(sel: Set<PluginKey>, pachetKey: PachetKey): CalculCms {
  const pachet = getPachet(pachetKey)
  const platite: PluginKey[] = []
  const incluse: PluginKey[] = []
  for (const k of PLUGIN_ORDINE) {
    if (!sel.has(k)) continue
    if (inclus(k, pachetKey, sel)) incluse.push(k)
    else platite.push(k)
  }
  const pluginuri = platite.reduce((s, k) => s + getPlugin(k).pret, 0)
  return { pachet, oData: pachet.oData, pluginuri, platite, incluse, lunar: pachet.lunar + pluginuri }
}

/** Euro cu punct la mii, ca pe pagina de prețuri: „3.000 €”. */
export const euro = (v: number) => `${String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`
