# 🏠 BASE WORLD - FAMILY & PERSONAL OPERATING SYSTEM

> **Hệ điều hành Quản trị Công việc, Quy trình, Mục tiêu & Tài chính dành cho Cá nhân & Gia đình**  
> *Lấy cảm hứng từ triết lý kiến trúc của Base.vn, tinh gọn & tối ưu cho quy mô Hộ gia đình / Cá nhân.*

---

## 📌 1. TỔNG QUAN DỰ ÁN

* **Tên dự án:** **Base World** (Family Work OS)
* **Mục tiêu:** Xây dựng một Web App toàn diện giúp các thành viên trong gia đình và cá nhân quản lý công việc, quy trình lặp lại, mục tiêu chung/riêng, ngân sách chi tiêu và kho tri thức gia đình trên một nền tảng duy nhất, đồng bộ và tức thì.
* **Mô hình tài nguyên:** **100% Free-tier (Không tốn chi phí hạ tầng)**.

### Tech Stack Miễn Phí Đề Xuất
1. **Source Code & Version Control:** **GitHub** (Private/Public Repository).
2. **Backend & Database:** **Supabase (Free Tier)**
   - Cơ sở dữ liệu: PostgreSQL với Row Level Security (RLS).
   - Xác thực: Supabase Auth (Đăng ký, Đăng nhập Email/Password).
   - Realtime: Cập nhật dữ liệu thời gian thực (realtime task & chat/notification).
   - Storage: Lưu trữ hóa đơn, tài liệu, ảnh gia đình.
3. **Frontend & Hosting:** **Next.js (App Router, TypeScript, Tailwind CSS)** deploy tự động qua **Vercel (Hobby Free)**.
4. **Dự phòng / Worker:** **Render** (Free Web Service / Cron Job nếu cần).

---

## 👥 2. ĐỐI TƯỢNG SỬ DỤNG & CƠ CHẾ PHÂN QUYỀN GIA ĐÌNH

Hệ thống loại bỏ hoàn toàn sơ đồ phòng ban cồng kềnh (Org Tree) của doanh nghiệp, thay bằng **Mô hình Hộ gia đình (Family Group)**:

* **Family Admin (Chủ nhà / Trưởng nhóm):**
  - Tạo gia đình (Family Workspace), quản lý gửi link mời các thành viên tham gia.
  - Quản lý các danh mục ngân sách gia đình, tạo các quy trình mẫu dùng chung.
* **Family Member (Thành viên - Vợ/Chồng, Con cái):**
  - Có không gian cá nhân riêng (**Private Space**) cho công việc, mục tiêu, ghi chú bí mật.
  - Tham gia không gian chung (**Shared Family Space**): Xem việc gia đình, bảng chi tiêu chung, kho tài liệu nhà, danh sách mua sắm.
* **Cơ chế Bảo mật (RLS):**
  - Mọi dữ liệu đều được phân loại: `scope = 'private'` (chỉ người tạo thấy) hoặc `scope = 'family'` (mọi thành viên trong gia đình đều thấy).

---

## 🧩 3. CẤU TRÚC PHÂN HỆ & TÍNH NĂNG CỤ THỂ

Đã loại bỏ các tính năng doanh nghiệp: *Chữ ký số (R3.4)*, *Đánh giá 360 độ (G4.6)*, *Duyệt chi đa cấp (F6.4)*, *Sơ đồ tổ chức ma trận (C7.6)*.

### 3.1. Module Work+ (Công việc & Dự án - Tương đương Base Wework)
- **Kanban Board & List View:** Kéo thả linh hoạt (`Chưa làm` ➔ `Đang làm` ➔ `Đã xong` / `Tạm hoãn`).
- **Calendar & Timeline View:** Theo dõi deadline việc nhà, việc cá nhân theo ngày/tuần/tháng.
- **Task Hierarchy:** Task chính ➔ Sub-tasks ➔ Checklist kiểm tra.
- **Độ ưu tiên & Gắn thẻ:** Khẩn cấp, Cao, Trung bình, Thấp + Tag màu sắc (*Việc nhà, Con cái, Dự án, Tài chính*).
- **Lý do thất bại / Hủy việc (Failed Reason):** Ghi chú lại lý do để rút kinh nghiệm.
- **Tùy biến trường dữ liệu (Custom Fields):** Thêm link, số tiền, ngày hẹn tùy ý.

### 3.2. Module Flow+ (Quy trình chuẩn - Tương đương Base Workflow)
- **Quy trình tuần tự (Pipelines):** Thiết lập các bước chuẩn (SOP gia đình: *Quy trình bảo dưỡng xe, Quy trình thanh toán hóa đơn tháng, Quy trình kế hoạch du lịch*).
- **Stage Gates (Ràng buộc):** Hoàn thành hết việc bước 1 mới được chuyển sang bước 2.
- **Quy trình định kỳ (Recurring Flow):** Tự động tạo quy trình mới định kỳ (mỗi sáng thứ Hai, ngày 25 hàng tháng).

