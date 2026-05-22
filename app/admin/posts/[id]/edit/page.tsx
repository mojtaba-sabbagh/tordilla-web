// app/admin/posts/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface PostData {
  id: string;
  title: { fa: string; en: string };
  slug: string;
  category: { fa: string; en: string };
  categorySlug: string;
  excerpt: { fa: string; en: string };
  content: { fa: string; en: string };
  image: string;
  imageWidth: number;
  imageHeight: number;
  author: { fa: string; en: string };
  published: boolean;
}

// Helper to safely parse a JSON field (string or object) into { fa, en }
function parseJsonField(field: unknown): { fa: string; en: string } {
  if (!field) return { fa: "", en: "" };

  if (typeof field === "object" && field !== null) {
    const obj = field as Record<string, string>;
    return {
      fa: obj.fa || "",
      en: obj.en || "",
    };
  }

  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (parsed && typeof parsed === "object") {
        return {
          fa: parsed.fa || "",
          en: parsed.en || "",
        };
      }
    } catch {
      return { fa: field, en: field };
    }
  }

  return { fa: "", en: "" };
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
      if (!response.ok) throw new Error("Failed to fetch post");

      const data = await response.json();
      // ✅ IMPORTANT: API returns { post: {...} }, extract the post object
      const post = data.post;
      if (!post) throw new Error("Post not found");

      // Normalize all JSON fields
      const normalized: PostData = {
        id: post.id,
        slug: post.slug || "",
        categorySlug: post.categorySlug || "",
        image: post.image || "",
        imageWidth: post.imageWidth || 800,
        imageHeight: post.imageHeight || 600,
        published: post.published === true,
        title: parseJsonField(post.title),
        category: parseJsonField(post.category),
        excerpt: parseJsonField(post.excerpt),
        content: parseJsonField(post.content),
        author: parseJsonField(post.author),
      };

      setFormData(normalized);
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

  const handleTitleChange = (lang: "fa" | "en", value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        title: { ...formData.title, [lang]: value },
      });
      if (lang === "fa" && formData.slug === generateSlug(formData.title.fa)) {
        setFormData((prev) => ({
          ...prev!,
          slug: generateSlug(value),
        }));
      }
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
    { nameFa: "بدانیم", nameEn: "Know", slug: "badanim" },
    { nameFa: "طرز تهیه غذا", nameEn: "Recipe", slug: "recipe-food" },
    { nameFa: "طرز تهیه دیپ", nameEn: "Dip Recipe", slug: "recipe-dip" },
    { nameFa: "طرز تهیه سس", nameEn: "Sauce Recipe", slug: "recipe-sauce" },
    { nameFa: "سالم بخوریم", nameEn: "Healthy Eating", slug: "healthy-eating" },
    { nameFa: "اخبار", nameEn: "News", slug: "news" },
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-neutral-600 hover:text-[#8f1d1d] transition">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-[#8f1d1d]">ویرایش مطلب (دوزبانه)</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">عنوان (فارسی) *</label>
              <input
                type="text"
                required
                value={formData.title.fa}
                onChange={(e) => handleTitleChange("fa", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20"
                placeholder="عنوان فارسی مطلب"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title (English) *</label>
              <input
                type="text"
                required
                value={formData.title.en}
                onChange={(e) => handleTitleChange("en", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="English title"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug (آدرس) *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 bg-gray-50 font-mono text-sm"
              placeholder="url-address"
            />
            <p className="text-xs text-neutral-500 mt-1">آدرس مطلب در سایت: /blog/{formData.slug || "..."}</p>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">دسته بندی (فارسی) *</label>
              <select
                required
                value={formData.category.fa}
                onChange={(e) => {
                  const selected = categories.find(c => c.nameFa === e.target.value);
                  setFormData({
                    ...formData,
                    category: { fa: e.target.value, en: selected?.nameEn || "" },
                    categorySlug: selected?.slug || "",
                  });
                }}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              >
                <option value="">انتخاب کنید</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.nameFa}>{cat.nameFa}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category (English) *</label>
              <input type="text" required value={formData.category.en} readOnly className="w-full rounded-lg border border-neutral-300 px-4 py-2 bg-gray-50" />
            </div>
          </div>

          {/* Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">نویسنده (فارسی) *</label>
              <input
                type="text"
                required
                value={formData.author.fa}
                onChange={(e) => setFormData({ ...formData, author: { ...formData.author, fa: e.target.value } })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="نام نویسنده به فارسی"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Author (English) *</label>
              <input
                type="text"
                required
                value={formData.author.en}
                onChange={(e) => setFormData({ ...formData, author: { ...formData.author, en: e.target.value } })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="Author name"
              />
            </div>
          </div>

          {/* Image fields */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">آدرس تصویر</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              placeholder="/home/blog/image.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">عرض تصویر (px)</label>
              <input
                type="number"
                value={formData.imageWidth}
                onChange={(e) => setFormData({ ...formData, imageWidth: parseInt(e.target.value) || 800 })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">ارتفاع تصویر (px)</label>
              <input
                type="number"
                value={formData.imageHeight}
                onChange={(e) => setFormData({ ...formData, imageHeight: parseInt(e.target.value) || 600 })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">خلاصه مطلب (فارسی) *</label>
              <textarea
                required
                rows={3}
                value={formData.excerpt.fa}
                onChange={(e) => setFormData({ ...formData, excerpt: { ...formData.excerpt, fa: e.target.value } })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="خلاصه فارسی..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Excerpt (English) *</label>
              <textarea
                required
                rows={3}
                value={formData.excerpt.en}
                onChange={(e) => setFormData({ ...formData, excerpt: { ...formData.excerpt, en: e.target.value } })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="English excerpt..."
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">محتوای مطلب (فارسی) *</label>
              <textarea
                required
                rows={15}
                value={formData.content.fa}
                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, fa: e.target.value } })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 font-mono text-sm focus:border-[#8f1d1d] focus:outline-none"
                placeholder="محتوای فارسی (HTML پشتیبانی می‌شود)..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Content (English) *</label>
              <textarea
                required
                rows={15}
                value={formData.content.en}
                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 font-mono text-sm focus:border-[#8f1d1d] focus:outline-none"
                placeholder="English content (HTML supported)..."
              />
            </div>
          </div>

          {/* Published checkbox */}
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
            <Link href="/admin" className="inline-flex items-center gap-2 bg-gray-200 text-neutral-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition">
              انصراف
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}