// src/components/SocialProof.jsx
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Globe from '../assets/icons/Globe.svg'
import JobSuccess from '../assets/icons/JobSuccess.svg'
import Star from '../assets/icons/Star.svg'
import TopRatedPlus from '../assets/icons/TopRatedPlus.svg'

// Daftarkan plugin GSAP
gsap.registerPlugin(ScrollTrigger)

const stats = [
  { label: '50+ Clients Worldwide', icon: Globe },
  { label: 'Top Rated Plus', icon: TopRatedPlus },
  { label: '100% Job Success', icon: JobSuccess },
  { label: '5.0 Rating', icon: Star },
]

const StatItem = ({ label, icon, animRef }) => (
  <div ref={animRef} className="flex justify-start items-center gap-1.5">
    <img src={icon} className="w-8 h-8" alt={label} />
    <span className="text-black text-xl font-medium font-['DM_Sans'] leading-8">
      {label}
    </span>
  </div>
)

export default function SocialProof() {
  const containerRef = useRef(null)
  const stat1Ref = useRef(null)
  const stat2Ref = useRef(null)
  const stat3Ref = useRef(null)
  const stat4Ref = useRef(null)
  
  // State untuk melebarkan container hitam
  const [isParentHovered, setIsParentHovered] = useState(false)
  // State khusus untuk rolling text & scale tombol
  const [isBtnHovered, setIsBtnHovered] = useState(false)

  const statRefs = [stat1Ref, stat2Ref, stat3Ref, stat4Ref]

  useLayoutEffect(() => {
    // Set kondisi awal stats
    gsap.set(statRefs.map(r => r.current), { 
      opacity: 0, 
      y: 20, 
      filter: 'blur(8px)' 
    })

    // Animasi muncul saat scroll ke area Social Proof
    const anim = gsap.to(statRefs.map(r => r.current), {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    })

    return () => {
      anim.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsParentHovered(true)}
      onMouseLeave={() => setIsParentHovered(false)}
      className="w-full h-36 bg-white border-b-[0.5px] border-gray-200 flex justify-between items-center overflow-hidden"
    >
      {/* Stats Section */}
      <div className="flex-1 px-24 flex justify-between items-center">
        <StatItem label={stats[0].label} icon={stats[0].icon} animRef={stat1Ref} />
        <StatItem label={stats[1].label} icon={stats[1].icon} animRef={stat2Ref} />
        <StatItem label={stats[2].label} icon={stats[2].icon} animRef={stat3Ref} />
        <StatItem label={stats[3].label} icon={stats[3].icon} animRef={stat4Ref} />
      </div>

      {/* CTA Section - Container Hitam */}
      <div
        className="self-stretch overflow-hidden transition-all duration-500 ease-in-out flex items-center bg-black"
        style={{ width: isParentHovered ? '260px' : '0px' }} 
      >
        <a
          href="https://upwork.com"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          className="h-full w-full px-10 flex justify-center items-center cursor-pointer transition-all duration-300 whitespace-nowrap"
          style={{
            transform: isBtnHovered ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {/* Rolling Text Container */}
          <div className="h-8 overflow-hidden pointer-events-none"> 
            <div
              className="flex flex-col transition-transform duration-500"
              style={{
                // Efek bergulir HANYA aktif saat tombol hitam disentuh
                transform: isBtnHovered ? 'translateY(-32px)' : 'translateY(0px)',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Teks Posisi Normal */}
              <span className="text-lime-50 text-xl font-medium font-['Geist'] leading-8 block">
                See on Upwork
              </span>
              {/* Teks Posisi Hover (di bawahnya) */}
              <span className="text-lime-50 text-xl font-medium font-['Geist'] leading-8 block">
                See on Upwork
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}