import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Calculator,
  Check,
  Cpu,
  Database,
  Gift,
  LayoutTemplate,
  LifeBuoy,
  LockKeyhole,
  Mail,
  Map,
  PlayCircle,
  RefreshCw,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingBag,
  Users,
} from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import ShinyText from '../components/ShinyText'
import { usePageMeta } from '../seo'
import { CORE, MODULES } from '../data/erpModules'
import { PRET_BAZA, etichetaPret } from '../data/erpPricing'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import ErpCalculator from '../components/ErpCalculator'
import NoWrapDomain from '../components/NoWrapDomain'

const PACKAGES = [
  {
    icon: Rocket,
    name: 'Landing page',
    price: '250€',
    monthly: '+50€/lună găzduire & mentenanță',
    tagline: 'O singură pagină care convinge — perfectă pentru lansări, servicii sau campanii.',
    featured: false,
    features: [
      'Design 100% personalizat, adaptat brandului tău — zero template-uri',
      'Secțiuni animate & animații la scroll',
      'Formular de contact',
      'Optimizat pentru mobil și tabletă',
      'SEO de bază + înscriere în Google',
      'Google Analytics conectat — vezi câți vizitatori ai',
      'Certificat SSL (https) inclus',
      'Buton WhatsApp / apel direct din pagină',
      'Conformitate GDPR — banner cookies & politică de confidențialitate',
      'Până la 10 adrese de email personalizate (1 GB stocare inclus)',
      'Livrare în 5-7 zile',
    ],
  },
  {
    icon: LayoutTemplate,
    name: 'Site de prezentare',
    price: '500€',
    monthly: '+100€/lună găzduire & mentenanță',
    tagline: 'Până la 7 pagini — cartea de vizită completă a afacerii tale.',
    featured: true,
    features: [
      'Tot ce include Landing page',
      'Până la 7 pagini, cu structura aleasă de tine',
      'Blog / secțiune de noutăți pe care o administrezi singur',
      'Galerie foto & video',
      'Hartă Google + date de contact',
      'SEO extins — optimizare pe fiecare pagină',
      'Instruire la predare pentru administrarea site-ului',
      'Backup automat săptămânal',
      'Până la 10 adrese de email personalizate (1 GB stocare inclus)',
    ],
  },
  {
    icon: ShoppingBag,
    name: 'Magazin online',
    price: '3.000€',
    monthly: 'găzduire & mentenanță de la 150€/lună*',
    tagline: 'E-commerce complet, cu produse nelimitate — gândit să vândă.',
    featured: false,
    features: [
      'Tot ce include site-ul de prezentare',
      'Produse nelimitate, categorii, filtre și căutare rapidă',
      'Coș & checkout optimizat pentru conversie (și comandă fără cont)',
      'Plăți online: card, ramburs, transfer',
      'Integrare curieri — AWB generat automat',
      'Legat direct de ANDAXI ERP — comenzile intră singure, factura se emite la aprobare',
      'Vouchere și coduri de reducere',
      'Feed Google Shopping & Facebook/Instagram',
      'Email-uri automate: confirmare comandă, expediere, coș abandonat',
      'Rapoarte de vânzări direct din CMS',
    ],
  },
]

const MAINTENANCE = [
  {
    icon: Server,
    title: 'Găzduire rapidă + SSL',
    text: 'Site-ul tău pe servere rapide, cu certificat de securitate mereu valid.',
  },
  {
    icon: RefreshCw,
    title: 'Actualizări & securitate',
    text: 'Actualizări tehnice și de securitate aplicate constant, fără grija ta.',
  },
  {
    icon: ShieldCheck,
    title: 'Backup automat',
    text: 'Copii de siguranță regulate — site-ul poate fi restaurat oricând.',
  },
  {
    icon: LifeBuoy,
    title: 'Suport & mici modificări',
    text: 'Răspundem repede și facem lunar micile modificări de care ai nevoie.',
  },
  {
    icon: Mail,
    title: 'Email-uri funcționale',
    text: 'Adresele tale @firma-ta.ro, mereu în funcțiune, cu suport la configurare.',
  },
]

