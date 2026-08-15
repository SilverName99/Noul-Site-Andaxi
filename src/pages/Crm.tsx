import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  CloudUpload,
  Globe,
  Link2,
  Map,
  MessagesSquare,
  ShieldCheck,
  UserCheck,
  Layers,
} from 'lucide-react'
import ShinyText from '../components/ShinyText'
import { setPageMeta } from '../seo'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import Marquee from '../components/Marquee'
import ScrollShowcase from '../components/ScrollShowcase'
import type { ShowcaseStep } from '../components/ScrollShowcase'

const MODULES: ShowcaseStep[] = [
  {
    icon: Map,
    title: 'Hartă interactivă cu stopuri',
    tagline: 'Alocă fiecărui agent un traseu în fiecare zi',
    items: [
      'Check-in automat cu preluare de oră',
      'Hartă interactivă, intuitivă și la zi',
      'Rute pentru fiecare agent în parte',
    ],
    image: '/img/crm/01-harta-interactiva.jpg',
  },
  {
    icon: Boxes,
    title: 'Stocuri per agent',
    tagline: 'Fiecare agent are stocul lui',
    items: [
      'Adaugă produse, împarte produsele pe categorii și atribuie la fiecare angajat',
      'Ușor de manageriat, cu istoric pentru fiecare acțiune',
      'Sistem de cereri și aprobări ale stocului',
    ],
    image: '/img/crm/02-stocuri.jpg',
  },
  {
    icon: UserCheck,
    title: 'Fiecare agent are contul lui',
    tagline: 'Își vede vânzările direct din ERP',
    items: [
      'Pagină separată pentru afișarea vânzărilor',
      'Detaliile preluate direct din ERP, automat',
      'Împărțite și detaliate pe fiecare produs în parte',
    ],
    image: '/img/crm/03-vanzarile-mele.jpg',
  },
  {
    icon: CloudUpload,
    title: 'Încărcare de materiale',
    tagline: 'Distribuie fișiere direct din CRM',
    items: [
      'Încarcă fișiere și împarte-le în foldere',
      'Fiecare agent are acces oricând la ele',
    ],
    image: '/img/crm/04-cloud.jpg',
  },
  {
    icon: MessagesSquare,
    title: 'Chat direct în CRM',
    tagline: 'Scrie mesaje colegilor tăi direct din CRM',
    items: [
      'Totul într-un singur loc',
      'Ordine și spațiu pentru fiecare angajat',
      'Interfață intuitivă, cu sunet pentru mesajele noi',
    ],
    image: '/img/crm/05-chat.jpg',
  },
  {
    icon: Link2,
    title: 'Conectat la ERP',
    tagline: 'Dacă folosești deja ERP-ul, CRM-ul îl completează perfect',
    items: [
      'Conectezi ERP-ul simplu și rapid',
      'Scapă de Excel-uri făcute manual',
      'Distribuie fiecărui agent doar ce este al lui',
    ],
    image: '/img/crm/06-erp-integrare.jpg',
  },
]

const HIGHLIGHTS = [
  'Hartă interactivă cu stopuri',
  'Rute zilnice pentru fiecare agent',
  'Check-in automat cu preluare de oră',
  'Stocuri per agent',
  'Cereri și aprobări de stoc',
  'Vânzări preluate automat din ERP',
  'Cont separat pentru fiecare agent',
  'Fișiere organizate în foldere',
  'Chat integrat, cu notificări',
  'Conectare simplă la ERP',
  'Fără Excel-uri făcute manual',
]

const WHY = [
  {
    title: 'Scapă de Excel-uri făcute manual',
    text: 'Gata cu vânzările adunate din fișiere trimise pe email sau WhatsApp — datele se leagă singure, direct din ERP.',
  },
  {
    title: 'Trasee clare, în fiecare zi',
    text: 'Hartă interactivă cu stopuri și check-in automat cu oră — fiecare agent știe exact unde merge și ce are de făcut.',
  },
  {
    title: 'Fiecare agent vede doar ce e al lui',
    text: 'Organizare și confidențialitate în aceeași frază: stocuri, vânzări și fișiere distribuite individual, securizat.',
  },
  {
    title: 'Gândit din practică, nu din teorie',
    text: 'Detalii care contează în lucrul de zi cu zi — de la sunetul pentru mesajele noi din chat, la istoricul fiecărei acțiuni pe stoc.',
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
    setPageMeta(
      'ANDAXI CRM — Vânzări pe agent, cu hartă și rute, conectat la ERP',
      'CRM pentru echipe de agenți pe teren: hartă interactivă cu stopuri și check-in, stocuri per agent, vânzări preluate automat din ERP, fișiere și chat integrat.',
      '/crm',
    )
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

          <ScrollShowcase steps={MODULES} />
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
