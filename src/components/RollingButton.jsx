import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { fluid } from '../utils/fluid'
import { navigate } from '../utils/route'

// `href` is somewhere else and opens in its own tab; `to` is a route on this
// site and does not. Both render a real anchor so the link is crawlable and
// still answers a middle click — `to` only intercepts the plain left click.
//
// Desktop rides the 1024->1440 ramp; below that the button keeps the flat
// figures it has always had, since there is no tablet or mobile frame for it.
export default function RollingButton({ label, href, to, className = '' }) {
  const [hovered, setHovered] = useState(false)
  const { isDesktop } = useBreakpoint()

  // The roll travels exactly one line, so the transform is written against the
  // same value the box is tall — `calc()` keeps that true through the clamp.
  const lineH = isDesktop ? fluid(18, 22) : '22px'

  const sharedClass = `bg-black rounded-[99px] inline-flex justify-center items-center cursor-pointer hover:bg-black/85 transition-colors ${className}`
  const sharedStyle = {
    height: isDesktop ? fluid(36, 50) : '50px',
    paddingLeft: isDesktop ? fluid(14, 20) : 20,
    paddingRight: isDesktop ? fluid(14, 20) : 20,
  }
  const labelStyle = { fontSize: isDesktop ? fluid(14, 16) : 16, lineHeight: lineH }
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  const inner = (
    <div style={{ height: lineH, overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? `translateY(calc(-1 * ${lineH}))` : 'translateY(0px)',
        transition: 'transform 0.3s ease-in-out',
      }}>
        <span className="text-white font-light font-['Geist'] whitespace-nowrap block" style={labelStyle}>{label}</span>
        <span className="text-white font-light font-['Geist'] whitespace-nowrap block" style={labelStyle}>{label}</span>
      </div>
    </div>
  )

  if (to) {
    return (
      <a
        href={to}
        onClick={(e) => {
          // Let the browser handle anything that means "open it elsewhere".
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
          e.preventDefault()
          navigate(to)
          window.scrollTo({ top: 0, behavior: 'auto' })
        }}
        className={sharedClass}
        style={sharedStyle}
        {...handlers}
      >
        {inner}
      </a>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClass} style={sharedStyle} {...handlers}>
        {inner}
      </a>
    )
  }

  return (
    <button className={sharedClass} style={sharedStyle} {...handlers}>
      {inner}
    </button>
  )
}
