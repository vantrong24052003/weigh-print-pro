## 0. Preserve Simple Mode (No Changes Required)

- [x] 0.1 Simple mode (tab "Nhập liệu") remains completely unchanged
- [x] 0.2 All existing components, hooks, and utilities for single print continue to work as before
- [x] 0.3 No modifications to existing validation schema for Simple mode

---

## 1. Setup & Dependencies

- [x] 1.1 Install `xlsx` package: `npm install xlsx`
- [x] 1.2 TypeScript types included in xlsx package (no separate install needed)

## 2. Type Definitions

- [x] 2.1 Add `BatchPrintRow` interface to `src/types.ts`
- [x] 2.2 Add `BatchPrintState` interface to `src/types.ts`
- [x] 2.3 Add `AppMode` type for mode switching

## 3. Excel Utilities (`src/utils/excel.ts`)

- [x] 3.1 Create `generateTemplate()` function - generates Excel file with headers
- [x] 3.2 Create `downloadTemplate()` function - triggers browser download
- [x] 3.3 Create `parseExcelFile(file: File)` function - reads and parses uploaded file
- [x] 3.4 Create `mapRowToData(row: any)` function - maps Excel row to form data
- [x] 3.5 Create `validateRow(data: any, rowIndex: number)` function - validates each row

## 4. Custom Hooks

- [ ] 4.1 Create `useExcelParser` hook in `src/hooks/useExcelParser.ts`
  - [ ] 4.1.1 Handle file selection
  - [ ] 4.1.2 Parse file using excel utils
  - [ ] 4.1.3 Validate all rows
  - [ ] 4.1.4 Return parsed data + errors
- [ ] 4.2 Create `useBatchPrint` hook in `src/hooks/useBatchPrint.ts`
  - [ ] 4.2.1 Manage print queue state
  - [ ] 4.2.2 Implement `startBatchPrint()` function
  - [ ] 4.2.3 Implement `pauseBatchPrint()` function
  - [ ] 4.2.4 Track progress (current index, total)
  - [ ] 4.2.5 Handle print errors gracefully

## 5. UI Components (`src/components/batch-print/`)

- [x] 5.1 Create `BatchPrintPanel.tsx` - main container
- [x] 5.2 Create `ExcelUploader.tsx` - file upload with drag & drop
- [x] 5.3 Create `BatchPreview.tsx` - table showing parsed data
- [x] 5.4 Create `BatchProgress.tsx` - progress bar during printing

## 6. App Integration (Add Tabs)

- [x] 6.1 Create a simple tab state in `src/App.tsx` (`'simple' | 'batch'`)
- [x] 6.2 Add tab navigation UI (2 tabs: "Nhập liệu" and "In hàng loạt")
- - [x] 6.3 Keep existing form in "Nhập liệu" tab (no changes to existing code)
- - [x] 6.4 Add `BatchPrintPanel` component in "In hàng loạt" tab
- - [x] 6.5 Share `useQzPrinter` hook - connection status visible in both tabs

## 7. Validation & Error Handling

- [ ] 7.1 Validate required fields (no, licensePlate, axles)
- [ ] 7.2 Validate date format (accept DD-MM-YYYY or YYYY-MM-DD)
- [ ] 7.3 Validate time format (accept HH:mm:ss or HH:mm)
- [ ] 7.4 Validate axle values are numbers
- [ ] 7.5 Show row-level errors in preview table
- [ ] 7.6 Show file-level errors (wrong format, empty file, etc.)

## 8. Testing

- [ ] 8.1 Test template download works correctly
- [ ] 8.2 Test parsing valid Excel file
- [ ] 8.3 Test parsing Excel with invalid rows
- [ ] 8.4 Test parsing empty Excel
- [ ] 8.5 Test parsing wrong file format (CSV, etc.)
- [ ] 8.6 Test batch print with 5+ records
- [ ] 8.7 Test pause/resume during batch print
- [ ] 8.8 Test print error handling (what happens if printer disconnects mid-batch)

## 9. Polish

- [ ] 9.1 Add loading states during file parsing
- [ ] 9.2 Add confirmation dialog before starting batch print
- [ ] 9.3 Add sound/notification when batch completes
- [ ] 9.4 Add Vietnamese labels for all new UI elements
- [ ] 9.5 Ensure responsive design works on tablet screens
