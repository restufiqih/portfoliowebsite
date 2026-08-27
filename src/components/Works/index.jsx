import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RollingButton from '../RollingButton'
import CharWord from '../CharWord'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'

import bgGradient from '../../assets/works/bg-gradient.png'
import work1 from '../../assets/works/work-1.png'
import work4 from '../../assets/works/work-4.png'
import work5 from '../../assets/works/work-5.png'
import work6 from '../../assets/works/work-6.png'
import work8 from '../../assets/works/work-8.png'

gsap.registerPlugin(ScrollTrigger)

const desktopSlides = [
  { src: work4, offset: 0,  href: '#' },
  { src: work5, offset: 25, href: '#' },
  { src: work6, offset: 10, href: '#' },
  { src: work1, offset: 35, href: '#' },
  { src: work8, offset: 15, href: '#' },
]

const mobileSlides = [
  { src: work4, offset: 0,   href: '#' },
  { src: work5, offset: 17,  href: '#' },
  { src: work6, offset: 9,   href: '#' },
  { src: work1, offset: 17,  href: '#' },
  { src: work8, offset: 0,   href: '#' },
]

const highlightWords = ['Explore', 'the', 'thinking', 'and', 'design', 'decisions', 'behind', 'each', 'project.']

export default function Works() {
  const sectionRef = useRef(null)
  const highlightRef = useRef(null)
  const bgRef = useRef(null)
  const trackRef = useRef(null)
  const tweenRef = useRef(null)
  const titleRef = useRef(null)
  const carouselRef = useRef(null)
  const ctaRef = useRef(null)
  const { isMobileView, isDesktop } = useBreakpoint()

  const slides = isMobileView ? mobileSlides : desktopSlides
  const carouselSlides = [...slides, ...slides]

  const titleStyle = isMobileView
    ? { fontSize: 36, lineHeight: '42px', letterSpacing: '-0.72px' }
    : { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) }

  const ctaStyle = isMobileView
    ? { fontSize: 20, lineHeight: '28px', letterSpacing: '-0.4px' }
    : { fontSize: fluid(17, 24), lineHeight: fluid(24, 34) }

  const contentStyle = isMobileView
    ? { paddingTop: 190, paddingBottom: 80, gap: 60 }
    : { paddingTop: fluid(216, 300), paddingBottom: fluid(72, 100), gap: fluid(43, 60) }

  const bgStyle = isMobileView
    ? { top: '-350px', height: '800px' }
    : { top: '-641px', height: '1413px' }

  const animConfig = isMobileView
    ? { bgYFrom: 200, bgYTo: -60, bgEnd: 'top 10%', titleY: 80, carouselY: 100, ctaY: 60 }
    : { bgYFrom: 300, bgYTo: -200, bgEnd: 'center center', titleY: 120, carouselY: 180, ctaY: 100 }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bgRef.current, { y: animConfig.bgYFrom })
      gsap.to(bgRef.current, {
        y: animConfig.bgYTo,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: animConfig.bgEnd,
          scrub: 1.5,
        }
      })

      const track = trackRef.current
      const card = track.querySelector('.work-card')
      if (card) {
        const cardWidth = card.offsetWidth + 10
        const totalWidth = cardWidth * slides.length
        tweenRef.current = gsap.to(track, {
          x: -totalWidth,
          duration: 20,
          ease: 'none',
          repeat: -1,
        })
      }

      gsap.fromTo(titleRef.current,
        { y: animConfig.titleY, ...(isMobileView ? {} : { opacity: 0 }) },
        {
          y: 0, ...(isMobileView ? {} : { opacity: 1 }), ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: isMobileView ? 'top 30%' : 'top 20%',
            scrub: 1.2,
          }
        }
      )

      gsap.fromTo(carouselRef.current,
        { y: animConfig.carouselY, ...(isMobileView ? {} : { opacity: 0 }) },
        {
          y: 0, ...(isMobileView ? {} : { opacity: 1 }), ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top -10%',
            scrub: 1.2,
          }
        }
      )

      gsap.fromTo(ctaRef.current,
        { y: animConfig.ctaY, ...(isMobileView ? {} : { opacity: 0 }) },
        {
          y: 0, ...(isMobileView ? {} : { opacity: 1 }), ease: 'none',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 1.2,
          }
        }
      )

      if (highlightRef.current) {
        const chars = highlightRef.current.querySelectorAll('.char-highlight')
        gsap.fromTo(
          chars,
          { color: isMobileView ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' },
          {
            color: 'rgba(0,0,0,1)',
            stagger: 0.02,
            ease: 'none',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 1,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobileView])

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden" style={isMobileView ? { marginBottom: -1 } : {}}>

      <div
        className="absolute left-0 w-full pointer-events-none"
        style={bgStyle}
      >
        <div ref={bgRef} className="w-full h-full">
          <img src={bgGradient} alt="" className="w-full h-full object-cover object-top" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center" style={contentStyle}>

        <div ref={titleRef} className="w-full flex flex-col items-center" style={isMobileView ? { padding: '0 24px' } : { padding: '0 80px' }}>
          <p className="text-black font-light font-['Geist'] text-center" style={titleStyle}>
            Designing products
          </p>
          <p className="text-black font-light font-['Geist'] text-center" style={titleStyle}>
            that people love to use
          </p>
        </div>

        <div
          ref={carouselRef}
          className="w-full overflow-hidden"
          style={{ paddingBottom: isMobileView ? 0 : '24px' }}
          onMouseEnter={() => tweenRef.current?.pause()}
          onMouseLeave={() => tweenRef.current?.resume()}
        >
          <div
            ref={trackRef}
            className="flex gap-[10px] items-start"
            style={{ width: 'max-content' }}
          >
            {carouselSlides.map(({ src, offset, href }, i) => (
              <a
                key={i}
                href={href}
                className="work-card block overflow-hidden shrink-0"
                style={{
                  width: isMobileView ? 323 : fluid(266, 370),
                  aspectRatio: '500 / 400',
                  borderRadius: isMobileView ? 26 : 30,
                  marginTop: `${offset}px`,
                }}
              >
                <img
                  src={src}
                  alt=""
                  className={`w-full h-full object-cover ${isDesktop ? 'transition-transform duration-500 hover:scale-105' : ''}`}
                />
              </a>
            ))}
          </div>
        </div>

        <div ref={ctaRef} className="flex flex-col items-center" style={isMobileView ? { gap: 30, padding: '0 24px' } : { gap: 30, padding: '0 20px' }}>
          {isMobileView ? (
            <p className="text-center font-light font-['Geist']" style={ctaStyle}>
              <span className="text-black">Curious about the process behind these designs? </span>
              <span ref={highlightRef}>
                {highlightWords.map((w, i) => (
                  <CharWord key={i} word={w} isLast={i === highlightWords.length - 1} initialColor="rgba(0,0,0,0.5)" />
                ))}
              </span>
            </p>
          ) : (
            <div className="text-center font-light font-['Geist']" style={ctaStyle}>
              <p>
                <span className="text-black">Curious about the process behind these designs?</span>
              </p>
              <p>
                <span ref={highlightRef}>
                  {highlightWords.map((w, i) => (
                    <CharWord key={i} word={w} isLast={i === highlightWords.length - 1} initialColor="rgba(0,0,0,0.3)" />
                  ))}
                </span>
              </p>
            </div>
          )}
          <RollingButton label="Explore Case Studies" />
        </div>

      </div>
    </section>
  )
}
