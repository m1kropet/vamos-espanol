/* Курс A1 (испанский), часть 2: юниты 6–10. Формат описан в a1-part1.js */
IT.addUnits("A1", [
{
  id: "a1u6", city: "Valencia", scene: "valencia",
  t: "Tener, hay, числа и время", ti: "Tener, hay, números y la hora",
  d: "Говорим о том, что у нас есть, считаем до ста, называем возраст, цену и время.",
  lessons: [
  {
    id: "a1u6l1", t: "Tener и hay", ti: "Tener y hay", tags: ["tener"],
    goal: "Выучите tener, выражения с ним (голод, возраст, «надо») и разницу между hay и está.",
    th: [
      { h: "Tener — «иметь»", b: `| Лицо | Форма |
| yo | **tengo** |
| tú | **tienes** |
| él / ella / usted | **tiene** |
| nosotros | tenemos |
| vosotros | tenéis |
| ellos / ustedes | **tienen** |

Русское «У меня есть машина» = испанское «Я имею машину»: [[Tengo un coche.]]

? В формах tienes, tiene, tienen гласная e превращается в **ie** — так ведут себя многие частые глаголы (подробнее в юните 7).` },
      { h: "Ощущения и возраст — через tener", b: `| Испанский | Русский |
| [[Tengo hambre.]] | Я голоден. |
| [[Tengo sed.]] | Я хочу пить. |
| [[Tengo frío.]] / [[Tengo calor.]] | Мне холодно / жарко. |
| [[Tengo sueño.]] | Я хочу спать. |
| [[Tengo miedo.]] | Мне страшно. |
| [[Tengo prisa.]] | Я спешу. |
| [[Tienes razón.]] | Ты прав. |
| [[Tengo veinte años.]] | Мне двадцать лет. |

**Tener que** + инфинитив = «должен, надо»: [[Tengo que trabajar.]] — Мне надо работать.` },
      { h: "Hay или está?", b: `**Hay** — «есть, имеется» (одна форма для ед. и мн. ч.). Говорит о **существовании** чего-то неизвестного:
- [[Hay un banco cerca.]] — Рядом есть банк.
- [[Hay dos museos.]] — Есть два музея.

**Está / están** — **где находится** конкретное, известное:
- [[El banco está en la plaza.]] — Банк (тот самый) на площади.

| hay + un / una / числа / без артикля | está + el / la / имя |
| [[¿Hay una farmacia aquí?]] | [[¿Dónde está la farmacia?]] |

! Никогда: ~~hay el banco~~. С определённым артиклем — только está.` }
    ],
    ex: [
      ["Tengo hambre.", "Я голоден.", "Tengo=имею|hambre=голод", "Буквально «имею голод»."],
      ["¿Tienes sed?", "Хочешь пить?", "Tienes=ты имеешь|sed=жажда"],
      ["Tenemos un perro.", "У нас есть собака.", "Tenemos=мы имеем|un=(артикль)|perro=собака"],
      ["Tengo que estudiar.", "Мне надо учиться.", "Tengo que=я должен|estudiar=учиться"],
      ["¿Hay un banco cerca?", "Рядом есть банк?", "Hay=есть, имеется|un banco=банк|cerca=близко"],
      ["El banco está en la plaza.", "Банк на площади.", "El banco=банк|está=находится|en=на, в|la plaza=площадь"]
    ],
    warn: [
      ["Soy 25 años", "Tengo 25 años", "Возраст — с tener: «имею 25 лет»."],
      ["Estoy hambre", "Tengo hambre", "Голод, жажда, холод — с tener."],
      ["Hay el banco en la plaza", "El banco está en la plaza", "С определённым артиклем — está."]
    ],
    voc: [
      "el hambre|голод|эль Амбрэ|n.f", "la sed|жажда|ла сэд|n.f", "el frío|холод|эль фрИо|n.m", "el calor|жара|эль калОр|n.m",
      "el sueño|сон; сонливость|эль суЭньо|n.m", "el miedo|страх|эль мьЕдо|n.m", "la prisa|спешка|ла прИса|n.f", "la razón|правота, причина|ла расОн|n.f",
      "hay|есть, имеется|ай|v", "cerca|близко|сЭрка|adv", "el banco|банк; скамейка|эль бАнко|n.m", "el año|год|эль Аньо|n.m"
    ],
    q: [
      ["c", "¿Tú ___ hermanos?", ["tienes", "tiene", "tengo"], 0, "tener: tú tienes."],
      ["c", "Nosotros ___ frío.", ["tenemos", "estamos", "somos"], 0, "Ощущения — tener: tenemos frío."],
      ["c", "«Мне жарко»:", ["Tengo calor.", "Estoy calor.", "Soy caliente."], 0, "Ощущение — tener calor. «Soy caliente» прозвучит двусмысленно!"],
      ["c", "«В городе есть два музея»:", ["Hay dos museos.", "Están dos museos.", "Hay los museos."], 0, "Существование неопределённого → hay."],
      ["c", "«Где (тот самый) музей?»", ["¿Dónde está el museo?", "¿Dónde hay el museo?"], 0, "Конкретный, известный предмет → está."],
      ["f", "Ellos ___ razón.", "tienen", "ellos → tienen. Tener razón = быть правым.", "tener"],
      ["f", "Tengo ___ trabajar mañana. (надо)", "que", "tener que + инфинитив = надо.", "«надо»"],
      ["x", "Soy hambre.", "Tengo hambre.", "Голод «имеют»: tengo hambre."]
    ]
  },
  {
    id: "a1u6l2", t: "Числа от 0 до 100, возраст и цены", ti: "Los números", tags: ["numeros"],
    goal: "Научитесь называть любые числа до ста, свой возраст и спрашивать цену.",
    th: [
      { h: "От 0 до 15 — учим наизусть", b: `| | | | |
| 0 [[cero]] | 1 [[uno]] | 2 [[dos]] | 3 [[tres]] |
| 4 [[cuatro]] | 5 [[cinco]] | 6 [[seis]] | 7 [[siete]] |
| 8 [[ocho]] | 9 [[nueve]] | 10 [[diez]] | 11 [[once]] |
| 12 [[doce]] | 13 [[trece]] | 14 [[catorce]] | 15 [[quince]] |` },
      { h: "От 16 до 29 — одним словом", b: `16–19: **dieci + число**: [[dieciséis]], [[diecisiete]], [[dieciocho]], [[diecinueve]].

20 — [[veinte]]. 21–29: **veinti + число**: [[veintiuno]], [[veintidós]], [[veintitrés]], [[veinticinco]], [[veintiséis]].

? Обратите внимание на знаки ударения: dieciséis, veintidós, veintitrés, veintiséis.` },
      { h: "От 30 до 100 — через y", b: `| | | |
| 30 [[treinta]] | 40 [[cuarenta]] | 50 [[cincuenta]] |
| 60 [[sesenta]] | 70 [[setenta]] | 80 [[ochenta]] |
| 90 [[noventa]] | 100 [[cien]] | 101 [[ciento uno]] |

С 31 числа пишутся **раздельно через y**: [[treinta y dos]], [[cuarenta y cinco]], [[noventa y nueve]].

! **uno → un** перед существительным мужского рода, **una** — перед женским: [[veintiún años]], [[treinta y una casas]].` },
      { h: "Возраст и цена", b: `- [[¿Cuántos años tienes?]] — Сколько тебе лет?
- [[Tengo treinta y dos años.]] — Мне 32 года.
- [[¿Cuánto cuesta?]] — Сколько стоит? · [[¿Cuánto cuestan?]] — Сколько стоят?
- [[Cuesta cincuenta euros.]] — Стоит 50 евро.
- [[¿Cuánto es?]] — Сколько с меня?` }
    ],
    ex: [
      ["¿Cuántos años tienes?", "Сколько тебе лет?", "Cuántos=сколько|años=лет|tienes=ты имеешь"],
      ["Tengo treinta y dos años.", "Мне тридцать два года.", "Tengo=имею|treinta y dos=32|años=лет"],
      ["Mi abuela tiene ochenta y un años.", "Моей бабушке восемьдесят один год.", "Mi=моя|abuela=бабушка|tiene=имеет|ochenta y un=81 (uno → un перед сущ.)|años=лет"],
      ["¿Cuánto cuesta?", "Сколько стоит?", "Cuánto=сколько|cuesta=стоит (costar)"],
      ["Cuesta quince euros.", "Стоит пятнадцать евро.", "Cuesta=стоит|quince=15|euros=евро"],
      ["Veintidós más veinte son cuarenta y dos.", "Двадцать два плюс двадцать — сорок два.", "Veintidós=22|más=плюс|veinte=20|son=будет (есть)|cuarenta y dos=42"]
    ],
    warn: [
      ["veinte y dos", "veintidós", "21–29 пишутся одним словом."],
      ["treintaidós", "treinta y dos", "С 31 — раздельно через y."],
      ["veintiuno años", "veintiún años", "uno → un перед существительным мужского рода."]
    ],
    voc: [
      "cero|ноль|сЭро|num", "cuatro|четыре|куАтро|num", "cinco|пять|сИнко|num", "seis|шесть|сэйс|num", "siete|семь|сьЕтэ|num", "ocho|восемь|Очо|num",
      "nueve|девять|нуЭбэ|num", "diez|десять|дьЕс|num", "quince|пятнадцать|кИнсэ|num", "veinte|двадцать|бЭйнтэ|num", "treinta|тридцать|трЭйнта|num",
      "cincuenta|пятьдесят|синкуЭнта|num", "cuánto|сколько|куАнто|adv", "costar|стоить|костАр|v", "el euro|евро|эль Эуро|n.m", "la abuela|бабушка|ла абуЭла|n.f"
    ],
    q: [
      ["c", "«16»:", ["dieciséis", "diez y seis", "seisdiez"], 0, "16–19 — одним словом: dieci + число."],
      ["c", "«23»:", ["veintitrés", "veinte y tres", "veintitres"], 0, "Одним словом и со знаком ударения."],
      ["c", "«45»:", ["cuarenta y cinco", "cuarentaicinco", "cuarenta cinco"], 0, "С 31 — раздельно через y."],
      ["c", "Как спросить «Сколько тебе лет?»", ["¿Cuántos años tienes?", "¿Cuántos años eres?", "¿Cuánto años tienes?"], 0, "Возраст — с tener; años — м.р. мн. ч. → cuántos."],
      ["f", "Tengo ___ años. (30)", "treinta", "30 = treinta.", "число"],
      ["f", "Cincuenta más cincuenta son ___.", "cien", "100 = cien.", "число"],
      ["x", "Tengo veintiuno años.", "Tengo veintiún años.", "uno → un перед существительным мужского рода."],
      ["s", "В магазине вы хотите узнать цену сумки.", ["¿Cuánto cuesta?", "¿Cuántos años tiene?", "¿Qué hora es?"], 0, "¿Cuánto cuesta? — Сколько стоит?"]
    ]
  },
  {
    id: "a1u6l3", t: "Который час? Дни недели", ti: "¿Qué hora es?", tags: ["hora", "numeros"],
    goal: "Научитесь спрашивать и называть время, договариваться о встрече и называть дни недели.",
    th: [
      { h: "Который час?", b: `[[¿Qué hora es?]] — Который час?

- [[Es la una.]] — Час. (единственное число!)
- [[Son las dos.]] — Два часа. [[Son las ocho.]] — Восемь.

Часы — женского рода (la hora), поэтому **la una, las dos**.

| Время | По-испански |
| 3:10 | Son las tres **y diez** |
| 3:15 | Son las tres **y cuarto** |
| 3:30 | Son las tres **y media** |
| 3:45 | Son las cuatro **menos cuarto** |
| 3:50 | Son las cuatro **menos diez** |` },
      { h: "Во сколько? Утро, день, вечер", b: `[[¿A qué hora?]] — Во сколько? → [[A las ocho.]] · [[A la una.]]

- **de la mañana** — утра: a las nueve de la mañana
- **de la tarde** — дня (после обеда, до темноты): a las cinco de la tarde
- **de la noche** — вечера, ночи: a las diez de la noche
- [[al mediodía]] — в полдень · [[a medianoche]] — в полночь

? Испанцы обедают в 14–15 часов и ужинают в 21–22. «La tarde» длится до темноты!` },
      { h: "Дни недели", b: `| | |
| [[lunes]] — понедельник | [[viernes]] — пятница |
| [[martes]] — вторник | [[sábado]] — суббота |
| [[miércoles]] — среда | [[domingo]] — воскресенье |
| [[jueves]] — четверг | |

- Пишутся с **маленькой** буквы, все мужского рода.
- [[El lunes voy a Madrid.]] — В (этот) понедельник я еду в Мадрид.
- [[Los lunes trabajo.]] — По понедельникам я работаю. **los + день = регулярно.**
- [[hoy]] — сегодня, [[mañana]] — завтра, [[ayer]] — вчера.` }
    ],
    ex: [
      ["¿Qué hora es?", "Который час?", "Qué=какой|hora=час|es=есть"],
      ["Son las tres y media.", "Половина четвёртого (3:30).", "Son=есть|las tres=три (часа)|y=и|media=половина"],
      ["Es la una.", "Час (1:00).", "Es=есть|la una=один (час)", "Только с часом — единственное число!"],
      ["¿A qué hora sale el tren?", "Во сколько отправляется поезд?", "A qué hora=во сколько|sale=отправляется (salir)|el tren=поезд"],
      ["A las ocho menos cuarto.", "Без четверти восемь.", "A las=в|ocho=восемь|menos=минус, без|cuarto=четверть"],
      ["Los sábados no trabajo.", "По субботам я не работаю.", "Los sábados=по субботам|no=не|trabajo=работаю", "los + день недели = регулярность."]
    ],
    warn: [
      ["Son las una", "Es la una", "Час — единственное число."],
      ["Lunes с большой буквы", "lunes", "Дни недели и месяцы — с маленькой буквы."],
      ["En el lunes", "El lunes", "«В понедельник» — без предлога en."]
    ],
    voc: [
      "la hora|час; время|ла Ора|n.f", "media|половина|мЭдья|adj", "cuarto|четверть|куАрто|n.m", "menos|минус, без|мЭнос|adv",
      "lunes|понедельник|лУнэс|n.m", "martes|вторник|мАртэс|n.m", "miércoles|среда|мьЕрколэс|n.m", "jueves|четверг|хуЭбэс|n.m",
      "viernes|пятница|бьЕрнэс|n.m", "sábado|суббота|сАбадо|n.m", "domingo|воскресенье|домИнго|n.m", "ayer|вчера|айЕр|adv", "el tren|поезд|эль трэн|n.m"
    ],
    q: [
      ["c", "Сейчас 1:00. Как сказать?", ["Es la una.", "Son las una.", "Es el uno."], 0, "Только с часом — единственное число."],
      ["c", "5:15 —", ["Son las cinco y cuarto.", "Son las cinco menos cuarto.", "Es la cinco y quince cuarto."], 0, "y cuarto = «и четверть»."],
      ["c", "6:45 —", ["Son las siete menos cuarto.", "Son las seis menos cuarto.", "Son las siete y cuarto."], 0, "menos cuarto — «без четверти» следующего часа."],
      ["c", "«По воскресеньям я сплю долго»:", ["Los domingos duermo mucho.", "En domingo duermo mucho.", "Domingos duermo mucho."], 0, "los + день = регулярно."],
      ["f", "¿A qué hora? — ___ nueve. (В девять.)", "A las", "a + las + число.", "в (о времени)"],
      ["x", "Son las una y media.", "Es la una y media.", "С часом — единственное число."],
      ["s", "Вы хотите вежливо узнать у прохожего время.", ["Disculpe, ¿qué hora es?", "Perdona, ¿cuántos años tienes?", "¿Qué hora eres?"], 0, "Disculpe + ¿qué hora es? — вежливо."]
    ]
  }
  ]
},
{
  id: "a1u7", city: "Valencia", scene: "valencia",
  t: "Настоящее время", ti: "El presente",
  d: "Спряжение правильных глаголов на -ar, -er, -ir и самые нужные неправильные глаголы.",
  lessons: [
  {
    id: "a1u7l1", t: "Глаголы на -ar", ti: "Verbos en -ar", tags: ["presente"],
    goal: "Научитесь спрягать самую большую группу глаголов и задавать вопросы.",
    th: [
      { h: "Как устроен глагол", b: `Испанский инфинитив оканчивается на **-ar**, **-er** или **-ir**. Отбрасываем окончание и добавляем личное:

habl**ar** → habl- + окончание

| Лицо | Окончание | hablar (говорить) |
| yo | -o | [[hablo]] |
| tú | -as | [[hablas]] |
| él/ella/usted | -a | [[habla]] |
| nosotros | -amos | [[hablamos]] |
| vosotros | -áis | [[habláis]] |
| ellos/ustedes | -an | [[hablan]] |

! Ударение в формах yo, tú, él, ellos — на основе: **HA**blo, **HA**blan. Не «аблАн»!` },
      { h: "Одно настоящее время на всё", b: `Испанское presente — это «делаю», «делаю сейчас», «делаю обычно» и часто ближайшее будущее:
- [[Trabajo en Madrid.]] — Я работаю в Мадриде.
- [[Mañana viajo a Sevilla.]] — Завтра я еду в Севилью.

? Местоимения обычно опускают: **Hablo español** = Я говорю по-испански. Окончание и так показывает лицо.` },
      { h: "Вопросительные слова", b: `| | |
| [[¿dónde?]] — где? | [[¿cuándo?]] — когда? |
| [[¿qué?]] — что? | [[¿por qué?]] — почему? |
| [[¿quién?]] — кто? | [[¿cómo?]] — как? |

Ответ на ¿por qué? — [[porque]] (слитно, без знака): ¿Por qué estudias español? — **Porque** me gusta.` }
    ],
    ex: [
      ["Hablo español.", "Я говорю по-испански.", "Hablo=говорю|español=испанский (язык)"],
      ["¿Dónde vives?", "Где ты живёшь?", "Dónde=где|vives=живёшь (vivir)"],
      ["Trabajo en un banco.", "Я работаю в банке.", "Trabajo=работаю|en=в|un banco=банк"],
      ["Estudiamos juntos.", "Мы учимся вместе.", "Estudiamos=учимся|juntos=вместе"],
      ["¿Qué escucháis?", "Что вы слушаете?", "Qué=что|escucháis=слушаете (vosotros)"],
      ["Ellos compran pan.", "Они покупают хлеб.", "Ellos=они|compran=покупают|pan=хлеб", null, ["Compran pan."]]
    ],
    warn: [
      ["hablAn", "HAblan", "В форме ellos ударение не на окончании."],
      ["Yo estoy hablo", "Yo hablo", "В настоящем времени нет вспомогательного глагола."],
      ["¿Porqué? / ¿Por que?", "¿Por qué?", "В вопросе — раздельно и со знаком; в ответе — porque."]
    ],
    voc: [
      "hablar|говорить|аблАр|v", "trabajar|работать|трабахАр|v", "estudiar|учиться, изучать|эстудьЯр|v", "comprar|покупать|компрАр|v",
      "escuchar|слушать|эскучАр|v", "mirar|смотреть|мирАр|v", "viajar|путешествовать, ехать|бьяхАр|v", "juntos|вместе|хУнтос|adv",
      "qué|что; какой|кэ|pron", "por qué|почему|пор кЭ|adv", "porque|потому что|пОркэ|conj", "cuándo|когда|куАндо|adv", "el pan|хлеб|эль пан|n.m"
    ],
    q: [
      ["c", "Tú ___ inglés?", ["hablas", "habla", "hablo"], 0, "-ar: tú → -as."],
      ["c", "Nosotros ___ en Barcelona.", ["trabajamos", "trabajáis", "trabajan"], 0, "nosotros → -amos."],
      ["c", "Vosotros ___ la tele.", ["miráis", "miramos", "miran"], 0, "vosotros → -áis (со знаком)."],
      ["c", "Ellos ___ música.", ["escuchan", "escucháis", "escuchon"], 0, "ellos → -an."],
      ["f", "Yo ___ español. (estudiar)", "estudio", "yo → -o: estudio.", "учиться, «я»"],
      ["f", "¿___ estudias español? — Porque me gusta.", "Por qué", "В вопросе — por qué, раздельно и со знаком.", "почему"],
      ["x", "Yo habla español.", "Yo hablo español./Hablo español.", "yo → -o."],
      ["c", "«Почему ты учишь испанский?»", ["¿Por qué estudias español?", "¿Porque estudias español?", "¿Qué estudias español?"], 0, "Вопрос — por qué; ответ — porque."]
    ]
  },
  {
    id: "a1u7l2", t: "Глаголы на -er и -ir", ti: "Verbos en -er e -ir", tags: ["presente"],
    goal: "Освоите второе и третье спряжения.",
    th: [
      { h: "Окончания трёх спряжений", b: `| | -ar (hablar) | -er (comer) | -ir (vivir) |
| yo | habl**o** | com**o** | viv**o** |
| tú | habl**as** | com**es** | viv**es** |
| él/ella | habl**a** | com**e** | viv**e** |
| nosotros | habl**amos** | com**emos** | viv**imos** |
| vosotros | habl**áis** | com**éis** | viv**ís** |
| ellos | habl**an** | com**en** | viv**en** |

? -er и -ir отличаются **только** в формах nosotros и vosotros: comemos/vivimos, coméis/vivís.` },
      { h: "Частые глаголы", b: `**-er:** [[comer]] (есть), [[beber]] (пить), [[leer]] (читать), [[aprender]] (учить, учиться), [[comprender]] (понимать), [[correr]] (бегать).

**-ir:** [[vivir]] (жить), [[escribir]] (писать), [[abrir]] (открывать), [[subir]] (подниматься), [[recibir]] (получать).

Самая нужная фраза: [[No comprendo.]] — Я не понимаю. И: [[Más despacio, por favor.]] — Помедленнее, пожалуйста.` },
      { h: "Глаголы с изменённой формой yo", b: `У некоторых глаголов неправильна только форма **yo**:

| Инфинитив | yo | остальные — по правилу |
| [[hacer]] (делать) | **hago** | haces, hace… |
| [[salir]] (выходить) | **salgo** | sales, sale… |
| [[poner]] (класть) | **pongo** | pones, pone… |
| [[ver]] (видеть) | **veo** | ves, ve… |
| [[saber]] (знать) | **sé** | sabes, sabe… |
| [[conocer]] (быть знакомым) | **conozco** | conoces… |` }
    ],
    ex: [
      ["Como en casa.", "Я ем дома.", "Como=ем|en casa=дома"],
      ["¿Lees mucho?", "Ты много читаешь?", "Lees=читаешь (leer)|mucho=много"],
      ["Vivimos en Valencia.", "Мы живём в Валенсии.", "Vivimos=живём|en=в|Valencia=Валенсия"],
      ["No comprendo.", "Я не понимаю.", "No=не|comprendo=понимаю"],
      ["¿Qué hacéis el domingo?", "Что вы делаете в воскресенье?", "Qué=что|hacéis=делаете (vosotros)|el domingo=в воскресенье"],
      ["Salgo de casa a las ocho.", "Я выхожу из дома в восемь.", "Salgo=выхожу (salir, yo)|de casa=из дома|a las ocho=в восемь"]
    ],
    warn: [
      ["nosotros vivemos", "nosotros vivimos", "-ir → nosotros -imos."],
      ["yo haco", "yo hago", "hacer: yo hago."],
      ["yo sabo", "yo sé", "saber: yo sé (со знаком, чтобы отличать от se)."]
    ],
    voc: [
      "comer|есть|комЭр|v", "beber|пить|бебЭр|v", "leer|читать|леЭр|v", "aprender|учить, учиться|апрэндЭр|v", "comprender|понимать|компрэндЭр|v",
      "vivir|жить|бибИр|v", "escribir|писать|эскрибИр|v", "abrir|открывать|абрИр|v", "hacer|делать|асЭр|v", "salir|выходить; отправляться|салИр|v",
      "saber|знать|сабЭр|v", "despacio|медленно|деспАсьо|adv", "mucho|много|мУчо|adv"
    ],
    q: [
      ["c", "Él ___ un libro. (leer)", ["lee", "lees", "leo"], 0, "-er: él → -e."],
      ["c", "Nosotros ___ en Lima. (vivir)", ["vivimos", "vivemos", "viven"], 0, "-ir: nosotros → -imos."],
      ["c", "Vosotros ___ cartas. (escribir)", ["escribís", "escribéis", "escriben"], 0, "-ir: vosotros → -ís."],
      ["c", "Yo ___ los deberes. (hacer)", ["hago", "haco", "hace"], 0, "hacer: yo hago."],
      ["f", "Yo no ___ la respuesta. (saber)", "sé", "saber: yo sé.", "знать, «я»"],
      ["f", "Ellos ___ agua. (beber)", "beben", "ellos → -en.", "пить, «они»"],
      ["x", "Nosotros comimos todos los días.", "Nosotros comemos todos los días./Comemos todos los días.", "В настоящем: comemos. «comimos» — это прошедшее время."],
      ["s", "Испанец говорит слишком быстро. Что сказать?", ["Perdón, no comprendo. Más despacio, por favor.", "Perdón, no como.", "De nada, comprendo todo."], 0, "Más despacio — медленнее. Самая полезная фраза новичка."]
    ]
  },
  {
    id: "a1u7l3", t: "Неправильные глаголы: ir, querer, poder", ti: "Verbos irregulares", tags: ["presente", "irregulares"],
    goal: "Выучите ir, глаголы с чередованием e→ie, o→ue и конструкцию ir a + инфинитив.",
    th: [
      { h: "Ir — «идти, ехать»", b: `| yo | tú | él | nosotros | vosotros | ellos |
| **voy** | **vas** | **va** | **vamos** | **vais** | **van** |

- [[Voy a Madrid.]] — Я еду в Мадрид. (куда → **a**)
- [[¡Vamos!]] — Пойдём! Поехали!

**Ir a + инфинитив** — ближайшее будущее, «собираюсь»: [[Voy a comer.]] — Я сейчас поем / собираюсь поесть. [[¿Qué vas a hacer mañana?]]` },
      { h: "Чередование в основе: e → ie, o → ue", b: `Под ударением гласная основы «раздваивается». В формах **nosotros** и **vosotros** ударение уходит на окончание — и чередования **нет**.

| | querer (e→ie) | poder (o→ue) |
| yo | qu**ie**ro | p**ue**do |
| tú | qu**ie**res | p**ue**des |
| él | qu**ie**re | p**ue**de |
| nosotros | queremos | podemos |
| vosotros | queréis | podéis |
| ellos | qu**ie**ren | p**ue**den |

Так же: **e→ie** [[pensar]], [[empezar]], [[preferir]], [[cerrar]]; **o→ue** [[dormir]], [[volver]], [[encontrar]], [[costar]] (cuesta!).` },
      { h: "Querer, poder + инфинитив", b: `После querer и poder — сразу инфинитив, без предлога:
- [[Quiero aprender español.]] — Я хочу учить испанский.
- [[¿Puedo pasar?]] — Можно пройти?
- [[¿Puedes repetir?]] — Можешь повторить?

! **¿Puedo…?** и **¿Me puede…?** — универсальные вежливые просьбы: ¿Puedo pagar con tarjeta? ¿Me puede ayudar?` }
    ],
    ex: [
      ["¿Qué vas a hacer esta noche?", "Что ты будешь делать сегодня вечером?", "Qué=что|vas a=собираешься|hacer=делать|esta noche=сегодня вечером"],
      ["Voy al cine.", "Я иду в кино.", "Voy=иду (ir)|al=в (a + el)|cine=кино"],
      ["Quiero un helado.", "Я хочу мороженое.", "Quiero=хочу (querer)|un helado=мороженое"],
      ["¿Puedo pasar?", "Можно пройти?", "Puedo=могу (poder)|pasar=пройти"],
      ["Duermo ocho horas.", "Я сплю восемь часов.", "Duermo=сплю (dormir, o→ue)|ocho=восемь|horas=часов"],
      ["Volvemos a casa a las diez.", "Мы возвращаемся домой в десять.", "Volvemos=возвращаемся (без чередования!)|a casa=домой|a las diez=в десять"]
    ],
    warn: [
      ["Quiero a comer", "Quiero comer", "После querer/poder инфинитив без предлога."],
      ["Voy comer (собираюсь)", "Voy a comer", "Конструкция ir A + инфинитив."],
      ["nosotros podemos → puedemos", "podemos", "В nosotros/vosotros чередования нет."]
    ],
    voc: [
      "ir|идти, ехать|ир|v", "querer|хотеть; любить|кэрЭр|v", "poder|мочь|подЭр|v", "pensar|думать|пэнсАр|v", "empezar|начинать|эмпэсАр|v",
      "dormir|спать|дормИр|v", "volver|возвращаться|больбЭр|v", "pasar|проходить; проводить|пасАр|v", "el helado|мороженое|эль элАдо|n.m",
      "esta noche|сегодня вечером|Эста нОчэ|phr", "repetir|повторять|рэпэтИр|v", "ayudar|помогать|айудАр|v"
    ],
    q: [
      ["c", "Yo ___ a la playa. (ir)", ["voy", "vo", "va"], 0, "ir: voy, vas, va, vamos, vais, van."],
      ["c", "Tú ___ un café? (querer)", ["quieres", "queres", "quiere"], 0, "querer: e → ie под ударением."],
      ["c", "Nosotros no ___ venir. (poder)", ["podemos", "puedemos", "pueden"], 0, "В nosotros чередования нет."],
      ["c", "Ellos ___ mucho. (dormir)", ["duermen", "dormen", "durmen"], 0, "dormir: o → ue."],
      ["f", "Mañana voy ___ estudiar.", "a", "ir a + инфинитив.", "предлог"],
      ["f", "¿___ pagar con tarjeta? (Можно мне… — poder)", "Puedo", "poder: yo puedo.", "могу"],
      ["x", "Yo quiero a viajar.", "Yo quiero viajar./Quiero viajar.", "После querer — инфинитив без a."],
      ["s", "Вы в магазине и хотите примерить вещь.", ["¿Puedo probármelo?", "Quiero probar tú.", "Voy probar."], 0, "¿Puedo…? — вежливая просьба «можно…?»"]
    ]
  }
  ]
},
{
  id: "a1u8", city: "Sevilla", scene: "sevilla",
  t: "Еда, бар и ресторан", ti: "En el bar y en el restaurante",
  d: "Заказываем тапас как испанец, читаем меню и просим счёт.",
  lessons: [
  {
    id: "a1u8l1", t: "В баре: тапас и кофе", ti: "En el bar de tapas", tags: ["comida"],
    goal: "Научитесь вежливо заказывать и узнаете, как устроен испанский бар.",
    th: [
      { h: "Как заказать", b: `| Фраза | Оттенок |
| [[Quería un café.]] | Я хотел бы кофе — очень вежливо |
| [[Me pone una caña.]] | Налейте мне пива — разговорно, в Испании |
| [[Para mí, un vino tinto.]] | Мне — красное вино |
| [[¿Me trae la carta?]] | Принесите меню |
| ~~Quiero un café.~~ | «Хочу кофе» — звучит прямолинейно |

? **Quería** (прошедшее время от querer) — смягчённое «я хотел бы». Выучите его как готовую фразу.

Бармен спросит: [[¿Qué le pongo?]] или [[¿Qué va a tomar?]] — Что Вам?` },
      { h: "Кофе по-испански", b: `| Название | Что это |
| [[un café solo]] | эспрессо |
| [[un cortado]] | эспрессо с каплей молока |
| [[un café con leche]] | кофе с молоком (половина на половину) |
| [[un descafeinado]] | кофе без кофеина |
| [[un café americano]] | эспрессо с водой |

Пиво: [[una caña]] — маленький стакан разливного, [[una cerveza]] — бутылка.` },
      { h: "Тапас и счёт", b: `- [[una tapa]] — маленькая порция закуски (в Гранаде часто бесплатно к напитку);
- [[una ración]] — большая порция на компанию;
- популярное: [[tortilla de patatas]] (картофельная тортилья), [[patatas bravas]], [[jamón]], [[croquetas]];
- счёт: [[¿Cuánto es?]] или [[La cuenta, por favor.]]

? В испанских барах обычно платят **в конце**, а не сразу.` }
    ],
    ex: [
      ["Quería un café con leche, por favor.", "Я бы хотел кофе с молоком, пожалуйста.", "Quería=я хотел бы (вежливо)|un café con leche=кофе с молоком|por favor=пожалуйста"],
      ["Para mí, una caña.", "Мне — пиво.", "Para mí=для меня|una caña=маленький стакан разливного пива"],
      ["¿Qué le pongo?", "Что Вам налить?", "Qué=что|le=Вам|pongo=кладу, ставлю (poner)", "Типичный вопрос бармена в Испании."],
      ["Una ración de croquetas.", "Порцию крокетов.", "Una ración=порция|de=(чего)|croquetas=крокеты"],
      ["¿Cuánto es?", "Сколько с меня?", "Cuánto=сколько|es=есть"],
      ["Un vaso de agua, por favor.", "Стакан воды, пожалуйста.", "Un vaso=стакан|de agua=воды|por favor=пожалуйста"]
    ],
    warn: [
      ["Quiero un café (официанту)", "Quería un café / Me pone un café", "quiero звучит требовательно."],
      ["Un café = большая кружка", "Un café (solo) = эспрессо", "Испанский кофе — маленький и крепкий."],
      ["Un vaso de el agua", "Un vaso de agua", "После de (из чего) артикль не нужен."]
    ],
    voc: [
      "quería|я хотел(а) бы|кэрИа|v", "la caña|стакан разливного пива|ла кАнья|n.f", "la cerveza|пиво|ла сэрбЭса|n.f", "el vaso|стакан|эль бАсо|n.m",
      "la tapa|тапа, закуска|ла тАпа|n.f", "la ración|порция|ла расьОн|n.f", "la cuenta|счёт|ла куЭнта|n.f", "la carta|меню; письмо|ла кАрта|n.f",
      "el vino tinto|красное вино|эль бИно тИнто|n.m", "la tortilla|тортилья (омлет с картофелем)|ла тортИйя|n.f", "las patatas|картофель|лас патАтас|n.f.pl", "tomar|брать; пить, есть|томАр|v"
    ],
    q: [
      ["c", "Самый вежливый способ заказать:", ["Quería un té, por favor.", "¡Quiero un té!", "Dame té."], 0, "Quería — смягчённое «я хотел бы»."],
      ["c", "Что принесут, если попросить «un café solo»?", ["эспрессо", "кофе с молоком", "кофе без сахара"], 0, "café solo — чёрный эспрессо."],
      ["c", "«Una caña» — это…", ["маленький стакан разливного пива", "сахарный тростник в меню", "бутылка вина"], 0, "В Испании caña — пиво из-под крана в небольшом стакане."],
      ["f", "Un vaso ___ agua.", "de", "Количество + de + вещество.", "предлог"],
      ["f", "___ mí, una tónica. (Мне…)", "Para", "Para mí — «мне, для меня».", "предлог"],
      ["d", [["Camarero", "¡Buenas! ¿Qué le pongo?", "Добрый день! Что Вам?"]], ["Un cortado, por favor.", "Cortado soy yo.", "De nada, un cortado."], 0, "Достаточно назвать заказ + por favor."],
      ["s", "Вы допили и хотите расплатиться.", ["¿Cuánto es?", "¿Cuántos años?", "¿Qué hora es?"], 0, "¿Cuánto es? — Сколько с меня?"]
    ]
  },
  {
    id: "a1u8l2", t: "В ресторане", ti: "En el restaurante", tags: ["comida"],
    goal: "Разберётесь в испанском меню и проведёте весь ужин на испанском.",
    th: [
      { h: "Menú del día", b: `Днём многие рестораны предлагают **menú del día** — комплексный обед по фиксированной цене:

| Часть | Что это | Пример |
| [[de primero]] | первое | ensalada, gazpacho, paella |
| [[de segundo]] | второе | carne, pescado |
| [[de postre]] | десерт | flan, fruta |
| [[para beber]] | напиток | agua, vino, refresco |

Вечером обычно заказывают **a la carta** — по меню.` },
      { h: "Полезные фразы", b: `- [[Una mesa para dos, por favor.]] — Столик на двоих.
- [[Tengo una reserva a nombre de Ivanov.]] — У меня бронь на имя Иванов.
- [[¿Me trae la carta, por favor?]] — Принесите меню.
- [[¿Qué me recomienda?]] — Что Вы посоветуете?
- [[De primero, quiero…]] / [[Para mí, …]] — На первое я хочу… / Мне…
- [[Soy alérgico a los frutos secos.]] — У меня аллергия на орехи.
- [[La cuenta, por favor.]] — Счёт, пожалуйста.` },
      { h: "Культура", b: `- Ужин в Испании начинается в **21–22 часа**. В 19:00 многие кухни закрыты!
- Чаевые (**la propina**) не обязательны: оставляют мелочь или 5–10%.
- Перед едой: [[¡Que aproveche!]] или [[¡Buen provecho!]] Тост: [[¡Salud!]]` }
    ],
    ex: [
      ["Una mesa para dos, por favor.", "Столик на двоих, пожалуйста.", "Una mesa=столик|para dos=на двоих|por favor=пожалуйста"],
      ["¿Me trae la carta?", "Принесите меню?", "Me=мне|trae=приносите (traer)|la carta=меню"],
      ["De primero quiero la ensalada.", "На первое я хочу салат.", "De primero=на первое|quiero=хочу|la ensalada=салат"],
      ["La cuenta, por favor.", "Счёт, пожалуйста.", "La cuenta=счёт|por favor=пожалуйста"],
      ["Soy alérgico a los frutos secos.", "У меня аллергия на орехи.", "Soy=я есть|alérgico=аллергик|a=на|los frutos secos=орехи, сухофрукты"],
      ["¡Que aproveche!", "Приятного аппетита!", "Que=пусть|aproveche=пойдёт на пользу"]
    ],
    warn: [
      ["La carta (думаете, что это «карта»)", "la carta = меню", "Меню в ресторане — la carta; menú del día — комплексный обед."],
      ["De nada, la cuenta", "La cuenta, por favor", "de nada — ответ на gracias."],
      ["Una mesa por dos", "Una mesa para dos", "«На двоих» — para."]
    ],
    voc: [
      "el camarero|официант|эль камарЭро|n.m", "la mesa|стол, столик|ла мЭса|n.f", "la reserva|бронь|ла рэсЭрба|n.f", "el primero|первое блюдо|эль примЭро|n.m",
      "el segundo|второе блюдо|эль сэгУндо|n.m", "el postre|десерт|эль пОстрэ|n.m", "la carne|мясо|ла кАрнэ|n.f", "el pescado|рыба (блюдо)|эль пэскАдо|n.m",
      "la ensalada|салат|ла энсалАда|n.f", "traer|приносить|траЭр|v", "recomendar|советовать|рэкомэндАр|v", "la propina|чаевые|ла пропИна|n.f"
    ],
    q: [
      ["c", "Что такое «menú del día»?", ["комплексный обед по фиксированной цене", "меню на сегодня с ценами", "список вин"], 0, "Menú del día: первое, второе, десерт и напиток по одной цене."],
      ["c", "«Счёт, пожалуйста»:", ["La cuenta, por favor.", "La carta, por favor.", "El cuento, de nada."], 0, "la cuenta — счёт; la carta — меню; el cuento — сказка!"],
      ["f", "Una mesa ___ cuatro, por favor.", "para", "para + число = на столько-то человек.", "предлог «на»"],
      ["f", "¿Qué me ___? (recomendar, usted)", "recomienda", "recomendar: e → ie — recomienda.", "советовать"],
      ["d", [["Camarero", "Buenas noches. ¿Tienen reserva?", "Добрый вечер. У вас есть бронь?"]], ["No, pero queremos una mesa para dos.", "Sí, tengo hambre.", "No, la cuenta por favor."], 0, "Логичный ответ: брони нет, но нужен столик на двоих."],
      ["s", "Принесли блюда. Что пожелать друзьям?", ["¡Que aproveche!", "¡Buenas noches!", "¡Mucho gusto!"], 0, "¡Que aproveche! — приятного аппетита."],
      ["x", "Una mesa por dos personas.", "Una mesa para dos personas.", "Назначение «на двоих» — para."]
    ]
  }
  ]
},
{
  id: "a1u9", city: "Granada", scene: "granada",
  t: "Описания и семья", ti: "Descripciones y familia",
  d: "Прилагательные, цвета, семья и притяжательные местоимения.",
  lessons: [
  {
    id: "a1u9l1", t: "Прилагательные и цвета", ti: "Los adjetivos", tags: ["adjetivos"],
    goal: "Научитесь согласовывать прилагательные и ставить их на правильное место.",
    th: [
      { h: "Согласование", b: `**На -o** — четыре формы:

| | Ед. ч. | Мн. ч. |
| м.р. | roj**o** | roj**os** |
| ж.р. | roj**a** | roj**as** |

**На -e и согласную** — две формы (одинаково для обоих родов): [[grande]] → grandes, [[azul]] → azules, [[fácil]] → fáciles.

! Национальности на согласную всё же имеют женскую форму: español → **española**, alemán → **alemana**.` },
      { h: "Порядок слов", b: `Обычно прилагательное стоит **после** существительного:
- [[un coche rojo]] — красная машина
- [[una chica simpática]] — милая девушка

Некоторые могут стоять **перед** — и тогда сокращаются:
- bueno → [[un buen amigo]] (хороший друг)
- malo → [[un mal día]] (плохой день)
- grande → [[una gran ciudad]] (великий город; перед сущ. grande = «великий»)

! Цвета и национальности — **всегда после**: una casa blanca, un chico ruso.` },
      { h: "Цвета и группы", b: `| | |
| [[rojo]] — красный | [[verde]] — зелёный |
| [[amarillo]] — жёлтый | [[azul]] — синий, голубой |
| [[negro]] — чёрный | [[blanco]] — белый |
| [[gris]] — серый | [[marrón]] — коричневый |

- Смешанная группа → **мужской род мн. ч.**: [[Juan y Ana son simpáticos.]]
- [[muy]] + прилагательное = «очень»; суффикс **-ísimo** = «очень-очень»: [[guapísimo]], [[riquísimo]].` }
    ],
    ex: [
      ["Un coche rojo.", "Красная машина.", "Un=(артикль)|coche=машина|rojo=красный", "Прилагательное — после существительного."],
      ["Las flores amarillas.", "Жёлтые цветы.", "Las=(артикль мн.)|flores=цветы|amarillas=жёлтые (ж.р. мн.)"],
      ["Las casas son grandes.", "Дома большие.", "Las casas=дома|son=есть|grandes=большие (+s)"],
      ["El cielo es azul.", "Небо голубое.", "El cielo=небо|es=есть|azul=голубой"],
      ["Juan y Ana son simpáticos.", "Хуан и Ана милые.", "Juan y Ana=Хуан и Ана|son=есть|simpáticos=милые (смешанная группа → м.р.)"],
      ["Es un buen amigo.", "Он хороший друг.", "Es=он есть|un=(артикль)|buen=хороший (bueno перед сущ.)|amigo=друг"]
    ],
    warn: [
      ["un rojo coche", "un coche rojo", "Цвет — после существительного."],
      ["un bueno amigo", "un buen amigo", "Перед существительным м.р. bueno → buen."],
      ["las casas grande", "las casas grandes", "Прилагательные согласуются в числе."]
    ],
    voc: [
      "rojo|красный|рОхо|adj", "amarillo|жёлтый|амарИйо|adj", "verde|зелёный|бЭрдэ|adj", "azul|синий, голубой|асУль|adj", "negro|чёрный|нЭгро|adj",
      "blanco|белый|блАнко|adj", "nuevo|новый|нуЭбо|adj", "viejo|старый|бьЕхо|adj", "guapo|красивый (о человеке)|гуАпо|adj", "fácil|лёгкий|фАсиль|adj",
      "difícil|трудный|дифИсиль|adj", "el cielo|небо|эль сьЕло|n.m", "interesante|интересный|интэрэсАнтэ|adj"
    ],
    q: [
      ["c", "Las faldas ___ (красные)", ["rojas", "rojos", "roja"], 0, "faldas — ж.р. мн. ч. → rojas."],
      ["c", "Los libros ___ (новые)", ["nuevos", "nuevas", "nuevo"], 0, "м.р. мн. ч. → nuevos."],
      ["c", "La ciudad es ___ (большой)", ["grande", "granda", "grandes"], 0, "На -e — одна форма в ед. ч."],
      ["c", "Pablo y Marta son ___ (испанцы)", ["españoles", "españolas", "español"], 0, "Смешанная группа → м.р. мн. ч."],
      ["f", "Es un ___ día. (bueno, перед сущ.)", "buen", "bueno → buen перед м.р.", "хороший"],
      ["f", "Los ojos ___ (azul)", "azules", "Согласная → +es.", "голубые"],
      ["x", "Tengo una blanca casa.", "Tengo una casa blanca.", "Цвет — после существительного."],
      ["x", "Las chicas son simpáticos.", "Las chicas son simpáticas.", "chicas — ж.р. мн. ч."]
    ]
  },
  {
    id: "a1u9l2", t: "Семья и притяжательные", ti: "La familia y los posesivos", tags: ["posesivos"],
    goal: "Научитесь говорить о семье и правильно использовать mi, tu, su.",
    th: [
      { h: "Краткие притяжательные (перед существительным)", b: `| | ед. ч. | мн. ч. |
| мой | **mi** | **mis** |
| твой | tu | tus |
| его / её / Ваш / их | **su** | **sus** |
| наш | nuestro / nuestra | nuestros / nuestras |
| ваш (Испания) | vuestro / vuestra | vuestros / vuestras |

- **mi, tu, su** меняются только по числу: [[mi casa]], [[mis amigos]].
- **nuestro, vuestro** меняются и по роду: [[nuestra madre]], [[nuestros hijos]].

! **Без артикля**: ~~la mi casa~~ → **mi casa**.` },
      { h: "Su — «его, её, Ваш, их»", b: `**Su** — одно слово для всех третьих лиц и usted. Если непонятно, уточняют с **de**:

- [[Es su coche.]] — Это его / её / Ваша / их машина.
- [[Es el coche de ella.]] — Это её машина. (уточнение)

В испанском нет слова «свой» — используют обычное притяжательное: «Он любит **свою** жену» = [[Él quiere a su mujer.]]

? Перед человеком-дополнением ставится **a**: quiero **a** mi madre (люблю маму), но quiero un café.` },
      { h: "Семья", b: `| | |
| [[el padre]] / [[la madre]] | отец / мать |
| [[los padres]] | родители |
| [[el hermano]] / [[la hermana]] | брат / сестра |
| [[el marido]] / [[la mujer]] | муж / жена (также el esposo / la esposa) |
| [[el hijo]] / [[la hija]] | сын / дочь |
| [[el abuelo]] / [[la abuela]] | дедушка / бабушка |
| [[el tío]] / [[la tía]] | дядя / тётя |

? В Испании «tío» в разговоре значит ещё и «чувак»: ¡Hola, tío!` }
    ],
    ex: [
      ["Mi madre es profesora.", "Моя мама — учительница.", "Mi=моя|madre=мать|es=есть|profesora=учительница"],
      ["Mis padres viven en Tver.", "Мои родители живут в Твери.", "Mis=мои|padres=родители|viven=живут|en Tver=в Твери"],
      ["Nuestra casa es pequeña.", "Наш дом маленький.", "Nuestra=наша (ж.р.)|casa=дом|es=есть|pequeña=маленький"],
      ["Él quiere mucho a su mujer.", "Он очень любит свою жену.", "Él=он|quiere=любит (querer)|mucho=очень|a=(перед человеком)|su=его (свою)|mujer=жена"],
      ["¿Cómo se llama tu hermana?", "Как зовут твою сестру?", "Cómo=как|se llama=зовётся|tu=твоя|hermana=сестра"],
      ["Es el libro de ella.", "Это её книга.", "Es=это есть|el libro=книга|de ella=её (уточнение вместо su)"]
    ],
    warn: [
      ["la mi casa", "mi casa", "С притяжательным артикль не ставят."],
      ["mi hermanos", "mis hermanos", "Во мн. ч. — mis, tus, sus."],
      ["Quiero mi madre", "Quiero a mi madre", "Перед человеком-дополнением — личное a."]
    ],
    voc: [
      "mi|мой|ми|pron", "tu|твой|ту|pron", "su|его, её, Ваш, их|су|pron", "nuestro|наш|нуЭстро|pron", "la hermana|сестра|ла эрмАна|n.f",
      "el marido|муж|эль марИдо|n.m", "la mujer|жена; женщина|ла мухЭр|n.f", "el hijo|сын|эль Ихо|n.m", "la hija|дочь|ла Иха|n.f",
      "el abuelo|дедушка|эль абуЭло|n.m", "el tío|дядя; (разг.) чувак|эль тИо|n.m", "la madre|мать|ла мАдрэ|n.f", "el padre|отец|эль пАдрэ|n.m"
    ],
    q: [
      ["c", "___ padre es médico. (Мой отец)", ["Mi", "El mi", "Mío"], 0, "mi + существительное, без артикля."],
      ["c", "___ hermanos son altos. (Мои братья)", ["Mis", "Mi", "Los mis"], 0, "Мн. ч. → mis."],
      ["c", "Анна и её брат: «Ana y ___ hermano»", ["su", "sua", "suyo"], 0, "su — для всех третьих лиц."],
      ["c", "___ casa es grande. (наш дом)", ["Nuestra", "Nuestro", "La nuestra"], 0, "casa — ж.р. → nuestra."],
      ["f", "Quiero mucho ___ mi abuela. (личное a)", "a", "Перед человеком-дополнением ставится a.", "предлог"],
      ["f", "___ hijos estudian en Madrid. (их — краткая форма)", "Sus", "su → sus во мн. ч.", "их"],
      ["x", "La mi hermana es rubia.", "Mi hermana es rubia.", "Артикль с притяжательным не нужен."],
      ["x", "Mi amigos son de Perú.", "Mis amigos son de Perú.", "amigos — мн. ч. → mis."]
    ]
  }
  ]
},
{
  id: "a1u10", city: "Salamanca", scene: "salamanca",
  t: "Вкусы и город", ti: "Gustos y la ciudad",
  d: "Глагол gustar, предлоги места и как спросить дорогу.",
  lessons: [
  {
    id: "a1u10l1", t: "Gustar: мне нравится", ti: "Me gusta", tags: ["gustar"],
    goal: "Научитесь говорить о вкусах с gustar и не путать gusta / gustan.",
    th: [
      { h: "Gustar работает «наоборот»", b: `Как и русское «нравится», **gustar** согласуется с тем, **что** нравится, а не с тем, **кому**:

| Кому | | Что нравится |
| [[me]] — мне | **gusta** + ед. ч. / инфинитив | [[Me gusta el café.]] · [[Me gusta leer.]] |
| [[te]] — тебе | **gustan** + мн. ч. | [[Te gustan los perros.]] |
| [[le]] — ему, ей, Вам | | |
| [[nos]] — нам | | |
| [[os]] — вам | | |
| [[les]] — им, вам | | |

! Не ~~yo gusto~~ — это значило бы «я нравлюсь».` },
      { h: "A mí, a ti… — для акцента и ясности", b: `- [[A mí me gusta el té, ¿y a ti?]] — Мне нравится чай, а тебе?
- [[A Ana le gusta bailar.]] — Ане нравится танцевать.
- [[A ellos les gustan las películas.]] — Им нравятся фильмы.

Ответы-согласия:
| | Согласие | Несогласие |
| Me gusta. | [[A mí también.]] — Мне тоже. | [[A mí no.]] — А мне нет. |
| No me gusta. | [[A mí tampoco.]] — Мне тоже нет. | [[A mí sí.]] — А мне да. |` },
      { h: "Глаголы как gustar", b: `- [[encantar]] — очень нравиться: [[Me encanta España.]] (без muy!)
- [[interesar]] — интересовать: [[Me interesa la historia.]]
- [[doler]] — болеть: [[Me duele la cabeza.]] · [[Me duelen los pies.]]` }
    ],
    ex: [
      ["Me gusta el chocolate.", "Мне нравится шоколад.", "Me=мне|gusta=нравится|el chocolate=шоколад"],
      ["Me gustan los gatos.", "Мне нравятся кошки.", "Me=мне|gustan=нравятся (мн.)|los gatos=кошки"],
      ["¿Te gusta bailar?", "Тебе нравится танцевать?", "Te=тебе|gusta=нравится|bailar=танцевать"],
      ["A mi hermano no le gusta el fútbol.", "Моему брату не нравится футбол.", "A mi hermano=моему брату|no=не|le=ему|gusta=нравится|el fútbol=футбол"],
      ["Me encanta la paella.", "Я обожаю паэлью.", "Me=мне|encanta=очень нравится|la paella=паэлья"],
      ["A mí también.", "Мне тоже.", "A mí=мне|también=тоже"]
    ],
    warn: [
      ["Yo gusto el café", "Me gusta el café", "Gustar: «кофе нравится мне»."],
      ["Me gusta los perros", "Me gustan los perros", "Мн. ч. того, что нравится → gustan."],
      ["Me encanta mucho", "Me encanta", "encantar уже значит «очень нравится»."]
    ],
    voc: [
      "gustar|нравиться|густАр|v", "encantar|очень нравиться|энкантАр|v", "interesar|интересовать|интэрэсАр|v", "doler|болеть|долЭр|v",
      "bailar|танцевать|байлАр|v", "el gato|кот, кошка|эль гАто|n.m", "el fútbol|футбол|эль фУтболь|n.m", "tampoco|тоже не|тампОко|adv",
      "la película|фильм|ла пэлИкула|n.f", "el chocolate|шоколад|эль чоколАтэ|n.m", "el pie|нога (стопа)|эль пьЕ|n.m"
    ],
    q: [
      ["c", "Me ___ las películas de terror.", ["gustan", "gusta", "gusto"], 0, "películas — мн. ч. → gustan."],
      ["c", "A nosotros ___ gusta viajar.", ["nos", "les", "os"], 0, "a nosotros → nos."],
      ["c", "— No me gusta el café. — «Мне тоже нет»:", ["A mí tampoco.", "A mí también.", "Yo no gusto."], 0, "Согласие с отрицанием — tampoco."],
      ["c", "«У меня болят ноги»:", ["Me duelen los pies.", "Me duele los pies.", "Tengo dolor pies."], 0, "doler как gustar: мн. ч. → duelen."],
      ["f", "¿A ti te ___ cocinar? (gustar)", "gusta", "Инфинитив → ед. ч.: gusta.", "нравиться"],
      ["f", "A mis padres ___ gusta el campo.", "les", "a ellos/a mis padres → les.", "кому"],
      ["x", "Yo gusto la música.", "Me gusta la música./A mí me gusta la música.", "Gustar строится как «нравиться»."],
      ["d", [["Lucía", "Me encanta el flamenco. ¿Y a ti?", "Я обожаю фламенко. А тебе?"]], ["A mí también.", "Yo también gusto.", "A mí tampoco."], 0, "Согласие с утверждением — también."]
    ]
  },
  {
    id: "a1u10l2", t: "Предлоги места и дорога", ti: "¿Dónde está…?", tags: ["preposiciones"],
    goal: "Научитесь использовать en, a, de и спрашивать и объяснять дорогу.",
    th: [
      { h: "en, a, de", b: `| Предлог | Значение | Пример |
| **en** | в, на (где?) | [[Estoy en Madrid.]] · [[en la mesa]] · [[en tren]] |
| **a** | в, на, к (куда?) | [[Voy a Madrid.]] · [[Voy al banco.]] |
| **de** | из, от (откуда?); чей | [[Vengo de Sevilla.]] · [[la casa de Ana]] |

! Русское «в» = **en** (где) или **a** (куда). «Я в Мадриде» — **en** Madrid; «Я еду в Мадрид» — **a** Madrid.

Транспорт: [[en coche]], [[en tren]], [[en avión]], но [[a pie]] — пешком.` },
      { h: "Где находится?", b: `| | |
| [[cerca de]] — рядом с | [[lejos de]] — далеко от |
| [[al lado de]] — рядом с, около | [[enfrente de]] — напротив |
| [[delante de]] — перед | [[detrás de]] — за, позади |
| [[encima de]] — на, сверху | [[debajo de]] — под |
| [[entre]] — между | [[dentro de]] — внутри |

С артиклем el — слияние: cerca **del** museo, al lado **del** banco.` },
      { h: "Как спросить дорогу", b: `- [[Perdone, ¿dónde está la estación?]] — Извините, где вокзал?
- [[¿Hay una farmacia por aquí?]] — Здесь поблизости есть аптека?
- [[¿Está lejos?]] — Это далеко?

Ответы (вежливая форма):
- [[Siga todo recto.]] — Идите прямо.
- [[Gire a la derecha / a la izquierda.]] — Поверните направо / налево.
- [[Tome la primera calle a la izquierda.]] — Сверните на первую улицу налево.
- [[Está a cinco minutos.]] — Это в пяти минутах.` }
    ],
    ex: [
      ["El museo está cerca de la plaza.", "Музей рядом с площадью.", "El museo=музей|está=находится|cerca de=рядом с|la plaza=площадь"],
      ["Las llaves están encima de la mesa.", "Ключи на столе.", "Las llaves=ключи|están=находятся|encima de=на, сверху|la mesa=стол"],
      ["Vengo del centro.", "Я иду из центра.", "Vengo=прихожу, иду (venir)|del=из (de + el)|centro=центр"],
      ["El banco está enfrente del hotel.", "Банк напротив отеля.", "El banco=банк|está=находится|enfrente del=напротив (de + el)|hotel=отель"],
      ["Perdone, ¿dónde está la farmacia?", "Извините, где аптека?", "Perdone=извините (вежл.)|dónde=где|está=находится|la farmacia=аптека"],
      ["Siga todo recto y gire a la derecha.", "Идите прямо и поверните направо.", "Siga=следуйте (seguir)|todo recto=прямо|y=и|gire=поверните (girar)|a la derecha=направо"]
    ],
    warn: [
      ["Voy en Madrid", "Voy a Madrid", "Направление — a."],
      ["Estoy a Madrid", "Estoy en Madrid", "Местонахождение — en."],
      ["cerca de el museo", "cerca del museo", "de + el = del."]
    ],
    voc: [
      "en|в, на|эн|prep", "a|в, к (направление)|а|prep", "cerca de|рядом с|сЭрка дэ|phr", "lejos|далеко|лЕхос|adv", "al lado de|рядом с|аль лАдо дэ|phr",
      "enfrente de|напротив|энфрЭнтэ дэ|phr", "la derecha|право, правая сторона|ла дэрЭча|n.f", "la izquierda|лево, левая сторона|ла искьЕрда|n.f",
      "todo recto|прямо|тОдо рЭкто|phr", "la farmacia|аптека|ла фармАсья|n.f", "la llave|ключ|ла йАбэ|n.f", "venir|приходить|бэнИр|v", "el centro|центр|эль сЭнтро|n.m"
    ],
    q: [
      ["c", "Vivo ___ Barcelona.", ["en", "a", "de"], 0, "Где? → en."],
      ["c", "Mañana voy ___ Bilbao.", ["a", "en", "de"], 0, "Куда? → a."],
      ["c", "Voy al trabajo ___ pie.", ["a", "en", "con"], 0, "Пешком — a pie. Но en coche, en tren."],
      ["c", "El gato está ___ la mesa. (под столом)", ["debajo de", "encima de", "delante de"], 0, "debajo de — под."],
      ["f", "La farmacia está al lado ___ banco. (de + el)", "del", "de + el = del.", "предлог + артикль"],
      ["f", "Gire a la ___. (направо)", "derecha", "a la derecha — направо, a la izquierda — налево.", "направо"],
      ["s", "Прохожий говорит: «Siga todo recto y gire a la izquierda». Куда идти?", ["Прямо, затем налево", "Направо, затем прямо", "Налево, затем направо"], 0, "todo recto — прямо, izquierda — налево."],
      ["x", "Estoy a casa.", "Estoy en casa.", "Где? → en casa (дома). Куда? → a casa (домой)."]
    ]
  }
  ]
}
]);
