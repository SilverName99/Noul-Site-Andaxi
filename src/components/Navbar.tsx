import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Acasă' },
  { to: '/erp', label: 'ANDAXI ERP' },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // On the home page the navbar sits over the dark hero video in both
  // themes, so it keeps white styling there; elsewhere it follows the theme.
  const overVideo = location.pathname === '/'

  const linkClass = (isActive: boolean) =>
    overVideo
      ? `text-sm transition-colors duration-200 hover:text-white ${
          isActive ? 'text-white' : 'text-white/80'
        }`
      : `text-sm transition-colors duration-200 hover:text-[color:var(--text-1)] ${
          isActive ? 'text-[color:var(--text-1)]' : 'text-[color:var(--text-2)]'
        }`

  const pillClass = overVideo
    ? 'border-gray-700 bg-black/30'
    : 'border-[color:var(--border)] bg-[color:var(--pill-bg)]'

  const menuClass = overVideo
    ? 'border-gray-700 bg-black/85'
    : 'border-[color:var(--border)] bg-[color:var(--menu-bg)]'

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Andaxi" className="h-11 w-auto" />
        </Link>

        {/* Desktop links */}
        <div
          className={`hidden items-center gap-6 rounded-full border px-6 py-2.5 backdrop-blur-md lg:flex ${pillClass}`}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => linkClass(isActive)}>
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) => `flex items-center gap-1 ${linkClass(isActive)}`}
          >
            Contact
            <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={overVideo ? 'text-white lg:hidden' : 'text-[color:var(--text-1)] lg:hidden'}
          aria-label="Deschide meniul"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className={`mx-6 flex flex-col gap-4 rounded-2xl border p-6 backdrop-blur-md lg:hidden ${menuClass}`}
        >
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
