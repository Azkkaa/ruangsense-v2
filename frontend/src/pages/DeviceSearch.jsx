import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  XIcon, 
  CheckCircleIcon,
  WifiHighIcon,
  CircleNotchIcon
} from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import logoRuangSense from '../assets/images/logo/logo_ruangsense-nobg.png'
import api from '../utils/api';

const DeviceSearch = () => {
  const [deviceId, setDeviceId] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcess, setIsProcess] = useState(false);
  const [device, setDevice] = useState(null)
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsProcess(true)

    try {
      const res = await api.get(`api/device/${deviceId}`)

      if (res.data.success) {
        setIsConfirming(true)
        setDevice(res.data.device)
      }
    } catch (err) {
      alert("Something went wrong!!")
      console.error("Error:", err)
    } finally {
      setIsProcess(false)
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const handleContinue = () => {
    setIsConfirming(false);
    setDeviceId('');
    navigate(`/device/${device.device_id}/monitor`)
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white flex items-center justify-center overflow-hidden font-sans selection:bg-[#7b1779]/50">

      <Navbar />

      {/* Background Ambient Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <motion.div 
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-[#7b1779] blur-[150px] mix-blend-screen"
        />
      </div>

      {/* Main Search Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl px-6"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className='flex items-center justify-center mb-5'
          >
            <img src={logoRuangSense} alt="Logo" className='w-20 h-auto'/>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
            Hubungkan Device Anda
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Masukkan ID unik perangkat untuk mulai melakukan sinkronisasi dengan dashboard RuangSense.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-[#7b1779] to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 transition duration-500"></div>
          
          <div className="relative flex items-center bg-black border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="pl-6 text-gray-500">
              <WifiHighIcon size={24} weight="bold" />
            </div>
            
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Your Device ID"
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-transparent border-none px-4 py-5 text-white placeholder-gray-600 focus:outline-none focus:ring-0 text-lg font-mono tracking-wide"
            />

            {!isProcess ? (
              <div className="pr-2 py-2">
                <button
                  type="submit"
                  disabled={!deviceId.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#7b1779] hover:bg-[#9a1d98] disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300"
                >
                  <span className="hidden sm:inline">Search</span>
                  <MagnifyingGlassIcon size={20} weight="bold" />
                </button>
              </div>
            ) : (
              <div className="pr-2 py-2">
                <button
                  type="submit"
                  disabled={true}
                  className="flex items-center justify-center gap-2 px-6 py-3 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300"
                >
                  <span className="hidden sm:inline">Loading</span>
                  <CircleNotchIcon size={20} weight="bold" className='animate-spin' />
                </button>
              </div>
            )}
          </div>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirming && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={handleCancel}
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4"
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(123,23,121,0.3)] relative overflow-hidden">
                {/* Accent glow in modal */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#7b1779] blur-md"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#7b1779]/20 flex items-center justify-center mb-4 border border-[#7b1779]/50">
                    <CheckCircleIcon size={28} weight="fill" className="text-[#7b1779]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">Device Ditemukan</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Sistem mendeteksi device <span className="text-white font-mono">{deviceId}</span>. Ingin memproses ini ke dalam dashboard?
                  </p>
                  
                  <div className="flex w-full gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <XIcon size={18} weight="bold" />
                      Batal
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#7b1779] hover:bg-[#9a1d98] text-white font-medium transition-all duration-300 shadow-[0_0_20px_-5px_#7b1779]"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default DeviceSearch;