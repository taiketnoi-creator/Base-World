import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, ArrowRight, CheckCircle2, Shield, Zap, Users } from 'lucide-react';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Base World</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition shadow-md shadow-blue-600/30"
          >
            Bắt đầu miễn phí
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8">
          <Zap className="w-3.5 h-3.5" /> Lấy cảm hứng từ Base.vn • Thiết kế cho Gia đình & Cá nhân
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
          Hệ điều hành Quản trị Cuộc sống & <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Gia đình Thông minh
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Đồng bộ công việc, tự động hóa quy trình lặp lại, theo dõi dòng tiền thu chi và cất giữ cẩm nang tri thức gia đình trên một nền tảng duy nhất.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Khởi tạo Không gian Gia đình <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
          >
            Thành viên Đăng nhập
          </Link>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-24 text-left">
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-blue-500/40 transition">
            <CheckCircle2 className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-bold text-base text-white">Work+ (Việc nhà)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bảng Kanban & Checklist phân chia việc nhà, việc cá nhân rõ ràng theo hạn chót.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-blue-500/40 transition">
            <Users className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="font-bold text-base text-white">Capture+ (Mua sắm)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Mẫu đề xuất mua đồ, báo sửa chữa vật dụng nhanh chóng, tiện lợi giữa vợ chồng.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-blue-500/40 transition">
            <Zap className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="font-bold text-base text-white">Finance+ (Thu Chi)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Quản lý chi tiêu, hạn mức ngân sách tháng và theo dõi dòng tiền không áp lực.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-blue-500/40 transition">
            <Shield className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-bold text-base text-white">Bảo mật Tuyệt đối</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Hỗ trợ phân quyền việc riêng tư (Private) và việc chung cả nhà (Family Shared).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
