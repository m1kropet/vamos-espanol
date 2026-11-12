/* Курс A2, часть 3: блоки 8–13 (покупки, здоровье, императив, погода и por/para, condicional, дом и работа).
 * Формат описан в a1-part1.js */
IT.addUnits("A2", [
{
  id: "a2u8", city: "Madrid", scene: "market",
  t: "Покупки и одежда", ti: "De compras",
  d: "Одежда, цвета и размеры, este / ese / aquel и всё, что нужно сказать в магазине.",
  lessons: [
  {
    id: "a2u8l1", t: "Одежда и este, ese, aquel", ti: "La ropa", tags: ["compras"],
    goal: "Выучите названия одежды и научитесь указывать: «эта», «та», «вон та».",
    th: [
      { h: "Одежда", b: `| | |
| [[la camiseta]] | футболка |
| [[la camisa]] | рубашка |
| [[los pantalones]] | брюки |
| [[los vaqueros]] | джинсы |
| [[la falda]] | юбка |
| [[el vestido]] | платье |
| [[la chaqueta]] | куртка, пиджак |
| [[el abrigo]] | пальто |
| [[los zapatos]] | туфли, обувь |
| [[las zapatillas]] | кроссовки |
| [[el jersey]] | свитер (в Мексике — el suéter) |

Носить — **llevar**: [[Hoy llevo vaqueros.]]` },
      { h: "Этот, тот, вон тот", b: `| Близко ко мне | Близко к тебе | Далеко от нас |
| **este** / **esta** | **ese** / **esa** | **aquel** / **aquella** |
| **estos** / **estas** | **esos** / **esas** | **aquellos** / **aquellas** |

[[Esta camiseta es bonita.]] — Эта футболка (у меня в руках).
[[¿Cuánto cuesta esa chaqueta?]] — Сколько стоит та куртка (возле тебя)?
[[Aquel abrigo es carísimo.]] — Вон то пальто (далеко).

? Без существительного — то же самое: [[Me gusta esta.]] [[Quiero ese.]] Средний род «это» — **esto, eso, aquello**: [[¿Qué es esto?]]` },
      { h: "Цвета и согласование", b: `Цвета на **-o** меняются: [[rojo]] → roja, rojos, rojas; [[blanco]], [[negro]], [[amarillo]].
Цвета на **-e** или согласную — только по числу: [[verde]] → verdes, [[azul]] → azules, [[gris]] → grises.
Цвета-существительные **не меняются**: [[naranja]], [[rosa]], [[lila]]: *unas camisas rosa*.

[[Busco una falda negra.]] [[Me encantan esos zapatos azules.]]

! Цвет ставится **после** существительного: *una camisa blanca*, не *una blanca camisa*.` }
    ],
    ex: [
      ["Hoy llevo una camiseta blanca y vaqueros.", "Сегодня на мне белая футболка и джинсы.", "Hoy=сегодня|llevo=ношу, на мне|una camiseta blanca=белая футболка|y=и|vaqueros=джинсы"],
      ["¿Cuánto cuesta esa chaqueta?", "Сколько стоит та куртка?", "Cuánto cuesta=сколько стоит|esa chaqueta=та куртка"],
      ["Me gustan estos zapatos negros.", "Мне нравятся эти чёрные туфли.", "Me gustan=мне нравятся|estos zapatos=эти туфли|negros=чёрные"],
      ["Aquel vestido rojo es precioso.", "Вон то красное платье прекрасно.", "Aquel vestido=вон то платье|rojo=красное|es precioso=прекрасное"],
      ["Busco un jersey gris.", "Я ищу серый свитер.", "Busco=я ищу|un jersey=свитер|gris=серый"],
      ["¿Qué es esto?", "Что это?", "Qué=что|es=есть|esto=это"]
    ],
    warn: [
      ["Esta zapatos", "Estos zapatos", "Согласование: estos (м. р. мн.)."],
      ["Una blanca camisa", "Una camisa blanca", "Цвет — после существительного."],
      ["Unas faldas azulas", "Unas faldas azules", "azul → azules (не изменяется по роду)."]
    ],
    voc: [
      "la ropa|одежда|ла рОпа|n.f", "la camiseta|футболка|ла камисЭта|n.f", "los pantalones|брюки|лос панталОнэс|n.m.pl", "los vaqueros|джинсы|лос бакЭрос|n.m.pl",
      "la falda|юбка|ла фАльда|n.f", "el vestido|платье|эль бэстИдо|n.m", "la chaqueta|куртка|ла чакЭта|n.f", "el abrigo|пальто|эль абрИго|n.m",
      "los zapatos|туфли|лос сапАтос|n.m.pl", "llevar puesto|быть одетым в|йэбАр пуЭсто|phr", "este|этот|Эстэ|pron", "aquel|тот (дальний)|акЭль|pron",
      "gris|серый|грис|adj", "buscar|искать|баскАр|v"
    ],
    q: [
      ["c", "___ pantalones son muy caros. (рядом со мной)", ["Estos", "Estas", "Este"], 0, "los pantalones → estos."],
      ["c", "«Мне нравится вон та юбка (далеко)»:", ["Me gusta aquella falda.", "Me gusta aquel falda.", "Me gusta esa faldo."], 0, "la falda → aquella."],
      ["c", "Unos zapatos ___.", ["verdes", "verdos", "verde"], 0, "verde → verdes."],
      ["c", "«Что это?» (непонятный предмет):", ["¿Qué es esto?", "¿Qué es este?", "¿Qué es esta?"], 0, "Средний род — esto."],
      ["f", "Hoy ___ un vestido azul. (llevar, yo)", "llevo", "llevar — носить (одежду).", "ношу"],
      ["f", "Quiero una camisa ___. (blanco)", "blanca", "Согласование: blanca.", "белая"],
      ["x", "Me encanta esta abrigo.", "Me encanta este abrigo.", "el abrigo → este."],
      ["x", "Busco una negra chaqueta.", "Busco una chaqueta negra.", "Цвет — после существительного."],
      ["s", "Продавщица показывает на куртку рядом с ней. Вы спрашиваете цену.", ["¿Cuánto cuesta esa chaqueta?", "¿Cuánto cuesta aquel chaqueta?", "¿Cuántos años tiene esa chaqueta?"], 0, "Возле собеседника — esa."]
    ]
  },
  {
    id: "a2u8l2", t: "В магазине: примерка и оплата", ti: "En la tienda", tags: ["compras"],
    goal: "Научитесь спрашивать размер, мерить, платить и возвращать вещи.",
    th: [
      { h: "Фразы покупателя", b: `| | |
| [[¿Puedo probármelo?]] | Можно это примерить? |
| [[¿Dónde están los probadores?]] | Где примерочные? |
| [[¿Tiene una talla más grande?]] | Есть размер побольше? |
| [[¿Lo tiene en negro?]] | Есть такое в чёрном? |
| [[Uso la talla M.]] | Я ношу размер M. |
| [[Calzo el cuarenta.]] | У меня 40-й размер обуви. |
| [[Me lo llevo.]] | Я это беру. |
| [[Solo estoy mirando, gracias.]] | Я просто смотрю, спасибо. |` },
      { h: "Quedar: сидит / не сидит", b: `**Quedar** работает как **gustar**: вещь «сидит» на мне.

[[Esta camisa me queda bien.]] — Эта рубашка мне идёт / хорошо сидит.
[[Estos pantalones me quedan grandes.]] — Эти брюки мне велики.
[[¿Cómo me queda?]] — Как на мне сидит?

| | |
| me queda pequeño / grande | мал / велик |
| me queda corto / largo | короток / длинен |
| me queda estrecho / ancho | узок / широк |` },
      { h: "Оплата и цены", b: `| | |
| [[¿Cuánto es?]] | Сколько с меня? |
| [[¿Puedo pagar con tarjeta?]] | Можно картой? |
| [[en efectivo]] | наличными |
| [[Está rebajado.]] | Это со скидкой. |
| [[las rebajas]] | распродажа |
| [[¿Puedo devolverlo?]] | Можно это вернуть? |
| [[el tique]] / [[el recibo]] | чек |

Большие числа: **cien** (100), **ciento veinte** (120), **doscientos/as** (200), **quinientos** (500), **mil** (1000), **dos mil**, **un millón**.
[[Son doscientos cincuenta euros.]]` }
    ],
    ex: [
      ["¿Puedo probarme estos vaqueros?", "Можно примерить эти джинсы?", "Puedo=могу|probarme=примерить на себя|estos vaqueros=эти джинсы"],
      ["¿Tiene una talla más pequeña?", "У вас есть размер поменьше?", "Tiene=у Вас есть|una talla=размер|más pequeña=поменьше"],
      ["Esta chaqueta me queda grande.", "Эта куртка мне велика.", "Esta chaqueta=эта куртка|me queda=мне сидит|grande=большая"],
      ["Me la llevo. ¿Puedo pagar con tarjeta?", "Беру её. Можно картой?", "Me la llevo=я её беру|Puedo=можно|pagar=заплатить|con tarjeta=картой"],
      ["Son ciento veinte euros.", "Это сто двадцать евро.", "Son=это (составляет)|ciento veinte=сто двадцать|euros=евро"],
      ["Quería devolver esta camisa, me queda pequeña.", "Я хотел(а) бы вернуть эту рубашку, она мне мала.", "Quería=я хотел бы|devolver=вернуть|esta camisa=эту рубашку|me queda pequeña=мне мала"]
    ],
    warn: [
      ["Esta camisa queda me bien", "Esta camisa me queda bien", "me перед quedar, как с gustar."],
      ["Ciento euros", "Cien euros", "Ровно 100 — cien."],
      ["Doscientas euros", "Doscientos euros", "euro — м. р.: doscientos."]
    ],
    voc: [
      "la talla|размер (одежды)|ла тАйа|n.f", "probarse|примерять|пробАрсэ|v", "el probador|примерочная|эль пробадОр|n.m", "quedar bien|хорошо сидеть, идти|кэдАр бьэн|phr",
      "estrecho|узкий|эстрЭчо|adj", "ancho|широкий|Анчо|adj", "pagar|платить|пагАр|v", "la tarjeta|карта|ла тархЭта|n.f",
      "en efectivo|наличными|эн эфэктИбо|phr", "las rebajas|распродажа|лас рэбАхас|n.f.pl", "devolver|возвращать (вещь)|дэбольбЭр|v", "doscientos|двести|досьЭнтос|num",
      "mil|тысяча|миль|num", "llevarse|забирать с собой, брать|йэбАрсэ|v"
    ],
    q: [
      ["c", "Estos zapatos me ___ pequeños.", ["quedan", "queda", "quedo"], 0, "Как gustar: zapatos → quedan."],
      ["c", "«Можно это примерить?» (вещь — el jersey)", ["¿Puedo probármelo?", "¿Puedo probarlo me?", "¿Puedo me lo probar?"], 0, "probarme + lo → probármelo."],
      ["c", "500 евро:", ["quinientos euros", "cincocientos euros", "quinientas euros"], 0, "500 — quinientos."],
      ["c", "«Я просто смотрю»:", ["Solo estoy mirando.", "Solo soy mirando.", "Solo miro a usted."], 0, "estar + gerundio."],
      ["f", "¿Puedo pagar ___ tarjeta?", "con", "pagar con tarjeta.", "предлог"],
      ["f", "Me gusta mucho. Me lo ___. (llevar)", "llevo", "Me lo llevo — беру.", "беру"],
      ["x", "Son ciento euros.", "Son cien euros.", "Ровно сто — cien."],
      ["x", "Esta falda queda me larga.", "Esta falda me queda larga.", "Местоимение перед глаголом."],
      ["d", [["Dependienta", "Hola, ¿te puedo ayudar en algo?", "Здравствуйте, вам чем-нибудь помочь?"]], ["Sí, ¿tienes esta camiseta en la talla M?", "Sí, ¿cuánto años tiene la talla?", "No, soy mirando."], 0, "Спросите размер: ¿tienes… en la talla M?"]
    ]
  }
  ]
},
{
  id: "a2u9", city: "Valencia", scene: "valencia",
  t: "Здоровье", ti: "La salud",
  d: "Тело, «у меня болит», у врача и в аптеке; советы: tienes que, deberías, es mejor.",
  lessons: [
  {
    id: "a2u9l1", t: "Тело и «у меня болит»", ti: "El cuerpo", tags: ["salud"],
    goal: "Научитесь называть части тела и объяснять, что болит.",
    th: [
      { h: "Части тела", b: `| | |
| [[la cabeza]] | голова |
| [[la garganta]] | горло |
| [[el estómago]] / [[la tripa]] | живот |
| [[la espalda]] | спина |
| [[el brazo]] | рука (от плеча) |
| [[la mano]] | кисть, рука |
| [[la pierna]] | нога |
| [[el pie]] | ступня |
| [[los ojos]] | глаза |
| [[los oídos]] | уши (внутреннее ухо) |
| [[las muelas]] | зубы (коренные) |

! **la mano** — женский род, хотя кончается на -o.` },
      { h: "Doler — как gustar", b: `**Doler** (o→ue) спрягается как **gustar**: болит *что-то* у *меня*.

| | |
| [[Me duele la cabeza.]] | У меня болит голова. |
| [[Me duelen los pies.]] | У меня болят ноги (ступни). |
| [[¿Te duele algo?]] | У тебя что-нибудь болит? |
| [[A mi hijo le duele la garganta.]] | У сына болит горло. |

! С частями тела — **артикль**, не *mi*: *me duele **la** cabeza*, не *mi cabeza*.` },
      { h: "Как я себя чувствую", b: `| | |
| [[Estoy enfermo / enferma.]] | Я болен / больна. |
| [[Estoy resfriado.]] | Я простужен. |
| [[Tengo fiebre.]] | У меня температура. |
| [[Tengo tos.]] | У меня кашель. |
| [[Tengo gripe.]] | У меня грипп. |
| [[Estoy mareado.]] | У меня кружится голова, тошнит. |
| [[Me encuentro mal.]] | Я плохо себя чувствую. |
| [[Me he cortado.]] | Я порезался. |

? **Estar** — временное состояние, **tener** — симптом: *estoy resfriado, tengo tos*.` }
    ],
    ex: [
      ["Me duele mucho la cabeza.", "У меня сильно болит голова.", "Me duele=у меня болит|mucho=сильно|la cabeza=голова"],
      ["Me duelen los oídos.", "У меня болят уши.", "Me duelen=у меня болят|los oídos=уши"],
      ["Tengo fiebre y tos.", "У меня температура и кашель.", "Tengo=у меня есть|fiebre=температура|y=и|tos=кашель"],
      ["Estoy resfriada desde el lunes.", "Я простужена с понедельника.", "Estoy resfriada=я простужена|desde el lunes=с понедельника"],
      ["¿Te duele la espalda?", "У тебя болит спина?", "Te duele=у тебя болит|la espalda=спина"],
      ["Hoy me encuentro mal, no voy a trabajar.", "Сегодня я плохо себя чувствую, не пойду на работу.", "Hoy=сегодня|me encuentro mal=я плохо себя чувствую|no voy a trabajar=не пойду работать"]
    ],
    warn: [
      ["Me duele mi cabeza", "Me duele la cabeza", "С частями тела — артикль."],
      ["Me duele los pies", "Me duelen los pies", "Мн. число → duelen."],
      ["Soy resfriado", "Estoy resfriado", "Временное состояние — estar."]
    ],
    voc: [
      "la garganta|горло|ла гаргАнта|n.f", "el estómago|желудок, живот|эль эстОмаго|n.m", "la espalda|спина|ла эспАльда|n.f", "el brazo|рука (от плеча)|эль брАсо|n.m",
      "la pierna|нога|ла пьЭрна|n.f", "la fiebre|температура, жар|ла фьЭбрэ|n.f", "la tos|кашель|ла тос|n.f", "resfriado|простуженный|рэсфриАдо|adj",
      "la gripe|грипп|ла грИпэ|n.f", "encontrarse mal|плохо себя чувствовать|энконтрАрсэ маль|phr"
    ],
    q: [
      ["c", "Me ___ las piernas.", ["duelen", "duele", "dolen"], 0, "las piernas → duelen."],
      ["c", "«У меня болит горло»:", ["Me duele la garganta.", "Me duele mi garganta.", "Tengo duele garganta."], 0, "Me duele + артикль."],
      ["c", "Мой брат простужен:", ["Mi hermano está resfriado.", "Mi hermano es resfriado.", "Mi hermano tiene resfriado."], 0, "Состояние — estar."],
      ["c", "«Рука (кисть)» — род:", ["la mano", "el mano", "la mana"], 0, "la mano — исключение."],
      ["f", "A Lucía le ___ el estómago.", "duele", "el estómago → duele.", "болит"],
      ["f", "Tengo ___ de 39 grados.", "fiebre", "Температура — fiebre.", "жар"],
      ["x", "Me duele los ojos.", "Me duelen los ojos.", "los ojos → duelen."],
      ["x", "Le duele su espalda a mi madre.", "A mi madre le duele la espalda./Le duele la espalda a mi madre.", "Артикль la, не su."],
      ["s", "Звоните на работу: вы заболели и не придёте.", ["Hola, estoy enfermo y hoy no puedo ir a trabajar.", "Hola, soy enfermo y hoy voy a trabajar.", "Hola, me duelo enfermo."], 0, "Estoy enfermo… no puedo ir."]
    ]
  },
  {
    id: "a2u9l2", t: "У врача и в аптеке: советы", ti: "En el médico", tags: ["salud"],
    goal: "Научитесь описывать симптомы врачу, понимать советы и давать их сами.",
    th: [
      { h: "Как давать советы", b: `| Формула | Сила | Пример |
| **tener que** + inf. | нужно, обязательно | [[Tienes que descansar.]] |
| **hay que** + inf. | нужно (вообще, всем) | [[Hay que beber mucha agua.]] |
| **deber** + inf. | следует | [[Debes tomar este jarabe.]] |
| **deberías** + inf. | тебе стоило бы (мягко) | [[Deberías ir al médico.]] |
| **es mejor** + inf. | лучше | [[Es mejor no salir hoy.]] |
| **¿Por qué no…?** | почему бы не | [[¿Por qué no tomas un té?]] |` },
      { h: "Диалог с врачом", b: `| Врач | Пациент |
| [[¿Qué le pasa?]] — Что с Вами? | [[Me duele aquí.]] — Болит здесь. |
| [[¿Desde cuándo?]] — С какого времени? | [[Desde hace tres días.]] — Уже три дня. |
| [[¿Tiene alergia a algo?]] | [[Soy alérgico a la penicilina.]] |
| [[Le voy a recetar…]] — Выпишу Вам… | [[¿Cada cuánto lo tomo?]] — Как часто принимать? |
| [[Cada ocho horas.]] — Каждые 8 часов. | |

? Врач обычно обращается на **usted**: *¿Qué **le** pasa?*, *Tome…*` },
      { h: "В аптеке", b: `| | |
| [[la farmacia]] | аптека (зелёный крест) |
| [[la receta]] | рецепт |
| [[las pastillas]] | таблетки |
| [[el jarabe]] | сироп |
| [[la crema]] | мазь, крем |
| [[las tiritas]] | пластыри (в Мексике — curitas) |
| [[¿Tiene algo para la tos?]] | У вас есть что-нибудь от кашля? |
| [[¿Necesito receta?]] | Нужен рецепт? |

! «От» в значении «против» — **para**: *algo **para** el dolor de cabeza*.` }
    ],
    ex: [
      ["¿Qué le pasa? — Me duele aquí.", "Что с Вами? — Болит здесь.", "Qué le pasa=что с Вами|Me duele=у меня болит|aquí=здесь"],
      ["Tienes que descansar y beber mucha agua.", "Тебе нужно отдыхать и пить много воды.", "Tienes que=тебе нужно|descansar=отдыхать|y=и|beber=пить|mucha agua=много воды"],
      ["Deberías ir al médico.", "Тебе стоило бы сходить к врачу.", "Deberías=тебе стоило бы|ir=пойти|al médico=к врачу"],
      ["¿Tiene algo para el dolor de cabeza?", "У вас есть что-нибудь от головной боли?", "Tiene=у Вас есть|algo=что-нибудь|para=от|el dolor de cabeza=головная боль"],
      ["Tome una pastilla cada ocho horas.", "Принимайте по таблетке каждые восемь часов.", "Tome=принимайте|una pastilla=таблетку|cada ocho horas=каждые восемь часов"],
      ["Soy alérgica a los frutos secos.", "У меня аллергия на орехи.", "Soy alérgica=у меня аллергия|a los frutos secos=на орехи"]
    ],
    warn: [
      ["Algo contra la tos", "Algo para la tos", "«От» болезни — para."],
      ["Tienes descansar", "Tienes que descansar", "tener que + инфинитив."],
      ["Hay que tú bebes agua", "Hay que beber agua / Tienes que beber agua", "hay que — безлично, + инфинитив."]
    ],
    voc: [
      "la receta|рецепт|ла рэсЭта|n.f", "la pastilla|таблетка|ла пастИйа|n.f", "el jarabe|сироп|эль харАбэ|n.m", "descansar|отдыхать|дэскансАр|v",
      "el dolor|боль|эль долОр|n.m", "la alergia|аллергия|ла алЭрхья|n.f", "deber|быть должным|дэбЭр|v", "hay que|нужно (безлично)|ай кэ|phr",
      "cada|каждый|кАда|adj", "la cita|запись (к врачу); свидание|ла сИта|n.f", "el seguro médico|медицинская страховка|эль сэгУро мЭдико|n.m"
    ],
    q: [
      ["c", "«Тебе стоило бы отдохнуть» (мягкий совет):", ["Deberías descansar.", "Tienes descansar.", "Debes que descansar."], 0, "deberías + инфинитив."],
      ["c", "¿Tiene algo ___ la tos?", ["para", "contra de", "por"], 0, "algo para — от."],
      ["c", "Врач спрашивает «Что с Вами?»:", ["¿Qué le pasa?", "¿Qué te pasas?", "¿Qué pasa usted?"], 0, "¿Qué le pasa? — на usted."],
      ["c", "«Каждые 8 часов»:", ["cada ocho horas", "todas ocho horas", "por ocho horas cada"], 0, "cada + число."],
      ["f", "Hay ___ tomar las pastillas después de comer.", "que", "hay que + инфинитив.", "нужно"],
      ["f", "Tienes ___ beber mucha agua.", "que", "tener que.", "нужно"],
      ["x", "Tienes ir al médico.", "Tienes que ir al médico.", "tener que + инфинитив."],
      ["x", "Necesito algo contra el dolor de cabeza.", "Necesito algo para el dolor de cabeza.", "От боли — para."],
      ["d", [["Médica", "Buenos días, ¿qué le pasa?", "Добрый день, что с Вами?"]], ["Me duele la garganta y tengo fiebre desde ayer.", "Me duelo la garganta desde ayer siempre.", "Soy fiebre y garganta."], 0, "Me duele… tengo fiebre desde ayer."]
    ]
  }
  ]
},
{
  id: "a2u10", city: "Sevilla", scene: "sevilla",
  t: "Просьбы и инструкции", ti: "El imperativo",
  d: "Повелительное наклонение: просьбы, советы, рецепты и как объяснить дорогу.",
  lessons: [
  {
    id: "a2u10l1", t: "Imperativo: ¡ven!, ¡mira!, ¡siéntese!", ti: "Imperativo afirmativo", tags: ["imperativo"],
    goal: "Научитесь просить и советовать: «посмотри», «садитесь», «скажи мне».",
    th: [
      { h: "Tú и vosotros", b: `| | hablar | comer | escribir |
| **tú** | [[habla]] | [[come]] | [[escribe]] |
| **vosotros** | [[hablad]] | [[comed]] | [[escribid]] |

**Tú** = форма «él» настоящего времени: *él habla* → ¡**habla**!

Неправильные формы для **tú** — их немного, выучите наизусть:

| decir | hacer | ir | poner | salir | ser | tener | venir |
| [[di]] | [[haz]] | [[ve]] | [[pon]] | [[sal]] | [[sé]] | [[ten]] | [[ven]] |` },
      { h: "Usted и ustedes", b: `Вежливые формы берут «противоположную» гласную: **-ar → -e**, **-er/-ir → -a**:

| | hablar | comer | escribir |
| **usted** | [[hable]] | [[coma]] | [[escriba]] |
| **ustedes** | [[hablen]] | [[coman]] | [[escriban]] |

Основа — от формы **yo**: tengo → [[tenga]], hago → [[haga]], digo → [[diga]], vengo → [[venga]], pongo → [[ponga]].
Особые: ir → [[vaya]], ser → [[sea]], estar → [[esté]], dar → [[dé]].

? [[¡Diga!]] / [[¿Dígame?]] — так в Испании отвечают на телефонный звонок.` },
      { h: "Местоимения приклеиваются", b: `В утвердительном императиве местоимения ставятся **в конец** — слитно:

| | |
| [[Siéntate.]] | Садись. |
| [[Siéntese.]] | Садитесь. |
| [[Dímelo.]] | Скажи мне это. |
| [[Pásame la sal.]] | Передай мне соль. |
| [[Llámame.]] | Позвони мне. |

! Если ударение смещается, ставится знак: *sienta* → **siéntate**, *di* + *me* + *lo* → **dímelo**.
Vosotros + os — выпадает **d**: *sentad + os* → **sentaos**.` }
    ],
    ex: [
      ["¡Ven aquí, por favor!", "Иди сюда, пожалуйста!", "Ven=иди (venir)|aquí=сюда|por favor=пожалуйста"],
      ["Mira, esta es la Giralda.", "Смотри, это Хиральда.", "Mira=смотри|esta es=это|la Giralda=Хиральда (башня в Севилье)"],
      ["Siéntese, por favor.", "Садитесь, пожалуйста.", "Siéntese=садитесь (usted)|por favor=пожалуйста"],
      ["Dime la verdad.", "Скажи мне правду.", "Dime=скажи мне|la verdad=правду"],
      ["Haz los deberes y luego sal a jugar.", "Сделай домашку, а потом иди гулять.", "Haz=сделай|los deberes=домашнее задание|y luego=а потом|sal=выходи|a jugar=играть"],
      ["Pasen, pasen, la mesa está lista.", "Проходите, проходите, стол готов.", "Pasen=проходите (ustedes)|la mesa=стол|está lista=готов"]
    ],
    warn: [
      ["¡Hace los deberes!", "¡Haz los deberes!", "hacer → haz."],
      ["Me llama", "Llámame", "Местоимение в конце + знак ударения."],
      ["¡Venga usted aquí! → «Viene usted»", "Venga (usted)", "usted: tengo → tenga, vengo → venga."]
    ],
    voc: [
      "sentarse|садиться|сэнтАрсэ|v", "los deberes|домашнее задание|лос дэбЭрэс|n.m.pl", "luego|потом|луЭго|adv", "la sal|соль|ла саль|n.f",
      "cerrar|закрывать|сэррАр|v",
      "el cuidado|осторожность|эль куидАдо|n.m", "la ventana|окно|ла бэнтАна|n.f", "callarse|замолчать|кайАрсэ|v", "tranquilo|спокойный|транкИло|adj", "dejar|оставлять; позволять|дэхАр|v", "traducir|переводить|традусИр|v", "poner|ставить, класть|понЭр|v"
    ],
    q: [
      ["c", "Imperativo «tú» от «hacer»:", ["haz", "hace", "haga"], 0, "hacer → haz."],
      ["c", "«Садитесь» (usted):", ["Siéntese.", "Siéntate.", "Se siente."], 0, "usted: siente + se."],
      ["c", "«Скажи мне это»:", ["Dímelo.", "Me lo di.", "Dilome."], 0, "di + me + lo, со знаком."],
      ["c", "Ustedes ___ aquí, por favor. (esperar)", ["esperen", "esperan", "esperad"], 0, "ustedes: -ar → -en."],
      ["f", "___ a mi casa mañana. (venir, tú)", "Ven", "venir → ven.", "приходи"],
      ["f", "Por favor, ___ la ventana. (abrir, usted)", "abra", "usted: -ir → -a.", "откройте"],
      ["x", "¡Tene cuidado!", "¡Ten cuidado!", "tener → ten."],
      ["x", "Me llama mañana, ¿vale? (просьба к другу)", "Llámame mañana, ¿vale?", "Местоимение в конце."],
      ["s", "Гости пришли к вам домой. Вы приглашаете их войти и сесть (ustedes).", ["Pasen y siéntense, por favor.", "Pasan y se sientan, por favor.", "Pasad y sientan ustedes."], 0, "Pasen, siéntense — ustedes."]
    ]
  },
  {
    id: "a2u10l2", t: "Отрицательный императив и дорога", ti: "Imperativo negativo", tags: ["imperativo"],
    goal: "Научитесь говорить «не делай» и объяснять дорогу и рецепт.",
    th: [
      { h: "No + …", b: `Отрицательный императив для всех лиц строится от **формы usted**:

| | hablar | comer | ir | hacer |
| tú | no habl**es** | no com**as** | no vay**as** | no hag**as** |
| usted | no habl**e** | no com**a** | no vay**a** | no hag**a** |
| vosotros | no habl**éis** | no com**áis** | no vay**áis** | no hag**áis** |
| ustedes | no habl**en** | no com**an** | no vay**an** | no hag**an** |

[[No hables tan rápido.]] [[No te preocupes.]] — Не волнуйся.

! В отрицании местоимения стоят **перед** глаголом: [[Dímelo]] → [[No me lo digas]].` },
      { h: "Как пройти?", b: `| | |
| [[Sigue todo recto.]] | Иди всё время прямо. |
| [[Gira a la derecha.]] | Поверни направо. |
| [[Toma la segunda a la izquierda.]] | Сверни на вторую налево. |
| [[Cruza la plaza.]] | Перейди площадь. |
| [[al final de la calle]] | в конце улицы |
| [[en la esquina]] | на углу |
| [[enfrente de]] | напротив |
| [[Está a cinco minutos andando.]] | В пяти минутах пешком. |` },
      { h: "Рецепт: imperativo на кухне", b: `Рецепты пишут в императиве (часто на **tú** или **usted**):

[[Corta las patatas.]] — Нарежь картофель.
[[Pon el aceite en la sartén.]] — Налей масло на сковороду.
[[Añade sal.]] — Добавь соль.
[[No lo frías demasiado.]] — Не пережарь.

? В Андалусии на кухне часто слышно: *¡Échale más sal!* — Добавь (досыпь) ещё соли!` }
    ],
    ex: [
      ["No te preocupes, todo va bien.", "Не волнуйся, всё хорошо.", "No te preocupes=не волнуйся|todo=всё|va bien=идёт хорошо"],
      ["No hables tan rápido, por favor.", "Не говори так быстро, пожалуйста.", "No hables=не говори|tan rápido=так быстро|por favor=пожалуйста"],
      ["Sigue todo recto y gira a la derecha.", "Иди прямо и поверни направо.", "Sigue=иди дальше|todo recto=всё прямо|y=и|gira=поверни|a la derecha=направо"],
      ["La catedral está al final de la calle.", "Собор в конце улицы.", "La catedral=собор|está=находится|al final de la calle=в конце улицы"],
      ["No me lo digas, ¡ya lo sé!", "Не говори мне, я уже знаю!", "No me lo digas=не говори мне этого|ya lo sé=я уже знаю"],
      ["Corta la cebolla y añade un poco de sal.", "Нарежь лук и добавь немного соли.", "Corta=нарежь|la cebolla=лук|y=и|añade=добавь|un poco de sal=немного соли"]
    ],
    warn: [
      ["No habla tan rápido (к другу)", "No hables tan rápido", "Отрицание tú: -ar → -es."],
      ["No dímelo", "No me lo digas", "В отрицании — другая форма и местоимения перед глаголом."],
      ["Gira a derecha", "Gira a la derecha", "a la derecha / a la izquierda."]
    ],
    voc: [
      "preocuparse|волноваться|прэокупАрсэ|v", "recto|прямо|рЭкто|adv", "girar|поворачивать|хирАр|v", "cruzar|переходить|крусАр|v",
      "la esquina|угол|ла эскИна|n.f", "cortar|резать|кортАр|v", "añadir|добавлять|аньадИр|v", "la cebolla|лук|ла сэбОйа|n.f",
      "el aceite|масло (растит.)|эль асЭйтэ|n.m", "la sartén|сковорода|ла сартЭн|n.f"
    ],
    q: [
      ["c", "«Не уходи» (tú, ir):", ["No te vayas.", "No te vas.", "No vete."], 0, "ir → vayas."],
      ["c", "Отрицательная форма от «hazlo»:", ["No lo hagas.", "No hazlo.", "No lo haz."], 0, "No + lo + hagas."],
      ["c", "«Поверни налево»:", ["Gira a la izquierda.", "Gira a izquierda.", "Gira la izquierda."], 0, "a la izquierda."],
      ["c", "No ___ (usted) aquí, por favor. (fumar)", ["fume", "fuma", "fumes"], 0, "usted: -ar → -e."],
      ["f", "No ___ tan tarde, mañana hay clase. (volver, tú)", "vuelvas", "volver → vuelvas.", "не возвращайся"],
      ["f", "Sigue todo ___ hasta la plaza.", "recto", "todo recto — прямо.", "прямо"],
      ["x", "No dímelo ahora.", "No me lo digas ahora.", "Отрицательный императив."],
      ["x", "No comes eso, está frío.", "No comas eso, está frío.", "comer → no comas."],
      ["s", "Туристка спрашивает дорогу к собору. Он прямо, затем вторая улица направо.", ["Siga recto y tome la segunda a la derecha.", "Sigue recto y toma la segundo derecha.", "Sigues recto y tomas a derecho."], 0, "С незнакомыми — usted: siga, tome."]
    ]
  }
  ]
},
{
  id: "a2u11", city: "Cartagena de Indias", scene: "beach",
  t: "Путешествия и погода", ti: "Viajes y tiempo",
  d: "Погода и времена года, транспорт и билеты, а ещё вечный вопрос: por или para?",
  lessons: [
  {
    id: "a2u11l1", t: "Какая погода?", ti: "El tiempo", tags: ["tiempo"],
    goal: "Научитесь говорить о погоде, временах года и климате.",
    th: [
      { h: "Hace, hay, está", b: `| hace + сущ. | hay + сущ. | está + прил. | глаголы |
| [[hace calor]] — жарко | [[hay niebla]] — туман | [[está nublado]] — облачно | [[llueve]] — идёт дождь |
| [[hace frío]] — холодно | [[hay tormenta]] — гроза | [[está despejado]] — ясно | [[nieva]] — идёт снег |
| [[hace sol]] — солнечно | [[hay humedad]] — влажно | | [[truena]] — гремит гром |
| [[hace viento]] — ветрено | | | |
| [[hace buen / mal tiempo]] | | | |

[[¿Qué tiempo hace hoy?]] — Какая сегодня погода?
[[Hace mucho calor.]] — Очень жарко (mucho, не *muy*: calor — существительное).` },
      { h: "Времена года и температура", b: `| | |
| [[la primavera]] | весна |
| [[el verano]] | лето |
| [[el otoño]] | осень |
| [[el invierno]] | зима |

[[Estamos a treinta grados.]] — Тридцать градусов.
[[Estamos a dos bajo cero.]] — Минус два.

? В Южном полушарии всё наоборот: в Чили и Аргентине Рождество — летом, а в июле — зима. В Картахене (Колумбия) тепло круглый год: там говорят про **época de lluvias** и **época seca** — сезон дождей и сухой сезон.` },
      { h: "Погода в прошлом и будущем", b: `| | |
| Imperfecto (описание) | [[Ayer hacía mucho frío.]] |
| Indefinido (событие) | [[Ayer llovió todo el día.]] |
| Будущее | [[Mañana va a llover.]] [[Mañana hará sol.]] |
| Сейчас | [[Está lloviendo.]] [[Está nevando.]] |` }
    ],
    ex: [
      ["¿Qué tiempo hace hoy en Cartagena?", "Какая сегодня погода в Картахене?", "Qué tiempo hace=какая погода|hoy=сегодня|en Cartagena=в Картахене"],
      ["Hace mucho calor y hay mucha humedad.", "Очень жарко и очень влажно.", "Hace mucho calor=очень жарко|y=и|hay mucha humedad=очень влажно"],
      ["En invierno nieva mucho en Moscú.", "Зимой в Москве идёт много снега.", "En invierno=зимой|nieva mucho=идёт много снега|en Moscú=в Москве"],
      ["Está nublado, creo que va a llover.", "Облачно, думаю, пойдёт дождь.", "Está nublado=облачно|creo que=думаю, что|va a llover=пойдёт дождь"],
      ["Estamos a treinta y cinco grados.", "Тридцать пять градусов.", "Estamos a=сейчас (температура)|treinta y cinco=тридцать пять|grados=градусов"],
      ["Ayer llovió todo el día.", "Вчера весь день шёл дождь.", "Ayer=вчера|llovió=шёл дождь|todo el día=весь день"]
    ],
    warn: [
      ["Hace muy calor", "Hace mucho calor", "calor — существительное → mucho."],
      ["Es frío hoy", "Hace frío hoy", "Погода — hace."],
      ["Está lloviendo nieve", "Está nevando", "Снег — nevar."]
    ],
    voc: [
      "el sol|солнце|эль соль|n.m", "el viento|ветер|эль бьЭнто|n.m", "la lluvia|дождь|ла йУбья|n.f", "nevar|идти (о снеге)|нэбАр|v",
      "nublado|облачный|нублАдо|adj", "la tormenta|гроза, буря|ла тормЭнта|n.f", "la primavera|весна|ла примабЭра|n.f", "el otoño|осень|эль отОньо|n.m",
      "el invierno|зима|эль инбьЭрно|n.m", "el grado|градус|эль грАдо|n.m", "la humedad|влажность|ла умэдАд|n.f"
    ],
    q: [
      ["c", "«Ветрено»:", ["Hace viento.", "Es viento.", "Está viento."], 0, "hace + существительное."],
      ["c", "Hace ___ frío hoy.", ["mucho", "muy", "muchos"], 0, "frío — сущ. → mucho."],
      ["c", "«Облачно»:", ["Está nublado.", "Hace nublado.", "Hay nublado."], 0, "está + прилагательное."],
      ["c", "Вчера (весь день) шёл снег:", ["Ayer nevó todo el día.", "Ayer nevaba todo el día mañana.", "Ayer está nevando."], 0, "Законченный период — indefinido."],
      ["f", "¿Qué tiempo ___ en Madrid en agosto?", "hace", "¿Qué tiempo hace?", "какая погода"],
      ["f", "En ___ hace frío y nieva. (время года)", "invierno", "Зима — el invierno.", "зима"],
      ["x", "Hoy es muy calor.", "Hoy hace mucho calor.", "hace mucho calor."],
      ["x", "Mañana va a nieve.", "Mañana va a nevar.", "ir a + инфинитив nevar."],
      ["s", "Друг из Колумбии спрашивает, какая погода у вас зимой. Что ответить?", ["Hace mucho frío y nieva mucho.", "Es mucho frío y está nieve.", "Hay calor y está sol."], 0, "Hace frío, nieva."]
    ]
  },
  {
    id: "a2u11l2", t: "Por и para, билеты и транспорт", ti: "Por y para", tags: ["porpara", "tiempo"],
    goal: "Научитесь выбирать между por и para и покупать билеты.",
    th: [
      { h: "Para — цель, назначение", b: `**Para** смотрит **вперёд** — на цель:

| | |
| цель (чтобы) | [[Estudio español para viajar.]] |
| получатель | [[Este regalo es para ti.]] |
| направление | [[Salgo para Bogotá.]] — Выезжаю в Боготу. |
| срок | [[Lo necesito para el lunes.]] — К понедельнику. |
| мнение | [[Para mí, es la mejor playa.]] — По-моему… |` },
      { h: "Por — причина, путь, обмен", b: `**Por** смотрит **назад** — на причину или «через что»:

| | |
| причина | [[Gracias por tu ayuda.]] [[Lo hago por ti.]] — ради тебя |
| место «по, через» | [[Paseamos por la ciudad.]] |
| часть дня | [[por la mañana]], [[por la tarde]], [[por la noche]] |
| средство | [[por teléfono]], [[por correo]] |
| обмен, цена | [[Lo compré por diez euros.]] |
| в, за (единица) | [[dos veces por semana]] |

? Короткая проверка: «чтобы / для кого / к какому сроку» → **para**; «из-за / по / через / за сколько» → **por**.` },
      { h: "Билеты и транспорт", b: `| | |
| [[un billete de ida]] | билет в одну сторону |
| [[de ida y vuelta]] | туда и обратно |
| [[el andén]] | платформа |
| [[la vía]] | путь |
| [[el retraso]] | задержка |
| [[perder el tren]] | опоздать на поезд |
| [[en avión / en tren / en autobús]] | на самолёте / поезде / автобусе |
| [[a pie]] / [[andando]] | пешком |

[[Un billete de ida y vuelta para Cartagena, por favor.]]
В Латинской Америке билет — [[el boleto]], в Испании — **el billete**.` }
    ],
    ex: [
      ["Estudio español para viajar por América Latina.", "Я учу испанский, чтобы путешествовать по Латинской Америке.", "Estudio español=я учу испанский|para viajar=чтобы путешествовать|por América Latina=по Латинской Америке"],
      ["Gracias por todo.", "Спасибо за всё.", "Gracias=спасибо|por todo=за всё"],
      ["Este regalo es para ti.", "Этот подарок для тебя.", "Este regalo=этот подарок|es para ti=для тебя"],
      ["Un billete de ida y vuelta, por favor.", "Билет туда и обратно, пожалуйста.", "Un billete=билет|de ida y vuelta=туда и обратно|por favor=пожалуйста"],
      ["El tren sale a las diez del andén tres.", "Поезд отправляется в десять с третьей платформы.", "El tren=поезд|sale=отправляется|a las diez=в десять|del andén tres=с третьей платформы"],
      ["Voy al gimnasio tres veces por semana.", "Я хожу в спортзал три раза в неделю.", "Voy=я хожу|al gimnasio=в спортзал|tres veces=три раза|por semana=в неделю"]
    ],
    warn: [
      ["Gracias para todo", "Gracias por todo", "Благодарность за что-то — por."],
      ["Estudio por aprobar", "Estudio para aprobar", "Цель (чтобы) — para."],
      ["Un billete de ida y venida", "Un billete de ida y vuelta", "Устойчивое выражение."]
    ],
    voc: [
      "por|по, через, за, из-за|пор|prep", "para|для, чтобы, к|пАра|prep", "el billete|билет|эль бийЭтэ|n.m", "de ida y vuelta|туда и обратно|дэ Ида и буЭльта|phr",
      "el andén|платформа|эль андЭн|n.m", "el retraso|задержка|эль рэтрАсо|n.m", "perder|терять; опоздать на|пэрдЭр|v", "el avión|самолёт|эль абьОн|n.m",
      "la maleta|чемодан|ла малЭта|n.f", "llegar|прибывать|йэгАр|v", "la vez|раз|ла бэс|n.f"
    ],
    q: [
      ["c", "Gracias ___ tu ayuda.", ["por", "para", "de"], 0, "Благодарность — por."],
      ["c", "Este pastel es ___ mi abuela.", ["para", "por", "a"], 0, "Получатель — para."],
      ["c", "Paseamos ___ el centro.", ["por", "para", "en por"], 0, "«По» месту — por."],
      ["c", "«Мне нужно это к пятнице»:", ["Lo necesito para el viernes.", "Lo necesito por el viernes.", "Lo necesito a el viernes."], 0, "Срок — para."],
      ["f", "Te llamo ___ la tarde.", "por", "por la tarde.", "вечером/днём"],
      ["f", "Ahorro dinero ___ comprar un coche.", "para", "Цель — para.", "чтобы"],
      ["x", "Lo compré para cinco euros.", "Lo compré por cinco euros.", "Цена — por."],
      ["x", "Trabajo mucho por ganar dinero.", "Trabajo mucho para ganar dinero.", "Цель — para."],
      ["d", [["Taquillero", "Buenos días, ¿a dónde va?", "Добрый день, куда едете?"]], ["Un billete de ida y vuelta para Cartagena, por favor.", "Un billete por ir y vuelta a Cartagena.", "Voy para billete, por favor."], 0, "Billete de ida y vuelta para + место."]
    ]
  }
  ]
},
{
  id: "a2u12", city: "Barcelona", scene: "barcelona",
  t: "Вежливость и планы", ti: "Planes y cortesía",
  d: "Condicional для вежливых просьб и желаний, приглашения, отказы и разговор по телефону.",
  lessons: [
  {
    id: "a2u12l1", t: "Condicional: me gustaría, podría", ti: "Condicional", tags: ["condicional"],
    goal: "Научитесь вежливо просить, мечтать и советовать с помощью condicional.",
    th: [
      { h: "Формы: инфинитив + -ía", b: `Condicional строится как будущее: **инфинитив + окончания imperfecto от -er**:

| | hablar |
| yo | hablar**ía** |
| tú | hablar**ías** |
| él / ella | hablar**ía** |
| nosotros | hablar**íamos** |
| vosotros | hablar**íais** |
| ellos | hablar**ían** |

Неправильные основы те же, что в будущем: **tendr-**ía, **podr-**ía, **har-**ía, **dir-**ía, **querr-**ía, **saldr-**ía, **vendr-**ía, **pondr-**ía, **sabr-**ía, **habr-**ía.` },
      { h: "Вежливость", b: `| | |
| [[Me gustaría reservar una mesa.]] | Я хотел бы забронировать столик. |
| [[¿Podría ayudarme?]] | Не могли бы Вы мне помочь? |
| [[¿Te importaría cerrar la ventana?]] | Ты не против закрыть окно? |
| [[Querría un café.]] / [[Quería un café.]] | Я бы хотел кофе. |

? В магазинах и кафе испанцы часто говорят *quería* (imperfecto) — это тоже вежливо: [[Quería un billete para Barcelona.]]` },
      { h: "Желания и советы", b: `- Мечты: [[Me encantaría vivir en Barcelona.]] — Я бы с удовольствием жил в Барселоне.
- Совет: [[Yo que tú, iría al médico.]] — На твоём месте я бы пошёл к врачу.
- Совет: [[Deberías dormir más.]] — Тебе стоило бы больше спать.
- Предположение о прошлом: [[Serían las diez.]] — Было, наверное, десять.

! «Хотелось бы» — **me gustaría** (как gustar): [[Nos gustaría verte.]] — Нам бы хотелось тебя увидеть.` }
    ],
    ex: [
      ["Me gustaría reservar una mesa para dos.", "Я хотел бы забронировать столик на двоих.", "Me gustaría=я хотел бы|reservar=забронировать|una mesa=столик|para dos=на двоих"],
      ["¿Podría hablar más despacio?", "Не могли бы Вы говорить медленнее?", "Podría=не могли бы Вы|hablar=говорить|más despacio=медленнее"],
      ["Yo que tú, no lo compraría.", "На твоём месте я бы это не покупал.", "Yo que tú=на твоём месте|no lo compraría=я бы это не купил"],
      ["Me encantaría visitar la Sagrada Familia.", "Я бы с удовольствием посетил Саграду Фамилию.", "Me encantaría=я бы с удовольствием|visitar=посетить|la Sagrada Familia=Саграда Фамилия"],
      ["¿Te importaría abrir la puerta?", "Ты не мог бы открыть дверь?", "Te importaría=ты не против|abrir=открыть|la puerta=дверь"],
      ["Con más dinero, viajaríamos más.", "Будь у нас больше денег, мы бы больше путешествовали.", "Con más dinero=с большими деньгами|viajaríamos=мы бы путешествовали|más=больше"]
    ],
    warn: [
      ["Me gustaré reservar", "Me gustaría reservar", "Вежливое желание — condicional."],
      ["¿Podería ayudarme?", "¿Podría ayudarme?", "poder → podr-."],
      ["Yo haceria", "Yo haría", "hacer → har-."]
    ],
    voc: [
      "me gustaría|я хотел бы|мэ густарИа|phr", "me encantaría|я бы с удовольствием|мэ энкантарИа|phr", "podría|мог бы|подрИа|v", "importar|иметь значение|импортАр|v",
      "reservar|бронировать|рэсэрбАр|v", "yo que tú|на твоём месте|йо кэ ту|phr", "visitar|посещать|биситАр|v", "la puerta|дверь|ла пуЭрта|n.f",
      "el dinero|деньги|эль динЭро|n.m"
    ],
    q: [
      ["c", "Вежливо: «Я хотел бы столик на двоих»:", ["Me gustaría una mesa para dos.", "Me gusto una mesa para dos.", "Quiero mesa dos."], 0, "Me gustaría — вежливо."],
      ["c", "Condicional от «tener» (yo):", ["tendría", "tenería", "tenía"], 0, "tener → tendr-ía."],
      ["c", "«На твоём месте я бы поехал»:", ["Yo que tú, iría.", "Yo como tú, voy.", "Yo que tú, iré."], 0, "Yo que tú + condicional."],
      ["c", "¿___ ayudarme con la maleta? (usted)", ["Podría", "Puede ser", "Podrá"], 0, "Вежливая просьба — podría."],
      ["f", "Nos ___ vivir en el centro. (gustar)", "gustaría", "Как gustar: nos gustaría.", "нам бы хотелось"],
      ["f", "Yo en tu lugar no ___ nada. (decir)", "diría", "decir → dir-ía.", "сказал бы"],
      ["x", "¿Podería hablar más despacio?", "¿Podría hablar más despacio?", "poder → podr-."],
      ["x", "Me gustarían visitar Barcelona.", "Me gustaría visitar Barcelona.", "С инфинитивом — gustaría (ед. ч.)."],
      ["s", "Вы звоните в ресторан, чтобы забронировать столик на субботу.", ["Hola, me gustaría reservar una mesa para el sábado.", "Hola, gusto reservar mesa sábado.", "Hola, reservaré una mesa ayer."], 0, "Me gustaría reservar…"]
    ]
  },
  {
    id: "a2u12l2", t: "Приглашения и телефон", ti: "Quedar e invitar", tags: ["condicional"],
    goal: "Научитесь договариваться о встрече, приглашать, соглашаться и вежливо отказываться.",
    th: [
      { h: "Пригласить и договориться", b: `| | |
| [[¿Quedamos el sábado?]] | Встретимся в субботу? |
| [[¿Te apetece ir al cine?]] | Хочешь сходить в кино? |
| [[¿Qué tal si cenamos juntos?]] | Как насчёт поужинать вместе? |
| [[¿A qué hora quedamos?]] | Во сколько встречаемся? |
| [[¿Dónde quedamos?]] | Где встречаемся? |
| [[Quedamos a las ocho en la puerta del cine.]] | Встречаемся в восемь у входа в кино. |

! **Quedar** — «встречаться, договариваться о встрече», **quedar con alguien** — встречаться с кем-то: [[He quedado con Marta.]]` },
      { h: "Согласиться и отказаться", b: `| Да | Нет (вежливо) |
| [[¡Vale!]] / [[¡Claro!]] | [[Lo siento, no puedo.]] |
| [[¡Me parece genial!]] | [[Me encantaría, pero tengo que trabajar.]] |
| [[¡Perfecto, allí estaré!]] | [[Otro día, ¿vale?]] |
| [[¡Por supuesto!]] | [[¿Qué tal el domingo?]] — может, в воскресенье? |

? Испанцы редко говорят прямое «нет»: обычно объясняют причину и предлагают другой день.` },
      { h: "Разговор по телефону", b: `| | |
| [[¿Diga?]] / [[¿Sí?]] | Алло? (Испания) |
| [[¿Aló?]] / [[¿Bueno?]] | Алло? (Латинская Америка / Мексика) |
| [[¿Está Pablo?]] | Пабло можно? |
| [[¿De parte de quién?]] | Кто его спрашивает? |
| [[Un momento, ahora se pone.]] | Минутку, сейчас подойдёт. |
| [[¿Quiere dejar un mensaje?]] | Хотите что-нибудь передать? |
| [[Te llamo luego.]] | Перезвоню позже. |
| [[Se ha cortado.]] | Связь прервалась. |` }
    ],
    ex: [
      ["¿Te apetece ir al cine esta noche?", "Хочешь сходить в кино сегодня вечером?", "Te apetece=тебе хочется|ir al cine=пойти в кино|esta noche=сегодня вечером"],
      ["¿Quedamos a las ocho en la plaza?", "Встретимся в восемь на площади?", "Quedamos=встречаемся|a las ocho=в восемь|en la plaza=на площади"],
      ["Me encantaría, pero tengo que trabajar.", "С удовольствием бы, но мне нужно работать.", "Me encantaría=я бы с удовольствием|pero=но|tengo que trabajar=мне нужно работать"],
      ["¿Está Marta? — ¿De parte de quién?", "Марту можно? — Кто её спрашивает?", "Está Marta=Марта здесь|De parte de quién=от кого (кто спрашивает)"],
      ["He quedado con mis amigos para cenar.", "Я договорился поужинать с друзьями.", "He quedado=я договорился встретиться|con mis amigos=с друзьями|para cenar=чтобы поужинать"],
      ["Lo siento, hoy no puedo. ¿Qué tal mañana?", "Извини, сегодня не могу. Как насчёт завтра?", "Lo siento=извини|hoy no puedo=сегодня не могу|Qué tal mañana=как насчёт завтра"]
    ],
    warn: [
      ["¿Encontramos a las ocho?", "¿Quedamos a las ocho?", "Встретиться по договорённости — quedar."],
      ["Quedé a Marta", "Quedé con Marta", "quedar con alguien."],
      ["¿Te apeteces ir?", "¿Te apetece ir?", "apetecer как gustar: (a ti) te apetece."]
    ],
    voc: [
      "quedar|договориться встретиться|кэдАр|v", "apetecer|хотеться|апэтэсЭр|v", "invitar|приглашать|инбитАр|v", "vale|ладно, ок (Испания)|бАлэ|int",
      "por supuesto|конечно|пор супуЭсто|phr", "lo siento|мне жаль, извините|ло сьЭнто|phr", "de parte de quién|кто спрашивает|дэ пАртэ дэ кьЭн|phr", "cortarse|прерваться|кортАрсэ|v",
      "la cena|ужин|ла сЭна|n.f"
    ],
    q: [
      ["c", "«Встретимся в субботу?»", ["¿Quedamos el sábado?", "¿Nos encontramos sábado a?", "¿Quedamos en sábado?"], 0, "quedar + el + день."],
      ["c", "Вежливый отказ:", ["Me encantaría, pero no puedo.", "No. Adiós.", "No me apetezco."], 0, "Me encantaría, pero…"],
      ["c", "Телефон, Испания: «Алло?»", ["¿Diga?", "¿Hola, quién?", "¿Escucho?"], 0, "¿Diga? / ¿Sí?"],
      ["c", "«Тебе хочется прогуляться?»", ["¿Te apetece dar un paseo?", "¿Te apeteces dar un paseo?", "¿Apetece tú pasear?"], 0, "Как gustar: te apetece."],
      ["f", "He quedado ___ Luis a las seis.", "con", "quedar con alguien.", "предлог"],
      ["f", "¿De ___ de quién? — De Ana.", "parte", "¿De parte de quién?", "кто спрашивает"],
      ["x", "¿Quedamos en las nueve?", "¿Quedamos a las nueve?", "Время — a las…"],
      ["x", "Lo siento, no puedo. ¿Qué tal para domingo?", "Lo siento, no puedo. ¿Qué tal el domingo?", "¿Qué tal el domingo?"],
      ["d", [["Marta", "¿Te apetece cenar conmigo el viernes?", "Хочешь поужинать со мной в пятницу?"]], ["¡Me encantaría! ¿A qué hora quedamos?", "Sí, me apetezco. ¿Qué hora eres?", "Lo siento, mañana fue."], 0, "Согласие + ¿A qué hora quedamos?"]
    ]
  }
  ]
},
{
  id: "a2u13", city: "Buenos Aires", scene: "buenosaires",
  t: "Дом и работа", ti: "Casa y trabajo",
  d: "Снять квартиру, рассказать о своём доме, профессии и опыте работы.",
  lessons: [
  {
    id: "a2u13l1", t: "Дом: снять квартиру", ti: "La casa", tags: ["casa"],
    goal: "Научитесь описывать жильё и договариваться об аренде.",
    th: [
      { h: "Комнаты и мебель", b: `| Комнаты | Мебель и вещи |
| [[el salón]] — гостиная | [[el sofá]] — диван |
| [[el dormitorio]] — спальня | [[la cama]] — кровать |
| [[la cocina]] — кухня | [[el armario]] — шкаф |
| [[el baño]] — ванная | [[la nevera]] — холодильник (Мекс. el refri) |
| [[el pasillo]] — коридор | [[la lavadora]] — стиральная машина |
| [[el balcón]] / [[la terraza]] | [[la estantería]] — полка, стеллаж |

[[El piso tiene dos dormitorios y un baño.]]
В Испании квартира — **el piso**, в Латинской Америке — **el departamento** (Аргентина, Мексика) или **el apartamento**.` },
      { h: "Описать жильё", b: `| | |
| [[Es luminoso.]] | светлый |
| [[Es exterior / interior.]] | окна на улицу / во двор |
| [[Está amueblado.]] | с мебелью |
| [[Está cerca del metro.]] | рядом с метро |
| [[Está en el tercer piso.]] | на четвёртом этаже (в Испании нумерация с «planta baja») |
| [[Hay ascensor.]] | есть лифт |
| [[Tiene calefacción / aire acondicionado.]] | отопление / кондиционер |

! **Ser** — постоянные свойства (luminoso, grande), **estar** — расположение и состояние (cerca, amueblado), **hay** — наличие.` },
      { h: "Аренда", b: `| | |
| [[alquilar]] | снимать, сдавать |
| [[el alquiler]] | аренда, плата за аренду |
| [[el propietario]] / [[el casero]] | хозяин |
| [[la fianza]] | залог |
| [[los gastos incluidos]] | коммунальные включены |
| [[compartir piso]] | снимать квартиру вместе |

[[¿Cuánto es el alquiler?]] — Сколько стоит аренда?
[[¿Los gastos están incluidos?]] — Коммуналка включена?
[[¿Cuándo podría verlo?]] — Когда я мог бы посмотреть?` }
    ],
    ex: [
      ["Busco un piso de dos dormitorios en el centro.", "Ищу квартиру с двумя спальнями в центре.", "Busco=я ищу|un piso=квартиру|de dos dormitorios=с двумя спальнями|en el centro=в центре"],
      ["El departamento es muy luminoso y está amueblado.", "Квартира очень светлая и с мебелью.", "El departamento=квартира (Арг.)|es muy luminoso=очень светлая|está amueblado=обставлена"],
      ["¿Cuánto es el alquiler al mes?", "Сколько стоит аренда в месяц?", "Cuánto es=сколько стоит|el alquiler=аренда|al mes=в месяц"],
      ["Comparto piso con dos estudiantes.", "Я снимаю квартиру вместе с двумя студентами.", "Comparto piso=я снимаю вместе квартиру|con dos estudiantes=с двумя студентами"],
      ["La cocina es pequeña, pero hay lavadora.", "Кухня маленькая, но есть стиральная машина.", "La cocina=кухня|es pequeña=маленькая|pero=но|hay lavadora=есть стиральная машина"],
      ["¿Cuándo podría ver el piso?", "Когда я мог бы посмотреть квартиру?", "Cuándo=когда|podría=я мог бы|ver=посмотреть|el piso=квартиру"]
    ],
    warn: [
      ["El piso es cerca del metro", "El piso está cerca del metro", "Местоположение — estar."],
      ["Está un ascensor", "Hay ascensor", "Наличие — hay."],
      ["Alquilo un piso a mi amigo (снимаю у)", "Alquilo un piso a un propietario / Le alquilo el piso", "alquilar — и «снимать», и «сдавать»; уточняйте по контексту."]
    ],
    voc: [
      "el piso|квартира (Исп.); этаж|эль пИсо|n.m", "el departamento|квартира (Лат. Ам.)|эль дэпартамЭнто|n.m", "el dormitorio|спальня|эль дормитОрьо|n.m", "el salón|гостиная|эль салОн|n.m",
      "la cocina|кухня|ла косИна|n.f", "el baño|ванная, туалет|эль бАньо|n.m", "la cama|кровать|ла кАма|n.f", "el armario|шкаф|эль армАрьо|n.m",
      "la nevera|холодильник|ла нэбЭра|n.f", "alquilar|снимать, сдавать|алькилАр|v", "el alquiler|аренда|эль алькилЭр|n.m", "amueblado|меблированный|амуэблАдо|adj",
      "luminoso|светлый|луминОсо|adj", "compartir|делить, разделять|компартИр|v", "el ascensor|лифт|эль асэнсОр|n.m"
    ],
    q: [
      ["c", "El piso ___ cerca de la playa.", ["está", "es", "hay"], 0, "Местоположение — estar."],
      ["c", "En el edificio ___ ascensor.", ["hay", "está", "es"], 0, "Наличие — hay."],
      ["c", "«Квартира» в Аргентине:", ["el departamento", "el piso", "la casa de pisos"], 0, "В Аргентине — departamento."],
      ["c", "«Коммунальные включены?»", ["¿Los gastos están incluidos?", "¿Los gastos son incluyendo?", "¿Hay gastos incluido?"], 0, "Los gastos están incluidos."],
      ["f", "El salón ___ muy grande y luminoso.", "es", "Свойство — ser.", "есть (свойство)"],
      ["f", "Comparto ___ con mi hermana.", "piso", "compartir piso.", "квартиру"],
      ["x", "El dormitorio es amueblado.", "El dormitorio está amueblado.", "Состояние — estar."],
      ["x", "En la cocina está una lavadora.", "En la cocina hay una lavadora.", "Неопределённый предмет — hay."],
      ["d", [["Propietario", "Hola, ¿llamas por el piso de la calle Corrientes?", "Привет, ты звонишь насчёт квартиры на улице Корриентес?"]], ["Sí, ¿cuánto es el alquiler y cuándo podría verlo?", "Sí, ¿cuántos años es el piso?", "No, soy el piso."], 0, "Спросите цену и когда можно посмотреть."]
    ]
  },
  {
    id: "a2u13l2", t: "Работа и учёба", ti: "El trabajo", tags: ["trabajo"],
    goal: "Научитесь говорить о профессии, опыте и обязанностях — пригодится на собеседовании.",
    th: [
      { h: "Профессии", b: `| | |
| [[el médico / la médica]] | врач |
| [[el ingeniero / la ingeniera]] | инженер |
| [[el profesor / la profesora]] | преподаватель |
| [[el abogado / la abogada]] | юрист |
| [[el programador / la programadora]] | программист |
| [[el / la periodista]] | журналист |
| [[el / la cantante]] | певец, певица |
| [[el enfermero / la enfermera]] | медбрат / медсестра |
| [[el camarero / la camarera]] | официант(ка) (Мекс. el mesero) |

! Профессия **без артикля** после ser: [[Soy programador.]] — не *soy un programador*. С прилагательным артикль нужен: *Es un médico excelente*.` },
      { h: "Рассказать о работе", b: `| | |
| [[¿A qué te dedicas?]] | Чем ты занимаешься? |
| [[Trabajo de camarero.]] | Я работаю официантом. |
| [[Trabajo en una empresa de software.]] | Я работаю в IT-компании. |
| [[Estoy en paro.]] / [[Estoy buscando trabajo.]] | Я безработный / ищу работу. |
| [[Llevo tres años en esta empresa.]] | Я в этой компании уже три года. |
| [[Trabajo desde hace dos años.]] | Я работаю уже два года. |
| [[Tengo experiencia en ventas.]] | У меня есть опыт в продажах. |
| [[Me encargo de…]] | Я отвечаю за… |

? **Desde hace** + период = «уже (сколько-то)», **desde** + момент = «с»: [[desde 2020]].` },
      { h: "Собеседование", b: `| Вопрос | Как ответить |
| [[¿Por qué quiere este puesto?]] | [[Porque me interesa mucho el sector.]] |
| [[¿Qué experiencia tiene?]] | [[He trabajado dos años como…]] |
| [[¿Habla otros idiomas?]] | [[Hablo ruso, inglés y un poco de español.]] |
| [[¿Cuándo podría empezar?]] | [[Podría empezar el mes que viene.]] |

[[el currículum]] (el CV) — резюме, [[el puesto]] — должность, [[el sueldo]] / [[el salario]] — зарплата, [[la jornada completa / media jornada]] — полный / неполный день.` }
    ],
    ex: [
      ["¿A qué te dedicas? — Soy programadora.", "Чем ты занимаешься? — Я программистка.", "A qué te dedicas=чем ты занимаешься|Soy programadora=я программистка"],
      ["Trabajo de camarero los fines de semana.", "По выходным я работаю официантом.", "Trabajo de=я работаю (кем)|camarero=официантом|los fines de semana=по выходным"],
      ["Llevo cinco años en esta empresa.", "Я в этой компании уже пять лет.", "Llevo=уже|cinco años=пять лет|en esta empresa=в этой компании"],
      ["Tengo experiencia en atención al cliente.", "У меня есть опыт работы с клиентами.", "Tengo experiencia=у меня есть опыт|en atención al cliente=в обслуживании клиентов"],
      ["Me encargo de las redes sociales.", "Я отвечаю за соцсети.", "Me encargo de=я отвечаю за|las redes sociales=соцсети"],
      ["Podría empezar el lunes que viene.", "Я мог бы начать в следующий понедельник.", "Podría empezar=я мог бы начать|el lunes que viene=в следующий понедельник"]
    ],
    warn: [
      ["Soy un médico", "Soy médico", "Профессия после ser — без артикля."],
      ["Trabajo como de camarero", "Trabajo de camarero / Trabajo como camarero", "Либо de, либо como."],
      ["Trabajo aquí desde dos años", "Trabajo aquí desde hace dos años", "Период — desde hace."]
    ],
    voc: [
      "dedicarse a|заниматься (профессией)|дэдикАрсэ а|v", "la empresa|компания|ла эмпрЭса|n.f", "el puesto|должность|эль пуЭсто|n.m", "el sueldo|зарплата|эль суЭльдо|n.m",
      "la experiencia|опыт|ла экспэрьЭнсья|n.f", "el currículum|резюме|эль куррИкулум|n.m", "la entrevista|собеседование, интервью|ла энтрэбИста|n.f", "estar en paro|быть безработным|эстАр эн пАро|phr",
      "encargarse de|отвечать за|энкаргАрсэ дэ|v", "el ingeniero|инженер|эль инхэньЭро|n.m", "el abogado|юрист, адвокат|эль абогАдо|n.m", "el programador|программист|эль програмадОр|n.m",
      "el cliente|клиент|эль клиЭнтэ|n.m", "el idioma|язык (иностранный)|эль идьОма|n.m"
    ],
    q: [
      ["c", "«Я инженер»:", ["Soy ingeniero.", "Soy un ingeniero.", "Estoy ingeniero."], 0, "Профессия — ser, без артикля."],
      ["c", "«Чем ты занимаешься?»", ["¿A qué te dedicas?", "¿Qué te dedicas?", "¿Qué trabajas de?"], 0, "¿A qué te dedicas?"],
      ["c", "Trabajo aquí ___ hace tres años.", ["desde", "durante", "por"], 0, "desde hace — уже."],
      ["c", "«Я отвечаю за продажи»:", ["Me encargo de las ventas.", "Me encargo a las ventas.", "Encargo las ventas de mí."], 0, "encargarse de."],
      ["f", "Trabajo ___ profesora en un colegio.", "de", "trabajar de + профессия.", "кем"],
      ["f", "___ cuatro años en esta empresa. (llevar, yo)", "Llevo", "llevar + время.", "уже"],
      ["x", "Mi hermana es una abogada.", "Mi hermana es abogada.", "Без артикля."],
      ["x", "Estoy en esta empresa desde dos años.", "Estoy en esta empresa desde hace dos años.", "Период — desde hace."],
      ["d", [["Entrevistadora", "¿Qué experiencia tiene en este sector?", "Какой у Вас опыт в этой сфере?"]], ["He trabajado tres años como programador en una empresa de software.", "Soy experiencia tres años programador.", "Tengo tres años de programadora mañana."], 0, "He trabajado… como…"]
    ]
  }
  ]
}
]);

/* Дорожная карта следующих уровней (A2 уже полностью готов). */
IT.roadmap = {
  B1: ["Subjuntivo presente", "Condicional и советы: si fuera tú…", "Pluscuamperfecto", "Относительные местоимения: que, quien, donde", "Работа и собеседование", "Испанское кино и музыка"],
  B2: ["Subjuntivo imperfecto", "Условные предложения (si tuviera…)", "Пассив и se impersonal", "Дискурсивные маркеры", "СМИ и новости", "Региональные варианты испанского"],
  C1: ["Перифразы и аспектуальность", "Идиомы и фразеология", "Регистры: формальный и разговорный", "Аргументация и эссе", "Литература: Сервантес, Гарсиа Маркес", "Профессиональное общение"]
};
