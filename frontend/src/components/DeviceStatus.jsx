import { CircleIcon } from '@phosphor-icons/react'
import { formatDateTime } from '../utils/helper';

const DeviceStatus = ({status, data}) => {
  if (status) {
    return (
      <div className='flex'>
        <div className="flex items-center gap-1.5 pr-3 pl-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CircleIcon size={8} weight="fill" className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Online</span>
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex items-center justify-between gap-1'>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border self-start border-red-500/20">
          <CircleIcon size={8} weight="fill" className="text-red-500" />
          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Offline</span>
        </div>
        <div className='text-xs text-gray-500 font-mono'>
          Last Seen: {formatDateTime(data.last_seen)}
        </div>
      </div>
    )
  }
}

export default DeviceStatus;