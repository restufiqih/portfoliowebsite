import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../Navbar'
import FooterWash from '../FooterWash'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluidBetween, fluidSpace, fluidType } from '../../utils/fluid'
import { caseStudies, caseStudyPath } from '../../data/caseStudies'
import { getStory } from '../../data/stories'
import { navigate } from '../../utils/route'

gsap.registerPlugin(ScrollTrigger)

// The work index. Two frames are drawn — 1440 (Figma 811:1535) and 390
// (813:22671) — and they agree on every figure inside a card: the tile is 62,
// the gaps 20 and 4 and 10, the chips 34 tall, the name 22/30 on both. So below
// desktop those are taken as drawn rather than scaled, and desktop is the only
// range that ramps them. What the two frames do disagree on — the side padding,
// the hero's type, the column count — is named separately below.

const HEADER_H = 104
const HEADER_H_MOBILE = 74
const CONTENT_MAX = 1440

// 100 down each side at 1440, 16 at 390, 40 across the tablet range. The ramp
// between the two small figures ends at 768 rather than running on to 1024, so
// the tablet range holds exactly 40 instead of drifting past it.
const SIDE_PAD = 100
const SIDE_PAD_MOBILE = 16
const SIDE_PAD_TABLET = 40
const TABLET_VW = 768
const MOBILE_VW = 390

// 813:22483 / 813:22802 — the hero is only its own padding and two lines of
// type. Both frames pad it by 80; only the type differs, 60/70 at 1440 against
// 30/36 at 390. Below desktop it runs from that 30/36 up to the 43/50 the
// desktop ramp starts at, so the two meet without a step.
const HERO_PAD_Y = 80
const HERO_TYPE_MOBILE = { size: [30, 43], line: [36, 50] }

// 811:1556 — the grid's foot at 1440. Nothing above it: the cards run straight
// on from the hero's own 80, which is also what the 390 frame does.
const GRID_PAD_BOTTOM = 50
const ROW_GAP = 80
const COLUMN_GAP = 100

// 813:21737 — the right-hand card starts 200 lower than the left, which is what
// gives the page its stagger.
const STAGGER = 200

// How many cards join the opening. The first two are the ones on screen when
// the page loads, so they arrive with the hero. Every card gets the scroll
// parallax on top of that — the two run on separate elements so they compose
// instead of fighting over the same transform.
const OPENING_CARDS = 2

const NEUTRAL_200 = '#E3E6EB'
const NEUTRAL_300 = '#D0D5DD'
const TAGLINE_COLOR = 'rgba(0,0,0,0.7)'

// Every tracked size on this frame is -2% except the hero, which is -4%.
const TRACKING = '-0.02em'
const HERO_TRACKING = '-0.04em'

function buildRamp(isDesktop) {
  // Both frames give the same figure, so below desktop it is used as drawn.
  // Always a CSS length, never a bare number: several of these are read back
  // inside a template string, where a unitless value would silently void the
  // whole declaration.
  const L = (x) => (isDesktop ? fluidSpace(x) : `${x}px`)
  const T = (size, line) =>
    isDesktop ? fluidType(size, line) : { fontSize: size, lineHeight: `${line}px` }

  // clamp's own ceiling holds it at 40 for anything wider than 768.
  const sidePad = isDesktop
    ? fluidSpace(SIDE_PAD)
    : fluidBetween(SIDE_PAD_MOBILE, SIDE_PAD_TABLET, MOBILE_VW, TABLET_VW)

  const heroType = isDesktop
    ? { ...fluidType(60, 70), letterSpacing: HERO_TRACKING }
    : {
        fontSize: fluidBetween(...HERO_TYPE_MOBILE.size, MOBILE_VW, 1024),
        lineHeight: fluidBetween(...HERO_TYPE_MOBILE.line, MOBILE_VW, 1024),
        // 813:22803 tracks at -2%, where the 1440 frame tracks at -4%.
        letterSpacing: TRACKING,
      }

  return { L, T, sidePad, heroType, isDesktop }
}

