## ADDED Requirements

### Requirement: Mã hóa dữ liệu sang ESC/POS chuẩn AIMO
Hệ thống SHALL có khả năng chuyển đổi dữ liệu phiếu cân thành mảng các byte (Uint8Array) tuân theo chuẩn lệnh ESC/POS.

#### Scenario: Mã hóa thông tin chung
- **WHEN** Cần tạo dữ liệu in
- **THEN** Hệ thống SHALL tạo các lệnh ESC/POS để: Căn giữa tiêu đề, In đậm, Định dạng font chữ Monospace, và chèn các đường kẻ phân cách.

### Requirement: Mã hóa dữ liệu trục xe
Hệ thống SHALL lặp qua danh sách các trục và tạo các dòng dữ liệu với căn chuẩn lề trái/phải cho LV, RV và AxleTotal.

#### Scenario: Hiển thị thông số trục
- **WHEN** Mã hóa một trục xe
- **THEN** Dữ liệu SHALL bao gồm các nhãn "LV:", "RV:" và "AxleXX:" với giá trị khối lượng tương ứng, căn chỉnh thẳng hàng theo cột.

### Requirement: Lệnh cắt giấy và reset
Hệ thống SHALL thêm lệnh Reset máy in ở đầu và lệnh Cắt giấy (nếu hỗ trợ) hoặc đẩy giấy ở cuối mỗi bản in.

#### Scenario: Kết thúc bản in
- **WHEN** Tạo byte cuối cùng của phiếu cân
- **THEN** Hệ thống SHALL thêm mã lệnh GS V 66 0 (cắt giấy) hoặc các ký tự xuống dòng liên tiếp.
