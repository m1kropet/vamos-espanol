/* Тест уровня, тренажёр звуков и справочник диалектов */
IT.placement = [
  ["«Hola» означает…", ["привет", "спасибо", "пока навсегда"], 0],
  ["Вам говорят «¡Gracias!». Ответ:", ["De nada.", "Por favor.", "Perdón."], 0],
  ["___ problema es grande.", ["El", "La", "Lo"], 0],
  ["Yo ___ ruso.", ["soy", "estoy", "tengo"], 0],
  ["Madrid ___ en España.", ["está", "es", "hay"], 0],
  ["Nosotros ___ hambre.", ["tenemos", "estamos", "somos"], 0],
  ["Ellos ___ español. (hablar)", ["hablan", "habláis", "hablo"], 0],
  ["Me ___ los perros.", ["gustan", "gusta", "gusto"], 0],
  ["6:45 — это…", ["Son las siete menos cuarto.", "Son las seis menos cuarto.", "Es la siete y cuarto."], 0],
  ["Hoy ___ mucho. (trabajar, yo, pretérito perfecto)", ["he trabajado", "trabajé ayer", "hemos trabajo"], 0],
  ["Ayer yo ___ al cine.", ["fui", "fue", "he ido"], 0],
  ["Mañana ___ más tiempo. (tener, yo)", ["tendré", "teneré", "tengo tenido"], 0],
  ["Ayer ellos me ___ la verdad. (decir)", ["dijeron", "dijieron", "decieron"], 0],
  ["De niño yo ___ en un pueblo. (vivir)", ["vivía", "viví ayer", "vivo"], 0],
  ["«Я только что пришёл»:", ["Acabo de llegar.", "Acabo llegar.", "Termino a llegar."], 0],
  ["Madrid es ___ grande que Málaga.", ["más", "tan", "muy"], 0],
  ["— ¿Le diste el libro a Ana? — Sí, ___ di.", ["se lo", "le lo", "lo le"], 0],
  ["Вежливая просьба: «___ ayudarme?»", ["¿Podría", "¿Puedo", "¿Podré"], 0]
];

/* Звуки для тренажёра произношения */
IT.sounds = [
  { s: "Чистые гласные", r: "Безударные гласные не ослабляются: «o» всегда «о», «e» всегда «э».", w: ["como", "pero", "mesa", "bonito", "teléfono"] },
  { s: "C + e/i, Z = [θ] / [с]", r: "В центре Испании — межзубный [θ], в Лат. Америке и Андалусии — [с].", w: ["cena", "cine", "plaza", "zapato", "gracias"] },
  { s: "QU, GU = [к], [г]", r: "В que, qui, gue, gui буква u не читается.", w: ["queso", "quiero", "guerra", "guitarra", "pequeño"] },
  { s: "G + e/i, J = [х]", r: "Твёрдый звук [х], в Испании — с хрипотцой.", w: ["gente", "jamón", "ojo", "jueves", "girar"] },
  { s: "LL, Y = [й]", r: "Как [й]; в Аргентине — как [ш] или [ж].", w: ["calle", "llamar", "yo", "playa", "pollo"] },
  { s: "Ñ = [нь]", r: "Мягкое [нь], как в «коньяк».", w: ["España", "mañana", "niño", "año", "pequeño"] },
  { s: "R и RR", r: "Одно r — один удар языком; rr и r в начале слова — раскатистое.", w: ["pero", "perro", "caro", "carro", "rosa", "Roma"] },
  { s: "B = V", r: "Читаются одинаково: [б], между гласными — мягче, губы не смыкаются.", w: ["vino", "bien", "beber", "vivir", "Cuba"] },
  { s: "Мягкое D", r: "Между гласными D почти как английское th в «this»; в разговоре -ado → -ao.", w: ["nada", "cansado", "ciudad", "Madrid", "todo"] },
  { s: "Немая H", r: "H не читается никогда.", w: ["hola", "hablar", "hotel", "ahora", "hijo"] },
  { s: "X в Мексике", r: "В названиях México, Oaxaca, Texas X читается как [х].", w: ["México", "mexicano", "Oaxaca", "Texas"] }
];

