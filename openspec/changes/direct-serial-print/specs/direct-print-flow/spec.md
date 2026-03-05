## ADDED Requirements

### Requirement: Luồng in trực tiếp không hội thoại
Hệ thống SHALL gửi dữ liệu ESC/POS đã mã hóa trực tiếp xuống cổng Serial khi người dùng nhấn nút "IN PHIẾU", bỏ qua hoàn toàn hộp thoại in của trình duyệt.

#### Scenario: In thành công
- **WHEN** Người dùng nhấn nút "IN PHIẾU", form hợp lệ và máy in đã kết nối
- **THEN** Luồng dữ liệu SHALL được ghi vào Serial Writable Stream và máy in thực hiện in ngay lập tức.

### Requirement: Xử lý lỗi khi in
Hệ thống SHALL thông báo lỗi nếu máy in chưa được kết nối hoặc cổng Serial bị ngắt giữa chừng.

#### Scenario: In khi chưa kết nối
- **WHEN** Người dùng nhấn nút "IN PHIẾU" nhưng chưa kết nối máy in
- **THEN** Hệ thống SHALL hiển thị thông báo "Vui lòng kết nối máy in trước khi in" và không thực hiện lệnh in.
