import { useBreakpoint } from '../../hooks/useBreakpoint'
import Desktop from './PhoneSection.desktop'
import Mobile from './PhoneSection.mobile'

export default function PhoneSection() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <Desktop /> : <Mobile />
}
