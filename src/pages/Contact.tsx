import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronDown, Clock, MapPin, Phone, X } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { usePageMeta } from '../seo'
import { getModule, isModuleKey } from '../data/erpModules'
import type { ModuleKey } from '../data/erpModules'

const CONTACT_EMAIL = 'contact@andaxi.ro'

// Endpoint PHP de pe subdomeniul api.andaxi.ro — trimite prin SMTP Hostinger
// (vezi server/send-contact.php din repo).
const CONTACT_API = 'https://api.andaxi.ro/send-contact.php'

type Status = 'idle' | 'sending' | 'success' | 'error'

/** „Ce te interesează”. Paginile trimit alegerea în adresă: ?interes=erp,
 *  iar de pe /erp și modulele: &module=gestiune,casa_marcat. */
const INTERESTS = [
  { value: 'website', label: 'Website', placeholder: 'Ce fel de site îți trebuie? Câte pagini, ce să facă…' },
  { value: 'magazin', label: 'Magazin online', placeholder: 'Ce vinzi și cam câte produse ai?' },
  { value: 'erp', label: 'ANDAXI ERP', placeholder: 'Ce face firma ta și cu ce program lucrezi acum?' },
  { value: 'crm', label: 'ANDAXI CRM', placeholder: 'Câți agenți ai pe teren și cum lucrați acum?' },
  { value: 'demo', label: 'Demo ANDAXI ERP', placeholder: 'Când ți-ar fi bine să-ți arătăm programul?' },
] as const

type Interest = (typeof INTERESTS)[number]['value'] | ''

const INTEREST_ALIASES: Record<string, Interest> = {
  'magazin-online': 'magazin',
  magazin_online: 'magazin',
  site: 'website',
  'demo-erp': 'demo',
}

const parseInterest = (raw: string | null): Interest => {
  const v = (raw ?? '').trim().toLowerCase()
  if (INTERESTS.some((i) => i.value === v)) return v as Interest
  return INTEREST_ALIASES[v] ?? ''
}

const parseModules = (raw: string | null): ModuleKey[] =>
  [...new Set((raw ?? '').split(',').map((s) => s.trim()))].filter(isModuleKey).filter((k) => k !== 'core')

const inputClass =
  'w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3.5 text-sm text-[color:var(--text-1)] placeholder:text-[color:var(--text-5)] outline-none transition-colors duration-200 focus:border-[color:var(--accent)] focus:bg-[color:var(--surface-hover)] md:text-base'

