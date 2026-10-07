'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, Bell, LogOut, User, Plus, Sparkles } from 'lucide-react';

export default function Header({
  userName = 'Thành viên',
  userEmail = '',
}: {
  userName?: string;
  userEmail?: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-6 shadow-sm">
      {/* Global Search Bar */}
      <div className="relative w-96 max-w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm công việc, tài liệu, chi tiêu... (Ctrl + K)"
          className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:outline-none transition"
        />
      </div>

      {/* Action Buttons & User Menu */}
      <div className="flex items-center gap-3">
        {/* Quick Add Task */}
        <LinkButton href="/dashboard/tasks?action=new" label="Tạo việc mới" />

        {/* Notifications */}
        <button
          title="Thông báo"
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white"></span>
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{userName}</p>
            <p className="text-[10px] text-slate-500 leading-none mt-1 truncate max-w-[120px]">
              {userEmail}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}
