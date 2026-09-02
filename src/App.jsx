import { useState, useCallback, useEffect, useRef } from 'react'
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
import CaseStudy from './components/CaseStudy'
import WorkList from './components/WorkList'
import LoadingScreen from './components/LoadingScreen'
import { currentPath, ROUTE_CHANGE } from './utils/route'
import { CASE_STUDY_BASE, getCaseStudy } from './data/caseStudies'
import { getStory } from './data/stories'

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

function usePathRoute() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onChange = () => setPath(currentPath())
    window.addEventListener('popstate', onChange)
    window.addEventListener(ROUTE_CHANGE, onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener(ROUTE_CHANGE, onChange)
    }
  }, [])
  return path
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
  const path = usePathRoute()
  // Trailing slash tolerated, so /about and /about/ are the same page.
  const cleanPath = path.replace(/\/+$/, '')
  const isAbout = cleanPath === '/about'

  // /work is the index; /work/<slug> a case study. An unknown slug falls
  // through to the landing page rather than rendering a half-empty detail page.
  const isWorkList = cleanPath === CASE_STUDY_BASE
  const slug = cleanPath.startsWith(`${CASE_STUDY_BASE}/`)
    ? cleanPath.slice(CASE_STUDY_BASE.length + 1)
    : null
  const study = slug ? getCaseStudy(slug) : null
  // Same test the landing page's cards use: a route exists where a story does.
  const isCaseStudy = Boolean(study && getStory(study.id))

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
  }, [cleanPath])

  // Keep the title, description, and canonical in step with the route. Social
  // crawlers do not run JS and still read index.html, but this fixes the browser
  // tab and what Google shows once it renders the page.
  useEffect(() => {
    const meta = isWorkList
      ? {
          title: 'Work — Akhdiyat Restu Fiqih, UI/UX Designer',
          description:
            'Selected case studies by Akhdiyat Restu Fiqih — product design for SaaS, fintech, education, and mobile apps.',
          canonical: `https://www.restufiqih.com${CASE_STUDY_BASE}`,
        }
      : isCaseStudy
      ? {
          title: `${study.name} — ${study.headline} | Akhdiyat Restu Fiqih`,
          description: study.description,
          canonical: `https://www.restufiqih.com${CASE_STUDY_BASE}/${study.id}`,
        }
      : isAbout
      ? {
          title: 'About — Akhdiyat Restu Fiqih, UI/UX Designer',
          description:
            "About Akhdiyat Restu Fiqih — a Top Rated Plus UI/UX designer on Upwork with 6+ years designing products across SaaS, fintech, education, and mobile apps.",
          canonical: 'https://www.restufiqih.com/about',
        }
      : {
          title: 'Akhdiyat Restu Fiqih — Top Rated Plus UI/UX Designer on Upwork',
          description:
            'Akhdiyat Restu Fiqih is a Top Rated Plus UI/UX designer on Upwork with 6+ years designing digital products — SaaS, fintech, education, and mobile apps — for global clients.',
          canonical: 'https://www.restufiqih.com/',
        }
    document.title = meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description)
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', meta.canonical)
  }, [isAbout, isCaseStudy, isWorkList, study])

  // A section link arriving from outside the app -- the 404 page's header, or a
  // pasted /#services -- lands here with a hash and nothing mounted to act on.
  // Held until the loading screen has let go of the scroll, then run once.
  const jumpedRef = useRef(false)
  useEffect(() => {
    if (jumpedRef.current) return
    if (loading && !isAbout && !isCaseStudy && !isWorkList) return
    const id = window.location.hash.slice(1)
    if (!id) return
    jumpedRef.current = true

    let tries = 0
    let timer
    // Timers rather than animation frames, so a backgrounded tab does not leave
    // the jump queued forever.
    const settle = () => {
      if (id === 'contact') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' })
        return
      }
      const el = document.getElementById(id)
      if (!el) {
        if (tries++ < 60) timer = setTimeout(settle, 16)
        return
      }
      el.scrollIntoView({ behavior: 'auto' })
    }
    timer = setTimeout(settle, 16)
    return () => clearTimeout(timer)
  }, [loading, isAbout, isCaseStudy, isWorkList])

  return (
    <div className="min-h-screen bg-black" style={{ overflowX: 'clip' }}>
      {loading && !isAbout && !isCaseStudy && !isWorkList && (
        <LoadingScreen onFinish={handleFinish} lanyardReady={lanyardReady} />
      )}
      {isWorkList ? (
        <WorkList />
      ) : isCaseStudy ? (
        <CaseStudy study={study} />
      ) : isAbout ? (
        <About />
      ) : (
        <Home onLanyardReady={handleLanyardReady} />
      )}
    </div>
  )
}
