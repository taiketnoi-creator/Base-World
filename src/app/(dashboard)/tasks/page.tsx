'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Task, TaskStatus, Priority, Scope } from '@/types/database';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Calendar,
  Lock,
  Users,
  X,
  Loader2,
  Trash2,
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'Cần làm (To-Do)', color: 'bg-slate-100 text-slate-700' },
  { id: 'in_progress', label: 'Đang làm (In Progress)', color: 'bg-blue-50 text-blue-700' },
  { id: 'done', label: 'Đã hoàn thành (Done)', color: 'bg-emerald-50 text-emerald-700' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(null);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [scope, setScope] = useState<Scope>('family');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchFamilyAndTasks();
  }, []);

  const fetchFamilyAndTasks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Lấy family_id
    const { data: member } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single();

    if (member) {
      setFamilyId(member.family_id);
      const { data: taskList } = await supabase
        .from('tasks')
        .select('*')
        .eq('family_id', member.family_id)
        .order('created_at', { ascending: false });

      if (taskList) setTasks(taskList as Task[]);
    }
    setLoading(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId || !title.trim()) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        family_id: familyId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        scope,
        due_date: dueDate || null,
        status: 'todo',
        created_by: user?.id,
      })
      .select()
      .single();

    if (!error && data) {
      setTasks([data as Task, ...tasks]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
    }
    setSubmitting(false);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updated);

    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    await supabase.from('tasks').delete().eq('id', taskId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Work+ (Quản lý Công việc)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Bảng Kanban theo dõi việc nhà, dự án cá nhân và kế hoạch của gia đình
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm công việc mới
        </button>
      </div>

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
                {/* Column Title */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks List in Column */}
                <div className="space-y-3 min-h-[450px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-800 leading-snug">
                          {task.title}
                        </h3>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition"
                          title="Xóa việc"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded ${
                            task.priority === 'urgent'
                              ? 'bg-red-50 text-red-600'
                              : task.priority === 'high'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority === 'urgent'
                            ? 'Khẩn'
                            : task.priority === 'high'
                            ? 'Cao'
                            : 'Vừa'}
                        </span>

                        <span className="text-slate-400 flex items-center gap-1">
                          {task.scope === 'family' ? (
                            <>
                              <Users className="w-3 h-3 text-blue-500" /> Cả nhà
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-slate-500" /> Cá nhân
                            </>
                          )}
                        </span>

                        {task.due_date && (
                          <span className="text-slate-400 flex items-center gap-1 ml-auto">
                            <Calendar className="w-3 h-3" /> {task.due_date}
                          </span>
                        )}
                      </div>

                      {/* Quick Move Buttons */}
                      <div className="flex items-center gap-1 pt-1">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'todo')}
                            className="text-[10px] text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded transition"
                          >
                            ← Về Cần làm
                          </button>
                        )}
                        {col.id !== 'in_progress' && (
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                            className="text-[10px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition"
                          >
                            Đang làm
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'done')}
                            className="text-[10px] text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition"
                          >
                            ✓ Hoàn thành
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                      Chưa có việc nào
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Thêm Task Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Tạo công việc mới (Work+)</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tên công việc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Đóng tiền điện nước tháng 10, Đưa con đi tiêm"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mô tả chi tiết / Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ghi chú thêm thông tin hoặc link tài liệu..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Phạm vi hiển thị
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as Scope)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="family">🏠 Chung cả nhà</option>
                    <option value="private">🔒 Việc riêng tư</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Hạn chót (Deadline)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
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
                  Lưu công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
