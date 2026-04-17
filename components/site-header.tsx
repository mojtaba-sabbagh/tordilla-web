import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link className="brand" href="/">
          <span className="brand-badge">T</span>
          <span>ترددیلا</span>
        </Link>

        <nav className="nav">
          <Link href="/">خانه</Link>
          <Link href="/products">محصولات</Link>
          <Link href="/about">درباره ما</Link>
          <Link href="/cinema">راهکار سینما</Link>
          <Link href="/blog">بلاگ</Link>
          <Link href="/contact">تماس</Link>
        </nav>
      </div>
    </header>
  );
}
