## Why

Việc in qua trình duyệt (Print Preview) gây chậm trễ và yều cầu người dùng phải xác nhận thủ công, làm gián đoạn quy trình làm việc tại trạm cân. Sử dụng Web Serial API để gửi lệnh ESC/POS trực tiếp tới máy in nhiệt giúp in "tức thì", không hiển thị hội thoại và cho phép kiểm soát định dạng bản in chính xác hơn.

## What Changes

- **Hệ thống kết nối máy in**: Thêm tính năng chọn và quản lý kết nối cổng Serial (USB/COM) cho máy in.
- **Bộ mã hóa ESC/POS**: Xây dựng logic chuyển đổi dữ liệu phiếu cân thành các lệnh byte chuẩn ESC/POS.
- **Tính năng In trực tiếp**: Thay thế (hoặc bổ sung) nút "In" để gửi dữ liệu trực tiếp xuống máy in thay vì gọi `window.print()`.
- **Giao diện quản lý kết nối**: Thêm nút để người dùng "Kết nối máy in" lần đầu.

## Capabilities

### New Capabilities
- `serial-connection`: Quản lý việc yêu cầu quyền truy cập cổng Serial, mở cổng, và duy trì trạng thái kết nối.
- `esc-pos-encoding`: Chuyển đổi dữ liệu (Biển số, Trục, Gross) thành luồng dữ liệu ESC/POS (căn lề, in đậm, kẻ đường gạch, cắt giấy).
- `direct-print-flow`: Tích hợp logic in trực tiếp vào quy trình xử lý của form, thay thế luồng in cũ.

### Modified Capabilities
- `print-template`: Yêu cầu in ấn thay đổi từ việc render HTML/CSS sang việc chuẩn bị dữ liệu thô cho máy in nhiệt.

## Impact

- `App.tsx`: Thay đổi logic `handlePrint` và thêm quản lý state cho Serial Port.
- `src/utils/escpos.ts`: (Mới) Chứa các lệnh và hàm hỗ trợ mã hóa ESC/POS.
- Browser Support: Yêu cầu sử dụng Chrome, Edge hoặc các trình duyệt hỗ trợ Web Serial API.
