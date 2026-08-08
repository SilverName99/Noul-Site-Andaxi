import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Archive,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Calculator,
  FileText,
  Globe,
  Landmark,
  Package,
  RefreshCw,
  Server,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'
import ShinyText from '../components/ShinyText'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import Marquee from '../components/Marquee'

const MODULES = [
  {
    icon: FileText,
    title: 'Facturare',
    tagline: 'Emiți facturi în câteva secunde și le trimiți în SPV.',
    items: [
      'Facturi client (interne și externe), proforme, chitanțe și avize de însoțire.',
      'Serii și numerotare automată, storno, TVA la încasare.',
      'e-Factura: generare în format UBL și trimitere către ANAF (SPV).',
      'Primești e-Factura de la furnizori direct în program.',
      'Încasezi direct de pe factură — legătură automată cu contabilitatea.',
    ],
  },
  {
    icon: Package,
    title: 'Gestiune & stocuri',
    tagline: 'Stocuri corecte, pe loturi, în timp real.',
    items: [
      'Gestiuni multiple (depozit și magazin).',
      'Recepții (NIR), transferuri între gestiuni, bonuri de consum.',
      'Stoc urmărit pe loturi, inventar, fișă de gestiune.',
      'Descărcare automată de gestiune la vânzare.',
    ],
  },
  {
    icon: Calculator,
    title: 'Contabilitate',
    tagline: 'De la document la bilanț, automat.',
    items: [
      'Contare automată — documentele devin note contabile pe baza monografiei tale.',
      'Plan de conturi, note contabile, registru-jurnal, fișă de cont.',
      'Balanță, balanță pe parteneri, bilanț.',
      'Închideri de lună și de an, reevaluări valutare la cursul BNR, jurnale de TVA.',
      'Impozit pe profit / pe venit, distribuiri de dividende.',
    ],
  },
  {
    icon: Landmark,
    title: 'Declarații ANAF & e-Factura',
    tagline: 'Conform, fără dublă muncă.',
    items: [
      'e-Factura (UBL) și schimb prin SPV — trimitere și primire.',
      'SAF-T (Declarația D406).',
      'Declarațiile D100, D101, D205, D300, D390 și D394.',
      'Registre contabile și fiscale, generate din aceleași date.',
    ],
  },
  {
    icon: Wallet,
    title: 'Casă & bancă',
    tagline: 'Toate încasările și plățile, la zi.',
    items: [
      'Încasări și plăți, dispoziții de încasare/plată, chitanțe, ordine de plată.',
      'Extrase de cont, compensări între parteneri.',
      'Avansuri și deconturi de cheltuieli.',
    ],
  },
  {
    icon: Archive,
    title: 'Mijloace fixe & obiecte de inventar',
    tagline: 'Amortizări automate, fără calcule manuale.',
    items: [
      'Registru de mijloace fixe și obiecte de inventar.',
      'Amortizări calculate automat, cu intrări și ieșiri.',
    ],
  },
  {
    icon: Users,
    title: 'Parteneri & contracte',
    tagline: 'Clienți, furnizori și documentele lor, organizate.',
    items: [
      'Nomenclator de clienți și furnizori, cu puncte de lucru.',
      'Contracte, confirmări de sold, agenți.',
    ],
  },
  {
    icon: BarChart3,
    title: 'Rapoarte & analize',
    tagline: 'Vezi cum stă firma, oricând.',
    items: [
      'Rapoarte configurabile și tabele pivot.',
      'Șabloane de rapoarte salvate, istoric al balanțelor.',
    ],
  },
]

const COMPLIANCE = [
  'e-Factura (SPV)',
  'SAF-T / D406',
  'D100',
  'D101',
  'D205',
  'D300',
  'D390',
  'D394',
  'TVA la încasare',
  'Reevaluări la cursul BNR',
  'Registre contabile și fiscale',
]

const WHY = [
  {
    title: 'Tot într-un singur loc',
    text: 'Facturi, stocuri, bancă, contabilitate și declarații — conectate, fără insule de date.',
  },
  {
    title: 'Conform ANAF, din prima',
    text: 'e-Factura, SAF-T și declarațiile sunt incluse, nu module separate.',
  },
  {
    title: 'Automatizare reală',
    text: 'Documentele devin note contabile automat; descărcarea de gestiune și încasările se leagă singure.',
  },
  {
    title: 'Datele tale, serverul tău',
    text: 'Instalare dedicată per client — date izolate, control și confidențialitate.',
  },
  {
    title: 'Roluri și drepturi',
    text: 'Acces controlat pe utilizatori: proprietar, administrator, contabil, operator.',
  },
]

const AUDIENCES = [
  'Antreprenori și firme mici/medii care vor facturare, stocuri și contabilitate într-un singur program.',
  'Firme mai mari cu gestiuni multiple, mijloace fixe și nevoi de raportare.',
  'Contabili și experți contabili care vor contare automată, închideri și declarații ANAF fără efort.',
]

