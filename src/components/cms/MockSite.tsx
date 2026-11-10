import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  CircleCheck,
  Download,
  FileText,
  Heart,
  Leaf,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Minus,
  PenLine,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Sprout,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { Hl, useCms } from './Hl'
import { ARTICOLE, PACHET_DEMO, PRODUSE, useDemo } from './demo'
import type { CosItem, Pagina } from './demo'
import type { PluginKey } from '../../data/cmsPlugins'

/**
 * Site-ul de probă din calculatorul live: un magazin inventat („Firma Ta”),
 * desenat ca un site adevărat, pe fundal alb, oricare ar fi tema paginii, și
 * care se poate folosi: meniul, produsele, coșul și formularele merg (în
 * memorie). Fiecare bucată adusă de un plugin stă într-un <Hl k="…">: apare
 * doar când plugin-ul e pornit și se încadrează cu roșu când abia a fost pornit.
 */

const VERDE = 'bg-[#2f8d5b]'
const lei = (v: number) => `${Math.round(v * 100) / 100} lei`

// ── Bucăți mici ──────────────────────────────────────────────────────────────────

const Btn = ({
  onClick,
  className = '',
  children,
  label,
}: {
  onClick: () => void
  className?: string
  children: ReactNode
  label?: string
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={`cursor-pointer transition-opacity hover:opacity-85 ${className}`}
  >
    {children}
  </button>
)

const Stele = ({ n = 5, mic, onAlege }: { n?: number; mic?: boolean; onAlege?: (n: number) => void }) => (
  <span className="inline-flex items-center gap-0.5 text-amber-400">
    {Array.from({ length: 5 }, (_, i) =>
      onAlege ? (
        <button key={i} type="button" onClick={() => onAlege(i + 1)} aria-label={`${i + 1} stele`}>
          <Star className="h-5 w-5" fill={i < n ? 'currentColor' : 'none'} />
        </button>
      ) : (
        <Star key={i} className={mic ? 'h-3 w-3' : 'h-3.5 w-3.5'} fill={i < n ? 'currentColor' : 'none'} />
      ),
    )}
  </span>
)

const Titlu = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <div className="mb-5">
    <h3 className="text-[22px] font-semibold tracking-tight text-slate-900">{children}</h3>
    {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
  </div>
)

const Camp = ({ text, inalt }: { text: string; inalt?: boolean }) => (
  <span className={`block rounded-lg border border-slate-200 px-3 text-xs text-slate-400 ${inalt ? 'h-16 py-2' : 'py-2.5'}`}>
    {text}
  </span>
)

const Confirmare = ({ children }: { children: ReactNode }) => (
  <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
    <CircleCheck className="h-4 w-4 shrink-0" /> {children}
  </p>
)

const Poza = ({ i, className = '', mare }: { i: number; className?: string; mare?: boolean }) => {
  const P = PRODUSE[i]
  return (
    <span className={`flex items-center justify-center bg-gradient-to-br ${P.fundal} ${className}`}>
      <P.icon className={`${mare ? 'h-24 w-24' : 'h-12 w-12'} ${P.culoare}`} strokeWidth={1.5} />
    </span>
  )
}

/** Prețul de pe site (cu reducerea campaniei, când e pornită). */
const usePret = () => {
  const { on, pachet } = useCms()
  const reducere = on('campanii') && pachet === 'magazin'
  return { reducere, pret: (i: number) => (reducere ? Math.round(PRODUSE[i].pret * 0.8) : PRODUSE[i].pret) }
}

/** Link spre o secțiune: pe landing page e o ancoră, altfel o pagină. */
const useMergi = () => {
  const d = useDemo()
  const { pachet } = useCms()
  return (pg: Pagina, ancora: string) => (pachet === 'landing' ? d.ancora(ancora) : d.deschide(pg))
}

// ── Antetul ──────────────────────────────────────────────────────────────────────

const Antet = ({ mobil }: { mobil: boolean }) => {
  const d = useDemo()
  const { pachet } = useCms()
  const landing = pachet === 'landing'
  const nrCos = d.cos.reduce((s, x) => s + x.n, 0)

  const linkuri: { nume: string; k?: PluginKey; pg: Pagina; ancora: string; icon?: ReactNode }[] = [
    { nume: 'Acasă', pg: { p: 'acasa' }, ancora: 'sus' },
    { nume: landing ? 'Despre' : 'Despre noi', pg: { p: 'despre' }, ancora: 'despre' },
    { nume: 'Produse', k: 'catalog', pg: { p: 'produse' }, ancora: 'produse' },
    { nume: 'Blog', k: 'blog', pg: { p: 'blog' }, ancora: 'blog' },
    { nume: 'Membri', k: 'membri', pg: { p: 'membri' }, ancora: 'membri', icon: <Lock className="h-3 w-3" /> },
    { nume: 'Contact', pg: { p: 'contact' }, ancora: 'contact' },
  ]
  const activ = (pg: Pagina) =>
    !landing && (d.pagina.p === pg.p || (pg.p === 'produse' && d.pagina.p === 'produs') || (pg.p === 'blog' && d.pagina.p === 'articol'))
  const mergi = (pg: Pagina, a: string) => (landing ? d.ancora(a) : d.deschide(pg))

  const meniu = linkuri
    .filter((l) => !(landing && l.k === 'membri'))
    .map((l) => {
      const buton = (
        <Btn
          onClick={() => mergi(l.pg, l.ancora)}
          className={`inline-flex items-center gap-1 whitespace-nowrap ${activ(l.pg) ? 'font-semibold text-slate-900' : ''}`}
        >
          {l.icon}
          {l.nume}
          {landing && l.ancora !== 'sus' && <span className="text-slate-300">#</span>}
        </Btn>
      )
      return l.k ? (
        <Hl key={l.nume} k={l.k} inline fara_eticheta>
          {buton}
        </Hl>
      ) : (
        <span key={l.nume}>{buton}</span>
      )
    })

  return (
    <>
      <header className={`flex items-center gap-6 border-b border-slate-100 bg-white ${mobil ? 'px-5 py-4' : 'px-10 py-5'}`}>
        <Btn onClick={() => mergi({ p: 'acasa' }, 'sus')} className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${VERDE}`}>
            <Sprout className="h-5 w-5 text-white" />
          </span>
          Firma Ta
        </Btn>
        {!mobil && <nav className="flex items-center gap-6 text-sm text-slate-600">{meniu}</nav>}
        <div className="ml-auto flex items-center gap-4 text-slate-700">
          <Hl k="catalog" inline fara_eticheta>
            <Btn onClick={() => d.deschide({ p: 'produse' })} label="Caută">
              <Search className="h-5 w-5" />
            </Btn>
          </Hl>
          <Hl k="conturi_clienti" inline fara_eticheta>
            <Btn onClick={() => d.deschide({ p: 'cont' })} label="Contul meu">
              <User className="h-5 w-5" />
            </Btn>
          </Hl>
          {pachet === 'magazin' && (
            <Btn onClick={() => d.deschide({ p: 'cos' })} className="relative" label="Coșul">
              <ShoppingCart className="h-5 w-5" />
              {nrCos > 0 && (
                <span className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 ${VERDE} text-[10px] font-bold text-white`}>
                  {nrCos}
                </span>
              )}
            </Btn>
          )}
        </div>
      </header>
      {mobil && (
        <nav className="flex gap-4 overflow-x-auto border-b border-slate-100 px-5 py-2.5 text-xs text-slate-600 [scrollbar-width:none]">
          {meniu}
        </nav>
      )}
    </>
  )
}

