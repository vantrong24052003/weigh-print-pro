## 1. Pre-flight Check

- [x] 1.1 Grep all imports of `escpos.ts` across the codebase to identify all callers (e.g., `PrintPreview.tsx`, print hooks)
- [x] 1.2 Confirm no callers use internal helpers (`lineInArea`, `separator`, `headerWeighingReport`, `EscPosBuilder`) directly — only the exported `encodeWeighingReport`, `COMMANDS`, `EscPosBuilder` base

## 2. Rewrite `src/utils/escpos.ts`

- [x] 2.1 Delete all existing content of `src/utils/escpos.ts`
- [x] 2.2 Define constants: `LINE_WIDTH = 32` (separator = `'-'.repeat(LINE_WIDTH)`, no separate constant needed)
- [x] 2.3 Define and export `ESC`, `GS`, `LF` byte constants
- [x] 2.4 Define and export `COMMANDS` object (HW_INIT, TEXT_ALIGN_LEFT, TEXT_ALIGN_CENTER, TEXT_ALIGN_RIGHT, TEXT_BOLD_ON, TEXT_BOLD_OFF, TEXT_SIZE_NORMAL, TEXT_SIZE_LARGE, PAPER_CUT)
- [x] 2.5 Implement `EscPosBuilder` class with: `add()`, `text()`, `line()`, `feed()`, `build()` — no margin logic
- [x] 2.6 Add private `stripDiacritics(str: string): string` helper that does NFD normalize + strip combining + `đ→d` / `Đ→D`
- [x] 2.7 Implement `encodeWeighingReport()` function:
  - Send `HW_INIT`, `TEXT_SIZE_NORMAL`, `TEXT_ALIGN_LEFT`
  - Send `TEXT_ALIGN_CENTER` → print `"WEIGHING  REPORT"` → send `TEXT_ALIGN_LEFT`
  - Print separator (`'-'.repeat(LINE_WIDTH)` — full 32 dashes)
  - Print blank line
  - Print info block: `NO. : <no>`, `Date: <date>`, `Time: <time>`, `Vehicle: <plate>`, `Operator:<operator>`
  - Feed 1 line
  - For each axle: print `LW:  <left>kg`, `RW:  <right>kg`, `Axle<nn>: <total>kg`, feed 1 line
  - Print separator
  - Print `Gross: <grossWeight>kg`
  - Print separator
  - Feed 3 lines
  - Send `PAPER_CUT`

## 3. Verify Receipt Output

- [ ] 3.1 Test print on physical 58mm printer and visually compare output to reference photo
- [ ] 3.2 Verify header `WEIGHING  REPORT` is centered
- [ ] 3.3 Verify separator is exactly 16 dashes
- [ ] 3.4 Verify axle `LW:  4675kg` spacing is consistent across all axle blocks
- [ ] 3.5 Verify `Gross:` is correctly wrapped between two separator lines
- [ ] 3.6 Verify Vietnamese diacritics (if any in vehicle plate or operator) are stripped correctly

## 4. TypeScript Build Check

- [x] 4.1 Run `npm run build` or `npx tsc --noEmit` to ensure no type errors after rewrite
- [x] 4.2 Confirm callers of `encodeWeighingReport()` compile without changes
