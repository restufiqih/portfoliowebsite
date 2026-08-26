import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IPhoneMockup, ServiceCard, services } from './PhoneSection.desktop'

gsap.registerPlugin(ScrollTrigger)


export default function PhoneSectionMobile() {
  const sectionRef = useRef(null)
  const section1Ref = useRef(null)
  const phoneRef = useRef(null)
  const textRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
  const iframeRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 375)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const phoneZoom = Math.min((vw - 33) / 309.6, 1.2)

  const postCommand = useCallback((func, args = []) => {
    if (!iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args }), '*'
    )
  }, [])

  useEffect(() => {
    const onMessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.event === 'onReady') postCommand('playVideo')
      } catch {}
    }
    window.addEventListener('message', onMessage)
    const timer = setTimeout(() => postCommand('playVideo'), 2000)
    return () => { window.removeEventListener('message', onMessage); clearTimeout(timer) }
  }, [postCommand])

  const toggleMute = useCallback(() => {
    if (muted) postCommand('unMute')
    else postCommand('mute')
    setMuted(m => !m)
  }, [muted, postCommand])

  const replay = useCallback(() => {
    postCommand('seekTo', [0, true])
    postCommand('playVideo')
  }, [postCommand])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(section1Ref.current, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: section1Ref.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        }
      })

      gsap.fromTo(phoneRef.current,
        { y: 100 },
        {
          y: 0, ease: 'none',
          scrollTrigger: { trigger: section1Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1.2 }
        }
      )

      gsap.fromTo(textRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: section1Ref.current, start: 'top 60%', end: 'top 10%', scrub: 1.2 }
        }
      )

      gsap.fromTo(titleRef.current,
        { y: 80 },
        {
          y: 0, ease: 'none',
          scrollTrigger: { trigger: titleRef.current, start: 'top 95%', end: 'top 50%', scrub: 1.2 }
        }
      )

      if (cardsRef.current) {
        Array.from(cardsRef.current.children).forEach((card, i) => {
          gsap.fromTo(card,
            { y: 40 + i * 30 },
            {
              y: 0, ease: 'none',
              scrollTrigger: { trigger: cardsRef.current, start: 'top 90%', end: 'top 40%', scrub: 1.2 }
            }
          )
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef}>

      {/* Section 1 — gradient, phone center, text below */}
      <section
        ref={section1Ref}
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #dcd9fb 100%)',
          paddingTop: 80,
          paddingBottom: 150,
          marginBottom: -60,
        }}
      >
        <div className="flex flex-col items-center" style={{ gap: 60 }}>
          <div ref={phoneRef} className="flex justify-center">
            <div style={{ zoom: phoneZoom }}>
              <IPhoneMockup
                iframeRef={iframeRef}
                muted={muted}
                onToggleMute={toggleMute}
                onReplay={replay}
              />
            </div>
          </div>

          <p
            ref={textRef}
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 30, lineHeight: '36px', letterSpacing: '-0.6px', padding: '0 24px' }}
          >
            Every project is unique. That's how I approach them.
          </p>
        </div>
      </section>

      {/* Section 2 — white, rounded top, service cards */}
      <section
        id="services"
        className="relative bg-white w-full flex flex-col items-center overflow-hidden"
        style={{
          borderRadius: '40px 40px 0 0',
          padding: '80px 24px',
          gap: 50,
        }}
      >
        <div ref={titleRef} className="flex flex-col items-center w-full" style={{ gap: 20 }}>
          <div
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 40, lineHeight: '46px', letterSpacing: '-0.8px' }}
          >
            <p>What I'm</p>
            <p>actually good at</p>
          </div>
          <p
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 16, lineHeight: '22px' }}
          >
            Over the years, I've focused on a few things and worked hard to do them exceptionally well. Here's where I can bring the most value.
          </p>
        </div>

        <div ref={cardsRef} className="flex flex-col w-full" style={{ gap: 24 }}>
          {services.map(svc => (
            <ServiceCard key={svc.title} {...svc} isDesktop={false} s={1} />
          ))}
        </div>
      </section>

    </div>
  )
}
