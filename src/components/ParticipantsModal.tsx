import React, { useState } from 'react';
import { VolunteerParticipant } from '../types';
import { X, Search, Filter, Heart, Award, UserCheck, Shield, Trash2, UserX } from 'lucide-react';

interface ParticipantsModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  participants: VolunteerParticipant[];
  onOpenRegister: () => void;
  onDeleteParticipant?: (id: string) => void;
}

export const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  isOpen,
  isAdmin,
  onClose,
  participants,
  onOpenRegister,
  onDeleteParticipant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [cheers, setCheers] = useState<Record<string, number>>({});
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheers((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleTriggerDelete = (volunteerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(volunteerId);
  };

  const handleConfirmDelete = (volunteerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteParticipant) {
      onDeleteParticipant(volunteerId);
    }
    setConfirmingDeleteId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
  };

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.rolePreference === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'cleanup':
        return { label: 'Thu gom rác', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'sorting':
        return { label: 'Phân loại tái chế', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'logistics':
        return { label: 'Hậu cần & Y tế', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'media':
        return { label: 'Truyền thông', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { label: 'Tình nguyện viên', bg: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Danh Sách Tình Nguyện Viên Đã Đăng Ký
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hiện có <strong className="text-emerald-700 font-bold tabular-nums">{participants.length}</strong> bạn học sinh & thanh niên đã sẵn sàng ra quân.
              {isAdmin && (
                <span className="text-emerald-700 font-semibold ml-2">
                  (Chế độ Quản trị: Bạn có thể loại bỏ thành viên không phù hợp)
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh hoặc lớp (ví dụ: 10A1, Nam, Chi...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full py-2 px-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 text-slate-800 cursor-pointer"
            >
              <option value="all">Tất cả nhiệm vụ ({participants.length})</option>
              <option value="cleanup">Đội Thu gom rác</option>
              <option value="sorting">Đội Phân loại tái chế</option>
              <option value="logistics">Đội Hậu cần & Y tế</option>
              <option value="media">Đội Truyền thông</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Không tìm thấy tình nguyện viên nào khớp với tìm kiếm.
            </div>
          ) : (
            filtered.map((volunteer) => {
              const badge = getRoleBadge(volunteer.rolePreference);
              const cheerCount = (cheers[volunteer.id] || 0) + (volunteer.checkInStatus ? 3 : 1);

              return (
                <div
                  key={volunteer.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                      {volunteer.fullName.split(' ').slice(-1)[0]?.charAt(0) || 'V'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {volunteer.fullName}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Lớp {volunteer.className}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{volunteer.age} tuổi</span>
                        <span aria-hidden="true">·</span>
                        <span>Đăng ký: {volunteer.registeredAt}</span>
                      </div>

                      {volunteer.message && (
                        <p className="text-xs text-slate-600 mt-1.5 italic bg-slate-50 p-1.5 rounded">
                          "{volunteer.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Admin-only remove button */}
                    {isAdmin && onDeleteParticipant && (
                      confirmingDeleteId === volunteer.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                          <button
                            type="button"
                            onClick={(e) => handleConfirmDelete(volunteer.id, e)}
                            className="px-2 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer shadow-2xs"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 rounded transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleTriggerDelete(volunteer.id, e)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Loại bỏ thành viên này nếu không phù hợp"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-600" />
                          <span>Loại bỏ</span>
                        </button>
                      )
                    )}

                    {/* Cheer Button for everyone */}
                    <button
                      onClick={(e) => handleCheer(volunteer.id, e)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Gửi lời cổ vũ tinh thần xanh"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span className="tabular-nums font-bold">{cheerCount}</span>
                      <span className="text-[11px] text-rose-500 hidden sm:inline">Cổ vũ</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Hiển thị {filtered.length} / {participants.length} bạn
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              + Đăng Ký Thêm Bạn Bè
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
