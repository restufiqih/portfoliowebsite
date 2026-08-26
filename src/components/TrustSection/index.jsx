import { useBreakpoint } from '../../hooks/useBreakpoint'
import Desktop from './TrustSection.desktop'
import Mobile from './TrustSection.mobile'

export default function TrustSection() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <Desktop /> : <Mobile />
}
