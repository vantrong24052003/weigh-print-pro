## Why

The current ESC/POS formatting logic in `src/utils/escpos.ts` produces receipts with uneven left/right margins and inconsistent column alignment for axle weight data. The output does not match the expected real-world receipt format (as shown in the reference photo), where the header, info block, axle data rows, and totals are all neatly aligned within the 32-character print width of a 58mm thermal printer.

## What Changes

- **BREAKING**: Delete all existing logic in `src/utils/escpos.ts` and rewrite from scratch to eliminate formatting cache/inconsistencies.
- Rewrite `encodeWeighingReport()` with a clean, predictable line-building approach.
- Remove `lineInArea()`, `separator()`, `headerWeighingReport()` helper methods and replace with simpler, explicit formatting functions.
- Implement fixed-width column formatting for axle data rows (`LW`, `RW`, `Axle##`) using `padEnd`/`padStart` with constant column widths.
- Ensure the separator line spans the full `CONTENT_WIDTH` consistently.
- Header text (`WEIGHING   REPORT`) uses hardware center-align command, not manual space padding.

## Capabilities

### New Capabilities
- `escpos-format-v2`: Complete rewrite of the ESC/POS receipt formatting engine for 58mm (32-char) thermal printers with correct margin handling and two-column axle data layout.

### Modified Capabilities
<!-- No existing spec-level requirements are changing; this is an internal implementation rewrite. -->

## Impact

- **Files modified**: `src/utils/escpos.ts` (full rewrite)
- **Files potentially affected**: Any component that imports from `escpos.ts` (e.g., `PrintPreview.tsx`, print handler hooks)
- **No API changes**: The exported function `encodeWeighingReport()` signature remains the same
- **No dependency changes**: Still uses `TextEncoder` and QZ Tray for delivery
