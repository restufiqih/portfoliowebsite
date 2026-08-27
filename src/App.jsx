import { useEffect, useState } from 'react'
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
  const [appZoom, setAppZoom] = useState(1)

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const z = vw > BASE_WIDTH ? vw / BASE_WIDTH : 1
      setAppZoom(z)
      document.documentElement.style.setProperty('--app-zoom', String(z))
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      document.documentElement.style.removeProperty('--app-zoom')
      window.removeEventListener('resize', update)
    }
  }, [])

  const scaled = appZoom > 1

  return (
    <div className="min-h-screen bg-black">
      <div style={scaled ? {
        maxWidth: BASE_WIDTH,
        margin: '0 auto',
        zoom: appZoom,
        width: `${100 / appZoom}%`,
      } : undefined}>
        <Navbar />
        <Hero />
        <Works />
        <PhoneSection />
        <TrustSection />
        <OrbitSection />
        <TestimonialSection />
        <NebulaSection />
      </div>
    </div>
  )
}
