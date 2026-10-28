import React, { useState } from 'react';
import { CampaignStats } from '../types';
import { X, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

interface EditStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CampaignStats;
  actualParticipantCount: number;
  onUpdateStats: (newStats: CampaignStats) => void;
}

export const EditStatsModal: React.FC<EditStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  actualParticipantCount,
  onUpdateStats,
}) => {
  const [volunteerMode, setVolunteerMode] = useState<'auto' | 'custom'>(
    stats.volunteerCountMode || 'auto'
  );
  const [customVolunteerCount, setCustomVolunteerCount] = useState<number>(
    stats.customVolunteerCount || actualParticipantCount
  );
  const [wasteCollected, setWasteCollected] = useState(
    stats.wasteCollected !== undefined && stats.wasteCollected !== '' ? stats.wasteCollected : '0 kg'
  );
  const [roadCleaned, setRoadCleaned] = useState(
    stats.roadCleaned !== undefined && stats.roadCleaned !== '' ? stats.roadCleaned : '0 km'
  );
  const [campaignsCompleted, setCampaignsCompleted] = useState(
    stats.campaignsCompleted !== undefined && stats.campaignsCompleted !== '' ? stats.campaignsCompleted : '0 buổi'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: CampaignStats = {
      volunteerCountMode: volunteerMode,
      customVolunteerCount: Number(customVolunteerCount) || 0,
      wasteCollected: wasteCollected.trim() || '0 kg',
      roadCleaned: roadCleaned.trim() || '0 km',
      campaignsCompleted: campaignsCompleted.trim() || '0 buổi',
    };

    onUpdateStats(updated);
    onClose();
  };

  const handleResetToDefaults = () => {
    setVolunteerMode('auto');
    setCustomVolunteerCount(actualParticipantCount);
    setWasteCollected('0 kg');
    setRoadCleaned('0 km');
    setCampaignsCompleted('0 buổi');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Điều Chỉnh Số Liệu Chiến Dịch (Quản Trị)
              </h3>
              <p className="text-xs text-slate-500">
                Tùy chỉnh 4 chỉ số nổi bật trên trang chủ theo thực tế hoạt động.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* Metric 1: Volunteer Count */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <label className="block font-bold text-slate-800">
              1. Số tình nguyện viên tham gia
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVolunteerMode('auto')}
                className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  volunteerMode === 'auto'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Tự động theo danh sách ({actualParticipantCount} bạn)
              </button>
              <button
                type="button"
                onClick={() => setVolunteerMode('custom')}
                className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  volunteerMode === 'custom'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Tùy chỉnh số lượng
              </button>
            </div>

            {volunteerMode === 'custom' && (
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block mb-1">
                  Nhập con số hiển thị mong muốn:
                </span>
                <input
                  type="number"
                  min="0"
                  value={customVolunteerCount}
                  onChange={(e) => setCustomVolunteerCount(Number(e.target.value))}
                  placeholder="Ví dụ: 158"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 tabular-nums focus:outline-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Metric 2: Waste Collected */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              2. Lượng rác đã thu gom
            </label>
            <input
              type="text"
              value={wasteCollected}
              onChange={(e) => setWasteCollected(e.target.value)}
              placeholder="Ví dụ: 340+ kg hoặc 500 kg"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Gợi ý: "340+ kg", "500 kg", "1.2 tấn"
            </span>
          </div>

          {/* Metric 3: Road Cleaned */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              3. Tuyến đường làm sạch
            </label>
            <input
              type="text"
              value={roadCleaned}
              onChange={(e) => setRoadCleaned(e.target.value)}
              placeholder="Ví dụ: 2.5 km hoặc 3 tuyến đường"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Gợi ý: "2.5 km", "4 km vỉa hè", "800 m"
            </span>
          </div>

          {/* Metric 4: Campaigns Completed */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              4. Đợt ra quân hoàn thành
            </label>
            <input
              type="text"
              value={campaignsCompleted}
              onChange={(e) => setCampaignsCompleted(e.target.value)}
              placeholder="Ví dụ: 06 buổi hoặc 10 đợt"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Gợi ý: "06 buổi", "8 đợt", "12 lần"
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
