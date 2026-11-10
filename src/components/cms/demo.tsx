import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Droplet, FlaskConical, Flower2, Leaf, Pill, Sprout } from 'lucide-react'
import type { PachetKey, PluginKey } from '../../data/cmsPlugins'

/**
 * Site-ul de probă din calculatorul live se poate folosi ca unul adevărat:
 * pagini (acasă, produse, produs, coș, blog, cont…), istoric cu „înapoi”,
 * ancore pe landing page și un coș care chiar se umple. Totul stă aici, în
 * memorie, și se pierde la închiderea paginii.
 */

export type Pagina =
  | { p: 'acasa' }
  | { p: 'despre' }
  | { p: 'produse' }
  | { p: 'produs'; i: number }
  | { p: 'cos' }
  | { p: 'gata' }
  | { p: 'blog' }
  | { p: 'articol'; i: number }
  | { p: 'contact' }
  | { p: 'cont' }
  | { p: 'membri' }

export interface ProdusDemo {
  nume: string
  slug: string
  pret: number
  categorie: string
  icon: LucideIcon
  fundal: string
  culoare: string
  descriere: string
}

export const PRODUSE: ProdusDemo[] = [
  {
    nume: 'Ceai de tei',
    slug: 'ceai-de-tei',
    pret: 18,
    categorie: 'Ceaiuri',
    icon: Leaf,
    fundal: 'from-emerald-100 to-emerald-200',
    culoare: 'text-emerald-700',
    descriere: 'Flori de tei culese în iunie, uscate la umbră. Un ceai blând, bun seara, înainte de culcare.',
  },
  {
    nume: 'Miere polifloră',
    slug: 'miere-poliflora',
    pret: 29,
    categorie: 'Miere',
    icon: Droplet,
    fundal: 'from-amber-100 to-amber-200',
    culoare: 'text-amber-700',
    descriere: 'Miere crudă de la o stână din Apuseni, nefiltrată și neîncălzită. Borcan de 500 g.',
  },
  {
    nume: 'Ulei de cânepă',
    slug: 'ulei-de-canepa',
    pret: 45,
    categorie: 'Uleiuri',
    icon: FlaskConical,
    fundal: 'from-lime-100 to-lime-200',
    culoare: 'text-lime-700',
    descriere: 'Presat la rece, din semințe românești. Bogat în omega-3 și omega-6. Sticlă de 250 ml.',
  },
  {
    nume: 'Vitamina C',
    slug: 'vitamina-c',
    pret: 32,
    categorie: 'Suplimente',
    icon: Pill,
    fundal: 'from-orange-100 to-orange-200',
    culoare: 'text-orange-700',
    descriere: 'Vitamina C din măceșe, 60 de capsule. O capsulă pe zi, după masă.',
  },
  {
    nume: 'Propolis',
    slug: 'propolis',
    pret: 26,
    categorie: 'Suplimente',
    icon: Sprout,
    fundal: 'from-teal-100 to-teal-200',
    culoare: 'text-teal-700',
    descriere: 'Tinctură de propolis 30%, 30 ml. Câteva picături în ceai, în sezonul rece.',
  },
  {
    nume: 'Ceai de mușețel',
    slug: 'ceai-de-musetel',
    pret: 16,
    categorie: 'Ceaiuri',
    icon: Flower2,
    fundal: 'from-yellow-100 to-yellow-200',
    culoare: 'text-yellow-700',
    descriere: 'Flori întregi de mușețel, fără praf. Calmează și ajută digestia.',
  },
]

