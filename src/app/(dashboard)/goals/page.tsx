'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Goal, Scope } from '@/types/database';
import { Target, Plus, CheckCircle2, TrendingUp, X, Loader2, Trash2 } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState<Goal['period']>('quarter');
  const [progress, setProgress] = useState(0);
  const [scope, setScope] = useState<Scope>('family');
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
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
        .from('goals')
        .select('*')
        .eq('family_id', member.family_id)
        .order('created_at', { ascending: false });

      if (list) setGoals(list as Goal[]);
    }
    setLoading(false);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId || !title.trim()) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('goals')
      .insert({
        family_id: familyId,
        title: title.trim(),
        description: description.trim() || null,
        period,
        progress,
        scope,
        created_by: user?.id,
      })
      .select()
      .single();

    if (!error && data) {
      setGoals([data as Goal, ...goals]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setProgress(0);
    }
    setSubmitting(false);
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    const val = Math.min(100, Math.max(0, newProgress));
    setGoals(goals.map((g) => (g.id === goalId ? { ...g, progress: val } : g)));
    await supabase.from('goals').update({ progress: val }).eq('id', goalId);
  };

  const handleDelete = async (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
    await supabase.from('goals').delete().eq('id', id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Goal+ (Quản trị Mục tiêu & OKRs)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập mục tiêu dài hạn, theo dõi tiến độ hoàn thành cho cá nhân và gia đình
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thiết lập mục tiêu mới
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Chu kỳ {goal.period}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{goal.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-slate-300 hover:text-red-500 transition"
                  title="Xóa mục tiêu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {goal.description && (
                <p className="text-xs text-slate-500 leading-relaxed">{goal.description}</p>
              )}

              {/* Progress bar and control */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Tiến độ thực hiện:</span>
                  <span className="text-indigo-600">{goal.progress}%</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>

                {/* Quick update buttons */}
                <div className="flex items-center justify-end gap-1.5 pt-1 text-[11px]">
                  <button
                    onClick={() => handleUpdateProgress(goal.id, goal.progress - 10)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                    className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold"
                  >
                    +10%
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(goal.id, 100)}
                    className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold"
                  >
                    Đã đạt 100%
                  </button>
                </div>
              </div>
            </div>
          ))}

          {goals.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              Chưa có mục tiêu nào. Hãy đặt ra mục tiêu cho quý hoặc năm này!
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Thiết lập mục tiêu mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mục tiêu lớn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Tiết kiệm 100 triệu, Đọc 15 cuốn sách..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả / Động lực</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Lý do và kế hoạch hành động..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Chu kỳ thời gian</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="month">Tháng</option>
                    <option value="quarter">Quý (3 tháng)</option>
                    <option value="year">Cả Năm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tiến độ khởi đầu (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
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
                  Lưu mục tiêu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
