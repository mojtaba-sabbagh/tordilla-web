// app/admin/posts/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye } from "lucide-react";

interface PostData {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  content: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  author: string;
  published: boolean;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PostData | null>(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`);
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("خطا در دریافت مطلب");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .replace(/[^\w\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (formData) {
      setFormData({
        ...formData,
        title,
        slug: generateSlug(title),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const error = await response.json();
        alert(error.error || "خطا در ویرایش مطلب");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("خطا در ویرایش مطلب");
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { name: "بدانیم", slug: "badanim" },
    { name: "طرز تهیه غذا", slug: "recipe-food" },
    { name: "طرز تهیه دیپ", slug: "recipe-dip" },
    { name: "طرز تهیه سس", slug: "recipe-sauce" },
    { name: "سالم بخوریم", slug: "healthy-eating" },
    { name: "اخبار", slug: "news" },
  ];

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

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-neutral-600">مطلب یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-neutral-600 hover:text-[#8f1d1d] transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-[#8f1d1d]">ویرایش مطلب</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              عنوان *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20"
              placeholder="عنوان مطلب"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Slug (آدرس)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 bg-gray-50 font-mono text-sm"
              placeholder="url-address"
            />
            <p className="text-xs text-neutral-500 mt-1">
              آدرس مطلب در سایت: /blog/{formData.slug || "..."}
            </p>
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                دسته بندی *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => {
                  const selected = categories.find(c => c.name === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    categorySlug: selected?.slug || "",
                  });
                }}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              >
                <option value="">انتخاب کنید</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              آدرس تصویر
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              placeholder="/home/blog/image.jpg"
            />
          </div>

          {/* Image Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                عرض تصویر (px)
              </label>
              <input
                type="number"
                value={formData.imageWidth}
                onChange={(e) => setFormData({ ...formData, imageWidth: parseInt(e.target.value) || 800 })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                ارتفاع تصویر (px)
              </label>
              <input
                type="number"
                value={formData.imageHeight}
                onChange={(e) => setFormData({ ...formData, imageHeight: parseInt(e.target.value) || 600 })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              خلاصه مطلب *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              placeholder="خلاصه‌ای از مطلب..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              محتوای مطلب *
            </label>
            <textarea
              required
              rows={15}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 font-mono text-sm focus:border-[#8f1d1d] focus:outline-none"
              placeholder="محتوای مطلب (HTML پشتیبانی می‌شود)..."
            />
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-[#8f1d1d] focus:ring-[#8f1d1d]"
              />
              <span className="text-sm text-neutral-700">منتشر شود</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#8f1d1d] text-white px-6 py-2.5 rounded-lg hover:bg-[#6b1616] transition disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-gray-200 text-neutral-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition"
            >
              انصراف
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}