// ── Produsele ────────────────────────────────────────────────────────────────────

const CardProdus = ({ i }: { i: number }) => {
  const d = useDemo()
  const { on, pachet } = useCms()
  const { reducere, pret } = usePret()
  const magazin = pachet === 'magazin'
  const P = PRODUSE[i]
  const deschide = () => d.deschide({ p: 'produs', i })
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Btn onClick={deschide} className="relative block" label={P.nume}>
        <Poza i={i} className="h-32 w-full" />
        <span className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {reducere && (
            <Hl k="campanii" inline fara_eticheta>
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">-20%</span>
            </Hl>
          )}
          {i === 1 && magazin && (
            <Hl k="oferte_bbd" inline fara_eticheta>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">Termen scurt -30%</span>
            </Hl>
          )}
          {i === 2 && magazin && (
            <Hl k="precomenzi" inline fara_eticheta>
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">Precomandă</span>
            </Hl>
          )}
        </span>
      </Btn>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Btn onClick={deschide} className="text-left text-sm font-semibold text-slate-900">
          {P.nume}
        </Btn>
        <Hl k="recenzii" inline fara_eticheta className="items-center gap-1 text-xs text-slate-500">
          <Stele n={i === 2 ? 4 : 5} mic /> ({[24, 41, 9, 17, 12, 30][i]})
        </Hl>
        {magazin && (
          <p className="text-base font-bold text-slate-900">
            {lei(pret(i))}
            {reducere && <span className="ml-1.5 text-xs font-normal text-slate-400 line-through">{lei(P.pret)}</span>}
          </p>
        )}
        {magazin && (
          <Hl k="fidelitate" inline fara_eticheta className="text-[11px] font-medium text-violet-600">
            + {pret(i)} puncte
          </Hl>
        )}
        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          {magazin ? (
            <Btn
              onClick={() => d.adaugaInCos({ id: String(i), nume: P.nume, i, pret: pret(i) })}
              className={`rounded-lg ${VERDE} px-3 py-2 text-center text-xs font-semibold text-white`}
            >
              {i === 2 && on('precomenzi') ? 'Precomandă' : 'Adaugă în coș'}
            </Btn>
          ) : (
            <Btn onClick={deschide} className="rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700">
              Vezi detalii
            </Btn>
          )}
          <Hl k="cereri_oferta" fara_eticheta>
            <Btn
              onClick={() => {
                d.set('cerere', i)
                deschide()
              }}
              className="block w-full rounded-lg border border-[#2f8d5b] px-3 py-2 text-center text-xs font-semibold text-[#2f8d5b]"
            >
              Cere ofertă
            </Btn>
          </Hl>
        </div>
      </div>
    </div>
  )
}

const GrilaProduse = ({ lista, mobil }: { lista: number[]; mobil: boolean }) => (
  <div className={`grid gap-4 ${mobil ? 'grid-cols-2' : lista.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
    {lista.map((i) => (
      <CardProdus key={i} i={i} />
    ))}
  </div>
)

const BannerPachet = ({ mobil }: { mobil: boolean }) => {
  const d = useDemo()
  const total = PACHET_DEMO.produse.reduce((s, i) => s + PRODUSE[i].pret, 0)
  return (
    <div className={`flex items-center gap-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white ${mobil ? 'flex-col items-start' : ''}`}>
      <div className="flex -space-x-3">
        {PACHET_DEMO.produse.map((i) => (
          <Poza key={i} i={i} className="h-14 w-14 rounded-2xl border-2 border-white [&_svg]:h-7 [&_svg]:w-7" />
        ))}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Pachet</p>
        <p className="text-lg font-semibold">{PACHET_DEMO.nume}: 3 produse</p>
        <p className="text-sm text-emerald-50">
          <b>{lei(PACHET_DEMO.pret)}</b> <span className="line-through opacity-70">{lei(total)}</span>
        </p>
      </div>
      <Btn
        onClick={() => d.adaugaInCos({ id: 'pachet', nume: PACHET_DEMO.nume, i: -1, pret: PACHET_DEMO.pret })}
        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
      >
        Adaugă pachetul
      </Btn>
    </div>
  )
}

const ZONE = [
  { nume: 'Cap și somn', x: 60, y: 24, produse: [0, 5, 1] },
  { nume: 'Piept și imunitate', x: 60, y: 70, produse: [3, 4, 1] },
  { nume: 'Burtă și digestie', x: 60, y: 100, produse: [5, 2, 0] },
  { nume: 'Articulații', x: 50, y: 160, produse: [2, 3, 4] },
]

const Manechin = ({ mobil }: { mobil: boolean }) => {
  const d = useDemo()
  const zona = Number(d.ui.zona ?? 0)
  const Z = ZONE[zona]
  return (
    <div className={`grid items-center gap-6 rounded-3xl bg-emerald-50 p-6 ${mobil ? 'grid-cols-1' : 'grid-cols-[220px_1fr]'}`}>
      <svg viewBox="0 0 120 220" className="mx-auto h-56 w-auto text-emerald-200">
        <circle cx="60" cy="24" r="16" fill="currentColor" />
        <rect x="40" y="44" width="40" height="70" rx="16" fill="currentColor" />
        <rect x="20" y="48" width="14" height="62" rx="7" fill="currentColor" />
        <rect x="86" y="48" width="14" height="62" rx="7" fill="currentColor" />
        <rect x="42" y="112" width="15" height="86" rx="7" fill="currentColor" />
        <rect x="63" y="112" width="15" height="86" rx="7" fill="currentColor" />
        {ZONE.map((z, i) => (
          <g key={z.nume} role="button" aria-label={z.nume} className="cursor-pointer" onClick={() => d.set('zona', i)}>
            <circle cx={z.x} cy={z.y} r="12" fill="transparent" />
            <circle cx={z.x} cy={z.y} r="7" fill={i === zona ? '#2f8d5b' : '#ffffff'} stroke="#2f8d5b" strokeWidth="2" />
            {i === zona && <circle cx={z.x} cy={z.y} r="12" fill="none" stroke="#2f8d5b" strokeOpacity=".35" strokeWidth="3" />}
          </g>
        ))}
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Apasă pe o zonă</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900">{Z.nume}</h3>
        <ul className="mt-4 flex flex-col gap-2">
          {Z.produse.map((i) => (
            <li key={i}>
              <Btn
                onClick={() => d.deschide({ p: 'produs', i })}
                className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm"
              >
                {PRODUSE[i].nume}
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Btn>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const RECENZII = [
  ['Ana M.', 'Exact ca la bunici. Revin sigur!'],
  ['Radu P.', 'Livrare rapidă și totul ambalat cu grijă.'],
  ['Ioana T.', 'M-a ajutat să dorm mai bine.'],
]

const Testimoniale = ({ mobil }: { mobil: boolean }) => (
  <div className={`grid gap-4 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
    {RECENZII.map(([n, t]) => (
      <div key={n} className="rounded-2xl border border-slate-200 p-4">
        <Stele />
        <p className="mt-2 text-sm text-slate-700">„{t}”</p>
        <p className="mt-2 text-xs font-semibold text-slate-500">{n} · cumpărător verificat</p>
      </div>
    ))}
  </div>
)

// ── Secțiuni comune ──────────────────────────────────────────────────────────────

const SectiuneDespre = ({ mobil }: { mobil: boolean }) => (
  <div className={`grid gap-6 ${mobil ? 'grid-cols-1' : 'grid-cols-[1fr_1fr]'}`}>
    <div>
      <Titlu sub="Din 2015, la Cluj.">Despre noi</Titlu>
      <p className="text-sm leading-relaxed text-slate-600">
        Suntem o echipă mică ce lucrează direct cu apicultori și fermieri din Ardeal. Alegem fiecare produs ca pentru
        familia noastră și îl trimitem în aceeași zi.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[
        ['🌿', 'Natural'],
        ['🤝', 'Direct de la producători'],
        ['🚚', 'Livrare în 24 h'],
      ].map(([e, t]) => (
        <div key={t} className="rounded-2xl bg-emerald-50 p-4 text-center">
          <p className="text-2xl">{e}</p>
          <p className="mt-2 text-xs font-semibold text-slate-700">{t}</p>
        </div>
      ))}
    </div>
  </div>
)

