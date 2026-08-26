import { useBreakpoint } from '../../hooks/useBreakpoint'
import Desktop from './TestimonialSection.desktop'
import Mobile from './TestimonialSection.mobile'

export default function TestimonialSection() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <Desktop /> : <Mobile />
}
