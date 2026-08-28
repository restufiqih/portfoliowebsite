import { useState, useEffect, useMemo, useLayoutEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_ID = 'LsS4bPikV-o'
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`

const RotateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.6825 18.0609C8.14696 19.3421 10.0281 20.0456 11.9739 20.0398C13.9196 20.034 15.7966 19.3192 17.2534 18.0293C18.7101 16.7394 19.6469 14.9628 19.8882 13.0321C20.1295 11.1013 19.6589 9.14883 18.5645 7.54004C17.4701 5.93125 15.8268 4.77648 13.9424 4.29188C12.0579 3.80729 10.0615 4.0261 8.3267 4.90735C6.59194 5.7886 5.23782 7.27189 4.51782 9.07954M4.01782 4.07954V9.07954H9.01782" stroke="#F4F3FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const VolumeOnIcon = () => (
  <svg width="24" height="24" viewBox="-2 -3 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 4.93381C13.621 5.39954 14.125 6.00346 14.4721 6.69774C14.8193 7.39202 15 8.15758 15 8.93381C15 9.71003 14.8193 10.4756 14.4721 11.1699C14.125 11.8642 13.621 12.4681 13 12.9338M15.7 1.93381C16.744 2.77746 17.586 3.84393 18.1645 5.05513C18.7429 6.26632 19.0431 7.59157 19.0431 8.93381C19.0431 10.276 18.7429 11.6013 18.1645 12.8125C17.586 14.0237 16.744 15.0902 15.7 15.9338M4 11.9338H2C1.73478 11.9338 1.48043 11.8285 1.29289 11.6409C1.10536 11.4534 1 11.199 1 10.9338V6.93381C1 6.66859 1.10536 6.41424 1.29289 6.2267C1.48043 6.03917 1.73478 5.93381 2 5.93381H4L7.5 1.43381C7.5874 1.26404 7.73265 1.13113 7.90949 1.0591C8.08633 0.987073 8.2831 0.980671 8.46425 1.04105C8.6454 1.10144 8.79898 1.22462 8.89723 1.38835C8.99549 1.55208 9.03194 1.74555 9 1.93381V15.9338C9.03194 16.1221 8.99549 16.3155 8.89723 16.4793C8.79898 16.643 8.6454 16.7662 8.46425 16.8266C8.2831 16.887 8.08633 16.8805 7.90949 16.8085C7.73265 16.7365 7.5874 16.6036 7.5 16.4338L4 11.9338Z" stroke="#F4F3FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const VolumeOffIcon = () => (
  <svg width="24" height="24" viewBox="-2 -2 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 6C13.7483 6.56124 14.3242 7.32114 14.6622 8.19334C15.0002 9.06554 15.0867 10.0151 14.912 10.934M13.535 13.536C13.3679 13.7031 13.1891 13.8582 13 14M15.7 3C17.3049 4.29704 18.4154 6.10621 18.8455 8.12445C19.2755 10.1427 18.9989 12.2474 18.062 14.086M16.386 16.385C16.168 16.6016 15.939 16.8068 15.7 17M7.069 3.054L7.5 2.5C7.5874 2.33023 7.73265 2.19733 7.90949 2.1253C8.08633 2.05327 8.2831 2.04686 8.46425 2.10725C8.6454 2.16763 8.79898 2.29081 8.89723 2.45454C8.99549 2.61827 9.03194 2.81175 9 3V5M9 9V17C9.03194 17.1883 8.99549 17.3817 8.89723 17.5455C8.79898 17.7092 8.6454 17.8324 8.46425 17.8928C8.2831 17.9531 8.08633 17.9467 7.90949 17.8747C7.73265 17.8027 7.5874 17.6698 7.5 17.5L4 13H2C1.73478 13 1.48043 12.8946 1.29289 12.7071C1.10536 12.5196 1 12.2652 1 12V8C1 7.73479 1.10536 7.48043 1.29289 7.2929C1.48043 7.10536 1.73478 7 2 7H4L5.294 5.336M1 1L19 19" stroke="#F4F3FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

import productDesignBg from '../../assets/services/product-design.png'
import landingPageBg from '../../assets/services/landing-page.png'
import visualBrandingBg from '../../assets/services/visual-branding.png'
import slide1 from '../../assets/services/slides/slide1.png'
import slide2 from '../../assets/services/slides/slide2.png'
import slide3 from '../../assets/services/slides/slide3.png'
import landing1 from '../../assets/services/slides-landing/landing1.png'
import landing2 from '../../assets/services/slides-landing/landing2.png'
import landing3 from '../../assets/services/slides-landing/landing3.png'
import brand1 from '../../assets/services/slides-branding/brand1.png'
import brand2 from '../../assets/services/slides-branding/brand2.png'
import brand3 from '../../assets/services/slides-branding/brand3.png'
import brand4 from '../../assets/services/slides-branding/brand4.png'
import brand5 from '../../assets/services/slides-branding/brand5.png'
import brand6 from '../../assets/services/slides-branding/brand6.png'
import brand7 from '../../assets/services/slides-branding/brand7.png'
import brand8 from '../../assets/services/slides-branding/brand8.png'
import brand9 from '../../assets/services/slides-branding/brand9.png'
import brand10 from '../../assets/services/slides-branding/brand10.png'

const phoneSlides = [slide1, slide2, slide3]
const landingSlides = [landing1, landing2, landing3]
const brandingRow1 = [brand1, brand2, brand3, brand4, brand5]
const brandingRow2 = [brand6, brand7, brand8, brand9, brand10]

const services = [
  {
    title: 'Product Design',
    desc: 'Designing intuitive digital products that solve problems.',
    bg: productDesignBg,
    carousel: 'phone',
  },
  {
    title: 'Visual Branding',
    desc: 'Creating memorable visual identities for brands.',
    bg: visualBrandingBg,
    carousel: 'branding',
  },
  {
    title: 'Landing Page',
    desc: 'Crafting engaging landing pages that capture attention.',
    bg: landingPageBg,
    carousel: 'landing',
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

function IPhoneMockup({ iframeRef, muted, onToggleMute, onReplay }) {
  const time = useRealTime()

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
      <div
        className="absolute z-30 bg-black"
        style={{
          width: '100.137px',
          height: '29.405px',
          borderRadius: '100px',
          left: '98.73px',
          top: '6.742px',
        }}
      />

      <div
        className="absolute z-20 flex items-center justify-between"
        style={{
          width: '301.6px',
          height: '42.868px',
          top: '2px',
          left: '0px',
        }}
      >
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

        <div className="flex items-center gap-[5px] pr-[12px]">
          <svg width="15.242" height="9.706" viewBox="0 0 15.2418 9.70589" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.2418 0.909927C15.2418 0.407388 14.8627 0 14.3951 0H13.5483C13.0807 0 12.7015 0.407388 12.7015 0.909927V8.79596C12.7015 9.2985 13.0807 9.70589 13.5483 9.70589H14.3951C14.8627 9.70589 15.2418 9.2985 15.2418 8.79596V0.909927ZM9.3403 1.94118H10.1871C10.6547 1.94118 11.0338 2.35834 11.0338 2.87294V8.77413C11.0338 9.28873 10.6547 9.70589 10.1871 9.70589H9.3403C8.87265 9.70589 8.49353 9.28873 8.49353 8.77413V2.87294C8.49353 2.35834 8.87265 1.94118 9.3403 1.94118ZM5.90154 4.04411H5.05477C4.58712 4.04411 4.208 4.46659 4.208 4.98774V8.76226C4.208 9.28341 4.58712 9.70589 5.05477 9.70589H5.90154C6.3692 9.70589 6.74831 9.28341 6.74831 8.76226V4.98774C6.74831 4.46659 6.3692 4.04411 5.90154 4.04411ZM1.69354 5.9853H0.846769C0.379112 5.9853 0 6.40174 0 6.91545V8.77575C0 9.28945 0.379112 9.70589 0.846769 9.70589H1.69354C2.1612 9.70589 2.54031 9.28945 2.54031 8.77575V6.91545C2.54031 6.40174 2.1612 5.9853 1.69354 5.9853Z" fill="white"/>
          </svg>

          <svg width="13.608" height="9.787" viewBox="0 0 13.6078 9.78678" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.8043 1.95785C8.77868 1.95793 10.6776 2.68992 12.1085 4.00253C12.2162 4.10387 12.3885 4.10259 12.4946 3.99967L13.5246 2.99667C13.5783 2.94446 13.6083 2.87375 13.6078 2.80018C13.6074 2.7266 13.5766 2.65623 13.5222 2.60464C9.76652 -0.868213 3.84148 -0.868213 0.0857798 2.60464C0.031376 2.65619 0.000507876 2.72654 6.21104e-06 2.80012C-0.000495454 2.87369 0.0294107 2.94443 0.0831068 2.99667L1.11341 3.99967C1.21947 4.10275 1.39183 4.10403 1.49952 4.00253C2.93061 2.68984 4.82972 1.95784 6.8043 1.95785ZM6.80163 5.3081C7.87913 5.30803 8.91819 5.71427 9.71689 6.44789C9.82492 6.55201 9.99509 6.54975 10.1004 6.4428L11.1223 5.39548C11.1761 5.34054 11.206 5.26602 11.2052 5.18857C11.2044 5.11113 11.1731 5.03724 11.1182 4.98343C8.68596 2.68854 4.91937 2.68854 2.48716 4.98343C2.43222 5.03724 2.40087 5.11117 2.40015 5.18864C2.39943 5.2661 2.42939 5.34062 2.48332 5.39548L3.50493 6.4428C3.61024 6.54975 3.78041 6.55201 3.88844 6.44789C4.68662 5.71476 5.72484 5.30855 6.80163 5.3081ZM8.80563 7.52575C8.80716 7.60938 8.77774 7.69001 8.72432 7.7486L6.99638 9.69728C6.94573 9.75455 6.87667 9.78678 6.80461 9.78678C6.73256 9.78678 6.6635 9.75455 6.61284 9.69728L4.88462 7.7486C4.83123 7.68997 4.80186 7.60931 4.80344 7.52568C4.80503 7.44205 4.83742 7.36285 4.89298 7.30679C5.99651 6.26376 7.61272 6.26376 8.71624 7.30679C8.77176 7.3629 8.80411 7.44212 8.80563 7.52575Z" fill="white"/>
          </svg>

          <svg width="24.5" height="11.5" viewBox="0 0 24.5 11.5" fill="none">
            <rect opacity="0.35" x="0.397" y="0.397" width="19.846" height="10.351" rx="2.166" stroke="white" strokeWidth="0.794"/>
            <path opacity="0.4" d="M21.039 3.577V7.568C21.678 7.294 22.093 6.657 22.093 5.573C22.093 4.489 21.678 3.851 21.039 3.577Z" fill="white"/>
            <rect x="1.588" y="1.588" width="16.671" height="7.969" rx="1.985" fill="white"/>
          </svg>
        </div>
      </div>

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
            ref={iframeRef}
            src={EMBED_URL}
            title="Portfolio video"
            allow="autoplay; encrypted-media"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
        <div className="absolute inset-0 z-10" />

        <div
          className="absolute z-20 left-1/2 -translate-x-1/2 flex gap-[14px]"
          style={{ bottom: '26px' }}
        >
          <button
            onClick={onReplay}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-black/30"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <RotateIcon />
          </button>
          <button
            onClick={onToggleMute}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-black/30"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          </button>
        </div>
      </div>

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

const carouselConfigs = {
  phone: {
    slides: phoneSlides,
    smW: 119.665, smH: 247.368,
    lgW: 145.126, lgH: 300,
    gap: 20, radius: 4,
  },
  landing: {
    slides: landingSlides,
    smW: 240, smH: 150,
    lgW: 317.334, lgH: 198.334,
    gap: -40, radius: 8,
  },
}

function SlideCarousel({ type = 'phone', s = 1 }) {
  const base = carouselConfigs[type]
  const cfg = useMemo(() => ({
    slides: base.slides,
    smW: base.smW * s, smH: base.smH * s,
    lgW: base.lgW * s, lgH: base.lgH * s,
    gap: base.gap * s, radius: base.radius,
  }), [base, s])
  const [current, setCurrent] = useState(0)
  const imgRefs = useRef([])

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % cfg.slides.length)
    }, 3000)
    return () => clearInterval(id)
  }, [cfg.slides.length])

  useEffect(() => {
    const leftCx = -(cfg.lgW / 2 + cfg.gap + cfg.smW / 2)
    const rightCx = cfg.lgW / 2 + cfg.gap + cfg.smW / 2

    const positions = [
      { cx: leftCx, w: cfg.smW, h: cfg.smH, zIndex: 1 },
      { cx: 0, w: cfg.lgW, h: cfg.lgH, zIndex: 3 },
      { cx: rightCx, w: cfg.smW, h: cfg.smH, zIndex: 1 },
    ]

    cfg.slides.forEach((_, i) => {
      const el = imgRefs.current[i]
      if (!el) return
      const offset = ((i - current) % cfg.slides.length + cfg.slides.length) % cfg.slides.length
      const posIndex = offset === 0 ? 1 : offset === 1 ? 2 : 0
      const pos = positions[posIndex]

      gsap.to(el, {
        x: pos.cx - pos.w / 2,
        width: pos.w,
        height: pos.h,
        zIndex: pos.zIndex,
        filter: pos.zIndex === 3 ? 'brightness(1)' : 'brightness(0.4)',
        duration: 0.7,
        ease: 'power2.inOut',
      })
    })
  }, [current, cfg])

  return (
    <div className="w-full relative flex items-center justify-center" style={{ height: 300 * s }}>
      {cfg.slides.map((src, i) => (
        <img
          key={i}
          ref={(el) => (imgRefs.current[i] = el)}
          src={src}
          alt=""
          className="absolute"
          style={{
            objectFit: 'cover',
            left: '50%',
            width: cfg.lgW,
            height: cfg.lgH,
            borderRadius: cfg.radius,
          }}
        />
      ))}
    </div>
  )
}

function BrandingMarquee({ s = 1 }) {
  const IMG_W = 149.466 * s
  const IMG_H = 112.099 * s
  const GAP = 9 * s
  const DURATION = 20

  const renderRow = (images, direction) => {
    const tripled = [...images, ...images, ...images]
    const stripW = images.length * (IMG_W + GAP)
    const animName = direction === 'left' ? 'marqueeLeft' : 'marqueeRight'

    return (
      <div className="overflow-hidden w-full">
        <div
          style={{
            display: 'flex',
            gap: GAP,
            width: stripW * 3,
            animation: `${animName} ${DURATION}s linear infinite`,
          }}
        >
          {tripled.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="shrink-0 object-cover"
              style={{ width: IMG_W, height: IMG_H, borderRadius: 10 * s }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full justify-center" style={{ gap: GAP, height: 300 * s }}>
      <style>{`
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-${(IMG_W + GAP) * 5}px); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-${(IMG_W + GAP) * 5}px); }
          to { transform: translateX(0); }
        }
      `}</style>
      {renderRow(brandingRow1, 'left')}
      {renderRow(brandingRow2, 'right')}
    </div>
  )
}

function ServiceCard({ title, desc, bg, carousel, isDesktop, isMobileView, s = 1, tabletMaxWidth }) {
  return (
    <div
      className={`flex-1 min-w-0 rounded-[30px] overflow-hidden flex flex-col gap-[30px] justify-center pt-[30px] pb-[50px]${isMobileView ? ' w-full' : ''}`}
      style={{
        backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center',
        ...(isDesktop ? { maxWidth: 400, borderRadius: fluid(22, 30), gap: fluid(22, 30), paddingTop: fluid(22, 30), paddingBottom: fluid(36, 50) } : {}),
        ...(tabletMaxWidth ? { maxWidth: tabletMaxWidth } : {}),
      }}
    >
      {carousel === 'branding' ? <BrandingMarquee s={s} /> : <SlideCarousel type={carousel} s={s} />}
      <div className="flex flex-col gap-[14px] w-full text-center px-[40px]" style={{ filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.2))', ...(isDesktop ? { paddingLeft: fluid(29, 40), paddingRight: fluid(29, 40), gap: fluid(10, 14) } : {}) }}>
        <p className="text-white text-[30px] font-light font-['Geist'] leading-[36px] tracking-[-0.6px]" style={isDesktop ? { fontSize: fluid(22, 30), lineHeight: fluid(26, 36) } : {}}>
          {title}
        </p>
        <p className="text-white/80 text-[16px] font-normal font-['Geist'] leading-[22px]" style={isDesktop ? { fontSize: fluid(14, 16), lineHeight: fluid(18, 22) } : {}}>
          {desc}
        </p>
      </div>
    </div>
  )
}

function DesktopSection1({ section1Ref, leftTextRef, phoneRef, rightTextRef, phoneScale, iframeRef, muted, toggleMute, replay, headingStyle, sec1PadStyle }) {
  return (
    <section
      ref={section1Ref}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #e8e4f5 100%)',
        paddingBottom: fluid(173, 240),
      }}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-center px-5 pt-12" style={{ minHeight: fluid(483, 670), ...sec1PadStyle, maxWidth: 1440, margin: '0 auto' }}>
        <div ref={leftTextRef} className="flex-1 flex flex-col justify-center min-w-0 order-1 lg:order-none">
          <p className="text-black text-[28px] sm:text-[36px] font-light font-['Geist'] tracking-[-1.2px] md:tracking-[-2.4px]" style={headingStyle}>
            Every project<br />is unique,
          </p>
        </div>

        <div ref={phoneRef} className="order-first lg:order-none">
          <div style={{ zoom: phoneScale }}>
            <IPhoneMockup iframeRef={iframeRef} muted={muted} onToggleMute={toggleMute} onReplay={replay} />
          </div>
        </div>

        <div ref={rightTextRef} className="flex-1 flex flex-col justify-center min-w-0 order-2 lg:order-none">
          <p className="text-black text-[28px] sm:text-[36px] font-light font-['Geist'] tracking-[-1.2px] md:tracking-[-2.4px]" style={headingStyle}>
            but here's how I approach them.
          </p>
        </div>
      </div>
    </section>
  )
}

function MobileSection1({ section1Ref, phoneRef, textRef, phoneZoom, iframeRef, muted, toggleMute, replay, sidePad = 16, isTablet = false }) {
  return (
    <section
      ref={section1Ref}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #dcd9fb 100%)',
        paddingTop: 80,
        paddingBottom: 150,
        marginBottom: -30,
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
          style={{ fontSize: 30, lineHeight: '36px', letterSpacing: '-0.6px', padding: `0 ${sidePad}px` }}
        >
          Every project is unique.{isTablet ? <br /> : ' '}That's how I approach them.
        </p>
      </div>
    </section>
  )
}

export default function VideoIntro() {
  const sectionRef = useRef(null)
  const leftTextRef = useRef(null)
  const rightTextRef = useRef(null)
  const textRef = useRef(null)
  const phoneRef = useRef(null)
  const section1Ref = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
  const iframeRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const { scale, isMobileView, isTablet, isDesktop } = useBreakpoint()
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const phoneScale = useMemo(() => {
    if (!isDesktop) return 0.75
    return Math.min(1, Math.max(0.72, 0.72 + 0.28 * (vw - 1024) / 416))
  }, [isDesktop, vw])

  const phoneZoom = useMemo(() => {
    if (isTablet) return (vw * 0.35) / 309.6
    if (isMobileView) return (vw * 0.70) / 309.6
    return Math.min((vw - 33) / 309.6, 1.2)
  }, [isMobileView, isTablet, vw])

  const headingStyle = isDesktop ? { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) } : {}
  const sec1PadStyle = isDesktop ? { paddingLeft: fluid(72, 100), paddingRight: fluid(72, 100), paddingTop: fluid(72, 100), gap: fluid(72, 100) } : {}
  const mobileSidePad = isTablet ? 40 : 16
  const sec2PadStyle = isMobileView
    ? { borderRadius: '40px 40px 0 0', padding: `80px ${mobileSidePad}px`, gap: 50 }
    : { ...{ padding: fluid(72, 100), gap: fluid(36, 50) }, borderRadius: `${fluid(43, 60)} ${fluid(43, 60)} 0 0`, marginTop: `clamp(-60px, calc(-43px - 17 * (100vw - 1024px) / 416), -43px)` }

  const whatStyle = isMobileView
    ? { fontSize: 36, lineHeight: '42px', letterSpacing: '-0.72px' }
    : { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) }

  const bodyStyle = isMobileView
    ? { fontSize: 16, lineHeight: '22px' }
    : { fontSize: fluid(14, 18), lineHeight: fluid(20, 26) }

  const postCommand = useCallback((func, args = []) => {
    if (!iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
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
    setMuted((m) => !m)
  }, [muted, postCommand])

  const replay = useCallback(() => {
    postCommand('seekTo', [0, true])
    postCommand('playVideo')
  }, [postCommand])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(section1Ref.current, {
        yPercent: isTablet ? 30 : isMobileView ? 20 : 40,
        ease: 'none',
        scrollTrigger: {
          trigger: section1Ref.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        }
      })

      if (isMobileView) {
        gsap.fromTo(phoneRef.current,
          { y: isTablet ? 130 : 100 },
          {
            y: 0, ease: 'none',
            scrollTrigger: { trigger: section1Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1.2 }
          }
        )

        gsap.fromTo(textRef.current,
          { y: isTablet ? 80 : 60, opacity: 0 },
          {
            y: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: section1Ref.current, start: 'top 60%', end: 'top 10%', scrub: 1.2 }
          }
        )
      } else {
        const phoneArea = phoneRef.current.closest('section')

        gsap.fromTo(phoneRef.current,
          { y: 150 * scale },
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

        gsap.fromTo(leftTextRef.current,
          { y: -200 * scale },
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

        gsap.fromTo(rightTextRef.current,
          { y: 200 * scale },
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
      }

      gsap.fromTo(titleRef.current,
        { y: isTablet ? 50 : isMobileView ? 15 : 100 },
        { y: 0, ease: 'none',
          scrollTrigger: { trigger: titleRef.current, start: 'top 95%', end: 'top 50%', scrub: 1.2 } }
      )

      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children)
        if (isMobileView) {
          cards.forEach((card, i) => {
            gsap.fromTo(card,
              { y: isTablet ? (50 + i * 40) : (40 + i * 30) },
              {
                y: 0, ease: 'none',
                scrollTrigger: { trigger: cardsRef.current, start: 'top 90%', end: 'top 40%', scrub: 1.2 }
              }
            )
          })
        } else {
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
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [isMobileView, isTablet, scale])

  return (
    <div ref={sectionRef}>

      {isMobileView
        ? <MobileSection1
            section1Ref={section1Ref}
            phoneRef={phoneRef}
            textRef={textRef}
            phoneZoom={phoneZoom}
            iframeRef={iframeRef}
            muted={muted}
            toggleMute={toggleMute}
            replay={replay}
            sidePad={mobileSidePad}
            isTablet={isTablet}
          />
        : <DesktopSection1
            section1Ref={section1Ref}
            leftTextRef={leftTextRef}
            phoneRef={phoneRef}
            rightTextRef={rightTextRef}
            phoneScale={phoneScale}
            iframeRef={iframeRef}
            muted={muted}
            toggleMute={toggleMute}
            replay={replay}
            headingStyle={headingStyle}
            sec1PadStyle={sec1PadStyle}
          />
      }

      <section
        id="services"
        className={isMobileView
          ? 'relative bg-white w-full flex flex-col items-center overflow-hidden'
          : 'relative bg-white w-full flex flex-col items-center gap-8 p-5 sm:p-8 z-10'
        }
        style={sec2PadStyle}
      >
        <div ref={titleRef} className="flex flex-col items-center w-full" style={isTablet ? { gap: 20, maxWidth: 500 } : isMobileView ? { gap: 20 } : { maxWidth: fluid(389, 540), gap: fluid(22, 30) }}>
          <div className="text-black font-light font-['Geist'] text-center" style={whatStyle}>
            <p>What I'm</p>
            <p>actually good at</p>
          </div>
          <p className="text-black font-light font-['Geist'] text-center" style={bodyStyle}>
            Over the years, I've focused on a few things and worked hard to do them exceptionally well. Here's where I can bring the most value.
          </p>
        </div>

        <div ref={cardsRef} className={isMobileView ? 'flex flex-col w-full items-center' : 'flex flex-col md:flex-row items-stretch w-full justify-center'} style={isMobileView ? { gap: 24 } : { gap: fluid(17, 24) }}>
          {services.map((svc) => (
            <ServiceCard key={svc.title} {...svc} isDesktop={isDesktop} isMobileView={isMobileView} s={isMobileView ? 1 : phoneScale} tabletMaxWidth={isTablet ? 500 : undefined} />
          ))}
        </div>
      </section>

    </div>
  )
}
