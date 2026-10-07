import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Compass, LayoutList, MousePointerClick, Sparkles, Store } from 'lucide-react'
import ShinyText from '../components/ShinyText'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import MenuPreview from '../components/MenuPreview'
import { BUNDLES, MODULES, getModule, withDependencies } from '../data/erpModules'
import type { ModuleKey } from '../data/erpModules'
import { usePageMeta } from '../seo'

/** Ordinea în care previzualizarea pornește modulele (dependențele întâi). */
const SCRIPT: ModuleKey[] = [
  'gestiune',
  'achizitii',
  'casierie',
  'casa_marcat',
  'avize',
  'magazin_online',
  'transformari',
  'chatbot',
]
const STEP_MS = 2600
const HOLD_MS = 4000

/** Starea statică (fără animație): magazinul cu tejghea. */
const STATIC_KEYS = withDependencies(BUNDLES[0].modules)

const STEPS = [
  {
    icon: Store,
    title: 'Alegi tipul firmei',
    text: 'Retail, distribuție, magazin online, producție sau servicii. Pornești cu modulele potrivite.',
  },
  {
    icon: MousePointerClick,
    title: 'Pornești și oprești module',
    text: 'Cu un clic. Dacă un modul are nevoie de altul, afli pe loc de care.',
  },
  {
    icon: LayoutList,
    title: 'Vezi meniul cum se schimbă',
    text: 'Ecranele noi apar în meniu exact unde le găsești și în program.',
  },
  {
    icon: Compass,
    title: 'Ghidul îți arată ce e nou',
    text: 'La fiecare modul pornit, câteva rânduri despre ce a apărut și la ce folosește.',
  },
]

const DemoPreview = () => {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [count, setCount] = useState(0)

  const animated = !reduceMotion
  const active = animated ? SCRIPT.slice(0, count) : STATIC_KEYS
  const last = animated && count > 0 ? SCRIPT[count - 1] : null

  useEffect(() => {
    if (!animated || !inView) return
    const t = window.setTimeout(
      () => setCount((c) => (c >= SCRIPT.length ? 0 : c + 1)),
      count >= SCRIPT.length ? HOLD_MS : STEP_MS,
    )
    return () => window.clearTimeout(t)
  }, [animated, inView, count])

  const lastModule = last ? getModule(last) : null

  return (
    <figure ref={ref} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,var(--accent-glow),transparent)] opacity-70 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--bg)] shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="mx-auto rounded-full border border-[color:var(--border)] px-3 py-1 text-[11px] text-[color:var(--text-4)] md:text-xs">
            Previzualizare · demo ANDAXI ERP
          </span>
          <span className="hidden w-[42px] md:block" aria-hidden />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.9fr)]">
          {/* Comutatoare */}
          <div className="border-b border-[color:var(--border)] p-5 lg:border-b-0 lg:border-r md:p-6">
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Module</p>
            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
              {MODULES.map((m) => {
                const on = active.includes(m.key)
                return (
                  <div
                    key={m.key}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors duration-500 ${
                      m.key === last ? 'bg-[color:var(--accent-tint)]' : ''
                    }`}
                  >
                    <m.icon className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    <span className="min-w-0 flex-1 truncate text-sm text-[color:var(--text-2)]">{m.name}</span>
                    <span
                      className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-300 ${
                        on ? 'justify-end bg-[color:var(--accent-strong)]' : 'justify-start bg-[color:var(--border-strong)]'
                      }`}
                    >
                      <motion.span layout={!reduceMotion} className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Meniul */}
          <div className="border-b border-[color:var(--border)] p-5 lg:border-b-0 lg:border-r md:p-6">
            <p className="mb-4 text-xs uppercase tracking-wider text-[color:var(--text-4)]">Meniul programului</p>
            <MenuPreview active={active} highlight={last} />
          </div>

          {/* Ghidul */}
          <div className="p-5 md:p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-[color:var(--text-4)]">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
              Ghid
            </p>
            <div className="mt-4 min-h-[11rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={last ?? 'start'}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-[color:var(--accent-border)] bg-[color:var(--accent-tint)] p-4"
                >
                  {lastModule ? (
                    <>
                      <p className="text-sm font-medium text-[color:var(--text-1)]">
                        Ai pornit {lastModule.name}.
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-2)]">
                        {lastModule.tagline}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-[color:var(--text-3)]">
                        În meniu: {lastModule.menu.flatMap((g) => g.items).join(' · ')}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[color:var(--text-1)]">
                        {animated ? 'Pornești de la fundație.' : 'Magazin cu tejghea, pornit.'}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-2)]">
                        {animated
                          ? 'Nomenclatoarele, facturile și financiarul sunt mereu acolo. Restul îl adaugi tu.'
                          : 'Gestiune, Achiziții, Casierie și Casă de marcat, peste fundație.'}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Previzualizare: modulele se pornesc pe rând, iar meniul programului se schimbă odată cu ele.
      </figcaption>
    </figure>
  )
}

