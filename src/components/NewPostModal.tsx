import React, { useState } from 'react';
import { ActivityPost } from '../types';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle, Scale, Users, MapPin, Sparkles } from 'lucide-react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: ActivityPost) => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('28 tháng 10, 2026');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Ban Quản Trị Chiến Dịch');
  const [tagsInput, setTagsInput] = useState('Chiến Dịch Xanh, Tình Nguyện, Học Sinh');

  // Metrics
  const [wasteKg, setWasteKg] = useState<number>(80);
  const [recycledKg, setRecycledKg] = useState<number>(30);
  const [participantsCount, setParticipantsCount] = useState<number>(65);
  const [areaCleanedMeters, setAreaCleanedMeters] = useState<number>(600);

  // Image source modes: 'upload' | 'url' | 'library'
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'library'>('upload');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Preset library images (authentic Vietnamese school cleanup)
  const presetImages = [
    { label: 'Phân loại rác cổng trường THPT Lý Tự Trọng', url: '/src/assets/images/students_sorting_trash_1793176669358.jpg' },
    { label: 'Vỉa hè trường THCS Phan Chu Trinh xanh sạch', url: '/src/assets/images/clean_school_sidewalk_1793176669572.jpg' },
    { label: 'Đội ngũ tình nguyện viên môi trường', url: '/src/assets/images/volunteer_team_spirit_1793176669824.jpg' },
  ];
  const [selectedLibraryUrl, setSelectedLibraryUrl] = useState(presetImages[0].url);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getEffectiveImageUrl = () => {
    if (imageMode === 'upload' && uploadedImagePreview) {
      return uploadedImagePreview;
    }
    if (imageMode === 'url' && customImageUrl.trim()) {
      return customImageUrl.trim();
    }
    return selectedLibraryUrl || presetImages[0].url;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) return;

    const finalImageUrl = getEffectiveImageUrl();

    const newPost: ActivityPost = {
      id: 'post-' + Date.now(),
      title: title.trim(),
      date: date.trim(),
      summary: summary.trim(),
      content: content.trim(),
      imageUrl: finalImageUrl,
      metrics: {
        wasteCollectedKg: Number(wasteKg) || 0,
        participantsCount: Number(participantsCount) || 0,
        areaCleanedMeters: Number(areaCleanedMeters) || 0,
        recycledKg: Number(recycledKg) || 0,
      },
      author: author.trim() || 'Ban Quản Trị',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onAddPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Đăng Bài Viết Hoạt Động & Tải Lên Ảnh Của Bạn
            </h3>
            <p className="text-xs text-slate-500">
              Bạn có thể tự do viết nội dung và tải lên hình ảnh chụp thực tế từ sự kiện của mình.
            </p>
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề bài viết <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Đợt ra quân thứ 7: Dọn sạch 80kg rác quanh cổng trường"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày thực hiện</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tác giả / Người đăng</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Image Selection with multiple methods */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Hình ảnh bài viết:</span>
              </label>

              {/* Segmented control for choosing upload method */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tải ảnh từ máy
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Link ảnh
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('library')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    imageMode === 'library'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chọn mẫu
                </button>
              </div>
            </div>

            {/* Mode 1: Upload from local device */}
            {imageMode === 'upload' && (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                  <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    Bấm vào đây để chọn ảnh từ máy tính hoặc điện thoại
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ JPG, PNG, WEBP (ảnh tự chụp tại trường)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Mode 2: Direct URL */}
            {imageMode === 'url' && (
              <div>
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Dán đường dẫn ảnh (ví dụ: https://...)"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            )}

            {/* Mode 3: Library */}
            {imageMode === 'library' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {presetImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedLibraryUrl(img.url)}
                    className={`border-2 rounded-xl overflow-hidden cursor-pointer p-1 transition-all ${
                      selectedLibraryUrl === img.url
                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-12 object-cover rounded-lg"
                    />
                    <span className="text-[9px] text-slate-600 block truncate mt-0.5 text-center font-medium">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Image Preview */}
            <div className="relative aspect-16/9 bg-slate-900 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={getEffectiveImageUrl()}
                alt="Xem trước ảnh bài viết"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] rounded">
                Ảnh xem trước
              </div>
            </div>
          </div>

          {/* Quantitative Metrics Inputs */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Số liệu định lượng đạt được:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block">Rác thu gom (kg)</span>
                <input
                  type="number"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tái chế (kg)</span>
                <input
                  type="number"
                  value={recycledKg}
                  onChange={(e) => setRecycledKg(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tình nguyện viên</span>
                <input
                  type="number"
                  value={participantsCount}
                  onChange={(e) => setParticipantsCount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Đoạn đường (m)</span>
                <input
                  type="number"
                  value={areaCleanedMeters}
                  onChange={(e) => setAreaCleanedMeters(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tóm tắt ngắn (1-2 câu mở đầu) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm lược điểm nổi bật của buổi dọn dẹp..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nội dung chi tiết bài viết <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ không khí buổi dọn dẹp, sự hưởng ứng của các bạn học sinh, các điểm rác đã được làm sạch..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Thẻ từ khóa (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
            />
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
              Xuất Bản Bài Viết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
