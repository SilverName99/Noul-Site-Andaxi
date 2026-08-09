import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Gem,
  HandCoins,
  LayoutTemplate,
  Map,
  MessagesSquare,
  Rocket,
  ShoppingBag,
  Tag,
} from 'lucide-react'
import ShinyText from '../components/ShinyText'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'

const VALUES = [
  {
    icon: HandCoins,
    title: 'Prețuri corecte',
    text: 'Site-uri de calitate care nu îți golesc portofelul — știi de la început cât plătești.',
  },
  {
    icon: Rocket,
    title: 'Viteză',
    text: 'Website-ul tău e gata în 2-3 săptămâni.',
  },
  {
    icon: Gem,
    title: 'Personalizare 100%',
    text: 'Zero template-uri generice. Fiecare pixel e desenat pentru brandul tău.',
  },
  {
    icon: MessagesSquare,
    title: 'Suport real',
    text: 'Vorbești cu oameni, nu cu tichete. Răspundem repede — și după lansare.',
  },
]

const SERVICES = [
  {
    icon: LayoutTemplate,
    title: 'Website-uri',
    text: 'De prezentare, pentru evenimente, cu rezervări sau interactive — personalizate 100%, gata în câteva săptămâni.',
    to: '/contact',
  },
  {
    icon: ShoppingBag,
    title: 'Magazine online',
    text: 'Vinzi simplu: magazin ușor de administrat, optimizat pentru mobil și gândit să transforme vizitele în comenzi.',
    to: '/contact',
  },
  {
    icon: Calculator,
    title: 'ANDAXI ERP',
    text: 'Facturare, gestiune și contabilitate — într-un singur program, conform cu legislația din România.',
    to: '/erp',
  },
  {
    icon: Map,
    title: 'ANDAXI CRM',
    text: 'Vânzările echipei tale pe teren: hartă cu rute, stocuri per agent, chat — conectat la ERP.',
    to: '/crm',
  },
  {
    icon: Tag,
    title: 'Prețuri',
    text: 'Corecte și transparente, fără costuri ascunse — vezi cât ar costa proiectul tău.',
    to: '/preturi',
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
          style={{ filter: 'var(--video-filter)', transition: 'filter 0.55s ease' }}
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div
          className="absolute inset-0"
          style={{ background: 'var(--hero-overlay)' }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mx-auto mt-28 grid w-full max-w-7xl grid-cols-1 gap-4 px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <p className="max-w-md text-sm text-[color:var(--text-2)] md:text-base">
                De la website-uri și magazine online, la ERP și CRM —
                construim soluții web complete, cu prețuri corecte și suport
                real după lansare.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-sm text-[color:var(--text-2)] md:text-base lg:text-right">
                WEBSITE · ERP · CRM
              </p>
            </Reveal>
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
            <Reveal>
              <p className="mb-4 text-xs uppercase tracking-tight text-[color:var(--text-2)] md:text-sm">
                SOLUȚII WEB
              </p>
            </Reveal>

            <h1
              className="text-5xl tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ lineHeight: 0.9 }}
            >
              <span className="block font-medium text-[color:var(--text-1)]">
                <AnimatedText text="De la oameni," delay={0.2} />
              </span>
              <ShinyText
                text="către oameni."
                color="var(--accent)"
                shineColor="var(--shine)"
                speed={3}
                spread={100}
                className="font-medium"
              />
            </h1>

            <Reveal delay={0.4} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--btn-bg)] px-6 py-3 text-sm font-medium text-[color:var(--btn-text)] transition-colors duration-300 hover:bg-[color:var(--btn-bg-hover)] md:px-8 md:py-4 md:text-base"
              >
                Hai să vorbim
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
              </Link>
              <Link
                to="/erp"
                className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] px-6 py-3 text-sm text-[color:var(--text-2)] transition-colors duration-300 hover:border-[color:var(--text-1)] hover:text-[color:var(--text-1)] md:px-8 md:py-4 md:text-base"
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
          <AnimatedText text="Fără birouri reci și jargon tehnic. Doar treabă făcută bine." />
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
            <AnimatedText text="Orice misiune, aceeași țintă: o experiență online memorabilă." />
          </h2>

          <div className="mt-14 flex flex-col">
            {SERVICES.map(({ icon: Icon, title, text, to }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <Link
                  to={to}
                  className="group flex flex-col gap-4 border-t border-[color:var(--border)] py-8 transition-colors duration-300 last:border-b hover:bg-[color:var(--surface)] md:flex-row md:items-center md:gap-10 md:py-10"
                >
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
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10">
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Ne ocupăm de toate detaliile tehnice — domeniu, email, Google
              Analytics, SEO. Tu te concentrezi pe afacerea ta; noi îți
              predăm site-ul gata de lansare.
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
                Ajutăm afaceri din toată România să își spună povestea în
                spațiul digital.
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

      {/* ===== Produse: ERP & CRM ===== */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-2 lg:px-8 lg:pb-32">
        <Reveal>
          <Link
            to="/erp"
            className="group block h-full overflow-hidden rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-10 transition-colors duration-300 hover:border-[color:var(--accent-strong)] md:p-14"
          >
            <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">ANDAXI ERP</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-white md:text-4xl">
              Facturare, gestiune și contabilitate — într-un singur program.
            </h2>
            <p className="mt-4 text-sm text-white/60 md:text-base">
              ERP online, complet și conform cu legislația din România. De la
              factură la bilanț și declarații ANAF — automat.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white md:text-base">
              Descoperă ANDAXI ERP
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <Link
            to="/crm"
            className="group block h-full overflow-hidden rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-10 transition-colors duration-300 hover:border-[color:var(--accent-strong)] md:p-14"
          >
            <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">ANDAXI CRM</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-white md:text-4xl">
              Vezi exact ce vinde fiecare agent.
            </h2>
            <p className="mt-4 text-sm text-white/60 md:text-base">
              CRM de vânzări pentru echipe de agenți, conectat la ERP.
              Comenzi, vânzări pe zone și clienți, analize pe agent — la zi.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white md:text-base">
              Descoperă ANDAXI CRM
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
