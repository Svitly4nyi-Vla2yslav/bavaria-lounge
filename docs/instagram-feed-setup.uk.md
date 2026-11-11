# Instagram на сайті Bavaria Lounge

Інтеграція використовує офіційний Instagram API with Instagram Login. Токен зберігається лише в Netlify, а браузер звертається до `/.netlify/functions/instagram-feed`.

## Що вже підготовлено

- секція одразу після hero з активними Stories і 12 останніми публікаціями;
- підтримка фото, Reels/відео та каруселей;
- адаптивні loading, empty і error/fallback стани;
- серверне кешування та прихований від браузера access token;
- автоматичне оновлення під час відкриття сторінки (CDN-кеш до 5 хвилин).

## Змінні Netlify

Відкрийте **Netlify → Site configuration → Environment variables** і додайте:

```text
INSTAGRAM_ACCESS_TOKEN=<long-lived token>
INSTAGRAM_USER_ID=<Instagram User ID; необов'язково, якщо працює /me>
INSTAGRAM_API_VERSION=v26.0
```

Після збереження змінних запустіть новий deploy. Перевірте `/.netlify/functions/instagram-feed`: відповідь повинна містити `"ok":true`. У браузері токен і прямі запити до `graph.instagram.com` з'являтися не повинні.

Для читання власного професійного акаунта потрібен дозвіл `instagram_business_basic`. Stories доступні лише поки вони активні (приблизно 24 години); архів Stories API не повертає. Long-lived token потрібно оновлювати до завершення строку його дії.
