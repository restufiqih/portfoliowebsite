import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import PhoneSection from './components/PhoneSection'
import TrustSection from './components/TrustSection'
import OrbitSection from './components/OrbitSection'
import TestimonialSection from './components/TestimonialSection'
import NebulaSection from './components/NebulaSection'

const BASE_WIDTH = 1440

export default function App() {
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const currentZoom = parseFloat(document.body.style.zoom) || 1
      const realWidth = vw * currentZoom
      if (realWidth > BASE_WIDTH) {
        document.body.style.zoom = String(realWidth / BASE_WIDTH)
      } else {
        document.body.style.zoom = ''
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      document.body.style.zoom = ''
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Works />
      <PhoneSection />
      <TrustSection />
      <OrbitSection />
      <TestimonialSection />
      <NebulaSection />
    </div>
  )
}
