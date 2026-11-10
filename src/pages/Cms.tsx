import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, Gauge, MousePointerClick, Network, Plug, ShieldCheck, Sparkles } from 'lucide-react'
import ShinyText from '../components/ShinyText'
import Reveal from '../components/motion/Reveal'
import AnimatedText from '../components/motion/AnimatedText'
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger'
import SiteBuilder from '../components/cms/SiteBuilder'
import { usePageMeta } from '../seo'
import { CATEGORII, PACHETE, PLUGINS, euro, type PachetKey, type PluginKey } from '../data/cmsPlugins'

const AVANTAJE = [
  { icon: Gauge, title: 'Rapid', text: 'Pagini care se încarcă pe loc, fără zeci de module străine.' },
  { icon: Plug, title: 'Plugin-uri dintr-un clic', text: 'Un plugin pornit apare pe site în câteva minute.' },
  { icon: Network, title: 'Legat de ANDAXI ERP', text: 'Comenzile, stocul și facturile merg singure.' },
  { icon: ShieldCheck, title: 'Actualizări incluse', text: 'Securitate și noutăți, fără grija ta.' },
]

const PASI = [
  'Alegi pachetul: landing, prezentare sau magazin.',
  'Bifezi plugin-urile de care ai nevoie.',
  'Le vezi apărând pe site, încadrate cu roșu, și știi prețul pe loc.',
]

/** Pachetul care include plugin-ul (pentru eticheta „inclus în …”). */
const inclusIn = (k: PluginKey) => PACHETE.filter((P) => P.incluse.includes(k)).map((P) => P.name)

