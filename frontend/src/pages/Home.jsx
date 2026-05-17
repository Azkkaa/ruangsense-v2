
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar'
import HeroHome from '../components/HeroHome'
import FeaturesHome from '../components/FeaturesHome'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-x-hidden selection:bg-[#7b1779]/50 selection:text-white font-sans scroll-smooth">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#7b1779] blur-[150px] opacity-30 mix-blend-screen"
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
          className="absolute top-[40%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#4a0d49] blur-[150px] opacity-20 mix-blend-screen"
        />
      </div>

      {/* Content */}
      <Navbar />
      <main>
        <HeroHome />
        <FeaturesHome />
      </main>
      <Footer />
      
    </div>
  );
}