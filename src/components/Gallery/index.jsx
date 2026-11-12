import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar from '../Navbar'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid, fluidBetween, TRACK_TEXT } from '../../utils/fluid'
import { galleryRows, RING_PANELS, RING_ROWS } from '../../data/gallery'

// The gallery: the concept sites stood on two rings in 3D, one above the other,
// turning together on the horizontal axis. The lower ring is turned half a step
// on, so its cards fall in the gaps of the upper one and the two read as a
// zigzag. Scroll, drag or swipe spins them; the card facing the viewer is named
// underneath. Nothing else is on the page — the header is the site's own navbar,
// and the cards themselves are the only thing to click.

const STEP = 360 / RING_PANELS       // degrees between neighbouring cards
const ROW_OFFSET = STEP / RING_ROWS  // the stagger that makes the rows zigzag
const RADIUS_RATIO = 2.2             // ring radius as a share of card width: wide
                                     // enough to leave clear white between cards
const FRICTION = 0.84                // low: the rings have weight and stop soon
                                     // after the hand does, rather than gliding on
const WHEEL = 0.014                  // degrees per pixel of wheel
const DRAG = 0.06                    // degrees per pixel of drag
const LIFT = 34                      // pixels a card steps towards the viewer on hover

// Shortest signed angle from `deg` to zero, in -180..180.
function wrap(deg) {
  return ((deg + 180) % 360 + 360) % 360 - 180
}

// Every card on both rings, in one list, each with the angle it sits at.
const panels = galleryRows.flatMap((row, r) =>
  row.map((panel, i) => ({ ...panel, angle: i * STEP + r * ROW_OFFSET }))
)

