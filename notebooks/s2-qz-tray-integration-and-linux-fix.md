# Quy trình S2: Tích hợp Hệ thống In (QZ Tray) & Vượt Lỗi Bảo mật Máy in Nền Linux

Sau khi khối lượng dữ liệu (Form Data) đã được gạn lọc sạch sẽ từ UI (Quy trình `s1-`), ứng dụng cần 1 lớp giao thức để chọc sâu xuống kết nối vật lý. Việc phụ thuộc vào Native Web API (Web Serial) hay trình biên dịch Windows In ảnh hưởng nghiêm trọng rủi ro nền tảng.

## 1. Yêu cầu Thư viện (Dependencies)
- Thư viện Client Websocket: `qz-tray` (Lắng nghe tại Socket `localhost:8181/8182` tại PC trạm cân).
- Mã hóa Types: `@types/qz-tray` 
- Định dạng in ngầm định: Gói Base64 HEX dựa trên chuẩn POS/ESC ASCII.

## 2. Thiết kế Lõi Đẩy dữ liệu (`useQzPrinter.ts`)
Hooks quản lý trạng thái in:
- Cơ chế Auto Connect / Disconnect trên Vòng đời `useEffect`.
- Cấu hình Chứng chỉ Rỗng: QZ Tray Free bị chặn "Untrusted", cần bypass bằng các cờ Promise như sau trước `await qz.websocket.connect`:
```typescript
qz.security.setCertificatePromise((resolve: any) => resolve(""));
qz.security.setSignatureAlgorithm("SHA512");
qz.security.setSignaturePromise((_hash: string) => { return function(resolve: any) { resolve("") }});
```
- Lớp dữ liệu in đẩy xuống `Hex String`, tạo Raw Format.
- Truy vấn thiết bị: Tìm cứng tên Label (vd: "AIMO_Receipt_Printer"). Mặc định bỏ qua bước chọn Máy in UI dư thừa.

## 3. Khắc phục Cấu trúc CUPS trên HĐH Debian/Ubuntu Linux
Chỉ dành cho Trạm gốc máy chủ Cân hoạt động thông qua Hệ điều hành Open Source, gặp sự cố bị nghẽn (Hanging Job - Queue).

**Bước 1. Tắt Trình Quản Lý AppArmor Cho Dịch Vụ Cục Bộ (`cupsd`)**
Trên Linux, AppArmor chặn kết nối `net_admin` của Cổng cáp in Raw:
```bash
sudo systemctl stop apparmor
sudo systemctl disable apparmor
sudo systemctl restart cups
```

**Bước 2. Giao phó Hardware Driver Không Đệm**
1. Tìm đường dẫn thực tế cổng USB máy in cắm vào máy thông qua: `lpinfo -v`
   (Sẽ thấy 1 dòng ghi: `direct usb://STMicroelectronics/POS80%20Printer...`)
2. Ràng cứng máy in tên AIMO (Tức đối tượng Hook Javascript đang tìm kiếm) với đường link nguyên thuỷ kia:
   `sudo lpadmin -p AIMO_Receipt_Printer -v "usb://STMicroelectronics/POS80...?" -E`
3. Quét dọn bộ đệm hỏng tồn do lỗi in Web Serial chèn:
   `cancel -a` 

Lớp in ESC/POS lập tức trở nên minh bạch và mượt mà. Đẩy là In!
