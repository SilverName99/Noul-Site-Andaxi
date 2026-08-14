import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeSwitch from './components/ThemeSwitch'
import { ThemeProvider } from './theme'
import PageTransition from './components/motion/PageTransition'
import Home from './pages/Home'
import Erp from './pages/Erp'
import Crm from './pages/Crm'
import Preturi from './pages/Preturi'
import Contact from './pages/Contact'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    // Instant, so route changes don't visibly scroll through the page
    // (html has scroll-behavior: smooth for in-page anchors).
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    // Fără AnimatePresence: pagina nouă intră animat (PageTransition), dar
    // montarea ei nu mai depinde de terminarea vreunei animații de ieșire —
    // un exit blocat lăsa pagina goală.
    <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/erp"
          element={
            <PageTransition>
              <Erp />
            </PageTransition>
          }
        />
        <Route
          path="/crm"
          element={
            <PageTransition>
              <Crm />
            </PageTransition>
          }
        />
        <Route
          path="/preturi"
          element={
            <PageTransition>
              <Preturi />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
      </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="relative min-h-screen bg-[color:var(--bg)]">
          <Navbar />
          <AnimatedRoutes />
          <Footer />
          <ThemeSwitch />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
