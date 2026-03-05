## Context

Hiện tại ứng dụng đang sử dụng `window.print()` của trình duyệt, dẫn đến việc phải qua bước Print Preview gây chậm trễ. Khách hàng sử dụng máy in nhiệt AIMO (thường hỗ trợ lệnh ESC/POS) kết nối qua USB. Web Serial API cho phép trình duyệt giao tiếp trực tiếp với các thiết bị Serial này.

## Goals / Non-Goals

**Goals:**
- Tích hợp Web Serial API để kết nối trực tiếp với máy in.
- Mã hóa dữ liệu phiếu cân thành các lệnh ESC/POS theo chuẩn AIMO.
- Hỗ trợ in "im lặng" (Silent Print) bypass trình duyệt.
- Tự động kết nối lại máy in khi đã được cấp quyền trước đó.

**Non-Goals:**
- Không hỗ trợ in qua mạng LAN/Wifi (chỉ tập trung vào Serial/USB).
- Không hỗ trợ in hình ảnh (chỉ tập trung vào văn bản và định dạng cơ bản).

## Decisions

### 1. Quản lý trạng thái bằng Custom Hook `useSerialPrinter`
- **Lý do**: Tách biệt logic kết nối Serial phức tạp ra khỏi giao diện `App.tsx`. Hook này sẽ quản lý `port`, `writer`, và trạng thái `isConnected`.
- **Alternatives**: Quản lý trực tiếp trong `App.tsx` (dễ làm rối code) hoặc dùng Redux/Zustand (quá phức tạp cho quy mô hiện tại).

### 2. Sử dụng Web Serial API trực tiếp (Bare Metal)
- **Lý do**: Tránh phụ thuộc vào thư viện bên ngoài, giúp em bé tập coding hiểu sâu về cách byte dữ liệu được gửi đi.
- **Alternatives**: Dùng thư viện `esc-pos-encoder` (nhanh nhưng "đen ngòm" bên trong, khó học).

### 3. Xử lý Tiếng Việt (Unaccented)
- **Lý do**: Máy in nhiệt ESC/POS thường đòi hỏi Code Page phức tạp để in dấu Tiếng Việt. Để đảm bảo ổn định ban đầu, chúng mình sẽ ưu tiên in không dấu (ví dụ: "BIEN SO" thay vì "BIỂN SỐ").
- **Alternatives**: Cấu hình Code Page 1258 (phức tạp, tùy thuộc vào firmware của máy in).

## Risks / Trade-offs

- **[Risk] Trình duyệt không hỗ trợ** → [Mitigation] Kiểm tra `navigator.serial` và fallback về `window.print()` nếu không có.
- **[Risk] Máy in bị ngắt đột ngột** → [Mitigation] Lắng nghe sự kiện `disconnect` để cập nhật UI và thông báo cho người dùng.
- **[Risk] Lệnh ESC/POS sai định dạng** → [Mitigation] Thử nghiệm với các lệnh cơ bản nhất (Text, Bold, Centered) trước khi thêm các lệnh nâng cao.