export default function Gallery() {
  const { isMobileView } = useBreakpoint()
  const stageRef = useRef(null)
  const ringRefs = useRef([])
  const panelRefs = useRef([])
  const [front, setFront] = useState(0)

  // The page is a single screen that never scrolls: the wheel drives the rings
  // instead. Taken off the body so a bounce cannot reveal the page behind it.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || !ringRefs.current[0]) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let radius = 0
    let spin = 0        // degrees the rings have turned
    let v = 0           // degrees a frame, carried after a throw
    let drag = null
    let moved = 0
    // The opening turn. It runs until the rings reach the first project, and any
    // input cancels it -- so the page never settles on an empty card first.
    let entrance = !still
    let raf = 0
    let shownFront = -1

    // The radius follows a card's own rendered width, so the rings keep their
    // proportions through every breakpoint without a second set of numbers.
    const measure = () => {
      const card = panelRefs.current[0]
      radius = card ? card.offsetWidth * RADIUS_RATIO : 0
      // Each card reads the radius from its ring, so one write moves them all.
      ringRefs.current.forEach((ring) => ring?.style.setProperty('--r', `${radius}px`))
    }

    const onPointerDown = (e) => {
      entrance = false
      drag = { x: e.clientX, last: e.clientX, t: performance.now() }
      moved = 0
      v = 0
      // No pointer capture here: it would retarget the click at the stage and the
      // card under the pointer would never be opened. Movement and release are
      // watched on the window instead, which covers a drag that leaves the stage.
    }
    const onPointerMove = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.last
      moved = Math.max(moved, Math.abs(e.clientX - drag.x))
      spin += dx * DRAG
      const now = performance.now()
      // Only part of the throw is carried, so letting go does not send it sliding.
      v = (dx * DRAG / Math.max(1, now - drag.t)) * 6
      drag.last = e.clientX
      drag.t = now
    }
    const endDrag = () => { drag = null }
    // A drag that happens to finish on a card must not open it.
    const onClickCapture = (e) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation() }
    }
    // Both wheel axes turn the rings, so a mouse wheel and a trackpad swipe do
    // the same thing here.
    const onWheel = (e) => {
      e.preventDefault()
      entrance = false
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      v -= d * (e.deltaMode === 1 ? WHEEL * 16 : WHEEL)
    }
    const onKeyDown = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      entrance = false
      if (e.key === 'ArrowRight') v -= 2
      else v += 2
    }

    const tick = () => {
      if (entrance) {
        spin += (0 - spin) * 0.022
        if (Math.abs(spin) < 0.05) { spin = 0; entrance = false }
      } else if (!drag) {
        // Free: the rings coast to a stop wherever the throw leaves them, and are
        // never pulled square onto the nearest card.
        spin += v
        v *= FRICTION
        if (Math.abs(v) < 0.002) v = 0
      }
      ringRefs.current.forEach((ring, r) => {
        if (ring) ring.style.transform = `translateZ(${-radius}px) rotateY(${spin + r * ROW_OFFSET}deg)`
      })

      let best = 0
      let bestAway = 999
      panelRefs.current.forEach((el, i) => {
        if (!el) return
        const away = Math.abs(wrap(panels[i].angle + spin))
        if (away < bestAway) { bestAway = away; best = i }
        // A card past edge-on is taken out of sight, but with opacity rather than
        // backface-visibility: an element that is not rendered at all stops being
        // painted, and its video shows the first frame again on the way back.
        // At zero opacity it keeps painting, so playback carries straight on.
        const hidden = away > 90
        el.style.opacity = hidden ? '0' : '1'
        el.style.pointerEvents = hidden || away > 78 ? 'none' : 'auto'
        el.style.zIndex = String(360 - Math.round(away))
      })
      if (best !== shownFront) { shownFront = best; setFront(best) }

      raf = requestAnimationFrame(tick)
    }

    measure()
    // Start a few steps back from the first project, so the rings arrive on it
    // rather than sitting still on load.
    if (entrance) spin = STEP * 3.5
    raf = requestAnimationFrame(tick)

    window.addEventListener('resize', measure)
    stage.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    stage.addEventListener('click', onClickCapture, true)
    stage.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      stage.removeEventListener('click', onClickCapture, true)
      stage.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Hover steps a card out of the ring a little. Mouse only: on a touchscreen
  // the enter fires on the tap that opens the site and would leave it stuck out.
  const lift = useCallback((e) => {
    if (e.pointerType === 'mouse') e.currentTarget.style.setProperty('--lift', `${LIFT}px`)
  }, [])
  const drop = useCallback((e) => {
    e.currentTarget.style.setProperty('--lift', '0px')
  }, [])

  // The concept sites are static pages outside this app, so they are opened with
  // a real navigation rather than through the router.
  const open = useCallback((href) => (e) => {
    e.preventDefault()
    window.location.href = href
  }, [])

  const cardWidth = isMobileView
    ? fluidBetween(150, 215, 390, 1024)
    : fluid(200, 270)

  const shown = panels[front]

  return (
    <div className="relative w-full bg-white" style={{ height: '100svh', overflow: 'hidden' }}>
      <Navbar onLight />

      <div
        ref={stageRef}
        className="absolute inset-0 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: isMobileView ? '1100px' : '1600px',
          gap: fluid(18, 30),
          touchAction: 'pan-y',
        }}
      >
        {/* Each ring sits at its own radius behind the screen, so the card facing
            the viewer lands on the picture plane rather than in front of it. */}
        {galleryRows.map((row, r) => (
          <div
            key={`ring-${r}`}
            ref={(el) => { ringRefs.current[r] = el }}
            style={{
              position: 'relative',
              width: cardWidth,
              aspectRatio: '4 / 3',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {row.map((panel, i) => {
              const flat = r * RING_PANELS + i
              const common = {
                position: 'absolute',
                inset: 0,
                // The lift is its own term, so hovering only moves the card along
                // its own normal -- the ring's own turn is on the parent.
                transform: `rotateY(${i * STEP}deg) translateZ(calc(var(--r, 0px) + var(--lift, 0px)))`,
                transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transformStyle: 'preserve-3d',
                borderRadius: 2,
                overflow: 'hidden',
                background: panel.blank ? '#1500E1' : '#f3f3f1',
              }
              if (panel.blank) {
                return (
                  <div
                    key={panel.id}
                    ref={(el) => { panelRefs.current[flat] = el }}
                    aria-hidden
                    style={common}
                  />
                )
              }
              return (
                <a
                  key={panel.id}
                  ref={(el) => { panelRefs.current[flat] = el }}
                  href={panel.href}
                  onClick={open(panel.href)}
                  onPointerEnter={lift}
                  onPointerLeave={drop}
                  aria-label={`${panel.name} — ${panel.description}`}
                  style={{ ...common, display: 'block' }}
                  draggable={false}
                >
                  <video
                    src={panel.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                  />
                </a>
              )
            })}
          </div>
        ))}
      </div>

      {/* The card facing the viewer, named. Text only — the cards are the only
          thing on this page to act on. */}
      <div
        className="absolute left-0 w-full flex justify-center pointer-events-none"
        style={{ bottom: fluid(28, 44) }}
      >
        <p
          className="font-light font-['Geist'] text-black text-center m-0"
          style={{ fontSize: fluid(14, 16), lineHeight: fluid(18, 22), letterSpacing: TRACK_TEXT }}
        >
          {shown?.blank ? (
            <span style={{ color: 'rgba(0,0,0,0.4)' }}>More coming soon</span>
          ) : (
            <>
              {shown?.name}
              <span style={{ color: 'rgba(0,0,0,0.45)' }}>{` — ${shown?.description}`}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
