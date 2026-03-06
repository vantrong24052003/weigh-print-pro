# Thiết Kế: Giao diện và Xác Thực

## Kiến trúc Giao diện React
Áp dụng mô hình Component hóa để chia nhỏ UI:
- `/src/App.tsx`: Chứa tổng thể Header, Form Input chung, Modal Preview in.
- `/src/components/weighing-report/AxleRow.tsx`: Component con chịu trách nhiệm nhận Props của Lặp Object "Trái & Phải", render Input tái sử dụng.
- Dùng Hook cục bộ `useState` để lưu thông tin.
- Hook `useMemo` tính tổng `GrossWeight` ngay khi mảng `axles` thay đổi.

## Công Lực Yup Validation
Thư viện YUP sẽ gánh tầng Middleware chặn Submit form:
- Định nghĩa Shape với Rule Required: Biển số xe, Khối lượng đo mỗi bánh.
- Khi người dùng click (Xem Trước hoặc In), Hàm Async sẽ trigger Schema này với mode `{abortEarly: false}`.
- Block Catch sẽ bắt `ValidationError` -> phân rã `err.inner` đẩy lại JSON Lỗi và State để UI Map sang chữ MÀU ĐỎ báo động dưới Input text.

## Quy Tắc Lõi
Làm gọn gàng bộ UI nhất có thể. Đổi File `CSS` thành lớp Utility gốc của TailwindCSS để code nhanh và nhất quán (Mobile-First / Tối Giản).