const Contact = () => {
  const [searchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState<Interest>(() => parseInterest(searchParams.get('interes')))
  const [modules, setModules] = useState<ModuleKey[]>(() => parseModules(searchParams.get('module')))
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  usePageMeta('/contact')

  // Alt link către /contact, cu alt interes, fără să se remonteze pagina.
  useEffect(() => {
    setInterest(parseInterest(searchParams.get('interes')))
    setModules(parseModules(searchParams.get('module')))
  }, [searchParams])

  const interestInfo = INTERESTS.find((i) => i.value === interest)
  const showModules = (interest === 'erp' || interest === 'demo') && modules.length > 0

  /** Mesajul care pleacă: interesul și modulele, apoi textul omului. */
  const fullMessage = () => {
    const header = [
      interestInfo ? `Interes: ${interestInfo.label}` : null,
      showModules ? `Module: ${modules.map((k) => getModule(k).name).join(', ')}` : null,
    ].filter(Boolean)
    return header.length ? `${header.join('\n')}\n\n${message}` : message
  }

  const mailtoHref = () => {
    const subject = `Mesaj de pe site — ${name}`
    const body = [
      `Nume: ${name}`,
      `Email: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      '',
      fullMessage(),
    ]
      .filter((line) => line !== null)
      .join('\n')
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // `interes` și `module` merg și separat; endpoint-ul de azi le ignoră,
        // de aceea sunt scrise și la începutul mesajului.
        body: JSON.stringify({
          name,
          email,
          phone,
          message: fullMessage(),
          interes: interestInfo?.label ?? '',
          module: showModules ? modules : [],
        }),
      })
      if (!res.ok) throw new Error(`API ${res.status}`)
      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_0%,var(--accent-glow-soft),transparent)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 pb-24 pt-40 lg:grid-cols-2 lg:px-8">
          {/* Left — info */}
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-tight text-[color:var(--text-3)] md:text-sm">
                Contact
              </p>
            </Reveal>
            <h1
              className="mt-4 text-5xl font-medium tracking-tighter text-[color:var(--text-1)] sm:text-6xl md:text-7xl"
              style={{ lineHeight: 0.9 }}
            >
              <AnimatedText text="Hai să vorbim." delay={0.1} />
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                Vrei un website, un magazin online, o demonstrație ANDAXI ERP
                sau pur și simplu ai o întrebare? Scrie-ne sau sună-ne —
                răspundem repede și comunicăm clar.
              </p>
            </Reveal>

            <div className="mt-12 flex flex-col gap-6">
              <Reveal delay={0.4}>
                <a
                  href="tel:+40755885973"
                  className="group flex items-center gap-4 text-[color:var(--text-2)] transition-colors hover:text-[color:var(--text-1)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] transition-colors duration-300 group-hover:border-[color:var(--accent)]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-[color:var(--text-4)]">
                      Telefon
                    </span>
                    <span className="text-lg font-medium md:text-xl">0755 885 973</span>
                  </span>
                </a>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="flex items-center gap-4 text-[color:var(--text-2)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-[color:var(--text-4)]">
                      Unde lucrăm
                    </span>
                    <span className="text-lg font-medium md:text-xl">Oriunde în România</span>
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.6}>
                <div className="flex items-center gap-4 text-[color:var(--text-2)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)]">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-[color:var(--text-4)]">
                      Timp de răspuns
                    </span>
                    <span className="text-lg font-medium md:text-xl">
                      De obicei, în aceeași zi
                    </span>
                  </span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right — form / success */}
          <Reveal delay={0.25}>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 18 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-[color:var(--accent)]" />
                    </motion.div>
                    <h2 className="text-2xl font-medium text-[color:var(--text-1)]">
                      Mesajul a fost trimis!
                    </h2>
                    <p className="max-w-sm text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
                      Ți-am trimis și un email de confirmare. Te contactăm în
                      cel mai scurt timp posibil.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-4 text-sm text-[color:var(--text-3)] underline-offset-4 transition-colors hover:text-[color:var(--text-1)] hover:underline"
                    >
                      Trimite alt mesaj
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={false}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col gap-5">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-sm text-[color:var(--text-3)]">
                          Nume
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          placeholder="Numele tău"
                          className={inputClass}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="email" className="mb-2 block text-sm text-[color:var(--text-3)]">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            placeholder="email@exemplu.ro"
                            className={inputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-2 block text-sm text-[color:var(--text-3)]">
                            Telefon <span className="text-[color:var(--text-5)]">(opțional)</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            placeholder="07xx xxx xxx"
                            className={inputClass}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="interest" className="mb-2 block text-sm text-[color:var(--text-3)]">
                          Ce te interesează
                        </label>
                        <div className="relative">
                          <select
                            id="interest"
                            className={`${inputClass} cursor-pointer appearance-none pr-11`}
                            style={interest ? undefined : { color: 'var(--text-5)' }}
                            value={interest}
                            onChange={(e) => setInterest(e.target.value as Interest)}
                          >
                            <option value="">Alege…</option>
                            {INTERESTS.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-4)]" />
                        </div>
                        {showModules && (
                          <div className="mt-3">
                            <p className="text-xs text-[color:var(--text-4)]">Module alese</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {modules.map((k) => (
                                <span
                                  key={k}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-tint)] py-1 pl-3 pr-1.5 text-xs text-[color:var(--text-1)]"
                                >
                                  {getModule(k).name}
                                  <button
                                    type="button"
                                    onClick={() => setModules((m) => m.filter((x) => x !== k))}
                                    aria-label={`Scoate ${getModule(k).name}`}
                                    className="flex h-5 w-5 items-center justify-center rounded-full text-[color:var(--text-3)] transition-colors hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--text-1)]"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="message" className="mb-2 block text-sm text-[color:var(--text-3)]">
                          Mesaj
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          placeholder={interestInfo?.placeholder ?? 'Spune-ne pe scurt despre proiectul tău…'}
                          className={`${inputClass} resize-none`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--btn-bg)] px-8 py-4 text-sm font-medium text-[color:var(--btn-text)] transition-colors duration-300 hover:bg-[color:var(--btn-bg-hover)] disabled:cursor-wait disabled:opacity-60 md:text-base"
                      >
                        {status === 'sending' ? 'Se trimite…' : 'Trimite mesajul'}
                        {status !== 'sending' && (
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                      </button>
                      {status === 'error' && (
                        <p className="text-center text-sm text-red-500">
                          Mesajul nu a putut fi trimis. Încearcă din nou,{' '}
                          <a href={mailtoHref()} className="underline">
                            trimite-l pe email
                          </a>{' '}
                          sau sună-ne la{' '}
                          <a href="tel:+40755885973" className="underline">
                            0755 885 973
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Contact
