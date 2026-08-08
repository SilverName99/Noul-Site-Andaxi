import { motion } from 'framer-motion'
import { useTheme } from '../theme'
import type { Theme } from '../theme'

const OPTIONS: { value: Theme; color: string; label: string }[] = [
  { value: 'brand', color: '#F5891E', label: 'Culorile Andaxi (portocaliu)' },
  { value: 'blue', color: '#64CEFB', label: 'Tema albastră' },
]

/** Discreet floating color-theme switch, bottom-right of the viewport. */
const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 p-1.5 backdrop-blur-md"
    >
      {OPTIONS.map(({ value, color, label }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className="relative flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
        >
          {theme === value && (
            <motion.span
              layoutId="theme-ring"
              className="absolute inset-0 rounded-full ring-2 ring-white/90"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: color }}
          />
        </button>
      ))}
    </motion.div>
  )
}

export default ThemeSwitch
