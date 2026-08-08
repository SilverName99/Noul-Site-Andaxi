import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'

// Adresa pe care ajung mesajele din formular — de înlocuit cu emailul firmei.
const CONTACT_EMAIL = 'contact@andaxi.ro'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-200 focus:border-[#64CEFB]/70 focus:bg-white/[0.06] md:text-base'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.title = 'Contact — Andaxi'
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `Mesaj de pe site — ${name}`
    const body = [
      `Nume: ${name}`,
      `Email: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n')

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="bg-black font-sans">
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_0%,rgba(100,206,251,0.12),transparent)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 pb-24 pt-40 lg:grid-cols-2 lg:px-8">
          {/* Left — info */}
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-tight text-white/60 md:text-sm">
                Contact
              </p>
            </Reveal>
            <h1
              className="mt-4 text-5xl font-medium tracking-tighter text-white sm:text-6xl md:text-7xl"
              style={{ lineHeight: 0.9 }}
            >
              <AnimatedText text="Hai să vorbim." delay={0.1} />
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
                Vrei un website, ai nevoie de o demonstrație ANDAXI ERP sau
                pur și simplu ai o întrebare? Scrie-ne sau sună-ne — răspundem
                repede și comunicăm clar.
              </p>
            </Reveal>

            <div className="mt-12 flex flex-col gap-6">
              <Reveal delay={0.4}>
                <a
                  href="tel:+40755885973"
                  className="group flex items-center gap-4 text-white/80 transition-colors hover:text-white"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-[#64CEFB]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-white/40">
                      Telefon
                    </span>
                    <span className="text-lg font-medium md:text-xl">0755 885 973</span>
                  </span>
                </a>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-white/40">
                      Unde lucrăm
                    </span>
                    <span className="text-lg font-medium md:text-xl">România · Grecia</span>
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.6}>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-white/40">
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

          {/* Right — form */}
          <Reveal delay={0.25}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
            >
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-white/70">
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
                    <label htmlFor="email" className="mb-2 block text-sm text-white/70">
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
                    <label htmlFor="phone" className="mb-2 block text-sm text-white/70">
                      Telefon <span className="text-white/35">(opțional)</span>
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
                  <label htmlFor="message" className="mb-2 block text-sm text-white/70">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Spune-ne pe scurt despre proiectul tău…"
                    className={`${inputClass} resize-none`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-200 md:text-base"
                >
                  Trimite mesajul
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="text-center text-xs text-white/40">
                  Se deschide aplicația ta de email cu mesajul precompletat.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Contact
