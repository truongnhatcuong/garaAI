# Phân tích chức năng AutoCare AI

Phạm vi: source hiện tại tại ngày 2026-09-29. Tài liệu này phân tích mã nguồn, **không xác nhận dịch vụ bên ngoài đang hoạt động trong môi trường triển khai**. Đã rà soát cây `src/app`, `src/components`, `src/server`, `src/lib`, `prisma`, `prompts`, `scripts`, cấu hình và tài sản liên quan; bỏ qua generated Prisma, `node_modules` và binary vì chúng không định nghĩa nghiệp vụ riêng.

**Quy ước:** **IMPLEMENTED** = có giao diện/API hoặc luồng server ghi/đọc dữ liệu thực; **PARTIAL** = có phần vận hành nhưng thiếu một bước nghiệp vụ hoặc phụ thuộc cấu hình ngoài; **UI ONLY** = chỉ giao diện, không có luồng dữ liệu tương ứng; **MOCK** = dữ liệu/tình huống giả trong source, không nối vào route thực; **TODO** = chưa có triển khai, chỉ nhận diện khoảng trống có bằng chứng. Trạng thái trong Prisma **không** chứng minh có thao tác chuyển trạng thái tương ứng.

## 1. Tổng quan hệ thống

AutoCare AI là ứng dụng gara dùng Next.js App Router, React/TypeScript, Prisma/MySQL. Phần công khai hiển thị dịch vụ và hướng đến đặt lịch; khách hàng đăng ký, quản lý xe/lịch, xem sửa chữa và hóa đơn, hỏi trợ lý AI; quản trị quản lý hồ sơ gara, tiếp nhận/sửa chữa, hóa đơn, thanh toán, khoang, báo cáo; nhân viên xem phiếu được giao và báo tiến độ khoang. Dữ liệu qua route handlers trong `src/app/api`; phần nghiệp vụ trong `src/server/services`; database trong [`prisma/schema.prisma`](../prisma/schema.prisma). Entry UI nằm tại [`src/app`](../src/app), API tại [`src/app/api`](../src/app/api), tài nguyên quản trị tổng quát tại [`resource-config.ts`](../src/lib/resource-config.ts) và [`resource-service.ts`](../src/server/services/resource-service.ts).

Phần chatbot gọi một API chat completion bên ngoài khi có `API_KEY_AI`; không có mô hình AI chạy trong project. Ảnh xe “3D” trang chủ là hiệu ứng tương tác từ ảnh tĩnh, không phải chẩn đoán thật hay mô hình 360°. Bằng chứng: [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`DiagnosticVehicle.tsx`](../src/components/customer/DiagnosticVehicle.tsx), [`HomePage.tsx`](../src/components/customer/HomePage.tsx).

## 2. Actors

| Actor | Cơ sở xác định | Phạm vi thực tế |
|---|---|---|
| Khách chưa đăng nhập | Trang công khai và route catalog; không có `UserRole` riêng | Xem trang chủ, danh mục dịch vụ, giao diện trợ lý; phải đăng nhập để có hội thoại theo hồ sơ và thao tác cá nhân. [`(customer)/page.tsx`](<../src/app/(customer)/page.tsx>), [`services/page.tsx`](<../src/app/(customer)/services/page.tsx>), [`catalog/services/route.ts`](../src/app/api/catalog/services/route.ts) |
| Khách hàng (`CUSTOMER`) | `UserRole`, `Customer` ↔ `UserAccount` | Quản lý xe, lịch hẹn, hồ sơ; xem phiếu/hóa đơn của mình; hỏi AI theo dữ liệu của mình. [`auth/index.ts`](../src/server/services/auth/index.ts), [`customer-service.ts`](../src/server/services/customer-service.ts), [`customer-assistant.ts`](../src/server/services/customer-assistant.ts) |
| Quản trị (`ADMIN`) | `UserRole`, admin layout và `requireAdmin` | Quản lý tài nguyên gara, tiếp nhận/điều phối sửa chữa, chứng từ, cài đặt, báo cáo, email nhân viên. [`admin/layout.tsx`](<../src/app/(admin)/admin/layout.tsx>), [`resource-service.ts`](../src/server/services/resource-service.ts) |
| Nhân viên kỹ thuật (`EMPLOYEE`) | `UserRole`, `Employee` ↔ `UserAccount` và `requireEmployee` | Xem phiếu/khoang được phân, báo trạng thái khoang, đổi mật khẩu. Không có quyền sửa phiếu hoặc hóa đơn qua API admin. [`employee/page.tsx`](../src/app/employee/page.tsx), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts) |
| Nhà cung cấp AI, UploadThing, Gmail SMTP | Tích hợp ngoài, **không phải user actor** | Chat completion, lưu ảnh chứng cứ, gửi email; chỉ hoạt động nếu có cấu hình. [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`image-service.ts`](../src/server/services/image-service.ts), [`employee-mail.ts`](../src/server/services/employee-mail.ts) |

`Customer` và `Employee` vừa là hồ sơ nghiệp vụ do admin quản lý vừa có thể có tài khoản đăng nhập; không đồng nghĩa mọi bản ghi hồ sơ đều có tài khoản. [`schema.prisma`](../prisma/schema.prisma), [`employee-accounts/route.ts`](../src/app/api/admin/employee-accounts/route.ts).

## 3. Chức năng theo từng Actor

### Khách chưa đăng nhập

| Chức năng | Mức | Bằng chứng / giới hạn |
|---|---|---|
| Xem trang chủ, dịch vụ đang hoạt động, giá/thời lượng | IMPLEMENTED | [`HomePage.tsx`](../src/components/customer/HomePage.tsx), [`services/page.tsx`](<../src/app/(customer)/services/page.tsx>), [`catalog/services/route.ts`](../src/app/api/catalog/services/route.ts) đọc `Service`. |
| Tương tác ảnh xe trong khung khám phá | UI ONLY | [`DiagnosticVehicle.tsx`](../src/components/customer/DiagnosticVehicle.tsx) xử lý nghiêng/quét/điểm sáng bằng CSS/JS; không ghi chẩn đoán hay tạo phiếu. |
| Đăng ký tài khoản chủ xe, đăng nhập | IMPLEMENTED | [`AuthForm.tsx`](../src/components/customer/AuthForm.tsx), [`register/route.ts`](../src/app/api/auth/register/route.ts), [`login/route.ts`](../src/app/api/auth/login/route.ts). |
| Xem giao diện chatbot khi chưa đăng nhập | UI ONLY | [`ai-assistant/page.tsx`](<../src/app/(customer)/ai-assistant/page.tsx>), [`AiAssistantPage.tsx`](../src/components/customer/AiAssistantPage.tsx) hiện lời chào và nút đăng nhập; API chat trả 401. |

### Khách hàng

