import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import VideoIntro from './components/VideoIntro'
import Upwork from './components/Upwork'
import Quote from './components/Quote'
import Testimonial from './components/Testimonial'
import Nebula from './components/Nebula'
import LoadingScreen from './components/LoadingScreen'

function FullBleed({ children, className, style, noConstrain }) {
  return (
    <div className={className} style={style}>
      {noConstrain ? children : (
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [lanyardReady, setLanyardReady] = useState(false)
  const handleFinish = useCallback(() => setLoading(false), [])
  const handleLanyardReady = useCallback(() => setLanyardReady(true), [])

  return (
    <div className="min-h-screen bg-black" style={{ overflowX: 'hidden' }}>
      {loading && <LoadingScreen onFinish={handleFinish} lanyardReady={lanyardReady} />}
      <FullBleed className="bg-[#1500E1]">
        <Navbar />
        <Hero onReady={handleLanyardReady} />
      </FullBleed>
      <FullBleed className="bg-white" noConstrain>
        <Works />
      </FullBleed>
      <FullBleed className="bg-white" noConstrain>
        <VideoIntro />
      </FullBleed>
      <FullBleed className="bg-white" noConstrain>
        <Upwork />
      </FullBleed>
      <FullBleed style={{ background: 'linear-gradient(to bottom, #e8e4f5 0%, #f5f3fa 50%, #ffffff 100%)' }} noConstrain>
        <Quote />
      </FullBleed>
      <FullBleed className="bg-white" noConstrain>
        <Testimonial />
      </FullBleed>
      <FullBleed style={{ background: '#511ece' }} noConstrain>
        <Nebula />
      </FullBleed>
    </div>
  )
}
