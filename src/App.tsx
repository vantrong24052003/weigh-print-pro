import { useState, useMemo } from 'react'
import * as yup from 'yup'
import type { AxleData } from '@/types'
import { weighingSchema } from '@/schemas/weighingSchema'
import { getCurrentDate, getCurrentTime } from '@/utils/date'
import { AxleRow } from '@/components/weighing-report/AxleRow'
import { PrintPreview } from '@/components/weighing-report/PrintPreview'
import { useQzPrinter } from '@/hooks/useQzPrinter'
import { encodeWeighingReport } from '@/utils/escpos'
import '@/App.css'

export default function App() {
  const [form, setForm] = useState({
    no: '',
    operator: '',
    licensePlate: '',
    date: getCurrentDate(),
    time: getCurrentTime(),
    tempAxleCount: 0,
    axles: [] as AxleData[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const { connect, disconnect, print: qzPrint, isConnected, error: qzError } = useQzPrinter()


  const grossWeight = useMemo(() =>
    form.axles.reduce((total, axle) => total + (parseFloat(axle.left) || 0) + (parseFloat(axle.right) || 0), 0)
    , [form.axles])

  const handleUpdate = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleAxleChange = (idx: number, side: 'left' | 'right', val: string) => {
    const nextAxles = [...form.axles]
    nextAxles[idx][side] = val
    setForm(prev => ({ ...prev, axles: nextAxles }))

    const key = `axles[${idx}].${side}`
    setErrors(prev => ({ ...prev, [key]: '', axles: '' }))
  }

  const handleAddAxles = () => {
    if (form.tempAxleCount <= 0) {
      setErrors(prev => ({ ...prev, tempAxleCount: 'Số trục phải > 0' }))
      return
    }
    const nextAxles = Array.from({ length: form.tempAxleCount }, () => ({ left: '', right: '' }))
    setForm(prev => ({ ...prev, axles: nextAxles }))
    setErrors({})
  }

  const validateForm = async () => {
    try {
      setErrors({})
      await weighingSchema.validate(form, { abortEarly: false })
      return true
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const mappedErrors = err.inner.reduce((acc, current) => {
          if (current.path) acc[current.path] = current.message
          return acc
        }, {} as Record<string, string>)
        setErrors(mappedErrors)
      }
      return false
    }
  }

  const handlePrint = async () => {
    if (await validateForm()) {
      if (isConnected) {
        const bytes = encodeWeighingReport({ ...form, grossWeight }, form.no)
        await qzPrint(bytes)
        setShowPreview(false)
      } else {
        alert('Chưa kết nối QZ Tray! Vui lòng nhấn nút "KẾT NỐI QZ TRAY" ở góc trên bên phải.')
      }
    }
  }

  const handleShowPreview = async () => {
    if (await validateForm()) {
      setShowPreview(true)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <header className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PHIẾU CÂN XE</h1>
            <p className="text-slate-500 text-sm">Nhập liệu và in phiếu cân trạm</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={isConnected ? disconnect : connect}
              className={`cursor-pointer text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${isConnected
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-900'
                }`}
            >
              {isConnected ? `● QZ TRAY (AIMO)` : '○ KẾT NỐI QZ TRAY'}
            </button>
            {qzError && <span className="text-[8px] text-red-400 font-medium max-w-[150px] text-right">{qzError}</span>}
          </div>
        </header>

        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Số phiếu (NO.)</label>
              <input
                type="text"
                placeholder="VD: 0011"
                className={`w-full bg-slate-50 border ${errors.no ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 outline-none focus:border-slate-900 transition-colors`}
                value={form.no}
                onChange={e => handleUpdate('no', e.target.value)}
              />
              {errors.no && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.no}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Nhân viên (Operator)</label>
              <input
                type="text"
                placeholder="VD: 01"
                className={`w-full bg-slate-50 border ${errors.operator ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 outline-none focus:border-slate-900 transition-colors`}
                value={form.operator}
                onChange={e => handleUpdate('operator', e.target.value)}
              />
              {errors.operator && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.operator}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Biển số xe</label>
              <input
                type="text"
                placeholder="VD: 43C-123.45"
                className={`w-full bg-slate-50 border ${errors.licensePlate ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 outline-none focus:border-slate-900 transition-colors`}
                value={form.licensePlate}
                onChange={e => handleUpdate('licensePlate', e.target.value)}
              />
              {errors.licensePlate && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.licensePlate}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center mb-1.5 mt-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Ngày giờ cân</label>
                <button
                  onClick={() => setForm(f => ({ ...f, date: getCurrentDate(), time: getCurrentTime() }))}
                  className="cursor-pointer flex items-center gap-1.5 text-[10px] font-bold bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition-colors uppercase"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  LẤY HIỆN TẠI
                </button>
              </div>
              <div className="flex gap-4">
                <input
                  type="date"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-slate-900 transition-colors text-sm"
                  value={form.date}
                  onChange={e => handleUpdate('date', e.target.value)}
                />
                <input
                  type="time"
                  step="1"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-slate-900 transition-colors text-sm"
                  value={form.time}
                  onChange={e => handleUpdate('time', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Số lần đo (Số trục)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0"
                className={`flex-1 bg-slate-50 border ${errors.tempAxleCount ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 outline-none focus:border-slate-900 transition-colors`}
                value={form.tempAxleCount || ''}
                onChange={e => handleUpdate('tempAxleCount', parseInt(e.target.value) || 0)}
              />
              <button
                onClick={handleAddAxles}
                className="cursor-pointer px-6 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-bold uppercase text-xs"
              >
                Thêm
              </button>
            </div>
            {errors.tempAxleCount && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.tempAxleCount}</p>}
          </div>

          {form.axles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <span className="w-6 text-center">Trục</span>
                <div className="flex-1 grid grid-cols-2 gap-2 text-center">
                  <span>Trái (L)</span>
                  <span>Phải (R)</span>
                </div>
              </div>
              <div className="space-y-2">
                {form.axles.map((axle, idx) => (
                  <AxleRow
                    key={idx}
                    index={idx}
                    data={axle}
                    error={{
                      left: errors[`axles[${idx}].left`],
                      right: errors[`axles[${idx}].right`]
                    }}
                    onChange={(side, val) => handleAxleChange(idx, side, val)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng Gross</p>
              <div className="text-3xl font-bold text-slate-900">
                {grossWeight.toLocaleString()} <span className="text-sm font-normal text-slate-400 uppercase">kg</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleShowPreview}
                className="cursor-pointer h-12 px-6 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold uppercase tracking-wider text-xs shadow-sm active:scale-95"
              >
                In Phiếu
              </button>
            </div>
          </div>
        </main>

        <footer className="pt-8 text-center text-slate-400 text-[10px] uppercase font-medium tracking-widest">
          WeighingSystem v2.0
        </footer>
      </div>

      {showPreview && (
        <PrintPreview
          data={{ ...form, grossWeight }}
          no={form.no}
          onClose={() => setShowPreview(false)}
          onQzPrint={handlePrint}
        />
      )}
    </div>
  )
}
