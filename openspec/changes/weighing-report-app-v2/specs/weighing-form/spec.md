## ADDED Requirements

### Requirement: Form nhập liệu cân xe
Giao diện người dùng để nhập các thông tin cần thiết cho phiếu cân.

#### Scenario: Nhập thông tin xe và thời gian
- **WHEN** Người dùng mở ứng dụng
- **THEN** Biển số xe trống, Ngày và Giờ được điền mặc định là thời gian hiện tại.

#### Scenario: Nhập số lượng trục
- **WHEN** Người dùng nhập số lượng trục và nhấn nút "THÊM"
- **THEN** Một danh sách các ô nhập Trái (L) và Phải (R) cho từng trục sẽ hiện ra.

### Requirement: Validation dữ liệu bằng Yup
Đảm bảo dữ liệu nhập vào là chính xác và hợp lệ.

#### Scenario: Kiểm tra biển số xe
- **WHEN** Người dùng để trống biển số xe và nhấn "IN PHIẾU"
- **THEN** Thông báo "Biển số xe không được để trống" sẽ hiển thị.

#### Scenario: Kiểm tra giá trị trục
- **WHEN** Người dùng nhập giá trị không phải số hoặc số âm vào ô trục
- **THEN** Thông báo lỗi tương ứng ("Phải là số", "Không được âm") sẽ hiển thị dưới ô đó.
