"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { translations, Locale } from "@/lib/i18n";

type ContactFormProps = {
  locale: Locale;
};

export function ContactForm({ locale }: ContactFormProps) {
  const t = translations[locale].contact;
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
    "w-full rounded-[20px] border-[1.5px] border-[rgba(206,74,40,0.15)] bg-white px-4 py-3 text-sm transition focus:border-[#ce4a28] focus:outline-none focus:ring-[3px] focus:ring-[rgba(206,74,40,0.1)]";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="name" className="mb-2 block text-[13px] font-bold text-[#2c1810]">
          {t.formNameLabel}
        </label>
        <input type="text" id="name" name="name" required placeholder={t.formNamePlaceholder} className={inputClasses} />
      </div>
      <div className="mb-5">
        <label htmlFor="email" className="mb-2 block text-[13px] font-bold text-[#2c1810]">
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
        <label htmlFor="phone" className="mb-2 block text-[13px] font-bold text-[#2c1810]">
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
        <label htmlFor="subject" className="mb-2 block text-[13px] font-bold text-[#2c1810]">
          {t.formSubjectLabel}
        </label>
        <input type="text" id="subject" name="subject" required placeholder={t.formSubjectPlaceholder} className={inputClasses} />
      </div>
      <div className="mb-5">
        <label htmlFor="message" className="mb-2 block text-[13px] font-bold text-[#2c1810]">
          {t.formMessageLabel}
        </label>
        <textarea id="message" name="message" rows={5} required placeholder={t.formMessagePlaceholder} className={inputClasses} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ce4a28] px-6 py-3.5 text-[15px] font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8f2e18] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={18} />
        {isSubmitting ? t.formSubmitting : t.formSubmit}
      </button>
      {submitStatus && (
        <div
          className={`mt-4 rounded-[20px] p-3 text-center text-[13px] font-semibold ${
            submitStatus.type === "success"
              ? "border border-[#c0e0c5] bg-[#e6f4ea] text-[#2e6b3e]"
              : "border border-[#f5cdca] bg-[#fee8e7] text-[#b13a32]"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
