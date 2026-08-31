import CardPerformance from '../CardPerformance'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import upworkLogo from '../../assets/card_performance/upwork-logo.svg'

// The performance card as the Upwork section presents it: centred, and with the
// Upwork mark sitting under it on mobile, where the card itself hides the one
// it carries in its corner. Shared with the About page.
export default function UpworkCard({ innerRef }) {
  const { isMobile } = useBreakpoint()

  return (
    <div
      ref={innerRef}
      className={isMobile ? 'flex flex-col items-center w-full' : 'w-full flex justify-center'}
      style={isMobile ? { gap: 20 } : {}}
    >
      <CardPerformance />
      {isMobile && <img src={upworkLogo} alt="Upwork" style={{ width: 88, height: 24 }} />}
    </div>
  )
}
