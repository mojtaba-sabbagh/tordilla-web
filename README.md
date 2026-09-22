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

متغیرهای اختیاری آمار بازدید:

- `ANALYTICS_TIMEZONE`: منطقهٔ زمانی محاسبهٔ بازه‌های روزانه/هفتگی (پیش‌فرض `Asia/Tehran`)
- `ANALYTICS_SALT`: نمک هش شناسهٔ بازدیدکننده (پیش‌فرض: مقدار `JWT_SECRET`)
- `GEOIP_API_URL`: سرویس تبدیل IP به موقعیت مکانی؛ `{ip}` جای آدرس قرار می‌گیرد.
  پیش‌فرض روی `ip-api.com` تنظیم شده است. برای خاموش‌کردن کامل جست‌وجوی موقعیت،
  این متغیر را خالی بگذارید.

## آمار بازدید

هر بازدید صفحه از طریق `POST /api/track` ثبت و در جدول `PageView` ذخیره می‌شود:
مسیر صفحه، IP، موقعیت مکانی، ارجاع‌دهنده، دستگاه، مرورگر و سیستم‌عامل.

- گزارش‌ها در `/admin/analytics` در دسترس‌اند: بازهٔ دلخواه یا آماده (امروز، ۷ روز،
  ۳۰ روز، ۹۰ روز، یک سال)، نمودار ساعتی/روزانه/هفتگی/ماهانه، تفکیک صفحه، کشور،
  شهر، ارجاع‌دهنده و دستگاه، به‌همراه فهرست کامل بازدیدها و خروجی CSV.
- مسیرهای `/admin` و `/api` شمارش نمی‌شوند و ربات‌ها به‌صورت پیش‌فرض از آمار کنار
  گذاشته می‌شوند (با یک تیک قابل نمایش‌اند).
- IP واقعی از هدر `X-Forwarded-For` خوانده می‌شود؛ بنابراین Nginx باید این هدر را
  ست کند (نمونه کانفیگ پایین همین کار را می‌کند).

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