const Cms = () => {
  usePageMeta('/cms')
  const [deschis, setDeschis] = useState(false)
  const [pachet, setPachet] = useState<PachetKey>('magazin')
  const [plugin, setPlugin] = useState<PluginKey | null>(null)

  const deschide = (p: PachetKey = 'magazin', k: PluginKey | null = null) => {
    setPachet(p)
    setPlugin(k)
    setDeschis(true)
  }

  return (
    <div className="bg-[color:var(--bg)] font-sans">
      {/* ===== Hero ===== */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-glow), transparent)' }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 pt-40 text-center lg:px-8">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-tight text-[color:var(--accent)] md:text-sm">
              ANDAXI CMS · Platforma site-urilor noastre
            </p>
          </Reveal>
          <h1 className="max-w-5xl text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl" style={{ lineHeight: 0.95 }}>
            <span className="block font-medium text-[color:var(--text-1)]">
              <AnimatedText text="Site-ul tău," delay={0.15} />
            </span>
            <ShinyText
              text="cu exact ce-ți trebuie."
              color="var(--accent-strong)"
              shineColor="var(--shine)"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>
          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Un CMS construit de noi, de la zero: rapid, sigur și fără licențe plătite altora. Pornești
              plugin-uri când ai nevoie de ele și plătești doar ce folosești.
            </p>
          </Reveal>
          <Reveal delay={0.45} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => deschide()}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[color:var(--accent-strong-hover)] md:px-8 md:py-4 md:text-base"
            >
              <Sparkles className="h-4 w-4" />
              Construiește-ți site-ul live
            </button>
            <a
              href="#pluginuri"
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] px-6 py-3 text-sm text-[color:var(--text-2)] transition-colors duration-300 hover:border-[color:var(--text-1)] hover:text-[color:var(--text-1)] md:px-8 md:py-4 md:text-base"
            >
              Vezi plugin-urile
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ===== Avantajele ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AVANTAJE.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                <h3 className="mt-4 text-base font-medium text-[color:var(--text-1)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--text-3)]">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ===== Calculatorul live ===== */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl border border-[color:var(--accent-border)] bg-gradient-to-br from-[color:var(--accent-deep)] to-black p-8 md:p-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-[color:var(--accent)]">Calculator live</p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-5xl">
                Bifezi. Privești. Știi prețul.
              </h2>
              <ol className="mt-6 flex flex-col gap-3">
                {PASI.map((p, i) => (
                  <li key={p} className="flex gap-3 text-sm text-white/70 md:text-base">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => deschide()}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-200 md:text-base"
              >
                <MousePointerClick className="h-4 w-4" />
                Deschide calculatorul
              </button>
            </div>

            {/* O bucată din calculator, ca să se vadă ce face */}
            <button
              type="button"
              onClick={() => deschide('magazin', 'recenzii')}
              aria-label="Deschide calculatorul cu Recenzii pornit"
              className="group relative block w-full text-left"
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex items-center gap-1.5 bg-[#eef1f4] px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-500">🔒 firma-ta.ro</span>
                </div>
                <div className="grid grid-cols-3 gap-3 p-5">
                  {['from-emerald-100 to-emerald-200', 'from-amber-100 to-amber-200', 'from-lime-100 to-lime-200'].map((f, i) => (
                    <div key={f} className="rounded-xl border border-slate-200 p-2">
                      <div className={`h-16 rounded-lg bg-gradient-to-br ${f}`} />
                      <div className="mt-2 h-2 w-3/4 rounded bg-slate-200" />
                      <motion.div
                        className={`relative mt-2 inline-flex rounded text-[10px] text-amber-400 ${i === 0 ? 'cms-hl' : ''}`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                      >
                        {i === 0 && <span className="cms-hl-tag">NOU · Recenzii</span>}
                        ★★★★★
                      </motion.div>
                      <div className="mt-2 h-5 rounded-md bg-[#2f8d5b]" />
                    </div>
                  ))}
                </div>
                <div className="mx-5 mb-5 rounded-xl border-2 border-red-500 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">Ai adăugat</p>
                  <p className="text-sm font-semibold text-slate-900">Recenzii · +5 €/lună</p>
                  <p className="text-xs text-slate-500">Clienții lasă stele și păreri la produse.</p>
                </div>
              </div>
            </button>
          </div>
        </Reveal>
      </section>

      {/* ===== Plugin-urile ===== */}
      <section id="pluginuri" className="scroll-mt-24 border-t border-[color:var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Plugin-uri</p>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-[color:var(--text-1)] md:text-5xl">
            <AnimatedText text="Pornești doar ce-ți trebuie." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--text-3)] md:text-base">
              Apasă pe oricare și îl vezi pe un site, în calculatorul live.
            </p>
          </Reveal>

          {CATEGORII.map((C) => (
            <div key={C.key} className="mt-12">
              <Reveal>
                <h3 className="text-sm font-medium uppercase tracking-wider text-[color:var(--accent)]">{C.name}</h3>
              </Reveal>
              <StaggerContainer className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PLUGINS.filter((p) => p.categorie === C.key).map((P) => {
                  const inclus = inclusIn(P.key)
                  return (
                    <StaggerItem key={P.key}>
                      <button
                        type="button"
                        onClick={() => deschide(P.doarMagazin ? 'magazin' : 'prezentare', P.key)}
                        className="group flex h-full w-full items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-left transition-colors duration-300 hover:border-[color:var(--accent-border)] hover:bg-[color:var(--surface-hover)]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-tint)]">
                          <P.icon className="h-5 w-5 text-[color:var(--accent)]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <span className="text-base font-medium text-[color:var(--text-1)]">{P.name}</span>
                            <span className="text-xs tabular-nums text-[color:var(--accent)]">{euro(P.pret)}/lună</span>
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-[color:var(--text-3)]">{P.scurt}</span>
                          {inclus.length > 0 && (
                            <span className="mt-2 inline-block rounded-full bg-[color:var(--accent-tint)] px-2.5 py-0.5 text-xs text-[color:var(--accent)]">
                              inclus în {inclus.join(' și ')}
                            </span>
                          )}
                          <span className="mt-2 flex items-center gap-1 text-xs text-[color:var(--text-4)] transition-colors group-hover:text-[color:var(--text-2)]">
                            Vezi-l pe site
                            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </span>
                      </button>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8">
          <h2 className="max-w-3xl text-4xl font-medium tracking-tighter text-[color:var(--text-1)] md:text-6xl">
            <AnimatedText text="Gata să-ți construim site-ul?" />
          </h2>
          <Reveal delay={0.25} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => deschide()}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--btn-bg)] px-8 py-4 text-sm font-medium text-[color:var(--btn-text)] transition-colors duration-300 hover:bg-[color:var(--btn-bg-hover)] md:text-base"
            >
              Calculează prețul
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <Link
              to="/preturi#website-uri"
              className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)] md:text-base"
            >
              sau vezi toate prețurile
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteBuilder open={deschis} onClose={() => setDeschis(false)} pachetInitial={pachet} pluginStart={plugin} />
    </div>
  )
}

export default Cms
