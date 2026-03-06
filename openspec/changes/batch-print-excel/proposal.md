## Why

Currently, users can only print one weighing report at a time through manual form input. For operations that need to process multiple vehicles per day (e.g., weighing stations with high traffic), manually entering each record is time-consuming and error-prone. A batch printing feature would significantly improve efficiency by allowing users to:

1. Download a pre-defined Excel template
2. Fill in multiple weighing records offline
3. Upload the completed file and print all receipts at once

## What Changes

### Two Operation Modes

The application will support **2 modes** via a tab/switch UI:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Simple** | Manual form input (current functionality) | Single vehicle, quick entry |
| **Batch** | Excel import → batch print | Multiple vehicles, high volume |

### Changes for Batch Mode

- Add **mode switcher UI** (tabs or toggle) to switch between Simple and Batch
- Implement **Excel template download** functionality with predefined column headers matching the form fields
- Implement **Excel file upload** and parsing logic using `xlsx` library
- Add **batch print queue** management with progress tracking
- Support **preview before printing** to verify uploaded data
- Handle **error reporting** for invalid rows in the Excel file

### No Changes to Simple Mode

- **Simple mode remains unchanged** - all current functionality preserved
- Form validation, preview, and single-print workflow work exactly as before
- Users who don't need batch printing won't notice any difference

## Capabilities

### New Capabilities

- `batch-print`: Ability to print multiple weighing reports from an Excel file in one operation
- `excel-template-download`: Provides a downloadable Excel template with correct column headers
- `excel-parse`: Parses uploaded Excel files and validates data against the weighing schema
- `batch-print-queue`: Manages a queue of print jobs with progress indication and error handling

### Modified Capabilities

- `print-workflow`: Extended to support batch operations while maintaining single-print functionality

## Impact

- **Files added**:
  - `src/components/batch-print/BatchPrintPanel.tsx` - Main batch print UI
  - `src/components/batch-print/ExcelUploader.tsx` - File upload component
  - `src/components/batch-print/BatchPreview.tsx` - Preview table for uploaded data
  - `src/components/batch-print/BatchProgress.tsx` - Progress indicator
  - `src/hooks/useExcelParser.ts` - Excel parsing hook
  - `src/hooks/useBatchPrint.ts` - Batch print logic hook
  - `src/utils/excel.ts` - Excel read/write utilities
  - `src/templates/batch-template.xlsx` - Template file (or generated dynamically)

- **Files modified**:
  - `src/App.tsx` - Add batch print section/tab
  - `src/types.ts` - Add batch print types
  - `package.json` - Add `xlsx` dependency

- **Dependencies added**: `xlsx` (SheetJS) for Excel file handling