/* Справочник диалектов.
 * voice — код голоса для озвучки (если такой голос есть в системе пользователя).
 * features: [название, объяснение, пример]; vocab: [значение, вариант здесь, Испания]
 * markers: слова и формы, по которым офлайн-анализатор узнаёт вариант в тексте. */
IT.dialects = [
  { id: "castellano", name: "Испания (центр, Мадрид)", short: "Испания", flag: "🇪🇸", voice: "es-ES",
    about: "Норма, которую чаще всего учат в Европе. Чёткое произношение, межзубный [θ], местоимение vosotros и частое pretérito perfecto.",
    features: [
      ["Distinción: [θ] и [с]", "ce, ci, z — межзубный [θ], s — обычный [с]. «casa» (дом) и «caza» (охота) звучат по-разному.", "Gracias, Zaragoza"],
      ["Vosotros", "Неформальное «вы» мн. ч. с формами -áis, -éis, -ís.", "¿Cómo estáis? ¿Qué queréis?"],
      ["Pretérito perfecto о сегодняшнем дне", "О событиях сегодня говорят he + причастие.", "Hoy he comido paella."],
      ["Leísmo", "О человеке-мужчине часто le вместо lo.", "A Juan le vi ayer."],
      ["Разговорные слова", "vale (ок), tío/tía (чувак), guay (круто), mola (нравится), ¡venga! (давай!)", "¡Vale, tío, qué guay!"]
    ],
    vocab: [["машина", "coche", "coche"], ["компьютер", "ordenador", "ordenador"], ["сок", "zumo", "zumo"], ["мобильный", "móvil", "móvil"], ["ок", "vale", "vale"]],
    samples: [["¡Vale, tío! ¿Qué queréis tomar?", "Ок, чувак! Что будете пить?"], ["Hoy he quedado con mis amigos, ¡qué guay!", "Сегодня встречаюсь с друзьями — круто!"]],
    markers: ["vosotros", "vosotras", "habéis", "queréis", "estáis", "sois", "tenéis", "vale", "tío", "tía", "guay", "mola", "coche", "ordenador", "zumo", "móvil", "venga", "os"]
  },
  { id: "andaluz", name: "Андалусия (Севилья, Малага)", short: "Андалусия", flag: "🇪🇸", voice: "es-ES",
    about: "Южный вариант Испании: быстрый, мелодичный, с «проглатыванием» звуков. Его часто слышно в фильмах и сериалах.",
    features: [
      ["Seseo / ceceo", "Многие говорят [с] вместо [θ] (seseo), а в некоторых районах наоборот — [θ] вместо [с] (ceceo).", "«grasias» вместо «graθias»"],
      ["Придыхание S", "S в конце слога становится лёгким выдохом [h] или исчезает.", "«lah cosah» = las cosas; «ehto» = esto"],
      ["Выпадение D", "-ado → -ao, -ada → -á; d в конце слова исчезает.", "«cansao» = cansado; «Madrí» = Madrid"],
      ["Ustedes вместо vosotros", "В западной Андалусии ustedes используют для «вы» даже с друзьями.", "¿Ustedes vais? (смешение)"],
      ["Слова", "quillo/illo (дружище), pisha (Кадис), ¡ozú! (ничего себе!)", "¡Illo, qué calor!"]
    ],
    vocab: [["дружище", "illo / quillo", "tío"], ["ничего себе", "¡ozú!", "¡madre mía!"], ["очень", "mu (muy)", "muy"]],
    samples: [["¡Illo, qué calor hace hoy!", "Дружище, ну и жара сегодня!"], ["Estoy cansao, me voy pa casa.", "Я устал, пойду домой."]],
    markers: ["illo", "quillo", "pisha", "ozú", "cansao", "pa casa", "mu bien", "ehto", "lah"]
  },
  { id: "mexicano", name: "Мексика", short: "Мексика", flag: "🇲🇽", voice: "es-MX",
    about: "Самый многочисленный вариант испанского. Чёткие согласные, певучая интонация, много уменьшительных и вежливых формул.",
    features: [
      ["Seseo", "ce, ci, z звучат как [с]: «gracias» = «грАсьяс».", "Gracias, plaza"],
      ["Ustedes вместо vosotros", "Для любой группы — ustedes.", "¿Cómo están, chicos?"],
      ["Чёткие согласные", "S не выпадает, гласные иногда «проглатываются»: «pes» (pues).", "Pues sí."],
      ["Уменьшительные", "ahorita (прямо сейчас / скоро), cafecito, poquito.", "Ahorita vengo."],
      ["Вежливые формулы", "¿Mande? (простите? что?), a sus órdenes, con permiso.", "¿Mande? No le escuché."],
      ["Сленг", "güey (чувак), ¡órale! (давай!/ого!), padre/padrísimo (классно), chido (круто), ¿qué onda? (как дела?)", "¡Qué padre, güey!"]
    ],
    vocab: [["машина", "carro", "coche"], ["компьютер", "computadora", "ordenador"], ["сок", "jugo", "zumo"], ["мобильный", "celular", "móvil"], ["ок", "órale / sale", "vale"], ["круто", "padre / chido", "guay"]],
    samples: [["¿Qué onda, güey? ¿Vamos por unos tacos?", "Как дела, чувак? Пойдём за тако?"], ["Ahorita le traigo la cuenta.", "Сейчас принесу Вам счёт."]],
    markers: ["güey", "wey", "órale", "chido", "padre", "padrísimo", "ahorita", "mande", "qué onda", "carro", "jugo", "celular", "computadora", "platicar", "sale", "neta", "chamba", "ándale"]
  },
  { id: "rioplatense", name: "Аргентина и Уругвай", short: "Аргентина", flag: "🇦🇷", voice: "es-AR",
    about: "Узнаётся с первой фразы: «ш» вместо «й», voseo и итальянская интонация (влияние иммигрантов из Италии).",
    features: [
      ["Sheísmo / žeísmo", "ll и y звучат как [ш] или [ж]: «calle» = «кАше», «yo» = «шо».", "Me llamo… = «ме шАмо»"],
      ["Voseo", "Vos вместо tú, с ударением на окончании: vos sos, vos tenés, vos querés.", "¿Vos sos de acá?"],
      ["Повелительное с vos", "Vení, tomá, decime — ударение на последний слог.", "¡Vení acá!"],
      ["Интонация", "Певучая, «итальянская» мелодия фразы.", "¡Qué lindo!"],
      ["Слова", "che (эй, дружище), boludo (дружеское «чувак» среди друзей; иначе — оскорбление!), dale (ок), laburo (работа), re (очень)", "Che, dale, nos vemos."]
    ],
    vocab: [["машина", "auto", "coche"], ["компьютер", "computadora", "ordenador"], ["работа", "laburo", "curro"], ["ок", "dale", "vale"], ["здесь", "acá", "aquí"], ["красивый", "lindo", "bonito"]],
    samples: [["Che, ¿vos querés venir a tomar mate?", "Эй, хочешь прийти попить мате?"], ["Dale, nos vemos mañana en el laburo.", "Ок, увидимся завтра на работе."]],
    markers: ["vos", "sos", "tenés", "querés", "podés", "sabés", "che", "boludo", "dale", "laburo", "acá", "re ", "mate", "vení", "decime", "pibe", "mina", "quilombo"]
  },
  { id: "caribe", name: "Карибы (Куба, Пуэрто-Рико, Доминикана)", short: "Карибы", flag: "🇨🇺", voice: "es-US",
    about: "Быстрый, ритмичный испанский с сильным «проглатыванием» звуков. Звучит в реггетоне и сальсе.",
    features: [
      ["Выпадение и придыхание S", "s в конце слога исчезает или становится [h].", "«¿Cómo ehtá?» = ¿Cómo estás?"],
      ["Смешение R и L", "r в конце слога звучит как l (Пуэрто-Рико).", "«Puelto Rico», «amol» = amor"],
      ["Сокращения", "para → pa, nada → na, para el → pal.", "Voy pa la playa."],
      ["Вопросы без инверсии", "¿Qué tú quieres? вместо ¿Qué quieres tú?", "¿Qué tú dices?"],
      ["Слова", "chévere (классно), asere (дружище, Куба), guagua (автобус), pana (друг), vacilar (веселиться)", "¡Qué chévere, asere!"]
    ],
    vocab: [["автобус", "guagua", "autobús"], ["классно", "chévere", "guay"], ["друг", "pana / asere", "tío"], ["апельсин", "china (Пуэрто-Рико)", "naranja"]],
    samples: [["¡Asere, qué bolá! ¿Qué tú haces?", "Дружище, как дела? Что делаешь?"], ["Vamos pa la playa en la guagua.", "Поехали на пляж на автобусе."]],
    markers: ["chévere", "asere", "guagua", "pana", "qué bolá", "qué tú", "pa la", "vacilar", "boricua", "bacán"]
  },
  { id: "colombiano", name: "Колумбия (Богота, Медельин)", short: "Колумбия", flag: "🇨🇴", voice: "es-CO",
    about: "Боготинский вариант считается одним из самых понятных и «чистых» для изучающих. Много вежливости и usted даже между близкими.",
    features: [
      ["Usted с близкими", "В Боготе и Медельине usted говорят даже друзьям и детям.", "Mijo, ¿usted ya comió?"],
      ["Ясное произношение", "Согласные произносятся полностью, s не выпадает.", "Gracias, buenas tardes."],
      ["Вежливость", "¿Me regala…? (дайте, пожалуйста…), con mucho gusto (пожалуйста, в ответ на gracias), a la orden.", "¿Me regala un tinto?"],
      ["Уменьшительные", "ahorita, cafecito, «-ico» после t: momentico, ratico.", "Espéreme un momentico."],
      ["Слова", "parce/parcero (друг), bacano/chimba (круто), tinto (чёрный кофе!), juicioso (прилежный)", "¡Qué bacano, parce!"]
    ],
    vocab: [["чёрный кофе", "tinto", "café solo"], ["друг", "parce", "tío"], ["круто", "bacano / chévere", "guay"], ["пожалуйста (ответ)", "con mucho gusto", "de nada"]],
    samples: [["Parce, ¿me regala un tinto, por favor?", "Друг, дайте мне чёрный кофе, пожалуйста."], ["Con mucho gusto. Espéreme un momentico.", "С удовольствием. Подождите минутку."]],
    markers: ["parce", "parcero", "bacano", "chimba", "me regala", "tinto", "momentico", "a la orden", "con mucho gusto", "mijo", "berraco"]
  },
  { id: "chileno", name: "Чили", short: "Чили", flag: "🇨🇱", voice: "es-CL",
    about: "Считается одним из самых трудных для понимания вариантов: очень быстро, много сленга и своего voseo.",
    features: [
      ["Чилийское voseo", "Формы на -ái, -ís: ¿Cómo estái? ¿Querís? (при местоимении tú).", "¿Cachái?"],
      ["Выпадение S", "s в конце слога почти не слышна.", "«lo amigo» = los amigos"],
      ["Частица po", "po (от pues) в конце фраз: sí po, ya po.", "¡Ya po, vamos!"],
      ["Слова", "cachai (понимаешь?), weón (чувак — очень разговорное!), fome (скучный), bacán (круто), luca (тысяча песо), pololo/polola (парень/девушка)", "La película es fome, weón."]
    ],
    vocab: [["понимаешь?", "¿cachai?", "¿entiendes?"], ["скучный", "fome", "aburrido"], ["парень (отношения)", "pololo", "novio"], ["круто", "bacán", "guay"]],
    samples: [["¿Cachai? Ya po, vamos a la playa.", "Понимаешь? Ну всё, пошли на пляж."], ["Mi polola es muy simpática.", "Моя девушка очень милая."]],
    markers: ["cachai", "cachái", "po", "weón", "huevón", "fome", "bacán", "luca", "pololo", "polola", "estái", "querís", "al tiro"]
  }
];