### 3.3. Module Capture+ (Yêu cầu & Đề xuất nhanh - Tương đương Base Request)
- **Mẫu tạo nhanh (Quick Templates):** 
  - Mẫu danh sách mua sắm đồ dùng gia đình (Shopping List).
  - Mẫu ghi nhận sự cố đồ đạc trong nhà hỏng (Home Repair Request).
  - Mẫu ghi nhanh ý tưởng (Idea Capture).
- **Trạng thái xử lý đơn giản:** `Chờ duyệt/Chờ mua` ➔ `Đang xử lý` ➔ `Đã xong`.

### 3.4. Module Goal+ (Mục tiêu Gia đình & Cá nhân - Tương đương Base Goal/OKRs)
- **Mục tiêu (Objectives):** Mục tiêu năm, quý (VD: Tiết kiệm 200 triệu, Du lịch Nhật Bản, Đọc 20 cuốn sách).
- **Kết quả then chốt (Key Results):** Đo lường bằng con số cụ thể hoặc % hoàn thành.
- **Tự động đo tiến độ:** Tự động tính % tiến độ trung bình từ các Key Results.
- **Nhật ký Check-in:** Báo cáo nhanh hàng tuần về tiến độ và khó khăn.

### 3.5. Module Wiki+ (Kho Tri thức & Cẩm nang Gia đình - Tương đương Base Wiki)
- **Cấu trúc thư mục dạng cây (Folder Tree):** Sổ tay gia đình, Hướng dẫn sử dụng thiết bị, Hồ sơ bảo hiểm/sức khỏe, Công thức nấu ăn.
- **Trình soạn thảo Markdown/Rich Text:** Hỗ trợ nhúng ảnh, file PDF, bảng biểu, danh sách.
- **Liên kết chéo:** Dễ dàng liên kết các bài viết với nhau.

### 3.6. Module Finance+ (Thu Chi & Ngân sách - Tương đương Base Expense)
- **Ghi nhận Thu/Chi:** Phân loại rõ chi tiêu cá nhân vs quỹ chung gia đình.
- **Hạn mức Ngân sách (Monthly Budget):** Cảnh báo khi danh mục ăn uống/mua sắm chạm ngưỡng ngân sách tháng.
- **Biểu đồ Dòng tiền trực quan:** Phân tích tỷ trọng chi tiêu và so sánh thu vs chi.

### 3.7. Central Hub (Dashboard & Trợ lý)
- **Dashboard trang chủ:** Hiển thị việc cần làm hôm nay, việc quá hạn, ngân sách còn lại trong tháng, tiến độ mục tiêu tuần.
- **Tìm kiếm toàn cục (Global Search Cmd+K):** Tìm nhanh bất kỳ task, ghi chú, hóa đơn nào.

---

## 🏛️ 4. SƠ ĐỒ KIẾN TRÚC HỆ THỐNG

```
[ Trình duyệt Web (Desktop & Mobile) ]
                  │
                  ▼
      [ Vercel CDN & Hosting ]
      [ Next.js 14 App Router ]
      ├── UI Layer: Tailwind CSS + Lucide Icons + Radix UI
      ├── Server Actions / Route Handlers (API)
      └── Supabase Client / SSR Helper
                  │
                  ▼
         [ Supabase Cloud (Free) ]
      ├── Supabase Auth (Sign-in / Sign-up)
      ├── PostgreSQL Database (Multi-tenant with Family ID)
      ├── Row Level Security (RLS: Private vs Family)
      ├── Supabase Realtime (WebSockets)
      └── Supabase Storage (Files & Receipts)
```

---

## 🚀 5. KẾ HOẠCH TRIỂN KHAI THEO GIAI ĐOẠN

* **Giai đoạn 1:** Khởi tạo kiến trúc DB, Auth & Khung giao diện (Layout, Sidebar, Multi-tenant Family).
* **Giai đoạn 2:** Phân hệ Task & Project (Kanban, List, Filters, Task Details).
* **Giai đoạn 3:** Phân hệ Finance+ (Quản lý Thu/Chi, Hạn mức, Biểu đồ).
* **Giai đoạn 4:** Phân hệ Flow+ (Quy trình gia đình) & Capture+ (Đề xuất nhanh).
* **Giai đoạn 5:** Phân hệ Goal+ (Mục tiêu OKRs) & Wiki+ (Kho tri thức).
* **Giai đoạn 6:** Tích hợp Dashboard tổng quan, Tìm kiếm toàn cục Cmd+K & Triển khai lên GitHub + Vercel.
