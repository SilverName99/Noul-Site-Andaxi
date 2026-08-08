import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarHeart,
  Gem,
  HandCoins,
  LayoutTemplate,
  MessagesSquare,
  MousePointerClick,
  Rocket,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import ShinyText from '../components/ShinyText'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'

const VALUES = [
  {
    icon: HandCoins,
    title: 'Prețuri corecte',
    text: 'Creăm site-uri de calitate fără să coste o avere.',
  },
  {
    icon: Rocket,
    title: 'Viteză',
    text: 'Un website standard în 2-3 săptămâni, un site de eveniment în doar 5-7 zile.',
  },
  {
    icon: Gem,
    title: 'Personalizare 100%',
    text: 'Fiecare pixel e creat special pentru tine — nu lucrăm cu template-uri generice.',
  },
  {
    icon: MessagesSquare,
    title: 'Suport real',
    text: 'Comunicăm clar, răspundem repede și suntem aici și după ce site-ul este online.',
  },
]

const SERVICES = [
  {
    icon: CalendarHeart,
    title: 'Website-uri pentru evenimente',
    text: 'Nunți, botezuri, petreceri private — cu intrări animate, formulare RSVP personalizate, timeline-uri interactive și cărți de oaspeți digitale.',
  },
  {
    icon: ShoppingBag,
    title: 'Magazine online',
    text: 'Ușor de administrat, optimizate pentru vânzări și pentru dispozitive mobile.',
  },
  {
    icon: MousePointerClick,
    title: 'Website-uri cu rezervări online',
    text: 'Pentru restaurante, clinici, săli de sport, pensiuni sau orice serviciu care are nevoie de programări automate.',
  },
  {
    icon: Sparkles,
    title: 'Website-uri interactive',
    text: 'Platforme care îmbină informația cu elemente ludice — quiz-uri, recompense virtuale, interacțiuni vizuale atractive.',
  },
  {
    icon: LayoutTemplate,
    title: 'Website-uri de prezentare',
    text: 'Simple, elegante, focusate pe imaginea brandului și pe transmiterea mesajului corect.',
  },
]

const Home = () => {
  useEffect(() => {
    document.title = 'Andaxi — Web design de la oameni, către oameni'
  }, [])

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      {/* ===== Hero ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mx-auto mt-28 grid w-full max-w-7xl grid-cols-1 gap-4 px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <p className="max-w-md text-sm text-white/80 md:text-base">
                Website-uri personalizate, rapide și ușor de folosit, la un
                preț corect — pentru afaceri din România și Grecia.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-sm text-white/80 md:text-base lg:text-right">
                Agenție de web design · România & Grecia
              </p>
            </Reveal>
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
            <Reveal>
              <p className="mb-4 text-xs uppercase tracking-tight text-white/80 md:text-sm">
                Web design accesibil și frumos
              </p>
            </Reveal>

            <h1
              className="text-5xl tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ lineHeight: 0.9 }}
            >
              <span className="block font-medium text-white">
                <AnimatedText text="De la oameni," delay={0.2} />
              </span>
              <ShinyText
                text="către oameni."
                color="var(--accent)"
                shineColor="#ffffff"
                speed={3}
                spread={100}
                className="font-medium"
              />
            </h1>

            <Reveal delay={0.4} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-200 md:px-8 md:py-4 md:text-base"
              >
                Hai să vorbim
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
              </Link>
              <Link
                to="/erp"
                className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm text-white/90 transition-colors duration-300 hover:border-white hover:text-white md:px-8 md:py-4 md:text-base"
              >
                Descoperă ANDAXI ERP
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== De ce Andaxi ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <Reveal>
          <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">De ce Andaxi</p>
        </Reveal>
        <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
          <AnimatedText text="Prețuim interacțiunea umană și atenția la detalii." />
        </h2>

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 transition-colors duration-300 hover:border-[color:var(--border-strong)]"
              >
                <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                <h3 className="mt-4 text-lg font-medium text-[color:var(--text-1)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-3)]">{text}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ===== Servicii ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Ce facem</p>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Proiecte digitale pentru orice misiune." />
          </h2>

          <div className="mt-14 flex flex-col">
            {SERVICES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="group flex flex-col gap-4 border-t border-[color:var(--border)] py-8 transition-colors duration-300 last:border-b hover:bg-[color:var(--surface)] md:flex-row md:items-center md:gap-10 md:py-10">
                  <span className="text-sm text-[color:var(--text-5)] md:w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon className="h-6 w-6 shrink-0 text-[color:var(--accent)]" />
                  <h3 className="text-xl font-medium text-[color:var(--text-1)] md:w-80 md:text-2xl">
                    {title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                    {text}
                  </p>
                  <ArrowUpRight className="hidden h-5 w-5 text-[color:var(--text-5)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[color:var(--text-1)] md:block" />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10">
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Ne ocupăm de toate detaliile tehnice — de la înregistrarea
              domeniului și configurarea emailului, până la integrarea cu
              Google Analytics și optimizarea SEO. Tu te concentrezi pe
              afacerea ta; noi ne asigurăm că site-ul e gata de lansare.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Despre ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Despre noi</p>
            </Reveal>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
              <AnimatedText text="O echipă, multe cafele și o misiune simplă." />
            </h2>
          </div>
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
            <Reveal>
              <p>
                În spatele numelui Andaxi nu se ascunde un birou rece plin de
                jargon tehnic. Totul a pornit dintr-o frustrare simplă: prea
                multe afaceri bune se pierd în anonimat online doar pentru că
                nu își permit un site decent.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Așa s-a născut Andaxi — cu scopul de a oferi website-uri
                personalizate, rapide și ușor de folosit, la un preț corect.
                Majoritatea proiectelor noastre sunt din România, dar drumul
                ne-a purtat și prin Grecia, unde am ajutat clienți să își
                spună povestea în spațiul digital.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                La Andaxi, rapiditatea nu vine niciodată cu sacrificarea
                calității. Fiecare proiect, indiferent de dimensiune, primește
                aceeași atenție la detalii și aceeași grijă pentru design și
                funcționalitate.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== ERP teaser ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        <Reveal>
          <Link
            to="/erp"
            className="group block overflow-hidden rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-10 transition-colors duration-300 hover:border-[color:var(--accent-strong)] md:p-16"
          >
            <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">ANDAXI ERP</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight text-white md:text-5xl">
              Facturare, gestiune și contabilitate — într-un singur program.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60 md:text-base">
              ERP online, complet și conform cu legislația din România. De la
              factură la bilanț și declarații ANAF — automat.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white md:text-base">
              Descoperă ANDAXI ERP
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
          <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl">
            <AnimatedText text="Hai să transformăm viziunea ta într-o experiență digitală frumoasă." />
          </h2>
          <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--btn-bg)] px-8 py-4 text-sm font-medium text-[color:var(--btn-text)] transition-colors duration-300 hover:bg-[color:var(--btn-bg-hover)] md:text-base"
            >
              Hai să vorbim
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+40755885973"
              className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)] md:text-base"
            >
              sau sună-ne: 0755 885 973
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Home
