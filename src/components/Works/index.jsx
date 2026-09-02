import { useLayoutEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RollingButton from '../RollingButton'
import CharWord from '../CharWord'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid, fluidSpace, fluidType, scaleTablet } from '../../utils/fluid'
import { CASE_STUDY_BASE, caseStudies, caseStudyPath } from '../../data/caseStudies'
import { getStory } from '../../data/stories'
import { navigate } from '../../utils/route'

import bgGradient from '../../assets/works/bg-gradient.png'

gsap.registerPlugin(ScrollTrigger)

// Half the height the pre-stacking (carousel) Works section used to have at
// desktop width. The background gradient's travel is still anchored to it so it
// clears the heading at exactly the same scroll position as before.
const LEGACY_HALF_SECTION = 582

// Where every card pins on desktop. Cards share one offset, so each comes to
// rest squarely on top of the one beneath it and covers it completely.
const STACK_TOP = 120

// Widest the content ever gets, matching the wrapper in App.jsx and the hero
// row in VideoIntro. The section itself stays full-bleed so its background
// gradient still reaches both edges.
const CONTENT_MAX = 1440

// Flow spacing between cards. A pinned card holds until the next one has
// covered its own height plus this, so the gap is what sets how much scrolling
// each card costs — keep it small or the stack crawls. Mobile keeps the 20px
// the design lays the cards out with; at that size it already works out to
// about two thirds of a screen per card, the same rhythm as desktop.
const CARD_GAP = 6 // vh
const CARD_GAP_MOBILE = 20 // px
const CARD_INSET_MOBILE = 24 // px, the side inset the design lays the cards out at

// Tablet runs the stacked card, whose full-width image makes it far taller than
// the desktop one. Capping it keeps a whole card above the fold, and 500 is
// what the other sections already cap their tablet content at.
const CARD_MAX_TABLET = 500

// Where the cards pin. Lower for the stacked card, which is the taller of the
// two, so a full card still clears the fold on a short screen.
const STACK_TOP_MOBILE = 100

// Space between the last card and the CTA below it, and between the title and
// the cards. Both are 60 in the design file: in the mobile frame the title runs
// to y=438 with the cards at y=498, and the cards end at y=2007.2 with the CTA
// at y=2067.2.
const CTA_GAP = 60

// Tilt a card carries while it is still travelling, and the distance over which
// it flattens out as it reaches the stack.
const TILT_MAX = 26 // deg
const TILT_DISTANCE = 460 // px

// Run-up over which a card decelerates into its pin. Sticky alone catches a
// card at full scroll speed and stops it dead; over this last stretch the card
// is eased in so it arrives already at rest.
const ARRIVAL_CUSHION = 220 // px

// g(0) = 0, g(1) = 1, g'(0) = 0, g'(1) = 1 — leaves free travel at the far end
// at matching speed and comes to a standstill exactly on the pin.
const arrivalEase = (u) => u * u * (2 - u)

// How much of the remaining distance the stack closes each frame. Low enough to
// carry the same weight as the scrubbed parallaxes around it.
const SMOOTHING = 0.16

// Smoothstep: zero slope at both ends, so a card neither snaps into its tilt
// nor stops dead the instant it flattens.
const smoothstep = (t) => t * t * (3 - 2 * t)
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Brand blue, the same one the hero and navbar are painted in.
const BRAND_BLUE = '#1500E1'
// neutral/300 in the design file — the tag outline on a white card.
const NEUTRAL_300 = '#D0D5DD'

// What each card variant is painted as. `onLight` drives the text colour and
// the hover chip, so a coloured card is treated like the black one rather than
// needing a second boolean at every use site.
// Figma 652:1114 / 652:1128 — the chips on the two dark surfaces are outlined
// in half-opacity white, not solid, so the outline sits back from the label.
const CHIP_BORDER_ON_DARK = 'rgba(255,255,255,0.5)'

// A project whose tile is white has no edge of its own, so where it sits on
// something equally pale it gets one. neutral/200.
const LOGO_TILE_OUTLINE = '1px solid #E3E6EB'