export const ARTICOLE = [
  {
    titlu: '5 ceaiuri pentru un somn bun',
    slug: '5-ceaiuri-pentru-somn',
    fundal: 'from-emerald-100 to-teal-200',
    rezumat: 'Teiul, mușețelul și alte trei plante care te ajută să adormi mai ușor.',
  },
  {
    titlu: 'Cum alegi o miere adevărată',
    slug: 'cum-alegi-mierea',
    fundal: 'from-amber-100 to-yellow-200',
    rezumat: 'Trei semne după care recunoști mierea curată, fără zahăr adăugat.',
  },
  {
    titlu: 'Ce e uleiul de cânepă',
    slug: 'ulei-de-canepa',
    fundal: 'from-lime-100 to-green-200',
    rezumat: 'De unde vine, ce conține și cum îl folosești în bucătărie.',
  },
]

/** Pachetul de produse din demo (pluginul „Pachete de produse”). */
export const PACHET_DEMO = { nume: 'Pachet Somn liniștit', produse: [0, 1, 5], pret: 55 }

/** Adresa din bara browserului. */
export function caleaPaginii(pg: Pagina): string {
  switch (pg.p) {
    case 'acasa':
      return '/'
    case 'produs':
      return `/produs/${PRODUSE[pg.i].slug}`
    case 'articol':
      return `/blog/${ARTICOLE[pg.i].slug}`
    case 'gata':
      return '/comanda-trimisa'
    case 'cont':
      return '/contul-meu'
    default:
      return `/${pg.p}`
  }
}

const aceeasi = (a: Pagina, b: Pagina) => caleaPaginii(a) === caleaPaginii(b)

/** Pagina există pe site-ul ăsta? (Fără plugin-ul ei, sau pe landing page, nu.) */
export function paginaValida(pg: Pagina, on: (k: PluginKey) => boolean, pachet: PachetKey): boolean {
  switch (pg.p) {
    case 'produse':
    case 'produs':
      return on('catalog')
    case 'cos':
    case 'gata':
      return pachet === 'magazin'
    case 'blog':
    case 'articol':
      return on('blog')
    case 'cont':
      return on('conturi_clienti')
    case 'membri':
      return on('membri')
    case 'despre':
    case 'contact':
      return pachet !== 'landing'
    default:
      return true
  }
}

/**
 * Unde se vede cel mai bine un plugin abia pornit: calculatorul deschide pagina
 * asta. Fără intrare: rămâne pe pagina curentă (bannerul, chatul, newsletterul
 * sunt pe toate paginile).
 */
export const PAGINA_PLUGIN: Partial<Record<PluginKey, Pagina>> = {
  catalog: { p: 'acasa' },
  cereri_oferta: { p: 'produs', i: 0 },
  recenzii: { p: 'produs', i: 0 },
  precomenzi: { p: 'produs', i: 2 },
  oferte_bbd: { p: 'produs', i: 1 },
  pachete_produse: { p: 'produs', i: 0 },
  fidelitate: { p: 'produs', i: 0 },
  manechin: { p: 'acasa' },
  livrare_fan: { p: 'cos' },
  plata_bt: { p: 'cos' },
  plata_stripe: { p: 'cos' },
  plata_euplatesc: { p: 'cos' },
  cupoane: { p: 'cos' },
  conturi_clienti: { p: 'cont' },
  blog: { p: 'blog' },
  donatii: { p: 'acasa' },
  membri: { p: 'membri' },
  acorduri_gdpr: { p: 'contact' },
}

export interface CosItem {
  id: string
  nume: string
  /** Produsul (pentru poză); -1 pentru pachet. */
  i: number
  pret: number
  n: number
  nota?: string
}

const COS_INITIAL: CosItem[] = [
  { id: '0', nume: PRODUSE[0].nume, i: 0, pret: PRODUSE[0].pret, n: 1 },
  { id: '1', nume: PRODUSE[1].nume, i: 1, pret: PRODUSE[1].pret, n: 1 },
]

type Ui = Record<string, string | boolean | number>

