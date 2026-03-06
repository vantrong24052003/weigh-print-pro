import type { AxleData } from '@/types'

interface AxleRowProps {
  index: number
  data: AxleData
  error: { left?: string; right?: string }
  onChange: (side: 'left' | 'right', val: string) => void
}

export const AxleRow = ({ index, data, error, onChange }: AxleRowProps) => (
  <div className='space-y-1'>
    <div className='flex items-center gap-3'>
      <span className='w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-[10px] font-bold text-slate-900'>
        {index + 1}
      </span>
      <div className='flex-1 grid grid-cols-2 gap-2'>
        <div className='space-y-1'>
          <input
            type='number'
            placeholder='0'
            className={`w-full bg-slate-50 border ${error.left ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2 text-center outline-none focus:border-slate-900 transition-colors`}
            value={data.left}
            onChange={(e) => onChange('left', e.target.value)}
          />
          {error.left && <p className='text-[8px] text-red-500 text-center font-bold uppercase'>{error.left}</p>}
        </div>
        <div className='space-y-1'>
          <input
            type='number'
            placeholder='0'
            className={`w-full bg-slate-50 border ${error.right ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2 text-center outline-none focus:border-slate-900 transition-colors`}
            value={data.right}
            onChange={(e) => onChange('right', e.target.value)}
          />
          {error.right && <p className='text-[8px] text-red-500 text-center font-bold uppercase'>{error.right}</p>}
        </div>
      </div>
    </div>
  </div>
)