| Chức năng | Mức | Bằng chứng / giới hạn |
|---|---|---|
| Cập nhật hồ sơ, xem hạng/ưu đãi và số lần sửa hoàn tất | IMPLEMENTED | [`ProfileForm.tsx`](../src/components/customer/ProfileForm.tsx), `listMine('profile')`, `updateMine('profile')` trong [`customer-service.ts`](../src/server/services/customer-service.ts). |
| Thêm/sửa/ẩn xe của mình | IMPLEMENTED | [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx), [`customer-service.ts`](../src/server/services/customer-service.ts); xóa mềm bằng `deletedAt`. |
| Đặt, sửa hoặc hủy lịch `PENDING`; tra cứu lịch của mình | IMPLEMENTED | [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx), [`customer-service.ts`](../src/server/services/customer-service.ts), [`appointment-booking.ts`](../src/server/services/appointment-booking.ts). Không sửa/hủy sau khi rời `PENDING`. |
| Xem trạng thái, hạng mục của phiếu sửa chữa | IMPLEMENTED | [`repairs/page.tsx`](<../src/app/(customer)/repairs/page.tsx>), [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx), `listMine('repairs')`. Chỉ đọc; khách không duyệt báo giá trên API. |
| Xem/lọc hóa đơn, khoản đã thanh toán và chi tiết | IMPLEMENTED | [`invoices/page.tsx`](<../src/app/(customer)/invoices/page.tsx>), [`invoices/[id]/page.tsx`](<../src/app/(customer)/invoices/[id]/page.tsx>), [`customer-invoices.ts`](../src/server/services/customer-invoices.ts) ràng buộc `customerId`. |
| Thanh toán trực tuyến/tự ghi nhận thanh toán | TODO | Trang khách chỉ hiển thị. API ghi `Payment` là admin-only [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts). |
| Chat hỏi đáp theo hồ sơ riêng và danh mục gara | PARTIAL | UI + API thực: [`AiAssistantPage.tsx`](../src/components/customer/AiAssistantPage.tsx), [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`customer-assistant.ts`](../src/server/services/customer-assistant.ts). Phụ thuộc `API_KEY_AI`/nhà cung cấp; không ghi thay đổi DB và không có lịch sử hội thoại bền vững. |

### Quản trị

| Chức năng | Mức | Bằng chứng / giới hạn |
|---|---|---|
| Dashboard lịch hẹn, phiếu, doanh thu, tồn kho thấp, thông báo | IMPLEMENTED | [`DashboardPage.tsx`](../src/components/admin/DashboardPage.tsx), [`dashboard-service.ts`](../src/server/services/dashboard-service.ts); bỏ qua một số mã seed cố định. |
| Danh sách/tìm/lọc/sắp xếp/phân trang, CRUD các tài nguyên được hỗ trợ, xuất Excel | IMPLEMENTED | [`ResourceManager.tsx`](../src/components/admin/ResourceManager.tsx), [`resource-config.ts`](../src/lib/resource-config.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`[resource]/export/route.ts`](../src/app/api/[resource]/export/route.ts). Ngoại lệ hóa đơn, thanh toán, báo cáo nêu tại §5. |
| Quản lý khách, xe, dịch vụ, phụ tùng, lịch, nhân viên, khoang | IMPLEMENTED | Các trang `src/app/(admin)/admin/{customers,vehicles,services,inventory,appointments,employees,bays}` sử dụng [`ResourcePage.tsx`](../src/components/admin/ResourcePage.tsx). |
| Tạo/cập nhật tài khoản nhân viên, gửi email nhân viên | PARTIAL | [`employee-accounts/route.ts`](../src/app/api/admin/employee-accounts/route.ts), [`send-employee-email/route.ts`](../src/app/api/admin/send-employee-email/route.ts), [`employee-mail.ts`](../src/server/services/employee-mail.ts). Email phụ thuộc cấu hình Gmail SMTP; gửi trực tiếp, không ghi lịch sử email. |
| Tiếp nhận từ lịch hoặc khách đến trực tiếp, thêm dịch vụ/phụ tùng, công, chẩn đoán, phân người/khoang | IMPLEMENTED | [`RepairIntakeForm.tsx`](../src/components/admin/RepairIntakeForm.tsx), [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts). |
| Đổi trạng thái, sửa hạng mục/chi phí, ảnh chứng cứ, khôi phục phiếu hủy | IMPLEMENTED | [`RepairDetailActions.tsx`](../src/components/admin/RepairDetailActions.tsx), [`RepairLineEditor.tsx`](../src/components/admin/RepairLineEditor.tsx), [`RepairEvidenceManager.tsx`](../src/components/admin/RepairEvidenceManager.tsx), các route `repair-orders/[id]` ở §5. Upload phụ thuộc UploadThing. |
| Quy trình duyệt báo giá bởi khách, kiểm định có checklist/kết quả độc lập | PARTIAL | Enum `WAITING_APPROVAL`/`QUALITY_CHECK` và thao tác chuyển trạng thái tồn tại; không thấy API khách duyệt hay bản ghi kiểm định riêng. [`resource-config.ts`](../src/lib/resource-config.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`RepairDetailActions.tsx`](../src/components/admin/RepairDetailActions.tsx). |
| Xuất hóa đơn từ phiếu hoàn tất, ghi thanh toán một phần/đủ | IMPLEMENTED | [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts), [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts), [`InvoicePaymentForm.tsx`](../src/components/admin/InvoicePaymentForm.tsx). Không có cổng thu tiền tự động. |
| Chỉnh hạng hội viên, % ưu đãi, % thuế hóa đơn mới | IMPLEMENTED | [`TierDiscountSettings.tsx`](../src/components/admin/TierDiscountSettings.tsx), [`InvoiceTaxSettings.tsx`](../src/components/admin/InvoiceTaxSettings.tsx), [`membership-tiers/route.ts`](../src/app/api/admin/membership-tiers/route.ts), [`invoice-settings/route.ts`](../src/app/api/admin/invoice-settings/route.ts). |
| Ghi/xóa mềm chi phí, xem báo cáo ngày và xuất Excel | IMPLEMENTED | [`reports/page.tsx`](<../src/app/(admin)/admin/reports/page.tsx>), [`ExpenseManager.tsx`](../src/components/admin/ExpenseManager.tsx), [`financial-report.ts`](../src/server/services/financial-report.ts), generic report export. Giá vốn chỉ lấy phụ tùng liên kết và phân bổ theo tỷ lệ thanh toán: không phải kế toán tổng hợp. |
| Xem/quản lý thông báo và đổi hồ sơ/mật khẩu | IMPLEMENTED | [`NotificationHistory.tsx`](../src/components/admin/NotificationHistory.tsx), [`AdminProfileForm.tsx`](../src/components/admin/AdminProfileForm.tsx), [`ChangePasswordForm.tsx`](../src/components/shared/ChangePasswordForm.tsx), API generic notifications/auth. |

### Nhân viên kỹ thuật

| Chức năng | Mức | Bằng chứng / giới hạn |
|---|---|---|
| Xem phiếu chưa đóng được phân, thông tin xe/khách và hạng mục | IMPLEMENTED | [`employee/page.tsx`](../src/app/employee/page.tsx) lọc `technicianId` và trạng thái. |
| Xem khoang được phân, báo `ASSIGNED`/`IN_PROGRESS`/`BLOCKED`/`DONE`, nhập ghi chú | IMPLEMENTED | [`EmployeeBayList.tsx`](../src/components/employee/EmployeeBayList.tsx), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts); chỉ khoang gắn chính nhân viên. `DONE` giải phóng khoang, chuyển phiếu sang `QUALITY_CHECK`, tạo `Notification`. |
| Đổi mật khẩu, đăng xuất | IMPLEMENTED | [`ChangePasswordForm.tsx`](../src/components/shared/ChangePasswordForm.tsx), [`EmployeeLogoutButton.tsx`](../src/components/employee/EmployeeLogoutButton.tsx), API auth. |
| Sửa trực tiếp phiếu, hóa đơn hoặc hồ sơ khách | TODO | Các API tương ứng gọi `requireAdmin`; không có route nhân viên cho thao tác này. [`resource-service.ts`](../src/server/services/resource-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts). |

