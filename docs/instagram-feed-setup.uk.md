# Instagram у Bavaria Lounge: Unified Login

Сайт отримує Instagram-контент через серверну Netlify Function, не з браузера. Токен зберігається в `.env` локально або у секретних змінних Netlify. На фронтенді використовується лише маршрут `/.netlify/functions/instagram-feed`.

## Налаштована схема

- Підключений Instagram Business account: `bavaria_cocktail_lounge`.
- Instagram User ID: `17841403390955028`.
- Meta Unified Login, **Graph API `graph.facebook.com`**, не старий `graph.instagram.com`.
- Запити профілю, постів/Reels і Stories виконуються сервером з `Authorization: Bearer <token>`.
- Пости та Reels передаються в `posts`; активні Stories у `stories`; `storiesAvailable` вказує, чи Stories API відповів без помилки.
- Порожній `stories: []` сам собою не означає збій: активних Stories може не бути.
- CDN-кеш відповіді до 5 хвилин, браузер оновлює вміст, коли користувач дозволив зовнішні медіа.

## Змінні середовища

У приватний `.env` для локального запуску або в **Netlify → Project configuration → Environment variables**:

```dotenv
INSTAGRAM_ACCESS_TOKEN=your-private-unified-login-token
INSTAGRAM_USER_ID=17841403390955028
INSTAGRAM_API_VERSION=v27.0
```

Не додавати токен у `index.html`, `assets/app.js`, URL запиту з браузера або GitHub. `.env` уже ігнорується Git.

## Локальний запуск: не використовуй VS Code Live Server

**Live Server, Python `http.server` та Firebase Hosting emulator для статичних файлів самі по собі не виконують Netlify Functions.** Тому API endpoint повертає 404 або HTML замість JSON.

У корені проєкту виконай:

```bash
npx netlify-cli dev
```

Якщо CLI попросить підтвердити встановлення, підтверди. Відкрий адресу, яку покаже Netlify Dev, зазвичай `http://localhost:8888/`. Перевір endpoint:

```text
http://localhost:8888/.netlify/functions/instagram-feed
```

Очікувана відповідь: `"ok": true`, масив `posts` і `stories` (може бути порожнім). Якщо `configured: false`, перевір наявність усіх змінних та те, чи Netlify Dev підхопив `.env`. Якщо `ok: false` з 502, перевір серверні логи, строк дії токена та Meta API.

**На сайті також необхідно дозволити `Externe Medien` у cookie-банері**, інакше клієнтський код не запитує стрічку.

## Важливо про публікацію

У репозиторії одночасно є `netlify.toml` і `firebase.json`. Налаштована серверна функція **виконується на Netlify**, а Firebase Hosting у поточній конфігурації переспрямовує невідомі маршрути на `index.html`, без виконання цієї функції. Якщо реальний домен працює через Firebase, потрібна окрема серверна інфраструктура або проксі до розгорнутого API. Перенесення `.env` лише в Firebase Hosting не запустить Netlify Function.

Є ще окремий `integration/instagram-worker.mjs`, але він не використовується основною Instagram-секцією: `socialConfig.enabled` у фронтенді за замовчуванням `false`. Не підключай його паралельно без потреби.

## Тести

```bash
node --test checks/instagram-function.test.mjs
```

Тести працюють з моками, не звертаються до реального Instagram і не потребують секретів. Реальну роботу після локального запуску перевіряємо браузером на endpoint та в секції Instagram.

Після завершення перевірки на локальній машині: додати змінні в обраний production-хостинг, розгорнути серверну функцію та перевірити роботу на реальному домені. Публікувати чи переносити продакшен-сайт окремим рішенням.