const SectiuneContact = ({ mobil }: { mobil: boolean }) => {
  const d = useDemo()
  return (
    <div className="flex flex-col gap-6">
      <div className={`grid gap-6 ${mobil ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <Titlu sub="Răspundem în aceeași zi.">Hai să vorbim</Titlu>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="h-4 w-4 text-[#2f8d5b]" /> 0700 000 000
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Mail className="h-4 w-4 text-[#2f8d5b]" /> salut@firma-ta.ro
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-[#2f8d5b]" /> Str. Florilor 1, Cluj-Napoca
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {d.ui.mesajTrimis ? (
            <Confirmare>Mesaj trimis. Te sunăm azi!</Confirmare>
          ) : (
            <>
              <Camp text="Numele tău" />
              <Camp text="Emailul tău" />
              <Camp text="Mesaj" inalt />
              <Btn onClick={() => d.set('mesajTrimis', true)} className={`rounded-lg ${VERDE} px-4 py-2.5 text-sm font-semibold text-white`}>
                Trimite mesajul
              </Btn>
            </>
          )}
        </div>
      </div>

      <Hl k="acorduri_gdpr">
        <div className="rounded-3xl border border-slate-200 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <PenLine className="h-4 w-4 text-[#2f8d5b]" /> Acord de colaborare, semnat online
          </p>
          {d.ui.acordSemnat ? (
            <div className="mt-4">
              <Confirmare>Acord semnat. Îl primești și pe email.</Confirmare>
            </div>
          ) : (
            <>
              <div className={`mt-4 grid gap-3 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
                <Camp text="Nume și prenume" />
                <Camp text="Instituția" />
                <Camp text="Email" />
              </div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <svg viewBox="0 0 160 40" className="h-10 w-40 text-slate-700" aria-hidden>
                  <path d="M5 30 C 20 5, 30 35, 45 18 S 70 30, 85 12 S 120 34, 150 15" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <Btn onClick={() => d.set('acordSemnat', true)} className={`rounded-lg ${VERDE} px-4 py-2 text-xs font-semibold text-white`}>
                  Semnează
                </Btn>
              </div>
            </>
          )}
        </div>
      </Hl>
    </div>
  )
}

const ArticoleBlog = ({ mobil, lista }: { mobil: boolean; lista: number[] }) => {
  const d = useDemo()
  return (
    <div className={`grid gap-4 ${mobil ? 'grid-cols-1' : lista.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {lista.map((i) => (
        <Btn key={i} onClick={() => d.deschide({ p: 'articol', i })} className="overflow-hidden rounded-2xl border border-slate-200 text-left">
          <span className={`block h-24 bg-gradient-to-br ${ARTICOLE[i].fundal}`} />
          <span className="block p-4">
            <span className="block text-[11px] text-slate-400">12 noiembrie · 4 min</span>
            <span className="mt-1 block text-sm font-semibold text-slate-900">{ARTICOLE[i].titlu}</span>
            <span className="mt-1 block text-xs text-slate-500">{ARTICOLE[i].rezumat}</span>
          </span>
        </Btn>
      ))}
    </div>
  )
}

const DonatiiMembri = ({ mobil }: { mobil: boolean }) => {
  const d = useDemo()
  const { on } = useCms()
  if (!on('donatii') && !on('membri')) return null
  const suma = String(d.ui.suma ?? '100 lei')
  return (
    <div className={`grid gap-4 ${mobil || !(on('donatii') && on('membri')) ? 'grid-cols-1' : 'grid-cols-2'}`}>
      <Hl k="donatii">
        <div className="h-full rounded-3xl bg-rose-50 p-6">
          <Heart className="h-7 w-7 text-rose-500" fill="currentColor" />
          <h3 className="mt-3 text-xl font-semibold text-slate-900">Susține-ne</h3>
          <p className="mt-1 text-sm text-slate-500">O dată sau lunar, cu cardul.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['50 lei', '100 lei', '200 lei'].map((s) => (
              <Btn
                key={s}
                onClick={() => d.set('suma', s)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${s === suma ? 'bg-rose-500 text-white' : 'border border-rose-200 bg-white text-rose-600'}`}
              >
                {s}
              </Btn>
            ))}
          </div>
          <Btn onClick={() => d.set('lunar', !d.ui.lunar)} className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${d.ui.lunar ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300'}`}>
              {d.ui.lunar ? '✓' : ''}
            </span>
            Donez lunar
          </Btn>
          <Btn
            onClick={() => d.notifica(`Mulțumim pentru donația de ${suma}${d.ui.lunar ? ' pe lună' : ''}! ❤`)}
            className="mt-4 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Donează {suma}
          </Btn>
        </div>
      </Hl>
      <Hl k="membri" fara_eticheta>
        <div className="h-full rounded-3xl bg-indigo-50 p-6">
          <Lock className="h-7 w-7 text-indigo-500" />
          <h3 className="mt-3 text-xl font-semibold text-slate-900">Devino membru</h3>
          <p className="mt-1 text-sm text-slate-500">Cotizație de la 30 lei/lună · documente și pagini doar pentru membri.</p>
          <Btn onClick={() => d.deschide({ p: 'membri' })} className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
            Vezi zona membrilor
          </Btn>
        </div>
      </Hl>
    </div>
  )
}

// ── Paginile ─────────────────────────────────────────────────────────────────────

