import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api'
import StatCard from '../components/StatCard'
import { 
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  ThermometerIcon, DropIcon, WindIcon,
  LightningIcon, CaretLeftIcon,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import StatusElement from '../components/StatusElement';
import { io } from 'socket.io-client';
import DeviceStatus from '../components/DeviceStatus';

export default function DeviceMonitor() {
  const [chartData, setChartData] = useState([]);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const { deviceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRequest = async () => {
      try {
        const res = await api.get(`api/sensor-log/${deviceId}`)

        setChartData(res.data.logs.map((log) => {
          const date = new Date(log.createdAt)
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          const second = date.getSeconds().toString().padStart(2, '0')

          return {
            time: `${hours}:${minutes}:${second}`,
            temp: log.temp,
            humid: log.humid,
            gas: log.gas,
            temp_status: log.temp_status,
            humid_status: log.humid_status,
            gas_status: log.gas_status
          }
        }))
      } catch (err) {
        alert('Something went wrong!')
        console.error("Error:", err)
      }
    }

    handleRequest()

    const socket = io('http://localhost:5000')

    socket.on('connect', () => {
      console.log('Connected to socket server')
      socket.emit('join-device-room', deviceId)
    })

    socket.on('v2-device-data', (newData) => {
      setChartData((prevData) => {
        const updatedData = [newData, ...prevData];
        return updatedData.slice(0, 10);
      })
    })

    socket.on('v2-device-status', (payload) => {
      setIsDeviceOnline(payload.status === 'online')
    })

    return () => {
      socket.emit('leave-device-room', deviceId)
      socket.disconnect()
    }
  }, [deviceId])

  if (!deviceId) return <Navigate to="/search-device"/>

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#7b1779]/50 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[3rem_3rem]"></div>
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#7b1779] blur-[150px] opacity-10 rounded-full mix-blend-screen transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#4a0d49] blur-[150px] opacity-10 rounded-full mix-blend-screen transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-400 mx-auto px-6 h-20 flex items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
            >
              <CaretLeftIcon size={20} weight="bold" />
            </button>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300">
                  Main Laboratory
                </h1>
                <DeviceStatus status={isDeviceOnline} />
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{deviceId}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-400 mx-auto px-6 py-8">
        <div>
          <div className="space-y-8">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard 
                title="Temperature" value={chartData[chartData.length - 1]?.temp} unit="°C" 
                icon={<ThermometerIcon size={24} weight="duotone" />} 
                trend="↑ 1.2%" isUp={true} delay={0.1} 
              />
              <StatCard 
                title="Humidity" value={chartData[chartData.length - 1]?.humid} unit="%" 
                icon={<DropIcon size={24} weight="duotone" />} 
                trend="↓ 0.5%" isUp={false} delay={0.2} 
              />
              <StatCard 
                title="Air Quality" value={chartData[chartData.length - 1]?.gas} unit="PPM" 
                icon={<WindIcon size={24} weight="duotone" />} 
                trend="↓ 2.1%" isUp={false} delay={0.3} 
              />
              <StatCard 
                title="Device Voltage" value="5.0" unit="V" 
                icon={<LightningIcon size={24} weight="duotone" />} 
                trend="Stable" isUp={false} delay={0.4} 
              />
            </div>

            {/* Table Session */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Realtime Activity Log</h2>

              <div className="overflow-x-auto pb-2">
                <table className="w-full text-left border-collapse min-w-187.5">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="pb-4 pl-4 font-medium">Time</th>
                      <th className="pb-4 font-medium">Temperature</th>
                      <th className="pb-4 font-medium">Humidity</th>
                      <th className="pb-4 pr-4 font-medium">Gas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((log, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/3 transition-colors group">

                        <td className="py-4 pl-4 text-sm text-gray-300 font-mono whitespace-nowrap">
                          {log.time}
                        </td>

                        <td className="py-4 text-sm font-semibold text-white whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex items-baseline gap-1 w-17.5">
                              <span className="text-base">{log.temp}</span>
                              <span className="text-xs text-gray-500 font-medium">&deg;C</span>
                            </div>
                            <StatusElement status={log.temp_status} />
                          </div>
                        </td>

                        <td className="py-4 text-sm font-semibold text-white whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex items-baseline gap-1 w-17.5">
                              <span className="text-base">{log.humid}</span>
                              <span className="text-xs text-gray-500 font-medium">%</span>
                            </div>
                            <StatusElement status={log.humid_status} />
                          </div>
                        </td>

                        <td className="py-4 pr-4 text-sm font-semibold text-white whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex items-baseline gap-1 w-17.5">
                              <span className="text-base">{log.gas}</span>
                              <span className="text-xs text-gray-500 font-medium">PPM</span>
                            </div>
                            <StatusElement status={log.gas_status} />
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Chart Session */}

            {/* Temperature Session */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-8 px-5 pt-3">
                <div>
                  <h2 className="font-semibold text-xl text-white">Temperature Graphic</h2>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#7b1779] animate-pulse" />
              </div>

              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000ee', borderColor: '#ffffff20', borderRadius: '5px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" name='Temperature' dataKey="temp" stroke="#7b1779" strokeWidth={2} fillOpacity={0.2} fill='#7b1779' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Humidity Session */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-8 px-5 pt-3">
                <div>
                  <h2 className="font-semibold text-xl text-white">Humidity Graphic</h2>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#40B7FF] animate-pulse" />
              </div>

              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000ee', borderColor: '#ffffff20', borderRadius: '5px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" name='Humidity' dataKey="humid" stroke="#40B7FF" strokeWidth={2} fillOpacity={0.2} fill='#40B7FF' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Gas (PPM) Session */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-8 px-5 pt-3">
                <div>
                  <h2 className="font-semibold text-xl text-white">Gas Graphic</h2>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
              </div>

              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000ee', borderColor: '#ffffff20', borderRadius: '5px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" name='Gas(PPM)' dataKey="gas" stroke="#FF5C00" strokeWidth={2} fillOpacity={0.2} fill='#FF5C00' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Right Panel (Device Info) */}
          {/* <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 rounded-3xl bg-linear-to-b from-[#0a0a0a]/80 to-[#000000] border border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="p-3 bg-[#7b1779]/20 text-[#7b1779] rounded-xl border border-[#7b1779]/30">
                  <HardDrivesIcon size={24} weight="duotone" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Device Info</h2>
                  <p className="text-xs text-gray-400 font-mono">{deviceId}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <InfoIcon size={18} weight="duotone" />
                    <span className="text-sm">Architecture</span>
                  </div>
                  <span className="text-sm font-medium text-white">ESP32-WROOM-32E</span>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <WifiHighIcon size={18} weight="duotone" />
                    <span className="text-sm">Connection</span>
                  </div>
                  <span className="text-sm font-medium text-white">-65 dBm</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BatteryFullIcon size={18} weight="duotone" />
                    <span className="text-sm">Battery</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">92%</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <ClockIcon size={18} weight="duotone" />
                    <span className="text-sm">Uptime</span>
                  </div>
                  <span className="text-sm font-medium text-white">14d 2h 45m</span>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Firmware</span>
                  <span className="text-xs font-semibold text-[#7b1779]">v2.1.0-stable</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-1 overflow-hidden">
                  <div className="bg-[#7b1779] h-1.5 rounded-full w-full"></div>
                </div>
                <p className="text-[10px] text-gray-500 text-center mt-2">Up to date</p>
              </div>
            </motion.div>
          </div> */}
          
        </div>
      </main>
    </div>
  );
}