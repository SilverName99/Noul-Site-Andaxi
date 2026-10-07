import { useEffect } from 'react'
import { ERP_FAQ } from './data/erpFaq'
import { PLANURI, PRET_BAZA } from './data/erpPricing'

/**
 * Titlul, descrierea, adresa canonică, Open Graph / Twitter și datele
 * structurate pentru fiecare pagină. Aceeași listă o folosesc:
 *  - pagina, în browser (`usePageMeta`), la navigarea dintre pagini;
 *  - prerandarea de la build (scripts/prerender.mjs), care scrie capul
 *    paginii în dist/pagini/<ruta>.html — așa îl văd și roboții care nu rulează
 *    JavaScript (previzualizările de pe Facebook, WhatsApp, LinkedIn).
 */

export const SITE_URL = 'https://andaxi.ro'
const DEFAULT_IMAGE = '/og/andaxi.png'

type JsonLd = Record<string, unknown>

export interface RouteMeta {
  path: string
  title: string
  description: string
  /** Imagine 1200×630 pentru previzualizări. */
  image?: string
  imageAlt?: string
  jsonLd?: JsonLd[]
  /** Pentru sitemap.xml. */
  changefreq: 'weekly' | 'monthly' | 'yearly'
  priority: number
}

const ORGANIZATION_REF = { '@type': 'Organization', name: 'Andaxi', url: SITE_URL }

const ERP_SOFTWARE: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ANDAXI ERP',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'ERP',
  operatingSystem: 'Web',
  inLanguage: 'ro',
  url: `${SITE_URL}/erp`,
  image: `${SITE_URL}/og/erp.png`,
  description:
    'Program online de facturare cu e-Factura, gestiune stocuri pe loturi cu data expirării, contabilitate și declarații ANAF, construit din module.',
  featureList: [
    'Program de facturare cu e-Factura (SPV)',
    'Gestiune stocuri pe loturi, cu data expirării (FEFO)',
    'Recepție NIR din e-Factura primită în SPV',
    'Casă de marcat Datecs',
    'Program de contabilitate online',
    'Declarații D300, D394, D390, D100, D101, D205 și SAF-T (D406)',
    'Mijloace fixe și amortizare lunară',
    'Integrare cu magazinul online',
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: String(PRET_BAZA),
    highPrice: String(Math.max(...PLANURI.map((p) => p.pret))),
    offerCount: String(PLANURI.length + 1),
    description:
      'Abonament lunar pe module, fără TVA: fundația de la 12 €, pachete de la 25 €, plus oamenii în plus.',
  },
  publisher: ORGANIZATION_REF,
}

const ERP_FAQ_LD: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ERP_FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: 'Andaxi — Website-uri, magazine online, ERP și CRM pentru firme din România',
    description:
      'Website-uri personalizate, magazine online, ANDAXI ERP (facturare cu e-Factura, gestiune pe loturi, contabilitate online) și ANDAXI CRM. Prețuri corecte, suport real.',
    changefreq: 'weekly',
    priority: 1,
  },
  {
    path: '/erp',
    title: 'ANDAXI ERP — Program de facturare e-Factura, gestiune stocuri și contabilitate online',
    description:
      'Facturare cu e-Factura, gestiune stocuri pe loturi (FEFO), NIR din e-Factura SPV, casă de marcat Datecs, contabilitate online, D300, D394 și SAF-T D406.',
    image: '/og/erp.png',
    imageAlt: 'ANDAXI ERP — facturare, gestiune și contabilitate, din module',
    jsonLd: [ERP_SOFTWARE, ERP_FAQ_LD],
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/erp/demo',
    title: 'Demo ANDAXI ERP în timp real — construiește-ți ERP-ul din module',
    description:
      'Pornești și oprești module și vezi cum se schimbă meniul programului, pe loc, cu un ghid alături. Demo-ul ANDAXI ERP vine în curând. Programează o demonstrație.',
    image: '/og/erp.png',
    imageAlt: 'ANDAXI ERP — demo în timp real',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: '/crm',
    title: 'ANDAXI CRM — Vânzări pe agent, cu hartă și rute, conectat la ERP',
    description:
      'CRM pentru echipe de agenți pe teren: hartă interactivă cu stopuri și check-in, stocuri per agent, vânzări preluate din ERP, fișiere și chat integrat.',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/preturi',
    title: 'Prețuri — Website-uri, magazine online, ERP și CRM | Andaxi',
    description:
      'Prețuri corecte, fără surprize: landing page 250€, site de prezentare 500€, magazin online 3.000€. ANDAXI ERP pe module, de la 12 €/lună: plătești doar ce folosești.',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/contact',
    title: 'Contact — Andaxi | Hai să vorbim despre proiectul tău',
    description:
      'Scrie-ne sau sună-ne la 0755 885 973 — răspundem de obicei în aceeași zi. Website-uri, magazine online, ERP și CRM pentru firma ta.',
    changefreq: 'yearly',
    priority: 0.7,
  },
]

