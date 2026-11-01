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
        item('Bavaria Cocktail', 'Hauscocktail · Geheimnis des Barkeepers', 'House cocktail · Bartender’s secret', 'Фірмовий коктейль · Таємниця бармена', generated('bavaria-cocktail-akram')),
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
        item('Jim Beam', 'Original · Pineapple · Apple · Red Stag · mit Cola', 'Original · Pineapple · Apple · Red Stag · with cola', 'Original · Pineapple · Apple · Red Stag · з колою', generated('jim-beam-flavours')),
        item('Red Label', 'Mit Cola', 'With cola', 'З колою', generated('red-label-cola-branded')),
        item('Black Label', 'Mit Cola', 'With cola', 'З колою', generated('black-label-cola-branded')),
        item('Captain Morgan', 'Mit Cola', 'With cola', 'З колою', generated('captain-morgan-cola')),
        item('Grey Goose', 'Mit schwarzer Dose oder Red Bull', 'With black-can energy drink or Red Bull', 'З енергетиком у чорній банці або Red Bull', generated('grey-goose-energy')),
        item('Absolut Vodka / Three Sixty · Red Bull', 'Mit Red Bull oder schwarzer Dose', 'With Red Bull or black-can energy drink', 'З Red Bull або енергетиком у чорній банці', generated('absolut-red-bull')),
        item('Absolut Vodka / Three Sixty · Mix', 'Mit Orangensaft, Lemon oder Energy', 'With orange juice, lemon mixer or energy drink', 'З апельсиновим соком, лимонним міксером або енергетиком', generated('absolut-mix')),
        item('Chivas', 'Mit Cola', 'With cola', 'З колою', generated('chivas-cola')),
        item('Bombay', 'Mit Tonic', 'With tonic', 'З тоніком', generated('bombay-tonic')),
        item('Jägermeister', 'Mit Energy', 'With energy drink', 'З енергетиком', generated('jagermeister-energy')),
        item('Bacardi', 'Mit Cola', 'With cola', 'З колою', generated('bacardi-cola')),
        item('Havana', 'Mit Cola', 'With cola', 'З колою', generated('havana-cola')),
        item('43 Milch', 'Licor 43 · Milch · Eis', 'Licor 43 · milk · ice', 'Licor 43 · молоко · лід', generated('licor43-milk')),
        item('Negroni', 'Campari · Gin · Martini Rosso', 'Campari · gin · Martini Rosso', 'Campari · джин · Martini Rosso', generated('negroni'))
      ]),
    spirits: section(['Spirituosen', 'Spirits', 'Міцні напої'],
      ['Die Auswahl aus unserer Karte · je 4 cl', 'The selection from our menu · 4 cl each', 'Напої з нашого меню · по 4 cl'], 'menu/bottles.webp',
      ['Jack Daniel’s', 'Jim Beam', 'Absolut Vodka', 'Bombay Sapphire', 'Yeni Raki', 'Black Label'].map(name => item(name, '4 cl · 40 ml', '4 cl · 40 ml', '4 cl · 40 мл',
        name === 'Jack Daniel’s' ? generated('jack-daniels-shot-branded') : name === 'Jim Beam' ? generated('spirit-jim-beam-4cl') : name === 'Absolut Vodka' ? generated('spirit-absolut-4cl') : name === 'Bombay Sapphire' ? generated('spirit-bombay-4cl') : name === 'Yeni Raki' ? generated('spirit-yeni-raki-4cl') : generated('spirit-black-label-4cl')))),
    shots: section(['Shots', 'Shots', 'Шоти'],
      ['Kleine Gläser, große Auswahl', 'Small glasses, plenty of choice', 'Невеликі порції, великий вибір'], 'menu/shots.webp', [
        ...['Baileys', 'Tequila', 'Sourz', 'Jägermeister', 'Vodka', 'Jack Daniel’s'].map(name => item(name, '2 cl · 20 ml · mit Limette', '2 cl · 20 ml · with lime', '2 cl · 20 мл · з лаймом',
          name === 'Baileys' ? generated('shot-baileys-2cl') : name === 'Tequila' ? generated('shot-tequila-2cl') : name === 'Sourz' ? generated('shot-sourz-2cl') : name === 'Jägermeister' ? generated('shot-jagermeister-2cl') : name === 'Vodka' ? generated('shot-vodka-2cl') : generated('shot-jack-daniels-2cl'))),
        item('Sambuca + Kaffeebohnen', '4 cl · 40 ml · Kaffeebohnen · Limette', '4 cl · 40 ml · coffee beans · lime', '4 cl · 40 мл · кавові зерна · лайм', generated('shot-sambuca-4cl')),
        item('Tequila Boom', '4 cl · 40 ml · Tequila · Sprite oder Tonic · Limette', '4 cl · 40 ml · tequila · Sprite or tonic · lime', '4 cl · 40 мл · текіла · Sprite або тонік · лайм', generated('shot-tequila-boom-4cl'))
      ]),
    beer: section(['Bier', 'Beer', 'Пиво'],
      ['Pils, Radler, Weizen und alkoholfreie Auswahl', 'Pilsner, radler, wheat beer and alcohol-free options', 'Пільзнер, радлер, пшеничне й безалкогольне'], 'menu/beer.webp', [
        item('Beck’s', '0,33 l · Gold, Lemon, Ice oder alkoholfrei', '0.33 l · Gold, Lemon, Ice or alcohol-free', '0,33 л · Gold, Lemon, Ice або безалкогольне', generated('beer-becks-variants')),
        item('Krombacher', '0,33 l · Pils oder Radler', '0.33 l · pilsner or radler', '0,33 л · пільзнер або радлер', generated('beer-krombacher')),
        item('Desperados', '0,33 l', '0.33 l', '0,33 л', generated('beer-desperados')),
        item('Corona', '0,33 l', '0.33 l', '0,33 л', generated('beer-corona')),
        item('Heineken', '0,25 l', '0.25 l', '0,25 л', generated('beer-heineken-025')),
        item('Weizenbier', '0,5 l · naturtrüb', '0.5 l · naturally cloudy', '0,5 л · нефільтроване', generated('beer-weizenbier'))
      ]),
    wine: section(['Wein & Aperitif', 'Wine & aperitifs', 'Вино й аперитиви'],
      ['Rot, weiß oder als Aperitif', 'Red, white or an aperitif', 'Червоне, біле або аперитив'], 'menu/wine.webp', [
        item('Rotwein', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л', generated('wine-red-02-04')),
        item('Weißwein', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л', generated('wine-white-02-04')),
        item('Weinschorle', '0,2 l oder 0,4 l', '0.2 l or 0.4 l', '0,2 л або 0,4 л', generated('wine-schorle-02-04')),
        item('Hugo', '0,2 l oder 0,4 l · Prosecco · Holunder · Limette · Minze', '0.2 l or 0.4 l · prosecco · elderflower · lime · mint', '0,2 л або 0,4 л · просеко · бузина · лайм · м’ята', generated('wine-hugo-02-04')),
        item('Aperol Spritz', 'Aperol · Prosecco · Soda · Orange', 'Aperol · prosecco · soda · orange', 'Aperol · просеко · содова · апельсин', generated('wine-aperol-spritz-bottle'))
      ]),
    softdrinks: section(['Softdrinks', 'Soft drinks', 'Безалкогольні напої'],
      ['Erfrischungen, Energy und Wasser', 'Refreshments, energy drinks and water', 'Прохолодні напої, енергетики й вода'], 'menu/softdrinks.webp', [
        item('Red Bull', 'Alle Sorten', 'All varieties', 'Усі смаки', generated('softdrink-redbull-5')),
        item('Moloko', 'Softdrink', 'Soft drink', 'Безалкогольний напій', generated('softdrink-moloko')),
        item('28 Black', 'Alle Sorten', 'All varieties', 'Усі смаки', generated('softdrink-28black-5')),
        item('Fanta Exotic', 'Exotic', 'Exotic', 'Екзотичний смак', generated('softdrink-fanta-exotic')),
        item('Arizona', 'Blueberry · Wassermelone · Mango · Granatapfel · Pfirsich', 'Blueberry · watermelon · mango · pomegranate · peach', 'Чорниця · кавун · манго · гранат · персик', generated('softdrink-arizona-5')),
        item('Fritz-Cola', 'Cola', 'Cola', 'Кола', generated('softdrink-fritz-kola')),
        item('Gazoz', '0,25 l', '0.25 l', '0,25 л', generated('softdrink-gazoz')),
        item('Stilles Wasser', '0,5 l · ohne Kohlensäure', '0.5 l · still', '0,5 л · негазована вода', generated('softdrink-water-still-sparkling')),
        item('Mineralwasser', '0,5 l', '0.5 l', '0,5 л', generated('softdrink-water-still-sparkling')),
        item('Coca-Cola', 'Zero oder Light · 0,2 l, 0,4 l oder 1 l', 'Zero or Light · 0.2 l, 0.4 l or 1 l', 'Zero або Light · 0,2 л, 0,4 л або 1 л', generated('softdrink-coca-cola-zero-sizes')),
        item('Sprite', '0,2 l, 0,4 l oder 1 l', '0.2 l, 0.4 l or 1 l', '0,2 л, 0,4 л або 1 л', generated('softdrink-sprite-sizes')),
        item('Fanta', '0,2 l, 0,4 l oder 1 l', '0.2 l, 0.4 l or 1 l', '0,2 л, 0,4 л або 1 л', generated('softdrink-fanta-sizes')),
        item('Eistee', 'Pfirsich oder Zitrone · 0,2 l, 0,4 l oder 1 l', 'Peach or lemon · 0.2 l, 0.4 l or 1 l', 'Персик або лимон · 0,2 л, 0,4 л або 1 л', generated('softdrink-iced-tea-peach-lemon')),
        item('Schweppes', 'Ginger Ale · Bitter Lemon · Tonic Water · 0,2 l, 0,4 l oder 1 l', 'Ginger Ale · Bitter Lemon · Tonic Water · 0.2 l, 0.4 l or 1 l', 'Імбирний ель · Bitter Lemon · тонік · 0,2 л, 0,4 л або 1 л', generated('softdrink-schweppes-trio'))
      ]),
    juices: section(['Säfte & Nektare', 'Juices & nectars', 'Соки й нектари'],
      ['Je 0,33 l · alle auch als 1-l-Flasche', '0.33 l each · all also available in 1 l bottles', 'По 0,33 л · усі також у пляшках по 1 л'], 'menu/juices.webp', [
        item('Orangensaft', 'Orange', 'Orange juice', 'Апельсиновий сік', generated('orange-juice')),
        item('KiBa', 'Kirsch-Banane', 'Cherry and banana', 'Вишня та банан', generated('juice-kiba')),
        item('Maracujanektar', 'Maracuja', 'Passion fruit nectar', 'Нектар маракуї', generated('juice-passionfruit')),
        item('Kirschsaft', 'Kirsche', 'Cherry juice', 'Вишневий сік', generated('juice-cherry')),
        item('Bananennektar', 'Banane', 'Banana nectar', 'Банановий нектар', generated('juice-banana')),
        item('Ananassaft', 'Ananas', 'Pineapple juice', 'Ананасовий сік', generated('juice-pineapple'))
      ]),
    hot: section(['Heiße Getränke', 'Hot drinks', 'Гарячі напої'],
      ['Kaffee, Tee und Sahlab', 'Coffee, tea and sahlab', 'Кава, чай і сахлаб'], 'menu/hot.webp', [
        item('Kaffee', 'Kaffee', 'Coffee', 'Кава', generated('hot-coffee')),
        item('Espresso', 'Espresso · mit Wasser und Praline', 'Espresso · with water and a praline', 'Еспресо · з водою та цукеркою', generated('hot-espresso')),
        item('Cappuccino', 'Espresso · Milch · Milchschaum', 'Espresso · milk · milk foam', 'Еспресо · молоко · молочна пінка', generated('hot-cappuccino')),
        item('Latte Macchiato', 'Milch · Espresso · Milchschaum', 'Milk · espresso · milk foam', 'Молоко · еспресо · молочна пінка', generated('hot-latte-macchiato')),
        item('Sahlab', 'Heißgetränk · geheimes Hausrezept', 'Hot drink · secret house recipe', 'Гарячий напій · секретний рецепт закладу', generated('hot-sahlab-akram')),
        item('Schwarztee', 'Schwarzer Tee', 'Black tea', 'Чорний чай', generated('hot-black-tea')),
        item('Tee', 'Früchte · Kräuter · Minze und weitere Sorten', 'Fruit · herbal · mint and other varieties', 'Фруктовий · трав’яний · м’ятний та інші сорти', generated('hot-tea-varieties'))
      ]),
    milkshakes: section(['Milchshakes', 'Milkshakes', 'Молочні коктейлі'],
      ['Fünf Sorten zur Auswahl', 'Five flavours to choose from', 'П’ять смаків на вибір'], 'menu/milkshakes.webp',
      ['Vanille', 'Schoko', 'Erdbeere', 'Stracciatella', 'Kinder Bueno'].map((name, i) => item(name,
        'Milchshake · ' + name,
        'Milkshake · ' + ['vanilla', 'chocolate', 'strawberry', 'stracciatella', 'Kinder Bueno'][i],
        'Молочний коктейль · ' + ['ваніль', 'шоколад', 'полуниця', 'страчатела', 'Kinder Bueno'][i],
        [generated('vanilla-milkshake'), generated('chocolate-milkshake'), generated('milkshake-strawberry'), generated('milkshake-stracciatella'), generated('milkshake-kinder-bueno')][i]))),
    icecream: section(['Eiscreme', 'Ice cream', 'Морозиво'],
      ['Fünf Sorten · Portion mit 5 Kugeln', 'Five flavours · 5 scoops per serving', 'П’ять смаків · порція з 5 кульок'], 'menu/icecream.webp',
      ['Vanille', 'Schoko', 'Erdbeere', 'Stracciatella', 'Kinder Bueno'].map((name, i) => item(name,
        '5 Kugeln · ' + name,
        '5 scoops · ' + ['vanilla', 'chocolate', 'strawberry', 'stracciatella', 'Kinder Bueno'][i],
        '5 кульок · ' + ['ваніль', 'шоколад', 'полуниця', 'страчатела', 'Kinder Bueno'][i],
        [generated('vanilla-icecream'), generated('icecream-chocolate'), generated('icecream-strawberry'), generated('icecream-stracciatella'), generated('icecream-kinder-bueno')][i]))),
    shisha: section(['Shisha', 'Shisha', 'Кальяни'],
      ['Classic & Premium · alle Sorten aus unserer Karte', 'Classic & Premium · every flavour from our menu', 'Classic і Premium · усі смаки з меню'], 'menu/shisha.webp', [
        item('Wassermelone', 'Wassermelone', 'Watermelon', 'Кавун', generated('watermelon-shisha')),
        item('Doppelapfel', 'Roter Apfel · grüner Apfel · Anis', 'Red apple · green apple · anise', 'Червоне яблуко · зелене яблуко · аніс', generated('shisha-double-apple')),
        item('Traube Minze', 'Traube · Minze', 'Grape · mint', 'Виноград · м’ята', generated('shisha-grape-mint')),
        item('Ice Bonbon / Lemon', 'Eisbonbon · Zitrone · Frische', 'Ice candy · lemon · cooling freshness', 'Льодяникова цукерка · лимон · прохолода', generated('shisha-ice-bonbon-lemon')),
        item('Blueberry Minze', 'Blaubeere · Minze', 'Blueberry · mint', 'Чорниця · м’ята', generated('shisha-blueberry-mint')),
        item('Zitrone Minze', 'Zitrone · Minze', 'Lemon · mint', 'Лимон · м’ята', generated('shisha-lemon-mint')),
        item('Love 66', 'Wassermelone · Maracuja · Honigmelone · Minze', 'Watermelon · passion fruit · honeydew melon · mint', 'Кавун · маракуя · диня · м’ята', generated('shisha-love66')),
        item('Love Bavaria', 'Geheime Mischung des Gründers · Zutaten werden nicht verraten', 'Founder’s secret blend · ingredients are not disclosed', 'Секретна суміш засновника · склад не розголошується', generated('shisha-love-bavaria-akram')),
        item('Watermelon', 'Wassermelone', 'Watermelon', 'Кавун', generated('watermelon-shisha')),
        item('Mango Tango', 'Mango · Maracuja', 'Mango · passion fruit', 'Манго · маракуя', generated('shisha-mango-tango')),
        item('Moloko', 'Milch statt Wasser in der Bowl · kombinierbar mit dem gewünschten Geschmack', 'Milk instead of water in the base · can be combined with the chosen flavour', 'Молоко замість води в колбі · можна поєднати з обраним смаком', generated('shisha-moloko')),
        item('Baya Blue', 'Geheime blaue Hausmischung des Gründers · Zutaten werden nicht verraten', 'Founder’s secret blue house blend · ingredients are not disclosed', 'Секретна синя суміш засновника · склад не розголошується', generated('shisha-baya-blue-akram')),
        item('Cinderella', 'Beeren · Wassermelone · Honigmelone · Mango · Maracuja', 'Berries · watermelon · honeydew melon · mango · passion fruit', 'Ягоди · кавун · диня · манго · маракуя', generated('shisha-cinderella')),
        item('Arctic Line', 'Limette · Menthol', 'Lime · menthol', 'Лайм · ментол', generated('shisha-arctic-line')),
        item('Istanbul', 'Rote Traube · Blaubeere · Himbeere · Erdbeere · Menthol', 'Red grape · blueberry · raspberry · strawberry · menthol', 'Червоний виноград · чорниця · малина · полуниця · ментол', generated('shisha-istanbul')),
        item('Akram Spezial', 'Persönliche Geheimrezeptur von Akram · Zutaten werden nicht verraten', 'Akram’s personal secret recipe · ingredients are not disclosed', 'Особистий секретний рецепт Акрама · склад не розголошується', generated('shisha-akram-special')),
        item('African Queen', 'Beeren · schwarze Johannisbeere · Traube · Kokos · Gewürze · Frische', 'Berries · blackcurrant · grape · coconut · spice · cooling freshness', 'Ягоди · чорна смородина · виноград · кокос · спеції · прохолода', generated('shisha-african-queen')),
        item('Lemon Chill', 'Zitrone · Minze · Frische', 'Lemon · mint · cooling freshness', 'Лимон · м’ята · прохолода', generated('shisha-lemon-chill')),
        item('Eis Kaktus', 'Kaktusfeige · Eis', 'Prickly pear · ice', 'Опунція · лід', generated('shisha-ice-cactus')),
        item('Sommer in Beirut', 'Himbeere · Wassermelone · Zitrone', 'Raspberry · watermelon · lemon', 'Малина · кавун · лимон', generated('shisha-summer-beirut')),
        item('Black Nana', 'Schwarze Traube · Minze', 'Black grape · mint', 'Чорний виноград · м’ята', generated('shisha-black-nana'))
      ]),
    bottles: section(['Flaschen & Sets', 'Bottles & sets', 'Пляшки та набори'],
      ['Flaschenangebote mit den Beilagen aus unserer Karte', 'Bottle selections with the accompaniments listed in our menu', 'Пляшки з доповненнями, зазначеними в меню'], 'menu/bottles.webp', [
        ...['Chivas', 'Jack Daniel’s', 'Jim Beam', 'Red Label', 'Black Label', 'Jack Daniel’s (Single)', 'Bacardi'].map(name => item(name,
          '1 Fl. Cola · 1 Shisha · Pistazien · Chips', '1 bottle of cola · 1 shisha · pistachios · crisps', '1 пляшка коли · 1 кальян · фісташки · чипси',
          name === 'Chivas' ? generated('set-chivas-complete') : name === 'Jack Daniel’s' ? generated('set-jack-daniels-complete') : name === 'Jim Beam' ? generated('set-jim-beam-complete') : name === 'Red Label' ? generated('set-red-label-complete') : name === 'Black Label' ? generated('set-black-label-complete') : name === 'Jack Daniel’s (Single)' ? generated('set-jack-single-complete') : name === 'Bacardi' ? generated('set-bacardi-complete') : undefined)),
        item('Grey Goose', '4 Red Bull · 1 Shisha · Pistazien', '4 Red Bull · 1 shisha · pistachios', '4 Red Bull · 1 кальян · фісташки', generated('set-grey-goose-complete')),
        ...['Three Sixty', 'Absolut Vodka'].map(name => item(name, '1 Fl. Energy · 1 Shisha · Pistazien · Chips', '1 bottle of energy drink · 1 shisha · pistachios · crisps', '1 пляшка енергетика · 1 кальян · фісташки · чипси', name === 'Three Sixty' ? generated('set-three-sixty-complete') : generated('set-absolut-complete'))),
        item('Yeni Raki', '4 Wasser · 1 Shisha · Pistazien', '4 waters · 1 shisha · pistachios', '4 води · 1 кальян · фісташки', generated('set-yeni-raki-complete'))
      ]),
    snacks: section(['Snacks & Obst', 'Snacks & fruit', 'Снеки та фрукти'],
      ['Für zwischendurch oder für die Runde', 'A little something for yourself or the group', 'Для себе або на компанію'], 'menu/snacks.webp', [
        item('Pistazien', 'Pistazien', 'Pistachios', 'Фісташки', generated('snack-pistachios')),
        item('Erdnüsse', 'Erdnüsse', 'Peanuts', 'Арахіс', generated('snack-peanuts')),
        item('Tortilla Chips', 'Tortilla Chips', 'Tortilla chips', 'Кукурудзяні чипси', generated('snack-tortilla-chips')),
        item('Salzstangen', 'Salzstangen', 'Pretzel sticks', 'Солона соломка', generated('snack-pretzel-sticks')),
        item('Chips', 'Chips', 'Crisps', 'Чипси', generated('snack-potato-chips')),
        item('Obstteller', 'Obstteller · Auswahl bitte vor Ort erfragen', 'Fruit platter · Ask the team about the selection', 'Фруктова тарілка · Асортимент уточнюйте у закладі', generated('snack-fruit-platter'))
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

