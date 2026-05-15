// app/about/page.tsx
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "درباره ترددیلا | چیپس ذرت ترددیلا",
  description:
    "آشنایی با ترددیلا، محصولات، نام تجاری و شرکت کوثر کویر رفسنجان - تولید کننده چیپس ذرت با کیفیت",
};

const features = [
  { icon: "🌿", title: "مواد اولیه مرغوب", desc: "تهیه شده از بهترین ذرت ایرانی" },
  { icon: "📦", title: "بسته‌بندی سه لایه", desc: "ضامن تازگی و سلامت محصول" },
  { icon: "✅", title: "بدون مواد نگهدارنده", desc: "محصولی سالم و طبیعی" },
  { icon: "🎨", title: "هشت طعم متنوع", desc: "مناسب برای همه سلیقه‌ها" },
  { icon: "🌱", title: "رنگ طبیعی", desc: "آنتی‌اکسیدان طبیعی، سالم و لذت‌بخش" },
];

const stats = [
  { value: "۱۳۷۲", label: "سال تأسیس", sub: "بیش از سه دهه تجربه" },
  { value: "۸", label: "طعم متنوع", sub: "برای هر سلیقه‌ای" },
  { value: "۱۰۰٪", label: "طبیعی و سالم", sub: "بدون مواد نگهدارنده" },
];

