// app/blog/[slug]/CommentForm.tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommentFormProps {
  blogPostId: string;
}

export function CommentForm({ blogPostId }: CommentFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, blogPostId }),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", content: "" });
      } else {
        const data = await res.json();
        setError(data.error || "خطا در ارسال نظر");
      }
    } catch {
      setError("خطا در ارسال نظر. لطفاً مجدد تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-green-700 font-medium">نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">نام *</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:ring-2 focus:ring-[#8f1d1d]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">ایمیل *</label>
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:ring-2 focus:ring-[#8f1d1d]/20" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">نظر شما *</label>
        <textarea rows={5} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-[#8f1d1d] focus:ring-2 focus:ring-[#8f1d1d]/20" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>}
      <button type="submit" disabled={submitting}
        className="inline-flex items-center gap-2 bg-[#8f1d1d] text-white px-6 py-2.5 rounded-xl hover:bg-[#6b1616] transition disabled:opacity-50">
        <Send size={16} /> {submitting ? "در حال ارسال..." : "ارسال نظر"}
      </button>
    </form>
  );
}