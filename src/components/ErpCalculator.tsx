import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Database, Users } from 'lucide-react'

const TIERS = [
  { min: 1, max: 5, label: '1-5 utilizatori', rate: 50, storage: '2 GB' },
  { min: 6, max: 10, label: '6-10 utilizatori', rate: 45, storage: '10 GB' },
  { min: 11, max: Infinity, label: '11+ utilizatori', rate: 40, storage: '15 GB' },
]

const PERIODS = [
  { key: 'monthly', label: 'Lunar', factor: 1, note: null },
  { key: '6m', label: '6 luni', factor: 0.95, note: '-5%' },
  { key: 'annual', label: 'Anual', factor: 0.9, note: '-10%' },
] as const

type PeriodKey = (typeof PERIODS)[number]['key']

const MAX_USERS = 20

/** Format în stil românesc: virgulă zecimală, punct la mii. */
const fmt = (n: number) =>
  n.toLocaleString('ro-RO', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })

const ErpCalculator = () => {
  const [users, setUsers] = useState(5)
  const [period, setPeriod] = useState<PeriodKey>('monthly')

  const tier = TIERS.find((t) => users >= t.min && users <= t.max)!
  const { factor } = PERIODS.find((p) => p.key === period)!
  const perUser = tier.rate * factor
  const total = perUser * users
  const fillPct = ((users - 1) / (MAX_USERS - 1)) * 100

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 md:p-12">
      {/* Praguri */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TIERS.map((t) => {
          const active = t === tier
          return (
            <motion.div
              key={t.label}
              animate={{ scale: active ? 1.03 : 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl border p-5 text-center transition-colors duration-300 ${
                active
                  ? 'border-[color:var(--accent-strong)] bg-[color:var(--accent-tint)]'
                  : 'border-[color:var(--border)]'
              }`}
            >
              <p className="text-sm font-medium text-[color:var(--text-1)]">{t.label}</p>
              <p className="mt-1.5 text-2xl font-medium tracking-tight text-[color:var(--accent)]">
                {t.rate}€
                <span className="text-sm text-[color:var(--text-4)]"> /utilizator/lună</span>
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-4)]">
                {t.storage} spațiu total inclus
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Slider */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor="erp-users"
            className="flex items-center gap-2 text-sm text-[color:var(--text-3)]"
          >
            <Users className="h-4 w-4 text-[color:var(--accent)]" />
            Câți utilizatori are firma ta?
          </label>
          <span className="text-2xl font-medium tracking-tight text-[color:var(--text-1)]">
            {users}
            {users === MAX_USERS && '+'}
          </span>
        </div>
        <input
          id="erp-users"
          type="range"
          min={1}
          max={MAX_USERS}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
          className="erp-range"
          style={{
            background: `linear-gradient(to right, var(--accent-strong) ${fillPct}%, var(--border) ${fillPct}%)`,
          }}
        />
      </div>

      {/* Perioada */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-[color:var(--border)] p-1.5">
          {PERIODS.map(({ key, label, note }) => {
            const active = key === period
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`relative rounded-full px-5 py-2 text-sm transition-colors duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-[color:var(--text-3)] hover:text-[color:var(--text-1)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="erp-period"
                    className="absolute inset-0 rounded-full bg-[color:var(--accent-strong)]"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">
                  {label}
                  {note && <span className="ml-1 text-xs opacity-80">{note}</span>}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Rezultat */}
      <div className="mt-10 flex flex-col items-center text-center">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={`${total}-${period}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl"
          >
            {fmt(total)}€
            <span className="text-xl text-[color:var(--text-4)] md:text-2xl">/lună</span>
          </motion.p>
        </AnimatePresence>

        <p className="mt-3 text-sm text-[color:var(--text-3)]">
          {fmt(perUser)}€ / utilizator / lună
          {period !== 'monthly' && (
            <span className="text-[color:var(--accent)]">
              {' '}
              · economisești {fmt(tier.rate * users - total)}€ pe lună
            </span>
          )}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[color:var(--text-4)]">
          <Database className="h-4 w-4 text-[color:var(--accent)]" />
          Include {tier.storage} spațiu total pe server
        </p>
        {period !== 'monthly' && (
          <p className="mt-1.5 text-xs text-[color:var(--text-4)]">
            Plătit o dată la {period === '6m' ? '6 luni' : '12 luni'}:{' '}
            {fmt(total * (period === '6m' ? 6 : 12))}€
          </p>
        )}

        <p className="mt-6 text-sm text-[color:var(--text-3)]">
          Peste 20 de utilizatori sau altă combinație de spațiu?{' '}
          <Link
            to="/contact"
            className="text-[color:var(--accent)] underline-offset-4 hover:underline"
          >
            Hai să discutăm — ofertă personalizată.
          </Link>
        </p>

        <Link
          to="/contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-8 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:text-base"
        >
          Cere o demonstrație gratuită
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default ErpCalculator
