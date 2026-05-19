// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { translations, getLocaleFromSearchParams } from '@/lib/i18n';

// export const metadata = {
//   title: "تماس با ترددیلا | ارتباط با ما",
//   description:
//     "ارتباط با شرکت کوثر کویر رفسنجان، پشتیبانی و فروش ترددیلا. آدرس، تلفن، فرم تماس و شبکه‌های اجتماعی.",
// };

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const searchParams = useSearchParams();
  const locale = getLocaleFromSearchParams(searchParams);
  const t = translations[locale].contact;
  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: result.message || t.successMessage });
        form.reset();
      } else {
        setSubmitStatus({ type: 'error', message: result.error || t.saveErrorMessage });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus({ type: 'error', message: t.serverErrorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="contact-page" dir={locale === 'fa' ? 'rtl' : 'ltr'} lang={locale}>
      <style>{`
        .contact-page {
          background: #fdf8f3;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .contact-hero {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          padding: 80px 24px 100px;
          text-align: center;
          overflow: hidden;
        }
        .contact-hero::before,
        .contact-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .contact-hero::before {
          width: 360px; height: 360px;
          top: -120px; left: -80px;
          background: rgba(255,255,255,0.05);
        }
        .contact-hero::after {
          width: 280px; height: 280px;
          bottom: -100px; right: -60px;
          background: rgba(255,255,255,0.04);
        }
        .contact-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 18px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .contact-hero h1 {
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .contact-hero p {
          max-width: 560px;
          margin: 0 auto 32px;
          color: rgba(255,255,255,0.78);
          font-size: 16px;
          line-height: 2;
          position: relative;
          z-index: 1;
        }
        .contact-hero-logo {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
        }
        .contact-hero-logo-ring {
          width: 148px;
          height: 148px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 2px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }

        /* wave */
        .contact-wave {
          display: block;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          margin-top: -2px;
        }
        .contact-wave svg { display: block; width: 100%; }

        /* breadcrumb */
        .contact-breadcrumb {
          max-width: 1080px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #a07060;
          border-bottom: 1.5px solid rgba(143,29,29,0.08);
        }
        .contact-breadcrumb a {
          color: #8f1d1d;
          text-decoration: none;
          font-weight: 600;
        }
        .contact-breadcrumb a:hover { text-decoration: underline; }
        .contact-breadcrumb-sep { color: #cbb0a0; }

        /* main container */
        .contact-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 64px 24px 80px;
        }

        /* info cards grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }
        .info-card {
          background: #fff;
          border-radius: 22px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
          border-bottom: 4px solid #8f1d1d;
          transition: transform 0.28s, box-shadow 0.28s;
        }
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(143,29,29,0.14);
        }
        .info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: rgba(143,29,29,0.1);
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .info-icon svg {
          width: 32px;
          height: 32px;
          color: #8f1d1d;
        }
        .info-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #2c1810;
          margin-bottom: 8px;
        }
        .info-card p {
          color: #5a3728;
          font-size: 14px;
          line-height: 1.7;
        }
        .info-card a {
          color: #5a3728;
          text-decoration: none;
          transition: color 0.2s;
        }
        .info-card a:hover {
          color: #8f1d1d;
        }

        /* two column layout */
        .contact-two-columns {
          display: flex;
          flex-direction: row;
          gap: 32px;
          margin-bottom: 64px;
        }
        @media (max-width: 800px) {
          .contact-two-columns {
            flex-direction: column;
          }
        }
        .contact-form-col, .contact-map-col {
          flex: 1;
        }

        /* section card (same as about page) */
        .section-card {
          background: #fff;
          border-radius: 26px;
          padding: 36px 32px;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
          height: 100%;
        }
        @media(max-width: 600px) {
          .section-card { padding: 28px 22px; }
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .section-heading-bar {
          width: 5px;
          height: 36px;
          border-radius: 9999px;
          background: linear-gradient(to bottom, #8f1d1d, #ce4a28);
          flex-shrink: 0;
        }
        .section-heading h2 {
          font-size: clamp(20px, 2.8vw, 28px);
          font-weight: 900;
          color: #2c1810;
        }

        /* form styles */
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #2c1810;
          margin-bottom: 8px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid rgba(143,29,29,0.15);
          border-radius: 20px;
          background: #fff;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8f1d1d;
          box-shadow: 0 0 0 3px rgba(143,29,29,0.1);
        }
        .ltr-input {
          direction: ltr;
          text-align: left;
        }
        .submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: #8f1d1d;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          padding: 14px 24px;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #6b1616;
          transform: translateY(-2px);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .status-message {
          margin-top: 16px;
          padding: 12px;
          border-radius: 20px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
        }
        .status-success {
          background: #e6f4ea;
          color: #2e6b3e;
          border: 1px solid #c0e0c5;
        }
        .status-error {
          background: #fee8e7;
          color: #b13a32;
          border: 1px solid #f5cdca;
        }

        /* map card adjustments */
        .map-wrapper {
          border-radius: 24px;
          overflow: hidden;
          height: 100%;
          min-height: 420px;
        }
        .map-wrapper iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        /* company info double card */
        .company-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 64px;
        }
        @media (max-width: 700px) {
          .company-grid {
            grid-template-columns: 1fr;
          }
        }
        .company-card {
          background: #fff;
          border-radius: 26px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
        }
        .company-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #2c1810;
          margin-bottom: 16px;
          border-right: 4px solid #8f1d1d;
          padding-right: 16px;
        }
        .company-card p {
          color: #5a3728;
          line-height: 1.9;
          font-size: 14px;
        }

        /* instagram CTA (like about cta) */
        .contact-cta {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          border-radius: 28px;
          padding: 52px 44px;
          text-align: center;
          overflow: hidden;
          margin-bottom: 48px;
        }
        .contact-cta::before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .contact-cta::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -50px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }
        .contact-cta h2 {
          font-size: clamp(22px, 3vw, 34px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .contact-cta p {
          color: rgba(255,255,255,0.75);
          font-size: 15px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }
        .btn-white {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          border-radius: 9999px;
          background: #fff;
          color: #8f1d1d;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-white:hover { background: #f5ede6; transform: translateY(-2px); }

        /* social icons row (similar to about) */
        .social-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-top: 32px;
        }
        .social-icon-link {
          display: inline-flex;
          width: 72px;
          height: 72px;
          background: rgba(255,255,255,0.15);
          border-radius: 9999px;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, background 0.2s;
        }
        .social-icon-link:hover {
          transform: scale(1.05);
          background: rgba(255,255,255,0.25);
        }
        .social-icon-link svg {
          width: 48px;
          height: 48px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="contact-hero-badge">{t.heroBadge}</div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
        <div className="contact-hero-logo">
          <div className="contact-hero-logo-ring">
            <Image
              src="/home/logo.png"
              alt="لوگوی ترددیلا"
              width={108}
              height={108}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* wave */}
      <div className="contact-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ height: 52 }}>
          <path d="M0,0 C300,60 900,60 1200,0 L1200,60 L0,60 Z" fill="#fdf8f3" />
        </svg>
      </div>

      {/* breadcrumb */}
      <nav className="contact-breadcrumb">
        <Link href={homeHref}>{t.breadcrumbHome}</Link>
        <span className="contact-breadcrumb-sep">›</span>
        <span>{t.breadcrumbCurrent}</span>
      </nav>

      <div className="contact-container">
        {/* Contact info cards */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon"><MapPin /></div>
            <h3>{t.addressTitle}</h3>
            <p>
              {t.addressLines[0]}<br />
              {t.addressLines[1]}
            </p>
          </div>
          <div className="info-card">
            <div className="info-icon"><Phone /></div>
            <h3>{t.phoneTitle}</h3>
            <p><a href="tel:09426002408">{t.phoneNumber}</a></p>
          </div>
          <div className="info-card">
            <div className="info-icon"><Mail /></div>
            <h3>{t.emailTitle}</h3>
            <p><a href="mailto:it@tordilla.ir">{t.emailAddress}</a></p>
          </div>
          <div className="info-card">
            <div className="info-icon"><Clock /></div>
            <h3>{t.hoursTitle}</h3>
            <p>{t.hoursText}</p>
          </div>
        </div>

        {/* Form + Map */}
        <div className="contact-two-columns">
          <div className="contact-form-col">
            <div className="section-card">
              <div className="section-heading">
                <div className="section-heading-bar" />
                <h2>{t.formHeading}</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t.formNameLabel}</label>
                  <input type="text" id="name" name="name" required placeholder={t.formNamePlaceholder} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t.formEmailLabel}</label>
                  <input type="email" id="email" name="email" required className="ltr-input" placeholder={t.formEmailPlaceholder} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t.formPhoneLabel}</label>
                  <input type="tel" id="phone" name="phone" className="ltr-input" placeholder={t.formPhonePlaceholder} />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">{t.formSubjectLabel}</label>
                  <input type="text" id="subject" name="subject" required placeholder={t.formSubjectPlaceholder} />
                </div>
                <div className="form-group">
                  <label htmlFor="message">{t.formMessageLabel}</label>
                  <textarea id="message" name="message" rows={5} required placeholder={t.formMessagePlaceholder} />
                </div>
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  <Send size={18} />
                  {isSubmitting ? t.formSubmitting : t.formSubmit}
                </button>
                {submitStatus && (
                  <div className={`status-message ${submitStatus.type === 'success' ? 'status-success' : 'status-error'}`}>
                    {submitStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="contact-map-col">
            <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="map-wrapper">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.123456789012!2x55.3890!3x30.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0143e6b3c0e1%3A0x2b9a8f0b1c2d3e4f!2sRafsanjan%2C%20Kerman%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  title={t.mapTitle}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company info section */}
        <div className="company-grid">
          <div className="company-card">
            <h3>{t.companyCard1Title}</h3>
            <p>{t.companyCard1Text}</p>
          </div>
          <div className="company-card">
            <h3>{t.companyCard2Title}</h3>
            <p>{t.companyCard2Text}</p>
          </div>
        </div>

        {/* Instagram CTA */}
        <div className="contact-cta">
          <h2>{t.ctaHeading}</h2>
          <p>{t.ctaText}</p>
          <a
            href="https://instagram.com/tordillachips/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white"
          >
            {t.ctaButton}
          </a>
        </div>

        {/* Social networks section (full icon row) */}
        <div className="social-row">
          <a
            aria-label={t.instagramAria}
            className="social-icon-link"
            href="https://instagram.com/tordillachips/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 107.47 107.47" fill="white">
              <path d="M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z"/>
              <path d="M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z"/>
              <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z"/>
            </svg>
          </a>
          <a
            aria-label={t.twitterAria}
            className="social-icon-link"
            href="https://twitter.com/tordillachips"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 107.47 107.47" fill="white">
              <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z"/>
            </svg>
          </a>
          <a
            aria-label={t.facebookAria}
            className="social-icon-link"
            href="https://www.facebook.com/tordillachips"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 107.47 107.47" fill="white">
              <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z"/>
            </svg>
          </a>
          <a
            aria-label={t.aparatAria}
            className="social-icon-link"
            href="https://www.aparat.com/tordilla.chips"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 107.47 107.47" fill="white">
              <circle cx="45.33" cy="41.28" fill="#fff" r="8.18" transform="translate(-15.92 44.14) rotate(-45)"/>
              <path d="M57.46,54a3.82,3.82,0,1,0-3.81,3.82A3.82,3.82,0,0,0,57.46,54Z" fill="#fff"/>
              <circle cx="61.68" cy="66.91" fill="#fff" r="8.18" transform="translate(-29.25 63.21) rotate(-45)"/>
              <circle cx="41.05" cy="62.95" fill="#fff" r="8.18" transform="translate(-32.49 47.47) rotate(-45)"/>
              <circle cx="65.74" cy="45.03" fill="#fff" r="8.18" transform="translate(-8.59 16.31) rotate(-13.28)"/>
              <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0Zm-25,29.55A13.55,13.55,0,0,1,45.4,20.1l5.43,1.5A32.27,32.27,0,0,0,27,35.65Zm.56,48.72a13.59,13.59,0,0,1-9.45-16.71l1.7-6.12A32.23,32.23,0,0,0,34.68,79.77Zm49.51-.35a13.59,13.59,0,0,1-16.71,9.45l-5.42-1.51a32.21,32.21,0,0,0,23.82-14Zm-25,4.67A28.86,28.86,0,1,1,82.59,53.73,28.86,28.86,0,0,1,53.73,82.59ZM87.65,45.91,86,52A32.26,32.26,0,0,0,72.79,27.69L78.2,29.2A13.56,13.56,0,0,1,87.65,45.91Z"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}