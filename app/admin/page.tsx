// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, Edit, Trash2, Eye, MessageSquare, LogOut, 
  Mail, Inbox 
} from "lucide-react";
import AdminNav from "./components/AdminNav";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  published: boolean;
  _count?: {
    comments: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]); // This was missing
  const [loading, setLoading] = useState(true);
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchPosts(),
        fetchPendingCommentsCount(),
        fetchUnseenMessagesCount()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchPendingCommentsCount = async () => {
    try {
      const response = await fetch("/api/admin/comments/pending/count");
      if (response.ok) {
        const data = await response.json();
        setPendingCommentsCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching comments count:", error);
    }
  };

  const fetchUnseenMessagesCount = async () => {
    try {
      const response = await fetch("/api/admin/messages/unseen-count");
      if (response.ok) {
        const data = await response.json();
        setUnseenMessagesCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching messages count:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این مطلب اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert("خطا در حذف مطلب");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("خطا در حذف مطلب");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f1d1d] mx-auto"></div>
          <p className="mt-4 text-neutral-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav 
        unseenMessagesCount={unseenMessagesCount}
        pendingCommentsCount={pendingCommentsCount}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Messages Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">پیام‌های خوانده نشده</p>
                <p className="text-3xl font-bold text-[#8f1d1d]">{unseenMessagesCount}</p>
              </div>
              <div className="bg-[#8f1d1d]/10 p-3 rounded-full">
                <Mail className="h-8 w-8 text-[#8f1d1d]" />
              </div>
            </div>
            <Link 
              href="/admin/messages"
              className="mt-4 inline-block text-sm text-[#8f1d1d] hover:underline"
            >
              مشاهده همه پیام‌ها →
            </Link>
          </div>

          {/* Comments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">نظرات در انتظار تایید</p>
                <p className="text-3xl font-bold text-[#8f1d1d]">{pendingCommentsCount}</p>
              </div>
              <div className="bg-[#8f1d1d]/10 p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-[#8f1d1d]" />
              </div>
            </div>
            <Link 
              href="/admin/comments"
              className="mt-4 inline-block text-sm text-[#8f1d1d] hover:underline"
            >
              مدیریت نظرات →
            </Link>
          </div>

          {/* Posts Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">مجموع مطالب</p>
                <p className="text-3xl font-bold text-[#8f1d1d]">{posts.length}</p>
              </div>
              <div className="bg-[#8f1d1d]/10 p-3 rounded-full">
                <Inbox className="h-8 w-8 text-[#8f1d1d]" />
              </div>
            </div>
            <Link 
              href="/admin/posts/new"
              className="mt-4 inline-block text-sm text-[#8f1d1d] hover:underline"
            >
              نوشتن مطلب جدید →
            </Link>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">لیست مطالب</h2>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-[#8f1d1d] !text-white px-4 py-2 rounded-lg hover:bg-[#6b1616] transition"
          >
            <Plus className="h-5 w-5" />
            مطلب جدید
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-neutral-500">هیچ مطلبی یافت نشد.</p>
            <Link
              href="/admin/posts/new"
              className="inline-block mt-4 text-[#8f1d1d] hover:underline"
            >
              اولین مطلب را بنویسید
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دسته بندی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نظرات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        slug: {post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post._count?.comments || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "منتشر شده" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}