# Ảnh kiểm tra trong Admin

- Cấu hình `UPLOADTHING_TOKEN` từ UploadThing dashboard trong môi trường server. Ảnh được tải lên qua `UTApi.uploadFiles` tại trang chi tiết phiếu sửa chữa.
- Chạy `npx prisma migrate deploy` khi triển khai phiên bản này. Migration thêm `RepairEvidence.imageUploadKey`, hàng đợi `ImageDeletionJob` và hạng mặc định `Bronze` cho khách hàng cũ.
- Mỗi ảnh lưu cả `imageUrl` và `imageUploadKey`. Ảnh seed từ nguồn ngoài không có key nên không bị gửi yêu cầu xoá tới UploadThing.
- Khi thay hoặc xoá ảnh, hay xoá phiếu sửa chữa, key cũ được ghi vào `ImageDeletionJob` cùng transaction với thay đổi DB. Server thử xoá ngay; nếu UploadThing lỗi, job vẫn còn để thử lại khi trang ảnh được mở hoặc có thao tác ảnh tiếp theo.
- Có thể kiểm tra các job đang chờ qua bảng `ImageDeletionJob` (`attempts`, `lastError`).
