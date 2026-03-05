## ADDED Requirements

### Requirement: Kết nối cổng Serial với máy in
Hệ thống SHALL cho phép người dùng yêu cầu quyền và mở kết nối với cổng Serial (thường là USB-to-Serial) của máy in nhiệt.

#### Scenario: Người dùng nhấn nút kết nối
- **WHEN** Người dùng nhấn nút "Kết nối máy in"
- **THEN** Trình duyệt SHALL hiển thị hộp thoại chọn cổng Serial và ghi nhớ trạng thái kết nối.

### Requirement: Tự động kết nối lại
Hệ thống SHALL cố gắng tự động kết nối lại với máy in đã được chọn trước đó khi ứng dụng khởi chạy (nếu trình duyệt hỗ trợ ghi nhớ quyền).

#### Scenario: Khởi chạy ứng dụng
- **WHEN** Ứng dụng React được mount
- **THEN** Hệ thống SHALL kiểm tra danh sách các cổng đã được cấp quyền và mở lại kết nối nếu có.
