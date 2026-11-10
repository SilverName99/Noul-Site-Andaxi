import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerProps {
  children: ReactNode
  className?: string
}

/** Parent container that reveals its StaggerItem children one after another. */
export const StaggerContainer = ({ children, className = '' }: StaggerProps) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.09 } },
    }}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className = '' }: StaggerProps) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
