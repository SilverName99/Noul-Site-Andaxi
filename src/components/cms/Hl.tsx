import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPlugin } from '../../data/cmsPlugins'
import type { PachetKey, PluginKey } from '../../data/cmsPlugins'

/**
 * Evidențierea din calculatorul live: ce a adus plugin-ul abia pornit apare
 * încadrat cu roșu, cu o etichetă „NOU”. Restul site-ului rămâne neatins.
 */
export const HlContext = createContext<{
  nou: PluginKey | null
  on: (k: PluginKey) => boolean
  pachet: PachetKey
}>({
  nou: null,
  on: () => false,
  pachet: 'prezentare',
})

export const useCms = () => useContext(HlContext)

interface HlProps {
  k: PluginKey
  children: ReactNode
  className?: string
  /** Pentru elemente din rând (iconițe, insigne, linkuri din meniu). */
  inline?: boolean
  /** Eticheta „NOU” doar pe primul element al plugin-ului, ca să nu se repete. */
  fara_eticheta?: boolean
}

/** Elementul unui plugin: apare doar când plugin-ul e pornit. */
export const Hl = ({ k, children, className = '', inline, fara_eticheta }: HlProps) => {
  const { nou, on } = useCms()
  const reduce = useReducedMotion()
  if (!on(k)) return null
  const evidentiat = nou === k
  const Tag = inline ? motion.span : motion.div
  return (
    <Tag
      data-hl={evidentiat ? 'on' : undefined}
      data-hl-eticheta={evidentiat && !fara_eticheta ? '' : undefined}
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`${className.includes('absolute') ? '' : 'relative'} ${inline ? 'inline-flex w-fit' : ''} ${evidentiat ? 'cms-hl' : ''} ${className}`}
    >
      {evidentiat && !fara_eticheta && <span className="cms-hl-tag">NOU · {getPlugin(k).name}</span>}
      {children}
    </Tag>
  )
}
