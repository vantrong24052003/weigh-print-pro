## 1. Tiện ích và Mã hóa ESC/POS

- [x] 1.1 Tạo tệp `src/utils/escpos.ts` định nghĩa các lệnh và hàm hỗ trợ mã hóa ESC/POS (Text, Bold, Centered, Table, Line, Cut).
- [x] 1.2 Viết hàm `encodeWeighingReport` để chuyển đổi dữ liệu Form thành mảng byte ESC/POS.

## 2. Quản lý kết nối Serial

- [x] 2.1 Tạo Custom Hook `src/hooks/useSerialPrinter.ts` quản lý trạng thái cổng Serial (port, writer, isConnected).
- [x] 2.2 Cập nhật tệp `src/types.ts` nếu cần thiết để hỗ trợ kiểu dữ liệu Serial.
- [x] 2.3 Thêm logic tự động kết nối lại (Reconnect) trong Hook.

## 3. Tích hợp Giao diện và Xử lý In

- [x] 3.1 Cập nhật `App.tsx`: Thêm nút "Kết nối máy in" và hiển thị trạng thái kết nối.
- [x] 3.2 Cập nhật logic `handlePrint` trong `App.tsx`: Ưu tiên in qua Serial nếu đã kết nối, ngược lại fallback về `window.print()`.
- [x] 3.3 Đảm bảo thông báo lỗi rõ ràng khi kết nối Serial thất bại hoặc bị ngắt.

## 4. Kiểm thử và Hoàn thiện

- [ ] 4.1 Chạy `npm run build` để kiểm tra lỗi TypeScript/Build.
- [ ] 4.2 Kiểm tra logic mã hóa byte bằng cách in ra console (giả lập) trước khi in thật.
