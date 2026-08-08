import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ClipboardList,
  FileSpreadsheet,
  Globe,
  Link2,
  LockKeyhole,
  PieChart,
  ShieldCheck,
  UserCheck,
  Layers,
} from 'lucide-react'
import ShinyText from '../components/ShinyText'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import Marquee from '../components/Marquee'

const MODULES = [
  {
    icon: ClipboardList,
    title: 'Comenzi & vânzări pe agent',
    tagline: 'Vezi ce s-a comandat azi și cine a vândut.',
    items: [
      'Comenzile primite, pe zi, detaliate până la nivel de produs.',
      'Vânzări pe agent, pe zonă și pe client, defalcate pe luni.',
      'Valori fără TVA, gata de comparat între agenți și perioade.',
    ],
  },
  {
    icon: FileSpreadsheet,
    title: 'Import & consolidare date',
    tagline: 'Aduci datele de vânzări o singură dată.',
    items: [
      'Import din fișiere Excel, cu recunoașterea automată a coloanelor.',
      'Istoric al importurilor — activezi importul curent, descarci sau ștergi oricare.',
      'Consolidezi date din surse diferite într-o singură imagine a vânzărilor.',
    ],
  },
  {
    icon: PieChart,
    title: 'Analize & pivot',
    tagline: 'Vânzările tale, pe orice tăietură.',
    items: [
      'Pivot pe agent, zonă, client și produs, pe luni.',
      'Grupări pentru vânzările fără agent (Online, Auto, sediu ș.a.).',
      'Totaluri și evoluție în timp, dintr-o privire.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Agenți & atribuire corectă',
    tagline: 'Fiecare vânzare, atribuită agentului potrivit.',
    items: [
      'Nomenclator de agenți activi.',
      'Mapare automată a numelor (aliasuri) — potrivești denumiri diferite din surse externe la același agent.',
      'Atribuire partajată — împarți o vânzare între doi agenți când e cazul.',
    ],
  },
  {
    icon: LockKeyhole,
    title: 'Acces individual pentru fiecare agent',
    tagline: 'Fiecare agent își vede rezultatele.',
    items: [
      'Fiecare agent își vede propriile comenzi și vânzări, securizat.',
      'Controlezi câte luni în urmă poate vedea fiecare agent.',
    ],
  },
  {
    icon: Link2,
    title: 'Integrare cu ERP',
    tagline: 'Conectat la stoc, clienți și facturi.',
    items: [
      'Stocul din ERP, vizibil în CRM.',
      'Legătură cu nomenclatorul de parteneri și cu facturarea — fără dublă introducere.',
    ],
  },
]

const HIGHLIGHTS = [
  'Comenzi zilnice',
  'Vânzări pe agent / zonă / client / produs',
  'Pivot pe luni',
  'Aliasuri și atribuire partajată',
  'Acces individual pentru agenți',
  'Integrare cu stocul și facturarea din ERP',
]

const WHY = [
  {
    title: 'Conectat la ERP',
    text: 'Date reale din facturare și stoc, fără dublă introducere.',
  },
  {
    title: 'Atribuire corectă',
    text: 'Aliasuri și partajare între agenți — fiecare vânzare ajunge la agentul potrivit.',
  },
  {
    title: 'Analiză pe orice dimensiune',
    text: 'Agent, zonă, client, produs, lună — dintr-o privire.',
  },
  {
    title: 'Transparență pentru echipă',
    text: 'Fiecare agent își vede rezultatele, cu acces controlat.',
  },
]

const AUDIENCES = [
  'Firme cu echipe de agenți de vânzări / distribuție care vor să urmărească vânzările pe teren.',
  'Manageri de vânzări care vor performanța pe agent, zonă și client, la zi.',
  'Firme care primesc date de vânzări din surse externe (Excel) și vor să le consolideze corect.',
]

const TECH = [
  {
    icon: Globe,
    title: 'Aplicație web modernă',
    text: 'O deschizi din browser, de oriunde.',
  },
  {
    icon: Layers,
    title: 'Același ecosistem cu ERP-ul',
    text: 'Aceleași date, aceeași instalare — o singură sursă de adevăr.',
  },
  {
    icon: ShieldCheck,
    title: 'Acces securizat per agent',
    text: 'Fiecare vede doar ce îi este permis.',
  },
]

const Crm = () => {
  useEffect(() => {
    document.title = 'ANDAXI CRM — Vânzările tale, pe agent, la zi'
  }, [])

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      {/* ===== Hero ===== */}
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-glow), transparent)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-40 text-center lg:px-8">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-tight text-[color:var(--accent)] md:text-sm">
              ANDAXI CRM · Vânzări conectate la ERP
            </p>
          </Reveal>

          <h1
            className="max-w-5xl text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ lineHeight: 0.95 }}
          >
            <span className="block font-medium text-[color:var(--text-1)]">
              <AnimatedText text="Vezi exact ce vinde" delay={0.15} />
            </span>
            <ShinyText
              text="fiecare agent."
              color="var(--accent-strong)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>

          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Urmărește comenzile și vânzările pe agent, zonă și client, cu
              date reale din ERP. Import din Excel, analize pe luni și acces
              individual pentru fiecare agent.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:px-8 md:py-4 md:text-base"
            >
              Cere o demonstrație
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#functionalitati"
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] px-6 py-3 text-sm text-[color:var(--text-2)] transition-colors duration-300 hover:border-[color:var(--text-1)] hover:text-[color:var(--text-1)] md:px-8 md:py-4 md:text-base"
            >
              Vezi funcționalitățile
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.55}>
            <p className="mt-8 flex items-center justify-center gap-2 text-xs text-[color:var(--text-4)] md:text-sm">
              <ShieldCheck className="h-4 w-4 text-[color:var(--accent)]" />
              Parte din ecosistemul ANDAXI. Date reale din ERP, atribuite corect.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Intro ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Nu doar un raport de vânzări." />
          </h2>
          <Reveal delay={0.15}>
            <p className="text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              ANDAXI CRM leagă fiecare comandă și fiecare vânzare de agentul,
              zona și clientul potrivit — direct din datele ERP-ului. Vezi la
              zi cine, cât și cui a vândut, fără să aduni manual din mai multe
              fișiere.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Module ===== */}
      <section id="functionalitati" className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">
              Funcționalități
            </p>
          </Reveal>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Ce poți face cu ANDAXI CRM" />
          </h2>

          <StaggerContainer className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {MODULES.map(({ icon: Icon, title, tagline, items }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 transition-colors duration-300 hover:border-[color:var(--accent-border)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
                      <Icon className="h-5 w-5 text-[color:var(--accent)]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-[color:var(--text-1)]">{title}</h3>
                      <p className="text-sm text-[color:var(--text-4)]">{tagline}</p>
                    </div>
                  </div>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--text-3)]"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== O singură sursă de adevăr ===== */}
      <section className="border-t border-[color:var(--border)] py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-medium tracking-tight text-[color:var(--text-1)] md:text-4xl">
              O singură sursă de adevăr pentru vânzări
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[color:var(--text-3)] md:text-base">
              Toate vânzările, atribuite corect, într-un singur loc.
            </p>
          </Reveal>
        </div>
        <div className="mt-10">
          <Marquee items={HIGHLIGHTS} />
        </div>
      </section>

      {/* ===== De ce ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="De ce ANDAXI CRM" />
          </h2>
          <StaggerContainer className="mt-12 flex flex-col">
            {WHY.map(({ title, text }, i) => (
              <StaggerItem key={title}>
                <div className="group flex flex-col gap-2 border-t border-[color:var(--border)] py-7 last:border-b md:flex-row md:items-baseline md:gap-10">
                  <span className="text-sm text-[color:var(--text-5)] md:w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-medium text-[color:var(--text-1)] md:w-72">
                    {title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Pentru cine ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Pentru cine este" />
          </h2>
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {AUDIENCES.map((text) => (
              <StaggerItem key={text}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm leading-relaxed text-[color:var(--text-2)] transition-colors duration-300 hover:border-[color:var(--border-strong)] md:text-base"
                >
                  {text}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Tehnologie ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Tehnologie & siguranță" />
          </h2>
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TECH.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
                  <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                  <h3 className="mt-4 text-lg font-medium text-[color:var(--text-1)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-3)]">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 60% at 50% 110%, var(--accent-glow), transparent)',
            }}
          />
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
            <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl">
              <AnimatedText text="Vezi ce vinde echipa ta, la zi." />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-5 max-w-xl text-sm text-[color:var(--text-3)] md:text-base">
                Cere o demonstrație și vezi ANDAXI CRM pe datele tale.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-8 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:text-base"
              >
                Cere o demonstrație
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#functionalitati"
                className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)] md:text-base"
              >
                Vezi funcționalitățile
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Crm
