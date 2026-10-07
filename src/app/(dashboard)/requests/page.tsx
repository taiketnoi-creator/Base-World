'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RequestItem, Scope } from '@/types/database';
import { Send, Plus, CheckCircle2, ShoppingCart, Wrench, Lightbulb, HelpCircle, X, Loader2, Trash2 } from 'lucide-react';

const CATEGORIES: { id: RequestItem['category']; label: string; icon: any; color: string }[] = [
  { id: 'shopping', label: 'Cần mua sắm', icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
  { id: 'repair', label: 'Báo hỏng / Sửa chữa', icon: Wrench, color: 'text-amber-600 bg-amber-50' },
  { id: 'idea', label: 'Ý tưởng gia đình', icon: Lightbulb, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'other', label: 'Khác', icon: HelpCircle, color: 'text-slate-600 bg-slate-50' },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RequestItem['category']>('shopping');
  const [content, setContent] = useState('');
  const [scope, setScope] = useState<Scope>('family');
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
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
        .from('requests')
        .select('*')
        .eq('family_id', member.family_id)
        .order('created_at', { ascending: false });

      if (list) setRequests(list as RequestItem[]);
    }
    setLoading(false);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId || !title.trim()) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('requests')
      .insert({
        family_id: familyId,
        title: title.trim(),
        category,
        content: content.trim() || null,
        scope,
        status: 'pending',
        created_by: user?.id,
      })
      .select()
      .single();

    if (!error && data) {
      setRequests([data as RequestItem, ...requests]);
      setIsModalOpen(false);
      setTitle('');
      setContent('');
    }
    setSubmitting(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: nextStatus as any } : r)));
    await supabase.from('requests').update({ status: nextStatus }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    await supabase.from('requests').delete().eq('id', id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Capture+ (Đề Xuất & Danh Sách Mua Sắm)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận nhanh đồ cần mua, báo hỏng thiết bị và ý tưởng để cả nhà cùng theo dõi
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tạo đề xuất mới
        </button>
      </div>

      {/* Grid of Requests */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((item) => {
            const cat = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[3];
            const Icon = cat.icon;
            const isDone = item.status === 'completed';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition flex flex-col justify-between ${
                  isDone ? 'opacity-60 bg-slate-50' : 'hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${cat.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </span>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-300 hover:text-red-500 transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className={`text-base font-bold text-slate-900 leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
                    {item.title}
                  </h3>

                  {item.content && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {item.content}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.scope === 'family' ? '🏠 Cả nhà' : '🔒 Cá nhân'}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isDone ? 'Đã xong' : 'Đánh dấu đã mua / xong'}
                  </button>
                </div>
              </div>
            );
          })}

          {requests.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              Chưa có đề xuất hay món đồ nào cần mua. Nhấn "Tạo đề xuất mới" để ghi lại!
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Tạo đề xuất / Ghi chú mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tiêu đề món đồ / vấn đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Mua nước giặt OMO, Thay bóng đèn ban công..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phân loại</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Chi tiết / Link mua</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Số lượng, loại hàng hoặc link Shopee/Tiki..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                ></textarea>
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
                  Lưu đề xuất
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
