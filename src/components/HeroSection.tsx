import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import ShinyText from './ShinyText'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4'

const NAV_LINKS = [
  'Home',
  'About Us',
  'Courses',
  'Instructors',
  'Testimonials',
  'Blog',
]

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-sans">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content above video */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navigation */}
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
              <span className="h-3 w-3 rounded-full bg-white" />
            </span>
            <span className="text-lg font-medium text-white">DesignPro</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 rounded-full border border-gray-700 px-6 py-2.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
              >
                {link}
              </a>
            ))}
            <a
              href="#"
              className="flex items-center gap-1 text-sm text-white/80 transition-colors duration-200 hover:text-white"
            >
              Contact us
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="text-white lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mx-6 flex flex-col gap-4 rounded-2xl border border-gray-700 bg-black/80 p-6 backdrop-blur-md lg:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <a
              href="#"
              className="flex items-center gap-1 text-sm text-white/80 transition-colors duration-200 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Contact us
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}

        {/* Top section */}
        <div className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-4 px-6 lg:grid-cols-2 lg:px-8">
          <p className="max-w-md text-sm text-white/80 md:text-base">
            We deliver transformative programs that empower emerging product
            designers with cutting-edge expertise and vision to thrive
            globally.
          </p>
          <p className="text-sm text-white/80 md:text-base lg:text-right">
            8000+ Talented Designers Launched !
          </p>
        </div>

        {/* Hero content */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
          <p className="mb-4 text-xs uppercase tracking-tight text-white/80 md:text-sm">
            Seats for Next Program Opening Soon
          </p>

          <h1 className="text-5xl tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl" style={{ lineHeight: 0.85 }}>
            <span className="block font-medium text-white">Become</span>
            <ShinyText
              text="Product Leader."
              color="#64CEFB"
              shineColor="#ffffff"
              speed={3}
              spread={100}
              className="font-medium"
            />
          </h1>

          <a
            href="#"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-gray-900 md:px-8 md:py-4 md:text-base"
          >
            Apply for Next Enrollment
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
