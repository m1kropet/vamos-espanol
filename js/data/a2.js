/* Курс A2 (испанский, начало) и план уровней B1–C1. Формат описан в a1-part1.js */
IT.addUnits("A2", [
{
  id: "a2u1", city: "Ciudad de México", scene: "mexico",
  t: "Прошедшее время", ti: "El pasado",
  d: "Pretérito perfecto и pretérito indefinido: как рассказать, что произошло, — и чем Испания отличается от Мексики.",
  lessons: [
  {
    id: "a2u1l1", t: "Pretérito perfecto: he comido", ti: "Pretérito perfecto", tags: ["pasado"],
    goal: "Научитесь говорить о недавних событиях и опыте с помощью haber + причастие.",
    th: [
      { h: "Как образуется", b: `**Pretérito perfecto** = **haber** в настоящем + **причастие**:

| | haber | + причастие |
| yo | **he** | hablado |
| tú | **has** | comido |
| él / ella / usted | **ha** | vivido |
| nosotros | **hemos** | |
| vosotros | **habéis** | |
| ellos / ustedes | **han** | |

Причастие: **-ar → -ado** (hablado), **-er / -ir → -ido** (comido, vivido).

! Причастие **никогда не меняется** и не отрывается от haber: [[Hoy he comido paella.]]` },
      { h: "Неправильные причастия", b: `| Инфинитив | Причастие |
| hacer | [[hecho]] |
| ver | [[visto]] |
| decir | [[dicho]] |
| escribir | [[escrito]] |
| poner | [[puesto]] |
| volver | [[vuelto]] |
| abrir | [[abierto]] |
| romper | [[roto]] |` },
      { h: "Когда использовать", b: `Pretérito perfecto связывает прошлое с настоящим:
- период, который **ещё не закончился**: [[hoy]], [[esta mañana]], [[esta semana]], [[este año]];
- **опыт** в жизни: [[¿Has estado en México?]] — Ты бывал в Мексике?
- с [[ya]] (уже), [[todavía no]] (ещё не), [[nunca]] (никогда).

? В **Испании** это время очень частое: [[Hoy he trabajado mucho.]] В **Мексике и большей части Латинской Америки** в таких фразах чаще говорят pretérito indefinido: *Hoy trabajé mucho*. Обе версии правильные — следующий урок!` }
    ],
    ex: [
      ["Hoy he comido paella.", "Сегодня я ел паэлью.", "Hoy=сегодня|he=(вспом. haber, yo)|comido=съеденный (comer)|paella=паэлья"],
      ["¿Has visto la película?", "Ты посмотрел фильм?", "Has=(haber, tú)|visto=увиденный (ver, неправ.)|la película=фильм"],
      ["Esta semana hemos trabajado mucho.", "На этой неделе мы много работали.", "Esta semana=на этой неделе|hemos=(haber, nosotros)|trabajado=работавший|mucho=много"],
      ["¿Qué has hecho hoy?", "Что ты сделал сегодня?", "Qué=что|has=(haber)|hecho=сделанный (hacer)|hoy=сегодня"],
      ["Nunca he estado en México.", "Я никогда не был в Мексике.", "Nunca=никогда|he=(haber)|estado=бывший (estar)|en México=в Мексике"],
      ["Todavía no he terminado.", "Я ещё не закончил.", "Todavía no=ещё не|he=(haber)|terminado=законченный"]
    ],
    warn: [
      ["Yo comido", "He comido", "Нужен вспомогательный haber."],
      ["He hacido", "He hecho", "hacer → hecho (неправильное)."],
      ["He ya comido", "Ya he comido", "Между haber и причастием ничего не ставят."]
    ],
    voc: [
      "haber|(вспом. глагол) иметь|абЭр|v", "hecho|сделанный (hacer)|Эчо|v", "visto|увиденный (ver)|бИсто|v", "dicho|сказанный (decir)|дИчо|v",
      "escrito|написанный (escribir)|эскрИто|v", "ya|уже|йа|adv", "todavía|ещё|тодабИа|adv", "nunca|никогда|нУнка|adv", "la semana|неделя|ла сэмАна|n.f",
      "terminar|заканчивать|тэрминАр|v", "decir|говорить, сказать|дэсИр|v", "volver|возвращаться|больбЭр|v"
    ],
    q: [
      ["c", "Hoy yo ___ la tele. (ver)", ["he visto", "he vido", "ha visto"], 0, "ver → visto; yo → he."],
      ["c", "Причастие от «escribir»:", ["escrito", "escribido", "escribado"], 0, "escribir → escrito."],
      ["c", "Nosotros ___ mucho este año. (viajar)", ["hemos viajado", "habemos viajado", "hemos viajados"], 0, "nosotros → hemos; причастие не меняется."],
      ["c", "«Ты бывал в Испании?»", ["¿Has estado en España?", "¿Has sido en España?", "¿Estás estado en España?"], 0, "Опыт — pretérito perfecto; «бывать где-то» — estar."],
      ["f", "Ya ___ comido. (yo)", "he", "yo → he.", "вспом. глагол"],
      ["f", "¿Quién ha ___ la ventana? (abrir)", "abierto", "abrir → abierto.", "причастие"],
      ["x", "Hoy he hacido los deberes.", "Hoy he hecho los deberes.", "hacer → hecho."],
      ["x", "He ya visto esa película.", "Ya he visto esa película.", "ya ставится перед haber."]
    ]
  },
  {
    id: "a2u1l2", t: "Pretérito indefinido: hablé, comí", ti: "Pretérito indefinido", tags: ["pasado"],
    goal: "Научитесь рассказывать о законченных событиях в прошлом и выберете между perfecto и indefinido.",
    th: [
      { h: "Правильные глаголы", b: `| | hablar | comer | vivir |
| yo | habl**é** | com**í** | viv**í** |
| tú | habl**aste** | com**iste** | viv**iste** |
| él / ella | habl**ó** | com**ió** | viv**ió** |
| nosotros | habl**amos** | com**imos** | viv**imos** |
| vosotros | habl**asteis** | com**isteis** | viv**isteis** |
| ellos | habl**aron** | com**ieron** | viv**ieron** |

! Ударение на окончании решает всё: **hablo** (я говорю) — **habló** (он сказал).` },
      { h: "Ser и ir — одинаковые формы", b: `| yo | tú | él | nosotros | vosotros | ellos |
| **fui** | **fuiste** | **fue** | **fuimos** | **fuisteis** | **fueron** |

- [[Ayer fui al cine.]] — Вчера я ходил в кино. (ir)
- [[Fue un día increíble.]] — Это был невероятный день. (ser)

Смысл понятен из контекста. Ещё частые: hacer → **hice, hizo**; tener → **tuve**; estar → **estuve**.` },
      { h: "Perfecto или indefinido?", b: `| Pretérito perfecto | Pretérito indefinido |
| период ещё идёт: hoy, esta semana, este año | период закончился: [[ayer]], [[el año pasado]], [[en 2020]], [[hace dos días]] |
| [[Hoy he visto a Juan.]] | [[Ayer vi a Juan.]] |
| опыт: ¿Has estado en Cuba? | конкретный момент: Estuve en Cuba en 2019. |

? **Латинская Америка**: indefinido используется гораздо шире — даже с hoy: *Hoy vi a Juan*. Если учите мексиканский или аргентинский испанский, это нормально.` }
    ],
    ex: [
      ["Ayer hablé con mi madre.", "Вчера я поговорил с мамой.", "Ayer=вчера|hablé=я поговорил (hablar)|con=с|mi madre=моей мамой"],
      ["El año pasado viajamos a México.", "В прошлом году мы ездили в Мексику.", "El año pasado=в прошлом году|viajamos=мы ездили|a México=в Мексику"],
      ["¿Qué comiste anoche?", "Что ты ел вчера вечером?", "Qué=что|comiste=ты ел (comer)|anoche=вчера вечером"],
      ["Fui a la playa con mis amigos.", "Я ездил на пляж с друзьями.", "Fui=я ездил (ir)|a la playa=на пляж|con=с|mis amigos=моими друзьями"],
      ["Fue un viaje fantástico.", "Это было фантастическое путешествие.", "Fue=было (ser)|un viaje=путешествие|fantástico=фантастическое"],
      ["Vivieron en Lima dos años.", "Они прожили в Лиме два года.", "Vivieron=они прожили|en Lima=в Лиме|dos años=два года"]
    ],
    warn: [
      ["Ayer he comido paella (в Испании)", "Ayer comí paella", "С ayer (законченный период) — indefinido."],
      ["Yo hablo ayer", "Yo hablé ayer", "Ударение на окончании: hablé — прошедшее."],
      ["Ayer yo fue", "Ayer yo fui", "yo → fui, él → fue."]
    ],
    voc: [
      "ayer|вчера|айЕр|adv", "anoche|вчера вечером|анОчэ|adv", "pasado|прошлый|пасАдо|adj", "hace|назад (hace dos días)|Асэ|adv", "la playa|пляж|ла плАйа|n.f",
      "el viaje|путешествие|эль бьЯхэ|n.m", "fui|я был; я ходил|фуИ|v", "fue|он был; он ходил|фуЭ|v", "increíble|невероятный|инкрэИблэ|adj", "anteayer|позавчера|антэайЕр|adv"
    ],
    q: [
      ["c", "Ayer yo ___ con Pedro. (hablar)", ["hablé", "hablo", "habló"], 0, "yo → -é (со знаком)."],
      ["c", "Ella ___ una carta. (escribir)", ["escribió", "escribí", "escribe"], 0, "-ir: él/ella → -ió."],
      ["c", "Ellos ___ al museo. (ir)", ["fueron", "fuimos", "iban"], 0, "ir: ellos fueron."],
      ["c", "«В прошлом году я был в Испании» (Испания):", ["El año pasado estuve en España.", "El año pasado he estado en España."], 0, "Законченный период → indefinido."],
      ["f", "¿Qué ___ anoche? (hacer, tú)", "hiciste", "hacer: hice, hiciste, hizo…", "делать, «ты»"],
      ["f", "Nosotros ___ a las ocho. (salir)", "salimos", "-ir: nosotros salimos (совпадает с настоящим).", "выходить"],
      ["x", "Ayer he ido al médico.", "Ayer fui al médico.", "С ayer — pretérito indefinido."],
      ["x", "Anoche yo fue a una fiesta.", "Anoche fui a una fiesta./Anoche yo fui a una fiesta.", "yo → fui."]
    ]
  }
  ]
},
{
  id: "a2u2", city: "Buenos Aires", scene: "buenosaires",
  t: "Распорядок дня и планы", ti: "La rutina y los planes",
  d: "Возвратные глаголы и будущее время. Знакомимся с аргентинским voseo.",
  lessons: [
  {
    id: "a2u2l1", t: "Возвратные глаголы", ti: "Verbos reflexivos", tags: ["reflexivos"],
    goal: "Научитесь рассказывать о своём дне с помощью возвратных глаголов.",
    th: [
      { h: "Частица перед глаголом", b: `Возвратные глаголы — аналог русских глаголов на **-ся**. Инфинитив оканчивается на **-se**: levantar**se** (вставать), duchar**se** (принимать душ).

| Лицо | Частица | levantarse |
| yo | **me** | [[me levanto]] |
| tú | **te** | [[te levantas]] |
| él / ella / usted | **se** | [[se levanta]] |
| nosotros | **nos** | [[nos levantamos]] |
| vosotros | **os** | [[os levantáis]] |
| ellos / ustedes | **se** | [[se levantan]] |

! Частица стоит **перед** спрягаемым глаголом, но **приклеивается** к инфинитиву: [[Me voy a duchar.]] = [[Voy a ducharme.]]` },
      { h: "Мой день", b: `| | |
| [[despertarse]] (e→ie) | просыпаться |
| [[levantarse]] | вставать |
| [[ducharse]] | принимать душ |
| [[vestirse]] (e→i) | одеваться |
| [[lavarse los dientes]] | чистить зубы |
| [[acostarse]] (o→ue) | ложиться спать |
| [[llamarse]] | зваться |

Без частицы смысл меняется: **levanto** la mano — я поднимаю руку; **me levanto** — я встаю. С частями тела — артикль, а не притяжательное: [[Me lavo las manos.]]` },
      { h: "Аргентина: voseo", b: `В Аргентине и Уругвае вместо **tú** говорят **vos**, и формы глагола другие:

| tú (Испания, Мексика) | vos (Аргентина) |
| [[tú eres]] | [[vos sos]] |
| [[tú tienes]] | [[vos tenés]] |
| [[tú quieres]] | [[vos querés]] |
| [[¿Cómo te llamas?]] | [[¿Cómo te llamás?]] |

Ударение в формах vos — на окончание. Вам не нужно так говорить, но понимать — очень полезно (кино, песни, сериалы!).` }
    ],
    ex: [
      ["Me despierto a las siete.", "Я просыпаюсь в семь.", "Me=себя|despierto=бужу (despertar, e→ie)|a las siete=в семь"],
      ["¿A qué hora te levantas?", "Во сколько ты встаёшь?", "A qué hora=во сколько|te=себя|levantas=поднимаешь"],
      ["Él se ducha por la mañana.", "Он принимает душ утром.", "Él=он|se=себя|ducha=купает под душем|por la mañana=утром"],
      ["Nos acostamos tarde.", "Мы ложимся спать поздно.", "Nos=себя (мы)|acostamos=укладываем|tarde=поздно"],
      ["Me lavo los dientes.", "Я чищу зубы.", "Me=себе|lavo=мою|los dientes=зубы", "С частями тела — артикль los, а не mis."],
      ["Vos sos de Buenos Aires, ¿no?", "Ты ведь из Буэнос-Айреса?", "Vos=ты (Аргентина)|sos=есть (= eres)|de=из|Buenos Aires=Буэнос-Айрес|no=не так ли"]
    ],
    warn: [
      ["Yo levanto a las 7", "Me levanto a las 7", "Без me — «я поднимаю (что-то)»."],
      ["Me lavo mis manos", "Me lavo las manos", "С частями тела — артикль."],
      ["Nos se levantamos", "Nos levantamos", "Одна частица на лицо: nos."]
    ],
    voc: [
      "despertarse|просыпаться|дэспэртАрсэ|v", "levantarse|вставать|лэбантАрсэ|v", "ducharse|принимать душ|дучАрсэ|v", "vestirse|одеваться|бэстИрсэ|v",
      "acostarse|ложиться спать|акостАрсэ|v", "el diente|зуб|эль дьЕнтэ|n.m", "tarde|поздно|тАрдэ|adv", "temprano|рано|тэмпрАно|adv",
      "normalmente|обычно|нормальмЭнтэ|adv", "siempre|всегда|сьЕмпрэ|adv", "vos|ты (Аргентина)|бос|pron"
    ],
    q: [
      ["c", "Nosotros ___ a las ocho. (levantarse)", ["nos levantamos", "se levantamos", "os levantamos"], 0, "nosotros → nos."],
      ["c", "Ellos ___ temprano. (despertarse)", ["se despiertan", "se despertan", "nos despiertan"], 0, "ellos → se; e → ie."],
      ["c", "¿Tú ___ tarde? (acostarse)", ["te acuestas", "te acostas", "se acuesta"], 0, "acostarse: o → ue."],
      ["c", "«Ты из Аргентины?» по-аргентински:", ["¿Vos sos de Argentina?", "¿Vos eres de Argentina?", "¿Tú sos de Argentina?"], 0, "vos + sos (= tú eres)."],
      ["f", "Yo ___ ducho por la noche.", "me", "yo → me.", "возвратная частица"],
      ["f", "Voy a ___ ahora. (vestirse, yo — частица в конце)", "vestirme", "С инфинитивом частица приклеивается: vestirme.", "одеваться"],
      ["x", "Me lavo mis dientes.", "Me lavo los dientes.", "С частями тела — артикль."],
      ["x", "Yo levanto a las seis.", "Me levanto a las seis.", "Вставать — levantarse."]
    ]
  },
  {
    id: "a2u2l2", t: "Будущее: ir a и futuro simple", ti: "El futuro", tags: ["futuro"],
    goal: "Научитесь говорить о планах двумя способами и делать предположения.",
    th: [
      { h: "Ir a + инфинитив — планы", b: `Самый частый способ в разговоре: **ir a + инфинитив** («собираюсь»):
- [[Voy a estudiar medicina.]] — Я собираюсь изучать медицину.
- [[¿Qué vais a hacer el sábado?]] — Что вы будете делать в субботу?
- [[Va a llover.]] — Сейчас пойдёт дождь.` },
      { h: "Futuro simple", b: `Окончания добавляются **к целому инфинитиву** — одни и те же для -ar, -er, -ir:

| | hablar | comer | vivir |
| yo | hablar**é** | comer**é** | vivir**é** |
| tú | hablar**ás** | comer**ás** | vivir**ás** |
| él | hablar**á** | comer**á** | vivir**á** |
| nosotros | hablar**emos** | comer**emos** | vivir**emos** |
| vosotros | hablar**éis** | comer**éis** | vivir**éis** |
| ellos | hablar**án** | comer**án** | vivir**án** |` },
      { h: "Неправильные основы и предположения", b: `| Инфинитив | Будущее (yo) |
| tener | [[tendré]] |
| hacer | [[haré]] |
| poder | [[podré]] |
| salir | [[saldré]] |
| decir | [[diré]] |
| venir | [[vendré]] |
| querer | [[querré]] |
| saber | [[sabré]] |

**Предположение о настоящем**: [[¿Dónde está Juan? Estará en casa.]] — Где Хуан? Наверное, дома. [[Tendrá unos treinta años.]] — Ему, наверное, около тридцати.` }
    ],
    ex: [
      ["Mañana voy a trabajar en casa.", "Завтра я буду работать дома.", "Mañana=завтра|voy a=собираюсь|trabajar=работать|en casa=дома"],
      ["El año que viene estudiaré alemán.", "В следующем году я буду учить немецкий.", "El año que viene=в следующем году|estudiaré=буду учить|alemán=немецкий"],
      ["Será un día bonito.", "Будет прекрасный день.", "Será=будет (ser)|un día=день|bonito=прекрасный"],
      ["¿Qué harás en verano?", "Что ты будешь делать летом?", "Qué=что|harás=будешь делать (hacer)|en verano=летом"],
      ["Tendré más tiempo en julio.", "В июле у меня будет больше времени.", "Tendré=у меня будет (tener)|más=больше|tiempo=времени|en julio=в июле"],
      ["¿Qué hora es? Serán las diez.", "Который час? Наверное, около десяти.", "Qué hora es=который час|Serán=будут (предположение)|las diez=десять", "Futuro выражает предположение."]
    ],
    warn: [
      ["teneré", "tendré", "tener → tendr-."],
      ["haceré", "haré", "hacer → har-."],
      ["Voy comer", "Voy a comer", "ir A + инфинитив."]
    ],
    voc: [
      "el futuro|будущее|эль футУро|n.m", "el verano|лето|эль бэрАно|n.m", "el tiempo|время; погода|эль тьЕмпо|n.m", "llover|идти (о дожде)|йобЭр|v",
      "tendré|у меня будет|тэндрЭ|v", "haré|я сделаю|арЭ|v", "que viene|следующий (el año que viene)|кэ бьЕнэ|phr", "quizás|может быть|кисАс|adv", "el plan|план|эль план|n.m"
    ],
    q: [
      ["c", "Yo ___ mañana. (hablar, futuro)", ["hablaré", "hablré", "hablaría"], 0, "Инфинитив + -é."],
      ["c", "Nosotros ___ tiempo. (tener)", ["tendremos", "teneremos", "tenremos"], 0, "tener → tendr-."],
      ["c", "Ellos ___ a Perú. (ir a + viajar)", ["van a viajar", "van viajar", "vayan a viajar"], 0, "ir a + инфинитив."],
      ["c", "Звонят в дверь в 22:00: «Кто бы это мог быть?»", ["¿Quién será?", "¿Quién fue?", "¿Quién es estado?"], 0, "Futuro = предположение."],
      ["f", "¿Qué ___ el domingo? (hacer, tú)", "harás", "hacer → har-: harás.", "будущее"],
      ["f", "El mes que viene yo ___ a Madrid. (venir)", "vendré", "venir → vendr-.", "будущее"],
      ["x", "Mañana yo haceré la compra.", "Mañana yo haré la compra./Mañana haré la compra.", "hacer → haré."],
      ["x", "Esta noche voy salir.", "Esta noche voy a salir.", "ir a + инфинитив."]
    ]
  }
  ]
}
]);

/* Дорожная карта следующих уровней. Чтобы добавить уроки — вызовите IT.addUnits("B1", [...]) в новом файле данных. */
IT.roadmap = {
  A2: ["Pretérito imperfecto: описание прошлого", "Сравнения и превосходная степень", "Местоимения-дополнения (lo, la, le)", "Por и para", "Покупки и одежда", "У врача", "Imperativo: просьбы и инструкции"],
  B1: ["Subjuntivo presente", "Condicional: вежливость и советы", "Pluscuamperfecto", "Относительные местоимения", "Работа и собеседование", "Испанское кино и музыка"],
  B2: ["Subjuntivo imperfecto", "Условные предложения (si tuviera…)", "Пассив и se impersonal", "Дискурсивные маркеры", "СМИ и новости", "Региональные варианты испанского"],
  C1: ["Перифразы и аспектуальность", "Идиомы и фразеология", "Регистры: формальный и разговорный", "Аргументация и эссе", "Литература: Сервантес, Гарсиа Маркес", "Профессиональное общение"]
};
