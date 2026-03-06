import { buildReceiptLines } from '@/utils/escpos'
import type { ReceiptData } from '@/utils/escpos'

interface PrintPreviewProps {
  data: ReceiptData
  no?: string
  onClose: () => void
  onQzPrint: () => void
}

export const PrintPreview = ({ data, no = '', onClose, onQzPrint }: PrintPreviewProps) => {
  const lines = buildReceiptLines(data, no)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-[420px] w-full overflow-hidden flex flex-col max-h-[95vh]">

        <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Bản xem in</h2>
            <span className="text-[10px] text-slate-300 font-bold">ESC/POS · 58mm · 32 ký tự/dòng</span>
          </div>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>



        <div className="flex-1 overflow-y-auto bg-slate-100 flex justify-center py-6 px-4">
          <div className="bg-white shadow-md" style={{ width: 'fit-content' }}>
            <div style={{ height: 6, background: 'repeating-linear-gradient(90deg,#cbd5e1 0,#cbd5e1 4px,white 4px,white 8px)' }} />
            <pre
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '13px',
                lineHeight: '1.5',
                width: '32ch',
                whiteSpace: 'pre',
                color: '#0f172a',
                padding: '16px 10px',
                boxSizing: 'content-box',
              }}
            >
              {lines.join('\n')}
            </pre>
            <div style={{ height: 6, background: 'repeating-linear-gradient(90deg,#cbd5e1 0,#cbd5e1 4px,white 4px,white 8px)' }} />
          </div>
        </div>

        <div className="p-6 flex flex-col gap-3 bg-white border-t border-slate-100">
          <button
            onClick={onQzPrint}
            className="cursor-pointer w-full h-12 bg-amber-500 text-white rounded-2xl text-xs font-bold hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-200 uppercase tracking-widest"
          >
            In (QZ Tray)
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer w-full h-10 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  )
}
