import { cinemaPartners } from "@/lib/seed-content";

export default function CinemaPage() {
  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="tag">سینما</span>
          <h1>راهکار ترددیلا برای بوفه‌های سینمایی</h1>
          <p>
            این بخش برای بازتولید صفحه‌های معرفی همکاری با سینماها طراحی شده است و
            می‌تواند به کیس‌استادی، فرم همکاری و بخش FAQ توسعه پیدا کند.
          </p>
        </div>
      </div>

      <div className="grid grid-3">
        {cinemaPartners.map((item) => (
          <article className="card" key={`${item.city}-${item.venue}`}>
            <h3>{item.venue}</h3>
            <p>{item.note}</p>
            <span className="tag">{item.city}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
