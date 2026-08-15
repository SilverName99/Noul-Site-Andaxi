import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

const Footer = () => (
  <footer className="border-t border-[color:var(--border)] bg-[color:var(--bg)]">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 lg:flex-row lg:items-start lg:justify-between lg:px-8">
      <div className="max-w-sm">
        <Link to="/" className="inline-flex items-center">
          <img src="/logo-mark.png" alt="Andaxi Web Solutions" className="h-14 w-auto" />
        </Link>
        {/* Sloganul ca text real — lizibil la orice dimensiune, spre deosebire
            de varianta încorporată în imagine. */}
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
          Your trusted partner in digital solutions
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-3)]">
          Soluții web, fără să-ți golească portofelul. Motto-ul nostru: de la
          oameni, către oameni.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Navigare</span>
        <Link to="/" className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]">
          ACASĂ
        </Link>
        <Link to="/erp" className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]">
          ANDAXI ERP
        </Link>
        <Link to="/crm" className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]">
          ANDAXI CRM
        </Link>
        <Link to="/preturi" className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]">
          PREȚURI
        </Link>
        <Link to="/contact" className="text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]">
          CONTACT
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-wider text-[color:var(--text-4)]">Contact</span>
        <a
          href="tel:+40755885973"
          className="flex items-center gap-2 text-sm text-[color:var(--text-3)] transition-colors hover:text-[color:var(--text-1)]"
        >
          <Phone className="h-4 w-4" />
          0755 885 973
        </a>
        <span className="text-sm text-[color:var(--text-4)]">România</span>
      </div>
    </div>

    <div className="border-t border-[color:var(--border)] py-6 text-center text-xs text-[color:var(--text-4)]">
      © {new Date().getFullYear()} Andaxi. Toate drepturile rezervate.
    </div>
  </footer>
)

export default Footer
