import { motion } from 'framer-motion';
import SensorVisibilityToggle from './SensorVisibilityToggle';
import TimeFilterTabs from './TimeFilterTabs';
import DeviceMetricsChart from './DeviceMetricsChart';
import { FILTER_OPTIONS } from './constants';

const DeviceMetricsSection = ({
  activeFilter,
  visibleSensors,
  onToggleSensor,
  onChangeFilter,
  chartData,
  isChartLoading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="p-4 sm:p-6 rounded bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 px-1 sm:px-5 pt-1">
        <div>
          <h2 className="font-semibold text-lg sm:text-xl text-white">Environmental Metrics</h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
            Viewing options: {activeFilter.label}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center w-full lg:w-auto">
          <SensorVisibilityToggle
            visibleSensors={visibleSensors}
            onToggle={onToggleSensor}
          />

          <TimeFilterTabs
            options={FILTER_OPTIONS}
            activeFilter={activeFilter}
            onChange={onChangeFilter}
          />
        </div>
      </div>

      <DeviceMetricsChart
        chartData={chartData}
        visibleSensors={visibleSensors}
        isChartLoading={isChartLoading}
      />
    </motion.div>
  );
};

export default DeviceMetricsSection;