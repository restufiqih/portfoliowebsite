import { useBreakpoint } from '../../hooks/useBreakpoint'
import Desktop from './OrbitSection.desktop'
import Mobile from './OrbitSection.mobile'

export default function OrbitSection() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <Desktop /> : <Mobile />
}
