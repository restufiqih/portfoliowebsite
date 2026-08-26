import { useBreakpoint } from '../../hooks/useBreakpoint'
import HeroDesktop from './Hero.desktop'
import HeroMobile from './Hero.mobile'

export default function Hero() {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? <HeroDesktop /> : <HeroMobile />
}
