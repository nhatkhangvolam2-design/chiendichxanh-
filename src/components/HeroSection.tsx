import React from 'react';
import { Users, Calendar, ArrowRight, ShieldCheck, MapPin, Sparkles, Sliders, Leaf } from 'lucide-react';
import { CampaignStats } from '../types';

interface HeroSectionProps {
  participantCount: number;
  stats: CampaignStats;
  isAdmin: boolean;
  onScrollTo: (id: string) => void;
  onOpenParticipants: () => void;
  onOpenAiToolkit: () => void;
  onOpenEditStats: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  participantCount,
  stats,
  isAdmin,
  onScrollTo,
  onOpenParticipants,
  onOpenAiToolkit,
  onOpenEditStats,
}) => {
  const displayedVolunteerCount =
    stats.volunteerCountMode === 'custom'
      ? stats.customVolunteerCount
      : participantCount;

  return (
    <section id="about" className="pt-10 pb-12 bg-linear-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content: Clean, focused editorial layout without image */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đoàn Thanh Niên & CLB Môi Trường Học Đường</span>
            <span aria-hidden="true" className="text-emerald-400">·</span>
            <span>Chiến Dịch 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
            Chung Tay Nhặt Rác & Làm Sạch Môi Trường Quanh Trường Học
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Hành động nhỏ tạo nên thay đổi lớn! Kêu gọi toàn thể học sinh, giáo viên và thanh niên địa phương cùng tham gia dọn dẹp các điểm rác tồn đọng, vỉa hè và trục đường quanh trường, xây dựng môi trường học đường xanh - sạch - văn minh.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onScrollTo('register')}
              className="px-7 py-3.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 whitespace-nowrap shrink-0"
            >
              <span>Đăng Ký Tham Gia Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onScrollTo('bulletin')}
              className="px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Xem Lịch Trình Ra Quân</span>
            </button>

            <button
              onClick={onOpenAiToolkit}
              className="px-4 py-3.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Trợ Lý Sinh Thái AI</span>
            </button>
          </div>

          {/* Micro trust signals */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>BTC cấp phát đầy đủ kẹp gắp & găng tay bảo hộ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Điểm tập kết: Cổng chính trường học</span>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI Strip below hero content */}
        <div className="mt-12 pt-8 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Số Liệu Hoạt Động Thực Tế
            </div>

            {/* Admin-only edit button */}
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenEditStats}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Quản trị viên tùy chỉnh số liệu chiến dịch"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>Chỉnh sửa số liệu (Quản trị)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Metric 1: Volunteers */}
            <div
              onClick={onOpenParticipants}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Tình nguyện viên đăng ký</span>
                <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {displayedVolunteerCount}
                </span>
                <span className="text-xs text-emerald-600 font-semibold underline">Xem danh sách</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {stats.volunteerCountMode === 'custom'
                  ? 'Số lượng quản trị viên thiết lập'
                  : 'Theo danh sách đăng ký thực tế'}
              </p>
            </div>

            {/* Metric 2: Waste */}
            <div
              onClick={isAdmin ? onOpenEditStats : undefined}
              className={`p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all ${
                isAdmin ? 'hover:border-emerald-300 cursor-pointer group' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Lượng rác đã thu gom</span>
                {isAdmin && (
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 transition-colors">Sửa</span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
                  {stats.wasteCollected}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Thu gom & phân loại tái chế</p>
            </div>

            {/* Metric 3: Road */}
            <div
              onClick={isAdmin ? onOpenEditStats : undefined}
              className={`p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all ${
                isAdmin ? 'hover:border-emerald-300 cursor-pointer group' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Tuyến đường làm sạch</span>
                {isAdmin && (
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 transition-colors">Sửa</span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {stats.roadCleaned}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Vỉa hè & khu vực quanh trường</p>
            </div>

            {/* Metric 4: Campaigns */}
            <div
              onClick={isAdmin ? onOpenEditStats : undefined}
              className={`p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs transition-all ${
                isAdmin ? 'hover:border-emerald-300 cursor-pointer group' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Đợt ra quân hoàn thành</span>
                {isAdmin && (
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 transition-colors">Sửa</span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {stats.campaignsCompleted}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">100% an toàn và hiệu quả cao</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
