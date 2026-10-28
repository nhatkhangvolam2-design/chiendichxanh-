import React from 'react';
import { Leaf, Users, Calendar, BookOpen, Sparkles, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  participantCount: number;
  isAdmin: boolean;
  onOpenParticipants: () => void;
  onOpenAiToolkit: () => void;
  onScrollTo: (id: string) => void;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  participantCount,
  isAdmin,
  onOpenParticipants,
  onOpenAiToolkit,
  onScrollTo,
  onOpenAdminLogin,
  onLogoutAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark in display face */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-emerald-600 rounded-md py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              Trường Học Xanh
            </span>
          </button>

          {/* Zone 2: 4-5 single-line clean text links with hover underline */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onScrollTo('about')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Về chiến dịch
            </button>
            <button
              onClick={() => onScrollTo('bulletin')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Bảng tin & Lịch trình
            </button>
            <button
              onClick={() => onScrollTo('activities')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Hoạt động ý nghĩa
            </button>
            <button
              onClick={onOpenParticipants}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Tình nguyện viên</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded tabular-nums">
                {participantCount}
              </span>
            </button>
            <button
              onClick={onOpenAiToolkit}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-emerald-700 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trợ lý AI</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Admin status indicator */}
          <div className="flex items-center gap-3 shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-800">Quản trị viên</span>
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="text-[11px] text-slate-400 hover:text-rose-600 font-medium ml-1 cursor-pointer"
                  title="Thoát quyền quản trị"
                >
                  (Thoát)
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
                title="Đăng nhập dành cho Quản trị viên"
              >
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">Quản trị</span>
              </button>
            )}

            <button
              onClick={() => onScrollTo('register')}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Đăng Ký Tham Gia
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
