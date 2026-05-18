const StatusElement = ({status}) => {
  let color;
  if (status === 'normal') {
    color = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  } else if (status === 'warning') {
    color = 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  } else if (status === 'very dry' || status === 'moderately dry' || status === 'hot') {
    color = 'text-orange-400 bg-orange-400/10 border-orange-400/20'
  } else if (status === 'danger' || status === 'critical') {
    color = 'text-red-400 bg-red-400/10 border-red-400/20'
  } else if (status === 'cold' || status === 'humid') {
    color = 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  } else {
    color = 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }

  return (
    <div className={`text-[10px] ${color} font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider`}>
      {status}
    </div>
  )
}

export default StatusElement