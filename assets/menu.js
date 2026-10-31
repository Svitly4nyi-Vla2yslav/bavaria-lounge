'use strict';

// Transcribed from the owner's October 2026 menu. Prices are intentionally absent.
// Recipes are listed only where the supplied menu states them.
(function (root) {
  const item = (name, de, en, uk, artwork) => ({
    name, description: [de, en || de, uk || de], ...(artwork ? { artwork } : {})
  });
  const section = (title, description, image, items) => ({ title, description, image, items });
  const original = (file, cell) => ({ file, cell });
  const generated = file => ({ file: `menu/generated/${file}.webp` });
  const menu = {
    cocktails: section(['Cocktails', 'Cocktails', 'Коктейлі'],
      ['Mit Alkohol · Klassiker und Bavaria-Spezialitäten', 'With alcohol · Classics and Bavaria specials', 'З алкоголем · Класика та фірмові коктейлі'], 'menu/cocktails.webp', [
        item('Long Island Iced Tea', 'Tequila · Wodka · Rum · Cointreau · Gin · Lime Juice · Cola', 'Tequila · vodka · rum · Cointreau · gin · lime juice · cola', 'Текіла · горілка · ром · Cointreau · джин · сік лайма · кола', original('drinks-premium-2.webp', 4)),
        item('Blue Lagoon', 'Wodka · Sprite · Blue Curaçao', 'Vodka · Sprite · blue curaçao', 'Горілка · Sprite · блакитний кюрасао', generated('blue-lagoon')),
        item('Mojito', 'Bio-Limette · Minze · brauner Rohrzucker · Soda · Rum · Lime Juice · Ginger Ale', 'Organic lime · mint · brown cane sugar · soda · rum · lime juice · ginger ale', 'Органічний лайм · м’ята · тростинний цукор · содова · ром · сік лайма · імбирний ель', original('drinks-premium-1.webp', 0)),
        item('Sunrise', 'Tequila · Orangensaft · Grenadine', 'Tequila · orange juice · grenadine', 'Текіла · апельсиновий сік · гренадин', generated('sunrise')),
        item('Piña Colada', 'Rum · Ananassaft · Sahne · Kokossirup', 'Rum · pineapple juice · cream · coconut syrup', 'Ром · ананасовий сік · вершки · кокосовий сироп', original('drinks-premium-1.webp', 3)),
        item('Sex on the Beach', 'Wodka · Pfirsichlikör · Orangensaft · Cranberrysirup · Limesirup', 'Vodka · peach liqueur · orange juice · cranberry syrup · lime syrup', 'Горілка · персиковий лікер · апельсиновий сік · журавлинний сироп · сироп лайма', original('drinks-premium-1.webp', 7)),
        item('Bavaria Cocktail', 'Hauscocktail · Geheimnis des Barkeepers', 'House cocktail · Bartender’s secret', 'Фірмовий коктейль · Таємниця бармена', generated('bavaria-cocktail')),
        item('Ukrainischer Cocktail', 'Orangensaft · Ananassaft · Bananennektar · Kokossirup · Gin · Bardinet-Sirup', 'Orange juice · pineapple juice · banana nectar · coconut syrup · gin · Bardinet syrup', 'Апельсиновий та ананасовий соки · банановий нектар · кокосовий сироп · джин · сироп Bardinet', generated('ukrainian-cocktail')),
        item('Bloody Mary', 'Tomatensaft · Wodka · Tabasco · Salz · Pfeffer', 'Tomato juice · vodka · Tabasco · salt · pepper', 'Томатний сік · горілка · Tabasco · сіль · перець', generated('bloody-mary')),
        item('Smoke Cherry', 'Bacardi · Captain Morgan · Grenadinesirup · Kirschsaft', 'Bacardi · Captain Morgan · grenadine syrup · cherry juice', 'Bacardi · Captain Morgan · гренадин · вишневий сік', generated('smoke-cherry'))
      ]),
    zero: section(['Alkoholfreie Cocktails', 'Alcohol-free cocktails', 'Безалкогольні коктейлі'],
      ['Drei Alternativen ohne Alkohol', 'Three alcohol-free alternatives', 'Три варіанти без алкоголю'], 'menu/softdrinks.webp', [
        item('Ipanema', 'Limette · Maracuja · Ginger Ale · Rohrzucker', 'Lime · passion fruit · ginger ale · cane sugar', 'Лайм · маракуя · імбирний ель · тростинний цукор', generated('ipanema')),
        item('Solero', 'Maracuja · Orange · Mango · Vanille', 'Passion fruit · orange · mango · vanilla', 'Маракуя · апельсин · манго · ваніль', generated('solero')),
        item('Bumblebee', 'Karamellsirup · Orangensaft oder Tonic · Espresso', 'Caramel syrup · orange juice or tonic · espresso', 'Карамельний сироп · апельсиновий сік або тонік · еспресо', generated('bumblebee'))
      ]),
    longdrinks: section(['Longdrinks', 'Long drinks', 'Лонгдрінки'],
      ['Spirituosen und ihre Begleiter', 'Spirits and their mixers', 'Міцні напої з міксерами'], 'menu/longdrinks.webp', [
        item('Jack Daniel’s', 'Mit Cola', 'With cola', 'З колою', generated('jack-daniels-cola-branded')),
        item('Jack Daniel’s (Single)', 'Single Barrel Select · mit Cola', 'Single Barrel Select · with cola', 'Single Barrel Select · з колою', generated('jack-daniels-single-barrel')),
        item('Jim Beam', 'Mit Cola', 'With cola', 'З колою', generated('jim-beam-cola-branded')),
        item('Red Label', 'Mit Cola', 'With cola', 'З колою', generated('red-label-cola-branded')),
        item('Black Label', 'Mit Cola', 'With cola', 'З колою', generated('black-label-cola-branded')),
        item('Captain Morgan', 'Mit Cola', 'With cola', 'З колою'),
        item('Grey Goose', 'Mit schwarzer Dose oder Red Bull', 'With black-can energy drink or Red Bull', 'З енергетиком у чорній банці або Red Bull'),
        item('Absolut Vodka / Three Sixty · Red Bull', 'Mit Red Bull oder schwarzer Dose', 'With Red Bull or black-can energy drink', 'З Red Bull або енергетиком у чорній банці'),
        item('Absolut Vodka / Three Sixty · Mix', 'Mit Orangensaft, Lemon oder Energy', 'With orange juice, lemon mixer or energy drink', 'З апельсиновим соком, лимонним міксером або енергетиком'),
        item('Chivas', 'Mit Cola', 'With cola', 'З колою'),
        item('Bombay', 'Mit Tonic', 'With tonic', 'З тоніком'),
        item('Jägermeister', 'Mit Energy', 'With energy drink', 'З енергетиком'),
        item('Bacardi', 'Mit Cola', 'With cola', 'З колою'),
        item('Havana', 'Mit Cola', 'With cola', 'З колою'),
        item('43 Milch', 'Licor 43 · Milch', 'Licor 43 · milk', 'Licor 43 · молоко'),
        item('Negroni', 'Campari · Gin · Martini Rosso', 'Campari · gin · Martini Rosso', 'Campari · джин · Martini Rosso')
      ]),
    spirits: section(['Spirituosen', 'Spirits', 'Міцні напої'],
      ['Die Auswahl aus unserer Karte · je 4 cl', 'The selection from our menu · 4 cl each', 'Напої з нашого меню · по 4 cl'], 'menu/bottles.webp',
      ['Jack Daniel’s', 'Jim Beam', 'Absolut Vodka', 'Bombay Sapphire', 'Yeni Raki', 'Black Label'].map(name => item(name, '4 cl', '4 cl', '4 cl', name === 'Jack Daniel’s' ? generated('jack-daniels-shot-branded') : name === 'Jim Beam' ? generated('jim-beam-cola-branded') : name === 'Black Label' ? generated('black-label-cola-branded') : undefined))),
    shots: section(['Shots', 'Shots', 'Шоти'],
      ['Kleine Gläser, große Auswahl', 'Small glasses, plenty of choice', 'Невеликі порції, великий вибір'], 'menu/shots.webp', [
        ...['Baileys', 'Tequila', 'Sourz', 'Jägermeister', 'Vodka', 'Jack Daniel’s'].map(name => item(name, '2 cl', '2 cl', '2 cl', name === 'Jack Daniel’s' ? generated('jack-daniels-shot-branded') : undefined)),
        item('Sambuca + Kaffeebohnen', '4 cl · mit Kaffeebohnen', '4 cl · with coffee beans', '4 cl · з кавовими зернами'),
        item('Tequila Boom', '4 cl · Tequila · Sprite oder Tonic', '4 cl · tequila · Sprite or tonic', '4 cl · текіла · Sprite або тонік')
      ]),
    beer: section(['Bier', 'Beer', 'Пиво'],
      ['Pils, Radler, Weizen und alkoholfreie Auswahl', 'Pilsner, radler, wheat beer and alcohol-free options', 'Пільзнер, радлер, пшеничне й безалкогольне'], 'menu/beer.webp', [
        item('Beck’s', '0,33 l · Gold, Lemon, Ice oder alkoholfrei', '0.33 l · Gold, Lemon, Ice or alcohol-free', '0,33 л · Gold, Lemon, Ice або безалкогольне'),
        item('Krombacher', '0,33 l · Pils oder Radler', '0.33 l · pilsner or radler', '0,33 л · пільзнер або радлер'),
        item('Desperados', '0,33 l', '0.33 l', '0,33 л'),
        item('Corona', '0,33 l', '0.33 l', '0,33 л'),
        item('Heineken', '0,25 l', '0.25 l', '0,25 л'),
        item('Weizenbier', '0,5 l', '0.5 l', '0,5 л')
      ]),
    wine: section(['Wein & Aperitif', 'Wine & aperitifs', 'Вино й аперитиви'],
      ['Rot, weiß oder als Aperitif', 'Red, white or an aperitif', 'Червоне, біле або аперитив'], 'menu/wine.webp', [
        item('Rotwein', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л'),
        item('Weißwein', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л'),
        item('Weinschorle', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л'),
        item('Hugo', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л'),
        item('Aperol Spritz', 'Aperitif · Zutaten bitte vor Ort erfragen', 'Aperitif · Ask the team about ingredients', 'Аперитив · Склад уточнюйте у закладі', original('drinks-premium-1.webp', 6))
      ]),
    softdrinks: section(['Softdrinks', 'Soft drinks', 'Безалкогольні напої'],
      ['Erfrischungen, Energy und Wasser', 'Refreshments, energy drinks and water', 'Прохолодні напої, енергетики й вода'], 'menu/softdrinks.webp', [
        item('Red Bull', 'Alle Sorten', 'All varieties', 'Усі смаки'),
        item('Moloko', 'Softdrink', 'Soft drink', 'Безалкогольний напій'),
        item('28 Black', 'Alle Sorten', 'All varieties', 'Усі смаки'),
        item('Fanta Exotic', 'Exotic', 'Exotic', 'Екзотичний смак'),
        item('Arizona', 'Blueberry · Wassermelone · Mango · Granatapfel · Pfirsich', 'Blueberry · watermelon · mango · pomegranate · peach', 'Чорниця · кавун · манго · гранат · персик'),
        item('Fritz-Cola', 'Cola', 'Cola', 'Кола'),
        item('Gazoz', '0,25 l', '0.25 l', '0,25 л'),
        item('Stilles Wasser', '0,5 l · ohne Kohlensäure', '0.5 l · still', '0,5 л · негазована вода'),
        item('Mineralwasser', '0,5 l', '0.5 l', '0,5 л'),
        item('Coca-Cola', 'Zero oder Light · 0,2 l, 0,4 l oder 1 l', 'Zero or Light · 0.2 l, 0.4 l or 1 l', 'Zero або Light · 0,2 л, 0,4 л або 1 л'),
        item('Sprite', '0,2 l, 0,4 l oder 1 l', '0.2 l, 0.4 l or 1 l', '0,2 л, 0,4 л або 1 л'),
        item('Fanta', '0,2 l, 0,4 l oder 1 l', '0.2 l, 0.4 l or 1 l', '0,2 л, 0,4 л або 1 л'),
        item('Eistee', 'Pfirsich oder Zitrone · 0,2 l, 0,4 l oder 1 l', 'Peach or lemon · 0.2 l, 0.4 l or 1 l', 'Персик або лимон · 0,2 л, 0,4 л або 1 л'),
        item('Schweppes', 'Ginger Ale · Bitter Lemon · Tonic Water · 0,2 l, 0,4 l oder 1 l', 'Ginger Ale · Bitter Lemon · Tonic Water · 0.2 l, 0.4 l or 1 l', 'Імбирний ель · Bitter Lemon · тонік · 0,2 л, 0,4 л або 1 л')
      ]),
    juices: section(['Säfte & Nektare', 'Juices & nectars', 'Соки й нектари'],
      ['Je 0,33 l · alle auch als 1-l-Flasche', '0.33 l each · all also available in 1 l bottles', 'По 0,33 л · усі також у пляшках по 1 л'], 'menu/juices.webp', [
        item('Orangensaft', 'Orange', 'Orange juice', 'Апельсиновий сік', generated('orange-juice')),
        item('KiBa', 'Kirsch-Banane', 'Cherry and banana', 'Вишня та банан'),
        item('Maracujanektar', 'Maracuja', 'Passion fruit nectar', 'Нектар маракуї'),
        item('Kirschsaft', 'Kirsche', 'Cherry juice', 'Вишневий сік'),
        item('Bananennektar', 'Banane', 'Banana nectar', 'Банановий нектар'),
        item('Ananassaft', 'Ananas', 'Pineapple juice', 'Ананасовий сік')
      ]),
    hot: section(['Heiße Getränke', 'Hot drinks', 'Гарячі напої'],
      ['Kaffee, Tee und Sahlab', 'Coffee, tea and sahlab', 'Кава, чай і сахлаб'], 'menu/hot.webp', [
        item('Kaffee', 'Kaffee', 'Coffee', 'Кава'),
        item('Espresso', 'Espresso', 'Espresso', 'Еспресо'),
        item('Cappuccino', 'Kaffeespezialität mit Milch', 'Coffee speciality with milk', 'Кавовий напій із молоком'),
        item('Latte Macchiato', 'Kaffeespezialität mit Milch', 'Coffee speciality with milk', 'Кавовий напій із молоком'),
        item('Sahlab', 'Heißgetränk · Zutaten bitte vor Ort erfragen', 'Hot drink · Ask the team about ingredients', 'Гарячий напій · Склад уточнюйте у закладі'),
        item('Schwarztee', 'Schwarzer Tee', 'Black tea', 'Чорний чай'),
        item('Tee', 'Mehrere Sorten', 'Various varieties', 'Різні сорти')
      ]),
    milkshakes: section(['Milchshakes', 'Milkshakes', 'Молочні коктейлі'],
      ['Fünf Sorten zur Auswahl', 'Five flavours to choose from', 'П’ять смаків на вибір'], 'menu/milkshakes.webp',
      ['Vanille', 'Schoko', 'Erdbeere', 'Stracciatella', 'Kinder Bueno'].map((name, i) => item(name,
        'Milchshake · ' + name,
        'Milkshake · ' + ['vanilla', 'chocolate', 'strawberry', 'stracciatella', 'Kinder Bueno'][i],
        'Молочний коктейль · ' + ['ваніль', 'шоколад', 'полуниця', 'страчатела', 'Kinder Bueno'][i], i === 0 ? generated('vanilla-milkshake') : i === 1 ? generated('chocolate-milkshake') : undefined))),
    icecream: section(['Eiscreme', 'Ice cream', 'Морозиво'],
      ['Fünf Sorten · Portion mit 5 Kugeln', 'Five flavours · 5 scoops per serving', 'П’ять смаків · порція з 5 кульок'], 'menu/icecream.webp',
      ['Vanille', 'Schoko', 'Erdbeere', 'Stracciatella', 'Kinder Bueno'].map((name, i) => item(name,
        '5 Kugeln · ' + name,
        '5 scoops · ' + ['vanilla', 'chocolate', 'strawberry', 'stracciatella', 'Kinder Bueno'][i],
        '5 кульок · ' + ['ваніль', 'шоколад', 'полуниця', 'страчатела', 'Kinder Bueno'][i], i === 0 ? generated('vanilla-icecream') : undefined))),
    shisha: section(['Shisha', 'Shisha', 'Кальяни'],
      ['Classic & Premium · alle Sorten aus unserer Karte', 'Classic & Premium · every flavour from our menu', 'Classic і Premium · усі смаки з меню'], 'menu/shisha.webp', [
        ...['Wassermelone', 'Doppelapfel', 'Traube Minze', 'Ice Bonbon / Lemon', 'Blueberry Minze', 'Zitrone Minze', 'Love 66', 'Love Bavaria', 'Watermelon', 'Mango Tango', 'Moloko', 'Baya Blue', 'Cinderella', 'Arctic Line', 'Istanbul', 'Akram Spezial'].map(name => item(name, 'Classic', 'Classic', 'Classic', ['Wassermelone','Watermelon'].includes(name) ? generated('watermelon-shisha') : undefined)),
        ...['African Queen', 'Lemon Chill', 'Eis Kaktus', 'Sommer in Beirut', 'Black Nana'].map(name => item(name, 'Premium', 'Premium', 'Premium'))
      ]),
    bottles: section(['Flaschen & Sets', 'Bottles & sets', 'Пляшки та набори'],
      ['Flaschenangebote mit den Beilagen aus unserer Karte', 'Bottle selections with the accompaniments listed in our menu', 'Пляшки з доповненнями, зазначеними в меню'], 'menu/bottles.webp', [
        ...['Chivas', 'Jack Daniel’s', 'Jim Beam', 'Red Label', 'Black Label', 'Jack Daniel’s (Single)', 'Bacardi'].map(name => item(name,
          '1 Fl. Cola · 1 Shisha · Pistazien · Chips', '1 bottle of cola · 1 shisha · pistachios · crisps', '1 пляшка коли · 1 кальян · фісташки · чипси',
          name === 'Jack Daniel’s (Single)' ? generated('jack-daniels-single-barrel') : name === 'Jack Daniel’s' ? generated('jack-daniels-cola-branded') : name === 'Jim Beam' ? generated('jim-beam-cola-branded') : name === 'Red Label' ? generated('red-label-cola-branded') : name === 'Black Label' ? generated('black-label-cola-branded') : undefined)),
        item('Grey Goose', '4 Red Bull · 1 Shisha · Pistazien', '4 Red Bull · 1 shisha · pistachios', '4 Red Bull · 1 кальян · фісташки'),
        ...['Three Sixty', 'Absolut Vodka'].map(name => item(name, '1 Fl. Energy · 1 Shisha · Pistazien · Chips', '1 bottle of energy drink · 1 shisha · pistachios · crisps', '1 пляшка енергетика · 1 кальян · фісташки · чипси')),
        item('Yeni Raki', '4 Wasser · 1 Shisha · Pistazien', '4 waters · 1 shisha · pistachios', '4 води · 1 кальян · фісташки')
      ]),
    snacks: section(['Snacks & Obst', 'Snacks & fruit', 'Снеки та фрукти'],
      ['Für zwischendurch oder für die Runde', 'A little something for yourself or the group', 'Для себе або на компанію'], 'menu/snacks.webp', [
        item('Pistazien', 'Pistazien', 'Pistachios', 'Фісташки'),
        item('Erdnüsse', 'Erdnüsse', 'Peanuts', 'Арахіс'),
        item('Tortilla Chips', 'Tortilla Chips', 'Tortilla chips', 'Кукурудзяні чипси'),
        item('Salzstangen', 'Salzstangen', 'Pretzel sticks', 'Солона соломка'),
        item('Chips', 'Chips', 'Crisps', 'Чипси'),
        item('Obstteller', 'Obstteller · Auswahl bitte vor Ort erfragen', 'Fruit platter · Ask the team about the selection', 'Фруктова тарілка · Асортимент уточнюйте у закладі')
      ])
  };

  const labels = {
    de: ['Cocktails', 'Alkoholfrei', 'Longdrinks', 'Spirituosen', 'Shots', 'Bier', 'Wein & Aperitif', 'Softdrinks', 'Säfte', 'Heiße Getränke', 'Milchshakes', 'Eiscreme', 'Shisha', 'Flaschen & Sets', 'Snacks & Obst'],
    en: ['Cocktails', 'Alcohol-free', 'Long drinks', 'Spirits', 'Shots', 'Beer', 'Wine & aperitifs', 'Soft drinks', 'Juices', 'Hot drinks', 'Milkshakes', 'Ice cream', 'Shisha', 'Bottles & sets', 'Snacks & fruit'],
    uk: ['Коктейлі', 'Без алкоголю', 'Лонгдрінки', 'Міцні напої', 'Шоти', 'Пиво', 'Вино й аперитиви', 'Прохолодні напої', 'Соки', 'Гарячі напої', 'Молочні коктейлі', 'Морозиво', 'Кальяни', 'Пляшки та набори', 'Снеки та фрукти'],
    tr: ['Kokteyller', 'Alkolsüz', 'Uzun içkiler', 'Alkollü içkiler', 'Shotlar', 'Bira', 'Şarap ve aperitif', 'Meşrubatlar', 'Meyve suları', 'Sıcak içecekler', 'Milkshake', 'Dondurma', 'Nargile', 'Şişeler ve setler', 'Atıştırmalık ve meyve'],
    ru: ['Коктейли', 'Без алкоголя', 'Лонгдринки', 'Крепкие напитки', 'Шоты', 'Пиво', 'Вино и аперитивы', 'Прохладительные напитки', 'Соки', 'Горячие напитки', 'Молочные коктейли', 'Мороженое', 'Кальяны', 'Бутылки и наборы', 'Снеки и фрукты'],
    sr: ['Kokteli', 'Bez alkohola', 'Duga pića', 'Žestoka pića', 'Šotovi', 'Pivo', 'Vino i aperitivi', 'Bezalkoholna pića', 'Sokovi', 'Topli napici', 'Mlečni šejkovi', 'Sladoled', 'Šiša', 'Boce i setovi', 'Grickalice i voće'],
    ar: ['كوكتيلات', 'بلا كحول', 'مشروبات طويلة', 'مشروبات روحية', 'شوتس', 'بيرة', 'نبيذ ومقبلات', 'مشروبات غازية', 'عصائر', 'مشروبات ساخنة', 'ميلك شيك', 'آيس كريم', 'شيشة', 'زجاجات وباقات', 'وجبات خفيفة وفاكهة'],
    ku: ['Kokteyl', 'Bê alkol', 'Vexwarinên dirêj', 'Vexwarinên xurt', 'Shot', 'Bîra', 'Şerab û aperîtîf', 'Vexwarinên sar', 'Ava fêkî', 'Vexwarinên germ', 'Milkshake', 'Bastik', 'Nargîle', 'Şûşe û set', 'Xwarinên sivik û fêkî']
  };
  Object.keys(menu).forEach((key, index) => {
    menu[key].labels = Object.fromEntries(Object.entries(labels).map(([lang, values]) => [lang, values[index]]));
  });
  root.BAVARIA_MENU = menu;
  root.BAVARIA_MENU_PDF = 'menu/bavaria-menu.pdf';
  if (typeof module !== 'undefined' && module.exports) module.exports = menu;
})(typeof window !== 'undefined' ? window : globalThis);

