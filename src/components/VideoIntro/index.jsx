import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid, scaleTablet } from '../../utils/fluid'
import HowItWorks from '../HowItWorks'

gsap.registerPlugin(ScrollTrigger)

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

function ServiceCard({ title, desc, bg, carousel, isDesktop, isMobileView, isTablet, s = 1, tabletMaxWidth }) {
  // Tablet holds its 768 figures and grows them with the viewport from there.
  const z = (n) => (isTablet ? scaleTablet(n) : n)
  const zl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)

  return (
    <div
      className={`flex-1 min-w-0 overflow-hidden flex flex-col justify-center${isMobileView ? ' w-full' : ''}`}
      style={{
        backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center',
        borderRadius: z(30), gap: z(30),
        paddingTop: z(30), paddingBottom: z(50),
        ...(isDesktop ? { maxWidth: 400, borderRadius: fluid(22, 30), gap: fluid(22, 30), paddingTop: fluid(22, 30), paddingBottom: fluid(36, 50) } : {}),
        ...(tabletMaxWidth ? { maxWidth: tabletMaxWidth } : {}),
      }}
    >
      {carousel === 'branding' ? <BrandingMarquee s={s} /> : <SlideCarousel type={carousel} s={s} />}
      <div className="flex flex-col w-full text-center" style={{ filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.2))', gap: z(14), paddingLeft: z(40), paddingRight: z(40), ...(isDesktop ? { paddingLeft: fluid(29, 40), paddingRight: fluid(29, 40), gap: fluid(10, 14) } : {}) }}>
        <p className="text-white font-light font-['Geist'] tracking-[-0.6px]" style={{ fontSize: z(30), lineHeight: zl(36), ...(isDesktop ? { fontSize: fluid(22, 30), lineHeight: fluid(26, 36) } : {}) }}>
          {title}
        </p>
        <p className="text-white/80 font-normal font-['Geist']" style={{ fontSize: z(16), lineHeight: zl(22), ...(isDesktop ? { fontSize: fluid(14, 16), lineHeight: fluid(18, 22) } : {}) }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function VideoIntro() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
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

  // Tablet holds its 768 figures and grows them with the viewport from there.
  const sc = (n) => (isTablet ? scaleTablet(n) : n)
  const scl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)

  const mobileSidePad = isTablet ? sc(40) : 16
  const sec2PadStyle = isMobileView
    ? { borderRadius: `${scl(40)} ${scl(40)} 0 0`, paddingTop: sc(80), paddingBottom: sc(80), paddingLeft: mobileSidePad, paddingRight: mobileSidePad, gap: sc(50) }
    : { ...{ padding: fluid(72, 100), gap: fluid(36, 50) }, borderRadius: `${fluid(43, 60)} ${fluid(43, 60)} 0 0`, marginTop: `clamp(-60px, calc(-43px - 17 * (100vw - 1024px) / 416), -43px)` }

  const whatStyle = isMobileView
    ? { fontSize: sc(36), lineHeight: scl(42), letterSpacing: isTablet ? `calc(-1 * ${scaleTablet(0.72)})` : '-0.72px' }
    : { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) }

  const bodyStyle = isMobileView
    ? { fontSize: sc(16), lineHeight: scl(22) }
    : { fontSize: fluid(14, 18), lineHeight: fluid(20, 26) }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The intro section is HowItWorks at every breakpoint now, and it owns
      // its own motion; only the Services block below is animated from here.
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

      <HowItWorks />

      <section
        id="services"
        className={isMobileView
          ? 'relative bg-white w-full flex flex-col items-center overflow-hidden'
          : 'relative bg-white w-full flex flex-col items-center gap-8 p-5 sm:p-8 z-10'
        }
        style={sec2PadStyle}
      >
        <div ref={titleRef} className="flex flex-col items-center w-full" style={isTablet ? { gap: sc(20), maxWidth: sc(500) } : isMobileView ? { gap: 20 } : { maxWidth: fluid(389, 540), gap: fluid(22, 30) }}>
          <h2 className="text-black font-light font-['Geist'] text-center" style={whatStyle}>
            <span className="block">What I'm</span>
            <span className="block">actually good at</span>
          </h2>
          <p className="text-black font-light font-['Geist'] text-center" style={bodyStyle}>
            Over the years, I've focused on a few things and worked hard to do them exceptionally well. Here's where I can bring the most value.
          </p>
        </div>

        <div ref={cardsRef} className={isMobileView ? 'flex flex-col w-full items-center' : 'flex flex-col md:flex-row items-stretch w-full justify-center'} style={isMobileView ? { gap: sc(24) } : { gap: fluid(17, 24) }}>
          {services.map((svc) => (
            <ServiceCard key={svc.title} {...svc} isDesktop={isDesktop} isMobileView={isMobileView} isTablet={isTablet} s={isMobileView ? 1 : phoneScale} tabletMaxWidth={isTablet ? sc(500) : undefined} />
          ))}
        </div>
      </section>

    </div>
  )
}
