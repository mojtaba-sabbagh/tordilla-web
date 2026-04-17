export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>ترددیلا</strong>
          <p>نسخه Next.js آماده استقرار در Docker و توسعه روی Ubuntu / Debian.</p>
        </div>

        <div>
          <p>WordPress API: `WORDPRESS_API_URL`</p>
          <p>Public URL: `NEXT_PUBLIC_SITE_URL`</p>
        </div>
      </div>
    </footer>
  );
}
