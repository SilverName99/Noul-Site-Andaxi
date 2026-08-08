import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'ACASĂ' },
  { to: '/erp', label: 'ANDAXI ERP' },
  { to: '/crm', label: 'ANDAXI CRM' },
]

const linkClass = (isActive: boolean) =>
  `text-sm transition-colors duration-200 hover:text-[color:var(--text-1)] ${
    isActive ? 'text-[color:var(--text-1)]' : 'text-[color:var(--text-2)]'
  }`

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Andaxi" className="h-11 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 rounded-full border border-[color:var(--border)] bg-[color:var(--pill-bg)] px-6 py-2.5 backdrop-blur-md lg:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => linkClass(isActive)}>
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) => `flex items-center gap-1 ${linkClass(isActive)}`}
          >
            CONTACT
            <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="text-[color:var(--text-1)] lg:hidden"
          aria-label="Deschide meniul"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mx-6 flex flex-col gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--menu-bg)] p-6 backdrop-blur-md lg:hidden">
          {[...NAV_LINKS, { to: '/contact', label: 'CONTACT' }].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => linkClass(isActive && location.pathname === to)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar
