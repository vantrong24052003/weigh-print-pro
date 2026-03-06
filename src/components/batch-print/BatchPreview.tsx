import type { BatchPrintRow } from '@/types'

interface BatchPreviewProps {
  rows: BatchPrintRow[]
}

export function BatchPreview({ rows }: BatchPreviewProps) {
  return (
    <div className='space-y-3'>
      <div className='overflow-x-auto'>
        <table className='w-full text-xs'>
          <thead>
            <tr className='border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold'>
              <th className='py-2 px-1 text-center'>#</th>
              <th className='py-2 px-1 text-left'>Số phiếu</th>
              <th className='py-2 px-1 text-left'>NV</th>
              <th className='py-2 px-1 text-left'>Biển số</th>
              <th className='py-2 px-1 text-left'>Ngày</th>
              <th className='py-2 px-1 text-left'>Giờ</th>
              <th className='py-2 px-1 text-center'>Trục</th>
              <th className='py-2 px-1 text-right'>Tổng (kg)</th>
              <th className='py-2 px-1 text-center'>TT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.rowIndex}
                className={`border-b border-slate-100 ${row.isValid ? 'bg-white' : 'bg-red-50'}`}
              >
                <td className='py-2 px-1 text-center text-slate-400'>{row.rowIndex}</td>
                <td className='py-2 px-1 font-mono'>{row.data.no}</td>
                <td className='py-2 px-1'>{row.data.operator}</td>
                <td className='py-2 px-1 font-mono'>{row.data.licensePlate}</td>
                <td className='py-2 px-1 font-mono'>{row.data.date}</td>
                <td className='py-2 px-1 font-mono'>{row.data.time}</td>
                <td className='py-2 px-1 text-center'>{row.data.axleCount}</td>
                <td className='py-2 px-1 text-right font-bold text-slate-900'>{row.grossWeight.toLocaleString()}</td>
                <td className='py-2 px-1 text-center'>
                  {row.isValid ? (
                    <span className='text-green-600' title='Hợp lệ'>✓</span>
                  ) : (
                    <span className='text-red-600' title={Object.values(row.errors).join(', ')}>❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chi tiết các trục */}
      {rows.length > 0 && (
        <div className='border border-slate-200 rounded-lg p-3'>
          <p className='text-[10px] font-bold text-slate-500 uppercase mb-2'>Chi tiết cân các trục</p>
          <div className='space-y-2'>
            {rows.map((row) => (
              <div key={row.rowIndex} className={`p-2 rounded ${row.isValid ? 'bg-slate-50' : 'bg-red-50 border border-red-200'}`}>
                <div className='flex justify-between items-center mb-1'>
                  <span className='font-bold text-xs'>
                    {row.rowIndex}. {row.data.no} - {row.data.licensePlate}
                  </span>
                  <span className={`text-xs font-bold ${row.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {row.isValid ? '✓ Hợp lệ' : '❌ Lỗi'}
                  </span>
                </div>

                <div className='text-[10px] text-slate-500 mb-1'>
                  NV: {row.data.operator} | Ngày: {row.data.date} | Giờ: {row.data.time}
                </div>

                {/* Axle details */}
                <div className='grid grid-cols-5 gap-1 text-[9px]'>
                  {row.data.axles.map((axle, idx) => (
                    <div key={idx} className='bg-white p-1 rounded border border-slate-100'>
                      <div className='font-bold text-center text-slate-600'>Trục {idx + 1}</div>
                      <div className='flex justify-between'>
                        <span className='text-blue-600'>L: {axle.left || '-'}</span>
                        <span className='text-orange-600'>R: {axle.right || '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='text-right mt-1 text-xs font-bold'>
                  Tổng: {row.grossWeight.toLocaleString()} kg
                </div>

                {/* Errors */}
                {!row.isValid && (
                  <div className='mt-1 text-[9px] text-red-600'>
                    {Object.entries(row.errors).map(([key, msg]) => (
                      <span key={key} className='mr-2'>• {msg}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error summary */}
      {rows.some((r) => !r.isValid) && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700'>
          <p className='font-bold mb-2'>⚠️ Các dòng có lỗi:</p>
          {rows
            .filter((r) => !r.isValid)
            .map((r) => (
              <div key={r.rowIndex} className='mb-2 pl-2 border-l-2 border-red-300'>
                <p className='font-bold'>Dòng {r.rowIndex} ({r.data.no}):</p>
                <ul className='list-disc list-inside ml-2 text-[11px]'>
                  {Object.entries(r.errors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
