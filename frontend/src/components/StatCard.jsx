import { motion } from 'framer-motion'

const StatCard = ({ title, value, unit, icon, trend, isUp, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative p-6 rounded bg-white/3 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group overflow-hidden"
  >
    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-[#7b1779] rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="rounded-2xl text-[#7b1779]">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isUp ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-gray-500 font-medium">{unit}</span>
      </div>
    </div>
  </motion.div>
);

export default StatCard;