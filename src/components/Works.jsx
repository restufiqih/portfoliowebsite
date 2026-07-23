import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import bgGradient from '../assets/works/bg-gradient.png'
import work1 from '../assets/works/work-1.png'
import work4 from '../assets/works/work-4.png'
import work5 from '../assets/works/work-5.png'
import work6 from '../assets/works/work-6.png'
import work8 from '../assets/works/work-8.png'

gsap.registerPlugin(ScrollTrigger)

// 5 project images — all offsets unique so no two cards ever sit at the same height
const slides = [
  { src: work4, offset: 0,  href: '#' },
  { src: work5, offset: 25, href: '#' },
  { src: work6, offset: 10, href: '#' },
  { src: work1, offset: 35, href: '#' },
  { src: work8, offset: 15, href: '#' },
]

const carouselSlides = [...slides, ...slides]

function RollingButton({ label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-black px-[20px] rounded-[9px] inline-flex justify-center items-center cursor-pointer hover:bg-black/85 transition-colors"
      style={{ height: '46px' }}
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
          style={{ display: 'inline-block', color: 'rgba(0,0,0,0.3)' }}
        >
          {char}
        </span>
      ))}
      {!isLast && (
        <span
          className="char-highlight"
          style={{ display: 'inline-block', color: 'rgba(0,0,0,0.3)' }}
        >
          {' '}
        </span>
      )}
    </span>
  )
}

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: bg starts 200px below Figma position, scrolls up to Figma position
      gsap.set(bgRef.current, { y: 300 })
      gsap.to(bgRef.current, {
        y: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5,
        }
      })

      // Horizontal marquee — loop over 5 unique card widths
      const track = trackRef.current
      const card = track.querySelector('.work-card')
      if (card) {
        const cardWidth = card.offsetWidth + 10
        const totalWidth = cardWidth * slides.length

        tweenRef.current = gsap.to(track, {
          x: -totalWidth,
          duration: 45,
          ease: 'none',
          repeat: -1,
        })
      }

      // Title parallax — starts lower, scrolls into place
      gsap.fromTo(titleRef.current,
        { y: 120, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.2,
          }
        }
      )

      // Carousel parallax — starts even lower, scrolls up slower
      gsap.fromTo(carouselRef.current,
        { y: 180, opacity: 0 },
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
        { y: 100, opacity: 0 },
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
          { color: 'rgba(0,0,0,0.3)' },
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
    <section ref={sectionRef} className="relative bg-white overflow-hidden">

      {/* Parallax background — Figma: h=1413px, top=-641px from section */}
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={{ top: '-641px', height: '1413px' }}
      >
        <div ref={bgRef} className="w-full h-full">
          <img src={bgGradient} alt="" className="w-full h-full object-cover object-top" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-[60px] pb-[100px] pt-[300px]">

        {/* Title */}
        <div ref={titleRef} className="px-[80px] w-full flex flex-col items-center">
          <p className="text-black text-[60px] font-light font-['Geist'] leading-[70px] tracking-[-2.4px] text-center whitespace-nowrap">
            Designing products
          </p>
          <p className="text-black text-[60px] font-light font-['Geist'] leading-[70px] tracking-[-2.4px] text-center whitespace-nowrap">
            that people love to use
          </p>
        </div>

        {/* Horizontal looping carousel — hover pauses, cards are clickable */}
        <div
          ref={carouselRef}
          className="w-full overflow-hidden"
          style={{ paddingBottom: '24px' }}
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
                className="work-card block rounded-[30px] overflow-hidden shrink-0"
                style={{
                  width: '370px',
                  aspectRatio: '500 / 400',
                  marginTop: `${offset}px`,
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col items-center gap-[30px]">
          <p className="text-center text-[24px] font-light font-['Geist'] leading-[34px] tracking-[-0.48px] w-[604px]">
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
