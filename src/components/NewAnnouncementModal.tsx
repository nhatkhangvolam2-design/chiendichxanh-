import React, { useState } from 'react';
import { AnnouncementItem } from '../types';
import { X, Sparkles, Plus, Trash2, Calendar, MapPin, CheckCircle } from 'lucide-react';

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnnouncement: (announcement: AnnouncementItem) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onAddAnnouncement,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'schedule' | 'announcement'>('schedule');
  const [date, setDate] = useState('Chủ Nhật, ngày 09 tháng 11');
  const [time, setTime] = useState('07:00 - 10:30 Sáng');
  const [gatheringLocation, setGatheringLocation] = useState('Cổng chính trường học');
  const [targetArea, setTargetArea] = useState('Vỉa hè và trục đường quanh tường rào trường');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Ban Tổ Chức & Đoàn Trường');
  const [pinned, setPinned] = useState(false);

  // Equipment & Reminders
  const [equipmentInput, setEquipmentInput] = useState('Găng tay dệt bảo hộ, Kẹp gắp rác inox, Túi rác sinh học');
  const [remindersInput, setRemindersInput] = useState('Mặc áo đoàn hoặc áo thể dục, Đi giày bít mũi, Mang theo bình nước cá nhân');

  // Schedule Timeline steps
  const [timelineSteps, setTimelineSteps] = useState([
    { time: '07:00 - 07:15', activity: 'Tập trung tại cổng trường, điểm danh và phát kẹp gắp, găng tay', leader: 'Thầy Tổng Phụ Trách & Đội Hậu Cần' },
    { time: '07:15 - 09:30', activity: 'Triển khai dọn dẹp các tuyến đường xung quanh trường', leader: 'Các Trưởng Nhóm Phân Đội' },
    { time: '09:30 - 10:00', activity: 'Phân loại rác tái chế và tập kết rác thải về điểm trung chuyển', leader: 'CLB Môi Trường Học Đường' },
  ]);

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSchoolName, setAiSchoolName] = useState('Trường THPT Lý Tự Trọng');

  if (!isOpen) return null;

  const handleAddTimelineStep = () => {
    setTimelineSteps([...timelineSteps, { time: '', activity: '', leader: 'Ban Tổ Chức' }]);
  };

  const handleRemoveTimelineStep = (index: number) => {
    setTimelineSteps(timelineSteps.filter((_, i) => i !== index));
  };

  const handleUpdateTimelineStep = (index: number, field: string, value: string) => {
    const updated = [...timelineSteps];
    updated[index] = { ...updated[index], [field]: value };
    setTimelineSteps(updated);
  };

  const handleAiDraft = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: aiSchoolName,
          eventDate: date,
          targetArea,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setTitle(data.draft.title || title);
        if (data.draft.time) setTime(data.draft.time);
        if (data.draft.gatheringLocation) setGatheringLocation(data.draft.gatheringLocation);
        if (data.draft.targetArea) setTargetArea(data.draft.targetArea);
        if (data.draft.content) setContent(data.draft.content);
        if (data.draft.equipmentPrepared) setEquipmentInput(data.draft.equipmentPrepared.join(', '));
        if (data.draft.reminders) setRemindersInput(data.draft.reminders.join(', '));
        if (data.draft.scheduleTimeline && data.draft.scheduleTimeline.length > 0) {
          setTimelineSteps(data.draft.scheduleTimeline);
        }
      }
    } catch (err) {
      console.warn('AI Draft error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !gatheringLocation.trim()) return;

    const newAnnouncement: AnnouncementItem = {
      id: 'ann-' + Date.now(),
      title: title.trim(),
      type,
      date: date.trim(),
      time: time.trim(),
      gatheringLocation: gatheringLocation.trim(),
      targetArea: targetArea.trim(),
      equipmentPrepared: equipmentInput.split(',').map((s) => s.trim()).filter(Boolean),
      reminders: remindersInput.split(',').map((s) => s.trim()).filter(Boolean),
      content: content.trim() || 'Thông báo chính thức từ Ban Tổ Chức về đợt ra quân tình nguyện làm sạch môi trường.',
      scheduleTimeline: timelineSteps.filter((s) => s.time && s.activity),
      author: author.trim() || 'Ban Tổ Chức',
      pinned,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddAnnouncement(newAnnouncement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Đăng Thông Báo / Lịch Trình Mới
            </h3>
            <p className="text-xs text-slate-500">
              Cập nhật thông tin cho các bạn tình nguyện viên và toàn trường.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Quick Fill Assistance Bar */}
        <div className="p-3.5 bg-emerald-50/80 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs font-semibold text-emerald-900">
              Dùng Trợ lý AI tự động soạn thảo mẫu thông báo chuẩn:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiSchoolName}
              onChange={(e) => setAiSchoolName(e.target.value)}
              placeholder="Tên trường..."
              className="text-xs px-2.5 py-1 bg-white border border-emerald-300 rounded focus:outline-emerald-600 text-slate-800"
            />
            <button
              type="button"
              onClick={handleAiDraft}
              disabled={isAiGenerating}
              className="px-3 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isAiGenerating ? 'AI đang viết...' : 'AI Soạn Nhanh'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề thông báo / Lịch trình <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Ra quân Chủ Nhật Xanh - Dọn sạch tuyến đường cổng trường"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Loại bài đăng</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900 cursor-pointer"
              >
                <option value="schedule">Lịch trình ra quân cụ thể</option>
                <option value="announcement">Thông báo hành chính / Đoàn trường</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Người đăng / Phụ trách</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày diễn ra <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ví dụ: Chủ Nhật, 09/11/2026"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Thời gian</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ví dụ: 06:45 - 10:30 Sáng"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Điểm tập kết tại trường <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={gatheringLocation}
                onChange={(e) => setGatheringLocation(e.target.value)}
                placeholder="Ví dụ: Cổng chính trường học (Sân cờ)"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Khu vực phân công dọn dẹp</label>
              <input
                type="text"
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                placeholder="Ví dụ: Vỉa hè đối diện trường, trạm xe buýt"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết lời kêu gọi</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả mục tiêu, ý nghĩa và thông điệp gửi tới các bạn học sinh..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900 resize-none"
            />
          </div>

          {/* Timeline steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700">Các mốc lịch trình cụ thể</label>
              <button
                type="button"
                onClick={handleAddTimelineStep}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm mốc giờ
              </button>
            </div>

            <div className="space-y-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <input
                    type="text"
                    value={step.time}
                    onChange={(e) => handleUpdateTimelineStep(idx, 'time', e.target.value)}
                    placeholder="07:00 - 07:30"
                    className="w-28 px-2 py-1 text-xs bg-white border border-slate-300 rounded font-mono"
                  />
                  <input
                    type="text"
                    value={step.activity}
                    onChange={(e) => handleUpdateTimelineStep(idx, 'activity', e.target.value)}
                    placeholder="Nội dung công việc..."
                    className="flex-1 px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTimelineStep(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dụng cụ BTC cấp (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lưu ý an toàn (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={remindersInput}
                onChange={(e) => setRemindersInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="pinned" className="text-xs text-slate-700 cursor-pointer select-none">
              Ghim thông báo này lên đầu bảng tin
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Đăng Thông Báo Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
