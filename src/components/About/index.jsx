import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../Navbar'
import Nebula from '../Nebula'
import UpworkCard from '../UpworkCard'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid, scaleTablet } from '../../utils/fluid'

import bgGradient from '../../assets/works/bg-gradient.png'
import testimonialBg from '../../assets/testimonial-bg.png'
import portrait from '../../assets/about/portrait.png'

gsap.registerPlugin(ScrollTrigger)

// Same rule as the landing page: content capped at 1440 and centred, sections
// themselves full-bleed so the gradients still reach both edges.
const CONTENT_MAX = 1440

// Two-column measure from the design: a right-aligned label, then the body.
// The pair spans 355..1085 in a 1440 frame, i.e. centred with a 60px gutter.
const LABEL_W = 170
const BODY_W = 500
const COLUMN_GAP = 60

// Widest the stacked copy gets before it is centred, matching the tablet cap
// the other sections already use.
const DETAIL_MAX = 500

// Vertical rhythm, straight off the frame: the hero box is 698 tall, the copy
// starts 420 below the hero, rows sit 160 apart, and 500 of gradient runs out
// before the footer.
// The navbar renders absolutely positioned, so the hero has to reserve the
// header band itself — 104 in the frame, which is also the bottom padding.
const HEADER_H = 104
const HEADER_H_MOBILE = 74
const COPY_TOP = 300
const ROW_GAP = 160
const STACKED_ROW_GAP = 100
const COPY_TAIL = 400

// Half the height of the section the Works gradient was tuned against. Its
// travel is anchored to it there, and reusing the number keeps this gradient
// clearing the copy at the same point.
const LEGACY_HALF_SECTION = 582

const BRAND_BLUE = '#1500E1'
const NEUTRAL_500 = '#667085'

const sections = [
  {
    label: null,
    portrait: true,
    paragraphs: [
      "Hi, I'm Akhdiyat Restu Fiqih. A UI/UX Designer with 6+ years of experience designing digital products for global clients. Currently Top Rated Plus on Upwork, a status held by the top 3% of freelancers worldwide.",
      'I design with a clear goal: making products that are easy to use and solve real problems. I handle the full process, from research and user flows to wireframes, prototypes, and design systems. If something isn’t working for the user, I find the root cause and fix it through design.',
      "I work best when I'm close to the team. I collaborate with founders, developers, and product managers to make sure every design decision is grounded in real context, not just assumptions.",
    ],
  },
  {
    label: 'How I work',
    paragraphs: [
      'I start by listening. To the team, to the users, and to the product itself. I want to understand what the business needs, what users actually experience, and where the gap is between the two.',
      "I don't just design interfaces. I help shape the direction. What should this product feel like? What's unnecessary? What's missing? My job is to bring clarity to those questions before a single pixel is placed.",
      "I work closely with developers, product managers, and stakeholders to align on goals. My role is not just execution. It's bringing perspective, challenging what's unclear, and making sure the final product is better than what anyone originally imagined.",
      'When a product needs to scale, I build design systems so everything stays consistent as the team and product grow.',
    ],
  },
  {
    label: 'What I believe',
    paragraphs: [
      'I design to solve problems, not to follow trends. Every decision I make comes back to one question: does this make the experience clearer and easier for the user?',
      'Details matter to me. The spacing, the transitions, the way a component behaves on every screen size. I care about the small things because those are what make a product feel considered, not just completed.',
    ],
  },
  {
    label: "Where I've Been",
    paragraphs: [
      "I've had the chance to work with clients from different industries. SaaS, fintech, education, mobile apps. Each one came with different challenges, and that's honestly what helped me grow the most as a designer.",
      "Most of my work is through Upwork, where I've been fortunate enough to earn Top Rated Plus status over the years. I've also worked within product teams, designing alongside developers and stakeholders from early concept to final delivery.",
    ],
  },
]

const HERO_LOGO_PATH = 'M18.7287 53.9316C1.96206 41.0837 0.755327 16.9718 14.5157 6.90566C27.0797 -2.26138 41.5109 4.31798 43.1063 15.9573C44.7018 27.5966 40.0862 35.6597 30.0693 37.0093C20.0524 38.3589 20.6959 27.0142 30.0693 27.0142C37.9346 27.0142 46.7938 34.0838 52.2438 38.2245'

