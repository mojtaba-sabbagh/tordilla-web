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
            در این بخش طعم‌های مختلف ترددیلا را می‌بینید. هر محصول صفحه اختصاصی
            خود را دارد تا طعم، ویژگی‌ها و اطلاعات تغذیه‌ای آن به‌صورت کامل
            معرفی شود.
          </p>
        </div>
      </div>

      <div className="grid grid-3">
        {products.map((product) => (
          <article className="card" key={product.slug}>
            <img
              alt={product.title}
              className="mb-4 aspect-[4/3] w-full rounded-[18px] object-cover"
              src={product.image}
            />
            <h3>{product.title}</h3>
            <p>{product.shortDescription}</p>
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
