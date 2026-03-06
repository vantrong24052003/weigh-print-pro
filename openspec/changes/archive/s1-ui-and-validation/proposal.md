## Why
Trạm cân điện tử cần một giao diện nhập liệu trực quan cho nhân viên trạm. Các lỗi nhập liệu (như để trống biển số, âm số trục) cần phải được chặn ngay trên trình duyệt trước khi đẩy xuống máy in, tránh tiêu tốn cuộn giấy nhiệt và rác bộ nhớ in ấn.

## What Changes
- Xây dựng lưới Form nhập liệu Mobile-First với TailwindCSS.
- Tích hợp Component `AxleRow` quản lý khối lượng từng trục.
- Gắn công cụ `yup` làm lá chắn bảo vệ. Bắt lỗi (validate) thời gian thực.
- Tính tự động hóa trường `Tổng Gross` (Dùng `useMemo`).

## Capabilities

### New Capabilities
- `ui-validation`: Biến Form tĩnh thành Form động có khả năng tự chối bỏ các Input sai lệch chuẩn (YUP Constraints) và báo đỏ Input.

### Modified Capabilities

## Impact
- Tạo móng vững chắc an toàn dữ liệu đầu vào.
- Tăng tính công thái học của thao tác nhân viên trạm cân.
