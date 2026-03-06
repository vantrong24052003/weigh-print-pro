## Context

The current weighing report system requires manual entry of each vehicle's data before printing. For high-volume weighing stations, this creates a bottleneck. The solution is to enable batch operations via Excel file import/export.

### Two Operation Modes

| Mode | Input Method | Description |
|------|--------------|-------------|
| **Simple** | Manual form | Current functionality - unchanged. Users fill form fields and print one receipt at a time |
| **Batch** | Excel file | New functionality. Users upload Excel with multiple records and print all at once |

### Simple Mode Data Flow (Unchanged)
```
User Input → Form State → Validation → Preview → Print (ESC/POS) → QZ Tray → Printer
```

### Batch Mode Data Flow (New)
```
Excel Template → User Fills Data → Upload → Parse & Validate → Preview → Batch Print Queue → Print Each → QZ Tray → Printer
```

## Goals / Non-Goals

**Goals:**
- Allow users to download an Excel template with correct column headers
- Parse uploaded Excel files and validate each row
- Display preview of all records before printing
- Print all valid records sequentially with progress indication
- Report errors for invalid rows without blocking valid ones

**Non-Goals:**
- Editing data in the preview table (user must fix in Excel and re-upload)
- Saving uploaded data to a database (this is a print-only feature)
- Supporting other file formats (CSV, Google Sheets) in this iteration
- Parallel printing (sequential is safer for thermal printers)

## Decisions

### Decision 1: Use `xlsx` (SheetJS) library for Excel handling

**Choice**: Use the `xlsx` library for both template generation and file parsing.

**Rationale**: SheetJS is the most popular and well-maintained JavaScript library for Excel operations. It supports both reading and writing, has no external dependencies, and works in browsers.

**Alternative considered**: `exceljs` - More features but larger bundle size. Not needed for simple read/write operations.

---

### Decision 2: Template columns match form fields exactly

**Choice**: The Excel template will have the following columns (in Vietnamese for user convenience):

| Column Header | Field | Example |
|---------------|-------|---------|
| Số phiếu | no | 0011 |
| Nhân viên | operator | 01 |
| Biển số xe | licensePlate | 43C-123.45 |
| Ngày | date | 26-02-2026 |
| Giờ | time | 07:55:27 |
| Số trục | axleCount | 3 |
| Trục 1 Trái | axle1_left | 4675 |
| Trục 1 Phải | axle1_right | 4475 |
| Trục 2 Trái | axle2_left | ... |
| ... | ... | ... |
| Trục 10 Phải | axle10_right | ... |

**Rationale**: Using Vietnamese headers makes it easier for local users. The axle columns are dynamic (up to 10 axles) to match the current form capability.

---

### Decision 3: Dynamic axle column handling

**Choice**: The template includes columns for all 10 possible axles (Trục 1-10, Trái/Phải). Empty cells are treated as "no data" for that axle.

**Rationale**: Simpler template structure than dynamically generating columns based on a "số trục" value. Users can leave unused axle columns blank.

---

### Decision 4: Sequential printing with progress

**Choice**: Print records one at a time, showing progress (e.g., "3/10 completed").

**Rationale**: Thermal printers need time between jobs. Sequential printing avoids buffer overflows and allows the user to stop if there's a paper issue.

---

### Decision 5: Error handling per row

**Choice**: If a row fails validation, mark it as "error" but continue processing other rows. Show summary of errors after parsing.

**Rationale**: Prevents one bad row from blocking the entire batch. User can fix problematic rows in Excel and re-upload.

---

### Decision 6: UI as a separate tab/section

**Choice**: Add a tab system to the main app: "Nhập liệu" (current form) and "In hàng loạt" (batch print).

**Rationale**: Keeps the single-print workflow unchanged while adding batch functionality in a separate view.

## Risks / Trade-offs

