import { useState, useEffect } from 'react'

const read = () => {
  if (typeof window === 'undefined') return 1
  return Math.min(4 / 3, Math.max(1, window.innerWidth / 768))
}

// Numeric twin of `scaleTablet`, for sizes JavaScript measures or computes with
// rather than hands straight to CSS. 1 at 768, growing to 4/3 by 1024, flat
// outside that range. Callers gate it on `isTablet` themselves.
export function useTabletScale() {
  const [k, setK] = useState(read)

  useEffect(() => {
    let timeout
    const onResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setK(read()), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return k
}
