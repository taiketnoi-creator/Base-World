'use client';

import { useState } from 'react';
import { BookOpen, Plus, FileText, Folder, Search, ChevronRight, Hash } from 'lucide-react';

const SAMPLE_WIKI = [
  {
    category: 'Sổ tay Gia đình & Khẩn cấp',
    pages: [
      { id: '1', title: 'Danh bạ khẩn cấp & Thông tin Bác sĩ / Bệnh viện', updated: '2 ngày trước' },
      { id: '2', title: 'Thông tin hợp đồng bảo hiểm nhân thọ & thẻ y tế', updated: '1 tuần trước' },
      { id: '3', title: 'Mật khẩu Wifi, vị trí cầu dao điện & van khóa nước', updated: '1 tháng trước' },
    ],
  },
  {
    category: 'Cẩm nang Đời sống & Nhà cửa',
    pages: [
      { id: '4', title: 'Hướng dẫn vận hành & bảo dưỡng máy lọc nước', updated: '3 tuần trước' },
      { id: '5', title: 'Công thức nấu ăn yêu thích của cả nhà', updated: 'Hôm qua' },
      { id: '6', title: 'Lịch tiêm phòng & chiều cao cân nặng của các con', updated: '5 ngày trước' },
    ],
  },
];

export default function WikiPage() {
  const [selectedPage, setSelectedPage] = useState(SAMPLE_WIKI[0].pages[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Wiki+ (Kho Tri Thức & Cẩm Nang Nhà)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Lưu giữ tài liệu quan trọng, sổ tay thiết bị và ghi chú học tập cho cả gia đình
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Tạo trang tài liệu mới
        </button>
      </div>

      {/* 2 Column Layout: Category / Pages on left, Content preview on right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left: Folders & Articles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tài liệu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-4">
            {SAMPLE_WIKI.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                  <Folder className="w-3.5 h-3.5 text-blue-500" /> {group.category}
                </p>
                <div className="space-y-1">
                  {group.pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        selectedPage.id === page.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {page.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Document Viewer / Editor */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm min-h-[500px]">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <span className="text-xs text-slate-400 font-medium">Cập nhật: {selectedPage.updated}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedPage.title}</h2>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-4 leading-relaxed">
            <p>
              Đây là trang tài liệu quan trọng được chia sẻ cho tất cả các thành viên trong gia đình. Mọi người có thể tra cứu nhanh khi cần thiết.
            </p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              💡 Lưu ý: Thông tin này được đồng bộ bảo mật trong Không gian Gia đình trên Base World.
            </div>
            <h3 className="text-base font-bold text-slate-900 pt-2">Thông tin liên hệ khẩn cấp:</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Cứu hỏa: 114</li>
              <li>Cấp cứu y tế: 115</li>
              <li>Cảnh sát: 113</li>
              <li>Bác sĩ gia đình: Bác sĩ Nguyễn Văn X (090xxxxxxx)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
