# 📜 LỊCH SỬ PHÁT TRIỂN DỰ ÁN (PROJECT CHANGELOG)

Dự án: **Base World - Family & Personal Operating System**  
Mục đích: Theo dõi tiến độ, quyết định kiến trúc và các thay đổi trong từng giai đoạn phát triển.

---

## 📅 [2026-10-07] - Khởi tạo Dự án & Hoàn thiện Đặc tả Kỹ thuật

### 🎯 Quyết định Thiết kế & Phạm vi (Scope Decisions)
- **Định hình sản phẩm:** Chuyển đổi mô hình Enterprise ERP của Base.vn thành phiên bản **Family & Personal Work OS**.
- **Loại bỏ các tính năng doanh nghiệp cồng kềnh:**
  - ❌ `R3.4`: Chữ ký số pháp lý (Token/CA).
  - ❌ `G4.6`: Đánh giá hiệu suất 360 độ doanh nghiệp.
  - ❌ `F6.4`: Quy trình duyệt chi / Tạm ứng phòng kế toán nhiều cấp.
  - ❌ `C7.6`: Sơ đồ cây tổ chức ma trận phòng ban (Org Tree & Matrix Roles).
- **Giữ lại & Tối ưu cho Hộ gia đình / Cá nhân:**
  - ✅ **Work+:** Quản lý việc nhà, dự án cá nhân (Kanban, List, Calendar, Subtasks, Checklist, Tags, Due dates).
  - ✅ **Flow+:** Quy trình việc lặp lại (Pipelines, SOP tuần tự, ràng buộc chuyển bước).
  - ✅ **Capture+:** Đề xuất & ghi nhận nhanh (Danh sách mua sắm, báo hỏng đồ, ghi chú ý tưởng).
  - ✅ **Goal+:** Mục tiêu cá nhân & gia đình (OKRs, Key Results, % tiến độ tự động, check-in tuần).
  - ✅ **Wiki+:** Kho tài liệu cẩm nang gia đình (Ghi chú dạng cây, sổ tay, bảo hiểm, công thức).
  - ✅ **Finance+:** Thu chi & Ngân sách gia đình (Hạn mức, phân loại cá nhân vs quỹ chung, biểu đồ).
  - ✅ **Central Hub:** Dashboard tổng quan việc hôm nay & Tìm kiếm nhanh Cmd+K.

### 🛠️ Lựa chọn Hạ tầng Kỹ thuật (100% Miễn phí)
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Row Level Security RLS).
- **Source Code:** GitHub Repository.
- **Frontend & API:** Next.js (App Router, TypeScript, Tailwind CSS, Lucide Icons).
- **Deployment:** Vercel (Hobby Free Plan) + Render (Backup).

### 📁 Tài liệu & Cấu trúc đã tạo
1. `PROJECT_OVERVIEW.md`: Tài liệu tổng quan kiến trúc, luồng phân quyền và kế hoạch triển khai.
2. `PROJECT_CHANGELOG.md`: File lịch sử dự án này.
3. `DATABASE_SCHEMA.sql`: Kịch bản thiết kế cơ sở dữ liệu PostgreSQL cho Supabase với RLS.
4. Bộ mã nguồn khởi tạo Web App (Next.js App Router + Supabase Client).

---

## 📌 KẾ HOẠCH BƯỚC TIẾP THEO
- [ ] Chạy SQL Schema trên Supabase để tạo bảng và phân quyền RLS.
- [ ] Khởi tạo khung giao diện Next.js với Supabase Auth (Đăng ký, Đăng nhập, Mời thành viên gia đình).
- [ ] Xây dựng phân hệ Work+ (Kanban Board) và Finance+ (Thu chi).
- [ ] Kết nối GitHub repo và deploy lên Vercel.
