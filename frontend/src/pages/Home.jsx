
import Navbar from '../components/Navbar'
import HeroHome from '../components/HeroHome'
import FeaturesHome from '../components/FeaturesHome'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050608] text-white overflow-x-hidden selection:bg-[#7b1779]/50 selection:text-white font-sans scroll-smooth">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <Navbar />

      <main>
        <HeroHome />
        <FeaturesHome />
      </main>

      <Footer />
    </div>
  );
}