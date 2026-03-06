## Why
Phương thức in ấn Web Serial API cũ gặp nhiều rào cản do phụ thuộc vào trình duyệt giữ quyền độc chiếm USB. Hệ thống cần chuyển đổi sang một giao thức in hiện đại qua WebSocket là QZ Tray. Đồng thời, kết nối này trên hệ điều hành Linux cũng dính các lỗi bảo mật cấp hệ thống (AppArmor, CUPS proxy delay) cần được giải quyết triệt để.

## What Changes
- Lắp đặt Hook `useQzPrinter.ts` lắng nghe kết nối Websocket tới phần mềm Trạm.
- Mở khoá và bỏ qua cơ chế xác thực rườm rà (setCertificatePromise bypass).
- Viết lại dữ liệu từ chuẩn Base64 sang Raw Hex ASCII cho tốc độ phản hồi milisecond.
- Ghi chú tài liệu tắt lá chắn AppArmor Linux, cấu trúc lại `Direct USB Path` thông qua CUPS Driver `lpadmin`.

## Capabilities

### New Capabilities
- `qz-tray-linux-fix`: Hệ thống giao tiếp in ấn mượt mà trực tiếp (Raw Bytes) với máy in nhiệt qua WebSocket QZ Tray, loại bỏ mọi giới hạn hệ điều hành máy trạm cục bộ.

### Modified Capabilities

## Impact
- Loại bỏ hoàn toàn công nghệ in ấn Web Serial cũ kỹ thiếu ổn định.
- Cho phép in siêu tốc không cần mở hộp thoại Print của trình duyệt.
