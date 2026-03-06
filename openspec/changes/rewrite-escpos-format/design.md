## Context

The project prints weighing reports to a 58mm thermal printer using raw ESC/POS commands sent via QZ Tray. The printer's printable area supports **32 characters per line** (monospace). The current implementation in `src/utils/escpos.ts` introduces margin offsets via `lineInArea()` which pads left/right by 1 character each side, shrinking the content width to 30 chars. This causes:

1. **Uneven margins** — The left/right 1-space padding approach is inconsistent with how the printer actually positions text, leading to slightly off-center output.
2. **Inconsistent column layout for axle data** — `LW:`, `RW:`, and `Axle##:` labels are left-aligned without column spacing, making numbers appear ragged.
3. **Header split `WEIGHING REPORT` is manual** — Space-padding between two words is fragile and doesn't account for printer's actual character grid.

Reference real receipt shows:
```
WEIGHING  REPORT
----------------
NO. : 0011
Date: 26-02-2026
Time: 07:55:27
Vehicle: 0000
Operator:00

LW:  4675kg
RW:  4475kg
Axle01:  9150kg

...

----------------
Gross: 44530kg
----------------
```

## Goals / Non-Goals

**Goals:**
- Print receipt that visually matches the reference photo
- Header `WEIGHING  REPORT` using hardware center-align or fixed spacing within 32 chars
- Info block (`NO.`, `Date`, `Time`, `Vehicle`, `Operator`) left-aligned, no extra padding
- Axle data blocks: label left-aligned, value right-aligned within a fixed column width
- Separator line: exactly 16 dashes (`----------------`), left-aligned or full-width
- Gross weight line matches separator width pattern
- Clean, readable TypeScript with no magic numbers — all widths from named constants

**Non-Goals:**
- Supporting other paper sizes (80mm, 40mm) — only 58mm (32 chars)
- Dynamic font size scaling
- Changing the QZ Tray delivery mechanism
- Modifying the exported function signature `encodeWeighingReport()`

## Decisions

### Decision 1: Remove `lineInArea()` and margin constants

**Choice**: Use the full 32-char line width directly. No left/right margin characters.

**Rationale**: ESC/POS printers' built-in margin (hardware margin) is set by the printer firmware — adding software space-characters on top creates double-margin and uneven appearance. The reference receipt shows text starting from the extreme left edge.

**Alternative considered**: Keep margins but calibrate to 0 — rejected because the original `lineInArea()` paradigm introduces complexity that the new clean implementation doesn't need.

---

### Decision 2: Fixed label column for axle data rows

**Choice**: Use a fixed label column width of 10 characters (e.g., `"LW:      "`, `"Axle01:  "`), and right-align the value within the remaining space.

**Rationale**: This mirrors the visual layout in the reference receipt where `LW:`, `RW:`, and `Axle##:` are left-aligned and values are indented/spaced consistently. A fixed 10-char label column leaves 22 chars for values within 32 total.

Layout pattern:
```
LW:   <value>
RW:   <value>
Axle01: <value>
```

---

### Decision 3: Separator fills full `LINE_WIDTH` dynamically

**Choice**: Separator is `'-'.repeat(LINE_WIDTH)` — always equals the full printable line width (32 chars for 58mm). No hardcoded length.

**Rationale**: A dynamic separator that fills the full width is cleaner and self-adjusting. If `LINE_WIDTH` ever changes (e.g. different paper), the separator adapts automatically. The visual result is a clean full-width divider on the receipt.

---

### Decision 4: Header uses CENTER alignment ESC command

**Choice**: Send `ESC a 1` (center align), print `"WEIGHING  REPORT"` text, then reset to `ESC a 0` (left align).

**Rationale**: Hardware center-align is more reliable than manual space-counting. Centers the title correctly regardless of minor firmware variations.

---

### Decision 5: Full rewrite, not incremental patch

**Choice**: Delete the entire content of `escpos.ts` and write fresh, instead of modifying individual functions.

**Rationale**: The user explicitly requested this to avoid formatting cache/artifacts from old logic. A clean slate also removes any lingering mental model debt.

## Risks / Trade-offs

- **Risk**: Other files import from `escpos.ts` and may use removed helpers (e.g., `lineInArea`, `separator`) → **Mitigation**: Grep for all usages before deleting; keep the public API (`encodeWeighingReport`, `COMMANDS`, `EscPosBuilder` base class) stable.
- **Risk**: Full-width separator (32 dashes) may look too heavy on small receipts → **Mitigation**: The separator length is derived from `LINE_WIDTH` constant, easy to tune in one place.
- **Risk**: Hardware center-align may not work on all ESC/POS printer models → **Mitigation**: Tested on the user's actual printer (connection already working); fallback is manual space calculation which can be added trivially.
