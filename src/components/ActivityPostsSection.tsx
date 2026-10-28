import React, { useState } from 'react';
import { ActivityPost } from '../types';
import { PlusCircle, Calendar, Users, Scale, BookOpen, X, ArrowUpRight, Trash2 } from 'lucide-react';

interface ActivityPostsSectionProps {
  posts: ActivityPost[];
  isAdmin: boolean;
  onOpenNewPostModal: () => void;
  onDeletePost?: (id: string) => void;
}

export const ActivityPostsSection: React.FC<ActivityPostsSectionProps> = ({
  posts,
  isAdmin,
  onOpenNewPostModal,
  onDeletePost,
}) => {
  const [selectedPost, setSelectedPost] = useState<ActivityPost | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  return (
    <section id="activities" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-800 uppercase mb-2">
              <span>Hành Động Nhỏ · Ý Nghĩa Lớn</span>
              <span aria-hidden="true">·</span>
              <span>Lưu Giữ Kỷ Niệm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Những Hoạt Động Ý Nghĩa Đã Thực Hiện
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              Ghi lại những khoảnh khắc đẹp, số liệu thành quả thu gom rác thực tế và sự đổi thay xanh sạch quanh cổng trường học.
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenNewPostModal}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Đăng Bài Viết Hoạt Động Mới</span>
              </button>
            </div>
          )}
        </div>

        {/* Posts Grid or Empty State */}
        {posts.length === 0 ? (
          <div className="py-16 px-6 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Chưa Có Bài Viết Nào Được Đăng
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {isAdmin
                ? 'Mục này đã sẵn sàng để bạn tự viết các bài viết, chia sẻ thành quả thu gom rác và tải lên các bức ảnh thực tế của riêng bạn.'
                : 'Ban Tổ Chức đang chuẩn bị và sẽ sớm đăng tải các bài viết, hình ảnh thực tế sau đợt ra quân dọn rác mới nhất.'}
            </p>
            {isAdmin && (
              <div className="mt-6">
                <button
                  onClick={onOpenNewPostModal}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Viết Bài Đăng & Tải Lên Ảnh Của Bạn</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col cursor-pointer group relative"
              >
                {/* Image Container (4:3 aspect ratio) */}
                <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Overlay Tag */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 px-2 py-0.5 rounded shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Delete button for admin with inline confirmation */}
                  {isAdmin && onDeletePost && (
                    <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                      {confirmingDeleteId === post.id ? (
                        <div className="flex items-center gap-1 bg-slate-900/95 backdrop-blur-xs border border-rose-400 p-1 rounded-lg shadow-lg">
                          <span className="text-[11px] text-white font-medium pl-1">Xóa bài này?</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePost(post.id);
                              setConfirmingDeleteId(null);
                              if (selectedPost?.id === post.id) setSelectedPost(null);
                            }}
                            className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmingDeleteId(null);
                            }}
                            className="px-1.5 py-0.5 text-[11px] text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmingDeleteId(post.id);
                          }}
                          title="Xóa bài viết này"
                          className="w-8 h-8 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                    <span className="font-medium opacity-90">{post.date}</span>
                    <span className="flex items-center gap-1 text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Xem chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  {/* Quantitative Metrics Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Rác thu gom</span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {post.metrics.wasteCollectedKg} kg
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-900">
                      <span className="text-[10px] text-emerald-700 block">Tái chế</span>
                      <span className="font-extrabold tabular-nums">
                        {post.metrics.recycledKg} kg
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Tham gia</span>
                      <span className="font-extrabold text-slate-900 tabular-nums">
                        {post.metrics.participantsCount} bạn
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
              <div className="relative aspect-16/9 bg-slate-900">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span>{selectedPost.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedPost.date}</span>
                  </div>

                  {isAdmin && onDeletePost && (
                    <div>
                      {confirmingDeleteId === selectedPost.id ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-lg">
                          <span className="text-[11px] font-medium text-rose-800">Xác nhận xóa bài viết?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeletePost(selectedPost.id);
                              setConfirmingDeleteId(null);
                              setSelectedPost(null);
                            }}
                            className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer"
                          >
                            Xóa ngay
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingDeleteId(null)}
                            className="px-1.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteId(selectedPost.id)}
                          className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa bài viết</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {selectedPost.title}
                </h3>

                {/* Metrics Highlight Strip */}
                <div className="mt-4 grid grid-cols-4 gap-2 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Tổng rác gom</span>
                    <strong className="text-sm font-bold text-slate-900 tabular-nums">
                      {selectedPost.metrics.wasteCollectedKg} kg
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Rác tái chế</span>
                    <strong className="text-sm font-bold text-emerald-700 tabular-nums">
                      {selectedPost.metrics.recycledKg} kg
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Vỉa hè dọn</span>
                    <strong className="text-sm font-bold text-slate-900 tabular-nums">
                      {selectedPost.metrics.areaCleanedMeters} m
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Tình nguyện viên</span>
                    <strong className="text-sm font-bold text-slate-900 tabular-nums">
                      {selectedPost.metrics.participantsCount} bạn
                    </strong>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <p className="font-medium text-slate-900">
                    {selectedPost.summary}
                  </p>
                  <p className="whitespace-pre-line">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedPost.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
