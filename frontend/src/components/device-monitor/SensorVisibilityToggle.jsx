const SENSOR_CONFIG = [
  {
    key: 'temp',
    label: 'Suhu',
    activeClass: 'bg-[#7b1779]/20 text-[#7b1779] border border-[#7b1779]/40',
    dotClass: 'bg-[#7b1779]',
  },
  {
    key: 'humid',
    label: 'Kelembaban',
    activeClass: 'bg-[#40B7FF]/20 text-[#40B7FF] border border-[#40B7FF]/40',
    dotClass: 'bg-[#40B7FF]',
  },
  {
    key: 'gas',
    label: 'Gas',
    activeClass: 'bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/40',
    dotClass: 'bg-[#FF5C00]',
  },
];

const SensorVisibilityToggle = ({ visibleSensors, onToggle }) => {
  return (
    <div className="flex w-full sm:w-auto bg-white/5 border border-white/5 p-1 rounded gap-1 justify-between sm:justify-start">
      {SENSOR_CONFIG.map((sensor) => {
        const isActive = visibleSensors[sensor.key];

        return (
          <button
            key={sensor.key}
            onClick={() => onToggle(sensor.key)}
            className={`flex-1 sm:flex-none px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              isActive ? sensor.activeClass : 'text-gray-500 opacity-50'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? sensor.dotClass : 'bg-gray-500'
              }`}
            />
            {sensor.label}
          </button>
        );
      })}
    </div>
  );
};

export default SensorVisibilityToggle;