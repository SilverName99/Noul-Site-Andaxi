import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Factory,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Wrench,
} from 'lucide-react'
import { getModule } from '../data/erpModules'
import {
  PERIOADE,
  PRETURI_MODULE,
  PRET_BAZA,
  PRET_IMPLEMENTARE,
  TIPURI_FIRMA,
  calculeaza,
  cuDependente,
  etichetaPret,
  eur,
  lei,
  pretTip,
  spatiuInclus,
  type ModulPlatit,
  type TipFirma,
} from '../data/erpPricing'

/**
 * Calculatorul ANDAXI ERP pe module, fără pachete: prețul e fundația plus
 * fiecare modul bifat, la prețul lui. Sus, un slider cu tipuri de firmă, fiecare
 * cu un exemplu concret; „Pornește de aici” bifează modulele exemplului și pune
 * oamenii lui. Dedesubt, bifele și calculul, mereu deschise.
 */

const MAX_OAMENI = 30
const MODULE_ORDINE = Object.keys(PRETURI_MODULE) as ModulPlatit[]

const ICON_TIP: Record<string, LucideIcon> = {
  retail: Store,
  distributie: Truck,
  'magazin-online': ShoppingCart,
  productie: Factory,
  servicii: Wrench,
  mica: Package,
}

const necesita = (k: ModulPlatit) =>
  getModule(k).necesita.filter((n): n is ModulPlatit => n !== 'core')

/** Modulele care au nevoie de `k`: pleacă odată cu el. */
const depindDe = (k: ModulPlatit) => MODULE_ORDINE.filter((m) => necesita(m).includes(k))

const numeModul = (k: ModulPlatit) => getModule(k).name

const ease = [0.22, 1, 0.36, 1] as const

/** Suma care se schimbă: intră de jos, ca să se vadă că s-a recalculat. */
const Suma = ({ value, className }: { value: string; className?: string }) => {
  const reduce = useReducedMotion()
  return (
    <span className={`relative inline-block tabular-nums ${className ?? ''}`}>
      <motion.span
        key={value}
        className="inline-block"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease }}
      >
        {value}
      </motion.span>
    </span>
  )
}

