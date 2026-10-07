import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  Wallet,
  Target,
  Send,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
  BookOpen,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lấy dữ liệu công việc gần đây
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Lấy dữ liệu thu chi gần đây
  const { data: finances } = await supabase
    .from('finances')
    .select('*')
    .order('date', { ascending: false })
    .limit(5);

  // Lấy mục tiêu
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .limit(3);

  // Lấy đề xuất mua sắm / yêu cầu
  const { data: requests } = await supabase
    .from('requests')
    .select('*')
    .eq('status', 'pending')
    .limit(4);

  // Tính tổng chi tiêu
  const totalExpense = finances
    ?.filter((f) => f.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg shadow-blue-600/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-3">
            ✨ Chào mừng bạn trở lại
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Không gian Quản trị Gia đình & Cá nhân
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Theo dõi mọi đầu việc, dòng tiền chi tiêu, quy trình sinh hoạt và mục tiêu dài hạn trên một nền tảng thống nhất.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/tasks"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-xs hover:bg-blue-50 transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Thêm công việc
          </Link>
          <Link
            href="/dashboard/finance"
            className="px-4 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" /> Ghi chi tiêu
          </Link>
        </div>
      </div>

      {/* 4 Thẻ Thống Kê Tổng Quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Việc đang xử lý</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{tasks?.length || 0}</p>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
              <CheckSquare className="w-3 h-3" /> Cần hoàn thành tuần này
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đề xuất mua sắm</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{requests?.length || 0}</p>
            <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Chờ các thành viên duyệt
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chi tiêu gần đây</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {totalExpense.toLocaleString('vi-VN')} đ
            </p>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Trong tầm kiểm soát
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mục tiêu gia đình</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{goals?.length || 0}</p>
            <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 mt-1">
              <Target className="w-3 h-3" /> Đang theo dõi tiến độ
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái (2/3): Công việc & Yêu cầu mua sắm */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work+ Danh sách việc gần đây */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Công việc ưu tiên (Work+)</h2>
              </div>
              <Link href="/dashboard/tasks" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                Xem bảng Kanban <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {tasks && tasks.length > 0 ? (
                tasks.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === 'done'}
                        readOnly
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className={`text-sm font-medium ${t.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="capitalize">{t.priority}</span>
                          <span>•</span>
                          <span>{t.scope === 'family' ? '🏠 Cả nhà' : '🔒 Cá nhân'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600 capitalize">
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Chưa có công việc nào. Nhấn "Thêm công việc" để tạo mới!
                </div>
              )}
            </div>
          </div>

          {/* Capture+ Danh sách đề xuất mua sắm / yêu cầu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">Cần mua / Đề xuất đồ dùng (Capture+)</h2>
              </div>
              <Link href="/dashboard/requests" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                Tất cả đề xuất <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requests && requests.length > 0 ? (
                requests.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                        {r.category}
                      </span>
                      <span className="text-[11px] text-slate-400">Chờ duyệt</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mt-2">{r.title}</p>
                    {r.content && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{r.content}</p>}
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-6 text-center text-slate-400 text-sm">
                  Không có yêu cầu hay danh sách mua sắm nào đang chờ!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cột Phải (1/3): Mục tiêu & Thu chi */}
        <div className="space-y-6">
          {/* Goal+ Mục tiêu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Mục tiêu (Goal+)</h2>
              </div>
              <Link href="/dashboard/goals" className="text-xs text-blue-600 font-semibold hover:underline">
                Chi tiết
              </Link>
            </div>

            <div className="space-y-4">
              {goals && goals.length > 0 ? (
                goals.map((g) => (
                  <div key={g.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span className="truncate">{g.title}</span>
                      <span className="text-indigo-600">{g.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${g.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-slate-400 text-sm">
                  Chưa thiết lập mục tiêu nào.
                </div>
              )}
            </div>
          </div>

          {/* Finance+ Thu chi gần đây */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Thu Chi Gần Đây (Finance+)</h2>
              </div>
              <Link href="/dashboard/finance" className="text-xs text-blue-600 font-semibold hover:underline">
                Sổ quỹ
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {finances && finances.length > 0 ? (
                finances.map((f) => (
                  <div key={f.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{f.category}</p>
                      <p className="text-[11px] text-slate-400">{f.date}</p>
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        f.type === 'expense' ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {f.type === 'expense' ? '-' : '+'}
                      {Number(f.amount).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-slate-400 text-sm">
                  Chưa có giao dịch thu chi nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
