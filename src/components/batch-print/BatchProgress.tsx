interface BatchProgressProps {
  current: number
  total: number
}

export function BatchProgress({ current, total }: BatchProgressProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className='bg-slate-50 border border-slate-200 rounded-lg p-6 text-center'>
      <p className='font-bold text-slate-700 mb-4'>Đang in phiếu...</p>
      <div className='flex items-center gap-4 mb-4'>
        <span className='text-3xl font-bold text-slate-900'>{current}</span>
        <span className='text-slate-400 text-xl'>/</span>
        <span className='text-3xl font-bold text-slate-900'>{total}</span>
      </div>
      <div className='w-full bg-slate-200 rounded-full h-3 overflow-hidden'>
        <div
          className='h-full bg-emerald-500 transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className='text-sm text-slate-500 mt-4'>{percentage}%% hoàn thành</p>
    </div>
  )
}
