"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Locale } from "@/lib/i18n";

type ContactFormProps = {
  locale: Locale;
  content: Record<string, any>;
};

export function ContactForm({ locale, content }: ContactFormProps) {
  const t = content;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitStatus({ type: "success", message: result.message || t.successMessage });
        form.reset();
      } else {
        setSubmitStatus({ type: "error", message: result.error || t.saveErrorMessage });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus({ type: "error", message: t.serverErrorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses =
    "w-full rounded-tile border border-line bg-cream px-4 py-3.5 text-sm text-ink placeholder:text-ink-mute/70 transition-all focus:border-leaf-400 focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-leaf-500/15";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="name" className="mb-2 block text-[13px] font-bold text-ink">
          {t.formNameLabel}
        </label>
        <input type="text" id="name" name="name" required placeholder={t.formNamePlaceholder} className={inputClasses} />
      </div>
      <div className="mb-5">
        <label htmlFor="email" className="mb-2 block text-[13px] font-bold text-ink">
          {t.formEmailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          dir="ltr"
          placeholder={t.formEmailPlaceholder}
          className={`${inputClasses} text-left`}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="phone" className="mb-2 block text-[13px] font-bold text-ink">
          {t.formPhoneLabel}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          dir="ltr"
          placeholder={t.formPhonePlaceholder}
          className={`${inputClasses} text-left`}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="subject" className="mb-2 block text-[13px] font-bold text-ink">
          {t.formSubjectLabel}
        </label>
        <input type="text" id="subject" name="subject" required placeholder={t.formSubjectPlaceholder} className={inputClasses} />
      </div>
      <div className="mb-5">
        <label htmlFor="message" className="mb-2 block text-[13px] font-bold text-ink">
          {t.formMessageLabel}
        </label>
        <textarea id="message" name="message" rows={5} required placeholder={t.formMessagePlaceholder} className={inputClasses} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 py-4 text-[15px] font-extrabold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        <Send size={18} />
        {isSubmitting ? t.formSubmitting : t.formSubmit}
      </button>
      {submitStatus && (
        <div
          className={`mt-4 rounded-tile p-3.5 text-center text-[13px] font-bold ${
            submitStatus.type === "success"
              ? "border border-leaf-200 bg-leaf-50 text-leaf-700"
              : "border border-paprika-200 bg-paprika-100 text-paprika-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
