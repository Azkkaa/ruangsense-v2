import { motion } from 'framer-motion';
import fontRuangSense from '../assets/images/logo/font_ruangsense-nobg.png';
import logoRuangSense from '../assets/images/logo/logo_ruangsense-nobg.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={logoRuangSense} alt="logo" className='w-10 h-auto'/>
            <img src={fontRuangSense} alt="font" className='w-30 h-auto'/>
          </motion.div>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-8"
        >
          <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navbar;