const CARD_SURFACES = {
  dark: { background: '#000', border: 'none', onLight: false, chipBorder: CHIP_BORDER_ON_DARK },
  light: { background: '#fff', border: '1px solid #D0D5DD', onLight: true, chipBorder: NEUTRAL_300 },
  primary: { background: BRAND_BLUE, border: 'none', onLight: false, chipBorder: CHIP_BORDER_ON_DARK },
}

// The project mark, on its white tile. Figma 686:3000 (desktop, in the copy
// column) and 694:6619 (stacked, overlaid on the thumbnail). The mark keeps a
// fixed share of the tile at both sizes, so one set of fractions covers both.
const LOGO_TILE_DESKTOP = fluidSpace(62)
const LOGO_TILE_STACKED = 40
const LOGO_TILE_RADIUS_DESKTOP = fluidSpace(13.286)
const LOGO_TILE_RADIUS_STACKED = 8.571
// Gap between the mark and the title block beneath it, desktop only.
const LOGO_GAP = fluidSpace(40)

// How far the stacked card's tile is inset from the thumbnail's bottom-left.
const LOGO_INSET_STACKED = 10

// Thumbnail corner. The stacked card's is smaller because the card itself is.
const THUMB_RADIUS_DESKTOP = fluidSpace(20)
const THUMB_RADIUS_STACKED = 14

// The whole CTA sentence is revealed, so the wipe starts on its very first
// word rather than picking up halfway through.
const ctaWords =
  'Behind every design is a series of questions, ideas, and decisions. See how I turn ideas into thoughtful experiences.'.split(
    ' '
  )

export default function Works() {
  const sectionRef = useRef(null)
  const highlightRef = useRef(null)
  const bgRef = useRef(null)
  const titleRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const titleWrapRef = useRef(null)
  const cardsWrapRef = useRef(null)
  const ctaWrapRef = useRef(null)
  const tooltipRef = useRef(null)
  const mouseClient = useRef({ x: 0, y: 0 })
  // Tablet renders the desktop layout, so every branch below keys off true
  // mobile rather than useBreakpoint's isMobile (which folds tablet in).
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  // Tablet takes the desktop section chrome (max width, fluid padding, the full
  // stacking animation) but the stacked card: side by side, its copy column is
  // only ~300px wide at 768.
  const stacked = !isDesktop

  // Tablet keeps the figures it has at 768 and grows them with the viewport
  // from there, the same whole-layout ramp every section below desktop uses.
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const sl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)
  const sn = (n) => (isTablet ? `calc(-1 * ${scaleTablet(n)})` : -n)

  const titleStyle = isMobile
    ? { fontSize: 36, lineHeight: '42px', letterSpacing: 0 }
    : isTablet
    ? { fontSize: s(43), lineHeight: sl(50), letterSpacing: sn(3) }
    : { fontSize: fluid(43, 60), lineHeight: fluid(50, 70), letterSpacing: -3 }

  // Geist/24/Light, flat on every breakpoint — what both the desktop (652:718)
  // and mobile (656:1618) frames specify. Tracking as the -2% the token states
  // rather than the px it resolves to, so it stays correct if the size moves.
  const ctaStyle = isDesktop
    ? { ...fluidType(24, 34), letterSpacing: '-0.02em' }
    : { fontSize: s(24), lineHeight: sl(34), letterSpacing: '-0.02em' }

  // Same shape as the other sections: capped at CONTENT_MAX and centred, with
  // the shared fluid side padding. The gradient behind it stays full-bleed.
  // No `gap` here on purpose: the column's one gap used to set both the
  // title-to-cards and the cards-to-CTA spacing, and those want very different
  // values. Each is an explicit margin on the block below it instead.
  const contentStyle = isMobile
    ? { paddingTop: 200, paddingBottom: 80 }
    : {
        paddingTop: isTablet ? s(216) : fluid(216, 300),
        paddingBottom: isTablet ? s(72) : fluid(72, 100),
        // Tablet keeps its own 40 at 768, the inset every other section uses at
        // that size; only desktop rides the fluid ramp.
        paddingLeft: isTablet ? s(40) : fluid(72, 100),
        paddingRight: isTablet ? s(40) : fluid(72, 100),
        maxWidth: CONTENT_MAX,
        margin: '0 auto',
      }

  // Flat 60 on every breakpoint. This used to be fluid(43, 60), which quietly
  // dropped to 43 below 1440 — tablet included.
  const titleGap = s(60)

  const bgStyle = isMobile
    ? { top: '-350px', height: '800px' }
    : { top: '-641px', height: '1413px' }

  // One rhythm for the heading and the card stack: each starts rising as its
  // top enters the viewport and settles once it has crossed to `parallaxEnd`.
  // Only the travel distance differs, which is what reads as depth. The CTA
  // below is deliberately left out — it only gets the colour wipe.
  const animConfig = isMobile
    ? {
        bgYFrom: 200, bgYTo: -60, bgStart: 'top 120%', bgEnd: 'top 10%',
        titleY: 70, cardsY: 100, parallaxEnd: 'top 55%', scrub: 1.1,
      }
    : {
        bgYFrom: 300, bgYTo: -150, bgStart: 'top bottom', bgEnd: 'center center',
        titleY: 110, cardsY: 170, parallaxEnd: 'top 45%', scrub: 1.2,
      }

  const cardInnerRefs = useRef([])
  const cardStickyRefs = useRef([])

  // Cards are not the same height on their own -- copy length decides that, and
  // on a narrow column the difference runs to dozens of pixels. Two things go
  // wrong when they differ, and both are fixed here.
  //
  // Stacked, the cards are meant to land exactly on top of one another, so a
  // taller one hangs out below the card covering it. Every card is held to the
  // tallest one's height instead, and `justify-content` drops the slack under
  // the copy rather than leaving it as a gap in the middle.
  //
  // Whatever height difference is left over, a sticky child still cannot travel
  // past its parent's content box: its floor is that box's bottom less its own
  // height, so a taller card reaches its floor first and slides out from under
  // the stack while the rest are still pinned. Padding each wrapper out to the
  // tallest card puts all the floors in the same place. The space that padding
  // would add between cards is taken straight back off the card below, and the
  // last card's off the container, so neither the layout nor the scroll length
  // changes.
  useLayoutEffect(() => {
    const equalise = () => {
      const wraps = cardStickyRefs.current
      const cards = cardInnerRefs.current
      const container = cardsContainerRef.current
      if (!container || wraps.some((w) => !w) || cards.some((c) => !c)) return

      // Cleared before measuring, or each pass would read back the height the
      // last one imposed and the cards could only ever grow.
      cards.forEach((c) => { c.style.minHeight = '' })
      if (stacked) {
        const natural = Math.max(...cards.map((c) => c.offsetHeight))
        cards.forEach((c) => { c.style.minHeight = `${natural}px` })
      }

      const heights = cards.map((c) => c.offsetHeight)
      const tallest = Math.max(...heights)
      const slack = heights.map((h) => tallest - h)

      // Written only when it actually changes: these are layout writes, and
      // ScrollTrigger's refresh would otherwise keep retriggering itself.
      const put = (el, prop, value) => {
        if (el.style[prop] !== value) el.style[prop] = value
      }
      wraps.forEach((w, i) => {
        put(w, 'marginBottom', `${slack[i]}px`)
        put(w, 'marginTop', i > 0 ? `${-slack[i - 1]}px` : '0px')
      })
      put(container, 'marginBottom', `${-slack[slack.length - 1]}px`)
    }

    equalise()
    ScrollTrigger.addEventListener('refresh', equalise)
    return () => ScrollTrigger.removeEventListener('refresh', equalise)
  }, [stacked, isTablet, isMobile])
  // Rendered tilt (0..1 per card), kept between frames so it can be eased
  // towards its target rather than snapped to it.
  const stackState = useRef({ tilt: [] })

  // One pass over the stack, run from a frame loop rather than from the scroll
  // event. Sticky positioning does not play well with scrubbed ScrollTriggers
  // (the trigger measures layout, not the pinned position), so this is measured
  // from live rects. `settle` snaps straight to the target instead of easing,
  // for the first paint and after a resize.
  const stackFrame = useCallback((settle) => {
    const stackTop = stacked ? STACK_TOP_MOBILE : STACK_TOP
    const cards = cardInnerRefs.current
    const wrap = cardsWrapRef.current
    if (!wrap) return
    const state = stackState.current
    const k = settle ? 1 : SMOOTHING

    const wrapRect = wrap.getBoundingClientRect()
    const vh = window.innerHeight
    // Nothing on screen to move; leave the last values in place.
    if (wrapRect.bottom < -vh || wrapRect.top > vh * 2) return

    // 1. Vertical (rotateX) tilt as each card rises up to lock into the stack,
    //    so the stacking motion reads clearly.
    for (let i = 0; i < cards.length; i++) {
      const el = cards[i]
      if (!el) continue
      const wrapTop = el.parentElement.getBoundingClientRect().top
      // Distance the card still has to cover before it locks in place.
      const gap = wrapTop - stackTop

      // 1 while the card is still travelling up, 0 once it locks in place
      const target = smoothstep(clamp01(gap / TILT_DISTANCE))
      const current = state.tilt[i] ?? target
      const next = current + (target - current) * k
      state.tilt[i] = next

      // Arrival cushion: eases a card to a standstill on the pin instead of
      // letting sticky catch it at full speed. Written straight through, never
      // smoothed — the curve already leaves and lands at the right speed, and
      // lagging it would put the card out of step with the pin it is aiming
      // for. The last card is skipped: it never rests, the whole stack unpins
      // the moment it lands, so slowing it there would only be a hitch before
      // it picks the page's speed back up.
      let lift = 0
      const rests = i < caseStudies.length - 1
      if (rests && gap > 0 && gap < ARRIVAL_CUSHION) {
        lift = ARRIVAL_CUSHION * arrivalEase(gap / ARRIVAL_CUSHION) - gap
      }

      el.style.transform =
        `perspective(1000px) translate3d(0, ${lift.toFixed(2)}px, 0) ` +
        `rotateX(${(TILT_MAX * next).toFixed(3)}deg)`
    }

  }, [stacked])

  const checkInCards = useCallback(() => {
    if (isMobile || !cardsContainerRef.current || !tooltipRef.current) return
    const rect = cardsContainerRef.current.getBoundingClientRect()
    const { x, y } = mouseClient.current
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    tooltipRef.current.style.opacity = inside ? '1' : '0'
    if (inside) {
      const sectionRect = sectionRef.current.getBoundingClientRect()
      tooltipRef.current.style.left = `${x - sectionRect.left + 16}px`
      tooltipRef.current.style.top = `${y - sectionRect.top + 16}px`

      // Topmost card under the cursor decides the tooltip colour: over a
      // white (light) card use a translucent-black chip, otherwise the
      // translucent-white chip (as in the Nebula section). Text stays white.
      let overLight = false
      const cards = cardInnerRefs.current
      for (let i = cards.length - 1; i >= 0; i--) {
        const el = cards[i]
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          overLight = CARD_SURFACES[caseStudies[i].variant].onLight
          break
        }
      }
      tooltipRef.current.style.background = overLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'
    }
  }, [isMobile])

  const handleMouseMove = useCallback((e) => {
    mouseClient.current = { x: e.clientX, y: e.clientY }
    checkInCards()
  }, [checkInCards])

  const handleMouseLeave = useCallback(() => {
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
  }, [])

  useLayoutEffect(() => {
    const onGlobalMove = (e) => {
      mouseClient.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onGlobalMove, { passive: true })
    window.addEventListener('scroll', checkInCards, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onGlobalMove)
      window.removeEventListener('scroll', checkInCards)
    }
  }, [checkInCards])

  useLayoutEffect(() => {
    // Driven per frame rather than per scroll event: the easing above has to
    // keep converging after the scroll itself has stopped, and one batched
    // read/write per frame keeps this off the scroll handler's critical path.
    let raf = 0
    const loop = () => {
      stackFrame(false)
      raf = requestAnimationFrame(loop)
    }
    const onResize = () => stackFrame(true)

    stackFrame(true)
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [stackFrame])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bgRef.current, { y: animConfig.bgYFrom })
      gsap.to(bgRef.current, {
        y: animConfig.bgYTo,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: animConfig.bgStart,
          // The carousel version used 'center center', but the section is now
          // much taller (stacking cards) which stretches the parallax and leaves
          // the gradient sitting over the title. Reproduce the carousel's scroll
          // distance instead: 'center center' of a ~1163px-tall section, i.e.
          // half that height plus half the viewport measured from 'top bottom'.
          end: isMobile ? animConfig.bgEnd : () => '+=' + Math.round(LEGACY_HALF_SECTION + window.innerHeight / 2),
          scrub: 1.5,
        }
      })

      // Each group is triggered by its own static wrapper rather than by the
      // section or by itself, so the trigger points are measured from untouched
      // layout positions and the three parallaxes stay in step with each other.
      const rise = (target, trigger, distance) =>
        gsap.fromTo(target,
          { y: distance },
          {
            y: 0, ease: 'none',
            scrollTrigger: {
              trigger,
              start: 'top bottom',
              end: animConfig.parallaxEnd,
              scrub: animConfig.scrub,
              invalidateOnRefresh: true,
            }
          }
        )

      rise(titleRef.current, titleWrapRef.current, animConfig.titleY)
      // The cards themselves are sticky, so this settles back to y: 0 well
      // before the first card reaches its stacking offset — no pinned card ever
      // renders while the group is still displaced.
      rise(cardsContainerRef.current, cardsWrapRef.current, animConfig.cardsY)

      if (highlightRef.current) {
        const chars = highlightRef.current.querySelectorAll('.char-highlight')
        gsap.fromTo(
          chars,
          { color: isMobile ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' },
          {
            color: 'rgba(0,0,0,1)',
            stagger: 0.02,
            ease: 'none',
            scrollTrigger: {
              // Widened from 'top 40%': the sweep now covers roughly two and a
              // half times as many characters, so it needs more scroll to read
              // at the same pace.
              trigger: ctaWrapRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1,
            },
          }
        )
      }
    }, sectionRef)

    // Recalculate all trigger positions once the initial layout has settled,
    // so downstream sections (e.g. the video-intro phone parallax) stay aligned.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [isMobile])

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative bg-white overflow-clip"
      style={isMobile ? { marginBottom: -1 } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!isMobile && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-50 flex items-center justify-center rounded-[99px] bg-white/20 backdrop-blur-md font-light font-['Geist'] text-white tracking-[0px] whitespace-nowrap"
          style={{
            opacity: 0,
            paddingLeft: fluidSpace(14), paddingRight: fluidSpace(14),
            paddingTop: fluidSpace(6), paddingBottom: fluidSpace(6),
            // Already at the scale's floor, so the label holds at 14/20.
            ...fluidType(14, 20),
          }}
        >
          Details
        </div>
      )}

      <div
        className="absolute left-0 w-full pointer-events-none"
        style={bgStyle}
      >
        <div ref={bgRef} className="w-full h-full">
          <img src={bgGradient} alt="" className="w-full h-full object-cover object-top" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center" style={contentStyle}>

        <div ref={titleWrapRef} className="w-full">
          <h2 ref={titleRef} className="w-full flex flex-col items-center">
            <span className="block text-black font-light font-['Geist'] text-center" style={titleStyle}>
              Designing products
            </span>
            <span className="block text-black font-light font-['Geist'] text-center" style={titleStyle}>
              that people love to use
            </span>
          </h2>
        </div>

        <div ref={cardsWrapRef} className="w-full" style={{ marginTop: titleGap }}>
        <div
          ref={cardsContainerRef}
          className="w-full flex flex-col"
          style={{
            padding: isMobile ? `0 ${CARD_INSET_MOBILE}px` : 0,
            gap: isMobile ? CARD_GAP_MOBILE : `${CARD_GAP}vh`,
            ...(isTablet ? { maxWidth: s(CARD_MAX_TABLET), margin: '0 auto' } : {}),
          }}
        >
          {caseStudies.map((study, i) => {
            const surface = CARD_SURFACES[study.variant]
            const textColor = surface.onLight ? 'text-black' : 'text-white'

            // A card links exactly when its detail page has been written --
            // asked of the story itself rather than tracked by a flag beside
            // it. The rest still render as anchors so nothing about the layout
            // shifts, but they have no href and so are not clickable.
            const detailHref = getStory(study.id) ? caseStudyPath(study) : undefined

            // The mark on its tile. Same piece either way; only the size and
            // where it is anchored differ.
            const tile = study.logo
            // A white tile needs an edge wherever what is behind it is pale:
            // always on the stacked card, where it lies on the thumbnail, and
            // on desktop only over the white card. A coloured tile carries its
            // own edge and never takes one.
            const tileOutlined = tile.outlined && (stacked || surface.onLight)

            const logoTile = (size, radius, extraStyle) => (
              <div
                className="flex items-center justify-center shrink-0 overflow-hidden"
                style={{
                  width: size,
                  height: size,
                  borderRadius: radius,
                  background: tile.fill,
                  // outline rather than border: a border would shrink the
                  // content box and with it the mark, which is sized as a
                  // fraction of the tile. Inset by its own width so it draws
                  // exactly where a border would.
                  outline: tileOutlined ? LOGO_TILE_OUTLINE : 'none',
                  outlineOffset: '-1px',
                  ...extraStyle,
                }}
              >
                <img
                  src={tile.src}
                  alt=""
                  style={{ width: `${tile.markW * 100}%`, height: `${tile.markH * 100}%` }}
                />
              </div>
            )

            const thumbRadius = stacked ? s(THUMB_RADIUS_STACKED) : THUMB_RADIUS_DESKTOP

            const artwork = (
              <div
                className="relative overflow-hidden"
                style={{
                  ...(stacked ? { width: '100%' } : { flex: '1 0 0', minWidth: 0 }),
                  // Figma 694:6617 / 686:2951 — 3200x2400 and 800x600, both 4:3.
                  // Held as a ratio rather than a size so it survives every
                  // breakpoint.
                  aspectRatio: '4 / 3',
                  borderRadius: thumbRadius,
                }}
              >
                <img
                  src={study.thumbnail}
                  alt={study.name}
                  className={`w-full h-full object-cover ${isDesktop ? 'transition-transform duration-700 ease-out group-hover:scale-105' : ''}`}
                  style={{ borderRadius: thumbRadius }}
                />
                {/* Stacked cards have no room for the mark beside the copy, so
                    it sits in the thumbnail's bottom-left instead. */}
                {stacked && logoTile(s(LOGO_TILE_STACKED), s(LOGO_TILE_RADIUS_STACKED), {
                  position: 'absolute',
                  left: s(LOGO_INSET_STACKED),
                  bottom: s(LOGO_INSET_STACKED),
                })}
              </div>
            )

            const copy = (
              <div className="flex flex-col" style={{ gap: stacked ? s(14) : fluidSpace(14) }}>
                <p
                  className={`font-light font-['Geist'] ${textColor}`}
                  style={{
                    fontSize: stacked ? s(30) : fluid(30, 40),
                    lineHeight: stacked ? sl(36) : fluid(36, 46),
                    letterSpacing: stacked ? sn(0.6) : -0.8,
                  }}
                >
                  {study.name}
                </p>
                <p
                  className={`font-light font-['Geist'] ${textColor}`}
                  style={{
                    fontSize: stacked ? s(16) : fluid(15, 18),
                    lineHeight: stacked ? sl(22) : fluid(22, 26),
                    letterSpacing: stacked ? 0 : -0.36,
                  }}
                >
                  {study.description}
                </p>
              </div>
            )

            const tagRow = (
              <div className="flex flex-wrap" style={{ gap: stacked ? 10 : fluidSpace(10) }}>
                {study.services.map((tag) => (
                  <span
                    key={tag}
                    className={`font-light font-['Geist'] whitespace-nowrap ${textColor}`}
                    style={{
                      // Spelled out rather than left to the `border: 1px solid`
                      // shorthand, which resets the colour to currentColor and
                      // beats any border class — that is what was painting the
                      // white card's tags black instead of neutral/300.
                      border: `1px solid ${surface.chipBorder}`,
                      // Pill either way, so the corner holds; the box rides
                      // the ramp instead.
                      borderRadius: 30,
                      height: stacked ? s(34) : fluidSpace(38),
                      padding: stacked ? `0 ${isTablet ? scaleTablet(12) : '12px'}` : `0 ${fluidSpace(14)}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(stacked
                        ? { fontSize: s(14), lineHeight: sl(20) }
                        : fluidType(16, 22)),
                      letterSpacing: stacked ? sn(0.28) : 0,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )

            return (
              <div
                key={i}
                ref={(el) => (cardStickyRefs.current[i] = el)}
                style={{
                  position: 'sticky',
                  top: `${stacked ? STACK_TOP_MOBILE : STACK_TOP}px`,
                  zIndex: i + 1,
                }}
              >
                <a
                  href={detailHref}
                  onClick={(e) => {
                    if (!detailHref) return
                    // In-app route rather than a page load: the site routes on
                    // pathname, and a plain navigation would throw away the
                    // loaded bundle.
                    e.preventDefault()
                    navigate(detailHref)
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  ref={(el) => (cardInnerRefs.current[i] = el)}
                  className={`case-card block overflow-hidden group ${detailHref ? 'cursor-pointer' : ''}`}
                  style={{
                    background: surface.background,
                    border: surface.border,
                    borderRadius: stacked ? 30 : fluidSpace(30),
                    padding: stacked ? s(20) : fluid(30, 50),
                    display: 'flex',
                    // Mobile and tablet stack the image above the copy; desktop
                    // sets the copy beside it.
                    flexDirection: stacked ? 'column' : 'row',
                    gap: stacked ? s(40) : fluid(30, 50),
                    // Stacked wants full-width children; the desktop row must
                    // align to the top instead, or a copy column taller than
                    // the thumbnail would stretch it out of its 4:3.
                    alignItems: stacked ? 'stretch' : 'flex-start',
                    // Every stacked card is held to the tallest one's height so
                    // they overlap exactly, and the slack it leaves goes below
                    // the copy — the chips sit on the card's foot the way the
                    // desktop column already pins them.
                    justifyContent: stacked ? 'space-between' : undefined,
                    textDecoration: 'none',
                    transformOrigin: 'center top',
                    willChange: 'transform',
                  }}
                >
                  {stacked ? (
                    <>
                      {/* Image and copy travel together at the top; the chips
                          are the piece that gets pushed to the foot. */}
                      <div className="flex flex-col w-full" style={{ gap: s(40) }}>
                        {artwork}
                        {copy}
                      </div>
                      {tagRow}
                    </>
                  ) : (
                    <div
                      className="flex flex-col justify-between overflow-hidden"
                      style={{ flex: '1 0 0', minWidth: 0, alignSelf: 'stretch' }}
                    >
                      {/* Mark and copy travel together at the top of the
                          column; the chips stay pinned to its foot. */}
                      <div className="flex flex-col" style={{ gap: LOGO_GAP }}>
                        {logoTile(LOGO_TILE_DESKTOP, LOGO_TILE_RADIUS_DESKTOP)}
                        {copy}
                      </div>
                      {tagRow}
                    </div>
                  )}
                  {!stacked && artwork}
                </a>
              </div>
            )
          })}
          {/* No trailing spacer on purpose. A sticky child cannot travel past
              its parent's content box, so with the last card ending the
              container every card hits its floor at the same moment — the one
              the last card lands on. The stack releases as one piece with the
              CTA already sitting 20px under it, and there is no held stretch
              to scroll through first. */}
        </div>
        </div>

        <div ref={ctaWrapRef} className="w-full flex justify-center" style={{ marginTop: s(CTA_GAP) }}>
        <div
          className="flex flex-col items-center"
          style={{
            gap: isDesktop ? fluidSpace(30) : 30,
            padding: `0 ${isDesktop ? fluidSpace(20) : '20px'}`,
            maxWidth: isDesktop ? fluidSpace(700) : 700,
          }}
        >
          <p ref={highlightRef} className="text-center font-light font-['Geist']" style={ctaStyle}>
            {ctaWords.map((w, i) => (
              <CharWord key={i} word={w} isLast={i === ctaWords.length - 1} initialColor="rgba(0,0,0,0.3)" />
            ))}
          </p>
          <RollingButton label="Explore More Case Studies" to={CASE_STUDY_BASE} />
        </div>
        </div>

      </div>
    </section>
  )
}
