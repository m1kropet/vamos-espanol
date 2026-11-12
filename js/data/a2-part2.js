/* Курс A2, часть 2: блоки 3–7 (неправильный indefinido, imperfecto, перифразы, сравнения, местоимения-дополнения).
 * Формат описан в a1-part1.js */
IT.addUnits("A2", [
{
  id: "a2u3", city: "Lima", scene: "plaza",
  t: "Истории из прошлого", ti: "Historias del pasado",
  d: "Неправильные глаголы в pretérito indefinido и биографии: когда родился, где учился, что сделал.",
  lessons: [
  {
    id: "a2u3l1", t: "Indefinido: неправильные глаголы", ti: "Indefinido irregular", tags: ["pasado", "irregulares"],
    goal: "Выучите самые частые неправильные формы прошедшего времени: tuve, estuve, hice, pude, dije.",
    th: [
      { h: "Новая основа + особые окончания", b: `Многие частые глаголы в indefinido меняют основу и получают окончания **без ударения**:

| Окончание | yo | tú | él / ella | nosotros | vosotros | ellos |
| | **-e** | **-iste** | **-o** | **-imos** | **-isteis** | **-ieron** |

| Глагол | Основа | yo | él / ella |
| tener | **tuv-** | [[tuve]] | [[tuvo]] |
| estar | **estuv-** | [[estuve]] | [[estuvo]] |
| poder | **pud-** | [[pude]] | [[pudo]] |
| poner | **pus-** | [[puse]] | [[puso]] |
| saber | **sup-** | [[supe]] | [[supo]] |
| querer | **quis-** | [[quise]] | [[quiso]] |
| venir | **vin-** | [[vine]] | [[vino]] |
| hacer | **hic-** | [[hice]] | [[hizo]] |

! Ударение **не ставится**: tuve, hizo (а не *tuvé*). hacer: él **hizo** — с **z**, чтобы сохранить звук.` },
      { h: "Основа на -j: decir, traer, conducir", b: `Если основа кончается на **j**, в 3-м лице мн. числа будет **-eron** (без i):

| | decir | traer |
| yo | [[dije]] | [[traje]] |
| tú | dijiste | trajiste |
| él / ella | [[dijo]] | trajo |
| nosotros | dijimos | trajimos |
| ellos | [[dijeron]] | [[trajeron]] |

Ещё два особых глагола: **dar** — di, diste, dio, dimos, disteis, dieron; **ver** — vi, viste, vio, vimos, visteis, vieron (без знаков ударения).` },
      { h: "Смена гласной у глаголов на -ir", b: `У глаголов на **-ir** с изменением основы в настоящем гласная меняется только в **3-м лице**:

| | pedir (e→i) | dormir (o→u) |
| yo | pedí | dormí |
| él / ella | [[pidió]] | [[durmió]] |
| ellos | [[pidieron]] | [[durmieron]] |

Так же: **sentir → sintió**, **preferir → prefirió**, **morir → murió**, **repetir → repitió**.

? Значение некоторых глаголов в indefinido меняется: **supe** — я узнал; **conocí** — я познакомился; **quise** — я попытался; **no quise** — я отказался.` }
    ],
    ex: [
      ["Ayer tuve mucho trabajo.", "Вчера у меня было много работы.", "Ayer=вчера|tuve=у меня было (tener)|mucho trabajo=много работы"],
      ["¿Dónde estuviste el fin de semana?", "Где ты был на выходных?", "Dónde=где|estuviste=ты был (estar)|el fin de semana=на выходных"],
      ["No pude ir a la fiesta.", "Я не смог пойти на вечеринку.", "No pude=я не смог (poder)|ir=пойти|a la fiesta=на вечеринку"],
      ["¿Qué hiciste anoche?", "Что ты делал вчера вечером?", "Qué=что|hiciste=ты делал (hacer)|anoche=вчера вечером"],
      ["Mi hermano me dijo la verdad.", "Брат сказал мне правду.", "Mi hermano=мой брат|me=мне|dijo=сказал (decir)|la verdad=правду"],
      ["El niño durmió diez horas.", "Ребёнок проспал десять часов.", "El niño=ребёнок|durmió=спал (dormir, o→u)|diez horas=десять часов"]
    ],
    warn: [
      ["Yo tení un problema", "Yo tuve un problema", "tener → tuv-: tuve."],
      ["Él hació la comida", "Él hizo la comida", "hacer: él hizo (с z)."],
      ["Ellos dijieron", "Ellos dijeron", "Основа на j → -eron."]
    ],
    voc: [
      "tuve|у меня было (tener)|тУбэ|v", "estuve|я был (estar)|эстУбэ|v", "hice|я сделал (hacer)|Исэ|v", "pude|я смог (poder)|пУдэ|v",
      "dije|я сказал (decir)|дИхэ|v", "pedir|просить; заказывать|пэдИр|v", "la verdad|правда|ла бэрдАд|n.f", "el fin de semana|выходные|эль фин дэ сэмАна|n.m",
      "anteanoche|позавчера вечером|антэанОчэ|adv", "de repente|вдруг|дэ рэпЭнтэ|adv"
    ],
    q: [
      ["c", "Ayer yo ___ en casa todo el día. (estar)", ["estuve", "estuvé", "estí"], 0, "estar → estuv- + -e, без знака."],
      ["c", "¿Qué ___ ellos? (decir)", ["dijeron", "dijieron", "decieron"], 0, "Основа на j → -eron."],
      ["c", "Ella ___ la cena. (hacer)", ["hizo", "hició", "hace"], 0, "hacer: él/ella hizo."],
      ["c", "Anoche mi padre ___ mal. (dormir)", ["durmió", "dormió", "duermió"], 0, "-ir с o→ue: в 3-м лице o→u."],
      ["f", "El año pasado yo ___ que mudarme. (tener)", "tuve", "tener → tuve.", "у меня было (нужно)"],
      ["f", "¿Por qué no ___ venir ayer? (poder, tú)", "pudiste", "poder → pud-: pudiste.", "ты смог"],
      ["x", "Ellos ponieron la mesa.", "Ellos pusieron la mesa.", "poner → pus-: pusieron."],
      ["x", "El camarero pedió la cuenta.", "El camarero pidió la cuenta.", "pedir: в 3-м лице e→i — pidió."],
      ["s", "Друг спрашивает, почему вас не было на встрече. Что ответить?", ["No pude ir, tuve que trabajar.", "No puedo ir, tengo trabajado.", "No pudí ir, tení trabajo."], 0, "No pude… tuve que… — не смог… пришлось…"]
    ]
  },
  {
    id: "a2u3l2", t: "Биография: даты и hace", ti: "Biografías", tags: ["pasado"],
    goal: "Научитесь рассказывать биографию: даты, «назад», «в течение», ключевые события жизни.",
    th: [
      { h: "Даты и годы", b: `Год читается как обычное число: **1998** — [[mil novecientos noventa y ocho]], **2015** — [[dos mil quince]].

| | |
| en 2010 | [[en dos mil diez]] — в 2010 году |
| el 5 de mayo | [[el cinco de mayo]] |
| en los años noventa | в девяностые |
| en el siglo XX | в XX веке (siglo veinte) |

! Перед годом — **en**, перед датой — артикль **el** без предлога: [[Nací el 3 de marzo de 1995.]]` },
      { h: "Hace, desde, durante, después", b: `| | |
| **hace** + период | назад: [[hace dos años]] — два года назад |
| **durante** + период | в течение: [[durante tres meses]] |
| **desde** + момент | с: [[desde 2018]] |
| **de… a…** | с… по…: [[de 2015 a 2019]] |
| **después de** + inf. | после того как: [[después de terminar]] |
| **al** + inf. | когда: [[al llegar]] — по прибытии |
| **a los** + возраст | в возрасте: [[a los veinte años]] |` },
      { h: "События жизни", b: `| | |
| [[nacer]] → nació | родиться |
| [[crecer]] → creció | вырасти |
| [[estudiar]] → estudió | учиться |
| [[mudarse]] → se mudó | переехать |
| [[casarse]] (con) → se casó | жениться / выйти замуж |
| [[tener hijos]] → tuvo hijos | иметь детей |
| [[jubilarse]] → se jubiló | выйти на пенсию |
| [[morir]] → murió | умереть |

? Биографии пишут в **indefinido**: каждое событие — законченный факт в прошлом. *Frida Kahlo nació en 1907 en Coyoacán, se casó con Diego Rivera en 1929 y murió en 1954.*` }
    ],
    ex: [
      ["Nací en Moscú en 1998.", "Я родился в Москве в 1998 году.", "Nací=я родился (nacer)|en Moscú=в Москве|en 1998=в 1998 году"],
      ["Me mudé a Lima hace dos años.", "Я переехал в Лиму два года назад.", "Me mudé=я переехал (mudarse)|a Lima=в Лиму|hace dos años=два года назад"],
      ["Estudió Medicina durante seis años.", "Она изучала медицину шесть лет.", "Estudió=изучала|Medicina=медицину|durante seis años=в течение шести лет"],
      ["Se casaron en 2015.", "Они поженились в 2015 году.", "Se casaron=поженились (casarse)|en 2015=в 2015 году"],
      ["A los veinte años empecé a trabajar.", "В двадцать лет я начал работать.", "A los veinte años=в двадцать лет|empecé=я начал (empezar)|a trabajar=работать", "empezar: yo empecé — z → c перед e."],
      ["Después de terminar la universidad, viajó por América.", "Окончив университет, он путешествовал по Америке.", "Después de=после|terminar=окончить|la universidad=университет|viajó=путешествовал|por América=по Америке"]
    ],
    warn: [
      ["Nací en el 1998", "Nací en 1998", "Перед годом — просто en."],
      ["Dos años hace", "Hace dos años", "hace стоит перед периодом."],
      ["Se casó a Pedro", "Se casó con Pedro", "casarse con — жениться на / выйти за."]
    ],
    voc: [
      "nacer|родиться|насЭр|v", "crecer|расти|крэсЭр|v", "mudarse|переезжать|мудАрсэ|v", "casarse|жениться, выйти замуж|касАрсэ|v",
      "jubilarse|выйти на пенсию|хубилАрсэ|v", "morir|умирать|морИр|v", "el siglo|век|эль сИгло|n.m", "durante|в течение|дурАнтэ|prep",
      "desde|с (момента)|дЭсдэ|prep", "la universidad|университет|ла унибэрсидАд|n.f", "la vida|жизнь|ла бИда|n.f"
    ],
    q: [
      ["c", "«Три года назад»:", ["hace tres años", "tres años hace", "desde tres años"], 0, "hace + период = назад."],
      ["c", "Frida Kahlo ___ en 1907. (nacer)", ["nació", "nacía", "ha nacido"], 0, "Событие биографии — indefinido."],
      ["c", "Vivió en París ___ diez años.", ["durante", "desde", "hace"], 0, "durante — в течение."],
      ["c", "«Я родился 3 марта»:", ["Nací el 3 de marzo.", "Nací en 3 de marzo.", "Nací 3 marzo."], 0, "Дата — с артиклем el."],
      ["f", "Mis padres se ___ en 1990. (casarse)", "casaron", "ellos → -aron.", "поженились"],
      ["f", "Yo ___ a trabajar a los 18 años. (empezar)", "empecé", "empezar: yo empecé (z→c).", "я начал"],
      ["x", "Me mudé a Madrid hace en 2019.", "Me mudé a Madrid en 2019.", "С годом — en, без hace."],
      ["x", "Ella se casó a un mexicano.", "Ella se casó con un mexicano.", "casarse con."],
      ["s", "Вас просят коротко рассказать о себе. Как начать?", ["Nací en Rusia y hace un año empecé a estudiar español.", "Nazco en Rusia y estudio español hace.", "Nací Rusia, empiezo español año hace."], 0, "Nací… hace un año empecé…"]
    ]
  }
  ]
},
{
  id: "a2u4", city: "Bogotá", scene: "toledo",
  t: "Когда я был маленьким", ti: "Cuando era pequeño",
  d: "Pretérito imperfecto: описания и привычки в прошлом — и как не путать его с indefinido.",
  lessons: [
  {
    id: "a2u4l1", t: "Pretérito imperfecto", ti: "Pretérito imperfecto", tags: ["imperfecto", "pasado"],
    goal: "Научитесь описывать прошлое и рассказывать о привычках: «раньше я жил…, каждый день мы ходили…».",
    th: [
      { h: "Формы: почти все правильные", b: `| | hablar | comer | vivir |
| yo | habl**aba** | com**ía** | viv**ía** |
| tú | habl**abas** | com**ías** | viv**ías** |
| él / ella | habl**aba** | com**ía** | viv**ía** |
| nosotros | habl**ábamos** | com**íamos** | viv**íamos** |
| vosotros | habl**abais** | com**íais** | viv**íais** |
| ellos | habl**aban** | com**ían** | viv**ían** |

! Формы **yo** и **él** совпадают: [[yo hablaba]], [[él hablaba]] — смысл ясен из контекста или местоимения.` },
      { h: "Всего три неправильных глагола", b: `| | ser | ir | ver |
| yo | [[era]] | [[iba]] | [[veía]] |
| tú | eras | ibas | veías |
| él / ella | era | iba | veía |
| nosotros | **éramos** | **íbamos** | veíamos |
| ellos | eran | iban | veían |

Больше исключений нет — даже tener, hacer, poder правильные: **tenía, hacía, podía**.` },
      { h: "Когда нужен imperfecto", b: `- **Привычки и повторяющиеся действия**: [[De niño jugaba al fútbol todos los días.]] — В детстве я каждый день играл в футбол.
- **Описание** людей, мест, обстоятельств: [[La casa era grande y tenía un jardín.]]
- **Время и возраст** в прошлом: [[Eran las diez.]] [[Tenía ocho años.]]
- **Фон** для другого события: [[Llovía mucho.]]

Слова-подсказки: [[antes]] (раньше), [[de niño]] (в детстве), [[siempre]], [[todos los días]], [[a menudo]] (часто), [[normalmente]].

? «Раньше я обычно…» — **soler** в imperfecto: [[Solía levantarme temprano.]]` }
    ],
    ex: [
      ["Cuando era pequeño, vivía en un pueblo.", "Когда я был маленьким, я жил в деревне.", "Cuando=когда|era=я был (ser)|pequeño=маленьким|vivía=я жил|en un pueblo=в деревне"],
      ["Todos los veranos íbamos a la playa.", "Каждое лето мы ездили на пляж.", "Todos los veranos=каждое лето|íbamos=мы ездили (ir)|a la playa=на пляж"],
      ["Mi abuela hacía unas tortillas buenísimas.", "Бабушка готовила потрясающие тортильи.", "Mi abuela=моя бабушка|hacía=делала (hacer)|unas tortillas=тортильи|buenísimas=очень вкусные"],
      ["Antes no me gustaba el café.", "Раньше мне не нравился кофе.", "Antes=раньше|no me gustaba=мне не нравился|el café=кофе"],
      ["Eran las once y hacía frío.", "Было одиннадцать часов, и было холодно.", "Eran las once=было одиннадцать|hacía frío=было холодно"],
      ["¿Qué veías en la tele de niño?", "Что ты смотрел по телевизору в детстве?", "Qué=что|veías=ты смотрел (ver)|en la tele=по телевизору|de niño=в детстве"]
    ],
    warn: [
      ["Yo era a la escuela", "Yo iba a la escuela", "«Ходил» — ir: iba; era — от ser."],
      ["Nosotros ibamos", "Nosotros íbamos", "В nosotros знак ударения: íbamos, éramos, hablábamos."],
      ["Yo tuvía un perro", "Yo tenía un perro", "tener в imperfecto правильный: tenía."]
    ],
    voc: [
      "de niño|в детстве|дэ нИньо|phr", "antes|раньше|Антэс|adv", "el pueblo|деревня, посёлок|эль пуЭбло|n.m", "a menudo|часто|а мэнУдо|adv",
      "soler|иметь обыкновение|солЭр|v", "jugar|играть|хугАр|v", "el jardín|сад|эль хардИн|n.m", "la infancia|детство|ла инфАнсья|n.f",
      "el colegio|школа|эль колЭхьо|n.m"
    ],
    q: [
      ["c", "De niño yo ___ mucho. (leer)", ["leía", "leí", "leyó"], 0, "Привычка в детстве — imperfecto."],
      ["c", "Nosotros ___ en Bogotá. (vivir)", ["vivíamos", "vivimos ayer", "vivabamos"], 0, "-ir → -íamos."],
      ["c", "Imperfecto от «ser» (ella):", ["era", "fue", "sería"], 0, "ser: era, eras, era…"],
      ["c", "«Раньше я обычно вставал рано»:", ["Solía levantarme temprano.", "Suelo levantarme temprano ayer.", "Solí levantarme temprano."], 0, "soler в imperfecto — solía."],
      ["f", "Cuando ___ diez años, aprendí a nadar. (tener, yo)", "tenía", "Возраст в прошлом — imperfecto.", "мне было"],
      ["f", "Antes mis padres ___ al cine cada semana. (ir)", "iban", "ir: iban.", "ходили"],
      ["x", "Cuando era niño, fui al colegio en bici todos los días.", "Cuando era niño, iba al colegio en bici todos los días.", "Повторяющееся действие — imperfecto."],
      ["x", "Nosotros eramos muy amigos.", "Nosotros éramos muy amigos.", "éramos — со знаком."],
      ["s", "Вас спрашивают о детстве. Что сказать?", ["De niño vivía en Kazán y jugaba mucho en la calle.", "De niño viví en Kazán y jugué siempre en la calle mañana.", "De niño vivo en Kazán."], 0, "Описание детства — imperfecto."]
    ]
  },
  {
    id: "a2u4l2", t: "Imperfecto или indefinido?", ti: "Imperfecto o indefinido", tags: ["imperfecto", "pasado"],
    goal: "Научитесь рассказывать истории: фон в imperfecto, события — в indefinido.",
    th: [
      { h: "Фон и событие", b: `Представьте фильм: **imperfecto** — декорации и то, что *происходило*; **indefinido** — то, что *случилось*.

| Imperfecto (фон) | Indefinido (событие) |
| [[Llovía]] — шёл дождь | [[sonó el teléfono]] — зазвонил телефон |
| [[Estaba en casa]] — я был дома | [[llegó Ana]] — пришла Ана |
| описание, процесс, привычка | законченное действие, факт |

[[Estaba en la ducha cuando sonó el teléfono.]] — Я был в душе, когда зазвонил телефон.` },
      { h: "Cuando и mientras", b: `- **mientras** (пока) + imperfecto — два параллельных процесса: [[Mientras yo cocinaba, él leía.]]
- **cuando** + indefinido — событие прерывает процесс: [[Dormía cuando llegaste.]]

| Сигналы imperfecto | Сигналы indefinido |
| siempre, a menudo, todos los días, antes, de niño | ayer, el lunes, en 2019, una vez, de repente |` },
      { h: "Смысл меняется", b: `Один и тот же глагол в двух временах — разная картинка:

| | |
| [[Tenía un coche.]] | у меня была машина (состояние) |
| [[Tuve un accidente.]] | у меня была авария (событие) |
| [[Conocía a Juan.]] | я был знаком с Хуаном |
| [[Conocí a Juan en 2020.]] | я познакомился с Хуаном |
| [[Sabía la verdad.]] | я знал правду |
| [[Supe la verdad.]] | я узнал правду |

? Если сомневаетесь, спросите себя: «Это *декорация* или *действие сюжета*?»` }
    ],
    ex: [
      ["Estaba en la ducha cuando sonó el teléfono.", "Я был в душе, когда зазвонил телефон.", "Estaba=я был|en la ducha=в душе|cuando=когда|sonó=зазвонил|el teléfono=телефон"],
      ["Mientras cocinaba, escuchaba música.", "Пока я готовил, я слушал музыку.", "Mientras=пока|cocinaba=я готовил|escuchaba=я слушал|música=музыку"],
      ["Hacía sol, pero de repente empezó a llover.", "Светило солнце, но вдруг пошёл дождь.", "Hacía sol=было солнечно|pero=но|de repente=вдруг|empezó=начал|a llover=идти (дождь)"],
      ["Conocí a mi novia en una fiesta.", "Я познакомился с девушкой на вечеринке.", "Conocí=я познакомился|a mi novia=с моей девушкой|en una fiesta=на вечеринке"],
      ["Eran las tres cuando llegamos al hotel.", "Было три часа, когда мы приехали в отель.", "Eran las tres=было три часа|cuando=когда|llegamos=мы приехали|al hotel=в отель"],
      ["Ella no sabía nada, pero ayer lo supo todo.", "Она ничего не знала, но вчера всё узнала.", "Ella=она|no sabía nada=ничего не знала|pero=но|ayer=вчера|lo supo todo=узнала всё"]
    ],
    warn: [
      ["Dormí cuando llegaste", "Dormía cuando llegaste", "Прерванный процесс — imperfecto."],
      ["Ayer hacía los deberes y fui al cine", "Ayer hice los deberes y fui al cine", "Цепочка законченных действий — indefinido."],
      ["Mientras cociné, él leyó", "Mientras cocinaba, él leía", "mientras + параллельные процессы — imperfecto."]
    ],
    voc: [
      "mientras|пока, в то время как|мьЭнтрас|conj", "sonar|звонить, звучать|сонАр|v", "la ducha|душ|ла дУча|n.f", "conocer|знать, быть знакомым; познакомиться|конэсЭр|v",
      "el accidente|авария, несчастный случай|эль аксидЭнтэ|n.m", "la novia|девушка (подруга); невеста|ла нОбья|n.f", "el novio|парень; жених|эль нОбьо|n.m", "una vez|однажды, один раз|Уна бэс|phr",
      "la historia|история|ла истОрья|n.f"
    ],
    q: [
      ["c", "Yo ___ la tele cuando llegó mi madre.", ["veía", "vi", "veo"], 0, "Прерванный процесс — imperfecto."],
      ["c", "Ayer ___ a Pedro en el metro. (ver)", ["vi", "veía", "veí"], 0, "Разовое событие — indefinido: vi."],
      ["c", "Mientras ella ___, yo limpiaba.", ["cocinaba", "cocinó", "cocina"], 0, "mientras — параллельные процессы."],
      ["c", "«Я познакомился с ней в 2021 году»:", ["La conocí en 2021.", "La conocía en 2021.", "La conozco en 2021."], 0, "Момент знакомства — indefinido."],
      ["f", "___ las diez cuando terminó la película. (ser)", "Eran", "Время в прошлом — imperfecto.", "было (время)"],
      ["f", "Hacía buen tiempo, pero de repente ___ a llover. (empezar)", "empezó", "Внезапное событие — indefinido.", "начал"],
      ["x", "Cuando llegué a casa, mi hermano dormió.", "Cuando llegué a casa, mi hermano dormía.", "Фоновое действие — imperfecto."],
      ["x", "El sábado pasado íbamos al museo y después comimos.", "El sábado pasado fuimos al museo y después comimos.", "Последовательные события — indefinido."],
      ["d", [["Lucía", "¿Por qué no contestaste mi llamada?", "Почему ты не ответил на мой звонок?"]], ["Porque estaba en la ducha.", "Porque estuve en la ducha ayer siempre.", "Porque estoy en la ducha."], 0, "Объяснение-фон — imperfecto."]
    ]
  }
  ]
},
{
  id: "a2u5", city: "Santiago de Chile", scene: "station",
  t: "Прямо сейчас", ti: "Ahora mismo",
  d: "Estar + gerundio и полезные перифразы: только что сделал, начал, перестал, продолжаю.",
  lessons: [
  {
    id: "a2u5l1", t: "Estar + gerundio", ti: "Estar + gerundio", tags: ["gerundio"],
    goal: "Научитесь говорить о том, что происходит в данный момент.",
    th: [
      { h: "Как образуется герундий", b: `**Estar** + **gerundio** = действие прямо сейчас (как английское *-ing*):

| Инфинитив | Gerundio |
| hablar | habl**ando** |
| comer | com**iendo** |
| vivir | viv**iendo** |

[[Estoy hablando por teléfono.]] — Я сейчас разговариваю по телефону.
[[¿Qué estás haciendo?]] — Что ты делаешь?

! Изменяется только **estar**, герундий — никогда: [[estamos comiendo]], [[están comiendo]].` },
      { h: "Неправильные герундии", b: `| | |
| гласная + -er/-ir → **-yendo** | leer → [[leyendo]], oír → [[oyendo]], ir → [[yendo]], traer → trayendo |
| -ir с e→i | pedir → [[pidiendo]], decir → [[diciendo]], vestir → vistiendo |
| -ir с o→u | dormir → [[durmiendo]], morir → muriendo |
| poder | [[pudiendo]] |` },
      { h: "Когда использовать", b: `- Сейчас, в момент речи: [[Está lloviendo.]] — Идёт дождь.
- Временная ситуация в эти дни: [[Estoy leyendo un libro muy bueno.]]
- Местоимения — перед estar или в конце герундия (со знаком!): [[Me estoy duchando.]] = [[Estoy duchándome.]]

? Для обычных, постоянных действий — просто настоящее время: *Trabajo en un banco* (я работаю в банке), но *Hoy estoy trabajando en casa* (сегодня работаю из дома).` }
    ],
    ex: [
      ["Estoy hablando por teléfono.", "Я сейчас говорю по телефону.", "Estoy=я (сейчас)|hablando=говорю|por teléfono=по телефону"],
      ["¿Qué estás haciendo?", "Что ты делаешь?", "Qué=что|estás=ты|haciendo=делаешь"],
      ["Los niños están durmiendo.", "Дети спят.", "Los niños=дети|están=(сейчас)|durmiendo=спят (dormir)"],
      ["Está lloviendo mucho en Santiago.", "В Сантьяго идёт сильный дождь.", "Está=(сейчас)|lloviendo=идёт дождь|mucho=сильно|en Santiago=в Сантьяго"],
      ["Estamos aprendiendo español.", "Мы учим испанский.", "Estamos=мы (сейчас)|aprendiendo=учим|español=испанский"],
      ["Me estoy vistiendo, ¡ya voy!", "Я одеваюсь, уже иду!", "Me estoy vistiendo=я одеваюсь (vestirse)|ya voy=уже иду"]
    ],
    warn: [
      ["Estoy leendo", "Estoy leyendo", "Гласная + -er → -yendo."],
      ["Soy comiendo", "Estoy comiendo", "Только estar + gerundio."],
      ["Estoy duchandome", "Estoy duchándome", "С местоимением на конце — знак ударения."]
    ],
    voc: [
      "ahora mismo|прямо сейчас|аОра мИсмо|adv", "en este momento|в данный момент|эн Эстэ момЭнто|phr", "oír|слышать|оИр|v", "esperar|ждать; надеяться|эспэрАр|v",
      "la reunión|совещание, встреча|ла рэуньОн|n.f", "cocinar|готовить|косинАр|v", "ya voy|уже иду|йа бой|phr",
      "el bebé|младенец|эль бэбЭ|n.m", "el silencio|тишина|эль силЭнсьо|n.m", "chatear|переписываться в чате|чатэАр|v", "la serie|сериал|ла сЭрьэ|n.f"
    ],
    q: [
      ["c", "Ahora mismo yo ___ un libro. (leer)", ["estoy leyendo", "estoy leendo", "soy leyendo"], 0, "leer → leyendo."],
      ["c", "Герундий от «dormir»:", ["durmiendo", "dormiendo", "duermiendo"], 0, "o → u: durmiendo."],
      ["c", "¿Qué ___ tus hermanos?", ["están haciendo", "están hacen", "son haciendo"], 0, "estar + gerundio."],
      ["c", "«Я работаю в банке» (постоянно):", ["Trabajo en un banco.", "Estoy trabajando en un banco siempre.", "Estoy trabajo en un banco."], 0, "Постоянное — простое настоящее."],
      ["f", "Silencio, el bebé está ___. (dormir)", "durmiendo", "dormir → durmiendo.", "спит"],
      ["f", "¿Me estás ___? (oír)", "oyendo", "oír → oyendo.", "слышишь"],
      ["x", "Estoy pidendo una pizza.", "Estoy pidiendo una pizza.", "pedir → pidiendo."],
      ["x", "Ella está en la ducha, se duchando.", "Ella está en la ducha, se está duchando./Ella está en la ducha, está duchándose.", "Местоимение — перед estar или в конце герундия."],
      ["s", "Вам звонят на совещании. Что сказать?", ["Perdona, ahora estoy en una reunión. Te llamo luego.", "Perdona, ahora soy reunión.", "Perdona, estoy reuniendo luego."], 0, "Ahora estoy en una reunión — сейчас я на совещании."]
    ]
  },
  {
    id: "a2u5l2", t: "Перифразы: acabar de, empezar a, dejar de", ti: "Perífrasis verbales", tags: ["gerundio"],
    goal: "Научитесь точно говорить о начале, конце и продолжении действия.",
    th: [
      { h: "Глагол + предлог + инфинитив", b: `| Перифраза | Значение | Пример |
| **acabar de** + inf. | только что | [[Acabo de llegar.]] — Я только что пришёл. |
| **empezar a / ponerse a** + inf. | начать | [[Empecé a estudiar español.]] |
| **volver a** + inf. | снова (сделать ещё раз) | [[Vuelve a llamar.]] — Позвони ещё раз. |
| **dejar de** + inf. | перестать | [[Dejé de fumar.]] — Я бросил курить. |
| **tener que** + inf. | должен, нужно | [[Tengo que irme.]] |
| **ir a** + inf. | собираться | [[Voy a cenar.]] |` },
      { h: "С герундием: seguir и llevar", b: `| | |
| **seguir** + gerundio | продолжать: [[Sigo viviendo en Lima.]] — Я по-прежнему живу в Лиме. |
| **llevar** + время + gerundio | уже столько-то времени: [[Llevo dos años estudiando español.]] — Я учу испанский уже два года. |

? **Llevar** — очень живой способ сказать «уже…»: [[¿Cuánto tiempo llevas esperando?]] — Сколько ты уже ждёшь?` },
      { h: "Чили: особенности", b: `Чилийский испанский быстрый и с «проглатыванием» звуков: **s** на конце слога почти не слышно, а **-ado** звучит как **-ao**: *cansado* → «кансао».

| Чили | Нейтрально |
| [[¿Cachai?]] | ¿Entiendes? — понимаешь? |
| [[al tiro]] | enseguida — сразу |
| [[la micro]] | el autobús — автобус |
| [[po]] | pues — ну (sí po, no po) |` }
    ],
    ex: [
      ["Acabo de llegar a casa.", "Я только что пришёл домой.", "Acabo de=только что|llegar=прийти|a casa=домой"],
      ["Empecé a estudiar español hace un año.", "Я начал учить испанский год назад.", "Empecé a=я начал|estudiar=изучать|español=испанский|hace un año=год назад"],
      ["Mi padre dejó de fumar.", "Мой отец бросил курить.", "Mi padre=мой отец|dejó de=перестал|fumar=курить"],
      ["Llevo tres meses viviendo en Chile.", "Я живу в Чили уже три месяца.", "Llevo=уже|tres meses=три месяца|viviendo=живу|en Chile=в Чили"],
      ["¿Sigues trabajando en el banco?", "Ты всё ещё работаешь в банке?", "Sigues=продолжаешь|trabajando=работать|en el banco=в банке"],
      ["No vuelvas a hacerlo, por favor.", "Пожалуйста, больше так не делай.", "No vuelvas a=не делай снова|hacerlo=это|por favor=пожалуйста"]
    ],
    warn: [
      ["Acabo llegar", "Acabo de llegar", "acabar de + инфинитив."],
      ["Empecé estudiar", "Empecé a estudiar", "empezar a + инфинитив."],
      ["Llevo dos años estudio", "Llevo dos años estudiando", "llevar + время + герундий."]
    ],
    voc: [
      "acabar de|только что (сделать)|акабАр дэ|phr", "dejar de|перестать|дэхАр дэ|phr", "volver a|снова (сделать)|больбЭр а|phr", "seguir|продолжать; следовать|сэгИр|v",
      "llevar|носить; нести; (с временем) уже…|йэбАр|v", "fumar|курить|фумАр|v", "el mes|месяц|эль мэс|n.m", "enseguida|сразу, сейчас же|энсэгИда|adv",
      "ponerse a|приняться за|понЭрсэ а|phr"
    ],
    q: [
      ["c", "«Я только что поел»:", ["Acabo de comer.", "Acabo comer.", "Termino de comí."], 0, "acabar de + инфинитив."],
      ["c", "Llevo una hora ___. (esperar)", ["esperando", "esperar", "esperado"], 0, "llevar + время + герундий."],
      ["c", "Ana dejó ___ trabajar en la tienda.", ["de", "a", "—"], 0, "dejar de — перестать."],
      ["c", "«Ты всё ещё живёшь в Москве?»", ["¿Sigues viviendo en Moscú?", "¿Sigues vivir en Moscú?", "¿Llevas vivir en Moscú?"], 0, "seguir + герундий."],
      ["f", "Empezó ___ llover a las cinco.", "a", "empezar a + инфинитив.", "предлог"],
      ["f", "Perdón, ¿puedes volver ___ explicarlo?", "a", "volver a — ещё раз.", "предлог"],
      ["x", "Llevo cinco años trabajo aquí.", "Llevo cinco años trabajando aquí.", "Нужен герундий."],
      ["x", "Acabamos llegar del aeropuerto.", "Acabamos de llegar del aeropuerto.", "acabar de + инфинитив."],
      ["s", "Друг звонит и спрашивает, давно ли вы ждёте. Вы ждёте 20 минут.", ["Llevo veinte minutos esperando.", "Espero hace veinte minutos ayer.", "Acabo de esperar veinte minutos."], 0, "Llevo + время + герундий."]
    ]
  }
  ]
},
{
  id: "a2u6", city: "Málaga", scene: "beach",
  t: "Больше или меньше", ti: "Comparaciones",
  d: "Сравнения и превосходная степень: más que, tan como, el mejor, -ísimo.",
  lessons: [
  {
    id: "a2u6l1", t: "Сравнения: más que, tan como", ti: "Comparativos", tags: ["comparativos"],
    goal: "Научитесь сравнивать людей, места и вещи.",
    th: [
      { h: "Больше, меньше, так же", b: `| | Формула | Пример |
| больше | **más** + прил. + **que** | [[Málaga es más pequeña que Madrid.]] |
| меньше | **menos** + прил. + **que** | [[El tren es menos caro que el avión.]] |
| так же | **tan** + прил. + **como** | [[Ana es tan alta como Luis.]] |

С глаголами: [[Trabajo más que tú.]] [[Duermo tanto como tú.]]
С существительными: **tanto/tanta/tantos/tantas** + сущ. + **como**: [[No tengo tantos amigos como tú.]]` },
      { h: "Неправильные формы", b: `| | Сравнительная | |
| bueno, bien | [[mejor]] | лучше |
| malo, mal | [[peor]] | хуже |
| grande (возраст) | [[mayor]] | старше |
| pequeño (возраст) | [[menor]] | младше |

[[Este café es mejor que el otro.]] [[Mi hermana es mayor que yo.]]

! Не говорят *más bueno* о качестве и *más mejor* никогда.` },
      { h: "Как сказать «чем я»", b: `После **que** и **como** используются формы **yo, tú**, а не *mí, ti*:

[[Él es más alto que yo.]] — Он выше меня.
[[Cocinas tan bien como yo.]]

С числами — **más de**: [[Tengo más de cien libros.]] — У меня больше ста книг.` }
    ],
    ex: [
      ["Málaga es más pequeña que Madrid.", "Малага меньше Мадрида.", "Málaga=Малага|es=есть|más pequeña=меньше|que=чем|Madrid=Мадрид"],
      ["El tren es menos caro que el avión.", "Поезд дешевле самолёта.", "El tren=поезд|es=есть|menos caro=менее дорогой|que=чем|el avión=самолёт"],
      ["Mi hermano es mayor que yo.", "Мой брат старше меня.", "Mi hermano=мой брат|es=есть|mayor=старше|que yo=чем я"],
      ["Este restaurante es mejor que el otro.", "Этот ресторан лучше другого.", "Este restaurante=этот ресторан|es mejor=лучше|que el otro=чем другой"],
      ["Hoy no hace tanto calor como ayer.", "Сегодня не так жарко, как вчера.", "Hoy=сегодня|no hace tanto calor=не так жарко|como ayer=как вчера"],
      ["Tengo más de veinte primos.", "У меня больше двадцати двоюродных братьев и сестёр.", "Tengo=у меня есть|más de=больше чем|veinte=двадцать|primos=двоюродных"]
    ],
    warn: [
      ["Más bueno que", "Mejor que", "bueno → mejor."],
      ["Tan alto que yo", "Tan alto como yo", "tan… como."],
      ["Más alto que mí", "Más alto que yo", "После que — yo."]
    ],
    voc: [
      "más|больше, более|мас|adv", "tan|так, столь|тан|adv", "como|как|кОмо|conj", "mejor|лучше|мэхОр|adj",
      "peor|хуже|пэОр|adj", "mayor|старше; больший|майОр|adj", "menor|младше; меньший|мэнОр|adj", "caro|дорогой|кАро|adj",
      "barato|дешёвый|барАто|adj", "el primo|двоюродный брат|эль прИмо|n.m"
    ],
    q: [
      ["c", "Madrid es ___ grande que Málaga.", ["más", "tan", "muy"], 0, "más… que."],
      ["c", "Ana es tan simpática ___ su madre.", ["como", "que", "de"], 0, "tan… como."],
      ["c", "Este vino es ___ que el de ayer. (bueno)", ["mejor", "más bueno", "más mejor"], 0, "bueno → mejor."],
      ["c", "«У меня меньше времени, чем у тебя»:", ["Tengo menos tiempo que tú.", "Tengo menos tiempo como tú.", "Tengo tan tiempo que tú."], 0, "menos + сущ. + que."],
      ["f", "Mi hermana tiene 15 años y yo 20: ella es ___ que yo.", "menor", "Младше — menor.", "младше"],
      ["f", "Hay más ___ mil personas en la plaza.", "de", "С числом — más de.", "предлог"],
      ["x", "Pedro es más alto que mí.", "Pedro es más alto que yo.", "После que — yo."],
      ["x", "No tengo tanto amigos como tú.", "No tengo tantos amigos como tú.", "tantos — согласуется с amigos."],
      ["s", "Вы выбираете между двумя куртками: левая лучше, но дороже.", ["Esta es mejor, pero es más cara.", "Esta es más buena, pero tan cara.", "Esta es mejor que cara."], 0, "mejor… más cara."]
    ]
  },
  {
    id: "a2u6l2", t: "Самый-самый: превосходная степень", ti: "Superlativos", tags: ["comparativos"],
    goal: "Научитесь говорить «самый…», «очень-очень…» и правильно выбирать muy или mucho.",
    th: [
      { h: "El más… de", b: `**el / la / los / las** + **más / menos** + прил. + **de**:

[[Es la ciudad más bonita de España.]] — Это самый красивый город Испании.
[[Es el día más largo del año.]]

С неправильными: **el mejor, el peor, el mayor, el menor**: [[Es el mejor restaurante de la ciudad.]]

! «В» после превосходной степени — **de**, а не *en*.` },
      { h: "Суффикс -ísimo", b: `**-ísimo/-ísima** = «очень-очень», «чрезвычайно»:

| | |
| guapo | [[guapísimo]] |
| caro | [[carísimo]] |
| fácil | [[facilísimo]] |
| rico | [[riquísimo]] — c → qu |
| largo | [[larguísimo]] — g → gu |

[[La paella está buenísima.]] — Паэлья потрясающая.` },
      { h: "Muy или mucho?", b: `| | |
| **muy** + прилагательное / наречие | [[muy bonito]], [[muy bien]], [[muy tarde]] |
| глагол + **mucho** | [[Trabajo mucho.]] [[Me gusta mucho.]] |
| **mucho/a/os/as** + существительное | [[mucha gente]], [[muchos libros]] |

! Никогда не *muy mucho* и не *mucho bonito*. «Очень нравится» — **me gusta mucho**, не *muy*.` }
    ],
    ex: [
      ["Málaga es la ciudad más bonita de Andalucía.", "Малага — самый красивый город Андалусии.", "Málaga=Малага|es=есть|la ciudad más bonita=самый красивый город|de Andalucía=Андалусии"],
      ["Es el mejor helado que he probado.", "Это лучшее мороженое, которое я пробовал.", "Es=это|el mejor helado=лучшее мороженое|que=которое|he probado=я пробовал"],
      ["El examen fue facilísimo.", "Экзамен был очень лёгким.", "El examen=экзамен|fue=был|facilísimo=очень лёгкий"],
      ["Hay muchísima gente en la playa.", "На пляже огромное количество людей.", "Hay=есть|muchísima gente=очень много людей|en la playa=на пляже"],
      ["Me gusta mucho el pescado frito.", "Мне очень нравится жареная рыба.", "Me gusta mucho=мне очень нравится|el pescado frito=жареная рыба"],
      ["Es la persona más simpática del grupo.", "Это самый приятный человек в группе.", "Es=это|la persona más simpática=самый приятный человек|del grupo=в группе"]
    ],
    warn: [
      ["La más bonita en España", "La más bonita de España", "После превосходной — de."],
      ["Me gusta muy", "Me gusta mucho", "С глаголом — mucho."],
      ["Es muy mucho caro", "Es muy caro / carísimo", "muy + прил. или -ísimo."]
    ],
    voc: [
      "el más|самый|эль мас|phr", "largo|длинный|лАрго|adj", "probar|пробовать|пробАр|v", "el grupo|группа|эль грУпо|n.m",
      "frito|жареный|фрИто|adj",
      "el edificio|здание|эль эдифИсьо|n.m", "el jugador|игрок|эль хугадОр|n.m", "el equipo|команда|эль экИпо|n.m", "precioso|прекрасный|прэсьОсо|adj", "muchísimo|очень много|мучИсимо|adv", "el mundo|мир|эль мУндо|n.m", "antiguo|старинный, древний|антИгуо|adj"
    ],
    q: [
      ["c", "Es el edificio más alto ___ la ciudad.", ["de", "en", "que"], 0, "Превосходная степень — de."],
      ["c", "Este pastel está ___. (rico)", ["riquísimo", "ricísimo", "muy riquísimo"], 0, "c → qu: riquísimo."],
      ["c", "Hay ___ turistas en verano.", ["muchos", "muy", "mucho"], 0, "mucho согласуется: muchos turistas."],
      ["c", "«Он лучший игрок команды»:", ["Es el mejor jugador del equipo.", "Es el más bueno jugador en el equipo.", "Es mejor jugador que equipo."], 0, "el mejor… del."],
      ["f", "Estoy ___ cansado hoy.", "muy", "muy + прилагательное.", "очень"],
      ["f", "Este hotel es carísimo, es el ___ caro de la playa.", "más", "el más + прил.", "самый"],
      ["x", "Me gusta muy la música latina.", "Me gusta mucho la música latina.", "С глаголом — mucho."],
      ["x", "Es la playa más bonita en Málaga.", "Es la playa más bonita de Málaga.", "Превосходная — de."],
      ["s", "Вам очень понравилась еда в ресторане. Что сказать официанту?", ["¡Estaba todo riquísimo, gracias!", "¡Era muy mucho rico!", "¡Está más rico de!"], 0, "riquísimo — очень вкусно."]
    ]
  }
  ]
},
{
  id: "a2u7", city: "Bilbao", scene: "plaza",
  t: "Кому? Что?", ti: "Los pronombres",
  d: "Местоимения-дополнения: lo, la, le, se lo — чтобы не повторять одно и то же.",
  lessons: [
  {
    id: "a2u7l1", t: "Прямое дополнение: lo, la, los, las", ti: "Complemento directo", tags: ["complementos", "pronombres"],
    goal: "Научитесь заменять предмет или человека местоимением: «я его купил», «я её вижу».",
    th: [
      { h: "Кого? Что?", b: `Местоимения прямого дополнения отвечают на вопрос **кого? что?**:

| | |
| me | меня |
| te | тебя |
| **lo** | его, это (м. р.), Вас (м.) |
| **la** | её (ж. р.), Вас (ж.) |
| nos | нас |
| os | вас |
| **los** | их (м. р.) |
| **las** | их (ж. р.) |

— ¿Dónde compraste **el libro**? — [[Lo compré en Bilbao.]]
— ¿Ves a **María**? — Sí, [[la veo]].` },
      { h: "Где ставить", b: `- **Перед** спрягаемым глаголом: [[Lo tengo.]] [[No la conozco.]]
- **После** инфинитива и герундия — слитно: [[Voy a comprarlo.]] = [[Lo voy a comprar.]]; [[Estoy leyéndolo.]] = [[Lo estoy leyendo.]]

! Род и число — как у заменяемого слова: **la** paella → [[la como]]; **los** zapatos → [[los compro]].` },
      { h: "Lo — «это»", b: `**Lo** заменяет целую мысль или фразу:

[[No lo sé.]] — Я не знаю (этого).
[[Lo entiendo.]] — Я понимаю (это).
— ¿Sabes que Ana se casa? — Sí, [[ya lo sé]].

? В Испании (особенно в Мадриде) про мужчин часто говорят **le** вместо **lo**: *Le conozco* — я его знаю. Это допустимо, но **lo** правильно везде.` }
    ],
    ex: [
      ["¿La paella? La hago los domingos.", "Паэлья? Я готовлю её по воскресеньям.", "La paella=паэлья|La=её|hago=готовлю|los domingos=по воскресеньям"],
      ["No lo sé.", "Я не знаю.", "No=не|lo=это|sé=знаю (saber)"],
      ["¿Conoces a Pedro? — Sí, lo conozco.", "Ты знаешь Педро? — Да, я его знаю.", "Conoces=знаешь|a Pedro=Педро|Sí=да|lo=его|conozco=знаю"],
      ["Las gafas, ¿dónde las has puesto?", "Очки, куда ты их положил?", "Las gafas=очки|dónde=куда|las=их|has puesto=ты положил"],
      ["Voy a llamarte mañana.", "Я позвоню тебе завтра.", "Voy a=я собираюсь|llamarte=позвонить тебе|mañana=завтра"],
      ["Te quiero mucho.", "Я тебя очень люблю.", "Te=тебя|quiero=люблю|mucho=очень"]
    ],
    warn: [
      ["Compré lo", "Lo compré", "Перед спрягаемым глаголом."],
      ["La libro compré", "Lo compré (el libro)", "Род как у слова: el libro → lo."],
      ["Voy a lo comprar", "Voy a comprarlo / Lo voy a comprar", "Либо перед всей конструкцией, либо в конце инфинитива."]
    ],
    voc: [
      "lo|его, это|ло|pron", "la|её|ла|pron", "los|их (м. р.)|лос|pron", "las|их (ж. р.)|лас|pron",
      "las gafas|очки|лас гАфас|n.f.pl", "entender|понимать|энтэндЭр|v", "llamar|звать; звонить|йамАр|v", "encontrar|находить|энконтрАр|v",
      "olvidar|забывать|ольбидАр|v", "las llaves|ключи|лас йАбэс|n.f.pl"
    ],
    q: [
      ["c", "— ¿Tienes las llaves? — Sí, ___ tengo.", ["las", "los", "les"], 0, "las llaves → las."],
      ["c", "— ¿Has visto a Juan? — No, no ___ he visto.", ["lo", "la", "le lo"], 0, "Juan → lo."],
      ["c", "«Я хочу купить его (подарок)»:", ["Quiero comprarlo.", "Quiero lo comprar.", "Lo quiero comprarlo."], 0, "В конце инфинитива — слитно."],
      ["c", "«Я не понимаю (этого)»:", ["No lo entiendo.", "No entiendo lo.", "No la entiendo eso."], 0, "lo — «это»."],
      ["f", "— ¿Dónde está la mochila? — No ___ encuentro.", "la", "la mochila → la.", "её"],
      ["f", "— ¿Compraste los billetes? — Sí, ___ compré ayer.", "los", "los billetes → los.", "их"],
      ["x", "Conozco la muy bien. (a Marta)", "La conozco muy bien.", "Местоимение перед глаголом."],
      ["x", "— ¿El pan? — Sí, la he comprado.", "— ¿El pan? — Sí, lo he comprado.", "el pan → lo."],
      ["d", [["Iker", "¿Has visto mis gafas?", "Ты не видел мои очки?"]], ["Sí, las he visto en la mesa.", "Sí, los he visto en la mesa.", "Sí, he las visto en la mesa."], 0, "las gafas → las, перед haber."]
    ]
  },
  {
    id: "a2u7l2", t: "Косвенное дополнение: le, les, se lo", ti: "Complemento indirecto", tags: ["complementos", "pronombres"],
    goal: "Научитесь говорить «ему», «ей», «им» и соединять два местоимения: «я ему это дал».",
    th: [
      { h: "Кому?", b: `| | |
| me | мне |
| te | тебе |
| **le** | ему, ей, Вам |
| nos | нам |
| os | вам |
| **les** | им, Вам (мн.) |

[[Le escribo a mi madre.]] — Я пишу маме.
[[¿Les has dicho la verdad?]] — Ты сказал им правду?

! В испанском **дублирование** — норма: [[Le doy el libro a Pablo.]] (букв. «ему даю книгу Пабло»). Так же, как в *A Pablo le gusta*.` },
      { h: "Два местоимения: se lo", b: `Если в одной фразе есть и «кому», и «что», порядок такой: **кому + что**:

[[Me lo das.]] — Ты мне это даёшь.
[[Te la compro.]] — Я тебе её куплю.

! **le / les** перед **lo, la, los, las** превращается в **se**:
*le lo* → [[se lo]]: [[Se lo doy.]] — Я ему это даю.
*les la* → [[se la]]: [[Se la mandé.]] — Я им её отправил.` },
      { h: "С инфинитивом и в вопросах", b: `- Пара местоимений тоже может стоять в конце инфинитива — тогда нужен знак ударения: [[Voy a dárselo.]] = [[Se lo voy a dar.]]
- [[¿Me lo puedes repetir?]] — Можешь мне это повторить?
- [[¿Se lo has dicho?]] — Ты ему (ей, им) это сказал?

? Чтобы уточнить, кому именно, добавляют **a él / a ella / a usted**: [[Se lo doy a ella.]]` }
    ],
    ex: [
      ["Le escribo un mensaje a mi madre.", "Я пишу маме сообщение.", "Le=ей|escribo=пишу|un mensaje=сообщение|a mi madre=моей маме"],
      ["¿Les has dicho la verdad?", "Ты сказал им правду?", "Les=им|has dicho=ты сказал|la verdad=правду"],
      ["Se lo doy mañana.", "Я ему это отдам завтра.", "Se=ему (le)|lo=это|doy=даю|mañana=завтра"],
      ["¿Me lo puedes repetir, por favor?", "Можешь мне это повторить, пожалуйста?", "Me=мне|lo=это|puedes=можешь|repetir=повторить|por favor=пожалуйста"],
      ["Voy a regalárselo a mi hermana.", "Я подарю это сестре.", "Voy a=собираюсь|regalárselo=подарить ей это|a mi hermana=моей сестре"],
      ["Te lo explico otra vez.", "Я тебе это объясню ещё раз.", "Te=тебе|lo=это|explico=объясняю|otra vez=ещё раз"]
    ],
    warn: [
      ["Le lo doy", "Se lo doy", "le + lo → se lo."],
      ["Lo me das", "Me lo das", "Сначала «кому», потом «что»."],
      ["Voy a darselo", "Voy a dárselo", "Два местоимения в конце — нужен знак ударения."]
    ],
    voc: [
      "le|ему, ей, Вам|лэ|pron", "les|им|лэс|pron", "dar|давать|дар|v", "regalar|дарить|рэгалАр|v",
      "explicar|объяснять|экспликАр|v", "mandar|отправлять|мандАр|v", "prestar|одалживать|прэстАр|v", "el mensaje|сообщение|эль мэнсАхэ|n.m",
      "el regalo|подарок|эль рэгАло|n.m", "otra vez|ещё раз|Отра бэс|phr", "enseñar|показывать; учить|энсэньАр|v"
    ],
    q: [
      ["c", "— ¿Le diste el regalo a Ana? — Sí, ___ di ayer.", ["se lo", "le lo", "lo le"], 0, "le + lo → se lo."],
      ["c", "«Покажи мне это»: ¿Puedes ___?", ["enseñármelo", "enseñarmelo", "enseñarlo me"], 0, "Два местоимения в конце — знак ударения."],
      ["c", "___ escribo a mis abuelos cada semana.", ["Les", "Los", "Le"], 0, "Кому (им) — les."],
      ["c", "— ¿Me prestas tu coche? — Sí, ___ presto.", ["te lo", "lo te", "se lo"], 0, "Тебе + его: te lo."],
      ["f", "A mi padre ___ gusta el fútbol.", "le", "a mi padre — le.", "ему"],
      ["f", "— ¿Les mandaste las fotos? — Sí, se ___ mandé.", "las", "las fotos → las.", "их (фото)"],
      ["x", "Le lo expliqué a la profesora.", "Se lo expliqué a la profesora.", "le lo → se lo."],
      ["x", "¿Lo me puedes dar?", "¿Me lo puedes dar?", "Сначала me, потом lo."],
      ["s", "Подруга просит вернуть книгу. Вы обещаете отдать её завтра.", ["Te lo devuelvo mañana.", "Lo te devuelvo mañana.", "Se lo devuelvo mañana a ti."], 0, "te lo — тебе её (el libro)."]
    ]
  }
  ]
}
]);
