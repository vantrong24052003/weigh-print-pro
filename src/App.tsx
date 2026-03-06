import { useState } from 'react'
import type { AppMode } from '@/types'
import { SimpleFormPanel } from '@/components/simple-form/SimpleFormPanel'
import { BatchPrintPanel } from '@/components/batch-print/BatchPrintPanel'
import { useQzPrinter } from '@/hooks/useQzPrinter'
import '@/App.css'

export default function App() {
  const TAB_MODES = { simple: 'simple', batch: 'batch' } as const
  const [mode, setMode] = useState<AppMode>(TAB_MODES.simple)
  const { connect, disconnect, isConnected, error: qzError } = useQzPrinter()

  return (
    <div className='min-h-screen bg-white text-slate-900 p-4 font-sans'>
      <div className='max-w-md mx-auto space-y-6'>
        {/* Header */}
        <header className='border-b border-slate-200 pb-4 flex justify-between items-end'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>PHIẾU CÂN XE</h1>
            <p className='text-slate-500 text-sm'>Nhập liệu và in phiếu cân trạm</p>
          </div>

          <div className='flex flex-col items-end gap-2'>
            <button
              onClick={isConnected ? disconnect : connect}
              className={`cursor-pointer text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                isConnected
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-900'
              }`}
            >
              {isConnected ? `● QZ TRAY (AIMO)` : '○ KẾT NỐi QZ TRAY'}
            </button>
            {qzError && <span className='text-[8px] text-red-400 font-medium max-w-37.5 text-right'>{qzError}</span>}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className='flex gap-2'>
          <button
            onClick={() => setMode(TAB_MODES.simple)}
            className={`flex-1 py-2 px-4 text-sm font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === TAB_MODES.simple
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nhập liệu
          </button>
          <button
            onClick={() => setMode(TAB_MODES.batch)}
            className={`flex-1 py-2 px-4 text-sm font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === TAB_MODES.batch
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            In hàng loạt
          </button>
        </div>

        {mode === TAB_MODES.simple && <SimpleFormPanel isConnected={isConnected} qzError={qzError ?? undefined} />}

        {mode === TAB_MODES.batch && <BatchPrintPanel isConnected={isConnected} />}
      </div>

      <footer className='pt-8 text-center text-slate-400 text-[10px] uppercase font-medium tracking-widest'>
        WeighingSystem v2.0
      </footer>
    </div>
  )
}
