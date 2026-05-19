import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/seed-content";
import { translations } from "@/lib/i18n";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: { lang?: string | string[] };
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const lang = Array.isArray(searchParams?.lang) ? searchParams.lang[0] : searchParams?.lang;
  const locale = lang === "en" ? "en" : "fa";
  const t = translations[locale].productDetail;
  const localeQuery = locale === "en" ? "?lang=en" : "";

  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const nutritionRows = [
    { label: t.nutritionLabels.serving, value: product.nutrition.serving, icon: "⚖️" },
    { label: t.nutritionLabels.energy, value: product.nutrition.energy, icon: "⚡" },
    { label: t.nutritionLabels.sugar, value: product.nutrition.sugar, icon: "🍬" },
    { label: t.nutritionLabels.fat, value: product.nutrition.fat, icon: "🫧" },
    { label: t.nutritionLabels.salt, value: product.nutrition.salt, icon: "🧂" },
    { label: t.nutritionLabels.transFat, value: product.nutrition.transFat, icon: "🔬" },
  ];

  return (
    <div className="product-detail-page" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
      <style>{`
        .product-detail-page {
          background: #fdf8f3;
          min-height: 100vh;
        }

        /* ── BREADCRUMB ── */
        .breadcrumb {
          max-width: 1160px;
          margin: 0 auto;
          padding: 22px 24px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #a07060;
        }
        .breadcrumb a {
          color: #8f1d1d;
          text-decoration: none;
          font-weight: 600;
        }
        .breadcrumb a:hover { text-decoration: underline; }
        .breadcrumb-sep { color: #cbb0a0; }

        /* ── HERO ── */
        .product-hero {
          max-width: 1160px;
          margin: 0 auto;
          padding: 40px 24px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media(max-width: 720px) {
          .product-hero { grid-template-columns: 1fr; gap: 28px; }
        }

        .product-hero-img-wrap {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          background: #f0e6dc;
          box-shadow: 0 24px 64px rgba(143,29,29,0.14);
        }
        .product-hero-img-wrap img {
          display: block;
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
        }
        .product-hero-img-badge {
          position: absolute;
          top: 18px;
          right: 18px;
          padding: 5px 16px;
          border-radius: 9999px;
          background: rgba(143,29,29,0.9);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          backdrop-filter: blur(6px);
        }

        .product-hero-info {
          padding-top: 8px;
        }
        .product-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 16px;
          border-radius: 9999px;
          border: 1.5px solid rgba(143,29,29,0.2);
          background: rgba(143,29,29,0.06);
          color: #8f1d1d;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .product-hero-info h1 {
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 900;
          color: #2c1810;
          line-height: 1.25;
          margin-bottom: 16px;
        }
        .product-hero-info > p {
          font-size: 16px;
          color: #7a5040;
          line-height: 2;
          margin-bottom: 28px;
        }

        .product-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
        }
        .product-tag {
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(143,29,29,0.08);
          color: #8f1d1d;
          font-size: 13px;
          font-weight: 600;
        }

        .product-meta-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 36px;
        }
        .product-meta-pill {
          display: flex;
          flex-direction: column;
          padding: 12px 20px;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 4px 16px rgba(143,29,29,0.08);
          min-width: 100px;
        }
        .product-meta-pill-label {
          font-size: 11px;
          color: #a07060;
          font-weight: 600;
          margin-bottom: 3px;
        }
        .product-meta-pill-value {
          font-size: 14px;
          font-weight: 800;
          color: #2c1810;
        }

        .product-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 9999px;
          background: #8f1d1d;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-primary:hover { background: #6e1515; transform: translateY(-2px); }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 9999px;
          border: 2px solid rgba(143,29,29,0.25);
          color: #8f1d1d;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-outline:hover { border-color: #8f1d1d; background: rgba(143,29,29,0.05); }

        /* ── BODY SECTIONS ── */
        .product-body {
          max-width: 1160px;
          margin: 60px auto 0;
          padding: 0 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── SECTION CARD ── */
        .section-card {
          background: #fff;
          border-radius: 26px;
          padding: 36px;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
        }
        .section-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 900;
          color: #2c1810;
          margin-bottom: 22px;
        }
        .section-card-title-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(143,29,29,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .section-card p {
          font-size: 15px;
          color: #5a3728;
          line-height: 2;
        }

        /* ── NUTRITION TABLE ── */
        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
        }
        .nutrition-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
          padding: 16px 18px;
          border-radius: 16px;
          background: #fdf8f3;
          border: 1.5px solid rgba(143,29,29,0.09);
          transition: border-color 0.2s, background 0.2s;
        }
        .nutrition-cell:hover {
          border-color: rgba(143,29,29,0.22);
          background: #fdf0e8;
        }
        .nutrition-cell-icon { font-size: 20px; }
        .nutrition-cell-label { font-size: 12px; color: #a07060; font-weight: 600; }
        .nutrition-cell-value { font-size: 16px; font-weight: 800; color: #2c1810; }

        /* ── TWO COLUMN ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        @media(max-width: 680px) { .two-col { grid-template-columns: 1fr; } }

        /* ── RELATED PRODUCTS ── */
        .related-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .related-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 16px;
          background: #fdf8f3;
          border: 1.5px solid rgba(143,29,29,0.09);
          text-decoration: none;
          color: #2c1810;
          font-weight: 700;
          font-size: 14px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .related-item:hover {
          background: #fdf0e8;
          border-color: rgba(143,29,29,0.22);
          transform: translateX(-4px);
        }
        .related-item img {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .related-item-arrow {
          margin-right: auto;
          color: #8f1d1d;
          font-size: 18px;
        }
      `}</style>

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href={locale === "en" ? "/?lang=en" : "/"}>{t.breadcrumbHome}</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href={`/products${localeQuery}`}>{t.breadcrumbProducts}</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{product.title}</span>
      </nav>

      {/* Hero */}
      <div className="product-hero">
        <div className="product-hero-img-wrap">
          <img alt={product.title} src={product.image} />
          <span className="product-hero-img-badge">ترددیلا</span>
        </div>

        <div className="product-hero-info">
          <div className="product-hero-badge">{t.heroBadge}</div>
          <h1>{product.title}</h1>
          <p>{product.shortDescription}</p>

          <div className="product-tags">
            {product.features.map((f) => (
              <span className="product-tag" key={f}>{f}</span>
            ))}
          </div>

          <div className="product-meta-pills">
            <div className="product-meta-pill">
              <span className="product-meta-pill-label">{t.packagingLabel}</span>
              <span className="product-meta-pill-value">{product.packaging}</span>
            </div>
            <div className="product-meta-pill">
              <span className="product-meta-pill-label">{t.audienceLabel}</span>
              <span className="product-meta-pill-value">{product.audience}</span>
            </div>
          </div>

          <div className="product-cta-row">
            <Link className="btn-primary" href={`/tordilla-finder${localeQuery}`}>{t.whereToBuy}</Link>
            <Link className="btn-outline" href={`/products${localeQuery}`}>{t.productsButton}</Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="product-body">

        {/* Description */}
        <div className="section-card">
          <h3 className="section-card-title">
            <span className="section-card-title-icon">📖</span>
            {t.descriptionHeading}
          </h3>
          <p>{product.description}</p>
        </div>

        {/* Nutrition + Related */}
        <div className="two-col">
          <div className="section-card">
            <h3 className="section-card-title">
              <span className="section-card-title-icon">🥗</span>
              {t.nutritionHeading}
            </h3>
            <div className="nutrition-grid">
              {nutritionRows.map(({ label, value, icon }) => (
                <div className="nutrition-cell" key={label}>
                  <span className="nutrition-cell-icon">{icon}</span>
                  <span className="nutrition-cell-label">{label}</span>
                  <span className="nutrition-cell-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-card-title">
              <span className="section-card-title-icon">🌽</span>
              {t.relatedHeading}
            </h3>
            <div className="related-list">
              {related.map((item) => (
                <Link className="related-item" href={`/products/${item.slug}${localeQuery}`} key={item.slug}>
                  <img alt={item.title} src={item.image} />
                  {item.title}
                  <span className="related-item-arrow">‹</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
