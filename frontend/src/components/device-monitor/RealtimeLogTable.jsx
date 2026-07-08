import { motion } from 'framer-motion';
import StatusElement from '../StatusElement';

const RealtimeLogTable = ({ chartData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="p-4 sm:p-6 rounded bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
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
            {chartData.slice().reverse().map((log, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/3 transition-colors group"
              >
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
  );
};

export default RealtimeLogTable;