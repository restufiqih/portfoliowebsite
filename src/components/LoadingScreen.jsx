import { useLayoutEffect, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LOGO_PATH = 'M20.0665 57.784C2.10027 44.0243 0.802857 18.1984 15.5649 7.41537C29.0348 -2.42381 44.5474 4.62702 46.2629 17.109C47.9783 29.5909 43.0206 38.2324 32.2545 39.6792C21.4883 41.126 22.1779 28.9728 32.2545 28.9728C40.712 28.9728 50.2255 36.549 56.081 40.9898'

const MIN_DISPLAY_MS = 1500
const MAX_WAIT_MS = 10000

export default function LoadingScreen({ onFinish, lanyardReady }) {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const lengthRef = useRef(0)
  const dismissedRef = useRef(false)
  const startTimeRef = useRef(Date.now())

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    lengthRef.current = path.getTotalLength()
    gsap.set(path, { strokeDasharray: lengthRef.current, strokeDashoffset: lengthRef.current })

    const tl = gsap.timeline({ repeat: -1 })
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
    tl.to(path, {
      strokeDashoffset: lengthRef.current,
      duration: 0.8,
      ease: 'power2.in',
    }, '+=0.5')

    return () => tl.kill()
  }, [])

  useEffect(() => {
    if (!onFinish) return

    const dismiss = () => {
      if (dismissedRef.current) return
      dismissedRef.current = true
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
      setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: onFinish,
        })
      }, remaining)
    }

    if (lanyardReady) {
      dismiss()
      return
    }

    const maxTimer = setTimeout(dismiss, MAX_WAIT_MS)
    return () => clearTimeout(maxTimer)
  }, [onFinish, lanyardReady])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#0000FF' }}
    >
      <div className="flex flex-col items-center gap-[20px]">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path ref={pathRef} d={LOGO_PATH} stroke="white" strokeWidth="5.45455" />
        </svg>
      </div>
    </div>
  )
}