/** Sliderul cu tipurile de firmă: derulare orizontală cu „snap”, săgeți și puncte. */
const SliderTipuri = ({
  perioada,
  activ,
  onAlege,
}: {
  perioada: string
  activ: TipFirma | undefined
  onAlege: (t: TipFirma) => void
}) => {
  const reduce = useReducedMotion()
  const listaRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [laCapete, setLaCapete] = useState({ inceput: true, sfarsit: false })

  // Cardul din stânga și dacă mai e loc de mers: din poziția derulării.
  useEffect(() => {
    const el = listaRef.current
    if (!el) return
    let cadru = 0
    const citeste = () => {
      cadru = 0
      const card = el.firstElementChild as HTMLElement | null
      const latime = card ? card.offsetWidth + 16 : el.clientWidth
      setIndex(Math.round(el.scrollLeft / latime))
      setLaCapete({
        inceput: el.scrollLeft <= 4,
        sfarsit: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      })
    }
    const laDerulare = () => {
      if (!cadru) cadru = requestAnimationFrame(citeste)
    }
    citeste()
    el.addEventListener('scroll', laDerulare, { passive: true })
    window.addEventListener('resize', laDerulare)
    return () => {
      el.removeEventListener('scroll', laDerulare)
      window.removeEventListener('resize', laDerulare)
      if (cadru) cancelAnimationFrame(cadru)
    }
  }, [])

  const mergiLa = (i: number) => {
    const el = listaRef.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
  }
  const pas = (d: 1 | -1) => mergiLa(Math.max(0, Math.min(TIPURI_FIRMA.length - 1, index + d)))

  return (
    <div className="relative">
      <div
        ref={listaRef}
        role="list"
        aria-label="Tipuri de firmă, cu exemple"
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 pt-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:-mx-10 md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {TIPURI_FIRMA.map((T) => {
          const ales = activ === T
          const Icon = ICON_TIP[T.key] ?? Store
          return (
            <article
              key={T.key}
              role="listitem"
              className={`relative flex w-[85%] shrink-0 snap-start flex-col gap-4 rounded-[22px] border p-6 transition-colors duration-300 sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)] ${
                T.recomandat
                  ? 'border-[color:var(--accent-border)] bg-gradient-to-b from-[color:var(--accent-tint)] to-[color:var(--surface)]'
                  : 'border-[color:var(--border)] bg-[color:var(--surface)]'
              } ${ales ? 'ring-1 ring-[color:var(--accent-strong)]' : ''}`}
            >
              {T.recomandat && (
                <span className="absolute -top-3 left-5 rounded-full bg-[color:var(--accent-strong)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                  Cel mai ales
                </span>
              )}
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
                  <Icon className="h-5 w-5 text-[color:var(--accent)]" />
                </span>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-[color:var(--text-1)]">
                  {T.name}
                </h3>
                <p className="mt-1 text-sm text-[color:var(--text-4)]">{T.exemple}</p>
              </div>
              <div className="rounded-xl border border-dashed border-[color:var(--border-strong)] px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[color:var(--accent)]">Exemplu</p>
                <p className="mt-0.5 text-sm text-[color:var(--text-2)]">{T.scenariu}</p>
              </div>
              <div>
                <p className="text-4xl font-medium leading-none tracking-tighter text-[color:var(--text-1)]">
                  <Suma value={eur(pretTip(T, perioada))} />
                  <span className="ml-1 text-sm font-normal tracking-normal text-[color:var(--text-4)]">
                    / lună
                  </span>
                </p>
                <p className="mt-2 text-xs text-[color:var(--text-4)]">
                  {T.oameni} {T.oameni === 1 ? 'om' : 'oameni'} ·{' '}
                  {PERIOADE.find((p) => p.key === perioada)?.label.toLowerCase()} · fundația +{' '}
                  {T.modules.length} module
                </p>
              </div>
              <ul className="flex flex-1 flex-col gap-1.5 text-sm text-[color:var(--text-2)]">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  Fundația: nomenclatoare, facturi, financiar
                </li>
                {T.modules.slice(0, 5).map((k) => (
                  <li key={k} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    {numeModul(k)}
                  </li>
                ))}
                {T.modules.length > 5 && (
                  <li className="flex gap-2 text-[color:var(--text-4)]">
                    <Plus className="mt-0.5 h-4 w-4 shrink-0" />
                    și încă {T.modules.length - 5}
                  </li>
                )}
              </ul>
              <p className="text-xs text-[color:var(--text-4)]">
                + Contabilitate {eur(PRETURI_MODULE.contabilitate.pret)}/lună, dacă o ții în program
              </p>
              <button
                type="button"
                onClick={() => onAlege(T)}
                aria-pressed={ales}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300 ${
                  ales
                    ? 'bg-[color:var(--btn-bg)] text-[color:var(--btn-text)] hover:bg-[color:var(--btn-bg-hover)]'
                    : 'border border-[color:var(--border-strong)] text-[color:var(--text-1)] hover:bg-[color:var(--surface-hover)]'
                }`}
              >
                {ales ? (
                  <>
                    <Check className="h-4 w-4" /> Ales
                  </>
                ) : (
                  'Pornește de aici'
                )}
              </button>
            </article>
          )
        })}
      </div>

      {/* Săgețile și punctele */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          {TIPURI_FIRMA.map((T, i) => (
            <span
              key={T.key}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-[color:var(--accent)]' : 'w-1.5 bg-[color:var(--border-strong)]'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {(
            [
              [-1, ChevronLeft, 'Tipul anterior', laCapete.inceput],
              [1, ChevronRight, 'Tipul următor', laCapete.sfarsit],
            ] as const
          ).map(([d, Icon, label, oprit]) => (
            <button
              key={d}
              type="button"
              onClick={() => pas(d)}
              disabled={oprit}
              aria-label={label}
              title={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-strong)] text-[color:var(--text-1)] transition-colors hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent)] disabled:pointer-events-none disabled:opacity-30"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const ErpCalculator = () => {
  const reduce = useReducedMotion()
  const [oameni, setOameni] = useState(TIPURI_FIRMA[0].oameni)
  const [perioada, setPerioada] = useState('12')
  const [ales, setAles] = useState<Set<ModulPlatit>>(() => new Set(TIPURI_FIRMA[0].modules))
  const [bucati, setBucati] = useState<Partial<Record<ModulPlatit, number>>>({})

  const sel = useMemo(() => cuDependente(ales, necesita), [ales])
  const r = useMemo(() => calculeaza(sel, oameni, perioada, bucati), [sel, oameni, perioada, bucati])

  /** Tipul care are exact modulele bifate și oamenii lui. */
  const tipActiv = TIPURI_FIRMA.find(
    (T) => T.oameni === oameni && T.modules.length === sel.size && T.modules.every((k) => sel.has(k)),
  )

  const alegeTip = (T: TipFirma) => {
    setAles(new Set(T.modules))
    setOameni(T.oameni)
  }

  const comuta = (k: ModulPlatit) =>
    setAles((prev) => {
      const next = cuDependente(prev, necesita)
      if (next.has(k)) {
        // Scoți un modul: pleacă și cele care nu merg fără el.
        const scoase = [k]
        while (scoase.length) {
          const x = scoase.pop()!
          next.delete(x)
          depindDe(x).forEach((d) => next.has(d) && scoase.push(d))
        }
        return next
      }
      next.add(k)
      return cuDependente(next, necesita)
    })

  const schimbaBucati = (k: ModulPlatit, d: number) =>
    setBucati((b) => ({ ...b, [k]: Math.min(9, Math.max(0, (b[k] ?? 0) + d)) }))

  const fillPct = ((oameni - 1) / (MAX_OAMENI - 1)) * 100
  const cuExtra = [...sel].filter((k) => PRETURI_MODULE[k].extra)
  const bifate = MODULE_ORDINE.filter((k) => sel.has(k))

  // Ce pleacă în formularul de contact: modulele alese, ca bife pregătite.
  const linkOferta = `/contact?interes=erp&module=${[...sel].join(',')}`

  return (
    <div className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-8 md:p-10">
      {/* ===== Oameni și perioada ===== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-md items-center gap-3 text-sm text-[color:var(--text-3)]">
          <label htmlFor="erp-oameni" className="flex shrink-0 items-center gap-2">
            <Users className="h-4 w-4 text-[color:var(--accent)]" />
            Oameni
          </label>
          <input
            id="erp-oameni"
            type="range"
            min={1}
            max={MAX_OAMENI}
            value={oameni}
            onChange={(e) => setOameni(Number(e.target.value))}
            aria-valuetext={`${oameni} ${oameni === 1 ? 'om' : 'oameni'}`}
            className="erp-range"
            style={{
              background: `linear-gradient(to right, var(--accent-strong) ${fillPct}%, var(--border) ${fillPct}%)`,
            }}
          />
          <b className="w-8 shrink-0 text-right text-lg font-medium tabular-nums text-[color:var(--text-1)]">
            {oameni}
          </b>
        </div>

        <div
          role="group"
          aria-label="Perioada de plată"
          className="grid w-full grid-cols-4 gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1 sm:inline-flex sm:w-auto sm:self-start sm:rounded-full lg:self-auto"
        >
          {PERIOADE.map((p) => {
            const activ = p.key === perioada
            return (
              <button
                key={p.key}
                type="button"
                aria-pressed={activ}
                onClick={() => setPerioada(p.key)}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-sm transition-colors duration-200 sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-2 ${
                  activ
                    ? 'text-[color:var(--btn-text)]'
                    : 'text-[color:var(--text-3)] hover:text-[color:var(--text-1)]'
                }`}
              >
                {activ && (
                  <motion.span
                    layoutId={reduce ? undefined : 'erp-perioada'}
                    className="absolute inset-0 rounded-xl bg-[color:var(--btn-bg)] sm:rounded-full"
                    transition={{ duration: 0.35, ease }}
                  />
                )}
                <span className="relative">{p.label}</span>
                {p.reducere > 0 && (
                  <span
                    className={`relative text-[11px] ${activ ? 'opacity-75' : 'text-[color:var(--good)]'}`}
                  >
                    -{Math.round(p.reducere * 100)}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== Tipurile de firmă ===== */}
      <div className="mt-6">
        <SliderTipuri perioada={perioada} activ={tipActiv} onAlege={alegeTip} />
      </div>

      {/* ===== Modulele și calculul ===== */}
      <div className="mt-6 overflow-hidden rounded-[22px] border border-[color:var(--border)]">
        <div className="flex items-center justify-between gap-4 bg-[color:var(--surface)] px-5 py-4 sm:px-6">
          <span className="text-base font-medium text-[color:var(--text-1)]">
            Modulele tale: bifează sau scoate
          </span>
          <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-[color:var(--text-1)]">
            <Suma value={eur(r.lunar)} />
            <span className="hidden text-[color:var(--text-4)] sm:inline">/ lună</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Bifele */}
          <div className="grid grid-cols-1 content-start gap-2 sm:grid-cols-2">
            {MODULE_ORDINE.map((k) => {
              const on = sel.has(k)
              const cere = necesita(k)
              return (
                <button
                  key={k}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => comuta(k)}
                  className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 ${
                    on
                      ? 'border-[color:var(--accent-border)] bg-[color:var(--accent-tint)]'
                      : 'border-[color:var(--border)] hover:border-[color:var(--border-strong)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                      on
                        ? 'border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)] text-white'
                        : 'border-[color:var(--border-strong)]'
                    }`}
                  >
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[color:var(--text-1)]">
                      {numeModul(k)} · <span className="tabular-nums">{etichetaPret(k)}</span>
                    </span>
                    <span className="block text-xs text-[color:var(--text-4)]">
                      {PRETURI_MODULE[k].scurt}
                      {cere.length > 0 && ` · cere ${cere.map(numeModul).join(', ')}`}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Socoteala */}
          <div
            aria-live="polite"
            className="flex flex-col gap-2 border-t border-[color:var(--border)] pt-5 text-sm lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
          >
            <span className="text-xs uppercase tracking-wider text-[color:var(--accent)]">
              Calculul tău
            </span>
            <p className="text-4xl font-medium tracking-tighter text-[color:var(--text-1)]">
              <Suma value={eur(r.lunar)} />
            </p>
            <span className="text-xs text-[color:var(--text-4)]">≈ {lei(r.lunar)} / lună, fără TVA</span>

            <div className="mt-2 flex justify-between gap-3 text-[color:var(--text-3)]">
              <span>Fundația</span>
              <span className="shrink-0 tabular-nums">{eur(PRET_BAZA)}</span>
            </div>
            <div className="flex justify-between gap-3 text-[color:var(--text-3)]">
              <span>Module ({bifate.length})</span>
              <span className="shrink-0 tabular-nums">{eur(r.module)}</span>
            </div>

            {cuExtra.map((k) => {
              const ex = PRETURI_MODULE[k].extra!
              const n = bucati[k] ?? 0
              return (
                <div key={k} className="flex items-center justify-between gap-3 text-[color:var(--text-3)]">
                  <span>
                    {ex.eticheta}
                    <span className="block text-xs text-[color:var(--text-4)]">+{eur(ex.pret)} fiecare</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center rounded-full border border-[color:var(--border)]">
                    <button
                      type="button"
                      onClick={() => schimbaBucati(k, -1)}
                      aria-label={`${ex.eticheta}: mai puține`}
                      className="flex h-7 w-7 items-center justify-center text-[color:var(--text-2)] disabled:opacity-30"
                      disabled={n === 0}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[1.25rem] text-center text-xs tabular-nums text-[color:var(--text-1)]">
                      {n}
                    </span>
                    <button
                      type="button"
                      onClick={() => schimbaBucati(k, 1)}
                      aria-label={`${ex.eticheta}: mai multe`}
                      className="flex h-7 w-7 items-center justify-center text-[color:var(--text-2)] disabled:opacity-30"
                      disabled={n === 9}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
              )
            })}

            <div className="flex justify-between gap-3 text-[color:var(--text-3)]">
              <span>Oameni în plus{oameni > 1 && ` (${oameni - 1})`}</span>
              <span className="shrink-0 tabular-nums">{eur(r.oameni)}</span>
            </div>
            {r.perioada.reducere > 0 && (
              <div className="flex justify-between gap-3 text-[color:var(--good)]">
                <span>
                  Reducere {r.perioada.label} (-{Math.round(r.perioada.reducere * 100)}%)
                </span>
                <span className="shrink-0 tabular-nums">−{eur(r.brut - r.lunar)}</span>
              </div>
            )}
            {sel.has('chatbot') && (
              <p className="text-xs text-[color:var(--text-4)]">
                Asistentul AI nu intră în suma lunară: plătești doar întrebările la care a răspuns.
              </p>
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-[color:var(--border)] pt-3">
              <div className="flex justify-between gap-3 text-[color:var(--text-3)]">
                <span>
                  {r.perioada.luni === 1 ? 'Plătești lunar' : `Plătești o dată la ${r.perioada.luni} luni`}
                </span>
                <b className="shrink-0 font-medium tabular-nums text-[color:var(--text-1)]">{eur(r.platit)}</b>
              </div>
              <div className="flex justify-between gap-3 text-[color:var(--text-3)]">
                <span>Implementare și migrare</span>
                <b className="shrink-0 font-medium tabular-nums text-[color:var(--text-1)]">
                  {r.implementare ? eur(r.implementare) : 'gratuită'}
                </b>
              </div>
              <span className="text-xs text-[color:var(--text-4)]">
                Spațiu inclus: {spatiuInclus(oameni)} · contul contabilului e gratuit
              </span>
            </div>

            <Link
              to={linkOferta}
              className="group mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)]"
            >
              Cere o ofertă
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Regulile, pe scurt ===== */}
      <ul className="mt-6 flex flex-col gap-1.5 text-xs leading-relaxed text-[color:var(--text-4)]">
        <li>
          Prețuri în euro, pe lună, fără TVA; în lei la aproximativ 5,30 lei/€. Fundația ({eur(PRET_BAZA)}:
          nomenclatoare, facturi, financiar) include primul om. Fiecare modul se adaugă la prețul lui, fără
          pachete. Oamenii în plus: 25 € al 2-lea–al 5-lea, 22 € al 6-lea–al 10-lea, 19 € de la al 11-lea.
        </li>
        <li>
          Contul contabilului se adaugă gratuit, iar la cerere și unul de vizualizare. Spațiul: 2 GB până la
          5 oameni, 10 GB până la 10, 15 GB peste.
        </li>
        <li>
          Implementarea, migrarea și instruirea sunt gratuite la plata pe 12 sau 24 de luni. Lunar sau pe 6
          luni costă {eur(PRET_IMPLEMENTARE)} o singură dată.
        </li>
      </ul>
    </div>
  )
}

export default ErpCalculator
