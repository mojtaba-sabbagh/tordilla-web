// app/admin/posts/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleFa: "",
    titleEn: "",
    slug: "",
    categoryFa: "",
    categoryEn: "",
    categorySlug: "",
    excerptFa: "",
    excerptEn: "",
    contentFa: "",
    contentEn: "",
    image: "",
    imageWidth: 800,
    imageHeight: 600,
    authorFa: "",
    authorEn: "",
    published: true,
  });

  const generateSlug = (title: string) => {
    return title
      .replace(/[^\w\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  const handleTitleChange = (lang: "fa" | "en", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`title${lang === "fa" ? "Fa" : "En"}`]: value,
    }));
    // Auto-generate slug from Persian title if slug is empty
    if (!formData.slug && lang === "fa") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Build JSON objects
    const payload = {
      title: { fa: formData.titleFa, en: formData.titleEn },
      category: { fa: formData.categoryFa, en: formData.categoryEn },
      excerpt: { fa: formData.excerptFa, en: formData.excerptEn },
      content: { fa: formData.contentFa, en: formData.contentEn },
      author: { fa: formData.authorFa, en: formData.authorEn },
      slug: formData.slug,
      categorySlug: formData.categorySlug,
      image: formData.image,
      imageWidth: formData.imageWidth,
      imageHeight: formData.imageHeight,
      published: formData.published,
    };

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const error = await response.json();
        alert(error.error || "خطا در ایجاد مطلب");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("خطا در ایجاد مطلب");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-neutral-600 hover:text-[#8f1d1d] transition">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-[#8f1d1d]">نوشتن مطلب جدید (دوزبانه)</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title - Bilingual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                عنوان (فارسی) *
              </label>
              <input
                type="text"
                required
                value={formData.titleFa}
                onChange={(e) => handleTitleChange("fa", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20"
                placeholder="عنوان فارسی مطلب"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Title (English) *
              </label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) => handleTitleChange("en", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20"
                placeholder="English title"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Slug (آدرس) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 bg-gray-50 font-mono text-sm"
              placeholder="url-address"
            />
            <p className="text-xs text-neutral-500 mt-1">
              آدرس مطلب در سایت: /blog/{formData.slug || "..."}
            </p>
          </div>

          {/* Category - Bilingual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                دسته بندی (فارسی) *
              </label>
              <select
                required
                value={formData.categoryFa}
                onChange={(e) => {
                  const selected = categories.find(c => c.nameFa === e.target.value);
                  setFormData({
                    ...formData,
                    categoryFa: e.target.value,
                    categoryEn: selected?.nameEn || "",
                    categorySlug: selected?.slug || "",
                  });
                }}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
              >
                <option value="">انتخاب کنید</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.nameFa}>
                    {cat.nameFa}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category (English) *
              </label>
              <input
                type="text"
                required
                value={formData.categoryEn}
                readOnly
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 bg-gray-50"
              />
            </div>
          </div>

          {/* Author - Bilingual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                نویسنده (فارسی) *
              </label>
              <input
                type="text"
                required
                value={formData.authorFa}
                onChange={(e) => setFormData({ ...formData, authorFa: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="نام نویسنده به فارسی"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Author (English) *
              </label>
              <input
                type="text"
                required
                value={formData.authorEn}
                onChange={(e) => setFormData({ ...formData, authorEn: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="Author name"
              />
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
            <p className="text-xs text-neutral-500 mt-1">
              تصویر را در پوشه public/home/blog/ قرار دهید
            </p>
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

          {/* Excerpt - Bilingual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                خلاصه مطلب (فارسی) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerptFa}
                onChange={(e) => setFormData({ ...formData, excerptFa: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="خلاصه فارسی..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Excerpt (English) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerptEn}
                onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:outline-none"
                placeholder="English excerpt..."
              />
            </div>
          </div>

          {/* Content - Bilingual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                محتوای مطلب (فارسی) *
              </label>
              <textarea
                required
                rows={15}
                value={formData.contentFa}
                onChange={(e) => setFormData({ ...formData, contentFa: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 font-mono text-sm focus:border-[#8f1d1d] focus:outline-none"
                placeholder="محتوای فارسی (HTML پشتیبانی می‌شود)..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Content (English) *
              </label>
              <textarea
                required
                rows={15}
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 font-mono text-sm focus:border-[#8f1d1d] focus:outline-none"
                placeholder="English content (HTML supported)..."
              />
            </div>
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
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#8f1d1d] text-white px-6 py-2.5 rounded-lg hover:bg-[#6b1616] transition disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {loading ? "در حال ذخیره..." : "ذخیره مطلب"}
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