const ErpDemo = () => {
  usePageMeta('/erp/demo')

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      {/* ===== Hero ===== */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--accent-glow),transparent)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 pt-40 text-center lg:px-8">
          <Reveal>
            <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-tight text-[color:var(--accent)] md:text-sm">
              ANDAXI ERP · Demo în timp real
              <span className="rounded-full border border-[color:var(--accent-border)] px-2.5 py-0.5 text-[11px] normal-case tracking-normal text-[color:var(--text-2)]">
                în curând
              </span>
            </p>
          </Reveal>
          <h1 className="max-w-5xl text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl" style={{ lineHeight: 0.95 }}>
            <span className="block font-medium text-[color:var(--text-1)]">
              <AnimatedText text="Construiește-ți ERP-ul" delay={0.15} />
            </span>
            <ShinyText
              text="și vezi-l pe loc."
              color="var(--accent-strong)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>
          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Demo-ul interactiv e pe drum. Vei porni și opri module și vei
              vedea meniul programului cum se schimbă, cu un ghid care îți
              spune ce a apărut. Până atunci, ți-l arătăm noi, live.
            </p>
          </Reveal>
          <Reveal delay={0.45} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/contact?interes=demo"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:px-8 md:py-4 md:text-base"
            >
              Programează o demonstrație
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/erp#module"
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] px-6 py-3 text-sm text-[color:var(--text-2)] transition-colors duration-300 hover:border-[color:var(--text-1)] hover:text-[color:var(--text-1)] md:px-8 md:py-4 md:text-base"
            >
              Vezi toate modulele
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== Previzualizare ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8">
        <Reveal delay={0.2}>
          <DemoPreview />
        </Reveal>
      </section>

      {/* ===== Ce vei putea face ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Ce vei putea face</p>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Ca în program, doar că te joci tu." />
          </h2>
          <StaggerContainer className="mt-12 flex flex-col">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem key={title}>
                <div className="flex flex-col gap-2 border-t border-[color:var(--border)] py-7 last:border-b md:flex-row md:items-baseline md:gap-10">
                  <span className="text-sm text-[color:var(--text-5)] md:w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="flex items-center gap-3 text-xl font-medium text-[color:var(--text-1)] md:w-80">
                    <Icon className="h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                    {title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_110%,var(--accent-glow),transparent)]" />
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
            <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl">
              <AnimatedText text="Nu vrei să aștepți?" />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-5 max-w-xl text-sm text-[color:var(--text-3)] md:text-base">
                Îți arătăm programul live, cu modulele potrivite firmei tale,
                și răspundem la orice întrebare.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/contact?interes=demo"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-8 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:text-base"
              >
                Programează o demonstrație
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
        </div>
      </section>
    </div>
  )
}

export default ErpDemo