## 4. Các module/chức năng hệ thống

| Module | Tình trạng | Nguồn chính |
|---|---|---|
| Auth/session | IMPLEMENTED | [`auth/index.ts`](../src/server/services/auth/index.ts): scrypt, token ngẫu nhiên, hash token SHA-256, cookie HttpOnly/SameSite, hết hạn 30 ngày; [`auth` routes](../src/app/api/auth). |
| CRUD tài nguyên admin | IMPLEMENTED | [`resource-config.ts`](../src/lib/resource-config.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`ResourceManager.tsx`](../src/components/admin/ResourceManager.tsx). |
| Đặt lịch và chống trùng khung giờ | IMPLEMENTED | [`appointment-booking.ts`](../src/server/services/appointment-booking.ts) khóa bằng `AppointmentBookingMutex`, xét thời lượng `Service`, kiểm tra giao khoảng thời gian và retry conflict. |
| Tiếp nhận/sửa chữa/khoang | IMPLEMENTED | [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts). |
| Công việc con (`RepairTask`) | PARTIAL | Model và hiển thị ở [`repair-orders/[id]/page.tsx`](<../src/app/(admin)/admin/repair-orders/[id]/page.tsx>); không tìm thấy route riêng thêm/sửa task. |
| Ảnh chứng cứ | PARTIAL | API CRUD + UploadThing thực, hàng đợi xóa ảnh: [`evidence routes`](../src/app/api/repair-orders/[id]/evidence), [`image-service.ts`](../src/server/services/image-service.ts). Phụ thuộc `UPLOADTHING_TOKEN`. |
| Hóa đơn/ưu đãi/thuế | IMPLEMENTED | [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts), [`invoice-amounts.ts`](../src/server/services/invoice-amounts.ts), [`InvoiceSettings`](../prisma/schema.prisma), [`MembershipTier`](../prisma/schema.prisma). Snapshot `discount`, `tax`, `taxPercent` trên hóa đơn. |
| Thu tiền ghi nhận thủ công | IMPLEMENTED | [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts); không tích hợp thanh toán online/refund. |
| Dashboard và báo cáo tài chính | PARTIAL | [`dashboard-service.ts`](../src/server/services/dashboard-service.ts), [`financial-report.ts`](../src/server/services/financial-report.ts). Báo cáo ngày từ khoản thu thực nhận, giá vốn phụ tùng liên kết + chi phí vận hành; không theo dõi toàn bộ chi phí công hay tồn kho kế toán. |
| Thông báo nội bộ | IMPLEMENTED | `Notification` do nhân viên báo khoang và CRUD admin; [`NotificationHistory.tsx`](../src/components/admin/NotificationHistory.tsx), [`AdminShell.tsx`](../src/components/admin/AdminShell.tsx). Không thấy hệ thống push/email theo `Notification`. |
| Email cho nhân viên | PARTIAL | Gửi qua Nodemailer/Gmail khi cấu hình; [`send-employee-email/route.ts`](../src/app/api/admin/send-employee-email/route.ts), [`employee-mail.ts`](../src/server/services/employee-mail.ts). |
| Trợ lý AI khách hàng | PARTIAL | Có UI, route gọi provider, context DB giới hạn customer; phụ thuộc cấu hình ngoài, rate limit `Map` trong tiến trình, không lưu transcript. [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`customer-assistant.ts`](../src/server/services/customer-assistant.ts), [`customer-assistant.md`](../prompts/customer-assistant.md). |
| Minh họa xe tương tác trang chủ | UI ONLY | Cảnh VEYRA Việt hoá được nhúng qua iframe, dùng ảnh/video và hotspot; không đọc cảm biến xe. [`DiagnosticVehicle.tsx`](../src/components/customer/DiagnosticVehicle.tsx), [`tài liệu tích hợp`](research/VEYRA_INTEGRATION.md). |
| Dữ liệu/khung trang mẫu còn trong repo | MOCK / UI ONLY | [`mock-data.ts`](../src/lib/mock-data.ts), [`InventoryPage.tsx`](../src/components/admin/InventoryPage.tsx), [`RepairOrderPage.tsx`](../src/components/admin/RepairOrderPage.tsx), [`RepairTrackingPage.tsx`](../src/components/customer/RepairTrackingPage.tsx). Các route `/admin/inventory`, `/admin/repair-orders`, `/repairs` hiện dùng `ResourcePage`/`CustomerRecords`, không import các trang mẫu này. |