const PaginaAcasa = ({ mobil, s }: { mobil: boolean; s: string }) => {
  const d = useDemo()
  const { on, pachet } = useCms()
  const mergi = useMergi()
  const magazin = pachet === 'magazin'
  const landing = pachet === 'landing'
  return (
    <>
      <section className={`grid items-center gap-8 bg-gradient-to-b from-emerald-50/70 to-white ${s} ${mobil ? 'grid-cols-1' : 'grid-cols-[1.2fr_1fr]'}`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2f8d5b]">Din natură, pentru tine</p>
          <h2 className={`mt-3 font-bold leading-tight tracking-tight text-slate-900 ${mobil ? 'text-3xl' : 'text-[40px]'}`}>
            Produse naturale, {magazin ? 'livrate acasă.' : 'alese cu grijă.'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">Ceaiuri, miere și uleiuri de la producători mici din România.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Btn
              onClick={() => (on('catalog') ? mergi({ p: 'produse' }, 'produse') : mergi({ p: 'contact' }, 'contact'))}
              className={`rounded-xl ${VERDE} px-5 py-3 text-sm font-semibold text-white`}
            >
              {magazin ? 'Cumpără acum' : on('catalog') ? 'Vezi produsele' : 'Contactează-ne'}
            </Btn>
            <Btn onClick={() => mergi({ p: 'despre' }, 'despre')} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              Despre noi
            </Btn>
          </div>
        </div>
        {!mobil && (
          <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400">
            <Leaf className="h-24 w-24 text-white" strokeWidth={1.25} />
            <span className="absolute -right-2 top-6 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg">100% natural</span>
          </div>
        )}
      </section>

      {landing && (
        <section data-ancora="despre" className={s}>
          <SectiuneDespre mobil={mobil} />
        </section>
      )}

      <Hl k="catalog" className={s}>
        <div data-ancora="produse">
          <Titlu sub={magazin ? 'Comandă azi, ajunge mâine.' : 'Alege ce ți se potrivește.'}>Cele mai iubite</Titlu>
          <GrilaProduse lista={[0, 1, 2, 3]} mobil={mobil} />
          <Btn onClick={() => d.deschide({ p: 'produse' })} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2f8d5b]">
            Toate produsele <ChevronRight className="h-4 w-4" />
          </Btn>
        </div>
      </Hl>

      {magazin && (
        <Hl k="pachete_produse" className={`${s} pt-0`} fara_eticheta>
          <BannerPachet mobil={mobil} />
        </Hl>
      )}

      <Hl k="manechin" className={`${s} pt-0`}>
        <Manechin mobil={mobil} />
      </Hl>

      <Hl k="recenzii" className={s} fara_eticheta>
        <Titlu>Ce spun clienții</Titlu>
        <Testimoniale mobil={mobil} />
      </Hl>

      <div className={on('donatii') || on('membri') ? s : ''}>
        <DonatiiMembri mobil={mobil} />
      </div>

      <Hl k="blog" className={`${s} border-t border-slate-100`} fara_eticheta>
        <div data-ancora="blog">
          <Titlu sub="Sfaturi și noutăți.">Din blog</Titlu>
          <ArticoleBlog mobil={mobil} lista={mobil ? [0, 1] : [0, 1, 2]} />
        </div>
      </Hl>

      {landing && (
        <section data-ancora="contact" className={`${s} border-t border-slate-100`}>
          <SectiuneContact mobil={mobil} />
        </section>
      )}
    </>
  )
}

