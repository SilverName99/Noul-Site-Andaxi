import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Minus, Plus, Users } from 'lucide-react'
import { getModule } from '../data/erpModules'
import {
  PERIOADE,
  PLANURI,
  PLANURI_PRINCIPALE,
  PRETURI_MODULE,
  PRET_BAZA,
  PRET_IMPLEMENTARE,
  calculeaza,
  cuDependente,
  etichetaPret,
  eur,
  lei,
  pretPlan,
  pretSeparat,
  spatiuInclus,
  type ModulPlatit,
  type PlanErp,
} from '../data/erpPricing'

/**
 * Calculatorul ANDAXI ERP pe module: planurile gata făcute în față, iar sub
 * ele „Personalizează”, unde bifezi modulele una câte una. Prețul ales e
 * mereu cel mai mic: dacă modulele bifate încap într-un pachet, se aplică
 * pachetul (vezi `calculeaza` în src/data/erpPricing.ts).
 */

const MAX_OAMENI = 30
const MODULE_ORDINE = Object.keys(PRETURI_MODULE) as ModulPlatit[]

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

const ErpCalculator = () => {
  const reduce = useReducedMotion()
  const [oameni, setOameni] = useState(3)
  const [perioada, setPerioada] = useState('12')
  const [ales, setAles] = useState<Set<ModulPlatit>>(
    () => new Set(PLANURI.find((p) => p.key === 'start')!.modules),
  )
  const [bucati, setBucati] = useState<Partial<Record<ModulPlatit, number>>>({})
  const [deschis, setDeschis] = useState(false)

  const sel = useMemo(() => cuDependente(ales, necesita), [ales])
  const r = useMemo(() => calculeaza(sel, oameni, perioada, bucati), [sel, oameni, perioada, bucati])

  /** Planul care are exact modulele bifate. */
  const planActiv = PLANURI.find(
    (P) => P.modules.length === sel.size && P.modules.every((k) => sel.has(k)),
  )
  const principale = PLANURI_PRINCIPALE.map((k) => PLANURI.find((P) => P.key === k)!)
  const altele = PLANURI.filter((P) => !PLANURI_PRINCIPALE.includes(P.key))

  const alegePlan = (P: PlanErp) => setAles(new Set(P.modules))

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

  // Ce pleacă în formularul de contact: modulele alese, ca bife pregătite.
  const linkOferta = `/contact?interes=erp&module=${[...sel].join(',')}`

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-8 md:p-10">
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

      {/* ===== Planurile ===== */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {principale.map((P) => {
          const activ = planActiv === P
          return (
            <motion.article
              key={P.key}
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`relative flex flex-col gap-4 rounded-[22px] border p-6 transition-colors duration-300 ${
                P.recomandat
                  ? 'border-[color:var(--accent-border)] bg-gradient-to-b from-[color:var(--accent-tint)] to-[color:var(--surface)]'
                  : 'border-[color:var(--border)] bg-[color:var(--surface)]'
              } ${activ ? 'ring-1 ring-[color:var(--accent-strong)]' : ''}`}
            >
              {P.recomandat && (
                <span className="absolute -top-3 left-5 rounded-full bg-[color:var(--accent-strong)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                  Cel mai ales
                </span>
              )}
              <div>
                <h3 className="text-xl font-medium tracking-tight text-[color:var(--text-1)]">
                  {P.name}
                </h3>
                <p className="mt-1 text-sm text-[color:var(--text-4)]">{P.pentru}</p>
              </div>
              <div>
                <p className="text-4xl font-medium leading-none tracking-tighter text-[color:var(--text-1)]">
                  <Suma value={eur(pretPlan(P, oameni, perioada))} />
                  <span className="ml-1 text-sm font-normal tracking-normal text-[color:var(--text-4)]">
                    / lună
                  </span>
                </p>
                <p className="mt-2 text-xs text-[color:var(--text-4)] line-through">
                  module separat: {eur(pretSeparat(P))} + oameni
                </p>
              </div>
              <ul className="flex flex-1 flex-col gap-1.5 text-sm text-[color:var(--text-2)]">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  Baza: facturi, contabilitate, ANAF
                </li>
                {P.modules.slice(0, 6).map((k) => (
                  <li key={k} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    {numeModul(k)}
                  </li>
                ))}
                {P.modules.length > 6 && (
                  <li className="flex gap-2 text-[color:var(--text-4)]">
                    <Plus className="mt-0.5 h-4 w-4 shrink-0" />
                    și încă {P.modules.length - 6}
                  </li>
                )}
              </ul>
              <button
                type="button"
                onClick={() => alegePlan(P)}
                aria-pressed={activ}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300 ${
                  activ
                    ? 'bg-[color:var(--btn-bg)] text-[color:var(--btn-text)] hover:bg-[color:var(--btn-bg-hover)]'
                    : 'border border-[color:var(--border-strong)] text-[color:var(--text-1)] hover:bg-[color:var(--surface-hover)]'
                }`}
              >
                {activ ? (
                  <>
                    <Check className="h-4 w-4" /> Ales
                  </>
                ) : (
                  `Alege ${P.name}`
                )}
              </button>
            </motion.article>
          )
        })}
      </div>

      {/* ===== Celelalte pachete ===== */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-[color:var(--text-4)]">Mai sunt:</span>
        {altele.map((P) => {
          const activ = planActiv === P
          return (
            <button
              key={P.key}
              type="button"
              onClick={() => alegePlan(P)}
              aria-pressed={activ}
              title={P.pentru}
              className={`rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
                activ
                  ? 'border-[color:var(--accent-border)] text-[color:var(--accent)]'
                  : 'border-[color:var(--border)] text-[color:var(--text-3)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-1)]'
              }`}
            >
              {P.name} · <span className="tabular-nums">{eur(pretPlan(P, oameni, perioada))}</span>
            </button>
          )
        })}
      </div>

      {/* ===== Personalizează ===== */}
      <div className="mt-6 overflow-hidden rounded-[22px] border border-[color:var(--border)]">
        <button
          type="button"
          onClick={() => setDeschis((d) => !d)}
          aria-expanded={deschis}
          aria-controls="erp-personalizeaza"
          className="flex w-full items-center justify-between gap-4 bg-[color:var(--surface)] px-5 py-4 text-left transition-colors hover:bg-[color:var(--surface-hover)] sm:px-6"
        >
          <span className="text-base font-medium text-[color:var(--text-1)]">
            Personalizează: adaugă sau scoate module
          </span>
          <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-[color:var(--text-1)]">
            <Suma value={eur(r.lunar)} />
            <span className="hidden text-[color:var(--text-4)] sm:inline">/ lună</span>
            <ChevronDown
              className={`h-4 w-4 text-[color:var(--text-3)] transition-transform duration-300 ${deschis ? 'rotate-180' : ''}`}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {deschis && (
            <motion.div
              id="erp-personalizeaza"
              key="corp"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
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
                  <div
                    aria-disabled="true"
                    className="flex items-start gap-3 rounded-xl border border-dashed border-[color:var(--border)] px-3 py-2.5 opacity-60"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[5px] border border-[color:var(--border-strong)]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[color:var(--text-1)]">
                        Plan Facturare · va urma
                      </span>
                      <span className="block text-xs text-[color:var(--text-4)]">
                        fără contabilitate, pentru firmele cu contabil extern
                      </span>
                    </span>
                  </div>
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
                  <span className="text-xs text-[color:var(--text-4)]">
                    ≈ {lei(r.lunar)} / lună, fără TVA
                  </span>

                  <div className="mt-2 flex justify-between gap-3 text-[color:var(--text-3)]">
                    <span>
                      {r.pachet ? `Pachet ${r.pachet.name}` : 'Baza + module'}
                      {r.pachet && r.pestePachet.length > 0 &&
                        ` + ${r.pestePachet.map(numeModul).join(', ')}`}
                    </span>
                    <span className="shrink-0 tabular-nums">{eur(r.pret)}</span>
                  </div>

                  {cuExtra.map((k) => {
                    const ex = PRETURI_MODULE[k].extra!
                    const n = bucati[k] ?? 0
                    return (
                      <div key={k} className="flex items-center justify-between gap-3 text-[color:var(--text-3)]">
                        <span>
                          {ex.eticheta}
                          <span className="block text-xs text-[color:var(--text-4)]">
                            +{eur(ex.pret)} fiecare
                          </span>
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
                    <span>
                      Oameni în plus{oameni > 1 && ` (${oameni - 1})`}
                    </span>
                    <span className="shrink-0 tabular-nums">{eur(r.oameni)}</span>
                  </div>
                  {r.perioada.reducere > 0 && (
                    <div className="flex justify-between gap-3 text-[color:var(--good)]">
                      <span>Reducere {r.perioada.label} (-{Math.round(r.perioada.reducere * 100)}%)</span>
                      <span className="shrink-0 tabular-nums">−{eur(r.brut - r.lunar)}</span>
                    </div>
                  )}
                  {r.economiePachet > 0 && (
                    <div className="flex justify-between gap-3 text-[color:var(--good)]">
                      <span>Economisești cu pachetul</span>
                      <span className="shrink-0 tabular-nums">{eur(r.economiePachet)}/lună</span>
                    </div>
                  )}
                  {sel.has('chatbot') && (
                    <p className="text-xs text-[color:var(--text-4)]">
                      Asistentul AI nu intră în suma lunară: plătești doar întrebările la care a
                      răspuns.
                    </p>
                  )}
                  {r.inPlus.length > 0 && (
                    <p className="text-xs text-[color:var(--text-4)]">
                      Pachetul îți dă în plus: {r.inPlus.map(numeModul).join(', ')}.
                    </p>
                  )}

                  <div className="mt-2 flex flex-col gap-2 border-t border-[color:var(--border)] pt-3">
                    <div className="flex justify-between gap-3 text-[color:var(--text-3)]">
                      <span>
                        {r.perioada.luni === 1 ? 'Plătești lunar' : `Plătești o dată la ${r.perioada.luni} luni`}
                      </span>
                      <b className="shrink-0 font-medium tabular-nums text-[color:var(--text-1)]">
                        {eur(r.platit)}
                      </b>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Regulile, pe scurt ===== */}
      <ul className="mt-6 flex flex-col gap-1.5 text-xs leading-relaxed text-[color:var(--text-4)]">
        <li>
          Prețuri în euro, pe lună, fără TVA; în lei la aproximativ 5,30 lei/€. Baza ({eur(PRET_BAZA)})
          include primul om. Oamenii în plus: 25 € al 2-lea–al 5-lea, 22 € al 6-lea–al 10-lea, 19 € de la
          al 11-lea.
        </li>
        <li>
          Contul contabilului se adaugă gratuit, iar la cerere și unul de vizualizare. Spațiul: 2 GB până la
          5 oameni, 10 GB până la 10, 15 GB peste.
        </li>
        <li>
          Implementarea, migrarea și instruirea sunt gratuite la plata pe 12 sau 24 de luni. Lunar sau pe 6
          luni costă {eur(PRET_IMPLEMENTARE)} o singură dată, sumă care se scade dacă treci pe plata anuală în
          90 de zile.
        </li>
      </ul>
    </div>
  )
}

export default ErpCalculator
