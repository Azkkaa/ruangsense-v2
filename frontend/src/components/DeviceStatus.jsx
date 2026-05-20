import { CircleIcon } from '@phosphor-icons/react'

const DeviceStatus = ({status}) => {
  if (status) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <CircleIcon size={8} weight="fill" className="text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Online</span>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
        <CircleIcon size={8} weight="fill" className="text-red-500" />
        <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Offline</span>
      </div>
    )
  }
}

export default DeviceStatus;