// 811:1715 — one project. The whole card is the link; it only carries an href
// once that project's detail page has been written, the same test the landing
// page's cards use.
function WorkCard({ study, staggered, ui, parallaxRef, openingRef }) {
  const { L, T } = ui
  const href = getStory(study.id) ? caseStudyPath(study) : undefined
  const tile = study.logo

  return (
    // Two elements, two jobs: the wrapper is what the scroll parallax moves,
    // the anchor inside is what the opening fades and lifts. Stacked, they
    // compose; on one element they would overwrite each other's transform.
    <div
      ref={parallaxRef}
      className="w-full"
      style={{ marginTop: staggered ? L(STAGGER) : 0 }}
    >
    <a
      ref={openingRef}
      href={href}
      onClick={(e) => {
        if (!href) return
        // In-app route rather than a page load: the site routes on pathname.
        e.preventDefault()
        navigate(href)
        window.scrollTo({ top: 0, behavior: 'auto' })
      }}
      className={`flex flex-col w-full group ${href ? 'cursor-pointer' : ''}`}
      style={{ gap: L(20), textDecoration: 'none' }}
    >
      {/* 813:21709 — the artwork, with the mark laid into its bottom-left. */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '4 / 3', borderRadius: L(20) }}
      >
        <img
          src={study.thumbnail}
          alt={study.name}
          loading="lazy"
          className={`w-full h-full object-cover ${ui.isDesktop && href ? 'transition-transform duration-700 ease-out group-hover:scale-105' : ''}`}
        />
        <div
          className="absolute flex items-center justify-center overflow-hidden"
          style={{
            left: L(20),
            bottom: L(19.5),
            width: L(62),
            height: L(62),
            borderRadius: L(13.286),
            // Each project brings its own tile fill, and only a white one needs
            // an edge to read against the artwork — a coloured tile carries its
            // own. Catatmak's fill is what draws the ring around its mark, so
            // hardcoding white here left that ring white instead of blue.
            background: tile.fill,
            // outline rather than border: a border would shrink the content box
            // and with it the mark, which is sized as a fraction of the tile.
            outline: tile.outlined ? `1px solid ${NEUTRAL_200}` : 'none',
            outlineOffset: '-1px',
          }}
        >
          <img
            src={tile.src}
            alt=""
            style={{ width: `${tile.markW * 100}%`, height: `${tile.markH * 100}%` }}
          />
        </div>
      </div>

      {/* 811:1716 — the name, what it is, and what it took. */}
      <div className="flex flex-col w-full" style={{ gap: L(20) }}>
        <div className="flex flex-col w-full" style={{ gap: L(4) }}>
          <p
            className="font-light font-['Geist'] text-black"
            style={{ ...T(22, 30), letterSpacing: TRACKING }}
          >
            {study.name}
          </p>
          <p
            className="font-light font-['Geist']"
            style={{ ...T(16, 22), color: TAGLINE_COLOR }}
          >
            {study.tagline}
          </p>
        </div>
        <div className="flex flex-wrap" style={{ gap: L(10) }}>
          {study.services.map((service) => (
            <span
              key={service}
              className="inline-flex items-center justify-center shrink-0 whitespace-nowrap font-light font-['Geist'] text-black"
              style={{
                ...T(14, 20),
                letterSpacing: TRACKING,
                height: L(34),
                padding: `0 ${L(12)}`,
                // A pill, so the corner holds while the box rides the ramp.
                borderRadius: 30,
                // The frame's 125x34 already contains its stroke (12 + label +
                // 12), so a border — which would push the chip 2px wider — is
                // drawn as an inset outline instead. neutral/300 here, a shade
                // darker than the tile's edge.
                outline: `1px solid ${NEUTRAL_300}`,
                outlineOffset: '-1px',
              }}
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </a>
    </div>
  )
}

export default function WorkList() {
  const { isDesktop } = useBreakpoint()
  const ui = buildRamp(isDesktop)
  const { L } = ui

  const rootRef = useRef(null)
  const heroLineRefs = useRef([])
  const parallaxRefs = useRef([])
  const openingRefs = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const opening_ = openingRefs.current.filter(Boolean)
      const parallax_ = parallaxRefs.current.filter(Boolean)

      // ——— Opening ———————————————————————————————————————————————————————
      // The hero lines rise and clear, then the cards already on screen follow
      // them in. Same entrance the landing hero and the About page use.
      // Start state set outright rather than through fromTo's immediateRender,
      // which does not reliably paint when the tween sits later than 0 on a
      // timeline. Same shape the navbar uses.
      const lines = heroLineRefs.current.filter(Boolean)
      const firstCards = opening_.slice(0, OPENING_CARDS)

      gsap.set(lines, { y: 40, opacity: 0, filter: 'blur(10px)' })
      gsap.set(firstCards, { y: 60, opacity: 0 })

      const opening = gsap.timeline({ defaults: { ease: 'power3.out' } })
      opening.to(lines, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12 }, 0.15)
      opening.to(
        firstCards,
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
        // Overlapped with the tail of the hero so the page arrives as one move
        // rather than as two separate ones.
        '-=0.55'
      )

      // ——— Scroll parallax ———————————————————————————————————————————————
      // Every card rises into place as it arrives, scrubbed against its own
      // position the way the About page's rows are. Each is its own trigger, so
      // the staggered right-hand column keeps its own timing rather than
      // borrowing the row's.
      parallax_.forEach((card) => {
        gsap.fromTo(card,
          { y: isDesktop ? 90 : 60 },
          {
            y: 0, ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: isDesktop ? 'top 45%' : 'top 55%',
              scrub: isDesktop ? 1.2 : 1.1,
              invalidateOnRefresh: true,
            },
          }
        )
      })
    }, rootRef)

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [isDesktop])

  return (
    <div className="bg-white" ref={rootRef}>
      <Navbar onLight />

      {/* The navbar renders absolutely positioned, so the page reserves the
          header band itself. */}
      <div style={{ height: isDesktop ? HEADER_H : HEADER_H_MOBILE }} />

      {/* 813:22483 */}
      <section
        className="flex flex-col items-center w-full"
        style={{
          maxWidth: CONTENT_MAX,
          margin: '0 auto',
          padding: `${L(HERO_PAD_Y)} ${ui.sidePad}`,
        }}
      >
        <h1
          className="font-light font-['Geist'] text-black text-center w-full"
          style={ui.heroType}
        >
          <span className="block" ref={(el) => (heroLineRefs.current[0] = el)}>
            Behind every screen,
          </span>
          <span className="block" ref={(el) => (heroLineRefs.current[1] = el)}>
            a story worth telling.
          </span>
        </h1>
      </section>

      <FooterWash>
        {/* 811:1558 — two columns at 1440, the right one dropped by STAGGER.
            Below desktop there is only one, so nothing is staggered. */}
        <div
          className="relative z-10 w-full"
          style={{
            maxWidth: CONTENT_MAX,
            margin: '0 auto',
            paddingTop: 0,
            paddingBottom: isDesktop ? L(GRID_PAD_BOTTOM) : 0,
            paddingLeft: ui.sidePad,
            paddingRight: ui.sidePad,
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            columnGap: L(COLUMN_GAP),
            rowGap: L(ROW_GAP),
            alignItems: 'start',
          }}
        >
          {caseStudies.map((study, i) => (
            <WorkCard
              key={study.id}
              study={study}
              staggered={isDesktop && i % 2 === 1}
              ui={ui}
              parallaxRef={(el) => (parallaxRefs.current[i] = el)}
              openingRef={(el) => (openingRefs.current[i] = el)}
            />
          ))}
        </div>
      </FooterWash>
    </div>
  )
}
