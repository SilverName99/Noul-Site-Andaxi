import { motion } from 'framer-motion'

interface ShinyTextProps {
  text: string
  /** Base text color */
  color?: string
  /** Color of the shine sweeping across the text */
  shineColor?: string
  /** Duration of one full sweep, in seconds */
  speed?: number
  /** Angle of the gradient, in degrees */
  spread?: number
  className?: string
}

const ShinyText = ({
  text,
  color = 'var(--accent)',
  shineColor = '#ffffff',
  speed = 3,
  spread = 100,
  className = '',
}: ShinyTextProps) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 40%, ${shineColor} 50%, ${color} 60%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
      animate={{ backgroundPosition: ['100% 50%', '-100% 50%'] }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  )
}

export default ShinyText
