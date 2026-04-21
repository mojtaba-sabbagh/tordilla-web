// app/admin/comments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the Comment type
interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string | Date;
  blogPost?: {
    title: string;
    slug: string;
  };
}

type FilterType = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function AdminCommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth');
      if (!response.ok) {
        router.push('/adm/login?from=/admin/comments');
        return;
      }
      setIsAuthenticated(true);
      fetchComments();
    } catch (error) {
      router.push('/admin/login?from=/admin/comments');
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/comments');
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
      setFilteredComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setComments([]);
      setFilteredComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter comments based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredComments(comments);
    } else {
      setFilteredComments(comments.filter(comment => comment.status === activeFilter));
    }
  }, [activeFilter, comments]);

  const updateCommentStatus = async (commentId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, status }),
      });

      if (response.ok) {
        await fetchComments();
      } else {
        console.error('Failed to update comment status');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        await fetchComments();
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Get counts for each status
  const pendingCount = comments.filter(c => c.status === 'PENDING').length;
  const approvedCount = comments.filter(c => c.status === 'APPROVED').length;
  const rejectedCount = comments.filter(c => c.status === 'REJECTED').length;

  // Show loading state
  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-neutral-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchComments}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">مدیریت نظرات</h1>
          <p className="text-gray-600 mt-2">مدیریت و بررسی نظرات کاربران</p>
        </div>

        {/* Tab navigation with working filters */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeFilter === 'all'
                  ? 'text-[#8f1d1d] border-b-2 border-[#8f1d1d]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
            >
              همه نظرات
              <span className="mr-1 text-xs">({comments.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('PENDING')}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeFilter === 'PENDING'
                  ? 'text-[#8f1d1d] border-b-2 border-[#8f1d1d]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
            >
              در انتظار تایید
              {pendingCount > 0 && (
                <span className="mr-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter('APPROVED')}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeFilter === 'APPROVED'
                  ? 'text-[#8f1d1d] border-b-2 border-[#8f1d1d]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
            >
              تایید شده
              {approvedCount > 0 && (
                <span className="mr-1 text-xs">({approvedCount})</span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter('REJECTED')}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeFilter === 'REJECTED'
                  ? 'text-[#8f1d1d] border-b-2 border-[#8f1d1d]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
            >
              رد شده
              {rejectedCount > 0 && (
                <span className="mr-1 text-xs">({rejectedCount})</span>
              )}
            </button>
          </nav>
        </div>

        {/* Comments list */}
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-neutral-500">
              {activeFilter === 'all' && 'نظری یافت نشد'}
              {activeFilter === 'PENDING' && 'نظر در انتظار تاییدی وجود ندارد'}
              {activeFilter === 'APPROVED' && 'نظر تایید شده‌ای وجود ندارد'}
              {activeFilter === 'REJECTED' && 'نظر رد شده‌ای وجود ندارد'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {comment.name || 'ناشناس'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {comment.email || 'ایمیل نامشخص'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {typeof comment.createdAt === 'string'
                          ? new Date(comment.createdAt).toLocaleDateString('fa-IR')
                          : new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        comment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        comment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {comment.status === 'PENDING' ? 'در انتظار تایید' :
                         comment.status === 'APPROVED' ? 'تایید شده' : 'رد شده'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    {comment.blogPost && (
                      <p className="text-sm text-gray-500">
                        مربوط به مقاله:{' '}
                        <a
                          href={`/blog/${comment.blogPost.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {comment.blogPost.title}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mr-4">
                    {comment.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateCommentStatus(comment.id, 'APPROVED')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                        >
                          تایید
                        </button>
                        <button
                          onClick={() => updateCommentStatus(comment.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                        >
                          رد
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}