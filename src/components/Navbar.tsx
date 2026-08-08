import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Acasă' },
  { to: '/erp', label: 'ANDAXI ERP' },
]

const linkClass = (isActive: boolean) =>
  `text-sm transition-colors duration-200 hover:text-white ${
    isActive ? 'text-white' : 'text-white/80'
  }`

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
            <span className="h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-lg font-medium text-white">Andaxi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 rounded-full border border-gray-700 bg-black/30 px-6 py-2.5 backdrop-blur-md lg:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => linkClass(isActive)}>
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center gap-1 ${linkClass(isActive)}`
            }
          >
            Contact
            <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="text-white lg:hidden"
          aria-label="Deschide meniul"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mx-6 flex flex-col gap-4 rounded-2xl border border-gray-700 bg-black/85 p-6 backdrop-blur-md lg:hidden">
          {[...NAV_LINKS, { to: '/contact', label: 'Contact' }].map(({ to, label }) => (
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
