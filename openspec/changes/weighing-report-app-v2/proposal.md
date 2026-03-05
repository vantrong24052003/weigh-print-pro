## Why

Người dùng lỡ tay xóa mất mã nguồn và các file quan trọng trong dự án Phiếu Cân Xe. Cần khôi phục lại toàn bộ tính năng dựa trên OpenSpec để đảm bảo sự ổn định, cấu trúc code sạch (Refactored) và loại bỏ hoàn toàn Shadcn UI theo yêu cầu mới nhất.

## What Changes

- Khôi phục tính năng nhập Biển số xe, Ngày, Giờ.
- Khôi phục tính năng nhập trọng lượng trục với nút "THÊM" (ADD) số lượng trục.
- Tái cấu trúc mã nguồn (Refactor): Tách nhỏ component, schema và types.
- Tích hợp Yup validation cho toàn bộ form.
- Đảm bảo Print Template chuẩn xác cho máy in AIMO khổ 75mm dùng font Monospace.
- Loại bỏ hoàn toàn dấu vết của Shadcn UI.

## Capabilities

### New Capabilities
- `weighing-form`: Giao diện nhập liệu cân xe với validation Yup.
- `print-template`: Mẫu in phiếu cân chuẩn máy in nhiệt AIMO.
- `weight-calculation`: Logic tính toán tổng khối lượng Gross thời gian thực.

### Modified Capabilities
- (None)
