## ADDED Requirements

### Requirement: Receipt must use full 32-char line width with no software margin
The ESC/POS receipt formatting engine SHALL use all 32 characters of the print line width on a 58mm thermal printer. No additional space characters SHALL be prepended or appended as left/right margin on content lines.

#### Scenario: Info line starts at column 0
- **WHEN** the system formats an info line (e.g., `NO. : 0011`)
- **THEN** the text shall begin at the first character position with no leading space

#### Scenario: Value lines are not truncated
- **WHEN** a formatted line is exactly 32 characters or fewer
- **THEN** the full line shall be sent to the printer without truncation or padding

---

### Requirement: Header line must use hardware center alignment
The system SHALL send the ESC/POS center-align command (`ESC a 1`) before printing the `WEIGHING  REPORT` header, then restore left-align (`ESC a 0`) immediately after.

#### Scenario: Header is centered on receipt
- **WHEN** `encodeWeighingReport()` is called
- **THEN** the byte stream SHALL contain the sequence: `[ESC, 0x61, 0x01]` → header text bytes → `[ESC, 0x61, 0x00]`

---

### Requirement: Separator must dynamically fill the full line width
The receipt SHALL print a separator of `-` characters equal to `LINE_WIDTH` (32 chars for 58mm paper). The separator length SHALL be derived from the `LINE_WIDTH` constant, not hardcoded.

#### Scenario: Separator fills full line width
- **WHEN** `separator()` is called
- **THEN** the resulting line SHALL contain exactly `LINE_WIDTH` dash characters (e.g. 32 dashes for 58mm)

#### Scenario: Separator adapts when LINE_WIDTH changes
- **WHEN** `LINE_WIDTH` constant is updated
- **THEN** all separator lines SHALL automatically reflect the new width without code changes

---

### Requirement: Axle data must use consistent two-column layout
Each axle block SHALL print `LW:`, `RW:`, and `Axle##:` on separate lines. The label SHALL be left-aligned and the weight value SHALL follow with consistent spacing.

#### Scenario: LW and RW lines are consistently indented
- **WHEN** an axle block is printed
- **THEN** `LW:` and `RW:` labels SHALL be followed by consistent spacing before the numeric value in kg (e.g., `LW:  4675kg`)

#### Scenario: Axle total line uses zero-padded index
- **WHEN** the axle index is 1
- **THEN** the label SHALL be `Axle01:` (zero-padded to 2 digits)

#### Scenario: Multiple axles are separated by blank line
- **WHEN** there are 2 or more axles
- **THEN** each axle block SHALL be followed by exactly one blank line (LF) before the next axle block

---

### Requirement: Gross weight section must be wrapped in separators
The `Gross:` total weight line SHALL be preceded and followed by a separator line.

#### Scenario: Gross section layout
- **WHEN** `encodeWeighingReport()` generates the footer
- **THEN** the byte sequence SHALL be: separator → `Gross: <weight>kg` → separator

---

### Requirement: `encodeWeighingReport()` public API must remain unchanged
The exported function `encodeWeighingReport(data, no)` SHALL continue to accept the same parameter types and return a `Uint8Array`.

#### Scenario: Function signature compatibility
- **WHEN** existing callers invoke `encodeWeighingReport({ licensePlate, date, time, axles, grossWeight }, no)`
- **THEN** the function SHALL compile without type errors and return valid ESC/POS bytes

---

### Requirement: Vietnamese diacritics must be stripped from all text
All text passed to the printer SHALL have Vietnamese diacritical marks removed (NFD normalize + strip combining characters + `đ→d`, `Đ→D`) to ensure ASCII-safe bytes for the printer firmware.

#### Scenario: Diacritics are removed
- **WHEN** a field value contains Vietnamese characters (e.g., `Hà Nội`)
- **THEN** the encoded output SHALL contain only ASCII-equivalent characters (`Ha Noi`)
