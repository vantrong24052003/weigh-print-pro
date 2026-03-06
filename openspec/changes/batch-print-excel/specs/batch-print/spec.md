## ADDED Requirements

### Requirement: Application must support two operation modes

The application SHALL support two modes accessible via tab navigation: **Simple** (manual input) and **Batch** (Excel import).

#### Scenario: User switches to Simple mode
- **WHEN** the user clicks the "Nhập liệu" tab
- **THEN** the system SHALL display the current manual input form without any changes

#### Scenario: User switches to Batch mode
- **WHEN** the user clicks the "In hàng loạt" tab
- **THEN** the system SHALL display the batch print interface with template download and file upload options

#### Scenario: Simple mode remains unchanged
- **WHEN** the user is in Simple mode
- **THEN** all existing functionality (form input, validation, preview, single print) SHALL work exactly as before

---

### Requirement: System must provide downloadable Excel template

The system SHALL provide a downloadable Excel template file with predefined column headers matching the weighing report data structure.

#### Scenario: User downloads template
- **WHEN** the user clicks the "Tải template Excel" button
- **THEN** the system SHALL generate and download an Excel file with the following headers:
  - `Số phiếu`, `Nhân viên`, `Biển số xe`, `Ngày`, `Giờ`, `Số trục`
  - `Trục 1 Trái`, `Trục 1 Phải` through `Trục 10 Trái`, `Trục 10 Phải`

#### Scenario: Template includes example row
- **WHEN** the template is downloaded
- **THEN** the second row SHALL contain example values to guide the user

---

### Requirement: System must parse uploaded Excel files

The system SHALL accept Excel files (.xlsx, .xls) uploaded by the user and parse each row into weighing report data.

#### Scenario: User uploads valid Excel file
- **WHEN** the user uploads an Excel file with valid data
- **THEN** the system SHALL parse all rows and display them in a preview table

#### Scenario: User uploads file with some invalid rows
- **WHEN** the user uploads an Excel file where some rows have validation errors
- **THEN** the system SHALL parse all rows, mark invalid rows with errors, and allow printing only valid rows

#### Scenario: User uploads invalid file format
- **WHEN** the user uploads a non-Excel file (e.g., .csv, .pdf)
- **THEN** the system SHALL display an error message "Vui lòng tải file Excel (.xlsx hoặc .xls)"

#### Scenario: User uploads empty file
- **WHEN** the user uploads an Excel file with no data rows (only headers)
- **THEN** the system SHALL display an error message "File không có dữ liệu"

---

### Requirement: Each row must be validated against weighing schema

The system SHALL validate each parsed row using the same validation rules as the single-print form.

#### Scenario: Row with missing required field
- **WHEN** a row is missing a required field (no, licensePlate)
- **THEN** the row SHALL be marked as invalid with error message indicating the missing field

#### Scenario: Row with invalid axle count
- **WHEN** a row has `Số trục` value greater than 10 or less than 1
- **THEN** the row SHALL be marked as invalid with error "Số trục phải từ 1 đến 10"

#### Scenario: Row with non-numeric axle weight
- **WHEN** a row has text instead of number in an axle column
- **THEN** the row SHALL be marked as invalid with error "Giá trị trục phải là số"

---

### Requirement: Preview table must show all parsed rows

The system SHALL display a preview table showing all parsed rows with their validation status.

#### Scenario: Valid row display
- **WHEN** a row passes validation
- **THEN** the preview table SHALL show the row with a green checkmark icon and calculated gross weight

#### Scenario: Invalid row display
- **WHEN** a row fails validation
- **THEN** the preview table SHALL show the row with a red error icon and list all validation errors

#### Scenario: Row count summary
- **WHEN** the preview is displayed
- **THEN** the system SHALL show a summary: "X row(s) total: Y valid, Z errors"

---

### Requirement: Batch print must process records sequentially

The system SHALL print all valid records one at a time in order, with progress indication.

#### Scenario: Start batch print
- **WHEN** the user clicks "In X phiếu" button
- **THEN** the system SHALL begin printing the first valid record and show progress "1/X"

#### Scenario: Progress during batch print
- **WHEN** a record finishes printing
- **THEN** the system SHALL increment the progress counter and print the next record

#### Scenario: Batch print complete
- **WHEN** all valid records have been printed
- **THEN** the system SHALL display "Hoàn thành! Đã in X phiếu" and reset to idle state

#### Scenario: Print error during batch
- **WHEN** a print error occurs (e.g., QZ Tray disconnected)
- **THEN** the system SHALL pause the batch, display the error, and allow user to retry or cancel

---

### Requirement: QZ Tray must be connected before batch print

The system SHALL require an active QZ Tray connection before starting batch print.

#### Scenario: Batch print without QZ Tray
- **WHEN** the user clicks "In X phiếu" but QZ Tray is not connected
- **THEN** the system SHALL display an alert "Vui lòng kết nối QZ Tray trước khi in"

---

### Requirement: Date and time formats must be flexible

The system SHALL accept multiple date and time formats in the Excel file.

#### Scenario: Date format variations
- **WHEN** a date value is provided
- **THEN** the system SHALL accept: `DD-MM-YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD`

#### Scenario: Time format variations
- **WHEN** a time value is provided
- **THEN** the system SHALL accept: `HH:mm:ss`, `HH:mm`

---

### Requirement: Maximum batch size must be enforced

The system SHALL limit the number of records per batch to prevent performance issues.

#### Scenario: Batch exceeds limit
- **WHEN** the uploaded Excel contains more than 100 data rows
- **THEN** the system SHALL display an error "Tối đa 100 dòng mỗi lần in. File có X dòng."

---

### Requirement: Axle columns must be optional beyond declared axle count

The system SHALL only validate axle columns up to the `Số trục` value for each row.

#### Scenario: Partial axle data
- **WHEN** a row has `Số trục` = 3 and axle columns 1-3 have values but columns 4-10 are empty
- **THEN** the row SHALL be considered valid (empty columns 4-10 are ignored)

#### Scenario: Axle count mismatch
- **WHEN** a row has `Số trục` = 3 but axle 1, 2, or 3 is empty
- **THEN** the row SHALL be marked as invalid with error "Thiếu dữ liệu trục X"
