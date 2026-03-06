import { useCallback, useRef } from 'react'

interface ExcelUploaderProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
}

export function ExcelUploader({ onFileSelect, isLoading }: ExcelUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
        e.target.value = ''
      }
    },
    [onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        onFileSelect(file)
      } else {
        alert('Vui lòng tải file Excel (.xlsx hoặc .xls)')
      }
    },
    [onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`cursor-pointer flex-1 flex flex-col items-center justify-center gap-2 bg-emerald-50 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg p-4 hover:bg-emerald-100 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input ref={inputRef} type='file' accept='.xlsx,.xls' onChange={handleChange} className='hidden' />
      <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='17 8 12 3 7 8' />
        <line x1='12' y1='3' x2='12' y2='15' />
      </svg>
      {isLoading ? (
        <span className='font-bold text-sm uppercase'>Đang đọc...</span>
      ) : (
        <>
          <span className='font-bold text-sm uppercase'>Tải File Excel Lên</span>
          <span className='text-xs opacity-70'>Kéo thả hoặc click để chọn</span>
        </>
      )}
    </div>
  )
}
