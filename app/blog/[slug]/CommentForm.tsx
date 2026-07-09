// app/blog/[slug]/CommentForm.tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Locale, translations } from "@/lib/i18n";

interface CommentFormProps {
  blogPostId: string;
  locale: Locale;
}

export function CommentForm({ blogPostId, locale }: CommentFormProps) {
  const t = translations[locale].blog.commentForm;
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
        setError(data.error || t.errorMessage);
      }
    } catch {
      setError(t.serverErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-green-700 font-medium">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">{t.nameLabel} *</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-[#ce4a28] focus:ring-2 focus:ring-[#ce4a28]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">{t.emailLabel} *</label>
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-[#ce4a28] focus:ring-2 focus:ring-[#ce4a28]/20" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">{t.contentLabel} *</label>
        <textarea rows={5} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-[#ce4a28] focus:ring-2 focus:ring-[#ce4a28]/20" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>}
      <button type="submit" disabled={submitting}
        className="inline-flex items-center gap-2 bg-[#ce4a28] text-white px-6 py-2.5 rounded-xl hover:bg-[#8f2e18] transition disabled:opacity-50">
        <Send size={16} /> {submitting ? t.submittingButton : t.submitButton}
      </button>
    </form>
  );
}