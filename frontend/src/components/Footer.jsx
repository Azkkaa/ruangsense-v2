import {
  GithubLogoIcon
} from '@phosphor-icons/react'
import logoRuangSense from '../assets/images/logo/logo_ruangsense-nobg.png'

const Footer = () => {

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src={logoRuangSense} alt="logo-ruangsense" className='w-20 h-auto'/>
        </div>
        
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} RuangSense. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a href="https://github.com/Azkkaa/ruangsense-v2" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#7b1779] transition-colors">
            <GithubLogoIcon size={20} weight="fill" />
          </a>
        </div>
      </div>
    </footer>
  )
};

export default Footer