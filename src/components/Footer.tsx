import React from 'react';
import { Leaf, Heart, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  onScrollTo: (id: string) => void;
  onOpenParticipants: () => void;
  onOpenAiToolkit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollTo,
  onOpenParticipants,
  onOpenAiToolkit,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-sm">
          {/* Col 1: Wordmark & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Chiến Dịch Trường Học Xanh
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Chương trình tình nguyện môi trường học đường kết nối học sinh, đoàn viên và cộng đồng dân cư quanh trường. Cùng nhau giữ gìn từng góc phố, vỉa hè sạch rác và nhân rộng lối sống xanh bền vững.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Khu vực trường học và các tuyến phố bao quanh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>nvrd3131596@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Điều hướng chiến dịch
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onScrollTo('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Về chiến dịch
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('bulletin')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Bảng tin & Lịch trình BTC
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('activities')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Hoạt động ý nghĩa đã thực hiện
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenParticipants}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Danh sách tình nguyện viên
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAiToolkit}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-400"
                >
                  Trợ lý AI Sinh Thái & Tác Chiến
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quy tắc hành động xanh
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
              <li>· Luôn đeo găng tay bảo hộ khi nhặt rác</li>
              <li>· Phân loại rác tái chế ngay tại hiện trường</li>
              <li>· Sử dụng bình nước cá nhân để giảm rác nhựa</li>
              <li>· Báo ngay cho BTC nếu gặp vật sắc nhọn/nguy hiểm</li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onScrollTo('register')}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer text-center"
              >
                Đăng Ký Tham Gia Đợt Mới
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Chiến Dịch Trường Học Xanh. Đoàn Trường & CLB Môi Trường Học Đường.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Vì một môi trường học đường không rác thải nhựa</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
