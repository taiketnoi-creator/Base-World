# 🚀 HƯỚNG DẪN TRIỂN KHAI WEB APP MIỄN PHÍ (100% FREE TIER)
## BASE WORLD - FAMILY & PERSONAL WORK OS

Tài liệu này hướng dẫn bạn từng bước kết nối **GitHub + Supabase + Vercel** để đưa ứng dụng **Base World** lên mạng Internet hoàn toàn miễn phí, có tên miền riêng hoặc tên miền con của Vercel (`.vercel.app`) để tất cả các thành viên trong gia đình dùng trên cả máy tính và điện thoại.

---

### BƯỚC 1: KHỞI TẠO BACKEND TRÊN SUPABASE (MIỄN PHÍ)

1. Truy cập [https://supabase.com](https://supabase.com) và bấm **Start your project** (Đăng nhập bằng tài khoản GitHub).
2. Tạo một Project mới:
   - **Name:** `base-world`
   - **Database Password:** Đặt mật khẩu an toàn và lưu lại.
   - **Region:** Chọn `Singapore` (để có tốc độ truy cập nhanh nhất tại Việt Nam).
3. Sau khi Project tạo xong (khoảng 1 phút):
   - Vào menu bên trái chọn **SQL Editor** ➔ bấm **New Query**.
   - Mở file `DATABASE_SCHEMA.sql` trong thư mục dự án này, copy toàn bộ nội dung và paste vào SQL Editor.
   - Bấm **Run** để tự động tạo tất cả các bảng, hàm tự động tạo Profile và phân quyền bảo mật RLS!
4. Lấy thông tin kết nối API:
   - Vào **Project Settings** (biểu tượng bánh răng ở góc trái dưới) ➔ chọn **API**.
   - Copy 2 giá trị:
     - `Project URL` (Dạng: `https://xxxxxxxxxxxx.supabase.co`)
     - `anon public key` (Dãy ký tự dài bắt đầu bằng `eyJ...`)

---

### BƯỚC 2: CẤU HÌNH BIẾN MÔI TRƯỜNG DỰ ÁN

Trong thư mục `d:\Phiên bản Ai agent\Base World`:
1. Tạo một file tên là `.env.local` (nhân bản từ `.env.example`).
2. Điền thông tin lấy được ở Bước 1 vào:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### BƯỚC 3: ĐẨY CODE LÊN GITHUB REPOSITORY

1. Truy cập [https://github.com](https://github.com) ➔ Bấm **New Repository**.
   - Đặt tên Repository: `base-world`.
   - Chọn chế độ **Private** (để giữ kín code cá nhân/gia đình).
   - Bấm **Create repository**.
2. Mở terminal tại thư mục `d:\Phiên bản Ai agent\Base World` và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "feat: initial Base World family work os"
   git branch -M main
   git remote add origin https://github.com/TÊN_GITHUB_CỦA_BẠN/base-world.git
   git push -u origin main
   ```

---

### BƯỚC 4: TRIỂN KHAI LÊN VERCEL (MIỄN PHÍ & TỰ ĐỘNG CẬP NHẬT)

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub của bạn.
2. Bấm **Add New...** ➔ Chọn **Project**.
3. Tìm và chọn repository `base-world` vừa đẩy lên GitHub ➔ Bấm **Import**.
4. Ở phần **Environment Variables**, thêm 2 biến môi trường:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Dán URL Supabase của bạn)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Dán anon key của bạn)
5. Bấm **Deploy**.
6. Sau khoảng 1-2 phút, Vercel sẽ cấp cho bạn một đường link Web App chính thức (Ví dụ: `https://base-world-family.vercel.app`).

---

### BƯỚC 5: HƯỚNG DẪN CÁC THÀNH VIÊN TRONG GIA ĐÌNH SỬ DỤNG

1. **Chủ hộ (Admin):**
   - Truy cập vào link web app vừa tạo trên Vercel.
   - Bấm **Bắt đầu miễn phí** hoặc **Đăng ký**.
   - Điền Tên của bạn (VD: Bố/Mẹ/Anh/Chị), Tên gia đình và Mật khẩu.
   - Hệ thống sẽ tự động khởi tạo Không gian Gia đình và cấp quyền Admin.
2. **Các thành viên khác (Vợ/Chồng, Con cái):**
   - Truy cập vào web app trên điện thoại hoặc máy tính.
   - Đăng ký tài khoản cá nhân.
   - Chủ nhà chỉ cần mời thành viên vào gia đình qua email hoặc mã mời.
3. **Cài đặt như App điện thoại (PWA / Add to Home Screen):**
   - Mở link web trên Safari (iPhone) hoặc Chrome (Android).
   - Bấm nút chia sẻ ➔ chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
   - Ứng dụng sẽ xuất hiện trên màn hình điện thoại như một App cài đặt sẵn!
