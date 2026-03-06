# Thiết kế (Design): QZ Tray & Fix lỗi Linux

## Tầng Liên Kết (Connection Layer)
Hook `useQzPrinter.ts` mới.
- Khởi động mặc định vào port `8181/8182` Websocket.
- Nếu QZ là bản Free, Chrome sẽ ném cảnh báo Cert do SSL hỏng. Code sẽ bypass qua API Security Promise của `qz.security` (Trả về empty string thay vì validate chứng chỉ).
- Setup AutoConnect qua hook `useEffect()`. Tìm rà soát tên máy in mặc định `AIMO`.

## Tầng Xử Lý Chuỗi (Buffer Transfer)
Gói data `Uint8Array` từ file utils (ESC/POS) sẽ được map lại mảng Hex thành dạng chuỗi trước khi đẩy vào websocket.
- Lệnh: `Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('')`. Kế thừa nguyên vẹn chuẩn layout được định nghĩa bằng hàm builder ESC/POS.

## Tầng Hệ Thống Hệ Điều Hành (Linux Resolution)
Với môi trường Ubuntu/Debian:
- Máy in nhiệt bắt nguồn từ kernel thông qua `cupsd` thường xuyên vướng phải AppArmor (Tấm bảo vệ an ninh Kernel) từ chối lệnh `net_admin` gây ra việc nghẽn xếp chồng Queue (hangs).
- Rễ giải pháp này là phải triệt tiêu AppArmor (`systemctl disable apparmor`) và ghim cứng Cổng USB thông qua Direct Hardware ID (`lpinfo -v` link tới `lpadmin -p MáyIn -v "Direct USB..."`). Không cho thuật toán generic Linux đứng trung gian nữa.
