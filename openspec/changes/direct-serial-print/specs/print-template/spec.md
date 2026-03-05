## MODIFIED Requirements

### Requirement: Mẫu in phiếu cân chuẩn khổ 75mm
Mẫu in được tối ưu hóa cho máy in nhiệt AIMO. Trong chế độ Web Serial, mẫu in này SHALL được chuyển đổi thành mã ESC/POS thay vì render HTML.

#### Scenario: Hiển thị thông tin in ấn
- **WHEN** Người dùng nhấn nút "IN PHIẾU" và form hợp lệ
- **THEN** Hệ thống SHALL kiểm tra chế độ in: nếu có kết nối Serial thì gửi lệnh ESC/POS trực tiếp, nếu không thì fallback về `window.print()` với mẫu HTML hiện tại.

#### Scenario: Cấu trúc mẫu in
- **WHEN** Tạo dữ liệu in (cho dù là ESC/POS hay HTML)
- **THEN** Các thông tin Biển số, Ngày, Giờ, kết quả cân từng trục và tổng khối lượng Gross phải được căn lề thẳng hàng theo đúng thiết kế Monospace.