const TECH = [
  {
    icon: Globe,
    title: 'Aplicație web modernă',
    text: 'O deschizi din browser, de oriunde, fără instalări.',
  },
  {
    icon: Server,
    title: 'Instalare dedicată',
    text: 'Un server per client, cu datele tale izolate.',
  },
  {
    icon: RefreshCw,
    title: 'Actualizări de legislație',
    text: 'Formularele și regulile fiscale rămân la zi.',
  },
]

const Erp = () => {
  useEffect(() => {
    document.title = 'ANDAXI ERP — Facturare, gestiune și contabilitate'
  }, [])

  return (
    <div className="bg-black font-sans">
      {/* ===== Hero ===== */}
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(31,111,235,0.35),transparent)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-40 text-center lg:px-8">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-tight text-[#64CEFB] md:text-sm">
              ANDAXI ERP · Online, complet, conform ANAF
            </p>
          </Reveal>

          <h1
            className="max-w-5xl text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ lineHeight: 0.95 }}
          >
            <span className="block font-medium text-white">
              <AnimatedText text="Facturare, gestiune și contabilitate —" delay={0.15} />
            </span>
            <ShinyText
              text="într-un singur program."
              color="#1F6FEB"
              shineColor="#ffffff"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>

          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              Emiți facturi, ții stocurile, faci contabilitatea și trimiți
              declarațiile la ANAF — dintr-un singur program online, conform
              cu legislația din România.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1F6FEB] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#3b82f6] md:px-8 md:py-4 md:text-base"
            >
              Cere o demonstrație
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#functionalitati"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm text-white/90 transition-colors duration-300 hover:border-white hover:text-white md:px-8 md:py-4 md:text-base"
            >
              Vezi funcționalitățile
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.55}>
            <p className="mt-8 flex items-center justify-center gap-2 text-xs text-white/50 md:text-sm">
              <ShieldCheck className="h-4 w-4 text-[#64CEFB]" />
              Conform e-Factura și SAF-T. Datele tale, pe serverul tău.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Intro ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-5xl">
            <AnimatedText text="Mai mult decât un program de facturare." />
          </h2>
          <Reveal delay={0.15}>
            <p className="text-sm leading-relaxed text-white/60 md:text-base">
              Facturarea e doar începutul. ANDAXI ERP acoperă tot fluxul
              firmei — de la emiterea facturii, la stocuri, casă și bancă,
              contabilitate și declarații ANAF — fără să sari între programe
              diferite. Introduci datele o singură dată; restul se leagă
              automat.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Module ===== */}
      <section id="functionalitati" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-white/50">Funcționalități</p>
          </Reveal>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-white md:text-5xl">
            <AnimatedText text="Ce poți face cu ANDAXI ERP" />
          </h2>

          <StaggerContainer className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {MODULES.map(({ icon: Icon, title, tagline, items }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-[#1F6FEB]/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F6FEB]/15">
                      <Icon className="h-5 w-5 text-[#64CEFB]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-white">{title}</h3>
                      <p className="text-sm text-white/50">{tagline}</p>
                    </div>
                  </div>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/60">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#64CEFB]" />
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

      {/* ===== Conformitate ===== */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-medium tracking-tight text-white md:text-4xl">
              Conform cu legislația din România — inclus
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/60 md:text-base">
              Fără module separate pentru declarații. Toate se generează din
              datele pe care le introduci o singură dată — programul se ocupă
              de forma cerută de ANAF și rămâne la zi cu legislația.
            </p>
          </Reveal>
        </div>
        <div className="mt-10">
          <Marquee items={COMPLIANCE} />
        </div>
      </section>

      {/* ===== De ce ===== */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-5xl">
            <AnimatedText text="De ce ANDAXI ERP" />
          </h2>
          <StaggerContainer className="mt-12 flex flex-col">
            {WHY.map(({ title, text }, i) => (
              <StaggerItem key={title}>
                <div className="group flex flex-col gap-2 border-t border-white/10 py-7 last:border-b md:flex-row md:items-baseline md:gap-10">
                  <span className="text-sm text-white/30 md:w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-medium text-white md:w-72">{title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-white/60 md:text-base">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Pentru cine ===== */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-5xl">
            <AnimatedText text="Pentru cine este" />
          </h2>
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {AUDIENCES.map((text) => (
              <StaggerItem key={text}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm leading-relaxed text-white/70 transition-colors duration-300 hover:border-white/25 md:text-base"
                >
                  {text}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Tehnologie ===== */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-5xl">
            <AnimatedText text="Tehnologie & siguranță" />
          </h2>
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TECH.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                  <Icon className="h-6 w-6 text-[#64CEFB]" />
                  <h3 className="mt-4 text-lg font-medium text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-white/10">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_110%,rgba(31,111,235,0.3),transparent)]" />
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
            <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-white md:text-6xl">
              <AnimatedText text="Un singur program pentru tot ce ține firma ta." />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-5 max-w-xl text-sm text-white/60 md:text-base">
                Cere o demonstrație și vezi ANDAXI ERP pe datele tale.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1F6FEB] px-8 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#3b82f6] md:text-base"
              >
                Cere o demonstrație
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#functionalitati"
                className="text-sm text-white/60 transition-colors hover:text-white md:text-base"
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

export default Erp
