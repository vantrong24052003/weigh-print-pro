# qz-tray-linux-fix Specification

## Purpose
TBD - created by archiving change s2-qz-tray-and-linux-fix. Update Purpose after archive.
## Requirements
### Requirement: The system MUST use QZ Tray for raw command printing.
The system MUST use QZ Tray for raw command printing, bypassing generic browser dialogs.

#### Scenario: Send ESC/POS Over WebSocket
Người dùng bấm "In Nhanh QZ Tray" khi có kết nối WebSocket Active.
Khi (When) Hàm in biến đổi buffer ra định dạng Hex (`format: 'hex'`).
Thì (Then) QZ Tray tiếp nhận qua Socket và đẩy lệnh in thẳng xuống máy in mà không vướng mảng dữ liệu dư thừa.

### Requirement: The system MUST bypass SSL warnings for Localhost QZ Free version.
The system MUST bypass SSL warnings for Localhost QZ Free version automatically via Promise overrides.

#### Scenario: Gắn cờ bỏ qua Certificate
Hook `useQzPrinter` gọi `connect()`.
Khi (When) hàm trả về Warning do thiếu Web Certificate ở Localhost.
Thì (Then) Trình chặn bảo vệ `qz.security` trong đoạn code lập tức nhả resolve rỗng thay vì bật cờ chặn. Không hiển thị cảnh báo.

### Requirement: The platform MUST document AppArmor blocking resolutions on Linux.
The platform MUST document AppArmor blocking resolutions on Linux in the notebooks.

#### Scenario: Cứu Nguy Linux AppArmor Queue
Nhân viên trạm kiểm tra máy in nhiệt.
Khi (When) tiến trình in bị nghẽn (Hangs) vì lỗi AppArmor `net_admin` của `cupsd`.
Thì (Then) làm theo quy trình đã lập tài liệu `s2-qz-tray-integration-and-linux-fix.md` là tắt `apparmor`, dọn rác đệm (`cancel -a`), ép đường dẫn `lpinfo -v` siêu tốc. Hệ thống sẽ nhấp nháy in rào rào.

