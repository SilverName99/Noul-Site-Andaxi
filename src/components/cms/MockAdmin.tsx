import type { ReactNode } from 'react'
import {
  ChartColumn,
  ClipboardList,
  Cloud,
  FileText,
  Folder,
  Gift,
  LayoutDashboard,
  Mail,
  Megaphone,
  Network,
  Newspaper,
  Package,
  Scale,
  Settings,
  Star,
  TicketPercent,
  Users,
} from 'lucide-react'
import { Hl, useCms } from './Hl'
import type { PluginKey } from '../../data/cmsPlugins'

/**
 * Panoul de administrare de probă: meniul crește cu plugin-urile pornite, iar
 * cele care se văd doar în admin (statistici, ERP, link de plată…) își au aici
 * cutia lor.
 */

const Cutie = ({ titlu, children, className = '' }: { titlu: string; children: ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>
    <p className="mb-3 text-sm font-semibold text-slate-900">{titlu}</p>
    {children}
  </div>
)

const MENIU: { k?: PluginKey; magazin?: boolean; nume: string; icon: typeof Package }[] = [
  { nume: 'Acasă', icon: LayoutDashboard },
  { nume: 'Pagini', icon: FileText },
  { k: 'catalog', nume: 'Produse', icon: Package },
  { magazin: true, nume: 'Comenzi', icon: ClipboardList },
  { k: 'conturi_clienti', nume: 'Clienți', icon: Users },
  { k: 'blog', nume: 'Blog', icon: Newspaper },
  { k: 'newsletter', nume: 'Newsletter', icon: Mail },
  { k: 'campanii', nume: 'Campanii', icon: Megaphone },
  { k: 'cupoane', nume: 'Cupoane', icon: TicketPercent },
  { k: 'recenzii', nume: 'Recenzii', icon: Star },
  { k: 'produse_promo', nume: 'Promoționale', icon: Gift },
  { k: 'statistici', nume: 'Statistici', icon: ChartColumn },
  { k: 'concurenta', nume: 'Concurență', icon: Scale },
  { k: 'fisiere_cloud', nume: 'Fișiere', icon: Cloud },
  { k: 'erp', nume: 'ERP', icon: Network },
  { nume: 'Setări', icon: Settings },
]

const COMENZI = [
  { nr: '1042', client: 'Ana M.', suma: '62 lei', stare: 'Plătită', culoare: 'bg-emerald-100 text-emerald-700' },
  { nr: '1041', client: 'Radu P.', suma: '118 lei', stare: 'Plata a eșuat', culoare: 'bg-rose-100 text-rose-700' },
  { nr: '1040', client: 'Ioana T.', suma: '45 lei', stare: 'Ramburs', culoare: 'bg-sky-100 text-sky-700' },
]

const MockAdmin = ({ mobil }: { mobil: boolean }) => {
  const { on, pachet } = useCms()
  const magazin = pachet === 'magazin'

  const meniu = MENIU.filter((m) => !m.magazin || magazin)

  return (
    <div className={`flex min-h-full bg-slate-100 font-sans text-slate-700 antialiased ${mobil ? 'flex-col' : ''}`}>
      {/* Meniul */}
      <aside
        className={`shrink-0 bg-[#0f1b2d] text-slate-300 ${
          mobil ? 'flex gap-3 overflow-hidden px-4 py-3 text-xs' : 'flex w-52 flex-col gap-1 px-3 py-5 text-sm'
        }`}
      >
        {!mobil && <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-white">Firma Ta · admin</p>}
        {meniu.map((m) => {
          const rand = (
            <span
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg ${mobil ? '' : 'px-2 py-1.5'} ${
                m.nume === 'Acasă' ? 'bg-white/10 text-white' : ''
              }`}
            >
              <m.icon className="h-4 w-4 shrink-0" />
              {m.nume}
            </span>
          )
          return m.k ? (
            <Hl key={m.nume} k={m.k} fara_eticheta inline={mobil}>
              {rand}
            </Hl>
          ) : (
            <span key={m.nume}>{rand}</span>
          )
        })}
      </aside>

      {/* Tabloul */}
      <main className={`flex flex-1 flex-col gap-4 ${mobil ? 'p-4' : 'p-6'}`}>
        <div>
          <p className="text-xl font-semibold text-slate-900">Bună dimineața! 👋</p>
          <p className="text-sm text-slate-500">Ce s-a întâmplat pe site de ieri.</p>
        </div>

        <div className={`grid gap-4 ${mobil ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {[
            ['Vizite azi', '1.284'],
            magazin ? ['Comenzi azi', '23'] : ['Mesaje noi', '7'],
            magazin ? ['Vânzări azi', '2.940 lei'] : ['Pagini', '7'],
            ['Formulare', '5'],
          ].map(([t, v]) => (
            <div key={t} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{t}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{v}</p>
            </div>
          ))}
        </div>

        <Hl k="statistici">
          <Cutie titlu="Vizitatori pe ore, azi">
            <div className="flex h-28 items-end gap-1.5">
              {[12, 18, 9, 14, 22, 35, 48, 41, 56, 72, 64, 88, 95, 70, 58, 66, 80, 61].map((h, i) => (
                <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-sky-300" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              {[
                ['Google', 'bg-blue-100 text-blue-700', '42%'],
                ['TikTok', 'bg-slate-900 text-white', '27%'],
                ['Facebook', 'bg-indigo-100 text-indigo-700', '18%'],
                ['Instagram', 'bg-pink-100 text-pink-700', '13%'],
              ].map(([n, c, v]) => (
                <span key={n} className={`rounded-full px-2.5 py-1 font-semibold ${c}`}>
                  {n} · {v}
                </span>
              ))}
            </div>
          </Cutie>
        </Hl>

        {magazin && (
          <Cutie titlu="Ultimele comenzi">
            <div className="flex flex-col divide-y divide-slate-100">
              {COMENZI.map((c, i) => (
                <div key={c.nr} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 text-sm">
                  <b className="w-12 text-slate-900">#{c.nr}</b>
                  <span className="flex-1">{c.client}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.culoare}`}>{c.stare}</span>
                  <Hl k="erp" inline fara_eticheta={i > 0}>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      ERP: trimisă ✓
                    </span>
                  </Hl>
                  <b className="w-16 text-right text-slate-900">{c.suma}</b>
                  {i === 0 && (
                    <Hl k="produse_promo" inline>
                      <span className="rounded-lg border border-slate-200 px-2 py-1 text-[11px]">🎁 Mostră ceai</span>
                    </Hl>
                  )}
                  {i === 1 && (
                    <Hl k="link_plata" inline>
                      <span className="rounded-lg bg-[#2f8d5b] px-2.5 py-1 text-[11px] font-semibold text-white">
                        💳 Trimite link de plată
                      </span>
                    </Hl>
                  )}
                </div>
              ))}
            </div>
          </Cutie>
        )}

        <div className={`grid gap-4 ${mobil ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <Hl k="erp" fara_eticheta>
            <Cutie titlu="ANDAXI ERP" className="h-full">
              <p className="text-sm text-slate-600">Stocul s-a sincronizat acum 2 minute.</p>
              <p className="mt-2 text-sm text-slate-600">23 de comenzi trimise azi · 21 facturate.</p>
            </Cutie>
          </Hl>
          <Hl k="concurenta">
            <Cutie titlu="Prețurile concurenței" className="h-full">
              {[
                ['Miere polifloră', '29 lei', '32 lei', true],
                ['Ulei de cânepă', '45 lei', '41 lei', false],
              ].map(([p, noi, ei, ieftin]) => (
                <div key={p as string} className="flex items-center justify-between py-1 text-sm">
                  <span>{p}</span>
                  <span>
                    <b className="text-slate-900">{noi}</b>
                    <span className={`ml-2 text-xs font-semibold ${ieftin ? 'text-emerald-600' : 'text-rose-600'}`}>ei: {ei}</span>
                  </span>
                </div>
              ))}
            </Cutie>
          </Hl>
          <Hl k="fisiere_cloud">
            <Cutie titlu="Fișiere în cloud" className="h-full">
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                {['Contracte 🔒', 'Facturi', 'Marketing'].map((f) => (
                  <span key={f} className="rounded-xl bg-slate-50 px-2 py-3">
                    <Folder className="mx-auto mb-1 h-6 w-6 text-amber-400" fill="currentColor" />
                    {f}
                  </span>
                ))}
              </div>
            </Cutie>
          </Hl>
          {!on('statistici') && !magazin && (
            <Cutie titlu="Pagini" className="h-full">
              {['Acasă', 'Despre noi', 'Contact'].map((p) => (
                <div key={p} className="flex justify-between py-1 text-sm">
                  {p}
                  <span className="text-xs text-emerald-600">publicată</span>
                </div>
              ))}
            </Cutie>
          )}
        </div>
      </main>
    </div>
  )
}

export default MockAdmin
