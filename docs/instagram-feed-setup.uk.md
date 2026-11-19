# Instagram у Bavaria Lounge: Unified Login

## Актуальна схема

- Meta app Bavaria2026, Instagram Business: `bavaria_cocktail_lounge`
- Instagram User ID: `17841403390955028`
- Unified Login працює з `https://graph.facebook.com/v27.0` і заголовком `Authorization: Bearer <token>`
- Приватні значення живуть тільки в серверному середовищі. Ні API-токен, ні ключі Netlify не додаються до Git.
- Фронтенд звертається до `/.netlify/functions/instagram-feed`.
- Після згоди на «Externe Medien» у cookie-банері відображається стрічка.
- Спершу видно 3 дописи, кнопка «Weitere 3 Beiträge anzeigen» додає наступні 3. При оновленні сторінки лічильник починається з 3.
- Кожен допис містить фото/Reels-прев'ю, тип, дату, повний текст зі згортанням, перехід у Instagram, лайки/коментарі **тільки за наявності реальних значень у Meta API**. Якщо Meta відмовляє в доступі до полів статистики, сервер повторює запит без них.
- Stories повертаються лише поки активні; порожній `stories: []` не означає помилку.

## Локальний запуск

Приватний `.env` в корені (вже у `.gitignore`):

```dotenv
INSTAGRAM_ACCESS_TOKEN=PRIVATE_TOKEN_NOT_FOR_GIT
INSTAGRAM_USER_ID=17841403390955028
INSTAGRAM_API_VERSION=v27.0
```

```bash
npx netlify-cli dev
```

Відкрий `http://localhost:8888/.netlify/functions/instagram-feed`. Очікуємо JSON `ok:true`, `configured:true`, `posts` і `stories`. Для перегляду карток на сайті дозволь категорію «Externe Medien». Звичайний Live Server у VS Code не запускає Netlify Functions.

## Production на Netlify

Netlify-проєкт `bavaria-lounge` прив'язаний до GitHub і використовує `bavaria-lounge.de`. Гілка `main` автоматично деплоїться на продакшен, а Pull Request створює Deploy Preview. Якщо API є лише локально, насамперед перевір, що саме `main` містить Unified Login-виправлення.

У Netlify → Project configuration → Environment variables для **Production / Functions** повинні бути `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `INSTAGRAM_API_VERSION`. Після зміни серверних змінних потрібно перевірити новий deploy.

Перевірити у браузері: `https://bavaria-lounge.de/.netlify/functions/instagram-feed`.

- `503 configured:false`: не вистачає токена, User ID або невірний формат API version.
- `502 ok:false`: Meta API помилка; дивись Netlify Function logs. Не публікуй токен у логах.
- `200 ok:true`, але немає карток: перевір cookies «Externe Medien», консоль, network.
- `200 ok:true`, але без лайків/коментарів: Meta не повертає ці поля, сервер показує доступні пости без вигаданих чисел.

У репозиторії також існує Firebase Hosting, але публічний домен цього Netlify-проєкту розгортається через Netlify. `integration/instagram-worker.mjs` не використовується основною стрічкою (окремий optional adapter), не вмикай його паралельно.

## Перевірки

```bash
node --test checks/instagram-function.test.mjs
node --check assets/app.js
npm test
```

Жоден тест не повинен робити реальних запитів до Instagram або виводити секрети.
