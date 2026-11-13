# SEO-аудит Bavaria Lounge — 13.11.2026

## Статус

Код локально виправлено й перевірено. Production deployment не виконувався. Індексацію Google не позначено як успішну: її потрібно підтвердити у Google Search Console після публікації та перевірки права власності.

## 1. Початкові проблеми

- Головний H1 був рекламним слоганом `Die Nacht. Dein Revier.` і не пояснював пошуковику, що це Bavaria Lounge у Hildesheim.
- Німецькі title, description і видимий текст могли точніше описувати реальні послуги й адресу без переліку штучних ключів.
- JSON-LD містив неповний `openingHours: "Mo-Su 11:30"` без підтвердженого часу закриття.
- Адреса в окремих місцях була записана без `ê`; потрібне узгоджене `Angoulêmeplatz 3, 31134 Hildesheim`.
- Halloween Karaoke Party від 31.10.2026 залишалася в актуальному блоці під заголовком про майбутні події.
- Footer містив повідомлення про приватний дизайн-макет.
- Не було автоматичних тестів для canonical, robots, sitemap, JSON-LD, H1, локальних даних і синхронізації source/generated HTML.
- Юридичні дані, підтверджені години закриття, email і WhatsApp ще не надані власником.

## 2. Архітектура генерації та публікації

- `pages/index.html` — джерело HTML (source of truth).
- `build-preview.py` підставляє шлях `assets`, генерує кореневий `index.html`, offline preview і ZIP-архів. Перевірено: нові SEO-метадані зберігаються.
- `index.html` — згенерований production HTML.
- `netlify.toml` має `publish = "."`, тому Netlify публікує корінь репозиторію та саме кореневий `index.html`; functions беруться з `netlify/functions`.
- `robots.txt`, `sitemap.xml` та `assets/` також входять до publish directory.
- `public/index.html` — стандартний Firebase placeholder. Його не змінено; Firebase не перемикався замість Netlify.
- `firebase.json` описує окрему конфігурацію Firebase Hosting, але production зараз обслуговує Netlify.

Поточний production повертає HTML розміром 37 283 bytes, ідентичний через apex та `bavaria-lounge.netlify.app`. Це підтверджує, що останній Netlify deploy публікує кореневий `index.html`. Локальні зміни цього аудиту ще не опубліковані.

## 3. Live crawlability — перевірено 13.11.2026

| URL | Результат |
|---|---|
| `https://bavaria-lounge.de/` | HTTP 200, `text/html; charset=UTF-8`, повний HTML, без login, без `X-Robots-Tag` |
| `https://www.bavaria-lounge.de/` | HTTP 301 на canonical apex; фінальна відповідь 200 |
| `https://bavaria-lounge.netlify.app/` | HTTP 200, canonical у HTML веде на production apex |
| `https://bavaria-lounge.de/robots.txt` | HTTP 200, `text/plain` |
| `https://bavaria-lounge.de/sitemap.xml` | HTTP 200, `application/xml` |
| `https://bavaria-lounge.de/assets/social-preview-v2.jpg` | HTTP 200, `image/jpeg`, 226 300 bytes |

- DNS A: `35.157.26.135`, `63.176.8.218`.
- HTTPS-запити пройшли перевірку TLS клієнтом; HSTS: `max-age=31536000`.
- GET із Googlebot User-Agent повернув HTTP 200 і той самий обсяг HTML, без `X-Robots-Tag`. Це лише технічна імітація, а не доказ фактичного сканування Googlebot.
- На перевірених URL не отримано 403, 404, 429, 500, 502 або 503.
- Live canonical і meta robots коректні: `https://bavaria-lounge.de/`, `index,follow,max-image-preview:large`.

## 4. Реально внесені виправлення

- Title: `Bavaria Lounge Hildesheim | Shisha Bar, Café & Cocktails`.
- Meta description оновлено природним німецьким текстом із назвою, містом, адресою та реальними пропозиціями.
- H1 тепер пояснює тему: Bavaria Lounge Hildesheim — Shisha Bar & Café; старий слоган залишено помітним у hero.
- Додано природний локальний текст DE та узгоджені EN/UA версії про shisha, cocktails/mocktails, безалкогольні напої, каву, milkshakes та морозиво. Заклад не названо Eiscafé.
- Назва, адреса, телефон, URL і Maps link узгоджені у видимому HTML та JSON-LD.
- Із JSON-LD видалено неповний `openingHours`; фіктивні coordinates, ratings або reviews не додавалися.
- Збережено стабільний `@id`: `https://bavaria-lounge.de/#business`.
- Минулу Halloween-подію прибрано з актуального блоку; нову подію не вигадано.
- Прибрано текст про приватний дизайн-макет. Фіктивні Impressum або Datenschutzerklärung не створювалися.
- Open Graph і Twitter/X metadata узгоджено з новими title/description. Зображення 1200×630 JPEG залишено без заміни.
- Sitemap `lastmod` оновлено до дати істотної зміни — `2026-11-13`.
- Додано автоматизовані SEO-тести. Бронювання, Telegram function, Instagram, меню, перемикання мов та анімації не змінювалися.

## 5. Robots, sitemap і structured data

- `robots.txt`: `User-agent: *`, `Allow: /`, canonical Sitemap; блокувань CSS/JS/images немає.
- `sitemap.xml`: валідний XML UTF-8, один реальний absolute HTTPS canonical URL, без localhost, preview URL чи UTM.
- JSON-LD локально парситься як JSON; тип `BarOrPub`, business data та `sameAs` збережені.
- Google Rich Results Test і Schema.org Validator для локальної неопублікованої версії не можуть підтвердити результат. Після deploy їх потрібно запустити для production URL.

## 6. Images, performance та accessibility

