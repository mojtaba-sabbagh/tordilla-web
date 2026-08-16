// app/blog/[slug]/CommentForm.tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface CommentFormProps {
  blogPostId: string;
  locale: Locale;
  content: Record<string, any>;
}

export function CommentForm({ blogPostId, locale, content }: CommentFormProps) {
  const t = content;
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
      <div className="rounded-card border border-leaf-200 bg-leaf-50 p-6 text-center">
        <p className="font-bold text-leaf-700">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[13px] font-bold text-ink">{t.nameLabel} *</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full rounded-tile border border-line bg-cream px-4 py-3 text-sm text-ink transition-all focus:border-leaf-400 focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-leaf-500/15" />
        </div>
        <div>
          <label className="mb-2 block text-[13px] font-bold text-ink">{t.emailLabel} *</label>
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full rounded-tile border border-line bg-cream px-4 py-3 text-sm text-ink transition-all focus:border-leaf-400 focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-leaf-500/15" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-bold text-ink">{t.contentLabel} *</label>
        <textarea rows={5} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
          className="w-full rounded-tile border border-line bg-cream px-4 py-3 text-sm text-ink transition-all focus:border-leaf-400 focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-leaf-500/15" />
      </div>
      {error && <div className="rounded-tile border border-paprika-200 bg-paprika-100 p-3.5 text-[13px] font-bold text-paprika-700">{error}</div>}
      <button type="submit" disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-7 py-3 text-[14px] font-extrabold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-leaf-700 disabled:opacity-50 disabled:shadow-none">
        <Send size={16} /> {submitting ? t.submittingButton : t.submitButton}
      </button>
    </form>
  );
}