# Tordilla Web

نسخه جدید Next.js برای جایگزینی وب‌سایت وردپرسی ترددیلا.

## کاری که این پروژه الان انجام می‌دهد

- ساختار چندصفحه‌ای برای خانه، محصولات، بلاگ، درباره ما، تماس و راهکار سینما
- پشتیبانی از راست‌به‌چپ و محتوای فارسی
- دریافت پست‌های بلاگ از `WORDPRESS_API_URL/wp-json/wp/v2/posts`
- داده محلی برای مواقعی که API وردپرس در دسترس نیست
- Dockerfile و `docker-compose.yml` برای استقرار روی Ubuntu / Debian

## توسعه محلی

```bash
npm install
npm run dev
```

## متغیرهای محیطی

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SITE_URL`: دامنه نهایی سایت Next.js
- `WORDPRESS_API_URL`: آدرس پایه وردپرس فعلی برای خواندن پست‌ها

## اجرای Docker

```bash
docker compose up --build -d
```

سپس روی `http://SERVER_IP:3000` در دسترس است.

## استقرار پشت Nginx روی Ubuntu / Debian

1. روی سرور Docker و Docker Compose Plugin را نصب کنید.
2. سورس پروژه را روی سرور کپی کنید.
3. فایل `.env` را با دامنه نهایی تنظیم کنید.
4. سرویس را با `docker compose up --build -d` بالا بیاورید.
5. Nginx را به پورت `3000` پروکسی کنید.

نمونه کانفیگ Nginx:

```nginx
server {
    listen 80;
    server_name tordillafood.com www.tordilla.ir;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## گام بعدی برای مهاجرت کامل

1. استخراج کامل نقشه صفحات وردپرس و URL های فعلی
2. اتصال محصولات واقعی از WooCommerce یا یک API سفارشی
3. انتقال فرم‌ها، فایل‌های رسانه‌ای و ریدایرکت‌های SEO
4. قرار دادن Nginx + Certbot برای HTTPS
