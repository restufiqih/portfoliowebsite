import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// Full-screen preview for a case study image: click to open, scroll or pinch to
// zoom, drag to pan. The overlay covers the viewport and swallows its own wheel
// events, so the page behind never scrolls and the body's styles are left
// alone — touching them would disturb the pinned ScrollTriggers on the page.

const MIN_SCALE = 1
const MAX_SCALE = 6
// How much of the viewport the image is allowed to fill when it first opens.
const FIT_INSET = 0.92
const WHEEL_SENSITIVITY = 0.0022
// One press of a zoom button, as a multiple of the current scale.
const BUTTON_STEP = 1.5
// How far the pointer may travel before a press counts as a drag, not a click.
const DRAG_SLOP = 4
// Two fingers mean either a pinch or a drag, and a hand cannot hold them
// perfectly still. Whichever of these two a gesture crosses first decides what
// it is, and it stays that for as long as the fingers are down — without the
// lock, the jitter in a two-finger drag reads as constant zooming. Pan's
// threshold is the lower of the two so a deliberate drag wins the race.
const PAN_SLOP = 6
const PINCH_SLOP = 14

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

export default function Lightbox({ image, onClose }) {
  const [scale, setScale] = useState(MIN_SCALE)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 0 : window.innerWidth,
    h: typeof window === 'undefined' ? 0 : window.innerHeight,
  }))

  const overlayRef = useRef(null)
  const closeRef = useRef(null)
  const drag = useRef(null)
  // A drag ends with a click event. Without this the click would be taken for a
  // plain one and would snap the zoom straight back to fit.
  const moved = useRef(false)
  const pinch = useRef(null)
  // Kept in refs as well so the wheel listener, which has to be non-passive and
  // therefore cannot be re-bound on every render, always reads current values.
  const live = useRef({ scale: MIN_SCALE, offset: { x: 0, y: 0 } })

  // The image at rest: contained inside the viewport, never cropped.
  const boxW = viewport.w * FIT_INSET
  const boxH = viewport.h * FIT_INSET
  const fit = image.w && image.h ? Math.min(boxW / image.w, boxH / image.h) : 1
  const baseW = image.w * fit
  const baseH = image.h * fit

  const limit = useCallback(
    (next, s) => ({
      x: clamp(next.x, -Math.max(0, (baseW * s - viewport.w) / 2), Math.max(0, (baseW * s - viewport.w) / 2)),
      y: clamp(next.y, -Math.max(0, (baseH * s - viewport.h) / 2), Math.max(0, (baseH * s - viewport.h) / 2)),
    }),
    [baseW, baseH, viewport.w, viewport.h]
  )

  const apply = useCallback(
    (s, o) => {
      const next = clamp(s, MIN_SCALE, MAX_SCALE)
      const bounded = next === MIN_SCALE ? { x: 0, y: 0 } : limit(o, next)
      live.current = { scale: next, offset: bounded }
      setScale(next)
      setOffset(bounded)
    },
    [limit]
  )

  // Zoom about a point so whatever sits under the cursor stays under it.
  const zoomAt = useCallback(
    (nextScale, px, py) => {
      const { scale: s0, offset: o0 } = live.current
      const s1 = clamp(nextScale, MIN_SCALE, MAX_SCALE)
      if (s1 === s0) return
      const cx = px - viewport.w / 2
      const cy = py - viewport.h / 2
      const k = s1 / s0
      apply(s1, { x: cx - (cx - o0.x) * k, y: cy - (cy - o0.y) * k })
    },
    [apply, viewport.w, viewport.h]
  )

  const zoomBy = useCallback(
    (factor) => zoomAt(live.current.scale * factor, viewport.w / 2, viewport.h / 2),
    [zoomAt, viewport.w, viewport.h]
  )

  useLayoutEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomBy(BUTTON_STEP)
      else if (e.key === '-' || e.key === '_') zoomBy(1 / BUTTON_STEP)
      else if (e.key === '0') apply(MIN_SCALE, { x: 0, y: 0 })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, zoomBy, apply])

  // Non-passive so the page underneath cannot scroll while the preview is open.
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      zoomAt(live.current.scale * Math.exp(-e.deltaY * WHEEL_SENSITIVITY), e.clientX, e.clientY)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const onPointerDown = (e) => {
    // Cleared before the early exits: a press that starts no drag still has to
    // wipe the flag, or the click that follows it would be swallowed.
    moved.current = false
    if (e.pointerType === 'touch' && pinch.current) return
    if (live.current.scale === MIN_SCALE) return
    e.preventDefault()
    // Capture keeps the moves coming when the pointer leaves the picture, but a
    // refusal must not take the drag down with it.
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* no capture available; the drag still tracks while the pointer is over */
    }
    drag.current = { x: e.clientX, y: e.clientY, o: live.current.offset }
    moved.current = false
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!drag.current) return
    const d = drag.current
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.hypot(dx, dy) > DRAG_SLOP) moved.current = true
    apply(live.current.scale, { x: d.o.x + dx, y: d.o.y + dy })
  }

  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  // Two fingers do both jobs at once: the distance between them sets the scale,
  // and the midpoint carries the view along with it. Anchoring to where the
  // gesture started rather than to the previous frame keeps the point pinned
  // under the fingers instead of drifting as rounding accumulates.
  const onTouchStart = (e) => {
    if (e.touches.length !== 2) return
    const [a, b] = e.touches
    pinch.current = {
      dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      scale: live.current.scale,
      offset: live.current.offset,
      mid: { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 },
      mode: null,
    }
    endDrag()
  }

  const onTouchMove = (e) => {
    if (e.touches.length !== 2 || !pinch.current) return
    e.preventDefault()
    const [a, b] = e.touches
    const p = pinch.current
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    const midX = (a.clientX + b.clientX) / 2
    const midY = (a.clientY + b.clientY) / 2

    if (!p.mode) {
      const travelled = Math.hypot(midX - p.mid.x, midY - p.mid.y)
      const spread = Math.abs(dist - p.dist)
      if (travelled > PAN_SLOP) p.mode = 'pan'
      else if (spread > PINCH_SLOP) p.mode = 'pinch'
      else return
    }

    // Pan holds the scale it started at; only a pinch is allowed to change it.
    const s1 = p.mode === 'pinch' ? clamp((p.scale * dist) / p.dist, MIN_SCALE, MAX_SCALE) : p.scale
    // The zoom about the starting midpoint plus however far that midpoint has
    // since travelled. On a pan the first term cancels and this is a pure drag.
    const k = s1 / p.scale
    apply(s1, {
      x: midX - viewport.w / 2 - (p.mid.x - viewport.w / 2 - p.offset.x) * k,
      y: midY - viewport.h / 2 - (p.mid.y - viewport.h / 2 - p.offset.y) * k,
    })
  }

  const onTouchEnd = (e) => {
    if (e.touches.length < 2) pinch.current = null
  }

  // A plain click toggles between fit and a close-up, the way Behance does; a
  // drag must not be mistaken for one.
  const onImageClick = (e) => {
    if (drag.current || moved.current) {
      moved.current = false
      return
    }
    if (live.current.scale > MIN_SCALE) apply(MIN_SCALE, { x: 0, y: 0 })
    else zoomAt(2.5, e.clientX, e.clientY)
  }

  const zoomed = scale > MIN_SCALE
  const btn = {
    width: 44,
    height: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
    backdropFilter: 'blur(8px)',
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || 'Image preview'}
      onPointerDown={(e) => {
        // Only a press that starts on the backdrop closes the preview.
        if (e.target === e.currentTarget) onClose()
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        touchAction: 'none',
        overscrollBehavior: 'contain',
      }}
    >
      <img
        src={image.src}
        alt={image.alt || ''}
        draggable={false}
        onClick={onImageClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          width: baseW || 'auto',
          height: baseH || 'auto',
          maxWidth: 'none',
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          transition: dragging ? 'none' : 'transform 0.18s ease-out',
          cursor: zoomed ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
          userSelect: 'none',
          touchAction: 'none',
          willChange: 'transform',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <button type="button" style={btn} onClick={() => zoomBy(1 / BUTTON_STEP)} aria-label="Zoom out">
          −
        </button>
        <span
          className="font-light font-['Geist']"
          style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, minWidth: 56, textAlign: 'center' }}
        >
          {Math.round(scale * 100)}%
        </span>
        <button type="button" style={btn} onClick={() => zoomBy(BUTTON_STEP)} aria-label="Zoom in">
          +
        </button>
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        style={{ ...btn, position: 'fixed', top: 24, right: 24 }}
      >
        ✕
      </button>
    </div>
  )
}