**Status thực tế và giới hạn:** `RecordStatus`: `ACTIVE`, `INACTIVE`; `VehicleStatus`: `ACTIVE`, `IN_REPAIR`, `READY`; `AppointmentStatus`: `PENDING`, `CONFIRMED`, `ARRIVED`, `IN_PROGRESS`, `CANCELLED`, `COMPLETED`; `RepairStatus`: `INTAKE`, `WAITING_APPROVAL`, `WAITING_PARTS`, `REPAIRING`, `QUALITY_CHECK`, `READY_FOR_PICKUP`, `COMPLETED`, `CANCELLED`; `InvoiceStatus`: `DRAFT`, `PENDING_APPROVAL`, `UNPAID`, `PARTIALLY_PAID`, `PAID`, `CANCELLED`; `PaymentStatus`: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`; `TaskStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`; `NotificationType`: `INFO`, `WARNING`, `ERROR`, `SUCCESS`; `UserRole`: `ADMIN`, `CUSTOMER`, `EMPLOYEE`; `PaymentMethod`: `CASH`, `BANK_TRANSFER`, `CARD`, `OTHER`; `LineType`: `PART`, `SERVICE`. Nguồn: [`schema.prisma`](../prisma/schema.prisma). Khoang dùng chuỗi `statusText` và mã trạng thái ở API nhân viên, **không có enum Prisma**: [`bay-status.ts`](../src/lib/bay-status.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts). `IN_REPAIR/READY` ở xe, `PENDING_APPROVAL` ở hóa đơn, `FAILED/REFUNDED` ở thanh toán tồn tại trong schema/UI, nhưng không thấy luồng server chủ động chuyển tới các trạng thái này. Không suy diễn rằng chúng đã có quy trình riêng.

## 5. API endpoints

Mọi route dưới đây là file hiện hữu. `{resource}` của API admin generic chỉ nhận 12 giá trị trong [`resource-config.ts`](../src/lib/resource-config.ts): `customers`, `vehicles`, `appointments`, `services`, `employees`, `parts`, `repair-orders`, `invoices`, `payments`, `notifications`, `bays`, `reports`.

| Method + endpoint | Quyền | Hành vi / giới hạn | Source |
|---|---|---|---|
| GET, POST `/api/[resource]` | ADMIN | Danh sách có lọc/phân trang; tạo tài nguyên được phép. POST invoices/payments/reports trả 405. | [`route.ts`](../src/app/api/[resource]/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts) |
| GET, PATCH, DELETE `/api/[resource]/[id]` | ADMIN | Chi tiết, cập nhật, xóa mềm; PATCH invoices/payments/reports và DELETE invoices/payments/reports bị chặn. | [`route.ts`](../src/app/api/[resource]/[id]/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts) |
| GET `/api/[resource]/export` | ADMIN | Excel cho resource `exportable`, dùng bộ lọc hiện tại. | [`route.ts`](../src/app/api/[resource]/export/route.ts) |
| POST `/api/auth/register` | Công khai | Tạo `Customer` + `UserAccount(CUSTOMER)` và session. | [`route.ts`](../src/app/api/auth/register/route.ts) |
| POST `/api/auth/login` | Công khai | Kiểm mật khẩu; nhân viên ngừng hoạt động bị chặn; tạo session. | [`route.ts`](../src/app/api/auth/login/route.ts) |
| POST `/api/auth/logout` | Có session hoặc không | Xóa session/cookie hiện tại. | [`route.ts`](../src/app/api/auth/logout/route.ts) |
| GET `/api/auth/me` | Công khai | Trả thông tin user tối thiểu hoặc `null`. | [`route.ts`](../src/app/api/auth/me/route.ts) |
| POST `/api/auth/change-password` | Đăng nhập | Kiểm mật khẩu cũ, thay mật khẩu, xóa các session. | [`route.ts`](../src/app/api/auth/change-password/route.ts) |
| GET `/api/catalog/services` | Công khai | Dịch vụ `ACTIVE` chưa xóa. | [`route.ts`](../src/app/api/catalog/services/route.ts) |
| GET, POST `/api/me/[resource]` | CUSTOMER | GET: `profile`, `vehicles`, `appointments`, `invoices`, `repairs`; POST: `vehicles`, `appointments`. | [`route.ts`](../src/app/api/me/[resource]/route.ts), [`customer-service.ts`](../src/server/services/customer-service.ts) |
| PATCH, DELETE `/api/me/[resource]/[id]` | CUSTOMER | PATCH: `profile`, `vehicles`, `appointments`; DELETE: xe mềm, hủy lịch `PENDING`. | [`route.ts`](../src/app/api/me/[resource]/[id]/route.ts), [`customer-service.ts`](../src/server/services/customer-service.ts) |
| POST `/api/assistant/chat` | CUSTOMER | Gọi provider với prompt + DB context riêng, tối đa 10 messages; 20 request/phút/khách trong bộ nhớ tiến trình. | [`route.ts`](../src/app/api/assistant/chat/route.ts) |
| GET, POST `/api/admin/employee-accounts` | ADMIN | Xem/tạo hoặc cập nhật tài khoản nhân viên, email/mật khẩu. | [`route.ts`](../src/app/api/admin/employee-accounts/route.ts) |
| PATCH `/api/admin/profile` | ADMIN | Cập nhật tên/số điện thoại tài khoản admin. | [`route.ts`](../src/app/api/admin/profile/route.ts) |
| PATCH `/api/admin/membership-tiers` | ADMIN | Cập nhật % ưu đãi hạng. | [`route.ts`](../src/app/api/admin/membership-tiers/route.ts) |
| PATCH `/api/admin/invoice-settings` | ADMIN | Cập nhật % thuế hóa đơn mới. | [`route.ts`](../src/app/api/admin/invoice-settings/route.ts) |
| POST `/api/admin/repair-intake` | ADMIN | Tiếp nhận lịch/khách trực tiếp, tạo phiếu + lines, giữ khoang, cập nhật lịch. | [`route.ts`](../src/app/api/admin/repair-intake/route.ts) |
| PATCH `/api/admin/repair-orders/[id]/lines` | ADMIN | Thêm/sửa/bỏ hạng mục và tiền công; chặn sau khi có hóa đơn không hủy. | [`route.ts`](../src/app/api/admin/repair-orders/[id]/lines/route.ts) |
| POST `/api/admin/repair-orders/[id]/restore` | ADMIN | Mở lại phiếu `CANCELLED` về `INTAKE`, bỏ phân khoang cũ, mở lại lịch liên kết; chặn xung đột xe/hóa đơn. | [`route.ts`](../src/app/api/admin/repair-orders/[id]/restore/route.ts) |
| POST `/api/admin/repair-orders/[id]/invoice` | ADMIN | Xuất hóa đơn từ phiếu `COMPLETED`, tính ưu đãi rồi thuế, chống trùng. | [`route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts) |
| POST `/api/admin/invoices/[id]/payments` | ADMIN | Ghi khoản thu thủ công, kiểm số còn lại, chuyển `PARTIALLY_PAID/PAID`. | [`route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts) |
| GET, POST `/api/repair-orders/[id]/evidence` | ADMIN | Xem/upload 1–10 ảnh chứng cứ và chú thích. | [`route.ts`](../src/app/api/repair-orders/[id]/evidence/route.ts) |
| PATCH, DELETE `/api/repair-orders/[id]/evidence/[evidenceId]` | ADMIN | Đổi chú thích/ảnh, xóa ảnh và xếp job dọn UploadThing. | [`route.ts`](../src/app/api/repair-orders/[id]/evidence/[evidenceId]/route.ts) |
| PATCH `/api/employee/bays/[id]` | EMPLOYEE, đúng khoang được giao | Báo tiến độ; `DONE` giải phóng khoang, chuyển phiếu sang kiểm định, tạo thông báo. | [`route.ts`](../src/app/api/employee/bays/[id]/route.ts) |
| POST `/api/admin/send-employee-email` | ADMIN | Gửi email đến nhân viên ACTIVE có tài khoản bằng Gmail SMTP. | [`route.ts`](../src/app/api/admin/send-employee-email/route.ts) |
| POST `/api/admin/expenses` | ADMIN | Ghi chi phí vận hành. | [`route.ts`](../src/app/api/admin/expenses/route.ts) |
| DELETE `/api/admin/expenses/[id]` | ADMIN | Xóa mềm khoản chi. | [`route.ts`](../src/app/api/admin/expenses/[id]/route.ts) |

Không có route riêng `/api/admin/reports/export`: nút báo cáo dẫn tới **generic** `GET /api/reports/export`. [`reports/page.tsx`](<../src/app/(admin)/admin/reports/page.tsx>), [`[resource]/export/route.ts`](../src/app/api/[resource]/export/route.ts).

## 6. Database models + relationships

Prisma dùng MySQL, schema tại [`prisma/schema.prisma`](../prisma/schema.prisma), lịch sử thay đổi tại [`prisma/migrations`](../prisma/migrations). **22 models**:

| Model | Dữ liệu chính và quan hệ |
|---|---|
| `Customer` | Tên, liên hệ, tier, status; 1–n `Vehicle`, `Appointment`, `RepairOrder`, `Invoice`; tùy chọn 1–1 `UserAccount`. |
| `MembershipTier` | Mã hạng, nhãn, `%` ưu đãi; `Customer.tier` là chuỗi, **không có FK** Prisma tới bảng này. |
| `InvoiceSettings` | Bản ghi cài đặt `id=1`, `%` thuế mặc định 0. |
| `Vehicle` | Biển số/VIN unique, ODO, bảo hành, status; n–1 `Customer` tùy chọn; 1–n lịch, phiếu, hóa đơn, khoang. |
| `Service` | Dịch vụ, thời lượng, giá, trạng thái; được tham chiếu bởi lịch và dòng phiếu. |
| `Employee` | Mã, liên hệ, chuyên môn, ca, status; advisor/technician của phiếu, khoang, thông báo; tùy chọn 1–1 tài khoản. |
| `Appointment` | Khách, xe, dịch vụ tùy chọn, bắt đầu/kết thúc, status; 1–0/1 `RepairOrder` qua `appointmentId` unique. |
| `AppointmentBookingMutex` | `id`, `version` dùng khóa tuần tự giao dịch khi đặt lịch/tiếp nhận/xuất hóa đơn/thu tiền. |
| `Part` | SKU unique, giá vốn/giá bán, tồn kho/ngưỡng tối thiểu, tình trạng; 1–n dòng phiếu. |
| `RepairOrder` | Phiếu gắn khách + xe, tùy chọn lịch/cố vấn/KTV; trạng thái, khoang, ODO, chẩn đoán, ghi chú, công, dự toán; 1–n dòng/task/ảnh/hóa đơn. |
| `RepairOrderLine` | Loại `PART/SERVICE`, catalog tương ứng tùy chọn, mô tả, số lượng, đơn giá, thành tiền, thứ tự. |
| `RepairTask` | Công việc con, status, thứ tự, n–1 phiếu. |
| `RepairEvidence` | URL ảnh, UploadThing key, chú thích, thứ tự, n–1 phiếu. |
| `ImageDeletionJob` | Khóa ảnh chờ xóa, số lần thử, lỗi gần nhất; không có FK tới ảnh. |
| `Invoice` | Khách, tùy chọn xe/phiếu, subtotal/discount/tax/taxPercent/total, status; 1–n `Payment`. `taxPercent` nullable cho hóa đơn cũ. |
| `Payment` | Hóa đơn, mã, số tiền, phương thức, status, ngày thu, ghi chú. |
| `Notification` | Tiêu đề/nội dung/loại, tùy chọn nhân viên liên quan, `readAt`. |
| `WorkshopBay` | Mã khoang unique, xe + nhân viên tùy chọn, `statusText`, `progressNote`, `reportedAt`. `RepairOrder.bayCode` là chuỗi, **không có FK** tới `WorkshopBay`. |
| `Report` | Kỳ ngày unique, doanh thu/chi phí/lợi nhuận, status; được upsert từ dữ liệu thực. |
| `Expense` | Khoản chi, số tiền, ngày chi, xóa mềm. |
| `UserAccount` | Email unique, mật khẩu băm, role, liên kết tùy chọn duy nhất tới `Customer` hoặc `Employee`; 1–n `Session`. |
| `Session` | Token băm unique, user, hạn dùng. |

Các bảng nghiệp vụ đa số có `deletedAt` để xóa mềm; không được hiểu là cascade delete. `MembershipTier` và `InvoiceSettings` là bảng cài đặt; `AppointmentBookingMutex` và `ImageDeletionJob` là bảng kỹ thuật. Quan hệ chi tiết/optional và chỉ mục xem [`schema.prisma`](../prisma/schema.prisma).

## 7. Business flows

1. **Đăng ký/đăng nhập:** khách tự tạo `Customer` + `UserAccount(CUSTOMER)`; đăng nhập kiểm scrypt rồi lưu session token băm; role điều hướng vào `/`, `/admin`, `/employee`. Đổi mật khẩu xóa toàn bộ session user. [`register/route.ts`](../src/app/api/auth/register/route.ts), [`login/route.ts`](../src/app/api/auth/login/route.ts), [`auth/index.ts`](../src/server/services/auth/index.ts), [`change-password/route.ts`](../src/app/api/auth/change-password/route.ts).
2. **Đặt lịch:** khách chọn xe thuộc mình và dịch vụ ACTIVE; server xác định `endsAt`, kiểm lịch giao nhau trong giao dịch có mutex. Khách chỉ sửa/hủy khi `PENDING`. Admin có thể CRUD lịch; lịch đã liên kết phiếu chỉ cho sửa notes trong generic update. [`customer-service.ts`](../src/server/services/customer-service.ts), [`appointment-booking.ts`](../src/server/services/appointment-booking.ts), [`resource-service.ts`](../src/server/services/resource-service.ts).
3. **Tiếp nhận:** admin dùng lịch hiện có hoặc khách đến trực tiếp, chọn khách/xe, cố vấn/KTV, hạng mục, công và khoang. Server kiểm chủ xe, lịch chưa kết thúc, xe không có phiếu mở, catalog tồn tại; tạo phiếu `INTAKE` hoặc `REPAIRING` nếu phân khoang; lịch liên kết → `IN_PROGRESS`. [`RepairIntakeForm.tsx`](../src/components/admin/RepairIntakeForm.tsx), [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts).
4. **Sửa chữa:** admin đổi status và hạng mục; khoang chỉ được giữ bởi một phiếu active. KTV báo `BLOCKED` kèm lý do hoặc `DONE`; `DONE` trả khoang trống, phiếu → `QUALITY_CHECK`, tạo Notification. Admin chuyển `QUALITY_CHECK` → `READY_FOR_PICKUP` → `COMPLETED`; các bước cuối được server ràng buộc. [`resource-service.ts`](../src/server/services/resource-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts), [`RepairDetailActions.tsx`](../src/components/admin/RepairDetailActions.tsx).
5. **Hủy/khôi phục phiếu:** admin hủy phiếu active; lịch liên kết hủy, khoang được trả. Route khôi phục chỉ nhận phiếu `CANCELLED`, kiểm xe không có phiếu mở khác/hóa đơn không hủy, đặt phiếu về `INTAKE`, xóa `bayCode`, lịch liên kết về `IN_PROGRESS`. [`resource-service.ts`](../src/server/services/resource-service.ts), [`restore/route.ts`](../src/app/api/admin/repair-orders/[id]/restore/route.ts).
6. **Ảnh chứng cứ:** admin upload/đổi/xóa; file lên UploadThing, metadata vào `RepairEvidence`, key cũ vào `ImageDeletionJob`; lỗi xóa được retry khi xử lý tiếp. [`evidence routes`](../src/app/api/repair-orders/[id]/evidence), [`image-service.ts`](../src/server/services/image-service.ts).
7. **Hóa đơn/thanh toán:** admin chỉ xuất khi phiếu `COMPLETED` và có tổng chi phí dương; `subtotal = lines + laborCost`, trừ ưu đãi theo hạng, thuế trên số sau ưu đãi; hóa đơn `UNPAID`. Admin ghi từng khoản không vượt số còn lại; chuyển `PARTIALLY_PAID` hoặc `PAID`. Khách xem, không trả online trong app. [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts), [`invoice-amounts.ts`](../src/server/services/invoice-amounts.ts), [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts), [`invoices/[id]/page.tsx`](<../src/app/(customer)/invoices/[id]/page.tsx>).
8. **Báo cáo:** khoản thu hoàn tất trong ngày theo Asia/Ho_Chi_Minh, trừ giá vốn phụ tùng phân bổ theo tiền thu và `Expense`; upsert `Report` theo ngày. Đây là công thức code, không phải báo cáo thuế/kế toán đầy đủ. [`financial-report.ts`](../src/server/services/financial-report.ts), [`reports/page.tsx`](<../src/app/(admin)/admin/reports/page.tsx>).
9. **AI:** khách đăng nhập gửi tối đa 10 messages gần nhất; API lấy hồ sơ/danh mục scoped theo customer, ghép prompt rồi gọi provider, trả text. Không tạo/sửa xe, lịch hay phiếu. [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`customer-assistant.ts`](../src/server/services/customer-assistant.ts), [`customer-assistant.md`](../prompts/customer-assistant.md).

## 8. Role/Permission

| Vùng/chức năng | Guest | CUSTOMER | EMPLOYEE | ADMIN | Bằng chứng |
|---|---|---|---|---|---|
| Home, dịch vụ/catalog, auth UI | Xem | Xem | Xem trang công khai tùy điều hướng | Xem trang công khai tùy điều hướng | [`(customer)/layout.tsx`](<../src/app/(customer)/layout.tsx>), [`catalog/services/route.ts`](../src/app/api/catalog/services/route.ts) |
| `/api/me/*`, hồ sơ/xe/lịch riêng | 401 | Chỉ `customerId` của mình | 401 | 401 theo `requireCustomer` | [`customer-service.ts`](../src/server/services/customer-service.ts) |
| Trang hóa đơn khách | Đến đăng nhập | Chỉ `customerId` của mình | Đến đăng nhập | Redirect `/admin/invoices` | [`customer-invoices.ts`](../src/server/services/customer-invoices.ts) |
| Chat API | 401 | Có, theo `customerId` | 401 | 401 | [`chat/route.ts`](../src/app/api/assistant/chat/route.ts) |
| `/employee`, cập nhật khoang được giao | Redirect | Redirect | Chỉ phiếu/Khoang gắn `employeeId` | Redirect trang admin | [`employee/page.tsx`](../src/app/employee/page.tsx), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts) |
| `/admin` và generic/special admin API | Redirect/401 | Redirect/401 | Redirect `/employee`/401 | Có | [`admin/layout.tsx`](<../src/app/(admin)/admin/layout.tsx>), [`resource-service.ts`](../src/server/services/resource-service.ts) |
| Đổi mật khẩu, logout | Cần session để đổi | Có | Có | Có | [`change-password/route.ts`](../src/app/api/auth/change-password/route.ts), [`logout/route.ts`](../src/app/api/auth/logout/route.ts) |

Server bảo vệ lại ở API, không chỉ ẩn nút. Admin `requireAdmin` trong service generic và route chuyên biệt; customer API so khớp `customerId`; employee API so khớp `employeeId`, khoang và xe được giao. Bằng chứng chính: [`auth/index.ts`](../src/server/services/auth/index.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`customer-service.ts`](../src/server/services/customer-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts).

## 9. Danh sách Use Case

| ID | Actor | Use Case | Mức | Source chính |
|---|---|---|---|---|
| UC01 | Guest | Xem dịch vụ/giá | IMPLEMENTED | [`services/page.tsx`](<../src/app/(customer)/services/page.tsx>) |
| UC02 | Guest | Đăng ký tài khoản | IMPLEMENTED | [`register/route.ts`](../src/app/api/auth/register/route.ts) |
| UC03 | Mọi tài khoản | Đăng nhập/đăng xuất/đổi mật khẩu | IMPLEMENTED | [`auth routes`](../src/app/api/auth), [`auth/index.ts`](../src/server/services/auth/index.ts) |
| UC04 | Customer | Quản lý hồ sơ/xe | IMPLEMENTED | [`customer-service.ts`](../src/server/services/customer-service.ts) |
| UC05 | Customer | Đặt/sửa/hủy lịch | IMPLEMENTED | [`customer-service.ts`](../src/server/services/customer-service.ts), [`appointment-booking.ts`](../src/server/services/appointment-booking.ts) |
| UC06 | Customer | Xem tiến độ sửa chữa | IMPLEMENTED | [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx) |
| UC07 | Customer | Xem hóa đơn/thanh toán | IMPLEMENTED | [`invoices/page.tsx`](<../src/app/(customer)/invoices/page.tsx>) |
| UC08 | Customer | Hỏi chatbot theo dữ liệu của mình | PARTIAL | [`chat/route.ts`](../src/app/api/assistant/chat/route.ts) |
| UC09 | Admin | Quản lý danh mục/hồ sơ và xuất Excel | IMPLEMENTED | [`ResourceManager.tsx`](../src/components/admin/ResourceManager.tsx), [`resource-service.ts`](../src/server/services/resource-service.ts) |
| UC10 | Admin | Tiếp nhận xe/tạo phiếu | IMPLEMENTED | [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts) |
| UC11 | Admin | Điều phối khoang/KTV, đổi trạng thái phiếu | IMPLEMENTED | [`resource-service.ts`](../src/server/services/resource-service.ts) |
| UC12 | Employee | Báo tiến độ khoang | IMPLEMENTED | [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts) |
| UC13 | Admin | Quản lý hạng mục/ảnh chứng cứ | IMPLEMENTED/PARTIAL | [`lines/route.ts`](../src/app/api/admin/repair-orders/[id]/lines/route.ts), [`evidence/route.ts`](../src/app/api/repair-orders/[id]/evidence/route.ts) |
| UC14 | Admin | Hủy/khôi phục phiếu | IMPLEMENTED | [`resource-service.ts`](../src/server/services/resource-service.ts), [`restore/route.ts`](../src/app/api/admin/repair-orders/[id]/restore/route.ts) |
| UC15 | Admin | Xuất hóa đơn và ghi thanh toán | IMPLEMENTED | [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts), [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts) |
| UC16 | Admin | Chỉnh ưu đãi/thuế | IMPLEMENTED | [`membership-tiers/route.ts`](../src/app/api/admin/membership-tiers/route.ts), [`invoice-settings/route.ts`](../src/app/api/admin/invoice-settings/route.ts) |
| UC17 | Admin | Xem dashboard/báo cáo, ghi chi phí | IMPLEMENTED/PARTIAL | [`dashboard-service.ts`](../src/server/services/dashboard-service.ts), [`financial-report.ts`](../src/server/services/financial-report.ts) |
| UC18 | Admin | Gửi email nhân viên | PARTIAL | [`send-employee-email/route.ts`](../src/app/api/admin/send-employee-email/route.ts) |
| UC19 | Guest/Customer | Xem mô phỏng xe 3D | UI ONLY | [`DiagnosticVehicle.tsx`](../src/components/customer/DiagnosticVehicle.tsx) |

## 10. Chi tiết các Use Case quan trọng

**UC05 – Đặt lịch.** Tiền điều kiện: customer đã đăng nhập, xe thuộc customer, dịch vụ `ACTIVE`. UI gửi `POST /api/me/appointments`. Service kiểm ownership/catalog, tạo mã tự động rồi `reserveAppointment` tính `endsAt` và chặn khoảng giờ giao nhau trong transaction. Hậu điều kiện: `Appointment(PENDING)` gắn customer/vehicle/service. Ngoại lệ: xe không thuộc chủ, dịch vụ không khả dụng, lịch trùng → lỗi 400/409. Sửa/hủy chỉ khi `PENDING`. [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx), [`customer-service.ts`](../src/server/services/customer-service.ts), [`appointment-booking.ts`](../src/server/services/appointment-booking.ts), [`generated-code.ts`](../src/server/services/generated-code.ts).

**UC10 – Tiếp nhận.** Admin từ lịch hoặc nhập trực tiếp; chọn khách, xe, hạng mục, kỹ thuật viên/khoang. Route dùng mutex, xác minh lịch, chủ xe, trạng thái nhân viên, một phiếu mở/xe, catalog hoạt động; tính `estimateTotal = lines + laborCost`, giữ khoang nếu có. Phiếu khởi tạo `INTAKE` hoặc `REPAIRING`, lịch liên kết `IN_PROGRESS`. Giao dịch lỗi thì không hoàn tất tạo phiếu. [`RepairIntakeForm.tsx`](../src/components/admin/RepairIntakeForm.tsx), [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts).

**UC11/12 – Sửa chữa và báo tiến độ.** Admin gán KTV/khoang hoặc đổi trạng thái trong generic PATCH. Nhân viên chỉ PATCH khoang được giao; `BLOCKED` cần note; `DONE` kiểm phiếu khớp, trả khoang, chuyển phiếu sang kiểm định và tạo thông báo. Admin mới có thao tác sẵn sàng bàn giao/hoàn tất; server buộc qua `QUALITY_CHECK` và `READY_FOR_PICKUP`. [`resource-service.ts`](../src/server/services/resource-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts), [`RepairDetailActions.tsx`](../src/components/admin/RepairDetailActions.tsx).

**UC14 – Khôi phục phiếu hủy.** Chỉ admin; phiếu còn tồn tại, `CANCELLED`, khách/xe còn hợp lệ, không có hóa đơn đang dùng, xe không có phiếu active khác. Route transaction đặt `INTAKE`, xóa `bayCode`; lịch liên kết từ `CANCELLED` về `IN_PROGRESS`. Không tự nhận lại khoang cũ. [`restore/route.ts`](../src/app/api/admin/repair-orders/[id]/restore/route.ts).

**UC15 – Xuất hóa đơn/ghi thanh toán.** Admin chỉ xuất khi phiếu `COMPLETED` và subtotal > 0; giao dịch kiểm hóa đơn hiện có, tính discount theo tier, tax theo InvoiceSettings, lưu snapshot tiền + % thuế và tạo invoice `UNPAID`. Ghi thanh toán thủ công kiểm số tiền còn lại; mỗi payment `COMPLETED` và invoice thành `PARTIALLY_PAID`/`PAID`. Khách xem theo ownership; không có gateway thanh toán. [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts), [`invoice-amounts.ts`](../src/server/services/invoice-amounts.ts), [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts), [`customer-invoices.ts`](../src/server/services/customer-invoices.ts).

**UC08 – Hỏi AI.** Yêu cầu customer session và API key; xác minh chuỗi messages kết thúc bởi user, giới hạn 20 request/phút theo bộ nhớ process, lấy dữ liệu customer + danh mục, gọi endpoint chat completion timeout 30s; trả `reply`. Không lưu hội thoại và không thực hiện hành động nghiệp vụ. Thiếu key/provider lỗi thì trả 503/502. [`AiAssistantPage.tsx`](../src/components/customer/AiAssistantPage.tsx), [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`customer-assistant.ts`](../src/server/services/customer-assistant.ts), [`customer-assistant.md`](../prompts/customer-assistant.md).

## 11. Source code liên quan của từng chức năng

| Chức năng/nhóm | Frontend | API / service / schema |
|---|---|---|
| Auth, quyền, phiên | [`AuthForm.tsx`](../src/components/customer/AuthForm.tsx), [`ChangePasswordForm.tsx`](../src/components/shared/ChangePasswordForm.tsx), [`admin/layout.tsx`](<../src/app/(admin)/admin/layout.tsx>) | [`auth routes`](../src/app/api/auth), [`auth/index.ts`](../src/server/services/auth/index.ts), [`schema.prisma`](../prisma/schema.prisma) |
| Khách/xe/hồ sơ | [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx), [`ProfileForm.tsx`](../src/components/customer/ProfileForm.tsx) | [`me routes`](../src/app/api/me/[resource]), [`customer-service.ts`](../src/server/services/customer-service.ts) |
| Dịch vụ/đặt lịch | [`services/page.tsx`](<../src/app/(customer)/services/page.tsx>), [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx) | [`catalog/services/route.ts`](../src/app/api/catalog/services/route.ts), [`appointment-booking.ts`](../src/server/services/appointment-booking.ts) |
| CRUD admin/danh mục/Excel | [`ResourceManager.tsx`](../src/components/admin/ResourceManager.tsx), [`ResourceFormDialog.tsx`](../src/components/admin/ResourceFormDialog.tsx) | [`resource-config.ts`](../src/lib/resource-config.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`[resource] routes`](../src/app/api/[resource]) |
| Dashboard/thông báo | [`DashboardPage.tsx`](../src/components/admin/DashboardPage.tsx), [`NotificationHistory.tsx`](../src/components/admin/NotificationHistory.tsx) | [`dashboard-service.ts`](../src/server/services/dashboard-service.ts), [`Notification model`](../prisma/schema.prisma) |
| Phiếu/tiếp nhận/khoang | [`RepairIntakeForm.tsx`](../src/components/admin/RepairIntakeForm.tsx), [`RepairDetailActions.tsx`](../src/components/admin/RepairDetailActions.tsx), [`EmployeeBayList.tsx`](../src/components/employee/EmployeeBayList.tsx) | [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts) |
| Dòng phiếu/ảnh | [`RepairLineEditor.tsx`](../src/components/admin/RepairLineEditor.tsx), [`RepairEvidenceManager.tsx`](../src/components/admin/RepairEvidenceManager.tsx) | [`lines/route.ts`](../src/app/api/admin/repair-orders/[id]/lines/route.ts), [`evidence routes`](../src/app/api/repair-orders/[id]/evidence), [`image-service.ts`](../src/server/services/image-service.ts) |
| Hóa đơn/thu tiền/cài đặt | [`InvoicePaymentForm.tsx`](../src/components/admin/InvoicePaymentForm.tsx), [`InvoiceTaxSettings.tsx`](../src/components/admin/InvoiceTaxSettings.tsx), [`TierDiscountSettings.tsx`](../src/components/admin/TierDiscountSettings.tsx) | [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts), [`payments/route.ts`](../src/app/api/admin/invoices/[id]/payments/route.ts), [`invoice-amounts.ts`](../src/server/services/invoice-amounts.ts), [`schema.prisma`](../prisma/schema.prisma) |
| Báo cáo/chi phí | [`reports/page.tsx`](<../src/app/(admin)/admin/reports/page.tsx>), [`ExpenseManager.tsx`](../src/components/admin/ExpenseManager.tsx) | [`financial-report.ts`](../src/server/services/financial-report.ts), [`expenses routes`](../src/app/api/admin/expenses) |
| Email nhân viên | [`EmployeeEmailForm.tsx`](../src/components/admin/EmployeeEmailForm.tsx) | [`send-employee-email/route.ts`](../src/app/api/admin/send-employee-email/route.ts), [`employee-mail.ts`](../src/server/services/employee-mail.ts) |
| AI/chatbot | [`AiAssistantPage.tsx`](../src/components/customer/AiAssistantPage.tsx) | [`chat/route.ts`](../src/app/api/assistant/chat/route.ts), [`customer-assistant.ts`](../src/server/services/customer-assistant.ts), [`customer-assistant.md`](../prompts/customer-assistant.md) |
| Mock/UI chưa nối | [`InventoryPage.tsx`](../src/components/admin/InventoryPage.tsx), [`RepairOrderPage.tsx`](../src/components/admin/RepairOrderPage.tsx), [`RepairTrackingPage.tsx`](../src/components/customer/RepairTrackingPage.tsx), [`mock-data.ts`](../src/lib/mock-data.ts) | Không có API đi cùng các component mẫu này; route hiện dùng component khác. |

**Đối chiếu trực tiếp từng trang admin:** dashboard [`admin/page.tsx`](<../src/app/(admin)/admin/page.tsx>); khách [`customers/page.tsx`](<../src/app/(admin)/admin/customers/page.tsx>); xe [`vehicles/page.tsx`](<../src/app/(admin)/admin/vehicles/page.tsx>); lịch [`appointments/page.tsx`](<../src/app/(admin)/admin/appointments/page.tsx>); dịch vụ [`services/page.tsx`](<../src/app/(admin)/admin/services/page.tsx>); kho phụ tùng [`inventory/page.tsx`](<../src/app/(admin)/admin/inventory/page.tsx>); nhân viên [`employees/page.tsx`](<../src/app/(admin)/admin/employees/page.tsx>); khoang [`bays/page.tsx`](<../src/app/(admin)/admin/bays/page.tsx>); phiếu danh sách [`repair-orders/page.tsx`](<../src/app/(admin)/admin/repair-orders/page.tsx>), tiếp nhận [`repair-orders/new/page.tsx`](<../src/app/(admin)/admin/repair-orders/new/page.tsx>), chi tiết [`repair-orders/[id]/page.tsx`](<../src/app/(admin)/admin/repair-orders/[id]/page.tsx>); hóa đơn danh sách [`invoices/page.tsx`](<../src/app/(admin)/admin/invoices/page.tsx>) và chi tiết [`invoices/[id]/page.tsx`](<../src/app/(admin)/admin/invoices/[id]/page.tsx>); chuyển hướng thanh toán [`payments/page.tsx`](<../src/app/(admin)/admin/payments/page.tsx>); thông báo [`notifications/page.tsx`](<../src/app/(admin)/admin/notifications/page.tsx>); báo cáo [`reports/page.tsx`](<../src/app/(admin)/admin/reports/page.tsx>); cài đặt [`settings/page.tsx`](<../src/app/(admin)/admin/settings/page.tsx>). Layout bảo vệ quyền tại [`admin/layout.tsx`](<../src/app/(admin)/admin/layout.tsx>); trạng thái loading/error tại [`loading.tsx`](<../src/app/(admin)/admin/loading.tsx>) và [`error.tsx`](<../src/app/(admin)/admin/error.tsx>).

## 12. Chức năng phù hợp cho các sơ đồ

| Sơ đồ | Phạm vi nên vẽ dựa trên code | Source xác thực / lưu ý |
|---|---|---|
| **Use Case** | 4 actor chính và UC01–UC19; nhà cung cấp AI/UploadThing/SMTP là hệ ngoài | §2, §9; các use case `PARTIAL/UI ONLY` phải ký hiệu đúng mức triển khai. |
| **Activity** | Đặt lịch (xác thực/chống trùng); tiếp nhận và phân khoang; sửa → kiểm định → bàn giao; xuất hóa đơn → thu tiền; khôi phục phiếu | [`appointment-booking.ts`](../src/server/services/appointment-booking.ts), [`repair-intake/route.ts`](../src/app/api/admin/repair-intake/route.ts), [`resource-service.ts`](../src/server/services/resource-service.ts), [`invoice/route.ts`](../src/app/api/admin/repair-orders/[id]/invoice/route.ts). |
| **Sequence** | UI → API → auth → service → Prisma cho đặt lịch, intake, KTV báo DONE, xuất hóa đơn/ghi thanh toán, chat provider | [`CustomerRecords.tsx`](../src/components/customer/CustomerRecords.tsx), [`EmployeeBayList.tsx`](../src/components/employee/EmployeeBayList.tsx), [`chat/route.ts`](../src/app/api/assistant/chat/route.ts). |
| **Class** | Domain entities/DTO: Customer–Vehicle–Appointment–RepairOrder–Line/Task/Evidence–Invoice–Payment; UserAccount/Session/Employee; service layer tách khỏi model | [`schema.prisma`](../prisma/schema.prisma), [`resource-service.ts`](../src/server/services/resource-service.ts). Không vẽ `MembershipTier` hoặc `WorkshopBay` thành FK không có. |
| **ERD** | Toàn bộ 22 model, cardinality và optional FK; đánh dấu `Customer.tier` và `RepairOrder.bayCode` là chuỗi không FK | [`schema.prisma`](../prisma/schema.prisma). |
| **State Diagram** | `AppointmentStatus`, `RepairStatus`, `InvoiceStatus`, `PaymentStatus`; bay statusText như state ứng dụng | [`schema.prisma`](../prisma/schema.prisma), [`resource-service.ts`](../src/server/services/resource-service.ts), [`employee/bays/[id]/route.ts`](../src/app/api/employee/bays/[id]/route.ts). Chỉ vẽ **cạnh chuyển** khi code có thao tác tương ứng; enum chứa nhiều giá trị chưa có đường chuyển. |

### Rà soát bỏ sót lần cuối

Đối chiếu lại danh sách route `src/app/api`, `src/app/(admin)`, `src/app/(customer)`, `src/app/employee`, các service, 22 model Prisma, cấu hình resource, `mock-data.ts` và component chưa được import. Những điểm dễ nhầm đã được ghi rõ: `/admin/payments` chỉ redirect đến hóa đơn; báo cáo xuất qua generic route; khách không duyệt báo giá hoặc thanh toán online; `RepairTask` có model/hiển thị nhưng không có route riêng; email/ảnh/chat phụ thuộc dịch vụ ngoài; minh họa 3D không chẩn đoán thật; trạng thái trong enum không đồng nghĩa luồng chuyển trạng thái đã tồn tại. Nguồn kiểm tra: [`payments/page.tsx`](<../src/app/(admin)/admin/payments/page.tsx>), [`reports/page.tsx`](<../src/app/(admin)/admin/reports/page.tsx>), [`schema.prisma`](../prisma/schema.prisma), [`mock-data.ts`](../src/lib/mock-data.ts), [`resource-config.ts`](../src/lib/resource-config.ts).
