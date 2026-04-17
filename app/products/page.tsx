import Link from "next/link";
import { products } from "@/lib/seed-content";

export default function ProductsPage() {
  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="tag">محصولات</span>
          <h1>محصولات ترددیلا</h1>
          <p>
            این بخش جایگزین صفحات محصول وردپرس است و می‌تواند بعدا به API فروش،
            فرم درخواست نمایندگی یا پنل ثبت سفارش متصل شود.
          </p>
        </div>
      </div>

      <div className="grid grid-3">
        {products.map((product) => (
          <article className="card" key={product.slug}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <div className="list">
              {product.features.map((feature) => (
                <span key={feature}>• {feature}</span>
              ))}
            </div>
            <div className="actions">
              <Link className="button" href={`/products/${product.slug}`}>
                مشاهده جزئیات
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