const PaginaDespre = ({ mobil, s }: { mobil: boolean; s: string }) => (
  <section className={s}>
    <SectiuneDespre mobil={mobil} />
    <div className={`mt-8 grid gap-4 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
      {[
        ['Maria', 'fondatoare', 'from-emerald-200 to-emerald-400'],
        ['Andrei', 'logistică', 'from-amber-200 to-amber-400'],
        ['Elena', 'relații cu clienții', 'from-sky-200 to-sky-400'],
      ].map(([n, r, f]) => (
        <div key={n} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
          <span className={`h-12 w-12 rounded-full bg-gradient-to-br ${f}`} />
          <span>
            <span className="block text-sm font-semibold text-slate-900">{n}</span>
            <span className="block text-xs text-slate-500">{r}</span>
          </span>
        </div>
      ))}
    </div>
  </section>
)

const PaginaProduse = ({ mobil, s }: { mobil: boolean; s: string }) => {
  const d = useDemo()
  const cauta = String(d.ui.cauta ?? '')
  const cat = String(d.ui.cat ?? 'Toate')
  const categorii = ['Toate', ...new Set(PRODUSE.map((p) => p.categorie))]
  const lista = PRODUSE.map((_, i) => i).filter(
    (i) =>
      (cat === 'Toate' || PRODUSE[i].categorie === cat) &&
      PRODUSE[i].nume.toLowerCase().includes(cauta.trim().toLowerCase()),
  )
  return (
    <section className={s}>
      <Titlu sub="Toate produsele noastre.">Produse</Titlu>
      <label className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={cauta}
          onChange={(e) => d.set('cauta', e.target.value)}
          placeholder="Caută: ceai, miere…"
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </label>
      <div className="mb-5 flex flex-wrap gap-2">
        {categorii.map((c) => (
          <Btn
            key={c}
            onClick={() => d.set('cat', c)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${c === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {c}
          </Btn>
        ))}
      </div>
      {lista.length ? (
        <GrilaProduse lista={lista} mobil={mobil} />
      ) : (
        <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">Niciun produs găsit.</p>
      )}
    </section>
  )
}

const PaginaProdus = ({ i, mobil, s }: { i: number; mobil: boolean; s: string }) => {
  const d = useDemo()
  const { on, pachet } = useCms()
  const { reducere, pret } = usePret()
  const mergi = useMergi()
  const P = PRODUSE[i]
  const magazin = pachet === 'magazin'
  const bbd = i === 1 && magazin && on('oferte_bbd')
  const lotScurt = bbd && d.ui.lot === 'scurt'
  const pretLot = lotScurt ? Math.round(P.pret * 0.7) : pret(i)
  const cant = Number(d.ui[`cant${i}`] ?? 1)
  const nota = Number(d.ui.nota ?? 5)
  const intrari = [0, 1, 2, 3, 4, 5].filter((x) => x !== i).slice(0, 3)
  const pachetTotal = PACHET_DEMO.produse.reduce((t, x) => t + PRODUSE[x].pret, 0)

  return (
    <>
      <section className={s}>
        <p className="mb-5 flex items-center gap-1.5 text-xs text-slate-400">
          <Btn onClick={() => d.deschide({ p: 'acasa' })}>Acasă</Btn> /
          <Btn onClick={() => d.deschide({ p: 'produse' })}>Produse</Btn> /<span className="text-slate-600">{P.nume}</span>
        </p>
        <div className={`grid gap-8 ${mobil ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <Poza i={i} mare className="h-72 rounded-3xl" />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2f8d5b]">{P.categorie}</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{P.nume}</h2>
            <Hl k="recenzii" inline>
              <Btn onClick={() => d.deruleaza('recenzii')} className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Stele n={i === 2 ? 4 : 5} /> 4,9 · {[24, 41, 9, 17, 12, 30][i]} recenzii
              </Btn>
            </Hl>
            {magazin && (
              <p className="text-2xl font-bold text-slate-900">
                {lei(pretLot)}
                {(reducere || lotScurt) && <span className="ml-2 text-base font-normal text-slate-400 line-through">{lei(P.pret)}</span>}
              </p>
            )}

            {i === 1 && magazin && (
              <Hl k="oferte_bbd">
                <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800">Alege lotul</p>
                  {[
                    ['normal', 'Lot obișnuit · valabil până în 2027', pret(i)],
                    ['scurt', 'Termen scurt · valabil până pe 30.11', Math.round(P.pret * 0.7)],
                  ].map(([k, t, v]) => {
                    const ales = (d.ui.lot ?? 'normal') === k
                    return (
                      <Btn
                        key={k as string}
                        onClick={() => d.set('lot', k as string)}
                        className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-left text-xs ${ales ? 'border-amber-500' : 'border-amber-100'}`}
                      >
                        <span className={`h-3 w-3 rounded-full ${ales ? 'border-4 border-amber-500' : 'border border-slate-300'}`} />
                        <span className="flex-1 text-slate-700">{t}</span>
                        <b className="text-slate-900">{lei(v as number)}</b>
                      </Btn>
                    )
                  })}
                </div>
              </Hl>
            )}
            {i === 2 && magazin && (
              <Hl k="precomenzi">
                <p className="rounded-xl bg-indigo-50 px-3 py-2.5 text-xs text-indigo-800">
                  <b>Precomandă:</b> marfa vine pe 20 noiembrie. Comanzi acum și o primești printre primii.
                </p>
              </Hl>
            )}
            {magazin && (
              <Hl k="fidelitate" inline className="text-xs font-medium text-violet-600">
                Primești {pretLot * cant} puncte de fidelitate la comanda asta.
              </Hl>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {magazin && (
                <>
                  <span className="inline-flex items-center rounded-xl border border-slate-200">
                    <Btn onClick={() => d.set(`cant${i}`, Math.max(1, cant - 1))} className="px-3 py-2.5" label="Mai puțin">
                      <Minus className="h-3.5 w-3.5" />
                    </Btn>
                    <span className="w-6 text-center text-sm font-semibold text-slate-900">{cant}</span>
                    <Btn onClick={() => d.set(`cant${i}`, Math.min(9, cant + 1))} className="px-3 py-2.5" label="Mai mult">
                      <Plus className="h-3.5 w-3.5" />
                    </Btn>
                  </span>
                  <Btn
                    onClick={() =>
                      d.adaugaInCos(
                        {
                          id: lotScurt ? `${i}-bbd` : String(i),
                          nume: P.nume,
                          i,
                          pret: pretLot,
                          nota: lotScurt ? 'termen scurt' : i === 2 && on('precomenzi') ? 'precomandă' : undefined,
                        },
                        cant,
                      )
                    }
                    className={`rounded-xl ${VERDE} px-6 py-3 text-sm font-semibold text-white`}
                  >
                    {i === 2 && on('precomenzi') ? 'Precomandă' : 'Adaugă în coș'}
                  </Btn>
                </>
              )}
              <Hl k="cereri_oferta" inline fara_eticheta={i !== 0}>
                <Btn
                  onClick={() => d.set('cerere', d.ui.cerere === i ? -1 : i)}
                  className="rounded-xl border border-[#2f8d5b] px-6 py-3 text-sm font-semibold text-[#2f8d5b]"
                >
                  Cere ofertă
                </Btn>
              </Hl>
              {!magazin && !on('cereri_oferta') && (
                <Btn onClick={() => mergi({ p: 'contact' }, 'contact')} className={`rounded-xl ${VERDE} px-6 py-3 text-sm font-semibold text-white`}>
                  Întreabă-ne
                </Btn>
              )}
            </div>

            {on('cereri_oferta') && d.ui.cerere === i && (
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3">
                {d.ui.cerereTrimisa === i ? (
                  <Confirmare>Cererea a ajuns la noi. Primești oferta azi.</Confirmare>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-700">Cerere de ofertă: {P.nume}</p>
                    <Camp text="Firma / numele tău" />
                    <Camp text="Cantitatea dorită" />
                    <Btn onClick={() => d.set('cerereTrimisa', i)} className={`rounded-lg ${VERDE} px-4 py-2 text-xs font-semibold text-white`}>
                      Trimite cererea
                    </Btn>
                  </>
                )}
              </div>
            )}

            {magazin && PACHET_DEMO.produse.includes(i) && (
              <Hl k="pachete_produse">
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#2f8d5b] bg-emerald-50 p-3 text-xs text-emerald-800">
                  <span className="flex-1">
                    Face parte din <b>{PACHET_DEMO.nume}</b>: 3 produse la {lei(PACHET_DEMO.pret)} în loc de {lei(pachetTotal)}.
                  </span>
                  <Btn
                    onClick={() => d.adaugaInCos({ id: 'pachet', nume: PACHET_DEMO.nume, i: -1, pret: PACHET_DEMO.pret })}
                    className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white"
                  >
                    Adaugă pachetul
                  </Btn>
                </div>
              </Hl>
            )}
            <p className="text-sm leading-relaxed text-slate-600">{P.descriere}</p>
          </div>
        </div>
      </section>

      <Hl k="recenzii" className={`${s} border-t border-slate-100`} fara_eticheta>
        <div data-ancora="recenzii">
          <Titlu sub="Doar de la cei care au cumpărat.">Recenzii</Titlu>
          <Testimoniale mobil={mobil} />
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            {d.ui.recenzieTrimisa ? (
              <Confirmare>Mulțumim! Recenzia apare după ce o aprobă magazinul.</Confirmare>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-800">Scrie o recenzie</p>
                <Stele n={nota} onAlege={(n) => d.set('nota', n)} />
                <Camp text="Cum ți s-a părut?" inalt />
                <Btn onClick={() => d.set('recenzieTrimisa', true)} className={`self-start rounded-lg ${VERDE} px-4 py-2 text-xs font-semibold text-white`}>
                  Trimite recenzia
                </Btn>
              </div>
            )}
          </div>
        </div>
      </Hl>

      <section className={`${s} border-t border-slate-100`}>
        <Titlu>S-ar putea să-ți placă</Titlu>
        <GrilaProduse lista={intrari} mobil={mobil} />
      </section>
    </>
  )
}

const OPTIUNI_PLATA: { k: PluginKey; nume: string; detaliu: string }[] = [
  { k: 'plata_bt', nume: 'Card · Banca Transilvania', detaliu: 'rate fără dobândă și puncte STAR' },
  { k: 'plata_stripe', nume: 'Card · Stripe', detaliu: 'Apple Pay și Google Pay' },
  { k: 'plata_euplatesc', nume: 'Card · EuPlătesc', detaliu: 'orice card, orice bancă' },
]

const Radio = ({ ales, onClick, children }: { ales: boolean; onClick: () => void; children: ReactNode }) => (
  <Btn
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs ${ales ? 'border-[#2f8d5b] bg-emerald-50 text-slate-800' : 'border-slate-200 text-slate-700'}`}
  >
    <span className={`h-3 w-3 shrink-0 rounded-full ${ales ? 'border-4 border-[#2f8d5b]' : 'border border-slate-400'}`} />
    {children}
  </Btn>
)

const LiniaCos = ({ x }: { x: CosItem }) => {
  const d = useDemo()
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      {x.i >= 0 ? (
        <Poza i={x.i} className="h-12 w-12 shrink-0 rounded-lg [&_svg]:h-6 [&_svg]:w-6" />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-lg">🎁</span>
      )}
      <span className="min-w-0 flex-1">
        <Btn onClick={() => x.i >= 0 && d.deschide({ p: 'produs', i: x.i })} className="block text-left text-sm font-medium text-slate-800">
          {x.nume}
        </Btn>
        {x.nota && <span className="text-[11px] text-amber-600">{x.nota}</span>}
      </span>
      <span className="inline-flex items-center rounded-lg border border-slate-200">
        <Btn onClick={() => d.schimbaCantitate(x.id, -1)} className="px-2 py-1.5" label="Mai puțin">
          <Minus className="h-3 w-3" />
        </Btn>
        <span className="w-5 text-center text-xs font-semibold">{x.n}</span>
        <Btn onClick={() => d.schimbaCantitate(x.id, 1)} className="px-2 py-1.5" label="Mai mult">
          <Plus className="h-3 w-3" />
        </Btn>
      </span>
      <span className="w-16 text-right text-sm font-semibold text-slate-900">{lei(x.pret * x.n)}</span>
      <Btn onClick={() => d.scoate(x.id)} label="Scoate" className="text-slate-400 hover:text-rose-500">
        <Trash2 className="h-4 w-4" />
      </Btn>
    </div>
  )
}

const PaginaCos = ({ mobil, s }: { mobil: boolean; s: string }) => {
  const d = useDemo()
  const { on } = useCms()
  const fan = on('livrare_fan')
  const procesatoare = OPTIUNI_PLATA.filter((p) => on(p.k))
  const plata = procesatoare.some((p) => p.k === d.ui.plata) || d.ui.plata === 'ramburs' ? String(d.ui.plata) : (procesatoare[0]?.k ?? 'ramburs')
  const livrare = fan && d.ui.livrare === 'fanbox' ? 'fanbox' : 'adresa'
  const subtotal = d.cos.reduce((t, x) => t + x.pret * x.n, 0)
  const cupon = on('cupoane') && d.ui.cupon ? String(d.ui.cupon) : ''
  const reducereCupon = cupon ? Math.round(subtotal * 0.1) : 0
  const puncte = on('fidelitate') && d.ui.puncte ? 12 : 0
  const transport = livrare === 'fanbox' ? 9 : fan ? 15 : 20
  const total = Math.max(0, subtotal - reducereCupon - puncte) + transport

  if (!d.cos.length) {
    return (
      <section className={`${s} text-center`}>
        <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-lg font-semibold text-slate-900">Coșul e gol</p>
        <Btn onClick={() => d.deschide({ p: 'produse' })} className={`mt-4 rounded-xl ${VERDE} px-5 py-3 text-sm font-semibold text-white`}>
          Vezi produsele
        </Btn>
      </section>
    )
  }

  return (
    <section className={`bg-slate-50/60 ${s}`}>
      <Titlu sub="Verifică produsele și alege livrarea și plata.">Coșul tău</Titlu>
      <div className={`grid gap-5 ${mobil ? 'grid-cols-1' : 'grid-cols-[1fr_340px]'}`}>
        <div className="flex flex-col gap-3">
          <Hl k="conturi_clienti">
            {d.ui.logat ? (
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Comanzi ca <b>Ana M.</b> · adresa e completată din cont.
              </p>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <span>Ai cont? Comanzi mai repede.</span>
                <Btn
                  onClick={() => {
                    d.set('logat', true)
                    d.notifica('Bună, Ana! Ai intrat în cont.')
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Intră cu Google
                </Btn>
              </div>
            )}
          </Hl>
          {d.cos.map((x) => (
            <LiniaCos key={x.id} x={x} />
          ))}
          {!d.cos.some((x) => x.id === 'pachet') && (
            <Hl k="pachete_produse" fara_eticheta>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#2f8d5b] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span className="flex-1">
                  Ia tot <b>{PACHET_DEMO.nume}</b>: 3 produse la {lei(PACHET_DEMO.pret)}.
                </span>
                <Btn
                  onClick={() => d.adaugaInCos({ id: 'pachet', nume: PACHET_DEMO.nume, i: -1, pret: PACHET_DEMO.pret })}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Adaugă
                </Btn>
              </div>
            </Hl>
          )}
          <Btn onClick={() => d.deschide({ p: 'produse' })} className="self-start text-sm font-semibold text-[#2f8d5b]">
            ← Continuă cumpărăturile
          </Btn>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Livrare</p>
          {fan ? (
            <>
              <Hl k="livrare_fan" fara_eticheta>
                <Radio ales={livrare === 'adresa'} onClick={() => d.set('livrare', 'adresa')}>
                  <span className="flex-1">FAN Courier la adresă</span>
                  <b>15 lei</b>
                </Radio>
              </Hl>
              <Hl k="livrare_fan">
                <Radio ales={livrare === 'fanbox'} onClick={() => d.set('livrare', 'fanbox')}>
                  <span className="flex-1">FANbox lângă tine</span>
                  <b>9 lei</b>
                </Radio>
              </Hl>
            </>
          ) : (
            <Radio ales onClick={() => undefined}>
              <span className="flex-1">Curier la adresă</span>
              <b>20 lei</b>
            </Radio>
          )}

          <p className="mt-1 text-sm font-semibold text-slate-900">Plata</p>
          <Radio ales={plata === 'ramburs'} onClick={() => d.set('plata', 'ramburs')}>
            Ramburs, la curier
          </Radio>
          {OPTIUNI_PLATA.map((p) => (
            <Hl key={p.k} k={p.k}>
              <Radio ales={plata === p.k} onClick={() => d.set('plata', p.k)}>
                <span>
                  {p.nume}
                  <span className="block text-[10px] text-slate-500">{p.detaliu}</span>
                </span>
              </Radio>
            </Hl>
          ))}

          <Hl k="cupoane">
            {cupon ? (
              <p className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <span>
                  Codul <b>{cupon}</b> e aplicat: −10%
                </span>
                <Btn onClick={() => d.set('cupon', '')} label="Scoate codul">
                  <X className="h-3.5 w-3.5" />
                </Btn>
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  value={String(d.ui.codCupon ?? '')}
                  onChange={(e) => d.set('codCupon', e.target.value)}
                  placeholder="Cod de reducere (ex. BUN10)"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                />
                <Btn
                  onClick={() => d.set('cupon', String(d.ui.codCupon || 'BUN10').toUpperCase())}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
                >
                  Aplică
                </Btn>
              </div>
            )}
          </Hl>
          <Hl k="fidelitate" fara_eticheta>
            <Btn onClick={() => d.set('puncte', !d.ui.puncte)} className="flex w-full items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-left text-xs text-violet-700">
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${d.ui.puncte ? 'border-violet-600 bg-violet-600 text-white' : 'border-violet-300 bg-white'}`}>
                {d.ui.puncte ? '✓' : ''}
              </span>
              Folosește cele 120 de puncte: −12 lei
            </Btn>
          </Hl>

          <div className="mt-1 flex flex-col gap-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <p className="flex justify-between">
              Produse <span>{lei(subtotal)}</span>
            </p>
            {reducereCupon > 0 && (
              <p className="flex justify-between text-emerald-600">
                Cod de reducere <span>−{lei(reducereCupon)}</span>
              </p>
            )}
            {puncte > 0 && (
              <p className="flex justify-between text-violet-600">
                Puncte <span>−{lei(puncte)}</span>
              </p>
            )}
            <p className="flex justify-between">
              Livrare <span>{lei(transport)}</span>
            </p>
            <p className="mt-1 flex items-center justify-between text-sm">
              <span className="text-slate-600">Total</span>
              <b className="text-lg text-slate-900">{lei(total)}</b>
            </p>
          </div>
          <Btn
            onClick={() => {
              const p = OPTIUNI_PLATA.find((x) => x.k === plata)
              d.set('comanda', JSON.stringify({ total, plata: p ? p.nume : 'ramburs', fan, livrare, puncte: Math.round(subtotal) }))
              d.golesteCos()
              d.deschide({ p: 'gata' })
            }}
            className={`rounded-lg ${VERDE} px-3 py-2.5 text-center text-sm font-semibold text-white`}
          >
            Trimite comanda · {lei(total)}
          </Btn>
        </div>
      </div>
    </section>
  )
}

const PaginaGata = ({ s }: { s: string }) => {
  const d = useDemo()
  const { on } = useCms()
  const c = JSON.parse(String(d.ui.comanda ?? '{}')) as {
    total?: number
    plata?: string
    fan?: boolean
    livrare?: string
    puncte?: number
  }
  const card = c.plata && c.plata !== 'ramburs'
  return (
    <section className={`${s} text-center`}>
      <CircleCheck className="mx-auto h-14 w-14 text-[#2f8d5b]" />
      <h2 className="mt-3 text-2xl font-bold text-slate-900">Mulțumim! Comanda #1043 a fost trimisă.</h2>
      <div className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left text-sm text-slate-600">
        <p>
          💳{' '}
          {card
            ? c.plata?.includes('Banca Transilvania')
              ? 'Plata cu cardul a reușit: suma s-a blocat pe card și se încasează când pleacă coletul.'
              : `Plata cu cardul (${c.plata?.replace('Card · ', '')}) a reușit.`
            : `Plătești ${lei(c.total ?? 0)} la curier, ramburs.`}
        </p>
        <p>
          🚚{' '}
          {c.fan
            ? c.livrare === 'fanbox'
              ? 'Coletul ajunge în FANbox-ul ales. Primești codul de deschidere pe SMS.'
              : 'Primești pe email AWB-ul FAN Courier, ca să urmărești coletul.'
            : 'Te sună curierul înainte să ajungă.'}
        </p>
        {on('fidelitate') && <p>💎 Ai câștigat {c.puncte ?? 0} puncte de fidelitate.</p>}
        <p>📧 Ți-am trimis confirmarea pe email.</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Btn onClick={() => d.deschide({ p: 'produse' })} className={`rounded-xl ${VERDE} px-5 py-3 text-sm font-semibold text-white`}>
          Înapoi în magazin
        </Btn>
        {on('conturi_clienti') && (
          <Btn onClick={() => d.deschide({ p: 'cont' })} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Vezi comanda în cont
          </Btn>
        )}
      </div>
    </section>
  )
}

const PaginaBlog = ({ mobil, s }: { mobil: boolean; s: string }) => (
  <Hl k="blog" className={s}>
    <Titlu sub="Sfaturi, rețete și noutăți.">Blog</Titlu>
    <ArticoleBlog mobil={mobil} lista={[0, 1, 2]} />
  </Hl>
)

const PaginaArticol = ({ i, mobil, s }: { i: number; mobil: boolean; s: string }) => {
  const d = useDemo()
  const A = ARTICOLE[i]
  return (
    <section className={s}>
      <Btn onClick={() => d.deschide({ p: 'blog' })} className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2f8d5b]">
        <ArrowLeft className="h-3.5 w-3.5" /> Blog
      </Btn>
      <p className="text-xs text-slate-400">12 noiembrie · 4 min · de Maria</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{A.titlu}</h2>
      <div className={`mt-5 h-48 rounded-3xl bg-gradient-to-br ${A.fundal}`} />
      <div className="mt-5 flex max-w-2xl flex-col gap-3 text-sm leading-relaxed text-slate-600">
        <p>{A.rezumat}</p>
        <p>
          Îți spunem pe scurt ce am învățat de la producătorii cu care lucrăm și ce funcționează pentru noi acasă. Nu e sfat
          medical, ci experiența noastră.
        </p>
        <p>Dacă ai întrebări, scrie-ne: răspundem în aceeași zi.</p>
      </div>
      <div className="mt-8 border-t border-slate-100 pt-6">
        <Titlu>Citește și</Titlu>
        <ArticoleBlog mobil={mobil} lista={[0, 1, 2].filter((x) => x !== i)} />
      </div>
    </section>
  )
}

const PaginaContact = ({ mobil, s }: { mobil: boolean; s: string }) => (
  <section className={s}>
    <SectiuneContact mobil={mobil} />
  </section>
)

const PaginaCont = ({ mobil, s }: { mobil: boolean; s: string }) => {
  const d = useDemo()
  const { on, pachet } = useCms()
  const intra = () => {
    d.set('logat', true)
    d.notifica('Bună, Ana! Ai intrat în cont.')
  }
  if (!d.ui.logat) {
    return (
      <Hl k="conturi_clienti" className={s}>
        <div className="mx-auto flex max-w-sm flex-col gap-3 rounded-3xl border border-slate-200 p-6">
          <p className="text-xl font-semibold text-slate-900">Intră în cont</p>
          <Camp text="Email" />
          <Camp text="Parola" />
          <Btn onClick={intra} className={`rounded-lg ${VERDE} px-4 py-2.5 text-sm font-semibold text-white`}>
            Intră
          </Btn>
          <Btn onClick={intra} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">
            <span className="font-bold text-[#4285f4]">G</span> Intră cu Google
          </Btn>
          <p className="text-center text-xs text-slate-500">Nu ai cont? Îl faci în 10 secunde.</p>
        </div>
      </Hl>
    )
  }
  const comenzi = d.ui.comanda ? ['#1043 · trimisă azi', '#1038 · livrată', '#1021 · livrată'] : ['#1038 · livrată', '#1021 · livrată']
  return (
    <Hl k="conturi_clienti" className={s}>
      <div className="flex items-center justify-between">
        <Titlu sub="ana@exemplu.ro">Bună, Ana!</Titlu>
        <Btn onClick={() => d.set('logat', false)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
          <LogOut className="h-3.5 w-3.5" /> Ieși
        </Btn>
      </div>
      <div className={`grid gap-4 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {pachet === 'magazin' && (
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Comenzile mele</p>
            {comenzi.map((c) => (
              <p key={c} className="mt-2 text-xs text-slate-600">
                {c}
              </p>
            ))}
          </div>
        )}
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Adrese</p>
          <p className="mt-2 text-xs text-slate-600">Str. Florilor 1, Cluj-Napoca</p>
        </div>
        {on('fidelitate') && (
          <Hl k="fidelitate" fara_eticheta>
            <div className="h-full rounded-2xl bg-violet-50 p-4">
              <p className="text-sm font-semibold text-violet-800">Puncte de fidelitate</p>
              <p className="mt-1 text-2xl font-bold text-violet-700">120</p>
              <p className="text-xs text-violet-600">= 12 lei la următoarea comandă</p>
            </div>
          </Hl>
        )}
        {on('membri') && (
          <Hl k="membri" fara_eticheta>
            <div className="h-full rounded-2xl bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-800">Membru</p>
              <p className="mt-1 text-xs text-indigo-700">{d.ui.membru ? 'Activ, până în noiembrie 2027' : 'Nu ești încă membru'}</p>
            </div>
          </Hl>
        )}
      </div>
    </Hl>
  )
}

const DOCUMENTE = ['Ghidul membrului 2026.pdf', 'Procesul-verbal al adunării.pdf', 'Calendarul evenimentelor.pdf']

const PaginaMembri = ({ mobil, s }: { mobil: boolean; s: string }) => {
  const d = useDemo()
  const cotizatie = String(d.ui.cotizatie ?? '12 luni')
  if (!d.ui.membru) {
    return (
      <Hl k="membri" className={s}>
        <div className="rounded-3xl bg-indigo-50 p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-indigo-500" />
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Zona membrilor</h2>
          <p className="mt-1 text-sm text-slate-600">Documente, evenimente și pagini doar pentru membri.</p>
          <div className={`mx-auto mt-6 grid max-w-xl gap-3 ${mobil ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {[
              ['1 lună', '30 lei'],
              ['6 luni', '160 lei'],
              ['12 luni', '300 lei'],
            ].map(([p, v]) => (
              <Btn
                key={p}
                onClick={() => d.set('cotizatie', p)}
                className={`rounded-2xl border bg-white p-4 ${cotizatie === p ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-indigo-100'}`}
              >
                <span className="block text-xs text-slate-500">{p}</span>
                <span className="block text-lg font-bold text-slate-900">{v}</span>
              </Btn>
            ))}
          </div>
          <Btn
            onClick={() => {
              d.set('membru', true)
              d.set('logat', true)
              d.notifica('Bun venit! Ești membru.')
            }}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Înscrie-te și plătește cotizația ({cotizatie})
          </Btn>
        </div>
      </Hl>
    )
  }
  return (
    <Hl k="membri" className={s}>
      <Titlu sub={`Cotizație plătită: ${cotizatie}.`}>Bun venit în zona membrilor</Titlu>
      <div className="flex flex-col gap-2">
        {DOCUMENTE.map((doc) => (
          <div key={doc} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
            <FileText className="h-5 w-5 text-indigo-500" />
            <span className="flex-1">{doc}</span>
            <Btn onClick={() => d.notifica(`Descărcat: ${doc}`)} label={`Descarcă ${doc}`} className="text-slate-500">
              <Download className="h-4 w-4" />
            </Btn>
          </div>
        ))}
      </div>
    </Hl>
  )
}

// ── Site-ul ──────────────────────────────────────────────────────────────────────

interface MockSiteProps {
  mobil: boolean
}

const MockSite = ({ mobil }: MockSiteProps) => {
  const d = useDemo()
  const { on, pachet } = useCms()
  const mergi = useMergi()
  const s = mobil ? 'px-5 py-8' : 'px-10 py-12'
  const pg = d.pagina

  let continut: ReactNode
  switch (pg.p) {
    case 'despre':
      continut = <PaginaDespre mobil={mobil} s={s} />
      break
    case 'produse':
      continut = <PaginaProduse mobil={mobil} s={s} />
      break
    case 'produs':
      continut = <PaginaProdus key={pg.i} i={pg.i} mobil={mobil} s={s} />
      break
    case 'cos':
      continut = <PaginaCos mobil={mobil} s={s} />
      break
    case 'gata':
      continut = <PaginaGata s={s} />
      break
    case 'blog':
      continut = <PaginaBlog mobil={mobil} s={s} />
      break
    case 'articol':
      continut = <PaginaArticol key={pg.i} i={pg.i} mobil={mobil} s={s} />
      break
    case 'contact':
      continut = <PaginaContact mobil={mobil} s={s} />
      break
    case 'cont':
      continut = <PaginaCont mobil={mobil} s={s} />
      break
    case 'membri':
      continut = <PaginaMembri mobil={mobil} s={s} />
      break
    default:
      continut = <PaginaAcasa mobil={mobil} s={s} />
  }

  return (
    <div data-ancora="sus" className="relative min-h-full bg-white font-sans text-slate-700 antialiased">
      <Hl k="campanii">
        <Btn
          onClick={() => on('catalog') && mergi({ p: 'produse' }, 'produse')}
          className="block w-full bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white"
        >
          🔥 Black Friday: <b className="text-rose-400">-20% la tot</b>, până duminică la miezul nopții
        </Btn>
      </Hl>

      <Antet mobil={mobil} />

      {continut}

      <Hl k="newsletter" className={s}>
        <div className={`flex items-center gap-4 rounded-3xl bg-slate-900 p-6 text-white ${mobil ? 'flex-col items-start' : ''}`}>
          <Mail className="h-8 w-8 text-emerald-300" />
          <div className="flex-1">
            <p className="text-lg font-semibold">Abonează-te la noutăți</p>
            <p className="text-sm text-slate-400">Oferte și sfaturi, o dată pe săptămână.</p>
          </div>
          {d.ui.abonat ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <CircleCheck className="h-4 w-4" /> Te-ai abonat. Verifică-ți emailul.
            </p>
          ) : (
            <div className="flex w-full max-w-xs gap-2">
              <span className="flex-1 rounded-lg bg-white/10 px-3 py-2.5 text-xs text-slate-400">emailul tău</span>
              <Btn onClick={() => d.set('abonat', true)} className="rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-900">
                Abonare
              </Btn>
            </div>
          )}
        </div>
      </Hl>

      <footer className={`flex flex-wrap items-center gap-x-5 gap-y-2 bg-slate-50 text-xs text-slate-400 ${mobil ? 'px-5 py-6' : 'px-10 py-8'}`}>
        <span>© Firma Ta</span>
        <Btn onClick={() => mergi({ p: 'contact' }, 'contact')}>Contact</Btn>
        {pachet === 'magazin' && <span>Livrare și retur</span>}
        <span>Termeni</span>
        <span>Confidențialitate</span>
        <span>ANPC</span>
      </footer>
    </div>
  )
}

/** Fereastra de chat stă peste site, în colț, nu în pagină. */
export const BulaChat = () => {
  const d = useDemo()
  const deschis = Boolean(d.ui.chat)
  return (
    <Hl k="chat_live" className="absolute bottom-4 right-4 z-20">
      {deschis ? (
        <div className="flex w-64 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className={`flex items-center justify-between ${VERDE} px-3 py-2 text-xs font-semibold text-white`}>
            Firma Ta · online
            <Btn onClick={() => d.set('chat', false)} label="Închide chatul">
              <X className="h-3.5 w-3.5" />
            </Btn>
          </div>
          <div className="flex flex-col gap-2 p-3 text-xs">
            <p className="self-start rounded-xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-700">Bună! Te pot ajuta cu ceva? 👋</p>
            {d.ui.chatTrimis && (
              <>
                <p className="self-end rounded-xl rounded-br-sm bg-emerald-600 px-3 py-2 text-white">Când ajunge comanda?</p>
                <p className="self-start rounded-xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-700">Mâine, cu FAN Courier. 🙂</p>
              </>
            )}
          </div>
          <div className="flex gap-2 border-t border-slate-100 p-2">
            <span className="flex-1 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-400">Scrie un mesaj…</span>
            <Btn onClick={() => d.set('chatTrimis', true)} label="Trimite" className={`rounded-lg ${VERDE} px-2 text-white`}>
              <Send className="h-3.5 w-3.5" />
            </Btn>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <span className="max-w-[180px] rounded-2xl rounded-br-sm bg-white px-3 py-2 text-xs text-slate-700 shadow-lg">
            Bună! Te pot ajuta cu ceva? 👋
          </span>
          <Btn onClick={() => d.set('chat', true)} label="Deschide chatul" className={`flex h-12 w-12 items-center justify-center rounded-full ${VERDE} shadow-lg`}>
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
              <path d="M4 4h16v11H8l-4 4z" />
            </svg>
          </Btn>
        </div>
      )}
    </Hl>
  )
}

/** Panoul lateral „Oferte” (loturile cu termen scurt), lipit de marginea site-ului. */
export const PanouOferte = () => {
  const d = useDemo()
  return (
    <Hl k="oferte_bbd" className="absolute right-0 top-1/3 z-20" fara_eticheta>
      <Btn
        onClick={() => {
          d.set('lot', 'scurt')
          d.deschide({ p: 'produs', i: 1 })
        }}
        className="block rounded-l-xl bg-amber-500 px-2 py-4 text-xs font-bold text-white shadow-lg [writing-mode:vertical-rl]"
      >
        Oferte -30%
      </Btn>
    </Hl>
  )
}

/** Mesajul scurt de jos („Adăugat în coș”, „Te-ai abonat”…). */
export const NotificareDemo = () => {
  const d = useDemo()
  const { pachet } = useCms()
  return d.notificare ? (
    <div className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-center px-4">
      <p className="pointer-events-auto flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-xs text-white shadow-xl">
        <CircleCheck className="h-4 w-4 text-emerald-400" />
        {d.notificare}
        {pachet === 'magazin' && d.notificare.startsWith('Adăugat') && (
          <button type="button" onClick={() => d.deschide({ p: 'cos' })} className="font-semibold text-emerald-300 underline">
            Vezi coșul
          </button>
        )}
      </p>
    </div>
  ) : null
}

export default MockSite