/** Ce primești pe lângă module. `badge` spune în ce condiții. */
const ERP_FREE = [
  {
    icon: Gift,
    title: 'Implementare & customizare',
    text: 'Le facem noi: programul se adaptează firmei tale, nu invers. Lunar sau pe 6 luni costă 149 €, o singură dată.',
    badge: 'gratis la 12+ luni',
  },
  {
    icon: RefreshCw,
    title: 'Migrarea datelor + instruire',
    text: 'Îți aducem datele din programul vechi și îți învățăm echipa.',
    badge: 'gratis la 12+ luni',
  },
  {
    icon: Users,
    title: 'Contul contabilului',
    text: 'Contabilul tău primește cont fără cost, iar la cerere și un cont de vizualizare.',
    badge: 'gratis',
  },
  {
    icon: ShieldCheck,
    title: 'e-Factura & declarații',
    text: 'Facturile pleacă în SPV, iar cu modulul Contabilitate declarațiile ies gata de depus. Actualizările de legislație sunt incluse.',
    badge: 'inclus',
  },
  {
    icon: Server,
    title: 'Instanță dedicată',
    text: 'Baza ta de date, la firma-ta.erp.andaxi.ro — nu se amestecă cu datele altor firme.',
    badge: 'inclus',
  },
  {
    icon: LifeBuoy,
    title: 'Backup & suport',
    text: 'Copii de siguranță automate și oameni care răspund când ai nevoie.',
    badge: 'inclus',
  },
]

const ERP_BENEFITS = [
  {
    icon: BadgeCheck,
    title: 'Fără contract pe termen lung',
    text: 'Plătești lunar și anulezi oricând, sau pe 12–24 de luni, cu reducere.',
  },
  {
    icon: PlayCircle,
    title: 'Demonstrație gratuită',
    text: 'Îți arătăm ERP-ul înainte să decizi.',
  },
  {
    icon: LockKeyhole,
    title: 'Conturi cu acces limitat',
    text: 'De exemplu, contabilul tău vede doar contabilitatea.',
  },
  {
    icon: Database,
    title: 'Spațiu extra la cerere',
    text: 'Ai nevoie de mai mult spațiu? Discutăm și găsim varianta potrivită.',
  },
]

const PRICE_NAV = [
  { href: '#website-uri', label: 'Website-uri', icon: LayoutTemplate },
  { href: '#erp', label: 'ANDAXI ERP', icon: Calculator },
  { href: '#crm', label: 'ANDAXI CRM', icon: Map },
]

/**
 * Zona paginii în care ești: ultima secțiune din navigator al cărei început a
 * trecut de linia de la o treime din ecran. Deasupra primei secțiuni (în capul
 * paginii) nu e niciuna; după ultima rămâne ultima.
 */
const useZonaActiva = (ids: string[]) => {
  const [activ, setActiv] = useState<string | null>(null)
  useEffect(() => {
    let cadru = 0
    const calculeaza = () => {
      cadru = 0
      const linie = window.innerHeight / 3
      let gasit: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= linie) gasit = id
      }
      setActiv(gasit)
    }
    const laDerulare = () => {
      if (!cadru) cadru = requestAnimationFrame(calculeaza)
    }
    calculeaza()
    window.addEventListener('scroll', laDerulare, { passive: true })
    window.addEventListener('resize', laDerulare)
    return () => {
      window.removeEventListener('scroll', laDerulare)
      window.removeEventListener('resize', laDerulare)
      if (cadru) cancelAnimationFrame(cadru)
    }
    // Lista e constantă pe pagină: observatorul se pune o singură dată.
  }, [])
  return activ
}

const NOTES = [
  'Prețurile sunt exprimate în euro.',
  'Plata în două tranșe: 50% la începerea proiectului, 50% la predare.',
  'Fiecare proiect primește o ofertă exactă înainte de start — fără surprize la final.',
  'Spațiu suplimentar de stocare pentru email-uri, disponibil contra cost.',
  '*La magazinele online, costul lunar variază în funcție de numărul de produse și traficul pe site.',
]

