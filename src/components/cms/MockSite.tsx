import type { LucideIcon } from 'lucide-react'
import {
  ChevronRight,
  Droplet,
  FlaskConical,
  Heart,
  Leaf,
  Lock,
  Mail,
  Menu,
  PenLine,
  Pill,
  Search,
  ShoppingCart,
  Sprout,
  Star,
  User,
} from 'lucide-react'
import { Hl, useCms } from './Hl'
import type { PachetKey } from '../../data/cmsPlugins'

/**
 * Site-ul de probă din calculatorul live: un magazin inventat („Firma Ta”),
 * desenat ca un site adevărat, pe fundal alb, oricare ar fi tema paginii.
 * Fiecare bucată adusă de un plugin stă într-un <Hl k="…">: apare doar când
 * plugin-ul e pornit și se încadrează cu roșu când abia a fost pornit.
 */

interface Produs {
  nume: string
  pret: number
  icon: LucideIcon
  fundal: string
  culoare: string
}

const PRODUSE: Produs[] = [
  { nume: 'Ceai de tei', pret: 18, icon: Leaf, fundal: 'from-emerald-100 to-emerald-200', culoare: 'text-emerald-700' },
  { nume: 'Miere polifloră', pret: 29, icon: Droplet, fundal: 'from-amber-100 to-amber-200', culoare: 'text-amber-700' },
  { nume: 'Ulei de cânepă', pret: 45, icon: FlaskConical, fundal: 'from-lime-100 to-lime-200', culoare: 'text-lime-700' },
  { nume: 'Vitamina C', pret: 32, icon: Pill, fundal: 'from-orange-100 to-orange-200', culoare: 'text-orange-700' },
]

const VERDE = 'bg-[#2f8d5b]'
const lei = (v: number) => `${v} lei`

const Stele = ({ n = 5, mic }: { n?: number; mic?: boolean }) => (
  <span className="inline-flex items-center gap-0.5 text-amber-400">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={mic ? 'h-3 w-3' : 'h-3.5 w-3.5'} fill={i < n ? 'currentColor' : 'none'} />
    ))}
  </span>
)

