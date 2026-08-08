import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

const Footer = () => (
  <footer className="border-t border-white/10 bg-black">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 lg:flex-row lg:items-start lg:justify-between lg:px-8">
      <div className="max-w-sm">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
            <span className="h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-lg font-medium text-white">Andaxi</span>
        </Link>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Web design accesibil și frumos, fără să-ți golească portofelul.
          Pentru noi, web design-ul e simplu: de la oameni, către oameni.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-wider text-white/40">Navigare</span>
        <Link to="/" className="text-sm text-white/70 transition-colors hover:text-white">
          Acasă
        </Link>
        <Link to="/erp" className="text-sm text-white/70 transition-colors hover:text-white">
          ANDAXI ERP
        </Link>
        <Link to="/contact" className="text-sm text-white/70 transition-colors hover:text-white">
          Contact
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-wider text-white/40">Contact</span>
        <a
          href="tel:+40755885973"
          className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <Phone className="h-4 w-4" />
          0755 885 973
        </a>
        <span className="text-sm text-white/50">România · Grecia</span>
      </div>
    </div>

    <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
      © {new Date().getFullYear()} Andaxi. Toate drepturile rezervate.
    </div>
  </footer>
)

export default Footer
