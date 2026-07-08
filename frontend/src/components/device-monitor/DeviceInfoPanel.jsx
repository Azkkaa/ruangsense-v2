import DeviceStatus from '../DeviceStatus';

const DeviceInfoPanel = ({ deviceId, isDeviceOnline, data }) => {
  return (
    <div className="p-5 sm:p-6 rounded bg-[#0a0a0a]/60 border border-white/5 backdrop-blur-xl space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Device Information
      </h3>

      <div>
        <div className="border-b border-gray-700 pb-1">
          <p className="text-xs text-gray-500 font-mono">DEVICE ID</p>
          <p className="text-sm text-gray-200 font-mono">{deviceId}</p>
        </div>

        <div className="border-b border-gray-700 pb-1 pt-2">
          <p className="text-xs text-gray-500 font-mono mb-1">STATUS</p>
          <DeviceStatus status={isDeviceOnline} data={data} />
        </div>

        <div className="border-b border-gray-700 pb-1 pt-2">
          <p className="text-xs text-gray-500 font-mono">PHONE NUMBER</p>
          <p className="text-sm text-gray-200 font-mono">
            {data.devicePhone || 'not set yet!!'}
          </p>
        </div>

        <div className="border-b border-gray-700 pb-1 pt-2">
          <p className="text-xs text-gray-500 font-mono">Threshold Temperature</p>
          <p className="text-sm text-red-300 font-mono">
            {data.device.threshold_temp || ''}
          </p>
        </div>

        <div className="border-b border-gray-700 pb-1 pt-2">
          <p className="text-xs text-gray-500 font-mono">Threshold Gas</p>
          <p className="text-sm text-red-300 font-mono">
            {data.device.threshold_gas || ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoPanel;