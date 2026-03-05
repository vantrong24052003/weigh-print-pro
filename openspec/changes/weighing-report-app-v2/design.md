## Context

Dự án Phiếu Cân Xe bị mất mã nguồn do người dùng lỡ tay xóa. Cần khôi phục lại với cấu trúc hiện đại, sạch sẽ và loại bỏ hoàn toàn Shadcn UI.

## Goals / Non-Goals

**Goals:**
- Tái lập đầy đủ các tính năng nhập liệu, tính toán và in ấn.
- Cấu trúc mã nguồn theo hướng Module hóa (tách component, types, schemas).
- Sử dụng Yup cho Validation dữ liệu.
- Thiết kế UI Minimalist dùng Tailwind thuần.

**Non-Goals:**
- Không sử dụng lại bất kỳ thư viện component UI nào (Shadcn, Headless UI, etc.).
- Không thay đổi hành vi chuẩn của các ô nhập liệu date/time nguyên bản.

## Decisions

### Tách nhỏ Component
- **Quyết định**: Tách `AxleRow` và `PrintTemplate` ra các file riêng trong `src/components/`.
- **Lý do**: Giảm độ phức tạp của `App.tsx`, giúp code dễ bảo trì và mở rộng.
- **Lựa chọn thay thế**: Giữ tất cả trong `App.tsx` (Rối, khó quản lý).

### Quản lý Schema Validation tập trung
- **Quyết định**: Tạo thư mục `src/schemas/` và file `weighingSchema.ts`.
- **Lý do**: Tách biệt logic kiểm tra dữ liệu khỏi phần giao diện, dễ dàng cập nhật luật lệ validation.
- **Lựa chọn thay thế**: Định nghĩa inline trong `App.tsx`.

### Định dạng Date/Time Native
- **Quyết định**: Sử dụng `input type="date"` và `type="time"` trực tiếp.
- **Lý do**: Tương thích tốt nhất với di động, đơn giản, không cần thư viện date picker phức tạp.
- **Lựa chọn thay thế**: Dùng `react-datepicker` (Thêm dependency không cần thiết).

## Risks / Trade-offs

- **[Risk]** Người dùng nhập sai định dạng số → **[Mitigation]** Sử dụng `type="number"` và Yup validation để ép kiểu.
- **[Risk]** In ấn không thẳng hàng trên máy in nhiệt → **[Mitigation]** Sử dụng font `font-mono` và đơn vị đo chuẩn `mm` cho Print Template.
