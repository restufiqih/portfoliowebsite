import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_ID = 'LsS4bPikV-o'
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1`

const services = [
  {
    title: 'Product Design',
    desc: 'Et id sollicitudin cursus vitae fermentum. Diam tellus sed in in quisque magna vitae.',
    gradient: `
      radial-gradient(ellipse 120% 80% at 20% 30%, #FF85B3cc 0%, transparent 70%),
      radial-gradient(ellipse 100% 100% at 80% 60%, #F01060cc 0%, transparent 60%),
      radial-gradient(ellipse 140% 90% at 50% 80%, #FF3D8Aaa 0%, transparent 50%),
      linear-gradient(135deg, #FF85B3 0%, #FF3D8A 50%, #F01060 100%)
    `,
  },
  {
    title: 'Landing Page',
    desc: 'Et id sollicitudin cursus vitae fermentum. Diam tellus sed in in quisque magna vitae.',
    gradient: `
      radial-gradient(ellipse 100% 80% at 30% 20%, #C99FFCcc 0%, transparent 60%),
      radial-gradient(ellipse 120% 100% at 70% 70%, #6B2FD0cc 0%, transparent 55%),
      radial-gradient(ellipse 80% 80% at 50% 40%, #9B6FE8aa 0%, transparent 50%),
      linear-gradient(160deg, #B07FF5 0%, #7B3FDB 50%, #5E1FC4 100%)
    `,
  },
  {
    title: 'Visual Branding',
    desc: 'Et id sollicitudin cursus vitae fermentum. Diam tellus sed in in quisque magna vitae.',
    gradient: `
      radial-gradient(ellipse 100% 80% at 30% 40%, #FFD44Acc 0%, transparent 60%),
      radial-gradient(ellipse 120% 90% at 80% 30%, #FF8C00cc 0%, transparent 55%),
      radial-gradient(ellipse 80% 100% at 60% 80%, #FFA726aa 0%, transparent 50%),
      linear-gradient(135deg, #FFD44A 0%, #FFA726 50%, #FF8000 100%)
    `,
  },
]

function useRealTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function IPhoneMockup() {
  const time = useRealTime()

  // Figma specs: border-4 black, rounded-[41px], bg-[#bebebe], 309.6 × 670
  // Dynamic Island: 100.137 × 29.405, rounded-[100px], left-[102.73px], top-[-2px] (relative to border)
  // Status bar: h=42.868, top=5.94px from border top
  // Home indicator: 110.345 × 3.969, top=643.39px
  // Inner border-radius: 41 - 4 = 37px

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: '309.6px',
        height: '670px',
        borderRadius: '41px',
        border: '4px solid black',
        background: '#bebebe',
      }}
    >
      {/* Dynamic Island — Figma: 100.137×29.405, left 102.73px from outer edge, top -2px from outer edge */}
      <div
        className="absolute z-30 bg-black"
        style={{
          width: '100.137px',
          height: '29.405px',
          borderRadius: '100px',
          left: '98.73px',   /* 102.73 - 4px border */
          top: '6.742px',    /* -2px + 4px border + 4.742px pt from Figma */
        }}
      />

      {/* Status Bar — Figma: h=42.868, top=5.94px from border, left=-2px */}
      <div
        className="absolute z-20 flex items-center justify-between"
        style={{
          width: '301.6px',
          height: '42.868px',
          top: '2px',
          left: '0px',
        }}
      >
        {/* Time — left side */}
        <div className="pl-[24px] pt-[2px]">
          <span style={{
            fontSize: '13.495px',
            fontWeight: 590,
            fontFamily: '-apple-system, "SF Pro", system-ui, sans-serif',
            color: '#fff',
            letterSpacing: '0',
          }}>
            {time}
          </span>
        </div>

        {/* Right icons — cellular, wifi, battery */}
        <div className="flex items-center gap-[5px] pr-[12px]">
          {/* Cellular — 15.242 × 9.706 */}
          <svg width="15.242" height="9.706" viewBox="0 0 15.2418 9.70589" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.2418 0.909927C15.2418 0.407388 14.8627 0 14.3951 0H13.5483C13.0807 0 12.7015 0.407388 12.7015 0.909927V8.79596C12.7015 9.2985 13.0807 9.70589 13.5483 9.70589H14.3951C14.8627 9.70589 15.2418 9.2985 15.2418 8.79596V0.909927ZM9.3403 1.94118H10.1871C10.6547 1.94118 11.0338 2.35834 11.0338 2.87294V8.77413C11.0338 9.28873 10.6547 9.70589 10.1871 9.70589H9.3403C8.87265 9.70589 8.49353 9.28873 8.49353 8.77413V2.87294C8.49353 2.35834 8.87265 1.94118 9.3403 1.94118ZM5.90154 4.04411H5.05477C4.58712 4.04411 4.208 4.46659 4.208 4.98774V8.76226C4.208 9.28341 4.58712 9.70589 5.05477 9.70589H5.90154C6.3692 9.70589 6.74831 9.28341 6.74831 8.76226V4.98774C6.74831 4.46659 6.3692 4.04411 5.90154 4.04411ZM1.69354 5.9853H0.846769C0.379112 5.9853 0 6.40174 0 6.91545V8.77575C0 9.28945 0.379112 9.70589 0.846769 9.70589H1.69354C2.1612 9.70589 2.54031 9.28945 2.54031 8.77575V6.91545C2.54031 6.40174 2.1612 5.9853 1.69354 5.9853Z" fill="white"/>
          </svg>

          {/* WiFi — 13.608 × 9.787 */}
          <svg width="13.608" height="9.787" viewBox="0 0 13.6078 9.78678" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.8043 1.95785C8.77868 1.95793 10.6776 2.68992 12.1085 4.00253C12.2162 4.10387 12.3885 4.10259 12.4946 3.99967L13.5246 2.99667C13.5783 2.94446 13.6083 2.87375 13.6078 2.80018C13.6074 2.7266 13.5766 2.65623 13.5222 2.60464C9.76652 -0.868213 3.84148 -0.868213 0.0857798 2.60464C0.031376 2.65619 0.000507876 2.72654 6.21104e-06 2.80012C-0.000495454 2.87369 0.0294107 2.94443 0.0831068 2.99667L1.11341 3.99967C1.21947 4.10275 1.39183 4.10403 1.49952 4.00253C2.93061 2.68984 4.82972 1.95784 6.8043 1.95785ZM6.80163 5.3081C7.87913 5.30803 8.91819 5.71427 9.71689 6.44789C9.82492 6.55201 9.99509 6.54975 10.1004 6.4428L11.1223 5.39548C11.1761 5.34054 11.206 5.26602 11.2052 5.18857C11.2044 5.11113 11.1731 5.03724 11.1182 4.98343C8.68596 2.68854 4.91937 2.68854 2.48716 4.98343C2.43222 5.03724 2.40087 5.11117 2.40015 5.18864C2.39943 5.2661 2.42939 5.34062 2.48332 5.39548L3.50493 6.4428C3.61024 6.54975 3.78041 6.55201 3.88844 6.44789C4.68662 5.71476 5.72484 5.30855 6.80163 5.3081ZM8.80563 7.52575C8.80716 7.60938 8.77774 7.69001 8.72432 7.7486L6.99638 9.69728C6.94573 9.75455 6.87667 9.78678 6.80461 9.78678C6.73256 9.78678 6.6635 9.75455 6.61284 9.69728L4.88462 7.7486C4.83123 7.68997 4.80186 7.60931 4.80344 7.52568C4.80503 7.44205 4.83742 7.36285 4.89298 7.30679C5.99651 6.26376 7.61272 6.26376 8.71624 7.30679C8.77176 7.3629 8.80411 7.44212 8.80563 7.52575Z" fill="white"/>
          </svg>

          {/* Battery — border 19.846×10.35, cap, capacity 16.671 */}
          <svg width="24.5" height="11.5" viewBox="0 0 24.5 11.5" fill="none">
            <rect opacity="0.35" x="0.397" y="0.397" width="19.846" height="10.351" rx="2.166" stroke="white" strokeWidth="0.794"/>
            <path opacity="0.4" d="M21.039 3.577V7.568C21.678 7.294 22.093 6.657 22.093 5.573C22.093 4.489 21.678 3.851 21.039 3.577Z" fill="white"/>
            <rect x="1.588" y="1.588" width="16.671" height="7.969" rx="1.985" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Video — fills entire inner screen, crops horizontally */}
      <div
        className="absolute overflow-hidden z-10"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '37px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '-150%',
            right: '-150%',
            pointerEvents: 'none',
          }}
        >
          <iframe
            src={EMBED_URL}
            title="Portfolio video"
            allow="autoplay; encrypted-media"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
        <div className="absolute inset-0 z-10" />
      </div>

      {/* Home Indicator */}
      <div
        className="absolute z-20 left-1/2 -translate-x-1/2"
        style={{ top: '649px' }}
      >
        <div
          className="bg-white"
          style={{
            width: '110.345px',
            height: '3.969px',
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  )
}

function ServiceCard({ title, desc, gradient }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-[30px] overflow-hidden flex flex-col gap-[10px] justify-center px-[40px] py-[50px]"
      style={{ background: gradient }}
    >
      <div className="h-[285px] w-full opacity-0 rounded-[4px]" />
      <div className="flex flex-col gap-[14px] w-full" style={{ filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.2))' }}>
        <p className="text-white text-[30px] font-light font-['Geist'] leading-[36px] tracking-[-0.6px]">
          {title}
        </p>
        <p className="text-white/80 text-[16px] font-normal font-['Geist'] leading-[22px]">
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function PhoneSection() {
  const sectionRef = useRef(null)
  const leftTextRef = useRef(null)
  const rightTextRef = useRef(null)
  const phoneRef = useRef(null)
  const section1Ref = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const phoneArea = phoneRef.current.closest('section')

      // Section 1 parallax — scrolls slower so section 2 catches up and covers it
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

      // Phone parallax entrance
      gsap.fromTo(phoneRef.current,
        { y: 150 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: phoneArea,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.2,
          }
        }
      )

      // Left text parallax — from top of phone downward
      gsap.fromTo(leftTextRef.current,
        { y: -200 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: phoneArea,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1.2,
          }
        }
      )

      // Right text parallax — from bottom of phone upward
      gsap.fromTo(rightTextRef.current,
        { y: 200 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: phoneArea,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1.2,
          }
        }
      )
      gsap.fromTo(titleRef.current,
        { y: 100 },
        { y: 0, ease: 'none',
          scrollTrigger: { trigger: titleRef.current, start: 'top 95%', end: 'top 50%', scrub: 1.2 } }
      )
      const cards = cardsRef.current.children
      gsap.fromTo(cards[0],
        { y: 10 },
        { y: 0, ease: 'none',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 90%', end: 'top 40%', scrub: 1.2 } }
      )
      gsap.fromTo(cards[1],
        { y: 80 },
        { y: 0, ease: 'none',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 90%', end: 'top 40%', scrub: 1.2 } }
      )
      gsap.fromTo(cards[2],
        { y: 150 },
        { y: 0, ease: 'none',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 90%', end: 'top 40%', scrub: 1.2 } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef}>

      {/* Section 1 — white→blue gradient, iPhone center, flanking text */}
      <section
        ref={section1Ref}
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #e8e4f5 100%)',
          paddingBottom: '240px',
        }}
      >
        <div className="flex gap-[100px] items-center px-[100px] pt-[100px]" style={{ minHeight: '670px' }}>
          <div ref={leftTextRef} className="flex-1 flex flex-col justify-center min-w-0">
            <p className="text-black text-[60px] font-light font-['Geist'] leading-[70px] tracking-[-2.4px]">
              Every project is unique,
            </p>
          </div>

          <div ref={phoneRef}>
            <IPhoneMockup />
          </div>

          <div ref={rightTextRef} className="flex-1 flex flex-col justify-center min-w-0">
            <p className="text-black text-[60px] font-light font-['Geist'] leading-[70px] tracking-[-2.4px]">
              but here's how I approach them.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — white, rounded top corners, slides over section 1 */}
      <section
        className="relative bg-white w-full flex flex-col items-center gap-[50px] p-[100px] z-10"
        style={{ borderRadius: '60px 60px 0 0', marginTop: '-60px' }}
      >
        <div ref={titleRef} className="flex flex-col items-center gap-[30px] w-[540px]">
          <div className="text-black text-[60px] font-light font-['Geist'] leading-[70px] tracking-[-2.4px] text-center">
            <p>What I'm</p>
            <p>actually good at</p>
          </div>
          <p className="text-black text-[18px] font-light font-['Geist'] leading-[26px] tracking-[-0.36px] text-center">
            Over the years, I've focused on a few things and worked hard to do them exceptionally well. Here's where I can bring the most value.
          </p>
        </div>

        <div ref={cardsRef} className="flex gap-[24px] items-stretch w-full">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </section>

    </div>
  )
}
