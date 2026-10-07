'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FinanceItem, Scope } from '@/types/database';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Loader2,
  X,
  Users,
  Lock,
} from 'lucide-react';

const CATEGORIES = [
  'Ăn uống & Chợ',
  'Điện, Nước & Internet',
  'Học phí & Con cái',
  'Nhà cửa & Sửa chữa',
  'Xăng xe & Đi lại',
  'Mua sắm gia đình',
  'Y tế & Sức khỏe',
  'Tiết kiệm & Đầu tư',
  'Lương & Thưởng',
  'Thu nhập khác',
];

export default function FinancePage() {
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(null);

  // Form states
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [scope, setScope] = useState<Scope>('family');
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: member } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single();

    if (member) {
      setFamilyId(member.family_id);
      const { data: list } = await supabase
        .from('finances')
        .select('*')
        .eq('family_id', member.family_id)
        .order('date', { ascending: false });

      if (list) setFinances(list as FinanceItem[]);
    }
    setLoading(false);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId || !amount) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('finances')
      .insert({
        family_id: familyId,
        type,
        category,
        amount: parseFloat(amount),
        date,
        note: note.trim() || null,
        scope,
        created_by: user?.id,
      })
      .select()
      .single();

    if (!error && data) {
      setFinances([data as FinanceItem, ...finances]);
      setIsModalOpen(false);
      setAmount('');
      setNote('');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setFinances(finances.filter((f) => f.id !== id));
    await supabase.from('finances').delete().eq('id', id);
  };

  const totalIncome = finances
    .filter((f) => f.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = finances
    .filter((f) => f.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance+ (Sổ Thu Chi & Ngân Sách)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận và minh bạch các khoản chi tiêu gia đình và quỹ cá nhân
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Ghi giao dịch mới
        </button>
      </div>

      {/* 3 Thẻ Tóm Tắt Dòng Tiền */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Thu Vào</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              +{totalIncome.toLocaleString('vi-VN')} đ
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Đã Chi</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              -{totalExpense.toLocaleString('vi-VN')} đ
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số Dư Tích Lũy</p>
            <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
              {balance.toLocaleString('vi-VN')} đ
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Giao Dịch */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Lịch sử thu chi gần đây</h2>
          <span className="text-xs text-slate-400 font-semibold">{finances.length} khoản</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Ngày</th>
                  <th className="py-3 px-5">Danh mục</th>
                  <th className="py-3 px-5">Ghi chú</th>
                  <th className="py-3 px-5">Phạm vi</th>
                  <th className="py-3 px-5 text-right">Số tiền</th>
                  <th className="py-3 px-5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {finances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-5 text-xs text-slate-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-500 max-w-xs truncate">
                      {item.note || '—'}
                    </td>
                    <td className="py-3.5 px-5 text-xs">
                      <span className="inline-flex items-center gap-1">
                        {item.scope === 'family' ? (
                          <>
                            <Users className="w-3 h-3 text-blue-500" /> Cả nhà
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-slate-400" /> Cá nhân
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold whitespace-nowrap">
                      <span
                        className={
                          item.type === 'expense' ? 'text-red-600' : 'text-emerald-600'
                        }
                      >
                        {item.type === 'expense' ? '-' : '+'}
                        {Number(item.amount).toLocaleString('vi-VN')} đ
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-300 hover:text-red-600 transition p-1"
                        title="Xóa bản ghi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {finances.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                      Chưa có ghi chép thu chi nào. Bấm "Ghi giao dịch mới" để bắt đầu!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Ghi Thu Chi Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Ghi nhận giao dịch mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    type === 'expense'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tiền Ra (Chi phí)
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    type === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tiền Vào (Thu nhập)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Số tiền (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ví dụ: 150000"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày ghi nhận</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phạm vi</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as Scope)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="family">🏠 Quỹ gia đình</option>
                    <option value="private">🔒 Ví cá nhân</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Chi tiết món đồ hoặc địa điểm..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
