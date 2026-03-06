## ADDED Requirements

### Requirement: The system MUST provide a mobile-first UI for data entry.
The system MUST provide a mobile-first UI for data entry.

#### Scenario: Thiết lập Bánh Xe
Người dùng click phím "Thêm" số lượng trục đo.
Ban đầu (Given) Giao diện Trạm chưa khởi tạo hàng (rows).
Khi (When) nhập 3 trục và bấm Submit, Component Lặp `AxleRow`.
Thì (Then) Trình duyệt hiển thị ra 3 Dòng riêng biệt có đủ thuộc tính `Trái R - Phải L`.

### Requirement: The system MUST reject invalid inputs using a YUP schema.
The system MUST reject invalid inputs using a YUP schema.

#### Scenario: Từ chối Xuất nếu để Cân Nhập Trống
Trạm cân bấm nút in.
Khi (When) người trực để trống ô cân `Trái` ở trục số 2, bấm "Xem Trước".
Kích hoạt bộ luật validate YUP trên `App.tsx` trả về `abortEarly: false`.
Thì (Then) UI Map mảng lỗi và render bằng React thành chữ nhỏ màu đỏ "Số lượng trống" ngay bên dưới thẻ `<input>`. Không hiện Hộp Thoại Xem Trước in!
