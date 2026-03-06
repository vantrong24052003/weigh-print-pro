import type { AxleData } from '@/types'

const LINE_WIDTH = 32

export const ESC = 0x1b
export const GS = 0x1d
export const LF = 0x0a

export const COMMANDS = {
  HW_INIT: new Uint8Array([ESC, 0x40]),
  TEXT_ALIGN_LEFT: new Uint8Array([ESC, 0x61, 0x00]),
  TEXT_SIZE_NORMAL: new Uint8Array([ESC, 0x21, 0x00]),
  PAPER_CUT: new Uint8Array([GS, 0x56, 0x42, 0x00])
} as const

export class EscPosBuilder {
  private buffer: number[] = []
  private encoder = new TextEncoder()

  add(bytes: Uint8Array): this {
    this.buffer.push(...Array.from(bytes))
    return this
  }

  text(content: string): this {
    const safe = stripDiacritics(content)
    this.buffer.push(...Array.from(this.encoder.encode(safe)))
    return this
  }

  line(content: string = ''): this {
    return this.text(content).lf()
  }

  feed(n: number = 1): this {
    for (let i = 0; i < n; i++) this.lf()
    return this
  }

  build(): Uint8Array {
    return new Uint8Array(this.buffer)
  }

  private lf(): this {
    this.buffer.push(LF)
    return this
  }
}

function stripDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

function separator(): string {
  return '-'.repeat(LINE_WIDTH)
}

function padLine(text: string): string {
  return text.padEnd(LINE_WIDTH)
}

function fillLine(left: string, right: string): string {
  const gap = Math.max(1, LINE_WIDTH - left.length - right.length)
  return left + ' '.repeat(gap) + right
}

export type ReceiptData = {
  licensePlate: string
  date: string
  time: string
  operator: string
  axles: AxleData[]
  grossWeight: number
}

export function buildReceiptLines(data: ReceiptData, no: string = ''): string[] {
  const lines: string[] = []
  const push = (...l: string[]) => lines.push(...l)

  push(fillLine('WEIGHING', 'REPORT'))
  push(separator())
  push('')
  push(padLine(`NO. : ${no}`))
  push(padLine(`Date: ${data.date}`))
  push(padLine(`Time: ${data.time}`))
  push(padLine(`Vehicle: ${data.licensePlate || ''}`))
  push(padLine(`Operator:${data.operator || ''}`))
  push('')

  data.axles.forEach((axle, idx) => {
    const left = axle.left || '0'
    const right = axle.right || '0'
    const total = (parseFloat(left) || 0) + (parseFloat(right) || 0)
    const label = `Axle${String(idx + 1).padStart(2, '0')}:`
    push(padLine(`LW:  ${left}kg`))
    push(padLine(`RW:  ${right}kg`))
    push(fillLine(label, `${total}kg`))
    push('')
  })

  push(separator())
  push(fillLine('Gross:', `${data.grossWeight}kg`))
  push(separator())

  return lines
}

export const encodeWeighingReport = (data: ReceiptData, no: string = ''): Uint8Array => {
  const b = new EscPosBuilder()

  b.add(COMMANDS.HW_INIT).add(COMMANDS.TEXT_SIZE_NORMAL).add(COMMANDS.TEXT_ALIGN_LEFT)

  for (const line of buildReceiptLines(data, no)) {
    b.line(line)
  }

  b.feed(3).add(COMMANDS.PAPER_CUT)

  return b.build()
}
