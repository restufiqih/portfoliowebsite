import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import VideoIntro from './components/VideoIntro'
import Upwork from './components/Upwork'
import Quote from './components/Quote'
import Testimonial from './components/Testimonial'
import Nebula from './components/Nebula'
export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Works />
      <VideoIntro />
      <Upwork />
      <Quote />
      <Testimonial />
      <Nebula />
    </div>
  )
}
