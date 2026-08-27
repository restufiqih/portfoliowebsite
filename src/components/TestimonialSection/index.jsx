import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoMarquee from '../LogoMarquee'
import RollingButton from '../RollingButton'
import testimonialBg from '../../assets/testimonial-bg.png'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'

import client1Photo from '../../assets/clients/client1.png'
import client2Photo from '../../assets/clients/client2.png'
import client3Photo from '../../assets/clients/client3.png'
import client4Photo from '../../assets/clients/client4.png'
import client5Photo from '../../assets/clients/client5.png'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Anup M.',
    company: 'CEO @HyperTrends, USA🇺🇸',
    photo: client1Photo,
    text: '"Great experience working with the designer. We were able to create amazing designs for our website. The process was fairly straightforward. We would give them instructions, and they would come up with one or two variations and we would provide feedback, and things would get customized. I didn\'t run into any issues, and I will definitely connect with the designers should we need them again."',
  },
  {
    name: 'Joe C.',
    company: 'Founder @Breathway, UK🇬🇧',
    photo: client2Photo,
    text: '"Akhdiyat has done some awesome designs for us. He has excellent skills and vision, with modern UI knowledge and creative designs. He is a great communicator and really easy to work with. Thanks so much for your work on our project! Your design ideas have helped shape our brand and product."',
  },
  {
    name: 'Aymane S.',
    company: 'Founder @Mahkamaty, UAE🇦🇪',
    photo: client3Photo,
    text: '"I didn\'t think hiring someone on upwork could result in such amazing experience. Akhdiyat really analyzed the problem and provided a well rounded solution taking into consideration all edge cases."',
  },
  {
    name: 'Patrick M.',
    company: 'SM @Radar, USA🇺🇸',
    photo: client4Photo,
    text: '"Akhdiyat is perhaps the best freelancer I have ever worked with. The quality of his work is spectacular and his responsiveness was terrific despite the time zone differences between us. The app I was creating was only a loose vision, but he was able to take my high level idea and turn it into brilliant designs."',
  },
  {
    name: 'Paul S.',
    company: 'VP @3conx, Canada🇨🇦',
    photo: client5Photo,
    text: '"Akhdiyat is very creative and talented. He listened to my website development needs and did a great job."',
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
        <div
          key={i}
          className="flex-1 rounded-[99px] overflow-hidden cursor-pointer py-[8px] -my-[8px] flex items-center"
          onClick={() => onClickBar(i)}
        >
          <div
            className="flex-1 h-[4px] rounded-[99px] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.28)' }}
          >
            {i < activeIndex && (
              <div className="h-full w-full rounded-[99px] bg-white" />
            )}
            {i === activeIndex && (
              <div
                className="h-full rounded-[99px] bg-white"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [barIndex, setBarIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const bgRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const mobileTitleRef = useRef(null)
  const mobileCardRef = useRef(null)
  const mobileBtnRef = useRef(null)
  const { isMobileView, isDesktop } = useBreakpoint()

  const sectionStyle = isDesktop ? {
    gap: fluid(58, 80), paddingTop: fluid(130, 180), paddingBottom: fluid(288, 400),
  } : {}
  const titleStyle = isDesktop ? { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) } : {}
  const bodyStyle = isDesktop ? { fontSize: fluid(14, 18), lineHeight: fluid(19, 26) } : {}
  const cardTextStyle = isDesktop ? { fontSize: fluid(14, 20), lineHeight: fluid(20, 28) } : {}
  const cardHeightStyle = isDesktop ? { minHeight: fluid(281, 390) } : {}
  const contentPadStyle = isDesktop ? { paddingLeft: fluid(72, 100), paddingRight: fluid(72, 100) } : {}

  const prevIndexRef = useRef(0)
  const intervalDuration = 5000

  const startTimeRef = useRef(Date.now())
  const offsetRef = useRef(0)

  const isAnimatingRef = useRef(false)
  const pendingIndexRef = useRef(null)

  const isPausedRef = useRef(false)
  const pausedElapsedRef = useRef(0)
  const isHoldingRef = useRef(false)

  const tooltipRef = useRef(null)
  const cardAreaRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const [cardHovered, setCardHovered] = useState(false)

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
      x: direction * -100,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        prevIndexRef.current = newIndex
        setActiveIndex(newIndex)
        gsap.fromTo(
          contentRef.current,
          { x: direction * 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              isAnimatingRef.current = false
              if (pendingIndexRef.current !== null) {
                const pending = pendingIndexRef.current
                pendingIndexRef.current = null
                animateSlide(pending)
              }
            },
          }
        )
      },
    })
  }, [])

  const jumpTo = (index) => {
    offsetRef.current = index * intervalDuration
    startTimeRef.current = Date.now()
    animateSlide(index)
    setBarIndex(index)
    setProgress(0)
  }

  const updateTooltip = useCallback(() => {
    if (!tooltipRef.current || !cardAreaRef.current) return
    const rect = cardAreaRef.current.getBoundingClientRect()
    tooltipRef.current.style.left = `${mousePos.current.x - rect.left + 16}px`
    tooltipRef.current.style.top = `${mousePos.current.y - rect.top + 16}px`
  }, [])

  const handleCardMouseMove = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    updateTooltip()
  }, [updateTooltip])

  useEffect(() => {
    if (!cardHovered) return
    window.addEventListener('scroll', updateTooltip, true)
    return () => window.removeEventListener('scroll', updateTooltip, true)
  }, [cardHovered, updateTooltip])

  const [holding, setHolding] = useState(false)

  const handleHoldStart = () => {
    isHoldingRef.current = true
    setHolding(true)
    isPausedRef.current = true
    pausedElapsedRef.current = Date.now() - startTimeRef.current + offsetRef.current
  }

  const handleHoldEnd = () => {
    if (!isHoldingRef.current) return
    isHoldingRef.current = false
    setHolding(false)
    offsetRef.current = pausedElapsedRef.current
    startTimeRef.current = Date.now()
    isPausedRef.current = false
  }

  const handleMouseLeave = () => {
    if (isHoldingRef.current) {
      handleHoldEnd()
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (isPausedRef.current) return

      const elapsed = Date.now() - startTimeRef.current + offsetRef.current
      const currentCycle = Math.floor(elapsed / intervalDuration)
      const newIndex = currentCycle % testimonials.length

      if (newIndex !== prevIndexRef.current && !isAnimatingRef.current) {
        animateSlide(newIndex)
      }

      setBarIndex(newIndex)
      setProgress(((elapsed % intervalDuration) / intervalDuration) * 100)
    }, 50)
    return () => clearInterval(id)
  }, [animateSlide])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { y: -600 },
        {
          y: 300,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      )

      if (isMobileView) {
        const mobileEls = [
          { el: mobileTitleRef.current, y: 30 },
          { el: mobileCardRef.current, y: 36 },
        ]
        mobileEls.forEach(({ el, y }) => {
          if (!el) return
          gsap.fromTo(el,
            { y },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                end: 'top 55%',
                scrub: 2,
              },
            }
          )
        })
      } else if (!isMobileView) {
        const converge = {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'center center',
          scrub: 1.2,
        }
        gsap.fromTo(leftColRef.current, { y: -70 }, { y: 0, ease: 'none', scrollTrigger: converge })
        gsap.fromTo(rightColRef.current, { y: 70 }, { y: 0, ease: 'none', scrollTrigger: converge })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [isMobileView])

  const current = testimonials[activeIndex]

  const testimonialCard = (
    <div
      ref={(el) => { rightColRef.current = el; cardAreaRef.current = el }}
      className={isMobileView
        ? 'relative w-full bg-black rounded-[30px] flex flex-col gap-[40px] pt-[20px] pb-[60px] px-[20px] overflow-hidden select-none'
        : 'relative flex-1 bg-black rounded-[30px] flex flex-col gap-[40px] pt-[20px] pb-[20px] px-[20px] overflow-hidden select-none cursor-pointer'
      }
      onMouseDown={!isMobileView ? handleHoldStart : undefined}
      onMouseUp={!isMobileView ? handleHoldEnd : undefined}
      onMouseLeave={!isMobileView ? (e) => { handleMouseLeave(); setCardHovered(false) } : undefined}
      onMouseEnter={!isMobileView ? () => setCardHovered(true) : undefined}
      onMouseMove={!isMobileView ? handleCardMouseMove : undefined}
      onTouchStart={handleHoldStart}
      onTouchEnd={handleHoldEnd}
    >
      {!isMobileView && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-50 flex items-center justify-center rounded-[99px] bg-white/20 backdrop-blur-md px-[14px] py-[6px] text-[14px] font-light font-['Geist'] text-white tracking-[-0.28px] leading-[20px] whitespace-nowrap transition-opacity duration-200"
          style={{ opacity: isDesktop && cardHovered && !holding ? 1 : 0 }}
        >
          Hold to pause
        </div>
      )}
      <ProgressBar
        total={testimonials.length}
        activeIndex={barIndex}
        progress={progress}
        onClickBar={jumpTo}
      />

      <div ref={contentRef} className="flex flex-col gap-[20px]">
        <div className={`flex items-center ${isMobileView ? 'gap-[14px]' : 'gap-[20px] px-[20px]'}`}>
          <img
            src={current.photo}
            alt={current.name}
            className={`rounded-full object-cover shrink-0 ${isMobileView ? 'w-[46px] h-[46px]' : 'w-[52px] h-[52px]'}`}
          />
          <div className="flex flex-col gap-[2px]">
            <p className={`text-white font-light font-['Geist'] tracking-[-0.4px] ${isMobileView ? 'text-[18px] leading-[26px]' : 'text-[20px] leading-[28px]'}`}>
              {current.name}
            </p>
            <p className="text-white/70 text-[16px] font-light font-['Geist'] leading-[22px]">
              {current.company}
            </p>
          </div>
        </div>

        <div
          className={isMobileView
            ? 'flex items-center'
            : 'flex items-center justify-center px-[20px] min-h-[200px]'
          }
          style={isMobileView ? { height: 360 } : cardHeightStyle}
        >
          <p
            className="text-white font-light font-['Geist'] tracking-[-0.4px]"
            style={isMobileView
              ? { fontSize: 18, lineHeight: '26px' }
              : { fontSize: 16, lineHeight: '24px', ...cardTextStyle }
            }
          >
            {current.text}
          </p>
        </div>
      </div>
    </div>
  )

  const insightsBlock = (
    <div
      className={`flex flex-col rounded-[30px] ${isMobileView ? 'gap-[20px] p-[20px]' : 'gap-[24px] p-[24px]'}`}
      style={{ background: '#f2f4f7' }}
    >
      <p className="text-black text-[16px] font-light font-['Geist'] leading-[22px]">
        Insights from completed jobs
      </p>
      <div className="flex flex-wrap gap-[10px]">
        {insights.map((tag) => (
          <div
            key={tag}
            className="bg-white h-[38px] flex items-center justify-center px-[14px] rounded-[30px]"
          >
            <p className="text-black text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
              {tag}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className={isMobileView
        ? 'relative bg-white flex flex-col items-center overflow-hidden'
        : 'relative bg-white flex flex-col items-center overflow-hidden'
      }
      style={isMobileView
        ? { paddingTop: 80, paddingBottom: 360, marginTop: -1 }
        : sectionStyle
      }
    >
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={isMobileView
          ? { bottom: '-300px', height: '800px', transform: 'scaleY(-1)' }
          : { bottom: '-641px', height: '1413px', transform: 'scaleY(-1)' }
        }
      >
        <img ref={bgRef} src={testimonialBg} alt="" className="w-full h-full object-cover" />
      </div>

      {isMobileView ? (
        <div className="relative z-10 flex flex-col items-center w-full px-[24px]">
          <div ref={mobileTitleRef} className="flex flex-col gap-[20px] text-center w-full" style={{ marginBottom: 50 }}>
            <p className="text-black font-light font-['Geist']" style={{ fontSize: 40, lineHeight: '46px', letterSpacing: '-0.8px' }}>
              What clients say
            </p>
            <div className="text-black text-[16px] font-light font-['Geist'] leading-[22px]">
              <p>My clients explain it better than I ever could.</p>
              <p>Their experiences say more about my work than any description I could write.</p>
            </div>
          </div>

          <div ref={mobileCardRef} className="flex flex-col gap-[20px] w-full" style={{ marginBottom: 30 }}>
            {testimonialCard}
            {insightsBlock}
          </div>

          <div ref={mobileBtnRef}>
            <RollingButton
              label="See Upwork Profile"
              href="https://www.upwork.com/freelancers/akhdiyatrestufiqih"
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex items-center justify-center w-full px-5" style={contentPadStyle}>
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-[80px] items-center w-full max-w-[950px]">

            <div ref={leftColRef} className="flex-1 flex flex-col gap-[20px] md:gap-[30px] justify-center">
              <div className="flex flex-col gap-[16px] md:gap-[20px]">
                <p className="text-black text-[28px] sm:text-[36px] font-light font-['Geist'] tracking-[-1.2px] md:tracking-[-2.4px]" style={titleStyle}>
                  What clients say
                </p>
                <div className="text-black text-[16px] font-light font-['Geist'] leading-[24px] tracking-[-0.36px]" style={bodyStyle}>
                  <p>My clients explain it better than I ever could.</p>
                  <p>Their experiences say more about my work than any description I could write.</p>
                </div>
              </div>

              {insightsBlock}

              <RollingButton
                className="self-start"
                label="See Upwork Profile"
                href="https://www.upwork.com/freelancers/akhdiyatrestufiqih"
              />
            </div>

            {testimonialCard}
          </div>
        </div>
      )}

      <div className="relative z-10 w-full" style={isMobileView ? { marginTop: 80 } : undefined}>
        <LogoMarquee />
      </div>
    </section>
  )
}
