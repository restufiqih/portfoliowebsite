import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import bgGradient from '../../assets/works/bg-gradient.png'
import work1 from '../../assets/works/work-1.png'
import work4 from '../../assets/works/work-4.png'
import work5 from '../../assets/works/work-5.png'
import work6 from '../../assets/works/work-6.png'
import work8 from '../../assets/works/work-8.png'

gsap.registerPlugin(ScrollTrigger)

const slides = [
  { src: work4, offset: 0,   href: '#' },
  { src: work5, offset: 17,  href: '#' },
  { src: work6, offset: 9,   href: '#' },
  { src: work1, offset: 17,  href: '#' },
  { src: work8, offset: 0,   href: '#' },
]

const carouselSlides = [...slides, ...slides]

function RollingButton({ label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-black px-[20px] rounded-[99px] inline-flex justify-center items-center cursor-pointer"
      style={{ height: 50 }}
    >
      <div style={{ height: '22px', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? 'translateY(-22px)' : 'translateY(0px)',
          transition: 'transform 0.3s ease-in-out',
        }}>
          <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block">{label}</span>
          <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block">{label}</span>
        </div>
      </div>
    </button>
  )
}

function CharWord({ word, isLast }) {
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {word.split('').map((char, i) => (
        <span
          key={i}
          className="char-highlight"
          style={{ display: 'inline-block', color: 'rgba(0,0,0,0.5)' }}
        >
          {char}
        </span>
      ))}
      {!isLast && (
        <span
          className="char-highlight"
          style={{ display: 'inline-block', color: 'rgba(0,0,0,0.5)' }}
        >
          {' '}
        </span>
      )}
    </span>
  )
}

const highlightWords = ['Explore', 'the', 'thinking', 'and', 'design', 'decisions', 'behind', 'each', 'project.']

export default function WorksMobile() {
  const sectionRef = useRef(null)
  const highlightRef = useRef(null)
  const bgRef = useRef(null)
  const trackRef = useRef(null)
  const tweenRef = useRef(null)
  const titleRef = useRef(null)
  const carouselRef = useRef(null)
  const ctaRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background gradient parallax
      gsap.set(bgRef.current, { y: 200 })
      gsap.to(bgRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top 30%',
          scrub: 1.5,
        }
      })

      // Horizontal marquee
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

      // Title parallax
      gsap.fromTo(titleRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.2,
          }
        }
      )

      // Carousel parallax
      gsap.fromTo(carouselRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top -10%',
            scrub: 1.2,
          }
        }
      )

      // CTA parallax
      gsap.fromTo(ctaRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 1.2,
          }
        }
      )

      // Char highlight animation
      if (highlightRef.current) {
        const chars = highlightRef.current.querySelectorAll('.char-highlight')
        gsap.fromTo(
          chars,
          { color: 'rgba(0,0,0,0.5)' },
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
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden" style={{ marginBottom: -1 }}>

      {/* Parallax background gradient */}
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={{ top: '-200px', height: '800px' }}
      >
        <div ref={bgRef} className="w-full h-full">
          <img src={bgGradient} alt="" className="w-full h-full object-cover object-top" />
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ paddingTop: 300, paddingBottom: 80, gap: 60 }}
      >

        {/* Title */}
        <div ref={titleRef} className="w-full flex flex-col items-center" style={{ padding: '0 24px' }}>
          <p
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 40, lineHeight: '46px', letterSpacing: '-0.8px' }}
          >
            Designing products
          </p>
          <p
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 40, lineHeight: '46px', letterSpacing: '-0.8px' }}
          >
            that people love to use
          </p>
        </div>

        {/* Horizontal looping carousel */}
        <div
          ref={carouselRef}
          className="w-full overflow-hidden"
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
                  width: 323,
                  aspectRatio: '500 / 400',
                  borderRadius: 26,
                  marginTop: `${offset}px`,
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col items-center" style={{ gap: 30, padding: '0 24px' }}>
          <p
            className="text-center font-light font-['Geist']"
            style={{ fontSize: 24, lineHeight: '34px', letterSpacing: '-0.48px' }}
          >
            <span className="text-black">Curious about the process behind these designs? </span>
            <span ref={highlightRef}>
              {highlightWords.map((w, i) => (
                <CharWord key={i} word={w} isLast={i === highlightWords.length - 1} />
              ))}
            </span>
          </p>
          <RollingButton label="Explore Case Studies" />
        </div>

      </div>
    </section>
  )
}
