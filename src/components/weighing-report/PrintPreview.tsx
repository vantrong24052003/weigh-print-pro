/**
 * PrintPreview.tsx
 *
 * Renders receipt using the EXACT same text as ESC/POS output.
 * Source of truth: buildReceiptLines() from escpos.ts
 *
 * Grid rules (MUST match printer):
 *   font-family: monospace        — 1 char = 1 cell (no kerning)
 *   width: 32ch                   — exactly LINE_WIDTH chars
 *   white-space: pre              — preserve spaces, no wrap
 *   font-size: ~10px              — closest to thermal bitmap font визуально
 *
 * This eliminates the HTML ≠ ESC/POS mismatch.
 */
import { buildReceiptLines } from '@/utils/escpos'
import type { ReceiptData } from '@/utils/escpos'

interface PrintPreviewProps {
  data: ReceiptData
  no?: string
  onClose: () => void
  onQzPrint: () => void
}

export const PrintPreview = ({ data, no = '0011', onClose, onQzPrint }: PrintPreviewProps) => {
  const lines = buildReceiptLines(data, no)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-[380px] w-full overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header bar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white px-6">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Bản xem in</h2>
            <span className="text-[10px] text-slate-300 font-bold">Grid 32 ký tự — khớp ESC/POS</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Column ruler — debug tool */}
        <div className="bg-slate-900 px-6 py-1.5 overflow-x-auto">
          <pre
            className="text-slate-500 select-none"
            style={{
              fontFamily: 'monospace',
              fontSize: '8px',
              lineHeight: 1.4,
              width: '32ch',
            }}
          >
            {'12345678901234567890123456789012'}
          </pre>
        </div>

        {/* Receipt grid — EXACTLY what the printer outputs */}
        <div className="flex-1 overflow-y-auto py-8 px-6 bg-slate-50 flex justify-center">
          <div
            className="bg-white shadow-sm border border-slate-100 px-0 py-6"
            style={{ width: 'fit-content' }}
          >
            {/* Thermal paper top edge */}
            <div
              style={{
                height: '4px',
                background: 'repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 3px, white 3px, white 6px)',
                marginBottom: '12px',
              }}
            />

            <pre
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                lineHeight: '1.45',
                width: '32ch',
                whiteSpace: 'pre',
                overflowX: 'hidden',
                color: '#111',
                padding: '0 8px',
              }}
            >
              {lines.join('\n')}
            </pre>

            {/* Thermal paper bottom edge */}
            <div
              style={{
                height: '4px',
                background: 'repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 3px, white 3px, white 6px)',
                marginTop: '12px',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-col gap-3 bg-white border-t border-slate-50">
          <button
            onClick={onQzPrint}
            className="w-full h-12 bg-amber-500 text-white rounded-2xl text-xs font-bold hover:bg-amber-600 transition-all active:scale-95 shadow-xl shadow-amber-200 uppercase tracking-widest"
          >
            In Nhanh Chuyên Nghiệp (QZ Tray)
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
          >
            Quay lại sửa tiếp
          </button>
        </div>
      </div>
    </div>
  )
}
