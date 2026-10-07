import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Link2 } from 'lucide-react'
import { getModule } from '../data/erpModules'
import { PRET_BAZA, etichetaPret } from '../data/erpPricing'
import type { ErpModule } from '../data/erpModules'

interface ModuleCardProps {
  module: ErpModule
  /**
   * Pentru demo-ul interactiv (/erp/demo): cardul devine comutator. Pe /erp
   * lipsește, iar cardul duce la formularul de contact cu modulul ales.
   */
  toggle?: {
    on: boolean
    onChange: (on: boolean) => void
    /** De ce nu se poate comuta acum (ex. „Pornește întâi Gestiune”). */
    blockedReason?: string
  }
}

/** Cardul unui modul ANDAXI ERP: ce face, pentru cine, de ce are nevoie și ce
 *  aduce în meniu. Lumina urmărește cursorul. */
const ModuleCard = ({ module, toggle }: ModuleCardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const Icon = module.icon

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const menuItems = module.menu.flatMap((g) => g.items)

  return (
    <motion.div
      ref={ref}
      id={module.key}
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 transition-colors duration-300 hover:border-[color:var(--accent-border)] target:border-[color:var(--accent-strong)] md:p-7"
    >
      {/* Lumina de sub cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), var(--accent-tint), transparent 70%)',
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-tint)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <Icon className="h-5 w-5 text-[color:var(--accent)]" />
        </span>
        {toggle ? (
          <button
            type="button"
            role="switch"
            aria-checked={toggle.on}
            aria-label={`${toggle.on ? 'Oprește' : 'Pornește'} modulul ${module.name}`}
            title={toggle.blockedReason}
            disabled={Boolean(toggle.blockedReason)}
            onClick={() => toggle.onChange(!toggle.on)}
            className={`flex h-7 w-12 items-center rounded-full border px-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              toggle.on
                ? 'justify-end border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)]'
                : 'justify-start border-[color:var(--border-strong)]'
            }`}
          >
            <motion.span layout className="h-5 w-5 rounded-full bg-white shadow" />
          </button>
        ) : (
          <span className="rounded-full bg-[color:var(--accent-tint)] px-2.5 py-1 text-xs font-medium tabular-nums text-[color:var(--accent)]">
            {module.key === 'core'
              ? `baza · ${PRET_BAZA} €/lună`
              : etichetaPret(module.key, true)}
          </span>
        )}
      </div>

      <h3 className="relative mt-5 text-lg font-medium text-[color:var(--text-1)]">{module.name}</h3>
      <p className="relative mt-2 text-base leading-snug text-[color:var(--text-2)]">{module.tagline}</p>

      <p className="relative mt-4 text-sm leading-relaxed text-[color:var(--text-3)]">
        <span className="text-[color:var(--text-4)]">Potrivit pentru: </span>
        {module.potrivitPentru}
      </p>

      {module.necesita.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {module.necesita.map((k) => (
            <a
              key={k}
              href={`#${k}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent-border)] px-2.5 py-1 text-xs text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent-tint)]"
            >
              <Link2 className="h-3 w-3" />
              Necesită {getModule(k).name}
            </a>
          ))}
        </div>
      )}

      <div className="relative mt-auto pt-5">
        <p className="border-t border-[color:var(--border)] pt-4 text-xs leading-relaxed text-[color:var(--text-4)]">
          <span className="uppercase tracking-wider">În meniu: </span>
          {menuItems.join(' · ')}
        </p>
        {!toggle && (
          <Link
            to={module.link ?? `/contact?interes=erp&module=${module.key}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]"
          >
            {module.link ? 'Descoperă ANDAXI CRM' : 'Vreau modulul ăsta'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default ModuleCard