- Автоматичний тест перевіряє існування всіх статичних assets, на які посилається source HTML; битих локальних шляхів не виявлено.
- Головне зображення має preload/fetch priority, контентні зображення мають розміри й lazy loading у наявній розмітці; соціальний JPEG доступний без авторизації.
- PageSpeed/Lighthouse score у цьому аудиті не зафіксований — **UNVERIFIED**. Не слід видавати локальну перевірку assets за Core Web Vitals field data.
- `assets/menu/bavaria-menu.pdf` має приблизно 91.8 MB. Це download-файл, а не LCP asset, тому його не стискали автоматично. Власнику варто підготувати якісну, але значно легшу PDF-копію й перевірити читабельність перед заміною.
- Невикористані старі artwork-файли не видалялися, щоб не порушити залежності або архів матеріалів.

## 7. Змінені файли

- `.gitattributes`
- `pages/index.html`
- `index.html` — згенеровано з source
- `assets/app.js`
- `assets/style.css`
- `sitemap.xml`
- `package.json`
- `checks/seo.test.mjs`
- `docs/SEO_AUDIT_2026-11.md`
- `docs/SEO_OWNER_CHECKLIST.uk.md`

## 8. Перевірки

- `npm run build` — PASS; source та generated HTML синхронізовані.
- `npm test` — PASS:
  - 22 Node SEO/function tests;
  - 4 booking tests;
  - motion smoke test PASS.
- `git diff --check` — PASS.
- XML parse `sitemap.xml` — PASS.
- Production HTTP/DNS/TLS/Googlebot-UA checks — PASS у межах описаних вище технічних запитів.

## 9. Невирішене / OWNER INPUT REQUIRED

1. Підтвердити точний час закриття для кожного дня. До цього не повертати `openingHoursSpecification` у JSON-LD.
2. Надати юридично перевірені Impressum і Datenschutzerklärung для Німеччини та вирішити, хто є відповідальною юридичною особою.
3. Підтвердити, що `+49 174 9073926`, Maps URL, Instagram і Facebook є офіційними та актуальними.
4. Надати офіційні email і WhatsApp, якщо ці кнопки треба активувати.
5. Надати GA4 Measurement ID лише після рішення щодо consent management і оновлення Datenschutzerklärung. GA4 навмисно не встановлено.
6. Схвалити commit/deployment. Цей аудит не пушив і не публікував зміни.

## 10. Netlify — дії після схвалення

1. Переконатися, що production branch — `main`, repository — `Svitly4nyi-Vla2yslav/bavaria-lounge`.
2. Build command має запускати `npm run build`; publish directory — `.`; functions directory — `netlify/functions`.
3. Після merge перевірити deploy log і deployed commit SHA.
4. Відкрити production та повторити HTTP-перевірки для homepage, robots, sitemap і social image.
5. Перевірити View Source: новий title/H1, canonical, JSON-LD без `openingHours`, без Halloween і приватного footer notice.
6. Виконати тестове бронювання та підтвердити отримання Telegram-повідомлення. Не змінювати або розкривати environment variables.
7. Не вмикати Firebase Hosting замість Netlify.

## 11. Google Search Console

1. Відкрити [Google Search Console](https://search.google.com/search-console/).
2. Додати Domain property `bavaria-lounge.de` або завершити її DNS verification вручну. DNS тут не змінювався.
3. Після успішного production deploy відкрити **URL Inspection** для `https://bavaria-lounge.de/` → **Test live URL**.
4. Якщо live test дозволяє індексацію, натиснути **Request indexing** один раз. Indexing API для цієї сторінки не використовувати.
5. У **Sitemaps** подати `https://bavaria-lounge.de/sitemap.xml`.
6. Перевірити **Pages/Indexing**, **HTTPS**, **Core Web Vitals** та **Enhancements**. Експортувати точну причину, якщо URL не індексується.
7. Не трактувати `site:` як повний чи миттєвий звіт; головне джерело істини — URL Inspection та Page indexing у Search Console.

## 12. Google Business Profile / Maps

1. Створити або підтвердити [Google Business Profile](https://www.google.com/business/) для реального закладу; не створювати дубль, якщо профіль уже існує.
2. Узгодити NAP: `Bavaria Lounge`, `Angoulêmeplatz 3, 31134 Hildesheim`, `+49 174 9073926`.
3. Website: `https://bavaria-lounge.de/` без UTM.
4. Вибрати лише правдиві primary/secondary categories; додати точні години після підтвердження власником.
5. Завантажити справжні фото власника — фасад, вхід, інтер’єр, напої; не використовувати AI-зображення як доказ вигляду закладу.
6. Перевірити, що Facebook, Instagram, сайт і Business Profile не суперечать один одному щодо адреси, телефону та годин.

## 13. Контроль через 7–14 днів після deploy

- У Search Console перевірити URL Inspection: crawl allowed, canonical selected by Google, last crawl та indexing status.
- Перевірити Page indexing і Sitemap status; записати конкретну причину виключення, якщо вона є.
- Перевірити branded запит `Bavaria Lounge Hildesheim`, а потім локальні запити. Не очікувати гарантованих позицій лише від метатегів.
- Перевірити Google Business Profile/Maps, узгодженість NAP і переходи на сайт.
- Перевірити social preview через Facebook Sharing Debugger та LinkedIn Post Inspector; WhatsApp зазвичай оновлює кеш не миттєво.
- Запустити PageSpeed Insights для mobile/desktop і виправляти лише підтверджені LCP/CLS/INP проблеми.

## 14. Висновок

Локальна кодова частина acceptance criteria виконана й протестована. Production усе ще показує попередній deploy до моменту схваленого merge/deploy. Google indexing, Search Console verification, Business Profile, юридичні сторінки, точні години й GA4 залишаються зовнішніми або заблокованими діями власника.
