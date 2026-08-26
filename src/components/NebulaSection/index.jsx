import { useBreakpoint } from '../../hooks/useBreakpoint'
import Desktop from './NebulaSection.desktop'
import Mobile from './NebulaSection.mobile'

export default function NebulaSection() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <Desktop /> : <Mobile />
}
