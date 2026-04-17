import { aboutCopy } from "@/lib/seed-content";

export default function AboutPage() {
  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="tag">درباره ما</span>
          <h1>درباره ترددیلا</h1>
          <p>{aboutCopy.intro}</p>
        </div>
      </div>

      <div className="grid grid-3">
        {aboutCopy.points.map((point) => (
          <article className="card" key={point}>
            <h3>مزیت</h3>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
