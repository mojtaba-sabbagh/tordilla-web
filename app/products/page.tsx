import Link from "next/link";
import { products, getLocalizedProduct } from "@/lib/seed-content";
import { translations } from "@/lib/i18n";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = params?.lang === "en" ? "en" : "fa";
  const t = translations[locale].products;
  const localeQuery = `?lang=${locale}`;

  return (
    <div className="products-page" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
      <style>{`
        .products-page {
          background: #fdf8f3;
          min-height: 100vh;
        }

        .products-hero {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          padding: 72px 24px 80px;
          text-align: center;
          overflow: hidden;
        }
        .products-hero::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }
        .products-hero::after {
          content: '';
          position: absolute;
          bottom: -100px; right: -60px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }
        .products-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 18px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .products-hero h1 {
          font-size: clamp(30px, 5vw, 52px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .products-hero p {
          max-width: 580px;
          margin: 0 auto;
          color: rgba(255,255,255,0.78);
          font-size: 16px;
          line-height: 2;
          position: relative;
          z-index: 1;
        }

        .products-grid-wrap {
          max-width: 1240px;
          margin: 0 auto;
          padding: 72px 24px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        .product-card {
          background: #fff;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(143,29,29,0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.32s ease, box-shadow 0.32s ease;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
        }
        .product-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 24px 56px rgba(143,29,29,0.16);
        }
        .product-card-img-wrap {
          position: relative;
          overflow: hidden;
          background: #f5ede6;
        }
        .product-card-img-wrap img {
          display: block;
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          transition: transform 0.55s ease;
        }
        .product-card:hover .product-card-img-wrap img {
          transform: scale(1.06);
        }
        .product-card-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 4px 13px;
          border-radius: 9999px;
          background: rgba(143,29,29,0.88);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(6px);
        }
        .product-card-body {
          padding: 22px 22px 26px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-card-body h3 {
          font-size: 20px;
          font-weight: 800;
          color: #2c1810;
          margin-bottom: 10px;
        }
        .product-card-body p {
          font-size: 14px;
          color: #7a5040;
          line-height: 1.85;
          flex: 1;
        }
        .product-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 14px 0;
        }
        .product-feature-tag {
          display: inline-block;
          padding: 3px 11px;
          border-radius: 9999px;
          background: rgba(143,29,29,0.07);
          color: #8f1d1d;
          font-size: 12px;
          font-weight: 600;
        }
        .product-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 18px;
          padding: 11px 22px;
          border-radius: 9999px;
          background: #8f1d1d;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          align-self: flex-start;
          transition: background 0.2s, transform 0.2s;
        }
        .product-card-cta:hover {
          background: #6e1515;
          transform: translateX(-3px);
        }
        .product-card-cta-arrow {
          font-size: 18px;
          line-height: 1;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="products-hero">
        <div className="products-hero-badge">{t.heroBadge}</div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
      </section>

      <div className="products-grid-wrap">
        <div className="products-grid">
          {products.map((product, index) => {
            const localized = getLocalizedProduct(product, locale);
            return (
              <article
                className="product-card"
                key={product.slug}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="product-card-img-wrap">
                  <img alt={localized.title} src={product.image} />
                  <span className="product-card-badge">{t.tordillaLabel}</span>
                </div>
                <div className="product-card-body">
                  <h3>{localized.title}</h3>
                  <p>{localized.shortDescription}</p>
                  <div className="product-features">
                    {localized.features.slice(0, 3).map((feature) => (
                      <span className="product-feature-tag" key={feature}>
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link className="product-card-cta" href={`/products/${product.slug}${localeQuery}`}>
                    {t.viewDetails}
                    <span className="product-card-cta-arrow">‹</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}