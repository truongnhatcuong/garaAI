# Tối ưu hiệu ứng cuộn AutoCare

Hiệu ứng dùng 480 ảnh WebP vẽ lên canvas trong trình duyệt. Giữ đủ khung hình, độ nét của nguồn và thời lượng cuộn; giảm tải nền và công việc vẽ. Không có nút chọn chất lượng hoặc bộ ảnh giảm chất lượng cho máy yếu.

## Ảnh

| Bộ ảnh | Trước | Sau |
| --- | --- | --- |
| Desktop | 2560 × 1440, 69,53 MiB | 1280 × 720, 30,48 MiB |
| Mobile | 1280 × 720, 30,48 MiB | 1280 × 720, 30,48 MiB |

Nguồn video là 1280 × 720. Script `npm run video:frames` không phóng lớn hơn nguồn và dùng chất lượng WebP 90. Desktop và mobile dùng chung bộ ảnh đầy đủ; không còn bộ ảnh 960 × 540. Mã phiên bản URL thay đổi khi kích thước hoặc chất lượng ảnh thay đổi.

## Tải và render

- Tải trước tối đa 24 ảnh phía trước và 6 ảnh phía sau vị trí cuộn. Khi có tín hiệu tài nguyên hạn chế, tải trước 12 ảnh phía trước với 2 request đồng thời thay vì 4. Hướng tải đổi theo hướng cuộn.
- Cache ảnh nén tối đa 16 MiB và 12 ảnh đã giải mã; khi có tín hiệu tài nguyên hạn chế dùng 8 MiB và 8 ảnh. Độ phân giải và chất lượng ảnh không đổi.
- Dừng tải mới và hủy request đang chạy khi section ra ngoài vùng tải trước hoặc tab bị ẩn. Ticker không xử lý chuyển động khi section không còn hiển thị.
- Canvas giới hạn khoảng 2.073.600 pixel và DPR 2, có sai số làm tròn kích thước. Giữ Full HD trên màn hình 1920 × 1080 và mật độ 2× trên điện thoại 390 × 844; kích thước không bị hạ khi cuộn.
- Giới hạn vẽ 60 lần/giây để tránh tốn thêm raster trên màn hình 120/144 Hz. Bỏ qua khung hình đã vẽ và giữ zoom cuối đoạn. Chuyển cảnh dùng lớp phủ thay cho bộ lọc màu toàn màn hình.
- Tín hiệu tiết kiệm dữ liệu, mạng 2G, RAM ≤ 4 GiB hoặc ≤ 4 luồng CPU chỉ điều chỉnh tải nền. Các API này có thể không được trình duyệt hỗ trợ.
- Khi đang chuyển động, nếu ít nhất 18 trong 45 khoảng ticker vượt 32 ms, giảm nhịp vẽ xuống khoảng 30 lần/giây. Không đổi ảnh, độ phân giải canvas hay hiệu ứng chuyển cảnh. Khoảng nghỉ và tab ẩn không được tính. Đây là phép đo nhịp animation, không phải đo FPS GPU trực tiếp.
- Nút bỏ qua dùng chữ nhỏ, không có nền dạng viên thuốc. Khi bật giảm chuyển động của hệ điều hành, chỉ tải khung hình đầu tiên.

## Kiểm tra

```sh
node --import tsx --test scripts/scroll-frame-loader.test.ts scripts/scroll-performance.test.ts
npm run check
```

Đã kiểm tra Chromium trên bản production tại localhost: desktop đứng yên tải 25 ảnh, thiết bị báo RAM/CPU thấp tải 13 ảnh; cuộn xuôi/ngược cập nhật khung hình đúng; độ phân giải canvas ổn định trong lúc cuộn; rời section dừng tải; giảm chuyển động chỉ tải frame đầu tiên. Không ghi nhận lỗi JavaScript trên desktop.

Điện thoại 390 × 844 với DPR 3 và tín hiệu RAM/CPU thấp vẫn dùng ảnh 1280 × 720, canvas 780 × 1688. Đã kiểm tra chữ và chỉ dẫn cuộn không chồng lên nhau, không còn nút chọn chất lượng trên desktop/mobile.

Cần kiểm tra thêm trên máy thực tế từng bị lag sau khi deploy Vercel. Số liệu dung lượng là số đo file tại repo, không phải cam kết về tốc độ khung hình trên mọi thiết bị.
