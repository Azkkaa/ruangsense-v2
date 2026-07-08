import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeftIcon } from '@phosphor-icons/react';

const DeviceMonitorSkeleton = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden select-none">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-400 mx-auto px-4 sm:px-6 h-20 flex items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5">
              <CaretLeftIcon size={20} weight="bold" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300">Main Laboratory</h1>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5">{deviceId}</p>
                </div>
                {/* Status Badge Skeleton */}
                <div className="h-5 w-14 bg-white/5 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-400 mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">

          {/* Stat Cards Skeleton (3 Grid Items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="relative p-6 rounded bg-white/3 border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-[#7b1779] rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-gray-700 animate-pulse">
                    <div className="w-6 h-6 bg-white/5 rounded-md" />
                  </div>
                  <div className="h-5 w-14 bg-white/5 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="h-4 bg-white/5 rounded w-16 mb-2 animate-pulse" />
                  <div className="flex items-baseline gap-1">
                    <div className="h-8 bg-white/10 rounded w-20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Combined Chart Session Skeleton */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 px-1 sm:px-5 pt-1">
              <div>
                <h2 className="font-semibold text-lg sm:text-xl text-white">Environmental Metrics</h2>
                <div className="h-3 bg-white/5 rounded w-36 mt-1.5 animate-pulse" />
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center w-full lg:w-auto">
                {/* Sensor Visibility Toggles Skeleton */}
                <div className="flex w-full sm:w-auto bg-white/5 border border-white/5 p-1 rounded gap-1 justify-between sm:justify-start">
                  <div className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1.5 bg-[#7b1779]/10 text-gray-500 opacity-60 border border-[#7b1779]/20 w-16 h-7 animate-pulse" />
                  <div className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1.5 bg-[#40B7FF]/10 text-gray-500 opacity-60 border border-[#40B7FF]/20 w-24 h-7 animate-pulse" />
                  <div className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-md flex items-center justify-center gap-1.5 bg-[#FF5C00]/10 text-gray-500 opacity-60 border border-[#FF5C00]/20 w-16 h-7 animate-pulse" />
                </div>

                {/* Filter Options Toggles Skeleton */}
                <div className="flex w-full sm:w-auto bg-white/5 border border-white/5 p-1 rounded justify-between sm:justify-start gap-1">
                  <div className="h-7 w-12 bg-white/10 rounded-md animate-pulse" />
                  <div className="h-7 w-12 bg-white/5 rounded-md animate-pulse" />
                  <div className="h-7 w-12 bg-white/5 rounded-md animate-pulse" />
                  <div className="h-7 w-12 bg-white/5 rounded-md animate-pulse" />
                </div>
              </div>
            </div>

            {/* Chart Graphic Placeholder Body */}
            <div className="h-64 sm:h-96 w-full flex items-end gap-2 px-4 border-b border-l border-white/5 pb-2">
              {[...Array(12)].map((_, barIdx) => {
                const heights = ['h-24', 'h-40', 'h-32', 'h-56', 'h-48', 'h-64', 'h-36', 'h-52', 'h-44', 'h-60', 'h-28', 'h-50'];
                return (
                  <div 
                    key={barIdx} 
                    className={`flex-1 ${heights[barIdx % heights.length]} bg-white/3 rounded-t-lg animate-pulse`} 
                  />
                );
              })}
            </div>
            
            {/* Chart X-Axis Labels Placeholder */}
            <div className="flex justify-between mt-3 px-4">
              <div className="h-3 bg-white/5 rounded w-10 animate-pulse" />
              <div className="h-3 bg-white/5 rounded w-10 animate-pulse" />
              <div className="h-3 bg-white/5 rounded w-10 animate-pulse" />
            </div>
          </div>

          {/* Table Session Skeleton */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
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
                  {[...Array(4)].map((_, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-4 pl-4">
                        <div className="h-4 bg-white/5 rounded w-16 font-mono animate-pulse" />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-white/10 rounded w-14 animate-pulse" />
                          <div className="h-5 bg-white/5 rounded-full w-16 animate-pulse" />
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-white/10 rounded w-12 animate-pulse" />
                          <div className="h-5 bg-white/5 rounded-full w-16 animate-pulse" />
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
                          <div className="h-5 bg-white/5 rounded-full w-16 animate-pulse" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default DeviceMonitorSkeleton;