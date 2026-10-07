import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarClock,
  ChevronRight,
  Database,
  FileCheck,
  Globe,
  Image as ImageIcon,
  LifeBuoy,
  Power,
  RefreshCw,
  ScrollText,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Upload,
  Banknote,
} from 'lucide-react'
import ShinyText from '../components/ShinyText'
import { usePageMeta } from '../seo'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import Marquee from '../components/Marquee'
import ErpShowcase from '../components/ErpShowcase'
import ModuleCard from '../components/ModuleCard'
import FaqList from '../components/FaqList'
import PermissionsPreview from '../components/PermissionsPreview'
import { BUNDLES, CORE, MODULES, getModule, withDependencies } from '../data/erpModules'
import type { ModuleKey } from '../data/erpModules'
import { FLOW } from '../data/erpFlow'
import { ERP_SHOTS } from '../data/erpShots'
import { ERP_FAQ } from '../data/erpFaq'
import NoWrapDomain from '../components/NoWrapDomain'

const EASE = [0.22, 1, 0.36, 1] as const

const FLOW_LABELS = Object.fromEntries(FLOW.map((f) => [f.id, f.label]))

const MODULE_STEPS = [
  {
    icon: Power,
    title: 'Pornește în câteva minute',
    text: 'Ne spui ce-ți trebuie, iar modulul apare în meniu în câteva minute. Nu reinstalezi nimic și nu muți nicio dată.',
  },
  {
    icon: ShieldCheck,
    title: 'Se oprește cu preaviz, fără să pierzi nimic',
    text: 'Nu se mai începe nimic nou pe el, dar ce ai în lucru se termină normal. Documentele rămân de citit și de tipărit.',
  },
  {
    icon: Bell,
    title: 'Anunț în program la fiecare schimbare',
    text: 'La clopoțelul din colț afli exact ce se schimbă pentru tine. Nu dintr-un buton care a dispărut peste noapte.',
  },
]

const EXTRAS = [
  {
    icon: Database,
    title: 'Backup automat',
    text: 'Copia se face singură, la ora aleasă de tine. Una manuală faci oricând, dintr-un buton.',
    wide: true,
  },
  {
    icon: Upload,
    title: 'Import din programul vechi',
    text: 'Clienți, produse, solduri, stoc pe loturi și facturi istorice, din exporturile Excel ale programului vechi (de exemplu Pluriva; facturile istorice și din SmartBill sau SAGA). Întâi o probă, apoi importul adevărat.',
    wide: true,
  },
  {
    icon: Banknote,
    title: 'Curs BNR automat',
    text: 'Cursul zilei vine singur de la BNR, pentru toate valutele.',
  },
  {
    icon: CalendarClock,
    title: 'Scadențar și somații',
    text: 'Vezi ce facturi au trecut de scadență și de când. Somația iese în PDF.',
  },
  {
    icon: FileCheck,
    title: 'Confirmări de sold',
    text: 'La închiderea anului, confirmarea pentru fiecare partener, gata de semnat.',
  },
  {
    icon: BookOpen,
    title: 'Registre contabile și fiscale',
    text: 'Registrul-jurnal, registrul fiscal și balanțele, din aceleași date.',
  },
  {
    icon: ScrollText,
    title: 'Jurnal de acțiuni',
    text: 'Cine ce a schimbat, cu ziua și ora. Nu se poate șterge, nici de administrator.',
  },
  {
    icon: Search,
    title: 'Căutare peste tot',
    text: 'O factură, un client, un NIR: îl găsești din bara de sus.',
  },
  {
    icon: ImageIcon,
    title: 'Sigla ta, pe facturi',
    text: 'Pui sigla și numele firmei în program și pe documentele tipărite.',
  },
  {
    icon: LifeBuoy,
    title: 'Manualul, în program',
    text: 'Răspunsul la „cum fac…?” e la un clic, scris pe limba ta.',
  },
]

const COMPLIANCE = [
  'e-Factura (SPV)',
  'e-Facturi primite din SPV',
  'SAF-T (D406)',
  'D300',
  'D394',
  'D390',
  'D100',
  'D101',
  'D205',
  'Validare DUKIntegrator',
  'PDF oficial cu cod de bare',
  'Curs BNR zilnic',
  'Reevaluări valutare',
  'Registre contabile și fiscale',
]

