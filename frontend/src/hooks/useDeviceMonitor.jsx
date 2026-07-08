import { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { FILTER_OPTIONS } from '../components/device-monitor/constants';
import { calculateTrend } from '../utils/helper';

const formatChartLogs = (rawLogs, filter) => {
  return rawLogs.map((log) => {
    const date = new Date(log.createdAt || log.sampleDate);

    const time =
      filter.interval === '1d'
        ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        : `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    return {
      time,
      temp: log.temp !== undefined ? log.temp : Math.round(log.avgTemp * 10) / 10,
      humid: log.humid !== undefined ? log.humid : Math.round(log.avgHumid * 10) / 10,
      gas: log.gas !== undefined ? log.gas : Math.round(log.avgGas * 10) / 10,
      temp_status: log.temp_status,
      humid_status: log.humid_status,
      gas_status: log.gas_status,
    };
  });
};

export default function useDeviceMonitor(deviceId) {
  const [chartData, setChartData] = useState([]);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [data, setData] = useState({});
  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS[0]);
  const [visibleSensors, setVisibleSensors] = useState({
    temp: true,
    humid: true,
    gas: true,
  });

  const toggleSensor = (sensorKey) => {
    setVisibleSensors((prev) => ({
      ...prev,
      [sensorKey]: !prev[sensorKey],
    }));
  };

  const fetchChartData = useCallback(
    async (filter) => {
      setIsChartLoading(true);

      try {
        const endpoint = filter.isRealtime
          ? `api/device/${deviceId}/status`
          : `api/sensor-log/${deviceId}?days=${filter.days}&interval=${filter.interval}`;

        const res = await api.get(endpoint);
        const formattedLogs = formatChartLogs(res.data.logs || [], filter);

        setChartData(formattedLogs);

        if (filter.isRealtime) {
          setIsDeviceOnline(res.data.isOnline);
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setIsChartLoading(false);
        setIsLoading(false);
      }
    },
    [deviceId]
  );

  useEffect(() => {
    if (!deviceId) return;
    fetchChartData(activeFilter);
  }, [deviceId, activeFilter, fetchChartData]);

  useEffect(() => {
    if (!deviceId) return;

    const socket = io(import.meta.env.VITE_ENDPOINT_BASE_URL);

    socket.on('connect', () => {
      socket.emit('join-device-room', deviceId);
    });

    socket.on('device-data', (newData) => {
      if (!activeFilter.isRealtime) return;

      setChartData((prevData) => {
        const updatedData = [
          ...prevData,
          {
            time: newData.time,
            temp: newData.temp,
            humid: newData.humid,
            gas: newData.gas,
            temp_status: newData.temp_status,
            humid_status: newData.humid_status,
            gas_status: newData.gas_status,
          },
        ];

        return updatedData.slice(-10);
      });
    });

    socket.on('device-status', (payload) => {
      setIsDeviceOnline(payload.status === 'online');
    });

    return () => {
      socket.emit('leave-device-room', deviceId);
      socket.disconnect();
    };
  }, [deviceId, activeFilter.isRealtime]);

  const latestData = useMemo(
    () => chartData[chartData.length - 1] || {},
    [chartData]
  );

  const previousData = useMemo(
    () => chartData[chartData.length - 2] || {},
    [chartData]
  );
console.log(latestData.gas)
console.log(previousData.gas)
  const trends = useMemo(() => ({
    temp: calculateTrend(latestData.temp, previousData.temp),
    humid: calculateTrend(latestData.humid, previousData.humid),
    gas: calculateTrend(latestData.gas, previousData.gas),
  }), [latestData, previousData]);

  return {
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
    trends,
  };
}