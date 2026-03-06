# Quy trình S1: Xây dựng Giao diện (UI) và Kiểm duyệt dữ liệu (Yup Validation)

Trong bước này, hệ thống sẽ tập trung vào việc tạo Form nhập liệu cho Trạm cân và chặn các lỗi nhập liệu ngay ngoài giao diện (Frontend) trước khi chuyển dữ liệu cho Máy In.

## 1. Yêu cầu Thư viện (Dependencies)
- Thư viện: `yup` (Xác thực schema mạnh mẽ cho Typescript/Javascript)

## 2. Cấu trúc Giao diện (UI)
- Màn hình chính (`src/App.tsx`): Giao diện 1 cột (Mobile First) hiển thị 2 luồng nhập:
  - Thông tin chung: Biển số xe, Ngày cân, Giờ cân, Số lượng trục (Trọng tâm cấu trúc mảng lặp).
  - Khối tĩnh (Dữ liệu từng trục): 1 Component nhỏ (`AxleRow.tsx`) chia 2 trường `Trái L` và `Phải R` để linh hoạt mở rộng.
- Nút tính toán: `Tổng Gross` gộp toán học dữ liệu dạng thời gian thực (Real-time `useMemo`).

## 3. Lược đồ Kiểm duyệt dữ liệu (Yup Schema)
File cài đặt: `src/schemas/weighingSchema.ts` (ví dụ)
Mọi luồng Action (như click "Xem Trước" hoặc "In Phiếu") đều chạy qua lớp bảo vệ `weighingSchema.validate()`:

```typescript
// Ví dụ Schema
export const weighingSchema = yup.object().shape({
  licensePlate: yup.string().required('Biển số xe không được để trống'),
  tempAxleCount: yup.number().min(1, 'Số lượng trục phải lớn hơn 0'),
  axles: yup.array().of(
    yup.object().shape({
      left: yup.string().required('Cân trái trống'),
      right: yup.string().required('Cân phải trống')
    })
  ).min(1)
});
```

Nguyên tắc bắt lỗi (Error Handling):
- Thấy lỗi thì Map `.inner` các field lỗi rồi Render đỏ lên UI ngay lập tức.
- Giữ logic validate phân mảnh để File UI `App.tsx` không bị cồng kềnh.

## 4. Bàn giao dữ liệu cho Quy trình Khác
Sau khi toàn bộ Form đã Validate thành công (không throw lỗi nào), toàn bộ khối dữ liệu `form` sẽ được truyền thẳng xuống Component hiển thị (`PrintPreview.tsx`) hoặc hook kết nối máy in để in ra giấy.
