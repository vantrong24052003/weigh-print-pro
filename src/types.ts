export interface AxleData {
  left: string
  right: string
}

export interface BatchPrintRow {
  rowIndex: number
  data: {
    no: string
    operator: string
    licensePlate: string
    date: string
    time: string
    axleCount: number
    axles: AxleData[]
  }
  grossWeight: number
  isValid: boolean
  errors: Record<string, string>
}

export interface BatchPrintState {
  rows: BatchPrintRow[]
  status: 'idle' | 'parsing' | 'preview' | 'printing' | 'completed' | 'error'
  currentPrintIndex: number
  error?: string
}

export interface RawExcelRow {
  'Số phiếu': string
  'Nhân viên': string
  'Biển số xe': string
  'Ngày': string
  'Giờ': string
  'Số trục': number | string
  [key: string]: string | number
}


export type AppMode = 'simple' | 'batch'
