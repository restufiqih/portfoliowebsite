import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoMarquee from './LogoMarquee'
import testimonialBg from '../assets/testimonial-bg.png'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Efrem',
    company: 'HyperTrends Global Inc.',
    text: '"Akhdiyat is very responsive and very talented. Enjoyed working with him. I would highly recommend others to work with him."',
  },
  {
    name: 'Client 2',
    company: 'Company Name',
    text: '"Great work and communication throughout the project. Delivered high quality designs on time."',
  },
  {
    name: 'Client 3',
    company: 'Company Name',
    text: '"Exceptional UI/UX skills. Truly understands user needs and translates them into beautiful interfaces."',
  },
  {
    name: 'Client 4',
    company: 'Company Name',
    text: '"Professional, creative, and easy to work with. Will definitely hire again for future projects."',
  },
  {
    name: 'Client 5',
    company: 'Company Name',
    text: '"Outstanding design work that exceeded our expectations. Highly recommended."',
  },
]

const insights = [
  'Commited to Quality',
  'Clear Communicator',
  'Collaborative',
  'Solution Oriented',
  'Detailed Oriented',
  'Reliable',
]

function ProgressBar({ total, activeIndex, progress, onClickBar }) {
  return (
    <div className="flex gap-[6px] h-[4px] w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 rounded-[99px] overflow-hidden cursor-pointer py-[8px] -my-[8px] flex items-center"
          onClick={() => onClickBar(i)}>
          <div className="flex-1 h-[4px] rounded-[99px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.28)' }}>
            {i < activeIndex && (
              <div className="h-full w-full rounded-[99px] bg-white" />
            )}
            {i === activeIndex && (
              <div className="h-full rounded-[99px] bg-white" style={{ width: `${progress}%` }} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function RollingButton({ label, href }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="self-start bg-black px-[20px] rounded-[9px] inline-flex justify-center items-center cursor-pointer hover:bg-black/85 transition-colors"
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
    </a>
  )
}

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  // barIndex tracks the progress bar independently of the (animated) content index,
  // so the bar advances the instant a cycle ends instead of waiting on the slide animation
  const [barIndex, setBarIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const bgRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const prevIndexRef = useRef(0)
  const intervalDuration = 5000

  const startTimeRef = useRef(Date.now())
  const offsetRef = useRef(0)

  const isAnimatingRef = useRef(false)
  const pendingIndexRef = useRef(null)

  const animateSlide = useCallback((newIndex) => {
    const prevIndex = prevIndexRef.current
    if (prevIndex === newIndex || !contentRef.current) return
    if (isAnimatingRef.current) {
      pendingIndexRef.current = newIndex
      return
    }

    isAnimatingRef.current = true
    const direction = newIndex > prevIndex ? 1 : -1

    gsap.to(contentRef.current, {
      x: direction * -100, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        prevIndexRef.current = newIndex
        setActiveIndex(newIndex)
        gsap.fromTo(contentRef.current,
          { x: direction * 100, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.3, ease: 'power2.out',
            onComplete: () => {
              isAnimatingRef.current = false
              if (pendingIndexRef.current !== null) {
                const pending = pendingIndexRef.current
                pendingIndexRef.current = null
                animateSlide(pending)
              }
            }
          }
        )
      }
    })
  }, [])

  const jumpTo = (index) => {
    offsetRef.current = index * intervalDuration
    startTimeRef.current = Date.now()
    animateSlide(index)
    setBarIndex(index)
    setProgress(0)
  }

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current + offsetRef.current
      const currentCycle = Math.floor(elapsed / intervalDuration)
      const newIndex = currentCycle % testimonials.length

      if (newIndex !== prevIndexRef.current && !isAnimatingRef.current) {
        animateSlide(newIndex)
      }

      // advance the bar immediately at the boundary so the finishing bar snaps to full
      setBarIndex(newIndex)
      setProgress(((elapsed % intervalDuration) / intervalDuration) * 100)
    }, 50)
    return () => clearInterval(id)
  }, [animateSlide])

  // Parallax: the gradient background drifts upward as the section scrolls through
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current,
        { y: -600 },
        {
          y: 300, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      )

      // Left column starts higher, right column starts lower — they meet in the middle
      // once the section is fully in view (converge completes around center of the viewport)
      const converge = {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.2,
      }
      gsap.fromTo(leftColRef.current,
        { y: -70 }, { y: 0, ease: 'none', scrollTrigger: converge }
      )
      gsap.fromTo(rightColRef.current,
        { y: 70 }, { y: 0, ease: 'none', scrollTrigger: converge }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const current = testimonials[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="relative bg-white flex flex-col gap-[80px] items-center pt-[100px] pb-[400px] overflow-hidden"
    >
      {/* Background gradient — flipped vertically, positioned at bottom */}
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={{ bottom: '-641px', height: '1413px', transform: 'scaleY(-1)' }}
      >
        <img ref={bgRef} src={testimonialBg} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Main content — left text + right card */}
      <div className="relative z-10 flex items-center justify-center w-full px-[100px]">
        <div className="flex gap-[80px] items-center w-[950px]">
          {/* Left side */}
          <div ref={leftColRef} className="flex-1 flex flex-col gap-[30px] justify-center">
            <div className="flex flex-col gap-[20px]">
              <p className="text-black text-[60px] font-light font-['Geist'] leading-[70px] tracking-[-2.4px]">
                What clients say
              </p>
              <div className="text-black text-[18px] font-light font-['Geist'] leading-[26px] tracking-[-0.36px]">
                <p>My clients explain it better than I ever could. </p>
                <p>Their experiences say more about my work than any description I could write.</p>
              </div>
            </div>

            {/* Insights from completed jobs */}
            <div className="flex flex-col gap-[24px] p-[24px] rounded-[30px]" style={{ background: '#f2f4f7' }}>
              <p className="text-black text-[16px] font-light font-['Geist'] leading-[22px]">
                Insights from completed jobs
              </p>
              <div className="flex flex-wrap gap-[10px]">
                {insights.map((tag) => (
                  <div key={tag} className="bg-white h-[38px] flex items-center justify-center px-[14px] rounded-[30px]">
                    <p className="text-black text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">{tag}</p>
                  </div>
                ))}
              </div>
            </div>

            <RollingButton label="See Upwork Profile" href="#" />
          </div>

          {/* Right side — Testimonial card */}
          <div ref={rightColRef} className="flex-1 bg-black rounded-[30px] flex flex-col gap-[40px] pt-[20px] pb-[60px] px-[20px] overflow-hidden">
            <ProgressBar total={testimonials.length} activeIndex={barIndex} progress={progress} onClickBar={jumpTo} />

            <div ref={contentRef}>
              <div className="flex gap-[20px] items-center px-[20px]">
                <div className="w-[52px] h-[52px] rounded-full bg-white shrink-0" />
                <div className="flex flex-col gap-[2px]">
                  <p className="text-white text-[20px] font-light font-['Geist'] leading-[28px] tracking-[-0.4px]">
                    {current.name}
                  </p>
                  <p className="text-white/70 text-[16px] font-light font-['Geist'] leading-[22px]">
                    {current.company}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center px-[20px] h-[350px]">
                <p className="text-white text-[20px] font-light font-['Geist'] leading-[28px] tracking-[-0.4px]">
                  {current.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo marquee */}
      <div className="relative z-10 w-full">
        <LogoMarquee />
      </div>
    </section>
  )
}
