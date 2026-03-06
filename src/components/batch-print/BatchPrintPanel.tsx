import { useState, useCallback } from 'react'
import { downloadTemplate, parseExcelFile, getValidRows } from '@/utils/excel'
import type { BatchPrintRow } from '@/types'
import { ExcelUploader } from './ExcelUploader'
import { BatchPreview } from './BatchPreview'
import { BatchProgress } from './BatchProgress'
import { useQzPrinter } from '@/hooks/useQzPrinter'
import { encodeWeighingReport } from '@/utils/escpos'

interface BatchPrintPanelProps {
  isConnected: boolean
}

export function BatchPrintPanel({ isConnected }: BatchPrintPanelProps) {
  const [rows, setRows] = useState<BatchPrintRow[]>([])
  const [parseError, setParseError] = useState<string>()
  const [isParsing, setIsParsing] = useState(false)
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'completed'>('idle')
  const [currentPrintIndex, setCurrentPrintIndex] = useState(0)
  const { print: qzPrint } = useQzPrinter()

  const validRows = getValidRows(rows)
  const invalidCount = rows.length - validRows.length

  const handleFileSelect = useCallback(async (file: File) => {
    setIsParsing(true)
    setParseError(undefined)
    setRows([])
    setPrintStatus('idle')
    setCurrentPrintIndex(0)

    const result = await parseExcelFile(file)
    setIsParsing(false)

    if (result.error) {
      setParseError(result.error)
    } else {
      setRows(result.rows)
    }
  }, [])

  const handleBatchPrint = useCallback(async () => {
    if (!isConnected) {
      alert('Vui lòng kết nối QZ Tray trước khi in!')
      return
    }

    if (validRows.length === 0) {
      alert('Không có phiếu hợp lệ để in!')
      return
    }

    setPrintStatus('printing')
    setCurrentPrintIndex(0)

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      setCurrentPrintIndex(i + 1)

      try {
        const bytes = encodeWeighingReport(
          {
            licensePlate: row.data.licensePlate,
            date: row.data.date,
            time: row.data.time,
            axles: row.data.axles,
            grossWeight: row.grossWeight,
            operator: row.data.operator
          },
          row.data.no
        )
        await qzPrint(bytes)
      } catch (err) {
        console.error(`Lỗi in phiếu ${row.data.no}:`, err)
      }
    }

    setPrintStatus('completed')
  }, [isConnected, validRows, qzPrint])

  const handleReset = useCallback(() => {
    setRows([])
    setParseError(undefined)
    setPrintStatus('idle')
    setCurrentPrintIndex(0)
  }, [])

  return (
    <div className='space-y-6'>
      <div className='flex gap-3'>
        <button
          onClick={downloadTemplate}
          className='cursor-pointer flex-1 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 hover:bg-blue-100 transition-colors'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7 10 12 15 17 10' />
            <line x1='12' y1='15' x2='12' y2='3' />
          </svg>
          <span className='font-bold text-sm uppercase'>Tải Template Excel</span>
        </button>

        <ExcelUploader onFileSelect={handleFileSelect} isLoading={isParsing} />
      </div>

      <p className='text-xs text-slate-400 text-center'>Tối đa 100 dòng mỗi lần in</p>

      {parseError && (
        <div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-4'>
          <p className='font-bold text-sm'>❌ {parseError}</p>
        </div>
      )}

      {isParsing && (
        <div className='bg-slate-50 border border-slate-200 rounded-lg p-4 text-center'>
          <p className='text-slate-500 text-sm'>Đang đọc file Excel...</p>
        </div>
      )}

      {rows.length > 0 && printStatus === 'idle' && (
        <>
          <BatchPreview rows={rows} />
          <div className='flex justify-between items-center pt-4 border-t border-slate-200'>
            <div className='text-sm'>
              <p className='font-bold text-slate-900'>{validRows.length} phiếu hợp lệ</p>
              {invalidCount > 0 && (
                <p className='text-red-500'>⚠️ {invalidCount} dòng lỗi - Sửa trong Excel và tải lại</p>
              )}
            </div>
            <button
              onClick={handleBatchPrint}
              disabled={validRows.length === 0}
              className='cursor-pointer h-12 px-6 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold uppercase tracking-wider text-xs shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              In {validRows.length} Phiếu
            </button>
          </div>
        </>
      )}

      {printStatus === 'printing' && (
        <BatchProgress current={currentPrintIndex} total={validRows.length} />
      )}

      {printStatus === 'completed' && (
        <div className='bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 text-center'>
          <p className='font-bold text-lg mb-2'>✅ Hoàn thành!</p>
          <p className='text-sm mb-4'>Đã in {validRows.length} phiếu</p>
          <button
            onClick={handleReset}
            className='cursor-pointer px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-sm'
          >
            In bộ mới
          </button>
        </div>
      )}
    </div>
  )
}
