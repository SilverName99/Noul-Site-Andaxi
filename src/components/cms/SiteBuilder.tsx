import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Lock, MonitorSmartphone, RotateCcw, Sparkles, X } from 'lucide-react'
import {
  CATEGORII,
  PACHETE,
  PLUGINS,
  blocat,
  calculeazaCms,
  cuDependente,
  depindDe,
  disponibil,
  euro,
  getPachet,
  getPlugin,
  inclus,
  type PachetKey,
  type PluginKey,
} from '../../data/cmsPlugins'
import { HlContext } from './Hl'
import MockSite, { BulaChat, PanouOferte } from './MockSite'
import MockAdmin from './MockAdmin'

/**
 * Calculatorul live al ANDAXI CMS: în stânga alegi pachetul și bifezi
 * plugin-urile, în dreapta vezi site-ul (sau panoul de administrare) cum se
 * schimbă. Ce aduce plugin-ul abia bifat apare încadrat cu roșu, iar jos
 * apare explicația lui.
 */

const ease = [0.22, 1, 0.36, 1] as const

/** Site-ul se desenează la lățimea unui ecran (desktop sau telefon) și se micșorează cât să încapă. */
const LATIME_DESKTOP = 1040
const LATIME_MOBIL = 400

const Previzualizare = ({
  nou,
  semnal,
  children,
}: {
  nou: PluginKey | null
  /** Se schimbă la fiecare bifă: derulăm la ce s-a evidențiat. */
  semnal: unknown
  children: (mobil: boolean) => ReactNode
}) => {
  const reduce = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const interiorRef = useRef<HTMLDivElement>(null)
  const [latime, setLatime] = useState(0)
  const [inaltime, setInaltime] = useState(0)

  useLayoutEffect(() => {
    const s = scrollRef.current
    const i = interiorRef.current
    if (!s || !i) return
    const ro = new ResizeObserver(() => {
      setLatime(s.clientWidth)
      setInaltime(i.offsetHeight)
    })
    ro.observe(s)
    ro.observe(i)
    return () => ro.disconnect()
  }, [])

  const mobil = latime > 0 && latime < 640
  const design = mobil ? LATIME_MOBIL : LATIME_DESKTOP
  const scara = latime ? Math.min(1, latime / design) : 1

  // Derulează la ce a apărut, după ce s-a așezat în pagină.
  useEffect(() => {
    if (!nou) return
    const t = window.setTimeout(() => {
      const s = scrollRef.current
      const el = interiorRef.current?.querySelector('[data-hl="on"]')
      if (!s || !el) return
      const r = el.getBoundingClientRect()
      const rs = s.getBoundingClientRect()
      // Pe telefon explicația stă sus, deci elementul se așază pe la mijloc.
      const tinta = s.scrollTop + (r.top - rs.top) - s.clientHeight * (s.clientWidth < 640 ? 0.48 : 0.28)
      s.scrollTo({ top: Math.max(0, tinta), behavior: reduce ? 'auto' : 'smooth' })
    }, 140)
    return () => window.clearTimeout(t)
  }, [nou, semnal, reduce])

  return (
    <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain">
      <div style={{ height: inaltime * scara || undefined }}>
        <div
          ref={interiorRef}
          style={{ width: design, transform: `scale(${scara})`, transformOrigin: 'top left' }}
        >
          {children(mobil)}
        </div>
      </div>
    </div>
  )
}

interface SiteBuilderProps {
  open: boolean
  onClose: () => void
  pachetInitial?: PachetKey
  /** Plugin-ul de pe cardul apăsat: se bifează și se arată la deschidere. */
  pluginStart?: PluginKey | null
}

