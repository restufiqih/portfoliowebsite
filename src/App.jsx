import { useState, useCallback, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import VideoIntro from './components/VideoIntro'
import Upwork from './components/Upwork'
import Quote from './components/Quote'
import Testimonial from './components/Testimonial'
import Nebula from './components/Nebula'
import About from './components/About'
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

// Hash routing rather than a router dependency: the navbar already speaks in
// hrefs, so a route is just an href that starts with '#/'.
function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash
  )
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

function Home({ onLanyardReady }) {
  return (
    <>
      <FullBleed className="bg-[#1500E1]">
        <Navbar />
        <Hero onReady={onLanyardReady} />
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
    </>
  )
}

export default function App() {
  const hash = useHashRoute()
  const isAbout = hash.startsWith('#/about')

  // The loading screen waits on the hero's 3D lanyard, which only the landing
  // page mounts — so it is a landing-page concern only.
  const [loading, setLoading] = useState(true)
  const [lanyardReady, setLanyardReady] = useState(false)
  const handleFinish = useCallback(() => setLoading(false), [])
  const handleLanyardReady = useCallback(() => setLanyardReady(true), [])

  // A route change swaps whole trees, so every measured trigger position from
  // the old one is stale.
  useEffect(() => {
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [isAbout])

  return (
    <div className="min-h-screen bg-black" style={{ overflowX: 'clip' }}>
      {loading && !isAbout && (
        <LoadingScreen onFinish={handleFinish} lanyardReady={lanyardReady} />
      )}
      {isAbout ? <About /> : <Home onLanyardReady={handleLanyardReady} />}
    </div>
  )
}
