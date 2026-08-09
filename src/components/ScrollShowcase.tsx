import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Reveal from './motion/Reveal'
import MagnifyImage from './MagnifyImage'

export interface ShowcaseStep {
  icon: LucideIcon
  title: string
  tagline: string
  items: string[]
  image: string
}

interface ScrollShowcaseProps {
  steps: ShowcaseStep[]
}

/** Text block shown on the left for the active step (desktop) or under the
 *  image (mobile). */
const StepText = ({ step }: { step: ShowcaseStep }) => {
  const Icon = step.icon
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
          <Icon className="h-5 w-5 text-[color:var(--accent)]" />
        </span>
        <div>
          <h3 className="text-xl font-medium text-[color:var(--text-1)] md:text-2xl">
            {step.title}
          </h3>
          <p className="text-sm text-[color:var(--text-4)]">{step.tagline}</p>
        </div>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {step.items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base"
          >
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Scroll-driven showcase: sticky two-column layout where the image card
 *  flips 180° on each step, revealing the next image on its back while the
 *  left text swaps in sync. Anchors smooth-scroll through the animation. */
const ScrollShowcase = ({ steps }: ScrollShowcaseProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  // Indices of the images currently on the front / back face of the card.
  const [faces, setFaces] = useState({ front: 0, back: 1 })

  const last = steps.length - 1

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })
  const progress = useTransform(scrollYProgress, [0, 1], [0, last])
  const rotateY = useTransform(progress, (v) => v * 180)

  useMotionValueEvent(progress, 'change', (v) => {
    const clamped = Math.min(Math.max(v, 0), last)
    const idx = Math.round(clamped)
    if (idx !== active) setActive(idx)

    // While rotation is between k*180 and (k+1)*180, the visible face shows
    // step k and the hidden face must hold step k+1.
    const k = Math.min(Math.floor(clamped), last - 1)
    const front = k % 2 === 0 ? k : k + 1
    const back = k % 2 === 0 ? k + 1 : k
    if (front !== faces.front || back !== faces.back) setFaces({ front, back })
  })

  const scrollToStep = (idx: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const scrollable = wrapper.offsetHeight - window.innerHeight
    const top = wrapper.offsetTop + (scrollable * idx) / last
    window.scrollTo({ top, behavior: 'smooth' })
  }

  /* Stacked fallback: mobile, tablets and reduced motion. */
  const stacked = (
    <div className="flex flex-col gap-16">
      {steps.map((step) => (
        <Reveal key={step.title}>
          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]">
            <img
              src={step.image}
              alt={step.title}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <div className="mt-6">
            <StepText step={step} />
          </div>
        </Reveal>
      ))}
    </div>
  )

  if (reduceMotion) return <div className="mt-14">{stacked}</div>

  return (
    <>
      {/* Mobile & tablet */}
      <div className="mt-14 lg:hidden">{stacked}</div>

      {/* Desktop: sticky flip showcase */}
      <div
        ref={wrapperRef}
        className="relative hidden lg:block"
        style={{ height: `${steps.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="grid w-full grid-cols-[1fr_auto_1.15fr] items-center gap-12">
            {/* Left: active step text */}
            <div className="relative min-h-[22rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepText step={steps[active]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Middle: anchors */}
            <div className="flex flex-col items-center gap-3">
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  type="button"
                  title={step.title}
                  aria-label={`Mergi la: ${step.title}`}
                  onClick={() => scrollToStep(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                    active === i
                      ? 'scale-110 border-[color:var(--accent)] bg-[color:var(--accent-tint)] text-[color:var(--accent)]'
                      : 'border-[color:var(--border)] text-[color:var(--text-4)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-2)]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            {/* Right: 3D flipping image card */}
            <div style={{ perspective: '1400px' }}>
              <motion.div
                className="relative aspect-[16/10] w-full"
                style={{ rotateY, transformStyle: 'preserve-3d' }}
              >
                {/* translateZ separates the two faces so they never z-fight
                    (coplanar faces shimmer when hover layers appear). */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl shadow-black/20"
                  style={{ backfaceVisibility: 'hidden', transform: 'translateZ(2px)' }}
                >
                  <MagnifyImage
                    src={steps[faces.front].image}
                    alt={steps[faces.front].title}
                  />
                </div>
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl shadow-black/20"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(2px)',
                  }}
                >
                  <MagnifyImage
                    src={steps[faces.back].image}
                    alt={steps[faces.back].title}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ScrollShowcase
