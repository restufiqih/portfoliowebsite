export function fluid(min, max) {
  return fluidBetween(min, max, 1024, 1440)
}

// The primitive both ramps are built on: `min` at `fromVw`, `max` at `toVw`,
// clamped so it cannot leak past either end.
export function fluidBetween(min, max, fromVw, toVw) {
  return `clamp(${min}px, calc(${min}px + ${+(max - min).toFixed(4)} * (100vw - ${fromVw}px) / ${toVw - fromVw}), ${max}px)`
}

export function fluidNeg(min, max) {
  return `calc(-1 * ${fluid(min, max)})`
}

// The tablet range scales as a whole rather than per design point: a value is
// the tablet design's own figure at 768 and grows with the viewport from there,
// reaching 1.333x at 1024. That ramp is exactly what a vw length is, so the
// value is expressed as one, clamped so it cannot leak past either end.
export function scaleTablet(px) {
  return `clamp(${px}px, ${(px / 7.68).toFixed(4)}vw, ${+(px * 4 / 3).toFixed(2)}px)`
}

export function scaleTabletNeg(px) {
  return `calc(-1 * ${scaleTablet(px)})`
}

// ——— Ramps for values the design only ever specified at 1440 ——————————————
//
// `fluid(min, max)` wants two measured figures. Where a 1024 frame exists the
// pair is drawn; where it does not, these derive the missing one the way the
// landing page's own hand-measured pairs already do.

// Structure — padding, gap, width, radius. The landing page's measured pairs
// sit almost exactly here: fluid(72,100), fluid(36,50), fluid(29,40),
// fluid(43,60), fluid(17,24). Near enough 1024/1440, rounded the same way.
const STRUCTURE_MIN = 0.72

export function fluidSpace(px) {
  return fluid(Math.round(px * STRUCTURE_MIN), px)
}

// Type does not follow that ratio. The landing page deliberately holds small
// copy above it — 16 drops to 14, not the 12 a ratio would give — and bottoms
// out at 14, which is where every section sets body copy at 1024. Keyed by the
// 1440 size and line height together, because the same number means different
// things as a size and as a leading: 22 is a size that drops to 16, and a
// leading that drops to 18.
const TYPE_SCALE = {
  '70/84': [50, 60],
  '60/70': [43, 50],
  '40/46': [30, 36],
  '30/36': [22, 26],
  '24/34': [17, 24],
  '22/30': [16, 22],
  '20/28': [14, 20],
  '18/26': [14, 19],
  '16/22': [14, 18],
  // Already at the floor at 1440 — it holds, which is the correct ramp for it.
  '14/20': [14, 20],
}

// Returns { fontSize, lineHeight } for a step of that scale. An unlisted pair
// falls back to the structural ratio and says so, rather than silently
// inventing a figure.
export function fluidType(size, line) {
  const step = TYPE_SCALE[`${size}/${line}`]
  if (!step) {
    if (import.meta.env?.DEV) {
      console.warn(`fluidType: no scale step for ${size}/${line}; falling back to the structural ratio`)
    }
    return { fontSize: fluidSpace(size), lineHeight: fluidSpace(line) }
  }
  return { fontSize: fluid(step[0], size), lineHeight: fluid(step[1], line) }
}

// Numeric twin of `fluid`, for the rare value JavaScript has to compute with
// rather than hand straight to CSS — a marquee measuring its own track, say.
// Callers pass the viewport width they are already tracking.
export function fluidPx(min, max, vw) {
  const t = Math.min(1, Math.max(0, (vw - 1024) / 416))
  return min + (max - min) * t
}

// One continuous ramp for everything below the desktop breakpoint, for a page
// whose small frame is drawn at 390. A value is that frame's own figure at 390
// and grows with the viewport from there, reaching the same 1.333x at 1024 that
// `scaleTablet` tops out at — so the handoff to the desktop ramp is unchanged,
// but the 390-to-768 stretch is no longer flat the way `scaleTablet` leaves it.
export function scaleCompact(px) {
  return fluidBetween(px, +(px * 4 / 3).toFixed(2), 390, 1024)
}

// ——— Tracking ————————————————————————————————————————————————————————————
//
// The design file gives Geist two tracking values: display type is set at -4%
// and everything else at -2%. Both are written as an em rather than the px the
// frames measure, because every size on this site is on a ramp — a px value
// taken off the 1440 frame is only correct at 1440 and drifts wider as the
// viewport narrows. -4% of 70px is the same -4% at 50.
export const TRACK_DISPLAY = '-0.04em'
export const TRACK_TEXT = '-0.02em'
