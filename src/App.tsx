import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeSwitch from './components/ThemeSwitch'
import { ThemeProvider } from './theme'
import PageTransition from './components/motion/PageTransition'
import Home from './pages/Home'
import Erp from './pages/Erp'
import Crm from './pages/Crm'
import Contact from './pages/Contact'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
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
    </AnimatePresence>
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
