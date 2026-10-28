import React, { useState } from 'react';
import { X, Sparkles, Brain, Recycle, Megaphone, Send, ShieldAlert, CheckCircle, Copy, Check } from 'lucide-react';

interface AiToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiToolkitModal: React.FC<AiToolkitModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'strategic' | 'slogan'>('advisor');

  // Eco Advisor state
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [advisorAnswer, setAdvisorAnswer] = useState<string | null>(null);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);

  // High Thinking Strategic Plan state
  const [schoolName, setSchoolName] = useState('Trường THPT Lý Tự Trọng');
  const [volunteerEstimate, setVolunteerEstimate] = useState('100 - 150 học sinh');
  const [focusArea, setFocusArea] = useState('Trục đường chính trước cổng, vỉa hè bến xe buýt và gốc cây quanh tường rào trường');
  const [riskFactors, setRiskFactors] = useState('Mảnh thủy tinh vỡ, kim tiêm sắc nhọn, xe cộ lưu thông giờ tan tầm, thời tiết nắng nóng');
  const [strategicPlan, setStrategicPlan] = useState<string | null>(null);
  const [isStrategicLoading, setIsStrategicLoading] = useState(false);

  // Slogan generator state
  const [sloganClass, setSloganClass] = useState('Lớp 11A1');
  const [sloganOutput, setSloganOutput] = useState<string | null>(null);
  const [isSloganLoading, setIsSloganLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleEcoAdvisorSubmit = async (queryText?: string) => {
    const q = queryText || advisorQuery;
    if (!q.trim()) return;
    setIsAdvisorLoading(true);
    setAdvisorAnswer(null);

    try {
      const res = await fetch('/api/gemini/eco-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAdvisorAnswer(data.answer || 'Không thể tạo câu trả lời.');
    } catch (err: any) {
      setAdvisorAnswer('Đã có lỗi khi kết nối với Gemini AI.');
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  const handleStrategicPlanSubmit = async () => {
    setIsStrategicLoading(true);
    setStrategicPlan(null);

    try {
      const res = await fetch('/api/gemini/strategic-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          estimatedVolunteers: volunteerEstimate,
          specialRisks: riskFactors,
          targetFocus: focusArea,
        }),
      });
      const data = await res.json();
      setStrategicPlan(data.plan || 'Không thể lập kế hoạch.');
    } catch (err: any) {
      setStrategicPlan('Đã xảy ra lỗi khi khởi tạo kế hoạch tư duy sâu.');
    } finally {
      setIsStrategicLoading(false);
    }
  };

  const handleSloganSubmit = async () => {
    setIsSloganLoading(true);
    setSloganOutput(null);

    try {
      const res = await fetch('/api/gemini/slogan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: sloganClass }),
      });
      const data = await res.json();
      setSloganOutput(data.slogans || 'Không thể tạo khẩu hiệu.');
    } catch (err: any) {
      setSloganOutput('Lỗi tạo khẩu hiệu.');
    } finally {
      setIsSloganLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Trung Tâm Trợ Lý AI Sinh Thái & Tác Chiến
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ học sinh phân loại rác, tư duy chiến lược tác chiến sâu và lan tỏa thông điệp xanh.
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-2 border-b border-slate-200 bg-slate-100/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Recycle className="w-4 h-4 text-emerald-600" />
            <span>Phân Loại Rác Sinh Thái</span>
          </button>

          <button
            onClick={() => setActiveTab('strategic')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'strategic'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Hoạch Định Sâu (Thinking Mode)</span>
          </button>

          <button
            onClick={() => setActiveTab('slogan')}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'slogan'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Tạo Slogan & Kêu Gọi Bạn Bè</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm">
          {/* TAB 1: ECO ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                <strong className="block font-bold mb-1">Cẩm nang tra cứu nhanh cho Tình Nguyện Viên:</strong>
                Bạn có thể gõ bất kỳ loại rác nào bắt gặp xung quanh trường học để biết cách phân loại chuẩn và lưu ý an toàn.
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Cốc nhựa trà sữa & ống hút',
                  'Hộp xốp dính dầu mỡ',
                  'Vỏ hộp sữa giấy ép màng nhôm',
                  'Mảnh chai thủy tinh vỡ',
                  'Pin điện tử cũ',
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAdvisorQuery(item);
                      handleEcoAdvisorSubmit(item);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={advisorQuery}
                  onChange={(e) => setAdvisorQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEcoAdvisorSubmit()}
                  placeholder="Nhập loại rác (ví dụ: bạt nilon rách, que kem gỗ, khẩu trang y tế...)"
                  className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => handleEcoAdvisorSubmit()}
                  disabled={isAdvisorLoading}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAdvisorLoading ? 'Đang hỏi...' : 'Tra Cứu'}</span>
                </button>
              </div>

              {advisorAnswer && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase pb-2 border-b border-slate-200">
                    <span>Hướng dẫn phân loại & an toàn</span>
                    <button
                      onClick={() => handleCopyText(advisorAnswer)}
                      className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <div className="text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {advisorAnswer}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HIGH THINKING STRATEGIC PLANNER */}
          {activeTab === 'strategic' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Brain className="w-4 h-4 text-purple-700" />
                  <span>Chế độ Tư Duy Sâu (High Thinking Mode):</span>
                </div>
                Ứng dụng mô hình AI tư duy chuyên sâu để phân tích toàn diện: phân chia 4 phân đội tác chiến, quản trị rủi ro y tế/vật nhọn, phân luồng giao thông cổng trường và phương án gây quỹ cây xanh từ rác tái chế.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên trường học</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quy mô tình nguyện viên</label>
                  <input
                    type="text"
                    value={volunteerEstimate}
                    onChange={(e) => setVolunteerEstimate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">Khu vực trọng tâm quanh trường</label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">Yếu tố rủi ro & an toàn cần tính toán sâu</label>
                <input
                  type="text"
                  value={riskFactors}
                  onChange={(e) => setRiskFactors(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <button
                type="button"
                onClick={handleStrategicPlanSubmit}
                disabled={isStrategicLoading}
                className="w-full py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-xs"
              >
                <Brain className="w-4 h-4" />
                <span>
                  {isStrategicLoading ? 'AI Đang Suy Nghĩ Chuyên Sâu (Thinking)...' : 'Kích Hoạt AI Lập Kế Hoạch Tác Chiến Sâu'}
                </span>
              </button>

              {strategicPlan && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900 uppercase pb-2 border-b border-slate-200">
                    <span>Chiến lược tác chiến học đường chi tiết</span>
                    <button
                      onClick={() => handleCopyText(strategicPlan)}
                      className="text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Đã sao chép' : 'Sao chép bản thảo'}</span>
                    </button>
                  </div>
                  <div className="text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto pr-2">
                    {strategicPlan}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SLOGAN GENERATOR */}
          {activeTab === 'slogan' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                Tạo khẩu hiệu ngắn gọn, tràn đầy năng lượng tuổi trẻ để phát thanh trong trường, vẽ băng rôn hoặc chia sẻ lên Facebook, Zalo, nhóm chat lớp học!
              </div>

              <div className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  value={sloganClass}
                  onChange={(e) => setSloganClass(e.target.value)}
                  placeholder="Ví dụ: Chi đoàn 11A1, Học sinh khối 10..."
                  className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleSloganSubmit}
                  disabled={isSloganLoading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{isSloganLoading ? 'Đang sáng tạo...' : 'Tạo Khẩu Hiệu'}</span>
                </button>
              </div>

              {sloganOutput && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase pb-2 border-b border-slate-200">
                    <span>Khẩu hiệu & Bài đăng mẫu</span>
                    <button
                      onClick={() => handleCopyText(sloganOutput)}
                      className="text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <div className="text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {sloganOutput}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
