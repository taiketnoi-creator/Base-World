'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  GitFork,
  Send,
  Target,
  BookOpen,
  Wallet,
  Settings,
  Users,
  Home,
  PlusCircle,
} from 'lucide-react';

const navigation = [
  { name: 'Tổng quan (Dashboard)', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Công việc (Work+)', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Quy trình (Flow+)', href: '/dashboard/workflows', icon: GitFork },
  { name: 'Đề xuất & Mua sắm (Capture+)', href: '/dashboard/requests', icon: Send },
  { name: 'Mục tiêu (Goal+)', href: '/dashboard/goals', icon: Target },
  { name: 'Kho tri thức (Wiki+)', href: '/dashboard/wiki', icon: BookOpen },
  { name: 'Thu Chi (Finance+)', href: '/dashboard/finance', icon: Wallet },
];

export default function Sidebar({ familyName = 'Gia đình' }: { familyName?: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
          <Home className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">Base World</h2>
          <span className="text-[11px] font-medium text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800/50">
            Family Work OS
          </span>
        </div>
      </div>

      {/* Family Info */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Không gian hiện tại</span>
          <Users className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-slate-200 truncate">{familyName}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quick invite */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Thành viên gia đình
          </p>
          <p className="text-[11px] text-slate-400 mb-2">Mời người thân cùng theo dõi việc nhà & chi tiêu.</p>
          <button className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 font-medium text-[11px] border border-blue-500/30 transition">
            + Sao chép mã mời
          </button>
        </div>
      </div>
    </aside>
  );
}
