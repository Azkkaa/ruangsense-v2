import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const DeviceMetricsChart = ({ chartData, visibleSensors, isChartLoading }) => {
  return (
    <div
      className={`h-64 sm:h-96 w-full transition-opacity duration-300 ${
        isChartLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'
      }`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7b1779" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#7b1779" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHumid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#40B7FF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#40B7FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#FF5C00" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="5 5" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />

          <Area
            type="monotone"
            name="Temperature (°C)"
            dataKey="temp"
            stroke="#7b1779"
            strokeWidth={2}
            fill="url(#colorTemp)"
            hide={!visibleSensors.temp}
            activeDot={false}
          />
          <Area
            type="monotone"
            name="Humidity (%)"
            dataKey="humid"
            stroke="#40B7FF"
            strokeWidth={2}
            fill="url(#colorHumid)"
            hide={!visibleSensors.humid}
            activeDot={false}
          />
          <Area
            type="monotone"
            name="Gas (PPM)"
            dataKey="gas"
            stroke="#FF5C00"
            strokeWidth={2}
            fill="url(#colorGas)"
            hide={!visibleSensors.gas}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceMetricsChart;