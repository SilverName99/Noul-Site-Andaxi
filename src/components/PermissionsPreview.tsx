import { motion, useReducedMotion } from 'framer-motion'
import { Check, Warehouse } from 'lucide-react'

/**
 * Schița ecranului Setări → Utilizatori din ANDAXI ERP: rolul, bifele pe
 * secțiuni, gestiunile alocate și drepturile de preț. Textele sunt cele din
 * program (docs/manual/utilizatori.md); oamenii și gestiunile sunt exemple.
 */

const ROLES = ['Proprietar', 'Administrator', 'Contabil', 'Operator', 'Vizualizare']
const ACTIVE_ROLE = 'Operator'

const TREE: { section: string; items: [string, boolean][] }[] = [
  { section: 'Vânzări', items: [['Facturi', true], ['Bon fiscal', true]] },
  { section: 'Financiar', items: [['Casa', true], ['Banca', false]] },
  { section: 'Gestiune', items: [['Stoc', true], ['PV ieșire', false]] },
  { section: 'Contabilitate', items: [['Note contabile', false], ['Declarații', false]] },
]

const GESTIUNI: [string, boolean][] = [
  ['Magazin Centru', true],
  ['Depozit central', false],
  ['Mașina agentului', false],
]

const RIGHTS: [string, boolean][] = [
  ['Vede prețurile de achiziție', false],
  ['Poate modifica prețul pe factură', false],
  ['Poate opera în Casa și Bancă', true],
]

const Box = ({ on, i }: { on: boolean; i: number }) => {
  const reduceMotion = useReducedMotion()
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
        on
          ? 'border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)]'
          : 'border-[color:var(--border-strong)]'
      }`}
    >
      {on && (
        <motion.span
          initial={reduceMotion ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + i * 0.07, type: 'spring', stiffness: 420, damping: 20 }}
        >
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </motion.span>
      )}
    </span>
  )
}

const PermissionsPreview = () => {
  let n = 0
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--bg)] p-5 shadow-2xl shadow-black/20 md:p-7"
      role="img"
      aria-label="Exemplu de cont: rolul Operator, cu acces la facturi, bon fiscal, casă și stoc, doar în gestiunea Magazin Centru."
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Utilizator</p>
          <p className="mt-1 text-base font-medium text-[color:var(--text-1)]">Casier · Magazin Centru</p>
        </div>
        <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text-3)]">
          4 din 5 utilizatori activi
        </span>
      </div>

      <p className="mt-6 text-xs uppercase tracking-wider text-[color:var(--text-4)]">Rol</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <span
            key={r}
            className={`rounded-full px-3 py-1.5 text-xs ${
              r === ACTIVE_ROLE
                ? 'bg-[color:var(--accent-strong)] font-medium text-white'
                : 'border border-[color:var(--border)] text-[color:var(--text-3)]'
            }`}
          >
            {r}
          </span>
        ))}
      </div>

      <p className="mt-6 text-xs uppercase tracking-wider text-[color:var(--text-4)]">Permisiuni meniu</p>
      <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {TREE.map(({ section, items }) => (
          <div key={section}>
            <p className="flex items-center gap-2 text-sm font-medium text-[color:var(--text-1)]">
              <Box on={items.some(([, on]) => on)} i={n++} />
              {section}
            </p>
            <div className="mt-1.5 flex flex-col gap-1.5 pl-6">
              {items.map(([label, on]) => (
                <p key={label} className="flex items-center gap-2 text-sm text-[color:var(--text-3)]">
                  <Box on={on} i={n++} />
                  {label}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Alocare gestiuni</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {GESTIUNI.map(([g, on]) => (
              <p key={g} className="flex items-center gap-2 text-sm text-[color:var(--text-3)]">
                <Box on={on} i={n++} />
                <Warehouse className="h-3.5 w-3.5 text-[color:var(--text-4)]" />
                {g}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Drepturi</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {RIGHTS.map(([r, on]) => (
              <p key={r} className="flex items-center gap-2 text-sm text-[color:var(--text-3)]">
                <Box on={on} i={n++} />
                {r}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionsPreview
