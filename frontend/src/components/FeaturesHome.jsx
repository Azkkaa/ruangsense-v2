import {
  PulseIcon,
  BellRingingIcon,
  CpuIcon,
  ChartBarIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const FeaturesHome = () => {
  const features = [
    {
      icon: <PulseIcon size={32} weight="duotone" className="text-[#7b1779]" />,
      title: "Realtime Monitoring",
      description: "Pantau metrik ruangan Anda tanpa delay. Data sensor diperbarui secara instan melalui protokol WebSocket berkinerja tinggi."
    },
    {
      icon: <BellRingingIcon size={32} weight="duotone" className="text-[#7b1779]" />,
      title: "Smart Notification",
      description: "Dapatkan peringatan seketika saat parameter ruangan melewati ambang batas normal yang telah Anda tentukan."
    },
    {
      icon: <CpuIcon size={32} weight="duotone" className="text-[#7b1779]" />,
      title: "IoT Integration",
      description: "Integrasi mulus dengan berbagai perangkat mikrokontroler. Dukungan penuh untuk arsitektur ESP32 dan modul sensor standar."
    },
    {
      icon: <ChartBarIcon size={32} weight="duotone" className="text-[#7b1779]" />,
      title: "Sensor Analytics",
      description: "Visualisasi data historis yang komprehensif. Analisis tren lingkungan untuk pengambilan keputusan yang lebih baik."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
          <p className="text-gray-400">Infrastruktur kuat untuk kebutuhan monitoring modern</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded bg-linear-to-b from-white/8 to-transparent border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-500 backdrop-blur-sm"
            >
              <div className="mb-6 p-4 rounded-2xl bg-black/50 inline-block border border-white/5 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesHome;