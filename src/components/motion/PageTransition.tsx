import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Wraps a page so route changes fade/slide smoothly via AnimatePresence. */
const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export default PageTransition
