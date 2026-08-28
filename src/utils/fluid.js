export function fluid(min, max) {
  return `clamp(${min}px, calc(${min}px + ${max - min} * (100vw - 1024px) / 416), ${max}px)`
}

export function fluidNeg(min, max) {
  return `calc(-1 * ${fluid(min, max)})`
}
