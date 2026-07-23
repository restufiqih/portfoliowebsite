import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import PhoneSection from './components/PhoneSection'
import TrustSection from './components/TrustSection'
import OrbitSection from './components/OrbitSection'
import TestimonialSection from './components/TestimonialSection'
import NebulaSection from './components/NebulaSection'
import CtaSection from './components/CtaSection'
export default function App() {
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
      <CtaSection />
    </div>
  )
}