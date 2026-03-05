## ADDED Requirements

### Requirement: Mẫu in phiếu cân chuẩn khổ 75mm
Mẫu in được tối ưu hóa cho máy in nhiệt AIMO.

#### Scenario: Hiển thị thông tin in ấn
- **WHEN** Người dùng nhấn nút "IN PHIẾU" và form hợp lệ
- **THEN** Một khu vực in ẩn (chỉ hiện khi in) sẽ được kích hoạt với font Monospace, khổ rộng 75mm.

#### Scenario: Cấu trúc mẫu in
- **WHEN** Xem trước bản in
- **THEN** Các thông tin Biển số, Ngày, Giờ, kết quả cân từng trục và tổng khối lượng Gross phải được căn lề thẳng hàng.