- **Risk**: Large Excel files (100+ rows) may cause UI lag during parsing → **Mitigation**: Show loading indicator, limit to 100 rows per batch
- **Risk**: User might upload wrong file format → **Mitigation**: Validate file extension and show clear error message
- **Risk**: Printer runs out of paper mid-batch → **Mitigation**: Allow pause/resume, show progress clearly
- **Risk**: Excel date/time format parsing issues → **Mitigation**: Accept multiple formats, provide clear template examples

## Component Structure

```
src/
├── components/
│   └── batch-print/
│       ├── BatchPrintPanel.tsx      # Main container with tabs
│       ├── TemplateDownload.tsx     # Download template button
│       ├── ExcelUploader.tsx        # Drag & drop + file input
│       ├── BatchPreview.tsx         # Table preview of parsed data
│       ├── BatchProgress.tsx        # Progress bar during print
│       └── BatchSummary.tsx         # Success/error summary
├── hooks/
│   ├── useExcelParser.ts            # Parse Excel to data array
│   └── useBatchPrint.ts             # Manage batch print queue
├── utils/
│   └── excel.ts                     # SheetJS wrapper functions
└── types.ts                         # Add BatchPrintRow interface
```

## Data Types

```typescript
interface BatchPrintRow {
  rowIndex: number
  data: {
    no: string
    operator: string
    licensePlate: string
    date: string
    time: string
    axles: AxleData[]
  }
  grossWeight: number
  isValid: boolean
  errors: Record<string, string>
}

interface BatchPrintState {
  rows: BatchPrintRow[]
  currentIndex: number
  status: 'idle' | 'parsing' | 'preview' | 'printing' | 'completed' | 'error'
  error?: string
}
```

## UI Mockup

### Mode: Simple (Tab 1) - Unchanged from current
```
┌─────────────────────────────────────────────────────────────┐
│  PHIẾU CÂN XE                                               │
│  ┌─────────────────┐ ┌─────────────────────┐               │
│  │ ● Nhập liệu     │ │ In hàng loạt       │               │
│  └─────────────────┘ └─────────────────────┘               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [CURRENT FORM - UNCHANGED]                                │
│                                                             │
│  Số phiếu: [________]    Nhân viên: [________]            │
│  Biển số xe: [________________]                            │
│  Ngày: [________]    Giờ: [________]                      │
│  Số trục: [__] [Thêm]                                     │
│                                                             │
│  Trục 1: Trái [____]  Phải [____]                          │
│  Trục 2: Trái [____]  Phải [____]                          │
│  ...                                                        │
│                                                             │
│  Tổng Gross: 12,500 kg          [ In Phiếu ]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mode: Batch (Tab 2) - New functionality
```
┌─────────────────────────────────────────────────────────────┐
│  PHIẾU CÂN XE                                               │
│  ┌─────────────────┐ ┌─────────────────────┐               │
│  │ Nhập liệu       │ │ ● In hàng loạt      │               │
│  └─────────────────┘ └─────────────────────┘               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📥 TẢI TEMPLATE EXCEL    📤 TẢI FILE EXCEL LÊN             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  PREVIEW TABLE (after upload):                              │
│  ┌─────┬──────────┬──────────┬────────┬───────┬──────────┐ │
│  │ #   │ Số phiếu │ Biển số  │ Ngày   │ Trục  │ Tổng(kg) │ │
│  ├─────┼──────────┼──────────┼────────┼───────┼──────────┤ │
│  │ 1 ✓ │ 0011     │ 43C-123  │ 26-02  │ 3     │ 12,500   │ │
│  │ 2 ✓ │ 0012     │ 43C-456  │ 26-02  │ 4     │ 18,200   │ │
│  │ 3 ❌│ 0013     │          │ 26-02  │ 2     │ ERROR    │ │
│  └─────┴──────────┴──────────┴────────┴───────┴──────────┘ │
│                                                             │
│  ⚠️ 1 dòng lỗi - Vui lòng sửa trong Excel và tải lại       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│                 [ IN 2 PHIẾU HỢP LỆ ]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
