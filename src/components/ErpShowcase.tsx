import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Lock, Pause, Play } from 'lucide-react'
import type { ErpShot } from '../data/erpShots'
import { getModule } from '../data/erpModules'

/** Cât stă fiecare ecran, în redare automată. */
const DURATION = 5500
const EASE = [0.22, 1, 0.36, 1] as const

interface ErpShowcaseProps {
  shots: ErpShot[]
  /** Eticheta filei pentru fiecare pas din flux (ex. vinzi → „Vinzi”). */
  labels: Record<string, string>
}

/** Schița unui ecran din program, cât lipsește captura adevărată. Aceleași
 *  proporții, ca pagina să nu sară când vin imaginile. */
const ShotPlaceholder = ({ shot }: { shot: ErpShot }) => {
  const rows = [0.72, 0.55, 0.83, 0.6, 0.68, 0.5, 0.77, 0.62]
  return (
    <div className="flex h-full w-full" role="img" aria-label={`${shot.title} — schiță a ecranului`}>
      <div className="hidden w-[21%] flex-col gap-2 border-r border-[color:var(--border)] bg-[color:var(--surface)] p-3 sm:flex md:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-5 w-5 rounded-md bg-[color:var(--accent-strong)] md:h-6 md:w-6" />
          <span className="h-2 w-12 rounded-full bg-[color:var(--border-strong)]" />
        </div>
        {[0.8, 0.65, 0.9, 0.7, 0.75, 0.6, 0.85].map((w, i) => (
          <span
            key={i}
            className={`h-5 rounded-md md:h-6 ${
              i === 2 ? 'bg-[color:var(--accent-tint)]' : 'bg-transparent'
            } flex items-center px-2`}
          >
            <span
              className={`h-1.5 rounded-full ${
                i === 2 ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--border-strong)]'
              }`}
              style={{ width: `${w * 100}%` }}
            />
          </span>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-5 md:gap-4 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-medium text-[color:var(--text-1)] sm:text-sm md:text-lg">
            {shot.title}
          </p>
          <span className="shrink-0 rounded-full bg-[color:var(--accent-strong)] px-2.5 py-1 text-[9px] font-medium text-white sm:text-[11px] md:px-3.5 md:text-xs">
            + Document nou
          </span>
        </div>
        <div className="flex gap-2">
          {[64, 48, 80].map((w) => (
            <span
              key={w}
              className="h-5 rounded-full border border-[color:var(--border)] md:h-7"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[color:var(--border)]">
          <div className="grid grid-cols-4 gap-2 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 md:px-4 md:py-3">
            {(shot.columns ?? ['Document', 'Partener', 'Valoare', 'Stare']).map((c) => (
              <span
                key={c}
                className="truncate text-[9px] uppercase tracking-wider text-[color:var(--text-4)] sm:text-[10px] md:text-xs"
              >
                {c}
              </span>
            ))}
          </div>
          {rows.map((w, i) => (
            <div
              key={i}
              className={`grid flex-1 grid-cols-4 items-center gap-2 border-b border-[color:var(--border)] px-3 py-2 last:border-b-0 md:px-4 md:py-3 ${
                i === 1 ? 'bg-[color:var(--accent-tint)]' : ''
              }`}
            >
              <span className="h-1.5 rounded-full bg-[color:var(--border-strong)] md:h-2" style={{ width: `${w * 90}%` }} />
              <span className="h-1.5 rounded-full bg-[color:var(--border)] md:h-2" style={{ width: `${(1 - w / 2) * 100}%` }} />
              <span className="h-1.5 rounded-full bg-[color:var(--border)] md:h-2" style={{ width: `${w * 70}%` }} />
              {i === 1 ? (
                <span className="w-fit truncate rounded-full border border-[color:var(--accent-border)] px-2 py-0.5 text-[8px] font-medium text-[color:var(--accent)] sm:text-[10px] md:text-xs">
                  {shot.pill ?? 'Validat'}
                </span>
              ) : (
                <span className="h-1.5 w-1/2 rounded-full bg-[color:var(--border)] md:h-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ShotImage = ({ shot }: { shot: ErpShot }) => {
  const [failed, setFailed] = useState(false)
  if (!shot.image || failed) return <ShotPlaceholder shot={shot} />
  return (
    <img
      src={shot.image}
      alt={`${shot.title} — ecran din ANDAXI ERP`}
      decoding="async"
      // Fără tragerea nativă a imaginii: altfel ea înghite gestul de glisare.
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full select-none object-cover object-left-top"
    />
  )
}

/** Ecranul intră din partea în care mergi: înainte din dreapta, înapoi din stânga. */
const slide = {
  enter: (dir: number) => ({ opacity: 0, x: 48 * dir, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: -48 * dir, scale: 0.985 }),
}
const fade = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }

/** Cât trebuie tras cu degetul ca să treacă la ecranul vecin. */
const SWIPE = 60

/**
 * Prezentarea programului: o fereastră de browser cu file pe pașii firmei
 * (Vinzi → ANAF). Ecranele se schimbă singure, cu bara de progres sub filă;
 * se opresc la hover, la focus, când secțiunea nu se vede și la butonul de
 * pauză. Săgețile (și tragerea cu degetul, pe telefon) mută la ecranul vecin
 * fără să aștepți. Cu „reduce motion”, nu pornesc singure și se schimbă fără
 * mișcare.
 */
const ErpShowcase = ({ shots, labels }: ErpShowcaseProps) => {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  /** Sensul ultimei treceri: 1 înainte, -1 înapoi. */
  const [dir, setDir] = useState(1)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.4 })
  const progress = useMotionValue(0)

  // Filele sunt pașii firmei; un pas poate avea mai multe ecrane, care se
  // derulează pe rând (bara filei e împărțită în segmente, ca la „stories”).
  const flows = [...new Set(shots.map((s) => s.flow))]
  const shot = shots[active]
  const activeFlow = flows.indexOf(shot.flow)
  const flowShots = shots.filter((s) => s.flow === shot.flow)
  const posInFlow = flowShots.indexOf(shot)
  const firstOfFlow = (f: number) => shots.findIndex((s) => s.flow === flows[f])

  const autoplay = !reduceMotion && !paused
  const playing = autoplay && inView && !hovered && !focused

  useAnimationFrame((_, delta) => {
    if (!playing) return
    // Plafonat: după o filă de fundal, delta poate fi de câteva secunde.
    const next = progress.get() + Math.min(delta, 100) / DURATION
    if (next >= 1) {
      progress.set(0)
      setDir(1)
      setActive((a) => (a + 1) % shots.length)
    } else {
      progress.set(next)
    }
  })

  // Pe telefon filele se derulează pe orizontală: fila activă rămâne la vedere
  // (doar orizontal, ca pagina să nu sară).
  useEffect(() => {
    const list = listRef.current
    const tab = tabRefs.current[activeFlow]
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: tab.offsetLeft - 24, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [activeFlow, reduceMotion])

  // Ecranele vecine se încarcă dinainte, ca trecerea să nu arate un cadru gol.
  useEffect(() => {
    for (const d of [1, -1]) {
      const img = shots[(active + d + shots.length) % shots.length]?.image
      if (img) new Image().src = img
    }
  }, [active, shots])

  const select = (i: number, sens = i >= active ? 1 : -1) => {
    progress.set(0)
    setDir(sens)
    setActive(i)
  }

  /** La ecranul vecin, cu săgețile: după ultimul vine primul. */
  const step = (d: 1 | -1) => select((active + d + shots.length) % shots.length, d)

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, f: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (f + delta + flows.length) % flows.length
    select(firstOfFlow(next))
    tabRefs.current[next]?.focus()
  }

  const mod = getModule(shot.module)

  return (
    <div
      ref={rootRef}
      // Doar focusul de la tastatură oprește derularea; un clic pe filă nu.
      onFocusCapture={(e) => {
        if ((e.target as HTMLElement).matches?.(':focus-visible')) setFocused(true)
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      {/* File */}
      <div className="flex items-center gap-3">
        <div
          role="tablist"
          aria-label="Ecrane din ANDAXI ERP"
          ref={listRef}
          className="relative -mx-6 flex flex-1 snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {flows.map((flow, f) => {
            const selected = f === activeFlow
            const count = shots.filter((s) => s.flow === flow).length
            return (
              <button
                key={flow}
                ref={(el) => {
                  tabRefs.current[f] = el
                }}
                type="button"
                role="tab"
                id={`erp-tab-${flow}`}
                aria-selected={selected}
                aria-controls="erp-showcase-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(firstOfFlow(f))}
                onKeyDown={(e) => onTabKey(e, f)}
                className={`relative flex min-w-[7.5rem] flex-1 snap-start flex-col gap-2.5 rounded-xl px-3 pb-3 pt-2.5 text-left transition-colors duration-300 ${
                  selected
                    ? 'bg-[color:var(--surface-hover)] text-[color:var(--text-1)]'
                    : 'text-[color:var(--text-4)] hover:text-[color:var(--text-2)]'
                }`}
              >
                <span className="flex items-baseline gap-2 text-sm font-medium">
                  <span className="text-xs text-[color:var(--text-5)]">
                    {String(f + 1).padStart(2, '0')}
                  </span>
                  {labels[flow] ?? flow}
                </span>
                <span className="flex w-full gap-1">
                  {Array.from({ length: count }, (_, k) => (
                    <span
                      key={k}
                      className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-[color:var(--border)]"
                    >
                      {selected && k < posInFlow && (
                        <span className="absolute inset-0 rounded-full bg-[color:var(--accent)]" />
                      )}
                      {selected && k === posInFlow && (
                        <motion.span
                          className="absolute inset-0 origin-left rounded-full bg-[color:var(--accent)]"
                          style={reduceMotion ? undefined : { scaleX: progress }}
                        />
                      )}
                    </span>
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Pornește derularea ecranelor' : 'Oprește derularea ecranelor'}
            title={paused ? 'Pornește derularea' : 'Oprește derularea'}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--text-3)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-1)] sm:flex"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Fereastra */}
      <div
        className="relative mt-6"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,var(--accent-glow),transparent)] opacity-70 blur-2xl"
        />
        <div
          id="erp-showcase-panel"
          role="tabpanel"
          aria-labelledby={`erp-tab-${shot.flow}`}
          className="relative overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--bg)] shadow-2xl shadow-black/30"
        >
          {/* Bara browserului */}
          <div className="flex items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 md:px-4">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            </div>
            <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1 text-[11px] text-[color:var(--text-4)] md:text-xs">
              <Lock className="h-3 w-3 shrink-0" />
              <span className="truncate">
                firma-ta.erp.andaxi.ro
                <span className="text-[color:var(--text-2)]">{shot.path}</span>
              </span>
            </div>
            <span className="hidden w-[42px] text-right text-[11px] tabular-nums text-[color:var(--text-4)] md:block">
              {active + 1}/{shots.length}
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={shot.key}
                className="absolute inset-0"
                custom={dir}
                variants={reduceMotion ? fade : slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: EASE }}
                // Pe telefon: tragi spre stânga pentru următorul, spre dreapta
                // pentru cel dinainte. Derularea paginii în sus și în jos merge.
                drag={reduceMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x <= -SWIPE) step(1)
                  else if (info.offset.x >= SWIPE) step(-1)
                }}
              >
                <ShotImage shot={shot} />
              </motion.div>
            </AnimatePresence>

            {/* Săgețile: la ecranul vecin, fără să aștepți */}
            {(
              [
                [-1, 'left-2 md:left-3', ChevronLeft, 'Ecranul anterior'],
                [1, 'right-2 md:right-3', ChevronRight, 'Ecranul următor'],
              ] as const
            ).map(([d, pos, Icon, label]) => (
              <button
                key={d}
                type="button"
                onClick={() => step(d)}
                aria-label={label}
                title={label}
                className={`absolute top-1/2 ${pos} z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-[color:var(--menu-bg)] text-[color:var(--text-1)] shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent)] md:h-11 md:w-11`}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explicația ecranului */}
      <div className="mt-8 min-h-[5.5rem]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={shot.key}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10"
          >
            <div>
              <h3 className="text-lg font-medium text-[color:var(--text-1)] md:text-xl">{shot.title}</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                {shot.caption}
              </p>
            </div>
            <a
              href={`#${mod.key}`}
              className="group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--text-3)] transition-colors hover:border-[color:var(--accent-border)] hover:text-[color:var(--text-1)]"
            >
              <mod.icon className="h-4 w-4 text-[color:var(--accent)]" />
              {mod.alwaysOn ? 'Trunchiul ERP' : `Modulul ${mod.name}`}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ErpShowcase
