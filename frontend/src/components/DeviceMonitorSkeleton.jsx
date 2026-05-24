import { CaretLeftIcon } from '@phosphor-icons/react';

const DeviceMonitorSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden select-none">
      
      {/* Background Ambience (Tetap dipertahankan agar transisi mulus) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[3rem_3rem]"></div>
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#7b1779] blur-[150px] opacity-10 rounded-full mix-blend-screen transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#4a0d49] blur-[150px] opacity-10 rounded-full mix-blend-screen transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header Bar Skeleton */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-400 mx-auto px-6 h-20 flex items-center">
          <div className="flex items-center gap-6 w-full">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed">
              <CaretLeftIcon size={20} weight="bold" />
            </div>
            
            <div className="space-y-2 w-full max-w-50">
              <div className="flex items-center gap-3">
                {/* Title Skeleton */}
                <div className="h-6 w-36 bg-white/10 rounded-lg animate-pulse" />
                {/* Status Badge Skeleton */}
                <div className="h-5 w-14 bg-white/5 rounded-full animate-pulse" />
              </div>
              {/* Device ID Skeleton */}
              <div className="h-3 w-24 bg-white/5 rounded-md font-mono animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area Skeleton */}
      <main className="relative z-10 max-w-400 mx-auto px-6 py-8">
        <div className="space-y-8">

          {/* Stat Cards Skeleton (4 Grid Items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl flex flex-col justify-between h-40"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-1/2">
                    {/* Title */}
                    <div className="h-4 bg-white/5 rounded-md w-20 animate-pulse" />
                    {/* Value */}
                    <div className="h-8 bg-white/10 rounded-lg w-24 animate-pulse" />
                  </div>
                  {/* Icon Square */}
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                </div>
                {/* Trend Footer */}
                <div className="h-4 bg-white/5 rounded-md w-16 animate-pulse mt-4" />
              </div>
            ))}
          </div>

          {/* Table Session Skeleton */}
          <div className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Table Title */}
            <div className="h-5 bg-white/10 rounded-md w-48 mb-6 animate-pulse" />

            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left border-collapse min-w-187.5">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 pl-4"><div className="h-4 bg-white/5 rounded w-12 animate-pulse" /></th>
                    <th className="pb-4"><div className="h-4 bg-white/5 rounded w-24 animate-pulse" /></th>
                    <th className="pb-4"><div className="h-4 bg-white/5 rounded w-20 animate-pulse" /></th>
                    <th className="pb-4 pr-4"><div className="h-4 bg-white/5 rounded w-14 animate-pulse" /></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mocking 4 rows of loading data */}
                  {[...Array(4)].map((_, index) => (
                    <tr key={index} className="border-b border-white/5">
                      {/* Time Column */}
                      <td className="py-5 pl-4">
                        <div className="h-4 bg-white/5 rounded w-16 font-mono animate-pulse" />
                      </td>
                      {/* Temperature Column */}
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-white/10 rounded w-14 animate-pulse" />
                          <div className="h-5 bg-white/5 rounded-full w-16规范 animate-pulse" />
                        </div>
                      </td>
                      {/* Humidity Column */}
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-white/10 rounded w-12 animate-pulse" />
                          <div className="h-5 bg-white/5 rounded-full w-16 animate-pulse" />
                        </div>
                      </td>
                      {/* Gas Column */}
                      <td className="py-5 pr-4">
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

          {/* Chart Sessions Skeleton (3 Sections: Temp, Humid, Gas) */}
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="p-6 rounded-3xl bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-8 px-5 pt-3">
                {/* Chart Title */}
                <div className="h-6 bg-white/10 rounded-md w-44 animate-pulse" />
                {/* Pulse Indicator */}
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>

              {/* Graphic Placeholder Body */}
              <div className="h-75 w-full flex items-end gap-2 px-4 border-b border-l border-white/5">
                {[...Array(10)].map((_, barIdx) => {
                  // Membuat tinggi bar bervariasi agar terlihat realistis seperti grafik data asli
                  const heights = ['h-24', 'h-40', 'h-32', 'h-56', 'h-48', 'h-64', 'h-36', 'h-52', 'h-44', 'h-60'];
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
          ))}

        </div>
      </main>
    </div>
  );
}

export default DeviceMonitorSkeleton