import { Navigate, useNavigate, useParams } from 'react-router-dom';
import DeviceMonitorSkeleton from '../components/DeviceMonitorSkeleton';
import DeviceMonitorHeader from '../components/device-monitor/DeviceMonitorHeader';
import DeviceMetricsSection from '../components/device-monitor/DeviceMetricsSection';
import RealtimeLogTable from '../components/device-monitor/RealtimeLogTable';
import DeviceInfoPanel from '../components/device-monitor/DeviceInfoPanel';
import DeviceStatCards from '../components/device-monitor/DeviceStatCards';
import useDeviceMonitor from '../hooks/useDeviceMonitor';

export default function DeviceMonitor() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const {
    chartData,
    isDeviceOnline,
    isLoading,
    isChartLoading,
    data,
    activeFilter,
    visibleSensors,
    latestData,
    setActiveFilter,
    toggleSensor,
    trends
  } = useDeviceMonitor(deviceId);

  if (!deviceId) return <Navigate to="/search-device" />;
  if (isLoading) return <DeviceMonitorSkeleton />;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#7b1779]/50 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <DeviceMonitorHeader onBack={() => navigate(-1)} />

      <main className="relative z-10 max-w-400 mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-5 items-start">
          <div className="lg:col-span-2 space-y-5">
            <DeviceMetricsSection
              activeFilter={activeFilter}
              visibleSensors={visibleSensors}
              onToggleSensor={toggleSensor}
              onChangeFilter={setActiveFilter}
              chartData={chartData}
              isChartLoading={isChartLoading}
            />

            <RealtimeLogTable chartData={chartData} />
          </div>

          <div className="lg:col-span-1 space-y-3">
            <DeviceInfoPanel
              deviceId={deviceId}
              isDeviceOnline={isDeviceOnline}
              data={data}
            />

            <DeviceStatCards latestData={latestData} trends={trends} />
          </div>
        </div>
      </main>
    </div>
  );
}