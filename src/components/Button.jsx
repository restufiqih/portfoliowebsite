import { useState } from 'react'

export default function Button({ label = "Click me", variant = "light", onClick }) {
  const [hovered, setHovered] = useState(false)

  const variants = {
    light: "bg-white text-black",
    dark: "bg-black text-white",
  }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`px-5 rounded-[99px] inline-flex justify-center items-center cursor-pointer ${variants[variant]}`}
      style={{
        height: '44px',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div style={{ height: '20px', overflow: 'hidden', fontFamily: 'Geist, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            transform: hovered ? 'translateY(-20px)' : 'translateY(0px)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <span style={{ height: '20px', lineHeight: '20px', fontSize: '16px', fontWeight: 500, display: 'block' }}>{label}</span>
          <span style={{ height: '20px', lineHeight: '20px', fontSize: '16px', fontWeight: 500, display: 'block' }}>{label}</span>
        </div>
      </div>
    </button>
  )
}