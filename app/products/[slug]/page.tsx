import { notFound } from "next/navigation";
import Link from "next/link";
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
          <img
            alt={product.title}
            className="mb-5 aspect-[4/3] w-full rounded-[22px] object-cover"
            src={product.image}
          />
          <h3>معرفی محصول</h3>
          <p>{product.description}</p>
        </article>

        <aside className="card">
          <h3>ویژگی‌ها و اطلاعات محصول</h3>
          <div className="list">
            <span>بسته‌بندی: {product.packaging}</span>
            <span>مخاطب: {product.audience}</span>
            {product.features.map((feature) => (
              <span key={feature}>• {feature}</span>
            ))}
          </div>
        </aside>
      </div>

      <div className="split">
        <article className="card">
          <h3>ارزش غذایی</h3>
          <div className="list">
            <span>اندازه هر سهم: {product.nutrition.serving}</span>
            <span>انرژی: {product.nutrition.energy}</span>
            <span>قند: {product.nutrition.sugar}</span>
            <span>چربی: {product.nutrition.fat}</span>
            <span>نمک: {product.nutrition.salt}</span>
            <span>اسیدهای چرب ترانس: {product.nutrition.transFat}</span>
          </div>
        </article>

        <aside className="card">
          <h3>محصولات دیگر</h3>
          <div className="list">
            {products
              .filter((item) => item.slug !== product.slug)
              .slice(0, 4)
              .map((item) => (
                <Link href={`/products/${item.slug}`} key={item.slug}>
                  • {item.title}
                </Link>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
