import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

const LENS_SIZE = 180
const ZOOM = 2

interface MagnifyImageProps {
  src: string
  alt: string
  className?: string
}

/** Image with a magnifier lens on hover: a circle follows the cursor showing
 *  the image zoomed in, while everything outside the lens dims slightly. */
const MagnifyImage = ({ src, alt, className = '' }: MagnifyImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef({ w: 0, h: 0 })
  const [hovering, setHovering] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 350, damping: 35, mass: 0.4 })
  const y = useSpring(my, { stiffness: 350, damping: 35, mass: 0.4 })

  // Lens top-left corner follows the (sprung) cursor position.
  const lensX = useTransform(x, (v) => v - LENS_SIZE / 2)
  const lensY = useTransform(y, (v) => v - LENS_SIZE / 2)

  // Keep the magnified point under the lens center in sync with the cursor.
  const bgX = useTransform(x, (v) => -(v * ZOOM - LENS_SIZE / 2))
  const bgY = useTransform(y, (v) => -(v * ZOOM - LENS_SIZE / 2))
  const backgroundPosition = useMotionTemplate`${bgX}px ${bgY}px`

  const measure = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) sizeRef.current = { w: rect.width, h: rect.height }
  }

  const handleMove = (e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-none overflow-hidden"
      onMouseEnter={(e) => {
        measure()
        handleMove(e)
        mx.jump(e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0))
        my.jump(e.clientY - (containerRef.current?.getBoundingClientRect().top ?? 0))
        setHovering(true)
      }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHovering(false)}
    >
      <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />

      <AnimatePresence>
        {hovering && (
          <>
            {/* Dim everything outside the lens */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'rgba(0, 0, 0, 0.38)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Magnifier lens */}
            <motion.div
              className="pointer-events-none absolute left-0 top-0 rounded-full border-2 border-white/70 shadow-2xl shadow-black/50 ring-2 ring-[color:var(--accent)]/60"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                x: lensX,
                y: lensY,
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${sizeRef.current.w * ZOOM}px ${sizeRef.current.h * ZOOM}px`,
                backgroundPosition,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MagnifyImage