const WHY = [
  {
    title: 'Tot drumul, într-un singur loc',
    text: 'Vânzări, cumpărări, stoc, bani, contabilitate și declarații, legate între ele. Introduci o dată, restul se leagă.',
  },
  {
    title: 'Doar modulele tale',
    text: 'Folosești doar ce-ți trebuie, restul nu-ți încurcă meniul. Te-ai extins? Mai pornim un modul, în câteva minute.',
  },
  {
    title: 'Conform ANAF',
    text: 'e-Factura pleacă direct în SPV, iar declarațiile ies gata de depus, cu PDF-ul oficial făcut prin validatorul ANAF (DUKIntegrator).',
  },
  {
    title: 'Automatizare reală',
    text: 'Stocul scade singur la vânzare, documentele se contează singure sau cu un clic, extrasele intră din fișier.',
  },
  {
    title: 'Datele tale, separat',
    text: 'Instanță dedicată, cu baza ta de date, la firma-ta.erp.andaxi.ro. Nu se amestecă cu ale altei firme.',
  },
]

const TECH = [
  {
    icon: Globe,
    title: 'Aplicație web',
    text: 'O deschizi din browser, de oriunde. Nu instalezi nimic pe calculatoare.',
  },
  {
    icon: Server,
    title: 'Instanță dedicată',
    text: 'Baza ta de date, la adresa firma-ta.erp.andaxi.ro.',
  },
  {
    icon: Database,
    title: 'Backup automat',
    text: 'Copii de siguranță la ora aleasă, plus oricând una manuală.',
  },
  {
    icon: RefreshCw,
    title: 'Actualizări de legislație',
    text: 'Formularele și regulile fiscale rămân la zi, fără grija ta.',
  },
]

/* ------------------------------------------------------------------------ */

const moduleLabel = (k: ModuleKey) => (k === 'core' ? 'Trunchiul' : getModule(k).name)