export const getRouteMeta = (path: string): RouteMeta =>
  ROUTES.find((r) => r.path === path) ?? ROUTES[0]

const absolute = (path: string) => `${SITE_URL}${path}`

/** Adresa canonică: fără slash la final, ca în sitemap. */
export const canonicalUrl = (path: string) => absolute(path === '/' ? '/' : path.replace(/\/$/, ''))

interface Tag {
  /** 'title' | 'meta' | 'link' */
  tag: 'title' | 'meta' | 'link'
  attrs: Record<string, string>
  text?: string
}

const headTags = (meta: RouteMeta): Tag[] => {
  const image = absolute(meta.image ?? DEFAULT_IMAGE)
  const url = canonicalUrl(meta.path)
  const alt = meta.imageAlt ?? 'Andaxi — De la oameni, către oameni.'
  return [
    { tag: 'title', attrs: {}, text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'Andaxi' } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'ro_RO' } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: alt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: alt } },
  ]
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** JSON pentru <script type="application/ld+json">, fără „</” care ar închide scriptul. */
const jsonLdText = (data: JsonLd) => JSON.stringify(data).replace(/</g, '\\u003c')

/** Capul paginii ca HTML, pentru prerandare. */
export function renderHeadTags(path: string): string {
  const meta = getRouteMeta(path)
  const tags = headTags(meta).map(({ tag, attrs, text }) => {
    const a = Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
      .join('')
    return tag === 'title' ? `<title>${escapeHtml(text ?? '')}</title>` : `<${tag}${a} />`
  })
  const ld = (meta.jsonLd ?? []).map(
    (d) => `<script type="application/ld+json" data-route-jsonld>${jsonLdText(d)}</script>`,
  )
  return [...tags, ...ld].join('\n    ')
}

/** Actualizează capul paginii în browser. */
export function applyRouteMeta(path: string) {
  const meta = getRouteMeta(path)
  for (const { tag, attrs, text } of headTags(meta)) {
    if (tag === 'title') {
      document.title = text ?? ''
      continue
    }
    const key = attrs.name ? 'name' : attrs.property ? 'property' : 'rel'
    const selector = `${tag}[${key}="${attrs[key]}"]`
    let el = document.head.querySelector<HTMLElement>(selector)
    if (!el) {
      el = document.createElement(tag)
      document.head.appendChild(el)
    }
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  }
  document.head.querySelectorAll('script[data-route-jsonld]').forEach((el) => el.remove())
  for (const data of meta.jsonLd ?? []) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.routeJsonld = ''
    script.textContent = jsonLdText(data)
    document.head.appendChild(script)
  }
}

/** Pune capul paginii pentru `path` când pagina se deschide. */
export function usePageMeta(path: string) {
  useEffect(() => {
    applyRouteMeta(path)
  }, [path])
}
