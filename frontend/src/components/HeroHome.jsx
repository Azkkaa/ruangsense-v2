import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const HeroHome = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh] text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400">
          Monitoring Ruangan <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7b1779] to-purple-400">
            Lebih Cerdas & Presisi
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Platform IoT modern untuk memantau suhu, kelembaban, serta pendeteksi asap dan gas secara realtime.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/search-device" className="group relative px-8 py-4 bg-[#7b1779] hover:bg-[#9a1d98] text-white rounded-full font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden hover:ring ring-white">
            <span className="relative z-10">Mulai Monitoring</span>
            <ArrowRightIcon size={20} weight="bold" className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroHome