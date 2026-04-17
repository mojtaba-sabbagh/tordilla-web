import { notFound } from "next/navigation";
import { products } from "@/lib/seed-content";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container section article">
      <div className="page-head">
        <div>
          <span className="tag">محصول</span>
          <h1>{product.title}</h1>
          <p>{product.shortDescription}</p>
        </div>
      </div>

      <div className="split">
        <article className="card">
          <h3>معرفی محصول</h3>
          <p>{product.description}</p>
        </article>

        <aside className="card">
          <h3>جزئیات اجرایی</h3>
          <div className="list">
            <span>بسته‌بندی: {product.packaging}</span>
            <span>مخاطب: {product.audience}</span>
            {product.features.map((feature) => (
              <span key={feature}>• {feature}</span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
