import { useState } from 'react'

export default function RollingButton({ label, href, className = '' }) {
  const [hovered, setHovered] = useState(false)

  const sharedClass = `bg-black px-[20px] rounded-[99px] inline-flex justify-center items-center cursor-pointer hover:bg-black/85 transition-colors ${className}`
  const sharedStyle = { height: '50px' }
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  const inner = (
    <div style={{ height: '22px', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-22px)' : 'translateY(0px)',
        transition: 'transform 0.3s ease-in-out',
      }}>
        <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block">{label}</span>
        <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block">{label}</span>
      </div>
    </div>
  )

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
