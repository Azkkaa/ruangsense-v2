import Device from '../models/Device.js';

const thresholdCache = new Map();
const TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

/**
 * Get device threshold from in-memory cache, querying DB only on cache miss or expiration
 * @param {string} deviceId
 * @returns {Promise<{ threshold_temp: number, threshold_gas: number }>}
 */
export const getDeviceThresholdCached = async (deviceId) => {
  const cached = thresholdCache.get(deviceId);
  const now = Date.now();

  if (cached && (now - cached.cachedAt < TTL_MS)) {
    return cached.data;
  }

  try {
    const device = await Device.findOne(
      { device_id: deviceId },
      { threshold_gas: 1, threshold_temp: 1, _id: 0 }
    );

    const data = {
      threshold_temp: device?.threshold_temp ?? 34,
      threshold_gas: device?.threshold_gas ?? 10
    };

    thresholdCache.set(deviceId, { data, cachedAt: now });
    return data;
  } catch (err) {
    console.error(`[ThresholdCache] Error fetching threshold for device ${deviceId}:`, err.message);
    if (cached) {
      return cached.data;
    }
    return { threshold_temp: 34, threshold_gas: 10 };
  }
};

/**
 * Update device threshold in cache directly
 * @param {string} deviceId
 * @param {Partial<{ threshold_temp: number, threshold_gas: number }>} newThresholds
 */
export const updateDeviceThresholdCache = (deviceId, newThresholds = {}) => {
  if (!deviceId || !newThresholds) return;
  const existing = thresholdCache.get(deviceId)?.data || { threshold_temp: 34, threshold_gas: 10 };

  const updatedData = {
    threshold_temp: newThresholds.threshold_temp !== undefined ? newThresholds.threshold_temp : existing.threshold_temp,
    threshold_gas: newThresholds.threshold_gas !== undefined ? newThresholds.threshold_gas : existing.threshold_gas
  };

  thresholdCache.set(deviceId, {
    data: updatedData,
    cachedAt: Date.now()
  });

  console.log(`[ThresholdCache] Cache updated for device ${deviceId}:`, updatedData);
};

/**
 * Invalidate device threshold cache entry
 * @param {string} deviceId
 */
export const invalidateDeviceThresholdCache = (deviceId) => {
  thresholdCache.delete(deviceId);
};

/**
 * Preload all device thresholds from database into cache on startup
 */
export const warmUpThresholdCache = async () => {
  try {
    const devices = await Device.find({}, { device_id: 1, threshold_gas: 1, threshold_temp: 1, _id: 0 });
    const now = Date.now();
    for (const dev of devices) {
      if (dev.device_id) {
        thresholdCache.set(dev.device_id, {
          data: {
            threshold_temp: dev.threshold_temp ?? 34,
            threshold_gas: dev.threshold_gas ?? 10
          },
          cachedAt: now
        });
      }
    }
    console.log(`[ThresholdCache] Cache warmed up: ${devices.length} devices preloaded.`);
  } catch (err) {
    console.error("[ThresholdCache] Failed to warm up threshold cache:", err.message);
  }
};
