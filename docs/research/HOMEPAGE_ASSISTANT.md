# Chatbot trên Homepage

## Rà soát cấu trúc và luồng hiện có

- `src/app`: Next.js 16 App Router, phân nhóm customer/admin/auth và workspace employee. Homepage là `src/app/(customer)/page.tsx`, nội dung trong `HomePage.tsx`; layout customer dùng `CustomerShell` và `CustomerFooter`.
- `src/components`: giao diện customer, employee, admin, shared và UI. Chatbot trước đây nằm trong `AiAssistantPage.tsx`, chỉ lưu hội thoại bằng React state.
- `src/app/api`: route handlers cho auth, catalog, hồ sơ khách hàng, nghiệp vụ quản trị, nhân viên và chatbot. `src/server/services` chứa nghiệp vụ; Prisma/MySQL trong `src/server/db.ts` và `prisma/schema.prisma`.
- Authentication dùng cookie HttpOnly `autocare_session`, bảng Session và `getCurrentUser()`. Layout customer chuyển nhân viên về `/employee`. Chatbot yêu cầu role CUSTOMER và hồ sơ khách hàng; khách chưa đăng nhập thấy nút đăng nhập.
- `POST /api/assistant/chat` nhận `{ messages }`, tối đa 10 tin nhắn, tin nhắn cuối từ user, câu hỏi tối đa 2000 ký tự. API lấy prompt từ `prompts/customer-assistant.md` và context theo `customerId`, gọi provider rồi trả `{ reply }` hoặc `{ error }`. Giới hạn tần suất, timeout và cảnh báo an toàn nằm ở server.
- Liên kết cũ tới `/ai-assistant` nằm trong menu desktop/mobile, footer và thẻ tư vấn AI trên Homepage. Không có chatbot khác hoặc transcript lưu trong database.
- Giao diện dùng Tailwind v4, token CSS trong `globals.css`, Inter/Plus Jakarta Sans, Lucide, Base UI, React Markdown và remark-gfm. Các mô-đun còn lại gồm đặt lịch, xe, sửa chữa, hóa đơn, kho, báo cáo, email và ảnh chứng cứ.

## Thay đổi

- Tái sử dụng chatbot thành `AiAssistantChat.tsx`, gắn ở route Homepage cạnh nội dung chính. Tên khách hàng vẫn lấy từ `getCurrentUser()` trên server.
- Nút nổi ở góc dưới phải mở Dialog của Base UI; đóng bằng nút hoặc Escape. Popup dùng portal để tránh ảnh hưởng bởi clipping/animation của Homepage, giới hạn kích thước theo viewport và safe area, cuộn riêng phần lịch sử.
- React state giữ tin nhắn, bản nháp, trạng thái đang trả lời và lỗi khi đóng/mở. Nút cuộc trò chuyện mới xóa lịch sử; chưa bổ sung lưu transcript qua tải lại trang hay database.
- Giữ nguyên endpoint, request/response, giới hạn 10 tin nhắn, Markdown và liên kết được phép, gợi ý câu hỏi, đặt lịch, xử lý lỗi và yêu cầu đăng nhập. Chặn gửi lặp trong lúc chờ và tránh gửi khi đang nhập bằng IME.
- Bỏ mục điều hướng AI riêng ở menu và nhóm điều hướng footer. Các lời mời hỏi AI dùng `AssistantLink` tới `/#chat`; trên Homepage mở tại chỗ, giữ vị trí cuộn và có thể mở lại nhiều lần. Truy cập URL cũ `/ai-assistant` chuyển về `/#chat` và mở chat.
- Không thêm thư viện hoặc chỉnh API, auth, prompt, schema/database hay nghiệp vụ khác.

## Kiểm tra

- `npm run lint`, `npm run typecheck`, `npm run build`.
- `node --import tsx --test scripts/customer-assistant-safety.test.ts`.
- Trình duyệt: mở/đóng, Escape và focus, liên kết trên Homepage/từ trang khác, chuyển hướng URL cũ, guest cần đăng nhập, viewport mobile/tablet/desktop; luồng gửi, trạng thái đang trả lời, Markdown, giữ lịch sử khi đóng/mở và thử lại lỗi với phản hồi API mô phỏng.
