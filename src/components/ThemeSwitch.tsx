import { motion } from 'framer-motion'
import { useTheme } from '../theme'

/** Bottom-center theme toggle: dark track with a sliding colored knob —
 *  orange for the brand (light) theme, blue for the dark theme. */
const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const isBrand = theme === 'brand'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center">
      <motion.button
        type="button"
        role="switch"
        aria-checked={isBrand}
        aria-label="Schimbă culorile site-ului"
        title={isBrand ? 'Treci pe tema albastră' : 'Treci pe tema portocalie'}
        onClick={() => setTheme(isBrand ? 'blue' : 'brand')}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-auto flex h-8 w-14 items-center rounded-full border border-white/15 bg-neutral-900 px-1 shadow-lg shadow-black/30 ${
          isBrand ? 'justify-end' : 'justify-start'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="h-6 w-6 rounded-full"
          style={{ backgroundColor: isBrand ? '#F5891E' : '#64CEFB' }}
        />
      </motion.button>
    </div>
  )
}

export default ThemeSwitch