const Preturi = () => {
  usePageMeta('/preturi')
  const reduceMotion = useReducedMotion()
  const zona = useZonaActiva(PRICE_NAV.map((n) => n.href.slice(1)))

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      {/* ===== Hero ===== */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-glow), transparent)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 pt-40 text-center lg:px-8">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-tight text-[color:var(--accent)] md:text-sm">
              Prețuri · Corecte și transparente
            </p>
          </Reveal>

          <h1
            className="max-w-4xl text-5xl tracking-tighter sm:text-6xl md:text-7xl"
            style={{ lineHeight: 0.95 }}
          >
            <span className="block font-medium text-[color:var(--text-1)]">
              <AnimatedText text="Prețuri corecte." delay={0.15} />
            </span>
            <ShinyText
              text="Fără surprize."
              color="var(--accent-strong)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>

          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Știi de la început cât plătești și ce primești. Iar dacă
              proiectul tău nu se încadrează perfect în niciun pachet, îți
              facem o ofertă pe măsură.
            </p>
          </Reveal>

          {/* CMS banner */}
          <Reveal delay={0.45} className="mt-12 w-full">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-[color:var(--accent-border)] bg-[color:var(--accent-tint)] p-8 md:flex-row md:gap-6 md:text-left">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent-strong)]">
                <Cpu className="h-7 w-7 text-white" />
              </span>
              <div>
                <h2 className="text-lg font-medium text-[color:var(--text-1)]">
                  Toate site-urile rulează pe CMS-ul nostru dezvoltat custom
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-3)]">
                  Încărcare fulgerătoare, fără licențe lunare ca la
                  platformele mari — și actualizări incluse.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Navigator sticky ===== */}
      <div className="pointer-events-none sticky top-4 z-40 flex justify-center px-6">
        <Reveal className="pointer-events-auto">
          <nav className="flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--menu-bg)] p-1.5 shadow-lg shadow-black/10 backdrop-blur-md">
            {PRICE_NAV.map(({ href, label, icon: Icon }) => {
              const activ = zona === href.slice(1)
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={activ ? 'location' : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                    activ
                      ? 'text-[color:var(--text-1)]'
                      : 'text-[color:var(--text-3)] hover:bg-[color:var(--accent-tint)] hover:text-[color:var(--text-1)]'
                  }`}
                >
                  {activ && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : 'pret-zona'}
                      className="absolute inset-0 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-tint)]"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <Icon className="relative h-4 w-4 text-[color:var(--accent)]" />
                  <span className="relative hidden sm:inline">{label}</span>
                </a>
              )
            })}
          </nav>
        </Reveal>
      </div>

      {/* ===== Pricing cards ===== */}
      <section
        id="website-uri"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 pb-24 pt-10 lg:px-8"
      >
        <StaggerContainer className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {PACKAGES.map(({ icon: Icon, name, price, monthly, tagline, featured, features }) => (
            <StaggerItem key={name}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition-colors duration-300 ${
                  featured
                    ? 'border-[color:var(--accent-strong)] bg-[color:var(--surface)] shadow-2xl shadow-black/10'
                    : 'border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)]'
                }`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--accent-strong)] px-4 py-1.5 text-xs font-medium text-white">
                    Cel mai ales
                  </span>
                )}

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
                  <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                </span>

                <h3 className="mt-5 text-xl font-medium text-[color:var(--text-1)]">{name}</h3>
                <p className="mt-1 text-sm text-[color:var(--text-4)]">{tagline}</p>

                <div className="mt-6">
                  <span className="text-5xl font-medium tracking-tight text-[color:var(--text-1)]">
                    {price}
                  </span>
                  <p className="mt-1.5 text-sm text-[color:var(--accent)]">{monthly}</p>
                </div>

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--text-3)]"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/contact?interes=${name === 'Magazin online' ? 'magazin' : 'website'}`}
                  className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors duration-300 ${
                    featured
                      ? 'bg-[color:var(--accent-strong)] text-white hover:bg-[color:var(--accent-strong-hover)]'
                      : 'bg-[color:var(--btn-bg)] text-[color:var(--btn-text)] hover:bg-[color:var(--btn-bg-hover)]'
                  }`}
                >
                  Cere o ofertă
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ===== Ce înseamnă găzduire & mentenanță ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">
              Abonamentul lunar
            </p>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Ce înseamnă găzduire & mentenanță?" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Un site nu e gata niciodată „pentru totdeauna" — are nevoie de
              îngrijire ca să rămână rapid, sigur și la zi. Abonamentul lunar
              acoperă tot:
            </p>
          </Reveal>

          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {MAINTENANCE.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                  <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                  <h3 className="mt-4 text-base font-medium text-[color:var(--text-1)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-3)]">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== ANDAXI ERP ===== */}
      <section id="erp" className="scroll-mt-24 border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">
              ANDAXI ERP
            </p>
          </Reveal>
          <h2 className="mt-4 max-w-4xl text-3xl font-medium tracking-tight md:text-5xl">
            <span className="block text-[color:var(--text-1)]">
              <AnimatedText text="Alegi modulele." />
            </span>
            <ShinyText
              text="Plătești doar ce folosești."
              color="var(--accent-strong)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Fără licențe și fără pachete. Fundația, cu nomenclatoare, facturi
              și financiar, costă {PRET_BAZA} € pe lună, cu primul om inclus.
              Adaugi doar modulele de care ai nevoie, fiecare la prețul lui, și
              contabilitatea dacă o ții în program. Asistentul AI se plătește pe
              întrebare, iar aplicația ANDAXI CRM pentru agenții de pe teren,
              separat.
            </p>
          </Reveal>

          {/* Ce primești pe lângă module */}
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ERP_FREE.map(({ icon: Icon, title, text, badge }) => (
              <StaggerItem key={title}>
                <div className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                  <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                  <h3 className="mt-4 text-base font-medium text-[color:var(--text-1)]">
                    {title}
                    <span className="ml-2 rounded-full bg-[color:var(--accent-tint)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--accent)]">
                      {badge}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-3)]">
                    <NoWrapDomain text={text} />
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Modulele și prețurile lor (informativ) */}
          <Reveal delay={0.1} className="mt-12">
            <div className="rounded-3xl border border-[color:var(--border)] p-6 md:p-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="text-lg font-medium text-[color:var(--text-1)]">
                  Modulele, pe lună
                </h3>
                <Link
                  to="/erp#module"
                  className="group inline-flex items-center gap-1 text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]"
                >
                  Vezi ce face fiecare modul
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {[CORE, ...MODULES].map((m) => (
                  <li
                    key={m.key}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm text-[color:var(--text-2)] ${
                      m.alwaysOn ? 'border-[color:var(--accent-border)]' : 'border-[color:var(--border)]'
                    }`}
                  >
                    <m.icon className="h-4 w-4 text-[color:var(--accent)]" />
                    {m.alwaysOn ? 'Fundația' : m.name}
                    <span className="text-xs tabular-nums text-[color:var(--accent)]">
                      · {m.key === 'core' ? `${PRET_BAZA} €` : etichetaPret(m.key)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-[color:var(--text-3)]">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                Plătești doar conturile active: un cont dezactivat nu se mai
                numără. Folosești doar modulele de care ai nevoie, iar restul nu-ți
                încurcă meniul.
              </p>
            </div>
          </Reveal>

          {/* Calculator */}
          <Reveal delay={0.1} className="mt-8">
            <ErpCalculator />
          </Reveal>

          {/* Beneficii */}
          <StaggerContainer className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ERP_BENEFITS.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-[color:var(--border)] p-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                  <div>
                    <h3 className="text-sm font-medium text-[color:var(--text-1)]">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-4)]">
                      {text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== ANDAXI CRM ===== */}
      <section id="crm" className="scroll-mt-24 border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-10 md:p-14 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">
                  ANDAXI CRM
                </p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
                  Prețurile CRM — în curând.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                  Până atunci, spune-ne câți agenți ai pe teren și cum
                  lucrezi — îți facem o ofertă personalizată, cu demonstrație
                  gratuită.
                </p>
                <Link
                  to="/crm"
                  className="group mt-5 inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
                >
                  Descoperă ANDAXI CRM
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
              <Link
                to="/contact?interes=crm"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-200 md:text-base"
              >
                Cere o ofertă personalizată
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Note ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
          <Reveal>
            <ul className="mx-auto flex max-w-3xl flex-col gap-2.5">
              {NOTES.map((note) => (
                <li
                  key={note}
                  className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--text-4)]"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  {note}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8">
          <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl">
            <AnimatedText text="Nu ești sigur ce ți se potrivește?" />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-5 max-w-xl text-sm text-[color:var(--text-3)] md:text-base">
              Povestește-ne despre proiectul tău și îți recomandăm sincer
              varianta potrivită — chiar dacă e cea mai ieftină.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--btn-bg)] px-8 py-4 text-sm font-medium text-[color:var(--btn-text)] transition-colors duration-300 hover:bg-[color:var(--btn-bg-hover)] md:text-base"
            >
              Hai să vorbim
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+40755885973"
              className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)] md:text-base"
            >
              sau sună-ne: 0755 885 973
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Preturi
