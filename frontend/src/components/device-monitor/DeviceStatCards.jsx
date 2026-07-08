import {
  ThermometerIcon,
  DropIcon,
  WindIcon,
} from '@phosphor-icons/react';
import StatCard from '../StatCard';

const DeviceStatCards = ({ latestData, trends }) => {
  return (
    <div className="flex flex-col gap-3">
      <StatCard
        title="Temperature"
        value={latestData.temp}
        unit="°C"
        icon={<ThermometerIcon size={24} weight="duotone" />}
        trend={trends.temp.text}
        isUp={trends.temp.isUp}
        delay={0.1}
      />
      <StatCard
        title="Humidity"
        value={latestData.humid}
        unit="%"
        icon={<DropIcon size={24} weight="duotone" />}
        trend={trends.humid.text}
        isUp={trends.humid.isUp}
        delay={0.2}
      />
      <StatCard
        title="Air Quality"
        value={latestData.gas}
        unit="PPM"
        icon={<WindIcon size={24} weight="duotone" />}
        trend={trends.gas.text}
        isUp={trends.gas.isUp}
        delay={0.3}
      />
    </div>
  );
};

export default DeviceStatCards;