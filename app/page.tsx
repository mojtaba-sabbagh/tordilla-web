import Link from "next/link";
import {
  cinemaPartners,
  heroHighlights,
  posts,
  products,
  siteMeta,
} from "@/lib/seed-content";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-grid">
          <div className="panel hero-copy">
            <span className="eyebrow">بازطراحی از WordPress به Next.js</span>
            <h1>ترددیلا برای منوی حرفه‌ای، سرو سریع و رشد فروش</h1>
            <p>
              این پروژه پایه‌ای برای جایگزینی کامل سایت وردپرسی ترددیلا است.
              ساختار جدید برای سرعت بهتر، سئوی تمیزتر، استقرار ساده در Docker و
              توسعه مرحله‌ای به فروش و پنل مدیریت آماده شده است.
            </p>

            <div className="list">
              {heroHighlights.map((item) => (
                <span key={item}>• {item}</span>
              ))}
            </div>

            <div className="actions">
              <Link className="button" href="/products">
                مشاهده محصولات
              </Link>
              <Link className="button-secondary" href="/contact">
                شروع همکاری
              </Link>
            </div>
          </div>

          <div className="panel hero-card">
            <span className="tag">استقرار آماده Production</span>
            <h2>{siteMeta.name}</h2>
            <p>
              معماری جدید می‌تواند به صورت SSG / ISR اجرا شود و محتوای بلاگ را از
              WordPress REST API دریافت کند. این یعنی مهاجرت را می‌توان بدون قطع
              کامل سیستم قبلی مرحله‌بندی کرد.
            </p>

            <div className="kpis">
              <div className="kpi">
                <strong>Next.js</strong>
                <span>App Router و SEO-ready</span>
              </div>
              <div className="kpi">
                <strong>Docker</strong>
                <span>سازگار با Ubuntu / Debian</span>
              </div>
              <div className="kpi">
                <strong>WP API</strong>
                <span>پشتیبانی از دریافت پست‌ها</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">محصولات</span>
            <h2>خط محصول برای بازار حرفه‌ای غذا</h2>
          </div>
          <Link href="/products">همه محصولات</Link>
        </div>

        <div className="grid grid-3">
          {products.map((product) => (
            <article className="card" key={product.slug}>
              <h3>{product.title}</h3>
              <p>{product.shortDescription}</p>
              <div className="list">
                <span>بسته‌بندی: {product.packaging}</span>
                <span>مخاطب: {product.audience}</span>
              </div>
              <div className="actions">
                <Link className="button-secondary" href={`/products/${product.slug}`}>
                  جزئیات بیشتر
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">سینما و تفریح</span>
            <h2>مدل همکاری برای بوفه‌های پرتردد</h2>
          </div>
          <Link href="/cinema">راهکار سینما</Link>
        </div>

        <div className="grid grid-3">
          {cinemaPartners.map((partner) => (
            <article className="card" key={`${partner.city}-${partner.venue}`}>
              <h3>{partner.venue}</h3>
              <p>{partner.note}</p>
              <span className="tag">{partner.city}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">بلاگ</span>
            <h2>محتوای قابل مهاجرت از وردپرس</h2>
          </div>
          <Link href="/blog">ورود به بلاگ</Link>
        </div>

        <div className="grid grid-2">
          {posts.map((post) => (
            <article className="card" key={post.slug}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="actions">
                <Link className="button-secondary" href={`/blog/${post.slug}`}>
                  مطالعه مطلب
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
