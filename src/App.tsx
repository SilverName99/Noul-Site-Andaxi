import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeSwitch from './components/ThemeSwitch'
import { ThemeProvider } from './theme'
import PageTransition from './components/motion/PageTransition'
import Home from './pages/Home'
import Erp from './pages/Erp'
import ErpDemo from './pages/ErpDemo'
import Crm from './pages/Crm'
import Preturi from './pages/Preturi'
import Contact from './pages/Contact'

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  const lastPath = useRef<string | null>(null)
  useEffect(() => {
    // Ancorele din aceeași pagină le derulează browserul (lin, din CSS).
    // Aici doar schimbarea de pagină: sus, sau la ancoră (/erp#gestiune).
    if (lastPath.current === pathname) return
    const id = decodeURIComponent(hash.slice(1))
    if (id) {
      // Pagina nouă e deja în DOM; lăsăm un cadru pentru așezare. Ref-ul se
      // scrie abia la derulare (StrictMode rulează efectul de două ori).
      const t = window.setTimeout(() => {
        lastPath.current = pathname
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      }, 60)
      return () => window.clearTimeout(t)
    }
    lastPath.current = pathname
    // Instant, so route changes don't visibly scroll through the page
    // (html has scroll-behavior: smooth for in-page anchors).
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

const page = (node: ReactNode) => <PageTransition>{node}</PageTransition>

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    // Fără AnimatePresence: pagina nouă intră animat (PageTransition), dar
    // montarea ei nu mai depinde de terminarea vreunei animații de ieșire —
    // un exit blocat lăsa pagina goală.
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={page(<Home />)} />
      <Route path="/erp" element={page(<Erp />)} />
      <Route path="/erp/demo" element={page(<ErpDemo />)} />
      <Route path="/crm" element={page(<Crm />)} />
      <Route path="/preturi" element={page(<Preturi />)} />
      <Route path="/contact" element={page(<Contact />)} />
      <Route path="*" element={page(<Home />)} />
    </Routes>
  )
}

/** Tot site-ul, fără router: în browser îl învelește BrowserRouter (mai jos),
 *  la prerandare StaticRouter (src/entry-server.tsx). */
export const AppLayout = () => (
  <ThemeProvider>
    <ScrollToTop />
    <div className="relative min-h-screen bg-[color:var(--bg)]">
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <ThemeSwitch />
    </div>
  </ThemeProvider>
)

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
