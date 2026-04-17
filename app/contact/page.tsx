import { contactCards } from "@/lib/seed-content";

export default function ContactPage() {
  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="tag">تماس</span>
          <h1>راه‌های ارتباطی و استقرار</h1>
          <p>
            این صفحه می‌تواند با فرم تماس، ثبت سفارش عمده یا درخواست نمایندگی
            تکمیل شود. در این نسخه، مسیرهای اصلی ارتباط و دامنه‌های فعلی درج شده
            است.
          </p>
        </div>
      </div>

      <div className="grid grid-3">
        {contactCards.map((item) => (
          <a className="card" href={item.href} key={item.href}>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
