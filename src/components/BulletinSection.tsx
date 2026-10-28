import React, { useState } from 'react';
import { AnnouncementItem } from '../types';
import { Calendar, Clock, MapPin, ShieldAlert, CheckSquare, PlusCircle, Pin, Sparkles, Trash2 } from 'lucide-react';

interface BulletinSectionProps {
  announcements: AnnouncementItem[];
  isAdmin: boolean;
  onOpenNewAnnouncementModal: () => void;
  onOpenAiToolkit: () => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const BulletinSection: React.FC<BulletinSectionProps> = ({
  announcements,
  isAdmin,
  onOpenNewAnnouncementModal,
  onOpenAiToolkit,
  onDeleteAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'announcement'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredItems = announcements.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <section id="bulletin" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-800 uppercase mb-2">
              <span>Cập Nhật Thông Tin Trực Tiếp</span>
              <span aria-hidden="true">·</span>
              <span>Ban Tổ Chức Chiến Dịch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Bảng Tin & Lịch Trình Ra Quân Cụ Thể
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              Nơi cập nhật thời gian, địa điểm tập kết tại cổng trường và các phân công công việc chi tiết cho từng đợt dọn rác.
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenAiToolkit}
                className="px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Soạn Thông Báo</span>
              </button>

              <button
                onClick={onOpenNewAnnouncementModal}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>+ Cập Nhật Thông Báo / Lịch Trình Mới</span>
              </button>
            </div>
          )}
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg w-fit mb-8 shadow-2xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lịch Trình Chi Tiết
          </button>
          <button
            onClick={() => setActiveTab('announcement')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'announcement'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thông Báo Đoàn Trường
          </button>
        </div>

        {/* Content Cards or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-12 px-6 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl max-w-xl mx-auto">
            <p className="text-sm text-slate-500 font-medium">Chưa có thông báo nào trong danh sách.</p>
            {isAdmin && (
              <button
                onClick={onOpenNewAnnouncementModal}
                className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                + Cập nhật thông báo mới ngay
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((item) => (
            <article
              key={item.id}
              className={`bg-white rounded-2xl border p-6 sm:p-8 transition-all shadow-xs ${
                item.pinned
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Pin className="w-3.5 h-3.5" />
                      Ghim quan trọng
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-medium">
                    {item.author}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    Ngày đăng: {item.createdAt}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/70 px-2.5 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  {item.time && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.time}</span>
                    </div>
                  )}

                  {/* Admin Delete Action with Inline Confirmation */}
                  {isAdmin && onDeleteAnnouncement && (
                    <div className="ml-auto">
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-lg">
                          <span className="text-[11px] font-medium text-rose-800">Xóa thông báo này?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteAnnouncement(item.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          title="Xóa thông báo này"
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Location & Target Area details */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Điểm tập kết tại trường:</span>
                    <span className="text-slate-600">{item.gatheringLocation}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Khu vực phân công dọn rác:</span>
                    <span className="text-slate-600">{item.targetArea}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Schedule Timeline if available */}
              {item.scheduleTimeline && item.scheduleTimeline.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Lịch trình triển khai chi tiết từng khung giờ:
                  </h4>
                  <div className="relative border-l-2 border-emerald-200 ml-3 pl-5 space-y-4">
                    {item.scheduleTimeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                          <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                            {step.time}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800">
                            {step.activity}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Phụ trách: {step.leader}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment and Safety Reminders */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                {item.equipmentPrepared && item.equipmentPrepared.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-800 block mb-1.5">
                      Trang thiết bị Ban Tổ Chức cấp phát:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {item.equipmentPrepared.map((eq, i) => (
                        <li key={i}>{eq}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.reminders && item.reminders.length > 0 && (
                  <div>
                    <span className="font-bold text-amber-800 block mb-1.5 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      Lưu ý an toàn quan trọng:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {item.reminders.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};