/** Navigatorul lipicios peste pașii firmei, cu pasul vizibil evidențiat. */
const FlowNav = () => {
  const [active, setActive] = useState(FLOW[0].id)
  const navRef = useRef<HTMLElement>(null)

  // Pe telefon bara se derulează pe orizontală: ține pasul activ la vedere.
  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`)
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  useEffect(() => {
    const els = FLOW.map((f) => document.getElementById(f.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="pointer-events-none sticky top-4 z-40 flex justify-center px-4">
      <nav
        ref={navRef}
        aria-label="Pașii firmei"
        className="pointer-events-auto relative flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-[color:var(--border)] bg-[color:var(--menu-bg)] p-1.5 shadow-lg shadow-black/10 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FLOW.map(({ id, label, icon: Icon }, i) => (
          <span key={id} className="flex shrink-0 items-center">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[color:var(--text-5)]" aria-hidden />}
            <a
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors duration-200 ${
                active === id
                  ? 'text-[color:var(--text-1)]'
                  : 'text-[color:var(--text-3)] hover:text-[color:var(--text-1)]'
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="erp-flow-nav"
                  className="absolute inset-0 rounded-full bg-[color:var(--accent-tint)]"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <Icon className="relative h-4 w-4 text-[color:var(--accent)]" />
              <span className="relative">{label}</span>
            </a>
          </span>
        ))}
      </nav>
    </div>
  )
}

/** Pachetele pe tip de firmă: file + modulele fiecăruia. */
const Bundles = () => {
  const [activeKey, setActiveKey] = useState(BUNDLES[0].key)
  const reduceMotion = useReducedMotion()
  const bundle = BUNDLES.find((b) => b.key === activeKey) ?? BUNDLES[0]
  const keys = withDependencies(bundle.modules)
  const contactHref = `/contact?interes=erp&module=${keys.join(',')}`

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tipul firmei"
        className="-mx-6 flex gap-1 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:w-fit sm:rounded-full sm:border sm:border-[color:var(--border)] sm:p-1.5 [&::-webkit-scrollbar]:hidden"
      >
        {BUNDLES.map((b) => {
          const selected = b.key === activeKey
          return (
            <button
              key={b.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveKey(b.key)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors duration-200 max-sm:border max-sm:border-[color:var(--border)] ${
                selected ? 'text-white' : 'text-[color:var(--text-3)] hover:text-[color:var(--text-1)]'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="erp-bundle-pill"
                  className="absolute inset-0 rounded-full bg-[color:var(--accent-strong)]"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <span className="relative">{b.name}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={bundle.key}
          role="tabpanel"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-8 grid grid-cols-1 gap-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-12"
        >
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">
              Pachetul {bundle.name}
            </p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-[color:var(--text-1)] md:text-4xl">
              {bundle.tagline}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              {bundle.description}
            </p>
            <p className="mt-4 text-sm text-[color:var(--text-4)]">
              Trunchiul + {keys.length} {keys.length === 1 ? 'modul' : 'module'}. Le schimbi oricând.
            </p>
            <p className="mt-4 text-3xl font-medium tracking-tight text-[color:var(--text-1)]">
              {bundle.pret} €
              <span className="text-sm font-normal text-[color:var(--text-4)]"> / lună, cu primul om</span>
            </p>
            <Link
              to="/preturi#erp"
              className="mt-1 text-sm text-[color:var(--accent)] underline-offset-4 hover:underline"
            >
              Calculează cu oamenii și modulele tale
            </Link>
            <div className="mt-8 lg:mt-auto lg:pt-8">
              <Link
                to={contactHref}
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)]"
              >
                Vreau pachetul {bundle.name}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div>
            <ul className="flex flex-col">
              <li className="flex items-center gap-4 border-b border-[color:var(--border)] py-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
                  <CORE.icon className="h-5 w-5 text-[color:var(--accent)]" />
                </span>
                <a href="#core" className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[color:var(--text-1)]">
                    Trunchiul ERP
                  </span>
                  <span className="block truncate text-sm text-[color:var(--text-4)]">
                    Facturi, contabilitate, financiar
                  </span>
                </a>
                <span className="text-xs text-[color:var(--text-4)]">mereu</span>
              </li>
              {keys.map((k) => {
                const m = getModule(k)
                return (
                  <li key={k} className="flex items-center gap-4 border-b border-[color:var(--border)] py-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
                      <m.icon className="h-5 w-5 text-[color:var(--accent)]" />
                    </span>
                    <a href={`#${k}`} className="group min-w-0 flex-1">
                      <span className="block text-sm font-medium text-[color:var(--text-1)] group-hover:text-[color:var(--accent)]">
                        {m.name}
                      </span>
                      <span className="block text-sm leading-snug text-[color:var(--text-4)]">
                        {m.tagline}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
            {bundle.optional.length > 0 && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">
                  Bune de adăugat
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {bundle.optional.map((k) => {
                    const m = getModule(k)
                    return (
                      <a
                        key={k}
                        href={`#${k}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-sm text-[color:var(--text-3)] transition-colors hover:border-[color:var(--accent-border)] hover:text-[color:var(--text-1)]"
                      >
                        <m.icon className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                        {m.name}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------------ */

const Erp = () => {
  usePageMeta('/erp')

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      {/* ===== Hero ===== */}
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--accent-glow),transparent)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-40 text-center lg:px-8">
          <Reveal>
            <Link
              to="/erp/demo"
              className="group mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-tint)] py-1.5 pl-1.5 pr-4 text-xs text-[color:var(--text-2)] transition-colors hover:border-[color:var(--accent-strong)] md:text-sm"
            >
              <span className="rounded-full bg-[color:var(--accent-strong)] px-2.5 py-0.5 text-xs font-medium text-white">
                În curând
              </span>
              <span className="sm:hidden">Demo-ul în timp real</span>
              <span className="hidden sm:inline">Demo-ul în timp real: construiește-ți ERP-ul</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mb-4 text-xs uppercase tracking-tight text-[color:var(--accent)] md:text-sm">
              ANDAXI ERP
            </p>
          </Reveal>

          <h1
            className="max-w-5xl text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ lineHeight: 0.95 }}
          >
            <span className="block font-medium text-[color:var(--text-1)]">
              <AnimatedText text="Facturare, gestiune și contabilitate," delay={0.15} />
            </span>
            <ShinyText
              text="pe măsura firmei tale."
              color="var(--accent-strong)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>

          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Un program pentru firma ta, la prețul CORECT.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/contact?interes=erp"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:px-8 md:py-4 md:text-base"
            >
              Cere o demonstrație
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#module"
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] px-6 py-3 text-sm text-[color:var(--text-2)] transition-colors duration-300 hover:border-[color:var(--text-1)] hover:text-[color:var(--text-1)] md:px-8 md:py-4 md:text-base"
            >
              Vezi modulele
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.55}>
            <p className="mt-8 flex items-center justify-center gap-2 text-xs text-[color:var(--text-4)] md:text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
              Securizat, e-Factura în SPV și declarații gata de depus.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Intro ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Mai mult decât un program de facturare." />
          </h2>
          <Reveal delay={0.15}>
            <p className="text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Facturarea e doar începutul. ANDAXI ERP ține tot drumul firmei:
              vinzi, cumperi, ții stocul, încasezi, reguli de vânzare, agenți,
              casă de marcat și contabilitate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Showcase ===== */}
      <section id="ecrane" className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Vezi programul</p>
          </Reveal>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 className="max-w-2xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
              <AnimatedText text="Intuitiv, modern, RAPID" />
            </h2>
            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm leading-relaxed text-[color:var(--text-3)]">
                Ecrane reale din program, pe o firmă demo.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-12">
            <ErpShowcase shots={ERP_SHOTS} labels={FLOW_LABELS} />
          </Reveal>
        </div>
      </section>

      {/* ===== Fluxul firmei ===== */}
      <div id="functionalitati" className="relative border-t border-[color:var(--border)] pt-8">
        <FlowNav />
        {FLOW.map((step, i) => (
          <section
            key={step.id}
            id={step.id}
            className={`scroll-mt-20 ${i > 0 ? 'border-t border-[color:var(--border)]' : ''}`}
          >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-8 lg:py-28">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                  <p className="flex items-center gap-3 text-xs uppercase tracking-wider text-[color:var(--accent)]">
                    <span className="text-[color:var(--text-5)]">{String(i + 1).padStart(2, '0')}</span>
                    <step.icon className="h-4 w-4" />
                    {step.label}
                  </p>
                </Reveal>
                <h2 className="mt-4 text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-4xl">
                  <AnimatedText text={step.title} />
                </h2>
                <Reveal delay={0.1}>
                  <p className="mt-5 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                    {step.intro}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {step.modules.map((k) => (
                      <a
                        key={k}
                        href={`#${k}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs text-[color:var(--text-3)] transition-colors hover:border-[color:var(--accent-border)] hover:text-[color:var(--text-1)]"
                      >
                        {moduleLabel(k)}
                      </a>
                    ))}
                  </div>
                </Reveal>
              </div>

              <StaggerContainer className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {step.points.map((p) => (
                  <StaggerItem key={p.title}>
                    <div className="h-full border-t border-[color:var(--border)] pb-8 pt-5">
                      <h3 className="flex gap-2.5 text-base font-medium text-[color:var(--text-1)]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                        {p.title}
                      </h3>
                      <p className="mt-2 pl-4 text-sm leading-relaxed text-[color:var(--text-3)]">{p.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        ))}
      </div>

      {/* ===== Module ===== */}
      <section id="module" className="scroll-mt-8 border-t border-[color:var(--border)]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_0%,var(--accent-glow-soft),transparent)]" />
          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
            <Reveal>
              <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">Module</p>
            </Reveal>
            <h2 className="mt-4 max-w-4xl text-4xl font-medium tracking-tighter md:text-6xl" style={{ lineHeight: 1 }}>
              <span className="block text-[color:var(--text-1)]">
                <AnimatedText text="Construiește-ți ERP-ul" />
              </span>
              <ShinyText
                text="din module."
                color="var(--accent-strong)"
                shineColor="var(--shine)"
                speed={3}
                spread={100}
                className="font-medium"
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                Pornești de la trunchi și adaugi doar ce folosești. Nu vinzi la
                tejghea? Casa de marcat nu-ți apare în meniu. Ai deschis
                magazin online? Îl pornim. Programul crește odată cu firma, nu
                invers.
              </p>
            </Reveal>

            {/* Trunchiul */}
            <Reveal delay={0.1} className="mt-14">
              <div
                id="core"
                className="relative scroll-mt-28 overflow-hidden rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-8 md:p-12"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-[color:var(--accent)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                      </span>
                      Mereu pornit
                    </p>
                    <h3 className="mt-3 text-2xl font-medium tracking-tight text-white md:text-4xl">
                      Trunchiul: facturi, contabilitate, financiar.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">{CORE.description}</p>
                  </div>
                  <div className="flex max-w-lg flex-wrap gap-2 lg:justify-end">
                    {CORE.menu.map((g) => (
                      <span
                        key={g.group}
                        className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80"
                      >
                        {g.group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Cele 12 module */}
            <div className="mt-6 flex items-center gap-4" aria-hidden>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--border-strong)] to-transparent" />
              <span className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">
                + {MODULES.length} module, pornite la cerere
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--border-strong)] to-transparent" />
            </div>
            <StaggerContainer className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <StaggerItem key={m.key}>
                  <ModuleCard module={m} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Cum merge */}
            <StaggerContainer className="mt-16 flex flex-col">
              {MODULE_STEPS.map(({ icon: Icon, title, text }, i) => (
                <StaggerItem key={title}>
                  <div className="flex flex-col gap-2 border-t border-[color:var(--border)] py-7 last:border-b md:flex-row md:items-baseline md:gap-10">
                    <span className="text-sm text-[color:var(--text-5)] md:w-10">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="flex items-center gap-3 text-xl font-medium text-[color:var(--text-1)] md:w-[26rem]">
                      <Icon className="h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                      {title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA demo */}
            <Reveal delay={0.1} className="mt-16">
              <Link
                to="/erp/demo"
                className="group relative block overflow-hidden rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-8 transition-colors duration-300 hover:border-[color:var(--accent-strong)] md:p-14"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:var(--accent-strong)] opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                />
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-[color:var(--accent)]">
                      <Sparkles className="h-4 w-4" />
                      Demo în timp real · în curând
                    </p>
                    <h3 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-5xl">
                      Pornește un modul. Vezi meniul cum se schimbă.
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
                      Vei alege modulele, iar programul se va rearanja pe loc, cu
                      un ghid care îți arată ce a apărut și la ce folosește.
                    </p>
                  </div>
                  <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors duration-300 group-hover:bg-gray-200 md:text-base">
                    Vezi cum va arăta
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Pe tipul tău de firmă ===== */}
      <section id="pachete" className="scroll-mt-8 border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Pachete</p>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Pe tipul tău de firmă." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Nu știi de unde să pornești? Alege ce fel de firmă ai. Îți
              arătăm modulele cu care încep de obicei firmele ca a ta.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <Bundles />
          </Reveal>
        </div>
      </section>

      {/* ===== Conturi și drepturi ===== */}
      <section id="conturi" className="scroll-mt-8 border-t border-[color:var(--border)]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Conturi și drepturi</p>
            </Reveal>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
              <AnimatedText text="Fiecare cont, croit pe omul lui." />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                Casierul vede casa, contabilul vede contabilitatea, iar tu vezi
                tot. Pornești de la un rol și ajustezi din bife, cât de fin
                vrei.
              </p>
            </Reveal>
            <StaggerContainer className="mt-8 flex flex-col gap-3">
              {[
                'Roluri gata făcute: Proprietar, Administrator, Contabil, Operator, Vizualizare.',
                'Bife pe fiecare secțiune din meniu.',
                'Acces doar la anumite gestiuni: omul vede doar marfa din depozitele lui.',
                'Cine vede prețurile de achiziție, cine schimbă prețuri, cine trimite în SPV.',
                'Jurnalul ține minte cine ce a schimbat.',
                'Plătești doar conturile active.',
              ].map((t) => (
                <StaggerItem key={t}>
                  <p className="flex gap-3 text-sm leading-relaxed text-[color:var(--text-2)] md:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    {t}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
          <Reveal delay={0.15}>
            <PermissionsPreview />
          </Reveal>
        </div>
      </section>

      {/* ===== Lucrurile mici ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Și încă ceva</p>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Lucrurile mici care îți scurtează ziua." />
          </h2>
          <StaggerContainer className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {EXTRAS.map(({ icon: Icon, title, text, wide }) => (
              <StaggerItem key={title} className={wide ? 'col-span-2' : ''}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`h-full rounded-2xl border border-[color:var(--border)] p-5 transition-colors duration-300 hover:border-[color:var(--border-strong)] sm:p-6 ${
                    wide ? 'bg-[color:var(--surface)] md:p-8' : ''
                  }`}
                >
                  <Icon className={`${wide ? 'h-7 w-7' : 'h-5 w-5'} text-[color:var(--accent)]`} />
                  <h3 className={`mt-4 font-medium text-[color:var(--text-1)] ${wide ? 'text-xl' : 'text-base'}`}>
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-3)]">{text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Conformitate ===== */}
      <section className="border-t border-[color:var(--border)] py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-medium tracking-tight text-[color:var(--text-1)] md:text-4xl">
              Conform cu legislația din România
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[color:var(--text-3)] md:text-base">
              e-Factura pleacă din program direct în SPV. Declarațiile ies
              gata de depus, cu XML-ul și PDF-ul oficial, făcut prin
              validatorul ANAF.
            </p>
          </Reveal>
        </div>
        <div className="mt-10">
          <Marquee items={COMPLIANCE} />
        </div>
      </section>

      {/* ===== De ce ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="De ce ANDAXI ERP" />
          </h2>
          <StaggerContainer className="mt-12 flex flex-col">
            {WHY.map(({ title, text }, i) => (
              <StaggerItem key={title}>
                <div className="group flex flex-col gap-2 border-t border-[color:var(--border)] py-7 last:border-b md:flex-row md:items-baseline md:gap-10">
                  <span className="text-sm text-[color:var(--text-5)] md:w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-medium text-[color:var(--text-1)] md:w-72">{title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                    <NoWrapDomain text={text} />
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Întrebări ===== */}
      <section id="intrebari" className="scroll-mt-8 border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Întrebări</p>
          </Reveal>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Ce ne întreabă lumea des." />
          </h2>
          <Reveal delay={0.1} className="mt-12">
            <FaqList items={ERP_FAQ} />
          </Reveal>
        </div>
      </section>

      {/* ===== Tehnologie ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Tehnologie & siguranță" />
          </h2>
          <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {TECH.map(({ icon: Icon, title, text }) => (
                <StaggerItem key={title}>
                  <div className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
                    <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                    <h3 className="mt-4 text-lg font-medium text-[color:var(--text-1)]">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-3)]">
                      <NoWrapDomain text={text} />
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Pe telefon */}
            <Reveal delay={0.15} className="mx-auto">
              <figure className="flex flex-col items-center">
                <div className="relative">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_center,var(--accent-glow),transparent_65%)] blur-2xl"
                  />
                  <div className="relative w-[230px] rounded-[2.6rem] border border-[color:var(--border-strong)] bg-[color:var(--surface-hover)] p-2.5 shadow-2xl shadow-black/40 md:w-[250px]">
                    <div className="overflow-hidden rounded-[2.1rem] bg-white">
                      <img
                        src="/img/erp/dashboard-mobil.webp"
                        alt="Panoul de control ANDAXI ERP pe telefon"
                        loading="lazy"
                        decoding="async"
                        width={780}
                        height={1688}
                        className="block aspect-[780/1688] w-full"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-6 max-w-[16rem] text-center text-sm leading-relaxed text-[color:var(--text-3)]">
                  Merge și pe telefon: sarcinile zilei și cifrele lunii, fără
                  aplicație separată.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_110%,var(--accent-glow),transparent)]" />
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
            <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl">
              <AnimatedText text="Un singur program pentru tot ce ține firma ta." />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-5 max-w-xl text-sm text-[color:var(--text-3)] md:text-base">
                Cere o demonstrație și vezi ANDAXI ERP pe datele tale. Îți
                aducem datele din programul vechi și îți învățăm echipa.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/contact?interes=erp"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-8 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:text-base"
              >
                Cere o demonstrație
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/erp/demo"
                className="group inline-flex items-center gap-1 text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)] md:text-base"
              >
                Demo-ul în timp real, în curând
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Erp