export default function About() {
  const heroRef = useRef(null)
  const heroLineRefs = useRef([])
  const bgRef = useRef(null)
  const bgOutRef = useRef(null)
  const bodyRef = useRef(null)
  const rowRefs = useRef([])
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const stacked = !isDesktop

  // Tablet holds its 768 figures and grows them with the viewport from there.
  const t = (n) => (isTablet ? scaleTablet(n) : n)
  const tl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)
  const tn = (n) => (isTablet ? `calc(-1 * ${scaleTablet(n)})` : -n)

  const heroStyle = isMobile
    ? { fontSize: 40, lineHeight: '46px', letterSpacing: -0.8 }
    : isTablet
      ? { fontSize: t(43), lineHeight: tl(52), letterSpacing: tn(1.72) }
      : { fontSize: fluid(50, 70), lineHeight: fluid(60, 84), letterSpacing: -2.8 }

  const bodyStyle = isMobile
    ? { fontSize: 16, lineHeight: '24px', letterSpacing: -0.32 }
    : { fontSize: t(18), lineHeight: tl(26), letterSpacing: tn(0.36) }

  // The hero keeps the 24 its own frame specifies; the detail block below runs
  // tighter on mobile.
  const sidePad = isMobile ? 24 : isTablet ? t(40) : fluid(72, 100)
  // Matches the Upwork section's rule exactly, so the performance card sits in
  // the same measure on both pages. At 40 the tablet inset was narrower than
  // Upwork's 72, which let the card grow wider here on a 768-wide screen.
  const detailSidePad = isMobile ? 16 : isTablet ? t(72) : fluid(72, 100)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero lines rise and clear as the page opens, the same entrance the
      // landing hero uses.
      gsap.fromTo(
        heroLineRefs.current.filter(Boolean),
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15,
        }
      )

      // Gradient parallax, matching the Works section: the wash drifts up as
      // the page scrolls so it clears the copy rather than sitting over it.
      gsap.set(bgRef.current, { y: isMobile ? 200 : 300 })
      gsap.to(bgRef.current, {
        y: isMobile ? -60 : -150,
        ease: 'none',
        scrollTrigger: {
          trigger: bodyRef.current,
          start: isMobile ? 'top 120%' : 'top bottom',
          end: isMobile
            ? 'top 10%'
            : () => '+=' + Math.round(LEGACY_HALF_SECTION + window.innerHeight / 2),
          scrub: 1.5,
        },
      })

      // Closing wash into Nebula — the same asset, placement and travel the
      // Testimonial section hands over with on the landing page.
      gsap.fromTo(bgOutRef.current,
        { y: -600 },
        {
          y: 300,
          ease: 'none',
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      )

      // Each row rises into place on entry — the same depth-by-distance rhythm
      // the landing sections use.
      rowRefs.current.filter(Boolean).forEach((row) => {
        gsap.fromTo(row,
          { y: isMobile ? 60 : 90 },
          {
            y: 0, ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: isMobile ? 'top 55%' : 'top 45%',
              scrub: isMobile ? 1.1 : 1.2,
              invalidateOnRefresh: true,
            },
          }
        )
      })
    }, heroRef)

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [isMobile])

  return (
    <div ref={heroRef} className="relative w-full bg-white" style={{ overflowX: 'clip' }}>
      {/* Hero — brand blue, full bleed */}
      <section
        className="relative w-full flex flex-col items-center"
        style={{
          background: BRAND_BLUE,
          paddingTop: isMobile ? HEADER_H_MOBILE : t(HEADER_H),
          minHeight: '100vh',
        }}
      >
        <Navbar />
        <div
          className="w-full flex flex-col items-center justify-center"
          style={{
            maxWidth: CONTENT_MAX,
            margin: '0 auto',
            paddingLeft: sidePad,
            paddingRight: sidePad,
            paddingBottom: isMobile ? HEADER_H_MOBILE : t(HEADER_H),
            flex: 1,
            // Mobile sets the mark on its own line above the sentence.
            gap: isMobile ? 50 : 0,
          }}
        >
          <div
            ref={(el) => (heroLineRefs.current[0] = el)}
            className="flex items-center justify-center"
            style={{ gap: isMobile ? 0 : t(24) }}
          >
            <svg
              width={isMobile ? 56 : isTablet ? t(42) : 56}
              height={isMobile ? 56 : isTablet ? t(42) : 56}
              viewBox="0 0 56 56"
              fill="none"
              aria-hidden
              className="shrink-0"
            >
              <path d={HERO_LOGO_PATH} stroke="white" strokeWidth="5" />
            </svg>
            {!isMobile && (
              <>
                <span
                  className="rounded-full bg-white shrink-0"
                  style={{ width: 8, height: 8 }}
                  aria-hidden
                />
                <p
                  className="text-white font-light font-['Geist'] text-center"
                  style={heroStyle}
                >
                  Top 3% UI/UX Designer on
                </p>
              </>
            )}
          </div>
          <p
            ref={(el) => (heroLineRefs.current[1] = el)}
            className="text-white font-light font-['Geist'] text-center"
            style={{ ...heroStyle, ...(isMobile ? { width: '100%' } : { maxWidth: 960 }) }}
          >
            {isMobile
              ? 'Top 3% UI/UX Designer on Upwork, designing for the world.'
              : 'Upwork, designing for the world.'}
          </p>
        </div>
      </section>

      {/* Body — the blue-to-white gradient bleeds over the top of this block */}
      <section ref={bodyRef} className="relative w-full bg-white overflow-clip">
        <div
          className="absolute left-0 w-full pointer-events-none"
          style={isMobile ? { top: -350, height: 800 } : { top: -641, height: 1413 }}
        >
          <div ref={bgRef} className="w-full h-full">
            <img src={bgGradient} alt="" className="w-full h-full object-cover object-top" />
          </div>
        </div>

        <div
          className="relative z-10 w-full flex flex-col"
          style={{
            maxWidth: CONTENT_MAX,
            margin: '0 auto',
            paddingLeft: detailSidePad,
            paddingRight: detailSidePad,
            paddingTop: isMobile ? 200 : t(COPY_TOP),
            paddingBottom: isMobile ? 260 : t(COPY_TAIL),
            gap: stacked ? t(STACKED_ROW_GAP) : ROW_GAP,
          }}
        >
          {sections.map((sec, i) => (
            <Fragment key={i}>
            <div
              ref={(el) => (rowRefs.current[i] = el)}
              className={stacked ? 'flex flex-col' : 'flex justify-center'}
              style={{
                gap: stacked ? 24 : COLUMN_GAP,
                alignItems: 'flex-start',
                // Stacked, the copy runs as one column — capped and centred on
                // the section, the same measure the other sections use here.
                ...(stacked
                  ? { width: '100%', maxWidth: t(DETAIL_MAX), marginLeft: 'auto', marginRight: 'auto' }
                  : {}),
              }}
            >
              {sec.portrait ? (
                <div
                  className="overflow-hidden shrink-0"
                  style={{
                    width: LABEL_W,
                    height: LABEL_W,
                    borderRadius: 30,
                    background: '#F3F3F5',
                    ...(stacked ? {} : { marginLeft: 'auto' }),
                  }}
                >
                  <img
                    src={portrait}
                    alt="Akhdiyat Restu Fiqih"
                    className="w-full h-full object-cover"
                    width={LABEL_W}
                    height={LABEL_W}
                  />
                </div>
              ) : (
                <p
                  className="font-light font-['Geist'] shrink-0"
                  style={{
                    ...bodyStyle,
                    color: NEUTRAL_500,
                    width: stacked ? '100%' : LABEL_W,
                    textAlign: stacked ? 'left' : 'right',
                    ...(stacked ? {} : { marginLeft: 'auto' }),
                  }}
                >
                  {sec.label}
                </p>
              )}

              <div
                className="flex flex-col shrink-0"
                style={{
                  width: stacked ? '100%' : BODY_W,
                  maxWidth: BODY_W,
                  gap: 26,
                  ...(stacked ? {} : { marginRight: 'auto' }),
                }}
              >
                {sec.paragraphs.map((text, j) => (
                  <p key={j} className="text-black font-light font-['Geist']" style={bodyStyle}>
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* The Upwork performance card, straight after the intro — same
                component the landing page's KPI section uses. */}
            {i === 0 && (
              <div
                ref={(el) => (rowRefs.current[sections.length] = el)}
                className="w-full"
              >
                <UpworkCard />
              </div>
            )}
            </Fragment>
          ))}
        </div>

        <div
          className="absolute left-0 w-full pointer-events-none"
          // Same asset and travel as Testimonial, but its own box. The wrapper
          // is flipped, so the box reads white for its first quarter, ramps
          // over the second, and is solid purple below the halfway mark. With
          // T as the box top's distance above the section bottom, two things
          // have to hold at once:
          //
          //   white still behind the last line  ->  T <= PAD + H/4 - y_read
          //   the Nebula seam is solid purple   ->  T >= H/2 - y_seam
          //
          // which is only satisfiable while H <= 4 * (PAD - y_read + y_seam).
          // Measured on this page that ceiling is 1316 desktop / 724 mobile,
          // so Testimonial's 1413/800 box cannot clear this section's much
          // longer copy without leaving the seam short of full purple — at
          // 1413 the window for T is empty. Shrinking the box opens it again;
          // these sit mid-window at T = 520 and T = 240.
          // Tablet starts 30 higher than mobile: its section is taller, so the
          // wash is further through its travel by the time the seam arrives.
          style={
            isMobile
              ? { bottom: '-360px', height: '600px', transform: 'scaleY(-1)' }
              : isTablet
                ? { bottom: '-330px', height: '600px', transform: 'scaleY(-1)' }
                : { bottom: '-580px', height: '1100px', transform: 'scaleY(-1)' }
          }
        >
          <img ref={bgOutRef} src={testimonialBg} alt="" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Closes on the same Nebula section the landing page ends with — it
          brings the contact block with it. */}
      <Nebula />
    </div>
  )
}
