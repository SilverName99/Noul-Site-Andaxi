import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import type { FaqItem } from '../data/erpFaq'
import NoWrapDomain from './NoWrapDomain'

/** Întrebări frecvente, pe rânduri numerotate. Răspunsurile rămân în pagină
 *  și când sunt închise (le citesc și motoarele de căutare). */
const FaqList = ({ items }: { items: FaqItem[] }) => {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <div className="flex flex-col">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-faq-${i}`
        return (
          <div key={q} className="border-t border-[color:var(--border)] last:border-b">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-baseline gap-4 py-6 text-left md:gap-10 md:py-7"
              >
                <span className="w-8 shrink-0 text-sm text-[color:var(--text-5)] md:w-10">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-lg font-medium text-[color:var(--text-1)] transition-colors group-hover:text-[color:var(--accent)] md:text-xl">
                  {q}
                </span>
                <Plus
                  className={`h-5 w-5 shrink-0 self-center text-[color:var(--text-4)] transition-transform duration-300 ${
                    isOpen ? 'rotate-45 text-[color:var(--accent)]' : ''
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-hidden={!isOpen}
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-7 pl-12 pr-9 text-sm leading-relaxed text-[color:var(--text-3)] md:pl-20 md:text-base">
                  <NoWrapDomain text={a} />
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FaqList