const SiteBuilder = ({ open, onClose, pachetInitial = 'magazin', pluginStart = null }: SiteBuilderProps) => {
  const reduce = useReducedMotion()
  const [pachet, setPachet] = useState<PachetKey>(pachetInitial)
  const [ales, setAles] = useState<Set<PluginKey>>(() => new Set<PluginKey>(['plata_bt']))
  const [nou, setNou] = useState<PluginKey | null>(null)
  const [semnal, setSemnal] = useState(0)
  const [vedere, setVedere] = useState<'site' | 'admin'>('site')
  const [mesaj, setMesaj] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // La fiecare deschidere: pachetul cerut de butonul apăsat și, de pe un card, plugin-ul lui.
  useEffect(() => {
    if (!open) return
    const p = pluginStart && !disponibil(pluginStart, pachetInitial) ? 'magazin' : pachetInitial
    setPachet(p)
    setVedere(pluginStart ? getPlugin(pluginStart).zona : 'site')
    setNou(pluginStart)
    if (pluginStart) {
      setAles((a) => new Set([...a, pluginStart]))
      setSemnal((s) => s + 1)
    }
  }, [open, pachetInitial, pluginStart])

  // Pagina de dedesubt nu se derulează; Escape închide. O singură dată pe deschidere.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!open) return
    const vechi = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const tasta = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', tasta)
    const t = window.setTimeout(() => dialogRef.current?.focus({ preventScroll: true }), 0)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = vechi
      window.removeEventListener('keydown', tasta)
    }
  }, [open])

  useEffect(() => {
    if (!mesaj) return
    const t = window.setTimeout(() => setMesaj(null), 2800)
    return () => window.clearTimeout(t)
  }, [mesaj])

  const sel = useMemo(() => cuDependente(ales, pachet), [ales, pachet])
  const calc = useMemo(() => calculeazaCms(sel, pachet), [sel, pachet])
  const on = useCallback((k: PluginKey) => sel.has(k), [sel])

  const arata = (k: PluginKey) => {
    setNou(k)
    setSemnal((s) => s + 1)
    setVedere(getPlugin(k).zona)
  }

  const schimbaPachet = (p: PachetKey) => {
    setPachet(p)
    setNou(null)
    if (p === 'magazin') {
      setAles((a) => (PLUGINS.some((x) => x.procesator && a.has(x.key)) ? a : new Set([...a, 'plata_bt'])))
    }
  }

  const comuta = (k: PluginKey) => {
    const P = getPlugin(k)
    if (!disponibil(k, pachet)) {
      // Un plugin de magazin pe un site fără coș: trecem pe Magazin online.
      setPachet('magazin')
      setAles((a) => {
        const n = new Set(a)
        n.add(k)
        if (!PLUGINS.some((x) => x.procesator && n.has(x.key))) n.add('plata_bt')
        return n
      })
      setMesaj(`${P.name} merge doar pe un magazin online: am trecut pe Magazin online.`)
      arata(k)
      return
    }
    if (sel.has(k)) {
      if (blocat(k, pachet, sel)) {
        setMesaj(
          getPachet(pachet).incluse.includes(k)
            ? `${P.name} e inclus în ${getPachet(pachet).name}.`
            : 'Magazinul are nevoie de cel puțin o plată cu cardul.',
        )
        return
      }
      setAles((a) => {
        const n = new Set(cuDependente(a, pachet))
        const scoase = [k]
        while (scoase.length) {
          const x = scoase.pop()!
          n.delete(x)
          depindDe(x).forEach((d) => n.has(d) && scoase.push(d))
        }
        return n
      })
      if (nou === k) setNou(null)
      return
    }
    setAles((a) => new Set([...a, k]))
    arata(k)
  }

  const deLaZero = () => {
    setAles(new Set<PluginKey>(['plata_bt']))
    setNou(null)
  }
  const pornesteTot = () => {
    setAles(new Set(PLUGINS.filter((p) => disponibil(p.key, pachet)).map((p) => p.key)))
    setNou(null)
    setMesaj('Am pornit toate plugin-urile: derulează site-ul să le vezi.')
  }

  const linkOferta = `/contact?interes=${pachet === 'magazin' ? 'magazin' : 'website'}&pachet=${pachet}&pluginuri=${calc.platite.join(',')}`
  const pluginNou = nou ? getPlugin(nou) : null

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="cms-builder"
          className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/70 backdrop-blur-sm sm:p-4 lg:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Calculatorul live ANDAXI CMS"
            className="relative flex h-full w-full max-w-[1500px] flex-col outline-none overflow-hidden bg-[color:var(--bg)] font-sans sm:rounded-3xl sm:border sm:border-[color:var(--border)] lg:grid lg:grid-cols-[400px_minmax(0,1fr)]"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
          >
            {/* ===== Stânga: pachetul, plugin-urile, socoteala ===== */}
            <div className="order-2 flex min-h-0 flex-1 flex-col border-[color:var(--border)] lg:order-1 lg:border-r">
              <div className="hidden items-start justify-between gap-3 px-6 pb-2 pt-6 lg:flex">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">Calculator live</p>
                  <h2 className="mt-1 text-xl font-medium tracking-tight text-[color:var(--text-1)]">
                    Construiește-ți site-ul
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Închide calculatorul"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--text-2)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-1)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
                {/* Pachetul */}
                <div role="radiogroup" aria-label="Pachetul" className="grid grid-cols-3 gap-2 pt-4 lg:pt-2">
                  {PACHETE.map((P) => {
                    const activ = P.key === pachet
                    return (
                      <button
                        key={P.key}
                        type="button"
                        role="radio"
                        aria-checked={activ}
                        onClick={() => schimbaPachet(P.key)}
                        className={`flex flex-col items-start gap-1 rounded-2xl border p-2.5 text-left transition-colors ${
                          activ
                            ? 'border-[color:var(--accent-strong)] bg-[color:var(--accent-tint)]'
                            : 'border-[color:var(--border)] hover:border-[color:var(--border-strong)]'
                        }`}
                      >
                        <P.icon className="h-4 w-4 text-[color:var(--accent)]" />
                        <span className="text-[13px] font-medium leading-tight text-[color:var(--text-1)]">{P.name}</span>
                        <span className="text-[11px] leading-tight text-[color:var(--text-4)]">
                          {euro(P.oData)} + {P.lunarDeLa ? 'de la ' : ''}
                          {euro(P.lunar)}/lună
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[color:var(--text-4)]">Bifează și privește site-ul</span>
                  <span className="flex gap-3">
                    <button type="button" onClick={pornesteTot} className="text-[color:var(--accent)] hover:underline">
                      Pornește tot
                    </button>
                    <button
                      type="button"
                      onClick={deLaZero}
                      className="inline-flex items-center gap-1 text-[color:var(--text-3)] hover:text-[color:var(--text-1)]"
                    >
                      <RotateCcw className="h-3 w-3" /> De la zero
                    </button>
                  </span>
                </div>

                {/* Plugin-urile, pe categorii */}
                {CATEGORII.map((C) => (
                  <div key={C.key} className="mt-5">
                    <p className="mb-2 text-[11px] uppercase tracking-wider text-[color:var(--text-4)]">{C.name}</p>
                    <div className="flex flex-col gap-1.5">
                      {PLUGINS.filter((p) => p.categorie === C.key).map((P) => {
                        const bifat = sel.has(P.key)
                        const merge = disponibil(P.key, pachet)
                        const eInclus = bifat && inclus(P.key, pachet, sel)
                        const cere = (P.necesita ?? []).map((n) => getPlugin(n).name)
                        return (
                          <button
                            key={P.key}
                            type="button"
                            role="checkbox"
                            aria-checked={bifat}
                            onClick={() => comuta(P.key)}
                            className={`group flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 ${
                              bifat
                                ? 'border-[color:var(--accent-border)] bg-[color:var(--accent-tint)]'
                                : 'border-[color:var(--border)] hover:border-[color:var(--border-strong)]'
                            } ${nou === P.key ? 'ring-2 ring-red-500/70' : ''}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                                bifat
                                  ? 'border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)] text-white'
                                  : 'border-[color:var(--border-strong)]'
                              } ${eInclus ? 'opacity-70' : ''}`}
                            >
                              {bifat && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <P.icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent)]" />
                                <span className="text-sm font-medium text-[color:var(--text-1)]">{P.name}</span>
                              </span>
                              <span className="mt-0.5 block text-xs text-[color:var(--text-4)]">
                                {P.scurt}
                                {cere.length > 0 && ` · cere ${cere.join(', ')}`}
                              </span>
                            </span>
                            <span className="shrink-0 text-right text-xs tabular-nums">
                              {eInclus ? (
                                <span className="rounded-full bg-[color:var(--accent-tint)] px-2 py-0.5 font-medium text-[color:var(--accent)]">
                                  inclus
                                </span>
                              ) : (
                                <span className="text-[color:var(--text-2)]">+{euro(P.pret)}</span>
                              )}
                              {!merge && (
                                <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[color:var(--text-4)]">
                                  <Lock className="h-3 w-3" /> magazin
                                </span>
                              )}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <p className="mt-5 text-xs leading-relaxed text-[color:var(--text-4)]">
                  Prețuri în euro, fără TVA. Plugin-urile se plătesc lunar, odată cu găzduirea, și le
                  pornești sau oprești oricând: apar pe site în câteva minute.
                </p>
              </div>

              {/* Socoteala */}
              <div aria-live="polite" className="border-t border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 sm:px-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="text-xs text-[color:var(--text-4)]">
                    <p>
                      Site-ul: <b className="font-medium text-[color:var(--text-1)]">{euro(calc.oData)}</b> o singură dată
                    </p>
                    <p className="mt-0.5">
                      Găzduire {calc.pachet.lunarDeLa ? 'de la ' : ''}
                      {euro(calc.pachet.lunar)} + {calc.platite.length} plugin-uri {euro(calc.pluginuri)}
                    </p>
                  </div>
                  <div className="text-right">
                    <motion.p
                      key={calc.lunar}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-medium tracking-tight text-[color:var(--text-1)] tabular-nums"
                    >
                      {euro(calc.lunar)}
                    </motion.p>
                    <p className="text-xs text-[color:var(--text-4)]">pe lună</p>
                  </div>
                </div>
                <Link
                  to={linkOferta}
                  onClick={onClose}
                  className="group mt-3 flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-strong-hover)]"
                >
                  Cere oferta pentru acest site
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ===== Dreapta: site-ul ===== */}
            <div className="relative order-1 flex h-[52vh] shrink-0 flex-col bg-[color:var(--surface)] p-2 sm:p-3 lg:order-2 lg:h-auto lg:p-5">
              {/* Bara browserului */}
              <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-black/10 bg-[#eef1f4] px-3 py-2">
                <span className="hidden gap-1.5 sm:flex" aria-hidden>
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-1 text-xs text-slate-500">
                  🔒 firma-ta.ro{vedere === 'admin' ? '/admin' : ''}
                </span>
                <div role="tablist" aria-label="Ce vezi" className="flex rounded-lg bg-white p-0.5 text-xs">
                  {(['site', 'admin'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="tab"
                      aria-selected={vedere === v}
                      onClick={() => setVedere(v)}
                      className={`rounded-md px-2.5 py-1 transition-colors ${
                        vedere === v ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {v === 'site' ? 'Site' : 'Admin'}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Închide calculatorul"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-slate-900 lg:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Ecranul */}
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-2xl border border-black/10 bg-white">
                <HlContext.Provider value={{ nou, on, pachet }}>
                  <Previzualizare nou={nou} semnal={`${semnal}-${vedere}`}>
                    {(mobil) => (vedere === 'site' ? <MockSite pachet={pachet} mobil={mobil} /> : <MockAdmin mobil={mobil} />)}
                  </Previzualizare>
                  {vedere === 'site' && (
                    <>
                      <BulaChat />
                      {pachet === 'magazin' && <PanouOferte />}
                    </>
                  )}
                </HlContext.Provider>

                {/* Mesajul scurt */}
                <AnimatePresence>
                  {mesaj && (
                    <motion.p
                      key={mesaj}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-x-0 top-3 z-40 mx-auto w-fit max-w-[90%] rounded-2xl bg-slate-900/90 px-4 py-2 text-center text-xs text-white shadow-lg"
                    >
                      {mesaj}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Explicația plugin-ului abia pornit */}
                <AnimatePresence>
                  {pluginNou && (
                    <motion.div
                      key={pluginNou.key}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, ease }}
                      className="absolute inset-x-2 top-2 z-30 rounded-2xl border-2 border-red-500 bg-white p-3 text-left shadow-2xl sm:inset-x-auto sm:bottom-4 sm:left-4 sm:top-auto sm:max-w-[420px] sm:p-4"
                    >
                      <button
                        type="button"
                        onClick={() => setNou(null)}
                        aria-label="Ascunde explicația"
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <p className="hidden items-center gap-2 pr-6 text-[11px] font-semibold uppercase tracking-wider text-red-600 sm:flex">
                        <Sparkles className="h-3.5 w-3.5" /> Ai adăugat
                      </p>
                      <p className="flex items-center gap-2 pr-6 text-sm font-semibold text-slate-900 sm:mt-1 sm:text-base">
                        <pluginNou.icon className="h-4 w-4 text-red-500" />
                        {pluginNou.name}
                        <span className="text-sm font-normal text-slate-500">
                          {inclus(pluginNou.key, pachet, sel) ? '· inclus' : `· +${euro(pluginNou.pret)}/lună`}
                        </span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:mt-1.5 sm:text-sm">{pluginNou.explicatie}</p>
                      {pluginNou.zona === 'admin' && (
                        <p className="mt-1 text-[11px] text-slate-400 sm:mt-2 sm:text-xs">Se vede doar în panoul tău de administrare.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-2 hidden items-center gap-1.5 text-xs text-[color:var(--text-4)] lg:flex">
                <MonitorSmartphone className="h-3.5 w-3.5" /> Un site de probă. Al tău primește designul lui, făcut de la zero.
              </p>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default SiteBuilder