export function useSiteDemo(scrollRef: RefObject<HTMLDivElement | null>) {
  const [istoric, setIstoric] = useState<Pagina[]>([{ p: 'acasa' }])
  const pagina = istoric[istoric.length - 1]
  const [cos, setCos] = useState<CosItem[]>(COS_INITIAL)
  const [ui, setUi] = useState<Ui>({})
  const [notificare, setNotificare] = useState<string | null>(null)
  const ancoraDupa = useRef<string | null>(null)

  const deschide = useCallback((pg: Pagina) => {
    setIstoric((h) => (aceeasi(h[h.length - 1], pg) ? h : [...h.slice(-30), pg]))
  }, [])
  const inlocuieste = useCallback((pg: Pagina) => {
    setIstoric((h) => [...h.slice(0, -1), pg])
  }, [])
  const inapoi = useCallback(() => setIstoric((h) => (h.length > 1 ? h.slice(0, -1) : h)), [])
  const reseteaza = useCallback(() => {
    setIstoric([{ p: 'acasa' }])
    setCos(COS_INITIAL)
    setUi({})
  }, [])

  const deruleazaLa = useCallback(
    (id: string) => {
      const s = scrollRef.current
      const el = s?.querySelector(`[data-ancora="${id}"]`)
      if (!s || !el) return
      const tinta = s.scrollTop + el.getBoundingClientRect().top - s.getBoundingClientRect().top - 8
      s.scrollTo({ top: Math.max(0, tinta), behavior: 'smooth' })
    },
    [scrollRef],
  )

  /** O ancoră de pe prima pagină (meniul landing page-ului). */
  const ancora = useCallback(
    (id: string) => {
      if (pagina.p === 'acasa') deruleazaLa(id)
      else {
        ancoraDupa.current = id
        deschide({ p: 'acasa' })
      }
    },
    [pagina.p, deruleazaLa, deschide],
  )

  // Pagină nouă: de sus (sau la ancora cerută din altă pagină).
  const cale = caleaPaginii(pagina)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    if (ancoraDupa.current) {
      const id = ancoraDupa.current
      ancoraDupa.current = null
      const t = window.setTimeout(() => deruleazaLa(id), 60)
      return () => window.clearTimeout(t)
    }
  }, [cale, scrollRef, deruleazaLa])

  useEffect(() => {
    if (!notificare) return
    const t = window.setTimeout(() => setNotificare(null), 2400)
    return () => window.clearTimeout(t)
  }, [notificare])

  const adaugaInCos = useCallback((item: Omit<CosItem, 'n'>, n = 1) => {
    setCos((c) => {
      const exista = c.find((x) => x.id === item.id)
      return exista ? c.map((x) => (x.id === item.id ? { ...x, n: x.n + n } : x)) : [...c, { ...item, n }]
    })
    setNotificare(`Adăugat în coș: ${item.nume}`)
  }, [])
  const schimbaCantitate = useCallback((id: string, d: number) => {
    setCos((c) => c.map((x) => (x.id === id ? { ...x, n: Math.max(1, Math.min(9, x.n + d)) } : x)))
  }, [])
  const scoate = useCallback((id: string) => setCos((c) => c.filter((x) => x.id !== id)), [])
  const golesteCos = useCallback(() => setCos([]), [])
  const set = useCallback((k: string, v: string | boolean | number) => setUi((u) => ({ ...u, [k]: v })), [])

  return {
    pagina,
    cale,
    deschide,
    inlocuieste,
    inapoi,
    poateInapoi: istoric.length > 1,
    reseteaza,
    ancora,
    deruleaza: deruleazaLa,
    cos,
    adaugaInCos,
    schimbaCantitate,
    scoate,
    golesteCos,
    ui,
    set,
    notificare,
    notifica: setNotificare,
  }
}

export type Demo = ReturnType<typeof useSiteDemo>

export const DemoContext = createContext<Demo | null>(null)

export const useDemo = (): Demo => {
  const d = useContext(DemoContext)
  if (!d) throw new Error('useDemo în afara calculatorului live')
  return d
}
