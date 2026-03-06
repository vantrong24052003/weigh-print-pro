import type { AxleData } from '@/types'
import { formatDate } from './date'


export const ESC = 0x1B;
export const GS = 0x1D;
export const LF = 0x0A;

export const COMMANDS = {
  HW_INIT: new Uint8Array([ESC, 0x40]),
  TEXT_ALIGN_LEFT: new Uint8Array([ESC, 0x61, 0x00]),
  TEXT_ALIGN_CENTER: new Uint8Array([ESC, 0x61, 0x01]),
  TEXT_ALIGN_RIGHT: new Uint8Array([ESC, 0x61, 0x02]),
  TEXT_BOLD_ON: new Uint8Array([ESC, 0x45, 0x01]),
  TEXT_BOLD_OFF: new Uint8Array([ESC, 0x45, 0x00]),
  TEXT_SIZE_NORMAL: new Uint8Array([ESC, 0x21, 0x00]),
  TEXT_SIZE_LARGE: new Uint8Array([ESC, 0x21, 0x30]),
  PAPER_CUT: new Uint8Array([GS, 0x56, 0x42, 0x00]),
};

export class EscPosBuilder {
  private buffer: number[] = [];
  private encoder = new TextEncoder();

  add(bytes: Uint8Array): this {
    this.buffer.push(...Array.from(bytes));
    return this;
  }

  text(content: string): this {
    const unaccented = content.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    const encoded = this.encoder.encode(unaccented);
    this.buffer.push(...Array.from(encoded));
    return this;
  }

  line(content: string = ''): this {
    this.text(content);
    this.buffer.push(LF);
    return this;
  }

  feed(lines: number = 1): this {
    for (let i = 0; i < lines; i++) {
      this.buffer.push(LF);
    }
    return this;
  }

  build(): Uint8Array {
    return new Uint8Array(this.buffer);
  }
}

export const encodeWeighingReport = (data: {
  licensePlate: string;
  date: string;
  time: string;
  axles: AxleData[];
  grossWeight: number;
}, no: string = '0011'): Uint8Array => {
  const builder = new EscPosBuilder();

  builder
    .add(COMMANDS.HW_INIT)
    .add(COMMANDS.TEXT_SIZE_NORMAL)
    .line('WEIGHING                  REPORT')
    .line('--------------------------------')
    .line(`NO. :     ${no}`)
    .line(`Date:     ${formatDate(data.date)}`)
    .line(`Time:     ${data.time}`)
    .line(`Vehicle:  ${data.licensePlate || '0000'}`)
    .line(`Operator: 00`)
    .line('--------------------------------')
    .feed();

  data.axles.forEach((axle, idx) => {
    const l = axle.left || '0'
    const r = axle.right || '0'
    const total = (parseFloat(l) || 0) + (parseFloat(r) || 0)
    builder
      .line(`LW:       ${l}kg`)
      .line(`RW:       ${r}kg`)
      .add(COMMANDS.TEXT_BOLD_ON)
      .line(`Axle${String(idx + 1).padStart(2, '0')}:  ${total}kg`)
      .add(COMMANDS.TEXT_BOLD_OFF)
      .feed();
  })

  builder
    .line('--------------------------------')
    .add(COMMANDS.TEXT_BOLD_ON)
    .line(`Gross:    ${data.grossWeight}kg`)
    .add(COMMANDS.TEXT_BOLD_OFF)
    .line('--------------------------------')
    .feed(3)
    .add(COMMANDS.PAPER_CUT);

  return builder.build();
}