const Titlu = ({ children, sub }: { children: string; sub?: string }) => (
  <div className="mb-5">
    <h3 className="text-[22px] font-semibold tracking-tight text-slate-900">{children}</h3>
    {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
  </div>
)

const CardProdus = ({ p, i }: { p: Produs; i: number }) => {
  const { on, pachet } = useCms()
  const magazin = pachet === 'magazin'
  const reducere = on('campanii') && magazin
  const pretNou = reducere ? Math.round(p.pret * 0.8) : p.pret
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${p.fundal}`}>
        <p.icon className={`h-12 w-12 ${p.culoare}`} strokeWidth={1.5} />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {reducere && (
            <Hl k="campanii" inline fara_eticheta>
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">-20%</span>
            </Hl>
          )}
          {i === 1 && magazin && (
            <Hl k="oferte_bbd" inline>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">
                Termen scurt -30%
              </span>
            </Hl>
          )}
          {i === 2 && magazin && (
            <Hl k="precomenzi" inline>
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
                Precomandă · vine pe 20
              </span>
            </Hl>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-sm font-semibold text-slate-900">{p.nume}</p>
        <Hl k="recenzii" inline fara_eticheta={i > 0} className="items-center gap-1 text-xs text-slate-500">
          <Stele n={i === 2 ? 4 : 5} mic /> ({[24, 41, 9, 17][i]})
        </Hl>
        {magazin && (
          <p className="text-base font-bold text-slate-900">
            {lei(pretNou)}
            {reducere && <span className="ml-1.5 text-xs font-normal text-slate-400 line-through">{lei(p.pret)}</span>}
          </p>
        )}
        {magazin && (
          <Hl k="fidelitate" inline fara_eticheta={i > 0} className="text-[11px] font-medium text-violet-600">
            + {pretNou} puncte de fidelitate
          </Hl>
        )}
        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          {magazin ? (
            <span className={`rounded-lg ${VERDE} px-3 py-2 text-center text-xs font-semibold text-white`}>
              {i === 2 && on('precomenzi') ? 'Precomandă' : 'Adaugă în coș'}
            </span>
          ) : (
            <span className="rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700">
              Vezi detalii
            </span>
          )}
          <Hl k="cereri_oferta" fara_eticheta={i > 0}>
            <span className="block rounded-lg border border-[#2f8d5b] px-3 py-2 text-center text-xs font-semibold text-[#2f8d5b]">
              Cere ofertă
            </span>
          </Hl>
        </div>
      </div>
    </div>
  )
}

const Manechin = ({ mobil }: { mobil: boolean }) => (
  <div className={`grid items-center gap-6 rounded-3xl bg-emerald-50 p-6 ${mobil ? 'grid-cols-1' : 'grid-cols-[220px_1fr]'}`}>
    <svg viewBox="0 0 120 220" className="mx-auto h-56 w-auto text-emerald-200" aria-hidden>
      <circle cx="60" cy="24" r="16" fill="currentColor" />
      <rect x="40" y="44" width="40" height="70" rx="16" fill="currentColor" />
      <rect x="20" y="48" width="14" height="62" rx="7" fill="currentColor" />
      <rect x="86" y="48" width="14" height="62" rx="7" fill="currentColor" />
      <rect x="42" y="112" width="15" height="86" rx="7" fill="currentColor" />
      <rect x="63" y="112" width="15" height="86" rx="7" fill="currentColor" />
      {[
        [60, 24, true],
        [60, 70, false],
        [60, 100, false],
        [50, 160, false],
      ].map(([x, y, activ], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="7" fill={activ ? '#2f8d5b' : '#ffffff'} stroke="#2f8d5b" strokeWidth="2" />
          {activ && <circle cx={x as number} cy={y as number} r="12" fill="none" stroke="#2f8d5b" strokeOpacity=".35" strokeWidth="3" />}
        </g>
      ))}
    </svg>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Alege zona</p>
      <h3 className="mt-1 text-xl font-semibold text-slate-900">Pentru cap și somn liniștit</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {['Ceai de tei', 'Miere polifloră', 'Ulei de cânepă'].map((n) => (
          <li key={n} className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm">
            {n}
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const Cos = ({ mobil }: { mobil: boolean }) => {
  const { on } = useCms()
  const plati = [
    { k: 'plata_bt' as const, nume: 'Card · Banca Transilvania', detaliu: 'rate fără dobândă și puncte STAR' },
    { k: 'plata_stripe' as const, nume: 'Card · Stripe', detaliu: 'Apple Pay și Google Pay' },
    { k: 'plata_euplatesc' as const, nume: 'Card · EuPlătesc', detaliu: 'orice card, orice bancă' },
  ]
  const primaCard = plati.find((p) => on(p.k))?.k
  return (
    <div className={`grid gap-5 ${mobil ? 'grid-cols-1' : 'grid-cols-[1fr_340px]'}`}>
      <div className="flex flex-col gap-3">
        <Hl k="conturi_clienti" fara_eticheta>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span>Ai cont? Comanzi mai repede.</span>
            <span className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              Intră cu Google
            </span>
          </div>
        </Hl>
        {PRODUSE.slice(0, 2).map((p) => (
          <div key={p.nume} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <span className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${p.fundal}`}>
              <p.icon className={`h-6 w-6 ${p.culoare}`} />
            </span>
            <span className="flex-1 text-sm font-medium text-slate-800">{p.nume}</span>
            <span className="text-sm text-slate-500">1 ×</span>
            <span className="w-16 text-right text-sm font-semibold text-slate-900">{lei(p.pret)}</span>
          </div>
        ))}
        <Hl k="pachete_produse" fara_eticheta>
          <div className="rounded-xl border border-dashed border-[#2f8d5b] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Ceaiul de tei e și în <b>Pachetul Somn liniștit</b>: 3 produse la 79 lei în loc de 92 lei.
          </div>
        </Hl>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Livrare</p>
        <label className="flex items-center gap-2 rounded-lg border border-[#2f8d5b] bg-emerald-50 px-3 py-2 text-xs text-slate-800">
          <span className="h-3 w-3 rounded-full border-4 border-[#2f8d5b]" /> Curier la adresă
          <Hl k="livrare_fan" inline className="ml-auto font-semibold text-slate-900">
            FAN Courier · 15 lei
          </Hl>
        </label>
        <Hl k="livrare_fan" fara_eticheta>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
            <span className="h-3 w-3 rounded-full border border-slate-400" /> FANbox lângă tine
            <span className="ml-auto text-slate-500">9 lei</span>
          </label>
        </Hl>

        <p className="mt-1 text-sm font-semibold text-slate-900">Plata</p>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
          <span className="h-3 w-3 rounded-full border border-slate-400" /> Ramburs, la curier
        </label>
        {plati.map((p) => (
          <Hl key={p.k} k={p.k}>
            <label
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                p.k === primaCard ? 'border-[#2f8d5b] bg-emerald-50 text-slate-800' : 'border-slate-200 text-slate-700'
              }`}
            >
              <span
                className={`h-3 w-3 rounded-full ${p.k === primaCard ? 'border-4 border-[#2f8d5b]' : 'border border-slate-400'}`}
              />
              <span>
                {p.nume}
                <span className="block text-[10px] text-slate-500">{p.detaliu}</span>
              </span>
            </label>
          </Hl>
        ))}

        <Hl k="cupoane">
          <div className="flex gap-2">
            <span className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-400">Cod de reducere</span>
            <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white">Aplică</span>
          </div>
        </Hl>
        <Hl k="fidelitate" fara_eticheta>
          <div className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
            Ai <b>120 de puncte</b>: folosește-le și plătești cu 12 lei mai puțin.
          </div>
        </Hl>

        <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-500">Total</span>
          <b className="text-lg text-slate-900">62 lei</b>
        </div>
        <span className={`rounded-lg ${VERDE} px-3 py-2.5 text-center text-sm font-semibold text-white`}>Trimite comanda</span>
      </div>
    </div>
  )
}

interface MockSiteProps {
  pachet: PachetKey
  mobil: boolean
}

const MockSite = ({ pachet, mobil }: MockSiteProps) => {
  const { on } = useCms()
  const magazin = pachet === 'magazin'
  const landing = pachet === 'landing'
  const catalog = on('catalog')
  const sectiune = mobil ? 'px-5 py-8' : 'px-10 py-12'

  const meniu = (
    <>
      <span className="font-semibold text-slate-900">Acasă</span>
      {!landing && <span>Despre noi</span>}
      <Hl k="catalog" inline fara_eticheta>
        <span>Produse</span>
      </Hl>
      <Hl k="blog" inline fara_eticheta>
        <span>Blog</span>
      </Hl>
      <Hl k="membri" inline fara_eticheta>
        <span className="inline-flex items-center gap-1">
          <Lock className="h-3 w-3" /> Membri
        </span>
      </Hl>
      <span>Contact</span>
    </>
  )

  return (
    <div className="relative min-h-full bg-white font-sans text-slate-700 antialiased">
      {/* Bannerul campaniei */}
      <Hl k="campanii">
        <div className="bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white">
          🔥 Black Friday: <b className="text-rose-400">-20% la tot</b>, până duminică la miezul nopții
        </div>
      </Hl>

      {/* Antetul */}
      <header className={`flex items-center gap-6 border-b border-slate-100 ${mobil ? 'px-5 py-4' : 'px-10 py-5'}`}>
        <span className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${VERDE}`}>
            <Sprout className="h-5 w-5 text-white" />
          </span>
          Firma Ta
        </span>
        {!mobil && <nav className="flex items-center gap-6 text-sm text-slate-600">{meniu}</nav>}
        <div className="ml-auto flex items-center gap-4 text-slate-700">
          <Hl k="catalog" inline fara_eticheta>
            <Search className="h-5 w-5" />
          </Hl>
          <Hl k="conturi_clienti" inline>
            <User className="h-5 w-5" />
          </Hl>
          {magazin && (
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full ${VERDE} text-[10px] font-bold text-white`}>
                2
              </span>
            </span>
          )}
          {mobil && <Menu className="h-5 w-5" />}
        </div>
      </header>
      {mobil && (
        <nav className="flex gap-4 overflow-hidden border-b border-slate-100 px-5 py-2.5 text-xs text-slate-600">{meniu}</nav>
      )}

      {/* Prima secțiune */}
      <section className={`grid items-center gap-8 bg-gradient-to-b from-emerald-50/70 to-white ${sectiune} ${mobil ? 'grid-cols-1' : 'grid-cols-[1.2fr_1fr]'}`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2f8d5b]">Din natură, pentru tine</p>
          <h2 className={`mt-3 font-bold leading-tight tracking-tight text-slate-900 ${mobil ? 'text-3xl' : 'text-[40px]'}`}>
            Produse naturale, {magazin ? 'livrate acasă.' : 'alese cu grijă.'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Ceaiuri, miere și uleiuri de la producători mici din România.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className={`rounded-xl ${VERDE} px-5 py-3 text-sm font-semibold text-white`}>
              {magazin ? 'Cumpără acum' : catalog ? 'Vezi produsele' : 'Contactează-ne'}
            </span>
            {!landing && (
              <span className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">Despre noi</span>
            )}
          </div>
        </div>
        {!mobil && (
          <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400">
            <Leaf className="h-24 w-24 text-white" strokeWidth={1.25} />
            <span className="absolute -right-2 top-6 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg">
              100% natural
            </span>
          </div>
        )}
      </section>

      {/* Produsele */}
      <Hl k="catalog" className={sectiune}>
        <Titlu sub={magazin ? 'Comandă azi, ajunge mâine.' : 'Alege ce ți se potrivește.'}>Cele mai iubite</Titlu>
        <div className={`grid gap-4 ${mobil ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {PRODUSE.map((p, i) => (
            <CardProdus key={p.nume} p={p} i={i} />
          ))}
        </div>
      </Hl>

      {/* Pachetele */}
      {magazin && (
        <Hl k="pachete_produse" className={`${sectiune} pt-0`}>
          <div className={`flex items-center gap-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white ${mobil ? 'flex-col items-start' : ''}`}>
            <div className="flex -space-x-3">
              {PRODUSE.slice(0, 3).map((p) => (
                <span key={p.nume} className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br ${p.fundal}`}>
                  <p.icon className={`h-7 w-7 ${p.culoare}`} />
                </span>
              ))}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Pachet</p>
              <p className="text-lg font-semibold">Somn liniștit: 3 produse</p>
              <p className="text-sm text-emerald-50">
                <b>79 lei</b> <span className="line-through opacity-70">92 lei</span>
              </p>
            </div>
            <span className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700">Adaugă pachetul</span>
          </div>
        </Hl>
      )}

      {/* Manechinul */}
      <Hl k="manechin" className={`${sectiune} pt-0`}>
        <Manechin mobil={mobil} />
      </Hl>

      {/* Coșul */}
      {magazin && (
        <section className={`border-t border-slate-100 bg-slate-50/60 ${sectiune}`}>
          <Titlu sub="Așa arată finalizarea comenzii.">Coșul tău</Titlu>
          <Cos mobil={mobil} />
        </section>
      )}

      {/* Recenziile */}
      <Hl k="recenzii" className={sectiune} fara_eticheta>
        <Titlu>Ce spun clienții</Titlu>
        <div className={`grid gap-4 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {[
            ['Ana M.', 'Mierea e exact ca la bunici. Revin sigur!'],
            ['Radu P.', 'Livrare rapidă și totul ambalat cu grijă.'],
            ['Ioana T.', 'Ceaiul de tei m-a ajutat să dorm mai bine.'],
          ].map(([n, t]) => (
            <div key={n} className="rounded-2xl border border-slate-200 p-4">
              <Stele />
              <p className="mt-2 text-sm text-slate-700">„{t}”</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">{n} · cumpărător verificat</p>
            </div>
          ))}
        </div>
      </Hl>

      {/* Donațiile și membrii */}
      {(on('donatii') || on('membri')) && (
        <div className={`grid gap-4 ${sectiune} ${mobil || !(on('donatii') && on('membri')) ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <Hl k="donatii">
            <div className="h-full rounded-3xl bg-rose-50 p-6">
              <Heart className="h-7 w-7 text-rose-500" fill="currentColor" />
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Susține-ne</h3>
              <p className="mt-1 text-sm text-slate-500">O dată sau lunar, cu cardul.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['50 lei', '100 lei', '200 lei', 'Altă sumă'].map((s, i) => (
                  <span
                    key={s}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${i === 1 ? 'bg-rose-500 text-white' : 'border border-rose-200 bg-white text-rose-600'}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">☑ Donez lunar</p>
            </div>
          </Hl>
          <Hl k="membri">
            <div className="h-full rounded-3xl bg-indigo-50 p-6">
              <Lock className="h-7 w-7 text-indigo-500" />
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Devino membru</h3>
              <p className="mt-1 text-sm text-slate-500">Cotizație 30 lei/lună · acces la documente și pagini doar pentru membri.</p>
              <span className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">Înscrie-te</span>
            </div>
          </Hl>
        </div>
      )}

      {/* Acordul semnat */}
      <Hl k="acorduri_gdpr" className={`${sectiune} pt-0`}>
        <div className="rounded-3xl border border-slate-200 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <PenLine className="h-4 w-4 text-[#2f8d5b]" /> Acord de colaborare
          </p>
          <div className={`mt-4 grid gap-3 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {['Nume și prenume', 'Instituția', 'Email'].map((c) => (
              <span key={c} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400">
                {c}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-end justify-between gap-4">
            <svg viewBox="0 0 160 40" className="h-10 w-40 text-slate-700" aria-hidden>
              <path d="M5 30 C 20 5, 30 35, 45 18 S 70 30, 85 12 S 120 34, 150 15" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className={`rounded-lg ${VERDE} px-4 py-2 text-xs font-semibold text-white`}>Semnează</span>
          </div>
        </div>
      </Hl>

      {/* Blogul */}
      <Hl k="blog" className={`${sectiune} border-t border-slate-100`}>
        <Titlu sub="Sfaturi și noutăți.">Din blog</Titlu>
        <div className={`grid gap-4 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {[
            ['5 ceaiuri pentru un somn bun', 'from-emerald-100 to-teal-200'],
            ['Cum alegi o miere adevărată', 'from-amber-100 to-yellow-200'],
            ['Ce e uleiul de cânepă', 'from-lime-100 to-green-200'],
          ]
            .slice(0, mobil ? 2 : 3)
            .map(([t, f]) => (
              <div key={t} className="overflow-hidden rounded-2xl border border-slate-200">
                <div className={`h-24 bg-gradient-to-br ${f}`} />
                <div className="p-4">
                  <p className="text-[11px] text-slate-400">12 noiembrie · 4 min</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{t}</p>
                </div>
              </div>
            ))}
        </div>
      </Hl>

      {/* Newsletterul */}
      <Hl k="newsletter" className={sectiune}>
        <div className={`flex items-center gap-4 rounded-3xl bg-slate-900 p-6 text-white ${mobil ? 'flex-col items-start' : ''}`}>
          <Mail className="h-8 w-8 text-emerald-300" />
          <div className="flex-1">
            <p className="text-lg font-semibold">Abonează-te la noutăți</p>
            <p className="text-sm text-slate-400">Oferte și sfaturi, o dată pe săptămână.</p>
          </div>
          <div className="flex w-full max-w-xs gap-2">
            <span className="flex-1 rounded-lg bg-white/10 px-3 py-2.5 text-xs text-slate-400">emailul tău</span>
            <span className="rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-900">Abonare</span>
          </div>
        </div>
      </Hl>

      {/* Contactul (pe landing, formularul e pe pagină) */}
      <section className={`${sectiune} border-t border-slate-100`}>
        <div className={`grid gap-6 ${mobil ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div>
            <Titlu sub="Răspundem în aceeași zi.">Hai să vorbim</Titlu>
            <p className="text-sm text-slate-500">0700 000 000 · salut@firma-ta.ro</p>
          </div>
          <div className="flex flex-col gap-2">
            {['Numele tău', 'Emailul tău', 'Mesaj'].map((c) => (
              <span key={c} className={`rounded-lg border border-slate-200 px-3 text-xs text-slate-400 ${c === 'Mesaj' ? 'h-16 py-2' : 'py-2.5'}`}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className={`bg-slate-50 text-xs text-slate-400 ${mobil ? 'px-5 py-6' : 'px-10 py-8'}`}>
        © Firma Ta · Termeni · Confidențialitate · ANPC
      </footer>
    </div>
  )
}

/** Fereastra de chat stă peste site, în colț, nu în pagină. */
export const BulaChat = () => (
  <Hl k="chat_live" className="pointer-events-none absolute bottom-4 right-4 z-20">
    <div className="flex items-end gap-2">
      <span className="max-w-[180px] rounded-2xl rounded-br-sm bg-white px-3 py-2 text-xs text-slate-700 shadow-lg">
        Bună! Te pot ajuta cu ceva? 👋
      </span>
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${VERDE} shadow-lg`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
          <path d="M4 4h16v11H8l-4 4z" />
        </svg>
      </span>
    </div>
  </Hl>
)

/** Panoul lateral „Oferte” (loturile cu termen scurt), lipit de marginea site-ului. */
export const PanouOferte = () => (
  <Hl k="oferte_bbd" className="pointer-events-none absolute right-0 top-1/3 z-20" fara_eticheta>
    <span className="block rounded-l-xl bg-amber-500 px-2 py-4 text-xs font-bold text-white shadow-lg [writing-mode:vertical-rl]">
      Oferte -30%
    </span>
  </Hl>
)

export default MockSite