export default function AboutPage() {
  return (
    <main className="about-page" dir="rtl">
      <style>{`
        .about-page {
          background: #fdf8f3;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .about-hero {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          padding: 80px 24px 100px;
          text-align: center;
          overflow: hidden;
        }
        .about-hero::before,
        .about-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .about-hero::before {
          width: 360px; height: 360px;
          top: -120px; left: -80px;
          background: rgba(255,255,255,0.05);
        }
        .about-hero::after {
          width: 280px; height: 280px;
          bottom: -100px; right: -60px;
          background: rgba(255,255,255,0.04);
        }
        .about-hero-badge {
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
        .about-hero h1 {
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .about-hero p {
          max-width: 560px;
          margin: 0 auto 32px;
          color: rgba(255,255,255,0.78);
          font-size: 16px;
          line-height: 2;
          position: relative;
          z-index: 1;
        }
        .about-hero-logo {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
        }
        .about-hero-logo-ring {
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

        /* wave separator */
        .about-wave {
          display: block;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          margin-top: -2px;
        }
        .about-wave svg { display: block; width: 100%; }

        /* ── BREADCRUMB ── */
        .about-breadcrumb {
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
        .about-breadcrumb a {
          color: #8f1d1d;
          text-decoration: none;
          font-weight: 600;
        }
        .about-breadcrumb a:hover { text-decoration: underline; }
        .about-breadcrumb-sep { color: #cbb0a0; }

        /* ── BODY ── */
        .about-body {
          max-width: 1080px;
          margin: 0 auto;
          padding: 64px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── SECTION CARD ── */
        .section-card {
          background: #fff;
          border-radius: 26px;
          padding: 44px;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
        }
        @media(max-width: 600px) { .section-card { padding: 28px 22px; } }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
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
        .section-subheading {
          font-size: 14px;
          font-weight: 700;
          color: #8f1d1d;
          margin-bottom: 18px;
        }
        .section-prose {
          font-size: 15px;
          color: #5a3728;
          line-height: 2.1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── STATS ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media(max-width: 560px) { .stats-row { grid-template-columns: 1fr; } }
        .stat-card {
          background: #fff;
          border-radius: 22px;
          padding: 32px 20px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
          border-bottom: 4px solid #8f1d1d;
          transition: transform 0.28s, box-shadow 0.28s;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(143,29,29,0.14);
        }
        .stat-value {
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 900;
          color: #8f1d1d;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 15px;
          font-weight: 800;
          color: #2c1810;
          margin-bottom: 5px;
        }
        .stat-sub {
          font-size: 12px;
          color: #a07060;
          font-weight: 500;
        }

        /* ── FEATURES ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }
        .feature-card {
          background: #fdf8f3;
          border: 1.5px solid rgba(143,29,29,0.1);
          border-radius: 20px;
          padding: 24px 18px;
          text-align: center;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(143,29,29,0.3);
          background: #fdf0e8;
          transform: translateY(-4px);
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
        .feature-title {
          font-size: 14px;
          font-weight: 800;
          color: #2c1810;
          margin-bottom: 6px;
        }
        .feature-desc {
          font-size: 12px;
          color: #a07060;
          line-height: 1.7;
        }

        /* ── HIGHLIGHT QUOTE ── */
        .highlight-quote {
          border-right: 4px solid #8f1d1d;
          padding: 12px 20px;
          background: rgba(143,29,29,0.05);
          border-radius: 0 12px 12px 0;
          font-weight: 700;
          color: #8f1d1d;
          font-size: 15px;
        }

        /* ── CTA ── */
        .about-cta {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          border-radius: 28px;
          padding: 52px 44px;
          text-align: center;
          overflow: hidden;
        }
        .about-cta::before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .about-cta::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -50px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }
        .about-cta h2 {
          font-size: clamp(22px, 3vw, 34px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .about-cta p {
          color: rgba(255,255,255,0.75);
          font-size: 15px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }
        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
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
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          border-radius: 9999px;
          border: 2px solid rgba(255,255,255,0.4);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .btn-ghost:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-badge">🌽 از سال ۱۳۷۲ با شما</div>
        <h1>درباره ترددیلا</h1>
        <p>آشنایی با برند ترددیلا، محصولات با کیفیت و شرکت کوثر کویر رفسنجان</p>
        <div className="about-hero-logo">
          <div className="about-hero-logo-ring">
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
      <div className="about-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ height: 52 }}>
          <path d="M0,0 C300,60 900,60 1200,0 L1200,60 L0,60 Z" fill="#fdf8f3" />
        </svg>
      </div>

      {/* ── BREADCRUMB ── */}
      <nav className="about-breadcrumb">
        <Link href="/">خانه</Link>
        <span className="about-breadcrumb-sep">›</span>
        <span>درباره ترددیلا</span>
      </nav>

      {/* ── BODY ── */}
      <div className="about-body">

        {/* Stats */}
        <div className="stats-row">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Products section */}
        <div className="section-card">
          <div className="section-heading">
            <div className="section-heading-bar" />
            <h2>محصولات ترددیلا</h2>
          </div>
          <div className="section-subheading">چیپس ترتیلا ذرت: تردی اصیل، طعمی دلنشین</div>
          <div className="section-prose">
            <p>
              لذت یک میان‌وعده بی‌نظیر را با چیپس ترتیلا ذرت تجربه کنید. این چیپس‌های ترد و
              خوش‌طعم، که از بهترین مواد اولیه و دانه‌های ذرت مرغوب تهیه شده‌اند، همراهی عالی
              برای لحظات شاد شما هستند. برش‌های مثلثی و فرآوری دقیق، تردی فوق‌العاده‌ای به این
              چیپس‌ها می‌بخشد که هر کسی را شیفته خود می‌کند.
            </p>
            <p>
              چیپس ترتیلا ذرت، چه به تنهایی و چه در کنار انواع دیپ، سس سالسا، گواکاموله یا پنیر،
              تجربه‌ای فراموش‌نشدنی خلق می‌کند. انتخاب ایده‌آل برای مهمانی‌ها، تماشای فیلم یا هر
              جمع دوستانه.
            </p>
            <p>
              تنوع طعم‌ها یکی از خواسته‌های مهم مصرف‌کنندگان است و به همین جهت، ترددیلا با
              بهترین طعم‌دهنده‌های وارداتی از کشورهای سوئیس و اسپانیا، در هشت طعم مختلف تولید
              و به بازار عرضه می‌شود. در تولید ترددیلا از هیچ‌گونه مواد نگهدارنده استفاده نمی‌شود
              و بسته‌بندی سه لایه و غیرقابل نفوذ، ضامن تازگی و سلامت آن است.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Brand section */}
        <div className="section-card">
          <div className="section-heading">
            <div className="section-heading-bar" />
            <h2>نام تجاری ترددیلا</h2>
          </div>
          <div className="section-prose">
            <p>
              باعث افتخارمان است که از سال ۱۳۷۲ تا کنون با تولید انواع میان‌وعده، چیپس و
              پاپ‌کرن با نام تجاری ترددیلا توانسته‌ایم در کنار هواداران‌مان باشیم.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="highlight-quote">«رنگین‌کمان مزه‌ها»</div>
              <div className="highlight-quote">«مزه‌ی دورهمی‌های بامزه»</div>
            </div>
            <p>
              با بسته‌بندی جدید و طعم‌های با کیفیت‌تر از قبل در کنار شما هستیم. امیدواریم که
              بتوانیم در سال‌های پیش‌رو، با ورود به بازارهای منطقه‌ای، نقشی در افزایش صادرات
              کشور بر عهده بگیریم و توانمان را در رقابت با برندهای بین‌المللی اثبات کنیم.
            </p>
          </div>
        </div>

        {/* Company section */}
        <div className="section-card">
          <div className="section-heading">
            <div className="section-heading-bar" />
            <h2>درباره شرکت</h2>
          </div>
          <div className="section-prose">
            <p>
              شرکت کوثر کویر رفسنجان واقع شده در شهر طلای سبز، واحد نمونه صنعتی در استان
              کرمان می‌باشد. این شرکت به فعالیت‌های متعددی از جمله تولید و بسته‌بندی چیپس و
              اسنک، فرآوری و بسته‌بندی انواع خشکبار خصوصاً پسته، واردات و صادرات محصولات
              خود به سایر شرکت‌های همکار می‌پردازد.
            </p>
            <p>
              شرکت کوثر کویر رفسنجان دفتر مرکزی خود را در تهران از سال ۱۳۸۷ راه‌اندازی نمود.
              کلیه امور بازرگانی و فروش از جمله فروش مویرگی در تهران، مدیریت فروش شهرستان‌ها،
              صادرات محصولات با برند تجاری ترددیلا و واردات و صادرات انواع خشکبار، ذرت و سایر
              اقلام مورد نیاز شرکت را بر عهده دارد.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2>با ترددیلا همراه شوید</h2>
          <p>
            برای اطلاع از محصولات جدید و طعم‌های متنوع، ما را در شبکه‌های اجتماعی دنبال کنید
          </p>
          <div className="cta-buttons">
            <Link href="/contact" className="btn-white">تماس با ما</Link>
            <a href="https://instagram.com/tordillachips/" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              اینستاگرام ترددیلا
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
