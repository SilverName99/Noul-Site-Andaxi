import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { buildMenu } from '../data/erpModules'
import type { ModuleKey } from '../data/erpModules'

interface MenuPreviewProps {
  active: ModuleKey[]
  /** Modulul pornit ultimul: rândurile lui se evidențiază. */
  highlight?: ModuleKey | null
}

/** Meniul lateral al programului, compus din fundație și modulele pornite.
 *  Rândurile noi intră animat. Folosit pe /erp/demo. */
const MenuPreview = ({ active, highlight }: MenuPreviewProps) => {
  const reduceMotion = useReducedMotion()
  const menu = buildMenu(active)
  const enter = reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {menu.map(({ group, items }) => (
            <motion.div
              key={group}
              layout={!reduceMotion}
              initial={enter}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--text-4)]">
                {group}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <AnimatePresence initial={false}>
                  {items.map(({ label, module }) => {
                    const isNew = highlight != null && module === highlight
                    return (
                      <motion.span
                        key={`${module}-${label}`}
                        layout={!reduceMotion}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-md px-2 py-1 text-xs transition-colors duration-500 ${
                          isNew
                            ? 'bg-[color:var(--accent-strong)] text-white'
                            : 'bg-[color:var(--surface-hover)] text-[color:var(--text-2)]'
                        }`}
                      >
                        {label}
                      </motion.span>
                    )
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}

export default MenuPreview
