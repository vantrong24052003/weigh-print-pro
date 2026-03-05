# Dự án: Phiếu Cân Xe (Weighing Report App)

## 1. Yêu cầu chức năng
- **Quản lý thông tin chung**:
  - Nhập biển số xe (VD: 43C-123.45).
  - Nhập Ngày và Giờ riêng biệt:
    - Sử dụng HTML5 native input (`type="date"` và `type="time"`).
    - Tự động điền thời gian hiện tại khi khởi tạo.
- **Quản lý trọng lượng theo trục**:
  - Nhập "Số lần đo" (số trục).
  - Có nút **"THÊM"** (ADD) để xác nhận số trục trước khi hiển thị các ô nhập liệu cân nặng.
  - Mỗi trục gồm 2 ô nhập: **Trái (L)** và **Phải (R)**.
  - Tính tổng **Gross Weight** thời gian thực (Tổng L + R của tất cả các trục).
- **Validation (Dữ liệu đầu vào)**:
  - Sử dụng thư viện **Yup**.
  - Biển số xe không được để trống.
  - Trọng lượng từng trục phải là số, không được âm.
  - Phải có ít nhất 1 trục.
  - Hiển thị thông báo lỗi cụ thể dưới từng ô nhập liệu.

## 2. Yêu cầu In ấn
- **Máy in**: AIMO thermal printer.
- **Khổ giấy**: 75mm.
- **Font chữ**: Monospace (để đảm bảo thẳng hàng).
- **Mẫu in**: Chứa đầy đủ thông tin Biển số, Ngày, Giờ, Trọng lượng từng bên của từng trục và Tổng Gross.

## 3. Yêu cầu kỹ thuật & Thẩm mỹ
- **Công nghệ**: React, Vite, Tailwind CSS, Yup.
- **Thẩm mỹ**: Minimalist, hiện đại, sử dụng tông màu Slate/Slate-900 chuyên nghiệp. **Không dùng Shadcn UI**.
- **Refactor**: Chia nhỏ component (`AxleRow`, `PrintTemplate`), tách Schema và Types ra tệp riêng.

## 4. Cấu trúc thư mục mong muốn
- `src/components/`: AxleRow.tsx, PrintTemplate.tsx
- `src/schemas/`: weighingSchema.ts
- `src/utils/`: date.ts
- `src/types.ts`: Các interface chung.
- `src/App.tsx`: Component chính sạch sẽ.
