'use client';

import { useState } from 'react';
import { GitFork, Plus, CheckCircle2, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';

const SAMPLE_WORKFLOWS = [
  {
    id: '1',
    name: 'Quy trình Tổng vệ sinh & Bảo dưỡng nhà cửa cuối tuần',
    description: 'Quy trình lặp lại mỗi sáng thứ 7 để cả nhà cùng dọn dẹp và bảo dưỡng thiết bị',
    stages: ['1. Kiểm tra thiết bị điện nước', '2. Phân loại đồ đạc & Giặt giũ', '3. Hút bụi & Lau dọn', '4. Đổ rác & Nghiệm thu'],
    status: 'Đang hoạt động',
  },
  {
    id: '2',
    name: 'Quy trình Kế hoạch Đi du lịch gia đình',
    description: 'Từng bước chuẩn bị từ lúc lên ý tưởng đến khi khởi hành',
    stages: ['1. Chọn địa điểm & Dự toán ngân sách', '2. Đặt vé máy bay / Khách sạn', '3. Lên lịch trình chi tiết', '4. Chuẩn bị hành lý'],
    status: 'Đang hoạt động',
  },
  {
    id: '3',
    name: 'Quy trình Đóng học phí & Hóa đơn định kỳ',
    description: 'Quy trình thực hiện vào ngày 20 - 25 hàng tháng',
    stages: ['1. Kiểm tra hóa đơn điện/nước/mạng', '2. Chuyển khoản thanh toán', '3. Lưu biên lai vào Finance+'],
    status: 'Sắp tới',
  },
];

export default function WorkflowsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Flow+ (Quy trình Sinh hoạt & SOP)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Chuẩn hóa các công việc lặp đi lặp lại thành các bước tuần tự rõ ràng
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Thiết lập quy trình mới
        </button>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 gap-5">
        {SAMPLE_WORKFLOWS.map((wf) => (
          <div
            key={wf.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GitFork className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{wf.name}</h3>
                  <p className="text-xs text-slate-500">{wf.description}</p>
                </div>
              </div>

              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition self-start sm:self-auto shadow-sm">
                <Play className="w-3.5 h-3.5" /> Bắt đầu chạy quy trình
              </button>
            </div>

            {/* Stages Pipeline */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Các giai đoạn tuần tự (Stage Gates)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {wf.stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-slate-700">{stage}</span>
                    {idx < wf.stages.length - 1 && (
                      <ArrowRight className="hidden lg:block w-3.5 h-3.5 text-slate-400 -mr-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
