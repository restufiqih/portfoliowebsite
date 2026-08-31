export function fluid(min, max) {
  return `clamp(${min}px, calc(${min}px + ${max - min} * (100vw - 1024px) / 416), ${max}px)`
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
