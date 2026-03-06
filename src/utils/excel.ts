import * as XLSX from 'xlsx'
import type { AxleData, BatchPrintRow, RawExcelRow } from '@/types'
import { parseDate, parseTime } from './date'

const MAX_AXLES = 10
const MAX_ROWS = 100

export const EXCEL_HEADERS = [
  'Số phiếu',
  'Nhân viên',
  'Biển số xe',
  'Ngày',
  'Giờ',
  'Số trục',
  ...Array.from({ length: MAX_AXLES }, (_, i) => [`Trục ${i + 1} Trái`, `Trục ${i + 1} Phải`]).flat()
]

export function generateTemplate(): Uint8Array {
  const wb = XLSX.utils.book_new()

  const sampleRow = [
    '0001',
    '01',
    '43C-123.45',
    '07-03-2026',
    '08:30:00',
    '3',
    '1500', '1600',
    '1400', '1550',
    '1450', '1500',
    ...Array.from({ length: MAX_AXLES - 3 }, () => ['', '']).flat()
  ]

  const ws = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS, sampleRow])

  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 8 },
    ...Array.from({ length: MAX_AXLES }, () => [{ wch: 10 }, { wch: 10 }]).flat()
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Template')

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
}

export function downloadTemplate(): void {
  const data = generateTemplate()
  const blob = new Blob([new Uint8Array(data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template_phieu_can.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}

function mapRowToData(row: RawExcelRow, rowIndex: number): BatchPrintRow {
  const axleCount = Math.min(MAX_AXLES, Math.max(1, Number(row['Số trục']) || 1))
  const axles: AxleData[] = []

  for (let i = 0; i < axleCount; i++) {
    const leftKey = `Trục ${i + 1} Trái`
    const rightKey = `Trục ${i + 1} Phải`
    axles.push({
      left: String(row[leftKey as keyof RawExcelRow] || ''),
      right: String(row[rightKey as keyof RawExcelRow] || '')
    })
  }

  const grossWeight = axles.reduce(
    (sum, axle) => sum + (parseFloat(axle.left) || 0) + (parseFloat(axle.right) || 0),
    0
  )

  return {
    rowIndex,
    data: {
      no: String(row['Số phiếu'] || ''),
      operator: String(row['Nhân viên'] || ''),
      licensePlate: String(row['Biển số xe'] || ''),
      date: parseDate(row['Ngày']),
      time: parseTime(row['Giờ']),
      axleCount,
      axles
    },
    grossWeight,
    isValid: true,
    errors: {}
  }
}

function validateRow(row: BatchPrintRow): BatchPrintRow {
  const errors: Record<string, string> = {}
  const { data } = row

  if (!data.no?.trim()) {
    errors.no = 'Thiếu số phiếu'
  }
  if (!data.operator?.trim()) {
    errors.operator = 'Thiếu nhân viên'
  }
  if (!data.licensePlate?.trim()) {
    errors.licensePlate = 'Thiếu biển số xe'
  }
  if (!data.date?.trim()) {
    errors.date = 'Thiếu ngày'
  }
  if (!data.time?.trim()) {
    errors.time = 'Thiếu giờ'
  }
  if (data.axleCount < 1 || data.axleCount > MAX_AXLES) {
    errors.axleCount = `Số trục phải từ 1 đến ${MAX_AXLES}`
  }

  data.axles.forEach((axle, idx) => {
    if (!axle.left.trim() && !axle.right.trim()) {
      errors[`axle_${idx}`] = `Thiếu dữ liệu trục ${idx + 1}`
    } else if (!axle.left.trim()) {
      errors[`axle_${idx}_left`] = `Thiếu cân trái trục ${idx + 1}`
    } else if (!axle.right.trim()) {
      errors[`axle_${idx}_right`] = `Thiếu cân phải trục ${idx + 1}`
    }
  })

  return {
    ...row,
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export async function parseExcelFile(file: File): Promise<{
  rows: BatchPrintRow[]
  error?: string
}> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json<RawExcelRow>(firstSheet)

        if (jsonData.length === 0) {
          resolve({ rows: [], error: 'File không có dữ liệu' })
          return
        }

        if (jsonData.length > MAX_ROWS) {
          resolve({ rows: [], error: `Tối đa ${MAX_ROWS} dòng mỗi lần in. File có ${jsonData.length} dòng.` })
          return
        }

        const rows = jsonData.map((row, idx) => {
          const parsedRow = mapRowToData(row, idx + 1)
          return validateRow(parsedRow)
        })

        resolve({ rows })
      } catch (err) {
        resolve({ rows: [], error: 'Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.' })
      }
    }

    reader.onerror = () => {
      resolve({ rows: [], error: 'Lỗi khi đọc file' })
    }

    reader.readAsArrayBuffer(file)
  })
}

export function getValidRows(rows: BatchPrintRow[]): BatchPrintRow[] {
  return rows.filter((row) => row.isValid)
}

export function getInvalidRows(rows: BatchPrintRow[]): BatchPrintRow[] {
  return rows.filter((row) => !row.isValid)
}
