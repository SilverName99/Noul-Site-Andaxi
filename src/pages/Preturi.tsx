import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import ShinyText from '../components/ShinyText'

const Preturi = () => {
  useEffect(() => {
    document.title = 'Prețuri — Andaxi'
  }, [])

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-glow-soft), transparent)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-40 text-center lg:px-8">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-tight text-[color:var(--accent)] md:text-sm">
              Prețuri
            </p>
          </Reveal>

          <h1
            className="text-5xl font-medium tracking-tighter sm:text-6xl md:text-7xl"
            style={{ lineHeight: 0.9 }}
          >
            <span className="block text-[color:var(--text-1)]">
              <AnimatedText text="Va urma" delay={0.15} />
            </span>
            <ShinyText
              text="…"
              color="var(--accent)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
            />
          </h1>

          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Lucrăm la pagina de prețuri — pachete corecte și transparente,
              fără costuri ascunse. Până atunci, spune-ne ce ai nevoie și îți
              facem o ofertă pe măsura proiectului tău.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-10">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--btn-bg)] px-8 py-4 text-sm font-medium text-[color:var(--btn-text)] transition-colors duration-300 hover:bg-[color:var(--btn-bg-hover)] md:text-base"
            >
              Cere o ofertă
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Preturi
