import { useBreakpoint } from '../../hooks/useBreakpoint'
import Desktop from './Works.desktop'
import Mobile from './Works.mobile'

export default function Works() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <Desktop /> : <Mobile />
}
