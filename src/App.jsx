import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import VideoIntro from './components/VideoIntro'
import Upwork from './components/Upwork'
import Quote from './components/Quote'
import Testimonial from './components/Testimonial'
import Nebula from './components/Nebula'

function FullBleed({ children, className, style }) {
  return (
    <div className={className} style={style}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <FullBleed className="bg-[#1500E1]">
        <Navbar />
        <Hero />
      </FullBleed>
      <FullBleed className="bg-white">
        <Works />
      </FullBleed>
      <FullBleed className="bg-white">
        <VideoIntro />
      </FullBleed>
      <FullBleed className="bg-white">
        <Upwork />
      </FullBleed>
      <FullBleed style={{ background: 'linear-gradient(to bottom, #e8e4f5 0%, #f5f3fa 50%, #ffffff 100%)' }}>
        <Quote />
      </FullBleed>
      <FullBleed className="bg-white">
        <Testimonial />
      </FullBleed>
      <FullBleed style={{ background: '#511ece' }}>
        <Nebula />
      </FullBleed>
    </div>
  )
}
