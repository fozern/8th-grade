(function () {
  const STORAGE_KEY = "core-es-v2";
  const OLD_KEY = "sule-aile-hub-v1";
  const SITE = "8th grade CORE - ES";
  const HADITH =
    "Amellerin Allah’a en sevimli olanı, az da olsa devamlı (istikrarlı) olanıdır.";
  const CATEGORIES = ["Market", "Fatura", "Sağlık", "Ulaşım", "Hediye", "Yemek", "Diğer"];
  const WEEKS = fridaysUntilDec();
  const MUFREDAT_TOPICS = [
    "What is Belief in Destiny and What Are Its Benefits?",
    "What is Free Will? How Does Free Will Relate to God’s Will?",
    "What is Hereafter (The Reckoning, Hell, Paradise), Belief in Hereafter",
    "If everything about our lives are preset, what is our role?",
    "Tafsir of Ayat al Kursi",
    "The Life of Prophet Ismail and Eid Al Adha",
    "Hajj, Umrah, & Prophet Abraham",
    "What is Zakat and Sadaqa",
    "Ihsan, Goodness, Charity and Surah Al Maun",
    "Do we need religion to build ethics and moral values? Why do we need rituals?",
    "Tafsir of Surah Al Kawthar & An Nasr",
    "Aspects of Prophet Muhammad’s Life",
    "Prophet’s Sense of Justice",
    "The Prophet’s Mercy and Tolerance",
    "The Way The Prophet (PBUH) Worshipped Allah",
    "Prophet’s Courage and Determination in his Mission",
    "Importance of Reading the Qur’an",
    "List of Prophets Named in the Qur’an",
    "Wahiy, Khatm, Juz, Tafsir, Ayah, Surah",
    "The Miraculousness of the Qur’an",
    "Social Interactions",
    "Being Trustworthy and Being Responsible",
    "Respecting Parents is Very Important in Islam",
    "Why do we need to consume Halal food?",
    "Halal-Haram Sensitivity",
    "Balancing Gender Interactions",
  ];

  const I18N = {
    tr: {
      tag: "istişare · cetele · gündem",
      home: "Home",
      istisare: "İstişare notları",
      mentor: "Mentor Cetele",
      agenda: "Gündemler",
      upcoming: "Upcoming",
      ideas: "Ideas",
      family: "Aile",
      events: "Etkinlikler",
      ledger: "Cetele",
      thisWeek: "Bu hafta",
      weekGoal: "Bu haftanın goal'ü",
      pinHere: "buraya pinle…",
      notesHere: "notlarını buraya yaz…",
      emptyList: "henüz yok — ekle.",
      add: "Ekle",
      save: "Kaydet",
      cancel: "Vazgeç",
      delete: "Sil",
      addEvent: "Etkinlik ekle",
      addRow: "Satır ekle",
      exportCsv: "Excel'e aktar",
      importCsv: "Excel'den al",
      search: "Ara…",
      title: "Başlık",
      date: "Tarih",
      time: "Saat",
      who: "Kim",
      place: "Yer",
      notes: "Not",
      desc: "Açıklama",
      category: "Kategori",
      amount: "Tutar",
      type: "Tür",
      income: "Gelir",
      expense: "Gider",
      incomeTotal: "Gelir",
      expenseTotal: "Gider",
      balance: "Bakiye",
      allFamily: "Tüm aile",
      herPage: "sayfası",
      open: "Aç",
      byCategory: "Kategori",
      byMonth: "Aylar",
      emptyEvents: "etkinlik yok.",
      emptyLedger: "satır yok.",
      workOn: "Upcoming — çalışmamız gerekenler",
      ideaPrompt: "bir idea yaz…",
      agendaPrompt: "gündem ekle…",
      workPrompt: "çalışılacak şey…",
      doneOf: "haftalık goal",
      contacts: "Rehber",
      student: "Öğrenci",
      parent: "Veli (Anne)",
      phone: "Telefon",
      addStudent: "Satır ekle",
      groupOf: "grubu",
      fillLater: "sonra doldur",
      homeschool: "Afterschool",
      kuran: "Kuran dersi alıyor mu",
      coming: "geliyor ✿",
      yes: "evet",
      no: "hayır",
      unset: "?",
      todayBtn: "Bugün",
      addEvent: "Etkinlik ekle",
      dayEvents: "Günün gündemi",
      calNotes: "Notlar",
      notePrompt: "gündem notu yaz…",
      pinNote: "Pin",
      tbd: "Tarihi yok / TBD",
      whoGirls: "Girls",
      whoAblalar: "Ablalar",
      whoAbiler: "Abiler",
      whoGenel: "Genel",
      endDate: "Bitiş",
      noDayEvents: "bu günde henüz yok — ekle.",
      mufredat: "Müfredat",
      sohbet: "Sohbet programı",
      thisSohbet: "Bu haftanın sohbeti",
      afterschoolComing: "Afterschool'a gelenler",
      weekN: "Hafta",
      sohbetNotes: "Sohbet notları",
      sohbetPrompt: "buraya yaz, sonra değiştir…",
      extraPrompt: "kısa not ekle…",
      sohbetTitle: "sohbet başlığı…",
      saved: "kaydedildi ✓",
      copyVeli: "Veli linkini kopyala",
      veliLinkNote: "Veli ziyareti linki",
      satEvery: "her Cumartesi",
      calendar: "Takvim",
      gcal: "Google Calendar",
      gcalHint: "Google Calendar paylaşım linkini veya Calendar ID’yi yapıştır — sitede görünsün.",
      gcalSave: "Bağla",
      gcalDisconnect: "Kopar",
      gcalPlaceholder: "calendar ID veya embed / paylaşım linki…",
      gcalIcs: "ICS indir",
      gcalSubscribe: "Google’a abone ol",
      gcalAdd: "Google’a ekle",
      gcalHow: "ICS’i Google Calendar → Ayarlar → İçe aktar ile yükle, veya abone ol ile canlı tut.",
      gcalPublic: "Takvimin görünmesi için Google’da “Bu takvimi herkese açık yap” olması gerekir.",
      gcalEmpty: "henüz bağlı değil — linki yapıştır.",
      gcalEvents: "Sitedeki etkinlikler",
      ziyaret: "Ziyaret",
    },
    en: {
      tag: "notes · ledger · agenda",
      home: "Home",
      istisare: "İstişare notes",
      mentor: "Mentor Cetele",
      agenda: "Agenda",
      upcoming: "Upcoming",
      ideas: "Ideas",
      family: "Family",
      events: "Events",
      ledger: "Ledger",
      thisWeek: "This week",
      weekGoal: "This week's goal",
      pinHere: "pin it here…",
      notesHere: "write notes here…",
      emptyList: "nothing yet — add one.",
      add: "Add",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      addEvent: "Add event",
      addRow: "Add row",
      exportCsv: "Export Excel",
      importCsv: "Import Excel",
      search: "Search…",
      title: "Title",
      date: "Date",
      time: "Time",
      who: "Who",
      place: "Place",
      notes: "Notes",
      desc: "Description",
      category: "Category",
      amount: "Amount",
      type: "Type",
      income: "Income",
      expense: "Expense",
      incomeTotal: "Income",
      expenseTotal: "Expense",
      balance: "Balance",
      allFamily: "Whole family",
      herPage: "her page",
      open: "Open",
      byCategory: "By category",
      byMonth: "By month",
      emptyEvents: "no events.",
      emptyLedger: "no rows.",
      workOn: "Upcoming — things we should work on",
      ideaPrompt: "write an idea…",
      agendaPrompt: "add agenda…",
      workPrompt: "something to work on…",
      doneOf: "weekly goals",
      contacts: "Contacts",
      student: "Student",
      parent: "Parent (Mom)",
      phone: "Phone",
      addStudent: "Add row",
      groupOf: "group",
      fillLater: "fill later",
      homeschool: "Afterschool",
      kuran: "Quran class?",
      coming: "coming ✿",
      yes: "yes",
      no: "no",
      unset: "?",
      todayBtn: "Today",
      addEvent: "Add event",
      dayEvents: "That day's agenda",
      calNotes: "Notes",
      notePrompt: "write an agenda note…",
      pinNote: "Pin",
      tbd: "No date / TBD",
      whoGirls: "Girls",
      whoAblalar: "Ablalar",
      whoAbiler: "Abiler",
      whoGenel: "General",
      endDate: "End",
      noDayEvents: "nothing this day yet — add one.",
      mufredat: "Curriculum",
      sohbet: "Sohbet schedule",
      thisSohbet: "This week's sohbet",
      afterschoolComing: "Coming to afterschool",
      weekN: "Week",
      sohbetNotes: "Sohbet notes",
      sohbetPrompt: "write here, change it later…",
      extraPrompt: "add a short note…",
      sohbetTitle: "sohbet title…",
      saved: "saved ✓",
      copyVeli: "Copy parent link",
      veliLinkNote: "Parent visit link",
      satEvery: "every Saturday",
      calendar: "Calendar",
      gcal: "Google Calendar",
      gcalHint: "Paste a Google Calendar share link or Calendar ID to show it here.",
      gcalSave: "Connect",
      gcalDisconnect: "Disconnect",
      gcalPlaceholder: "calendar ID or embed / share link…",
      gcalIcs: "Download ICS",
      gcalSubscribe: "Subscribe in Google",
      gcalAdd: "Add to Google",
      gcalHow: "Import the ICS in Google Calendar → Settings → Import, or subscribe to keep it live.",
      gcalPublic: "To show it here, the Google calendar needs to be public.",
      gcalEmpty: "not connected yet — paste a link.",
      gcalEvents: "Events from this site",
      ziyaret: "Visits",
    },
  };

  function fridaysUntilDec() {
    const out = [];
    const d = new Date(2026, 7, 28);
    const end = new Date(2026, 11, 25);
    while (d <= end) {
      out.push(iso(d));
      d.setDate(d.getDate() + 7);
    }
    return out;
  }

  function iso(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function today() {
    return iso(new Date());
  }

  function currentFriday() {
    const now = new Date();
    const day = now.getDay();
    const diff = day >= 5 ? day - 5 : day + 2;
    const friday = new Date(now);
    friday.setDate(now.getDate() - diff);
    return iso(friday);
  }

  function currentSaturday() {
    const now = new Date();
    const day = now.getDay();
    const sat = new Date(now);
    if (day !== 6) sat.setDate(now.getDate() + (6 - day));
    return iso(sat);
  }

  function mufredatWeeks() {
    const out = [];
    const d = new Date(2026, 8, 5);
    MUFREDAT_TOPICS.forEach(function (title, i) {
      out.push({ n: i + 1, date: iso(d), title: title });
      d.setDate(d.getDate() + 7);
    });
    return out;
  }

  function mufredatEntry(date) {
    if (!state.mufredat) state.mufredat = {};
    if (!state.mufredat[date]) state.mufredat[date] = { notes: "", done: false, extras: [] };
    if (!state.mufredat[date].extras) state.mufredat[date].extras = [];
    return state.mufredat[date];
  }

  function afterschoolKids(groupId) {
    const out = [];
    const groups = groupId ? GROUPS.filter(function (g) { return g.id === groupId; }) : GROUPS;
    groups.forEach(function (group) {
      ((state.contacts && state.contacts[group.id]) || []).forEach(function (row) {
        if (row.homeschool === "evet" && row.student) {
          out.push({ student: row.student, group: group.name, groupId: group.id, parent: row.parent || "" });
        }
      });
    });
    return out;
  }

  const ISTISARE_AUG28 =
    "Genel yaklaşım\n" +
    "• Önümüzdeki hafta kızlarla ilk haftamız olacak.\n" +
    "• Velilerden, bazı çocuklara farklı davranıldığı ve herkese eşit yaklaşılmadığı yönünde geri bildirimler gelmiş.\n" +
    "• Tüm çocuklara eşit davranmaya özen gösterelim.\n" +
    "• Lale ablanın kızı Leyla Yılmaz’a özellikle dikkat edelim.\n" +
    "• Fotoğraf çekilmesini istemeyen velilerimiz olabileceği için, kızların fotoğraflarını çekmeden önce velilerden izin alalım.\n" +
    "• ATFA’daki odaları kullanamıyoruz.\n" +
    "\n" +
    "İlk hafta pikniği\n" +
    "• Velilerden potluck usulü ikram getirmelerini rica edeceğiz.\n" +
    "• Piknik yalnızca öğrencilere özel olacak.\n" +
    "\n" +
    "İlk sohbetin konusu\n" +
    "• Piknikten sonraki ilk abla buluşmasında şu konuları konuşalım:\n" +
    "    – Efendimiz’i (sav) sevmek\n" +
    "    – Allah sevgisi\n" +
    "    – Ablalara neden geliyoruz?\n" +
    "• Efendimiz (sav) hakkında sohbet ederken:\n" +
    "    – Bize nasıl şefaatçi olacağını,\n" +
    "    – Ellerimizin nasıl parlayacağını,\n" +
    "    – Onun sevgisinin hayatımızdaki yerini anlatalım.\n" +
    "• Bu konuların çocukların zihninde ve kalbinde yer etmesine özen gösterelim.\n" +
    "\n" +
    "Ücret ve alışveriş\n" +
    "• Her öğrenci için 75 dolar ablalara verilecek ve bu ücret çocukların ihtiyaçları için kullanılacak.\n" +
    "• Ücretler bize ulaştıktan sonra:\n" +
    "    – Kitapları sipariş edeceğiz.\n" +
    "    – MP3 çalarları satın alacağız.\n" +
    "• Feyza Hocam MP3 çaların modelini bize gönderecek.\n" +
    "\n" +
    "İlk hafta aktivitesi\n" +
    "• İlk haftanın aktivitesi: MP3 çalarları taşlarla süsleme.\n" +
    "• Çocukları motive etmek için salavat ve şiir etkinlikleri düzenleyelim:\n" +
    "    – Efendimiz (sav) hakkında en güzel şiiri yazan ilk üç öğrenciye ayrı ayrı hediye verelim.\n" +
    "    – En çok salavat çeken gruba dondurma gibi bir grup hediyesi verelim.\n" +
    "\n" +
    "Çetele ve takip\n" +
    "• Çetelelerimizi düzenli olarak takip edelim.\n" +
    "• Her gün çetelemiz üzerinden bütün öğrencilerimize isimleriyle dua edelim.\n" +
    "• Personalized çetele şablonu:\n" +
    "  https://drive.google.com/file/d/1vQgdus1zzpWI40vXQVsh490S68mByK3P/view\n" +
    "  ChatGPT ile aynı template’i kullanarak çocuklara özel çetele yapılabilir.\n" +
    "\n" +
    "Veli iletişimi\n" +
    "• Önümüzdeki haftaya kadar velilerimizi arayıp konuşalım.\n" +
    "• Her abla en az üç veli araması yapsın.";

  function seedIstisareAug28(data) {
    if (!data.istisare) data.istisare = {};
    if (!String(data.istisare["2026-08-28"] || "").trim()) {
      data.istisare["2026-08-28"] = ISTISARE_AUG28;
    }
    data.istisareSeededAug28 = true;
  }

  function defaultState() {
    return {
      lang: "tr",
      sisters: [
        { id: "s1", name: "Asli" },
        { id: "s2", name: "Nazlican" },
        { id: "s3", name: "Yağmur Sena" },
      ],
      events: [],
      entries: [],
      istisare: { "2026-08-28": ISTISARE_AUG28 },
      istisareSeededAug28: true,
      weeklyGoal: "",
      mentorGoals: {},
      agenda: [],
      work: [],
      ideas: [],
      contacts: seedContacts(),
      calendarEvents: seedCalendar(),
      calendarSeeded: true,
      homeschoolSeeded: true,
      gundemNotes: [],
      mufredat: {},
      googleCal: "",
    };
  }

  function normName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function isHomeschoolName(name) {
    const n = normName(name);
    if (!n) return false;
    const keys = [
      "asuman peker",
      "hatice temiz",
      "hulya gonulalan",
      "azra veli",
      "zeynep bulut",
      "leyla yilmaz",
      "belinay timur",
      "zehra tozcu",
      "maryam mammadzada",
      "jumana mayali",
    ];
    const parts = n.split(" ");
    const first = parts[0];
    const last = parts[parts.length - 1];
    return keys.some(function (key) {
      if (n === key || n.indexOf(key) !== -1) return true;
      const kp = key.split(" ");
      const kFirst = kp[0];
      const kLast = kp[kp.length - 1];
      return first === kFirst && (last.indexOf(kLast) === 0 || kLast.indexOf(last) === 0);
    });
  }

  function contactRow(student, parent, notes) {
    return {
      id: "c-" + String(student || Math.random()).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      student: student || "",
      parent: parent || "",
      phone: "",
      notes: notes || "",
      homeschool: isHomeschoolName(student) ? "evet" : "",
      kuran: "",
    };
  }

  function emptyContact(prefix, n) {
    return {
      id: prefix + "-blank-" + n,
      student: "",
      parent: "",
      phone: "",
      notes: "",
      homeschool: "",
      kuran: "",
    };
  }

  function padGroup(rows, prefix) {
    const extra = [];
    for (let i = 1; i <= 5; i++) extra.push(emptyContact(prefix, i));
    return rows.concat(extra);
  }

  function seedContacts() {
    return {
      asli: padGroup(
        [
          contactRow("Ayse Seymen", "Şule Seymen", "Kayıtta: Ayse Ulusoy"),
          contactRow("Leyla Yilmaz", "Lale Cebeci", ""),
          contactRow("Hatice Betul Temizoz", "Aysenur Temiz", "Kayıtta: Hatice Temiz"),
          contactRow("Zeynep Bulut", "Metanet Bulut", ""),
          contactRow("Zeynep Gollu", "Merve Gollu", "Tuesday conflict"),
          contactRow("Asuman Peker", "", "afterschool signup?"),
          contactRow("Seniha Top", "Bahti T", "Kayıtta: Seniha T"),
          contactRow("Nil Yildiz", "", "bire bir lazım olabilir"),
        ],
        "asli"
      ),
      nazlican: padGroup(
        [
          contactRow("Elif Mammadzada", "", "konuştuktan sonra yapacak"),
          contactRow("Dilek Mirzalizade", "", ""),
          contactRow("Zahra Zeynal", "", "yapacak"),
          contactRow("Azra Veli", "Elif Veli", ""),
          contactRow("Bahar Tasdogan", "", ""),
          contactRow("Melisa Gokce", "", "yapacak"),
          contactRow("Hulya Gonulalan", "Arzu Karaman Gonulalan", ""),
        ],
        "nazlican"
      ),
      yagmur: padGroup(
        [
          contactRow("Belinay Timur", "", ""),
          contactRow("Zehra Tozcu", "Elife Tozcu", ""),
          contactRow("Selma Sakin", "Fatma Sakin", ""),
          contactRow("Gulce Gurel", "Zekiye Gurel", "sibling olarak kayıtlı"),
          contactRow("Irem Sahin", "", "veli adı eklenecek"),
          contactRow("Jumana Mayali", "Nada Dawood", ""),
          contactRow("Maryam Mammadzada", "", "cuma 12:00 özel"),
          contactRow("Pinar Dogan", "", "elden verecek"),
        ],
        "yagmur"
      ),
    };
  }

  function calItem(title, start, end, who) {
    return {
      id: "cal-" + start + "-" + title.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 28).toLowerCase(),
      title: title,
      start: start,
      end: end || start,
      who: who || "genel",
      note: "",
      tbd: !start,
    };
  }

  function seedCalendar() {
    return [
      calItem("Kuran Academy", "2026-09-01", "2026-09-01", "genel"),
      calItem("8th Grade Picnic — Girls", "2026-09-05", "2026-09-05", "girls"),
      calItem("3 Aylar Reward Mentor Gezi — Abiler", "2026-09-06", "2026-09-07", "abiler"),
      calItem("UVA & VCU Meetup Event — Ablalar", "2026-09-06", "2026-09-06", "ablalar"),
      calItem("Mentor Yetiştirme Start — Abiler", "2026-09-08", "2026-09-08", "abiler"),
      calItem("8th Grade Guiding Lights Zoom Classes Start — Girls", "2026-09-08", "2026-09-08", "girls"),
      calItem("Uni Mentors Yetiştirme Start — Girls", "2026-09-10", "2026-09-10", "girls"),
      calItem("6/7 Grade Guiding Lights Zoom Classes Start — Girls", "2026-09-10", "2026-09-10", "girls"),
      calItem("Hızlandırılmış Yetiştirme Programı Starts — Lise Boys (9-11)", "2026-09-11", "2026-09-11", "abiler"),
      calItem("Uni DC Trip — Girls", "2026-09-12", "2026-09-12", "girls"),
      calItem("Dialogue Get Together", "2026-09-13", "2026-09-13", "genel"),
      calItem("Parent Academy Starts", "2026-09-13", "2026-09-13", "genel"),
      calItem("Mentor Yetiştirme Start — Ablalar", "2026-09-14", "2026-09-14", "ablalar"),
      calItem("Afterschool Program Starts — Girls (8th Grade)", "2026-09-15", "2026-09-15", "girls"),
      calItem("Mid-Atlantic High School Zoom Sohbets Start", "2026-09-16", "2026-09-16", "genel"),
      calItem("New Mentor Training Starts — Girls", "2026-09-16", "2026-09-16", "girls"),
      calItem("Miras Yolunda Yetiştirme Starts — Lise Girls (9-11)", "2026-09-18", "2026-09-18", "girls"),
      calItem("JWF Programı — NY", "2026-09-21", "2026-09-23", "genel"),
      calItem("LeadUp End of the Year Ceremony", "2026-09-24", "2026-09-24", "genel"),
      calItem("High School Meetup #1", "2026-09-26", "2026-09-26", "genel"),
      calItem("College Guidance Test (9th–11th Grades)", "2026-09-26", "2026-09-27", "genel"),
      calItem("Cetele Day — Abiler", "2026-09-27", "2026-09-27", "abiler"),
      calItem("Mid-Atlantik Middle School Zoom Sohbetleri", "", "", "genel"),
      calItem("Uni Boys Events", "", "", "abiler"),
    ];
  }

  const GROUPS = [
    { id: "asli", name: "Asli", full: "Asli Abla" },
    { id: "nazlican", name: "Nazlican", full: "Nazlican Abla" },
    { id: "yagmur", name: "Yağmur Sena", full: "Yağmur Sena Abla" },
  ];

  function markHomeschool(contacts) {
    GROUPS.forEach(function (group) {
      ((contacts && contacts[group.id]) || []).forEach(function (row) {
        if (isHomeschoolName(row.student) && row.homeschool !== "hayir") row.homeschool = "evet";
      });
    });
  }

  function ensureContactFlags(contacts) {
    GROUPS.forEach(function (group) {
      ((contacts && contacts[group.id]) || []).forEach(function (row) {
        if (row.homeschool == null) row.homeschool = "";
        if (row.kuran == null) row.kuran = "";
      });
    });
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_KEY);
      if (!raw) return defaultState();
      const data = Object.assign(defaultState(), JSON.parse(raw));
      const rename = { "Abla 1": "Asli", "Abla 2": "Nazlican", "Abla 3": "Yağmur Sena" };
      (data.sisters || []).forEach(function (s) {
        if (rename[s.name]) s.name = rename[s.name];
      });
      if (!data.contacts || !data.contacts.asli) data.contacts = seedContacts();
      ensureContactFlags(data.contacts);
      markHomeschool(data.contacts);
      data.homeschoolSeeded = true;
      if (!data.calendarSeeded) {
        data.calendarEvents = seedCalendar();
        data.calendarSeeded = true;
      }
      if (!data.gundemNotes) data.gundemNotes = [];
      if (!data.mufredat) data.mufredat = {};
      if (data.googleCal == null) data.googleCal = "";
      seedIstisareAug28(data);
      return data;
    } catch (e) {
      return defaultState();
    }
  }

  let state = load();
  let modal = null;
  let charts = [];
  let fileInput = null;
  let selectedDay = today();
  let viewYear = 2026;
  let viewMonth = 8;

  const VELI_NOTE_ID = "veli-ziyaret-link";

  function siteDir() {
    let dir = location.pathname.replace(/index\.html$/i, "").replace(/ziyaret\.html$/i, "");
    if (!dir.endsWith("/")) dir += "/";
    return location.origin + dir;
  }

  function veliUrl() {
    try {
      if (window.Ziyaret && typeof window.Ziyaret.veliLink === "function") {
        const url = window.Ziyaret.veliLink();
        if (url) {
          localStorage.setItem("core-es-veli-url", url);
          return url;
        }
      }
    } catch (e) {}
    return siteDir() + "ziyaret.html";
  }

  function ensureVeliNote() {
    const url = veliUrl();
    if (!state.gundemNotes) state.gundemNotes = [];
    const title = t("veliLinkNote") + ": " + url;
    const existing = state.gundemNotes.find(function (n) {
      return n.id === VELI_NOTE_ID;
    });
    if (existing) {
      if (existing.title === title && existing.pinned) return;
      existing.title = title;
      existing.pinned = true;
    } else {
      state.gundemNotes.unshift({ id: VELI_NOTE_ID, title: title, done: false, pinned: true });
    }
    save();
  }

  function flashSaved(el) {
    if (!el) return;
    let hint = el.parentNode && el.parentNode.querySelector(".save-hint");
    if (!hint) {
      hint = document.createElement("em");
      hint.className = "save-hint";
      el.parentNode.appendChild(hint);
    }
    hint.textContent = t("saved");
    hint.classList.add("on");
    clearTimeout(el._saved);
    el._saved = setTimeout(function () {
      hint.classList.remove("on");
    }, 1200);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  save();

  function growBox(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  function growAll() {
    document.querySelectorAll("textarea").forEach(growBox);
  }

  function t(key) {
    return (I18N[state.lang] || I18N.tr)[key] || key;
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }

  function money(n) {
    return (Number(n) || 0).toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function route() {
    const parts = (location.hash || "#/").replace(/^#/, "").split("/").filter(Boolean);
    const page = parts[0] || "home";
    if (page === "family" || page === "abla" || page === "cetele" || page === "etkinlikler" || page === "ideas" || page === "upcoming" || page === "takvim" || page === "calendar") {
      return { page: "home" };
    }
    if (page === "rehber") return { page: "rehber", groupId: parts[1] || "asli" };
    if (page === "ziyaret") return { page: "ziyaret" };
    return { page: page };
  }

  function sisterById(id) {
    return state.sisters.find(function (s) {
      return s.id === id;
    });
  }

  function personLabel(id) {
    if (!id || id === "aile") return t("allFamily");
    const sister = sisterById(id);
    return sister ? sister.name : t("allFamily");
  }

  function formatWeek(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }

  function monthLabel(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", {
      month: "long",
      year: "numeric",
    });
  }

  function upcomingEvents(sisterId) {
    const now = today();
    return state.events
      .filter(function (event) {
        if (event.date < now) return false;
        if (!sisterId) return true;
        return !event.who || event.who === "aile" || event.who === sisterId;
      })
      .sort(function (a, b) {
        return (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""));
      });
  }

  function entriesFor(sisterId) {
    return state.entries
      .filter(function (row) {
        return !sisterId || row.who === sisterId;
      })
      .sort(function (a, b) {
        return (b.date || "").localeCompare(a.date || "");
      });
  }

  function totals(rows) {
    return rows.reduce(
      function (acc, row) {
        const amount = Math.abs(Number(row.amount) || 0);
        if (row.type === "gelir") acc.income += amount;
        else acc.expense += amount;
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }

  function destroyCharts() {
    charts.forEach(function (chart) {
      chart.destroy();
    });
    charts = [];
  }

  function navLink(href, page, label) {
    const view = route();
    const on =
      view.page === page ||
      (page === "rehber" && view.page === "rehber") ||
      (page === "ziyaret" && view.page === "ziyaret");
    return '<a class="tab' + (on ? " on" : "") + '" href="' + href + '">' + label + "</a>";
  }

  function render() {
    destroyCharts();
    const view = route();
    const sister = view.sisterId ? sisterById(view.sisterId) : null;
    ensureVeliNote();
    const app = document.getElementById("app");
    app.innerHTML =
      '<div class="shell' +
      (view.page === "rehber" || view.page === "gundemler" || view.page === "mufredat" || view.page === "ziyaret" ? " wide" : "") +
      '">' +
      header() +
      tabs() +
      (view.page === "home" || view.page === "" ? homeView() : "") +
      (view.page === "istisare" ? istisareView() : "") +
      (view.page === "mentor" ? mentorView() : "") +
      (view.page === "mufredat" ? mufredatView() : "") +
      (view.page === "ziyaret" ? '<div id="ziyaret-admin"></div>' : "") +
      (view.page === "gundemler" ? gundemView() : "") +
      (view.page === "rehber" ? contactsView(view.groupId) : "") +
      (view.page === "family" ? familyView() : "") +
      (view.page === "sister" ? sisterView(sister) : "") +
      (view.page === "events" ? eventsView() : "") +
      (view.page === "ledger" ? ledgerView(view.sisterId) : "") +
      "</div>" +
      (modal ? modalHtml() : "");
    bind(view, sister);
    if (window.Ziyaret) {
      if (view.page === "ziyaret") {
        window.Ziyaret.mount(document.getElementById("ziyaret-admin"), { admin: true, lang: state.lang });
      } else {
        window.Ziyaret.destroy();
      }
    }
    if (view.page === "family" || view.page === "sister" || view.page === "ledger") {
      drawCharts(view.sisterId || null, view.page === "family");
    }
  }

  function header() {
    return (
      '<div class="top"><a class="brand" href="#/"><div class="mark">ES</div><div><h1>' +
      SITE +
      "</h1><p>" +
      t("tag") +
      '</p></div></a><div class="lang"><button data-lang="tr" class="' +
      (state.lang === "tr" ? "active" : "") +
      '">TR</button><button data-lang="en" class="' +
      (state.lang === "en" ? "active" : "") +
      '">EN</button></div></div>'
    );
  }

  function tabs() {
    return (
      '<nav class="tabs">' +
      navLink("#/", "home", t("home")) +
      navLink("#/istisare", "istisare", t("istisare")) +
      navLink("#/mentor", "mentor", t("mentor")) +
      navLink("#/mufredat", "mufredat", t("mufredat")) +
      navLink("#/gundemler", "gundemler", t("agenda")) +
      navLink("#/rehber/asli", "rehber", t("contacts")) +
      navLink("#/ziyaret", "ziyaret", t("ziyaret")) +
      "</nav>"
    );
  }

  function groupById(id) {
    return (
      GROUPS.find(function (g) {
        return g.id === id;
      }) || GROUPS[0]
    );
  }

  function contactsView(groupId) {
    const group = groupById(groupId);
    const rows = (state.contacts && state.contacts[group.id]) || [];
    const coming = afterschoolKids(group.id);
    return (
      "<h2>" +
      escapeHtml(group.full) +
      " " +
      t("groupOf") +
      '</h2><p class="quiet" style="margin:0 0 10px">' +
      t("student") +
      " + " +
      t("parent") +
      " — " +
      t("fillLater") +
      "</p>" +
      (coming.length
        ? '<div class="as-banner"><span class="as-label">' +
          t("afterschoolComing") +
          "</span><div class=\"as-chips\">" +
          coming
            .map(function (kid) {
              return '<span class="as-chip">' + escapeHtml(kid.student) + "</span>";
            })
            .join("") +
          "</div></div>"
        : "") +
      '<div class="row" style="margin-bottom:10px"><button class="btn" id="add-contact" data-group="' +
      group.id +
      '">' +
      t("addStudent") +
      '</button><button class="btn light" id="export-contacts" data-group="' +
      group.id +
      '">' +
      t("exportCsv") +
      "</button></div>" +
      '<div class="sheet"><table><thead><tr><th class="num"></th><th>A · ' +
      t("student") +
      "</th><th>B · " +
      t("parent") +
      "</th><th class=\"th-home\">C · " +
      t("homeschool") +
      "</th><th class=\"th-kuran\">D · " +
      t("kuran") +
      "</th><th>E · " +
      t("phone") +
      "</th><th>F · " +
      t("notes") +
      "</th><th></th></tr></thead><tbody>" +
      rows
        .map(function (row, i) {
          return (
            "<tr class=\"" +
            (row.homeschool === "evet" ? "as-row" : "") +
            "\"><td class=\"num\">" +
            (i + 1) +
            "</td>" +
            contactCell(group.id, row, "student", t("student")) +
            contactCell(group.id, row, "parent", t("parent")) +
            contactSelect(group.id, row, "homeschool", [
              ["", "—"],
              ["evet", t("coming")],
              ["hayir", t("no")],
            ], row.homeschool === "evet" ? "sheet-home on" : "sheet-home") +
            contactSelect(group.id, row, "kuran", [
              ["", t("unset")],
              ["evet", t("yes")],
              ["hayir", t("no")],
            ], row.kuran === "evet" ? "sheet-kuran on" : "sheet-kuran") +
            contactCell(group.id, row, "phone", t("phone")) +
            contactCell(group.id, row, "notes", t("notes")) +
            '<td class="sheet-del"><button class="btn light tiny" data-del-contact="' +
            row.id +
            '" data-group="' +
            group.id +
            '">' +
            t("delete") +
            "</button></td></tr>"
          );
        })
        .join("") +
      '</tbody></table></div><div class="sheet-tabs">' +
      GROUPS.map(function (g) {
        return (
          '<a class="sheet-tab' +
          (g.id === group.id ? " on" : "") +
          '" href="#/rehber/' +
          g.id +
          '">' +
          escapeHtml(g.name) +
          "</a>"
        );
      }).join("") +
      "</div>"
    );
  }

  function contactSelect(groupId, row, field, options, tdClass) {
    return (
      '<td class="' +
      (tdClass || "") +
      '"><select data-contact="' +
      row.id +
      '" data-group="' +
      groupId +
      '" data-field="' +
      field +
      '">' +
      options
        .map(function (opt) {
          return (
            '<option value="' +
            opt[0] +
            '"' +
            ((row[field] || "") === opt[0] ? " selected" : "") +
            ">" +
            opt[1] +
            "</option>"
          );
        })
        .join("") +
      "</select></td>"
    );
  }

  function contactCell(groupId, row, field, placeholder) {
    return (
      "<td><textarea rows=\"1\" data-contact=\"" +
      row.id +
      '" data-group="' +
      groupId +
      '" data-field="' +
      field +
      '" placeholder="' +
      placeholder +
      '">' +
      escapeHtml(row[field] || "") +
      "</textarea></td>"
    );
  }

  function homeView() {
    const friday = currentFriday();
    return (
      '<div class="hero">' +
      '<section class="card hadith"><p>“' +
      HADITH +
      '”</p><small>(Buhari)</small></section>' +
      '<section class="pin-wrap"><span class="pin"></span><p class="hand">' +
      t("weekGoal") +
      ' <em class="save-hint"></em></p><textarea id="weekly-goal" placeholder="' +
      t("pinHere") +
      '">' +
      escapeHtml(state.weeklyGoal) +
      "</textarea></section></div>" +
      '<div class="home-grid">' +
      '<a class="card jump peach" href="#/istisare"><span class="quiet">' +
      t("thisWeek") +
      "</span><b>" +
      formatWeek(friday) +
      "</b></a>" +
      '<a class="card jump mint" href="#/gundemler"><span class="quiet">' +
      t("agenda") +
      "</span><b>" +
      upcomingCal().length +
      "</b></a>" +
      '<a class="card jump blush" href="#/mufredat"><span class="quiet">' +
      t("mufredat") +
      "</span><b>" +
      (function () {
        const now = currentSaturday();
        const week = mufredatWeeks().find(function (w) { return w.date === now; }) || mufredatWeeks()[0];
        return t("weekN") + " " + week.n;
      })() +
      "</b></a>" +
      '<a class="card jump butter" href="#/mentor"><span class="quiet">' +
      t("mentor") +
      "</span><b>" +
      WEEKS.filter(function (week) {
        return state.mentorGoals[week] && state.mentorGoals[week].done;
      }).length +
      "/" +
      WEEKS.length +
      "</b></a>" +
      '<div class="card jump peach ziyaret-home"><a href="#/ziyaret"><span class="quiet">' +
      t("ziyaret") +
      "</span><b>Veli</b></a><input class=\"zv-home-url\" id=\"home-veli-url\" readonly value=\"" +
      escapeHtml(veliUrl()) +
      '" /><button type="button" class="btn tiny" id="copy-veli">' +
      t("copyVeli") +
      "</button></div></div>"
    );
  }

  function istisareView() {
    let lastMonth = "";
    const now = currentFriday();
    let html = "<h2>" + t("istisare") + "</h2><div class=\"weeks\">";
    WEEKS.forEach(function (week) {
      const month = monthLabel(week);
      if (month !== lastMonth) {
        html += '<div class="month">' + escapeHtml(month) + "</div>";
        lastMonth = month;
      }
      html +=
        '<section class="week' +
        (week === now ? " now" : "") +
        (week === "2026-08-28" ? " seeded" : "") +
        '"><div class="week-top"><b>' +
        escapeHtml(formatWeek(week)) +
        "</b>" +
        (week === "2026-08-28" ? '<span class="week-source">İstişare notları</span>' : "") +
        (week === now ? '<span class="badge">' + t("thisWeek") + "</span>" : "") +
        '</div><textarea data-istisare="' +
        week +
        '" placeholder="' +
        t("notesHere") +
        '">' +
        escapeHtml(state.istisare[week] || "") +
        "</textarea></section>";
    });
    return html + "</div>";
  }

  function mentorView() {
    const done = WEEKS.filter(function (week) {
      return state.mentorGoals[week] && state.mentorGoals[week].done;
    }).length;
    let html =
      "<h2>" +
      t("mentor") +
      '</h2><div class="mentor-top"><section class="card hadith"><p>“' +
      HADITH +
      '”</p><small>(Buhari)</small></section><section class="pin-wrap"><span class="pin"></span><p class="hand">' +
      t("weekGoal") +
      ' <em class="save-hint"></em></p><textarea id="weekly-goal" placeholder="' +
      t("pinHere") +
      '">' +
      escapeHtml(state.weeklyGoal) +
      "</textarea></section></div><p class=\"tiny-progress\">" +
      done +
      " / " +
      WEEKS.length +
      " " +
      t("doneOf") +
      '</p><div class="weeks">';
    WEEKS.forEach(function (week) {
      const row = state.mentorGoals[week] || { text: "", done: false };
      html +=
        '<label class="item' +
        (row.done ? " done" : "") +
        '"><input type="checkbox" data-mentor-done="' +
        week +
        '" ' +
        (row.done ? "checked" : "") +
        " /><div style=\"flex:1\"><b>" +
        escapeHtml(formatWeek(week)) +
        '</b><textarea data-mentor-text="' +
        week +
        '" placeholder="' +
        t("pinHere") +
        '">' +
        escapeHtml(row.text || "") +
        "</textarea></div></label>";
    });
    return html + "</div>";
  }

  function mufredatView() {
    const weeks = mufredatWeeks();
    const now = currentSaturday();
    const todayStr = today();
    const current = weeks.find(function (w) { return w.date === now; }) || weeks[0];
    const currentRow = mufredatEntry(current.date);
    let lastMonth = "";
    let html =
      "<h2>" +
      t("mufredat") +
      '</h2><p class="quiet" style="margin:0 0 14px">' +
      t("sohbet") +
      " · " +
      t("satEvery") +
      "</p>";

    html +=
      '<section class="sohbet-hero"><span class="pin"></span><p class="hand">' +
      t("thisSohbet") +
      "</p><div class=\"sohbet-kicker\">" +
      t("weekN") +
      " " +
      current.n +
      " · " +
      escapeHtml(formatWeek(current.date)) +
      '</div><textarea class="sohbet-title" data-muf-title="' +
      current.date +
      '" rows="2" placeholder="' +
      t("sohbetTitle") +
      '">' +
      escapeHtml(currentRow.title || current.title) +
      '</textarea><div class="sohbet-notes"><div class="sohbet-notes-lab"><span>' +
      t("sohbetNotes") +
      '</span><em class="save-hint" data-saved="' +
      current.date +
      '"></em></div><textarea class="sohbet-box" data-muf-notes="' +
      current.date +
      '" rows="5" placeholder="' +
      t("sohbetPrompt") +
      '">' +
      escapeHtml(currentRow.notes || "") +
      "</textarea></div>" +
      extraNotesHtml(current.date) +
      "</section><div class=\"sohbet-track\">";

    weeks.forEach(function (week) {
      const month = monthLabel(week.date);
      const row = mufredatEntry(week.date);
      const isNow = week.date === now;
      const isPast = week.date < todayStr;
      if (month !== lastMonth) {
        html += '<div class="month">' + escapeHtml(month) + "</div>";
        lastMonth = month;
      }
      html +=
        '<article class="sohbet-card' +
        (isNow ? " now" : "") +
        (isPast && !isNow ? " past" : "") +
        (row.done ? " done" : "") +
        '"><div class="sohbet-side"><span class="sohbet-num">' +
        String(week.n).padStart(2, "0") +
        '</span><label class="sohbet-check"><input type="checkbox" data-muf-done="' +
        week.date +
        '" ' +
        (row.done ? "checked" : "") +
        " /></label></div><div class=\"sohbet-body\"><div class=\"sohbet-card-top\">" +
        (isNow
          ? "<b>" + escapeHtml(row.title || week.title) + "</b>"
          : '<textarea class="sohbet-card-title" data-muf-title="' +
            week.date +
            '" rows="2" placeholder="' +
            t("sohbetTitle") +
            '">' +
            escapeHtml(row.title || week.title) +
            "</textarea>") +
        (isNow ? '<span class="badge">' + t("thisWeek") + "</span>" : "") +
        '</div><div class="quiet">' +
        escapeHtml(formatWeek(week.date)) +
        "</div>";
      if (!isNow) {
        html +=
          '<textarea class="sohbet-box" data-muf-notes="' +
          week.date +
          '" rows="4" placeholder="' +
          t("sohbetPrompt") +
          '">' +
          escapeHtml(row.notes || "") +
          "</textarea>" +
          extraNotesHtml(week.date);
      }
      html += "</div></article>";
    });
    return html + "</div>";
  }

  function extraNotesHtml(date) {
    const extras = mufredatEntry(date).extras || [];
    return (
      '<form class="addbar sohbet-add" data-muf-add="' +
      date +
      '"><input name="title" placeholder="' +
      t("extraPrompt") +
      '" /><button class="btn pink tiny" type="submit">' +
      t("add") +
      "</button></form>" +
      (extras.length
        ? '<div class="list sohbet-extras">' +
          extras
            .map(function (note) {
              return (
                '<div class="item"><textarea rows="1" data-muf-extra="' +
                note.id +
                '" data-week="' +
                date +
                '">' +
                escapeHtml(note.title) +
                '</textarea><button class="btn light tiny" data-muf-del="' +
                note.id +
                '" data-week="' +
                date +
                '">' +
                t("delete") +
                "</button></div>"
              );
            })
            .join("") +
          "</div>"
        : "")
    );
  }

  function addDaysIso(dateStr, n) {
    const d = new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() + n);
    return iso(d);
  }

  function icsStamp(dateStr) {
    return String(dateStr || "").replace(/-/g, "");
  }

  function icsEscape(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  function siteCalendarEvents() {
    const out = [];
    mufredatWeeks().forEach(function (week) {
      const row = (state.mufredat && state.mufredat[week.date]) || {};
      out.push({
        uid: "muf-" + week.n + "@core-es",
        title: "Sohbet · " + t("weekN") + " " + week.n + " · " + (row.title || week.title),
        start: week.date,
        end: addDaysIso(week.date, 1),
        details: row.notes || "Müfredat sohbet",
      });
    });
    (state.calendarEvents || []).forEach(function (event, i) {
      if (event.tbd || !event.start) return;
      out.push({
        uid: "gundem-" + (event.id || i) + "@core-es",
        title: event.title,
        start: event.start,
        end: addDaysIso(event.end || event.start, 1),
        details: (event.who ? whoLabel(event.who) : "") + (event.note ? " · " + event.note : ""),
      });
    });
    return out;
  }

  function buildIcs() {
    const stamp = icsStamp(today()) + "T120000Z";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//8th grade CORE-ES//TR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:8th grade CORE - ES",
      "X-WR-TIMEZONE:America/New_York",
    ];
    siteCalendarEvents().forEach(function (ev) {
      lines.push(
        "BEGIN:VEVENT",
        "UID:" + ev.uid,
        "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + icsStamp(ev.start),
        "DTEND;VALUE=DATE:" + icsStamp(ev.end),
        "SUMMARY:" + icsEscape(ev.title),
        "DESCRIPTION:" + icsEscape(ev.details),
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  function downloadIcs() {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "core-es.ics";
    a.click();
  }

  function googleTemplateUrl(ev) {
    return (
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      encodeURIComponent(ev.title) +
      "&dates=" +
      icsStamp(ev.start) +
      "/" +
      icsStamp(ev.end) +
      "&details=" +
      encodeURIComponent(ev.details || SITE)
    );
  }

  function parseGoogleCalSrc(raw) {
    const v = String(raw || "").trim();
    if (!v) return "";
    const iframe = v.match(/src=["']([^"']+)["']/i);
    const urlStr = iframe ? iframe[1] : v;
    try {
      const u = new URL(urlStr);
      return decodeURIComponent(u.searchParams.get("src") || u.searchParams.get("cid") || urlStr);
    } catch (e) {
      return v;
    }
  }

  function googleEmbedUrl(src) {
    return (
      "https://calendar.google.com/calendar/embed?src=" +
      encodeURIComponent(src) +
      "&ctz=America/New_York&mode=MONTH&showTitle=0&showPrint=0&showTz=0"
    );
  }

  function calendarSyncView() {
    const src = parseGoogleCalSrc(state.googleCal);
    const icsUrl = "https://fozern.github.io/8th-grade/calendar.ics";
    const subUrl = "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(icsUrl);
    const upcoming = siteCalendarEvents()
      .filter(function (ev) {
        return ev.start >= today();
      })
      .slice(0, 8);
    return (
      "<h2>" +
      t("calendar") +
      '</h2><p class="quiet" style="margin:0 0 14px">' +
      t("gcal") +
      "</p><section class=\"card gcal-card\"><p>" +
      t("gcalHint") +
      '</p><form class="addbar" id="gcal-form"><input id="gcal-input" placeholder="' +
      t("gcalPlaceholder") +
      '" value="' +
      escapeHtml(state.googleCal || "") +
      '" /><button class="btn" type="submit">' +
      t("gcalSave") +
      "</button>" +
      (src
        ? '<button class="btn light" type="button" id="gcal-clear">' + t("gcalDisconnect") + "</button>"
        : "") +
      '</form><p class="quiet">' +
      t("gcalPublic") +
      "</p>" +
      (src
        ? '<iframe class="gcal-frame" src="' +
          escapeHtml(googleEmbedUrl(src)) +
          '" title="Google Calendar"></iframe>'
        : '<div class="gcal-empty">' + t("gcalEmpty") + "</div>") +
      '</section><section class="card" style="margin-top:12px"><p class="quiet">' +
      t("gcalHow") +
      '</p><div class="row" style="margin-top:10px"><button class="btn" id="gcal-ics">' +
      t("gcalIcs") +
      '</button><a class="btn light" target="_blank" rel="noreferrer" href="' +
      subUrl +
      '">' +
      t("gcalSubscribe") +
      "</a></div></section><section class=\"card\" style=\"margin-top:12px\"><h3 style=\"margin:0 0 10px\">" +
      t("gcalEvents") +
      "</h3>" +
      (upcoming.length
        ? '<div class="list">' +
          upcoming
            .map(function (ev) {
              return (
                '<div class="item"><div><b>' +
                escapeHtml(ev.title) +
                '</b><div class="quiet">' +
                escapeHtml(formatWeek(ev.start)) +
                '</div></div><a class="btn pink tiny" target="_blank" rel="noreferrer" href="' +
                googleTemplateUrl(ev) +
                '">' +
                t("gcalAdd") +
                "</a></div>"
              );
            })
            .join("") +
          "</div>"
        : '<p class="empty">' + t("emptyList") + "</p>") +
      "</section>"
    );
  }

  function whoLabel(who) {
    if (who === "girls") return t("whoGirls");
    if (who === "ablalar") return t("whoAblalar");
    if (who === "abiler") return t("whoAbiler");
    return t("whoGenel");
  }

  function whoClass(who) {
    if (who === "girls") return "pink";
    if (who === "ablalar") return "rose";
    if (who === "abiler") return "blue";
    return "ink";
  }

  function upcomingCal() {
    const now = today();
    return (state.calendarEvents || [])
      .filter(function (event) {
        if (event.tbd || !event.start) return false;
        return (event.end || event.start) >= now;
      })
      .sort(function (a, b) {
        return a.start.localeCompare(b.start);
      });
  }

  function eventsOn(dateStr) {
    return (state.calendarEvents || []).filter(function (event) {
      if (event.tbd || !event.start) return false;
      const end = event.end || event.start;
      return event.start <= dateStr && dateStr <= end;
    });
  }

  function tbdEvents() {
    return (state.calendarEvents || []).filter(function (event) {
      return event.tbd || !event.start;
    });
  }

  function monthCells(y, m) {
    const first = new Date(y, m, 1);
    let pad = first.getDay();
    pad = pad === 0 ? 6 : pad - 1;
    const last = new Date(y, m + 1, 0).getDate();
    const cells = [];
    let i;
    for (i = 0; i < pad; i++) cells.push(null);
    for (i = 1; i <= last; i++) cells.push(i);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  function gundemView() {
    const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", {
      month: "long",
      year: "numeric",
    });
    const weekdays =
      state.lang === "tr" ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayEvents = eventsOn(selectedDay);
    const notes = (state.gundemNotes || []).slice().sort(function (a, b) {
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    });
    const prettyDay = new Date(selectedDay + "T12:00:00").toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    let html =
      "<h2>" +
      t("agenda") +
      '</h2><section class="cal-wrap"><div class="cal-nav"><button class="btn light tiny" data-cal="prev">‹</button><b>' +
      escapeHtml(monthName) +
      '</b><button class="btn light tiny" data-cal="next">›</button><button class="btn tiny" data-cal="today">' +
      t("todayBtn") +
      '</button></div><div class="cal-week">' +
      weekdays
        .map(function (d) {
          return "<span>" + d + "</span>";
        })
        .join("") +
      '</div><div class="cal-grid">';

    monthCells(viewYear, viewMonth).forEach(function (day) {
      if (!day) {
        html += '<div class="cal-cell empty"></div>';
        return;
      }
      const dateStr = iso(new Date(viewYear, viewMonth, day));
      const list = eventsOn(dateStr);
      html +=
        '<div class="cal-cell' +
        (dateStr === today() ? " today" : "") +
        (dateStr === selectedDay ? " on" : "") +
        '" data-day="' +
        dateStr +
        '"><span class="cal-num">' +
        day +
        "</span>" +
        list
          .slice(0, 3)
          .map(function (event) {
            return (
              '<span class="cal-chip ' +
              whoClass(event.who) +
              '" data-edit-cal="' +
              event.id +
              '">' +
              escapeHtml(event.title) +
              "</span>"
            );
          })
          .join("") +
        (list.length > 3 ? '<span class="cal-more">+' + (list.length - 3) + "</span>" : "") +
        "</div>";
    });

    html +=
      '</div><div class="cal-legend"><span class="cal-chip girls-lg pink">' +
      t("whoGirls") +
      '</span><span class="cal-chip rose">' +
      t("whoAblalar") +
      '</span><span class="cal-chip blue">' +
      t("whoAbiler") +
      '</span><span class="cal-chip ink">' +
      t("whoGenel") +
      "</span></div></section>";

    html +=
      '<div class="gundem-cols"><section class="card"><div class="toolbar"><div><div class="quiet">' +
      t("dayEvents") +
      "</div><h3 style=\"margin:4px 0 0\">" +
      escapeHtml(prettyDay) +
      '</h3></div><button class="btn" data-open-cal="">' +
      t("addEvent") +
      "</button></div>" +
      (dayEvents.length
        ? '<div class="list">' +
          dayEvents
            .map(function (event) {
              return (
                '<div class="item cal-item"><span class="dot ' +
                whoClass(event.who) +
                '"></span><div><b>' +
                escapeHtml(event.title) +
                '</b><div class="quiet">' +
                escapeHtml(whoLabel(event.who)) +
                (event.start !== event.end ? " · " + event.start.slice(8) + "–" + event.end.slice(8) : "") +
                "</div></div><button class=\"btn light tiny\" data-edit-cal=\"" +
                event.id +
                '">✎</button></div>'
              );
            })
            .join("") +
          "</div>"
        : '<p class="empty">' + t("noDayEvents") + "</p>") +
      "</section><section class=\"card notes-card\"><div class=\"toolbar\"><h3 style=\"margin:0\">" +
      t("calNotes") +
      '</h3></div><form class="addbar" data-add="gundemNotes"><textarea name="title" rows="1" placeholder="' +
      t("notePrompt") +
      '" required></textarea><button class="btn pink" type="submit">' +
      t("add") +
      "</button></form>" +
      (notes.length
        ? '<div class="list">' +
          notes
            .map(function (note) {
              if (note.id === VELI_NOTE_ID) {
                const url = veliUrl();
                return (
                  '<div class="item pinned veli-note"><div><b>' +
                  t("veliLinkNote") +
                  '</b><a class="veli-note-link" href="' +
                  escapeHtml(url) +
                  '" target="_blank" rel="noopener">' +
                  escapeHtml(url) +
                  "</a></div><button type=\"button\" class=\"btn tiny\" data-copy-veli>" +
                  t("copyVeli") +
                  "</button></div>"
                );
              }
              return (
                '<div class="item' +
                (note.done ? " done" : "") +
                (note.pinned ? " pinned" : "") +
                '"><input type="checkbox" data-check="gundemNotes" data-id="' +
                note.id +
                '" ' +
                (note.done ? "checked" : "") +
                ' /><textarea rows="1" data-title="gundemNotes" data-id="' +
                note.id +
                '">' +
                escapeHtml(note.title) +
                '</textarea><button class="btn light tiny" data-pin-note="' +
                note.id +
                '">' +
                (note.pinned ? "★" : "☆") +
                '</button><button class="btn light tiny" data-del="gundemNotes" data-id="' +
                note.id +
                '">' +
                t("delete") +
                "</button></div>"
              );
            })
            .join("") +
          "</div>"
        : '<p class="empty">' + t("emptyList") + "</p>") +
      "</section></div>";

    const tbd = tbdEvents();
    html +=
      '<section class="card" style="margin-top:12px"><div class="quiet">' +
      t("tbd") +
      "</div>" +
      (tbd.length
        ? '<div class="list" style="margin-top:8px">' +
          tbd
            .map(function (event) {
              return (
                '<div class="item"><span class="dot ' +
                whoClass(event.who) +
                '"></span><div><b>' +
                escapeHtml(event.title) +
                "</b></div><button class=\"btn light tiny\" data-edit-cal=\"" +
                event.id +
                '">✎</button></div>'
              );
            })
            .join("") +
          "</div>"
        : '<p class="empty">' + t("emptyList") + "</p>") +
      "</section>";
    return html;
  }

  function checklistView(key, title, placeholder) {
    const items = state[key];
    return (
      "<h2>" +
      title +
      '</h2><form class="addbar" data-add="' +
      key +
      '"><textarea name="title" rows="1" placeholder="' +
      placeholder +
      '" required></textarea><button class="btn" type="submit">' +
      t("add") +
      "</button></form>" +
      (items.length
        ? '<div class="list">' +
          items
            .map(function (item) {
              return (
                '<div class="item' +
                (item.done ? " done" : "") +
                '"><input type="checkbox" data-check="' +
                key +
                '" data-id="' +
                item.id +
                '" ' +
                (item.done ? "checked" : "") +
                ' /><textarea rows="1" data-title="' +
                key +
                '" data-id="' +
                item.id +
                '">' +
                escapeHtml(item.title) +
                '</textarea><button class="btn light tiny" data-del="' +
                key +
                '" data-id="' +
                item.id +
                '">' +
                t("delete") +
                "</button></div>"
              );
            })
            .join("") +
          "</div>"
        : '<p class="empty">' + t("emptyList") + "</p>")
    );
  }

  function familyView() {
    const next = upcomingEvents().slice(0, 4);
    const recent = entriesFor().slice(0, 4);
    const sum = totals(entriesFor());
    return (
      "<h2>" +
      t("family") +
      '</h2><div class="row" style="margin-bottom:12px"><a class="btn" href="#/etkinlikler">' +
      t("events") +
      '</a><a class="btn light" href="#/cetele">' +
      t("ledger") +
      "</a></div>" +
      '<div class="grid3">' +
      state.sisters
        .map(function (sister) {
          return (
            '<div class="card jump peach"><span class="quiet">' +
            t("herPage") +
            '</span><input class="name-input" data-rename="' +
            sister.id +
            '" value="' +
            escapeHtml(sister.name) +
            '" style="border:0;background:transparent;font-weight:700;font-size:18px" /><a class="btn tiny" href="#/abla/' +
            sister.id +
            '">' +
            t("open") +
            "</a></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="hero" style="margin-top:12px"><section class="card"><p class="quiet">' +
      t("events") +
      "</p>" +
      eventList(next) +
      '</section><section class="card"><p class="quiet">' +
      t("balance") +
      ": " +
      money(sum.balance) +
      "</p>" +
      ledgerPreview(recent) +
      "</section></div>" +
      '<div class="charts">' +
      chartCard("home-cat", t("byCategory")) +
      chartCard("home-month", t("byMonth")) +
      "</div>"
    );
  }

  function sisterView(sister) {
    if (!sister) return '<p class="empty">Not found.</p>';
    const next = upcomingEvents(sister.id).slice(0, 6);
    const rows = entriesFor(sister.id);
    const sum = totals(rows);
    return (
      "<h2>" +
      escapeHtml(sister.name) +
      '</h2><input class="name-input" data-rename="' +
      sister.id +
      '" value="' +
      escapeHtml(sister.name) +
      '" style="border:0;background:transparent;font-size:22px;font-weight:700;margin-bottom:10px" />' +
      '<div class="row" style="margin-bottom:12px"><button class="btn" data-open-event="' +
      sister.id +
      '">' +
      t("addEvent") +
      '</button><a class="btn light" href="#/cetele/' +
      sister.id +
      '">' +
      t("ledger") +
      "</a></div>" +
      totalsRow(sum) +
      '<div class="hero"><section class="card">' +
      eventList(next) +
      '</section><section class="card">' +
      ledgerPreview(rows.slice(0, 6)) +
      "</section></div>" +
      '<div class="charts">' +
      chartCard("s-cat", t("byCategory")) +
      chartCard("s-month", t("byMonth")) +
      "</div>"
    );
  }

  function eventsView() {
    const list = upcomingEvents();
    return (
      "<h2>" +
      t("events") +
      '</h2><div class="row" style="margin-bottom:12px"><button class="btn" data-open-event="">' +
      t("addEvent") +
      "</button></div><section class=\"card\">" +
      (list.length ? eventList(list, true) : '<p class="empty">' + t("emptyEvents") + "</p>") +
      "</section>"
    );
  }

  function ledgerView(sisterId) {
    const rows = entriesFor(sisterId);
    const sum = totals(rows);
    return (
      "<h2>" +
      t("ledger") +
      (sisterId ? " · " + escapeHtml(personLabel(sisterId)) : "") +
      '</h2><div class="row" style="margin-bottom:12px"><input id="search" placeholder="' +
      t("search") +
      '" /><button class="btn" data-open-entry="' +
      (sisterId || "") +
      '">' +
      t("addRow") +
      '</button><button class="btn light" id="export">' +
      t("exportCsv") +
      '</button><button class="btn light" id="import">' +
      t("importCsv") +
      "</button></div>" +
      totalsRow(sum) +
      tableHtml(rows) +
      '<div class="charts">' +
      chartCard("l-cat", t("byCategory")) +
      chartCard("l-month", t("byMonth")) +
      "</div>"
    );
  }

  function totalsRow(sum) {
    return (
      '<div class="totals">' +
      totalCard(t("incomeTotal"), sum.income) +
      totalCard(t("expenseTotal"), sum.expense) +
      totalCard(t("balance"), sum.balance) +
      "</div>"
    );
  }

  function totalCard(label, value) {
    return (
      '<div class="total"><span class="quiet">' +
      label +
      '</span><b class="money ' +
      (value < 0 ? "neg" : "pos") +
      '">' +
      money(value) +
      "</b></div>"
    );
  }

  function chartCard(id, label) {
    return (
      '<section class="card"><p class="quiet">' +
      label +
      '</p><div class="chart-box"><canvas id="' +
      id +
      '"></canvas></div></section>'
    );
  }

  function eventList(events, withActions) {
    if (!events.length) return '<p class="empty">' + t("emptyEvents") + "</p>";
    return (
      '<div class="list">' +
      events
        .map(function (event) {
          return (
            '<div class="item"><div><b>' +
            escapeHtml(event.title) +
            '</b><div class="quiet">' +
            escapeHtml(event.date) +
            (event.time ? " · " + escapeHtml(event.time) : "") +
            " · " +
            escapeHtml(personLabel(event.who)) +
            "</div></div>" +
            (withActions
              ? '<button class="btn light tiny" data-edit-event="' +
                event.id +
                '">✎</button><button class="btn danger tiny" data-del-event="' +
                event.id +
                '">' +
                t("delete") +
                "</button>"
              : '<a class="btn light tiny" href="#/etkinlikler">' + t("open") + "</a>") +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function ledgerPreview(rows) {
    if (!rows.length) return '<p class="empty">' + t("emptyLedger") + "</p>";
    return (
      '<div class="list">' +
      rows
        .map(function (row) {
          const signed = row.type === "gider" ? -Math.abs(Number(row.amount) || 0) : Math.abs(Number(row.amount) || 0);
          return (
            '<div class="item"><div><b>' +
            escapeHtml(row.desc) +
            '</b><div class="quiet">' +
            escapeHtml(row.date) +
            "</div></div><b class=\"money " +
            (signed < 0 ? "neg" : "pos") +
            '">' +
            money(signed) +
            "</b></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function tableHtml(rows) {
    if (!rows.length) return '<p class="empty">' + t("emptyLedger") + "</p>";
    return (
      '<div class="table-wrap"><table><thead><tr><th>' +
      t("date") +
      "</th><th>" +
      t("desc") +
      "</th><th>" +
      t("category") +
      "</th><th>" +
      t("who") +
      "</th><th>" +
      t("type") +
      "</th><th>" +
      t("amount") +
      "</th><th></th></tr></thead><tbody>" +
      rows
        .map(function (row) {
          return (
            "<tr><td><input data-edit=\"" +
            row.id +
            '" data-field="date" type="date" value="' +
            escapeHtml(row.date) +
            '" /></td><td><input data-edit="' +
            row.id +
            '" data-field="desc" value="' +
            escapeHtml(row.desc) +
            '" /></td><td>' +
            categorySelect(row) +
            "</td><td>" +
            whoSelect(row.who, row.id) +
            "</td><td>" +
            typeSelect(row) +
            '</td><td><input data-edit="' +
            row.id +
            '" data-field="amount" type="number" value="' +
            escapeHtml(row.amount) +
            '" /></td><td><button class="btn danger tiny" data-del-entry="' +
            row.id +
            '">' +
            t("delete") +
            "</button></td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }

  function categorySelect(row) {
    return (
      '<select data-edit="' +
      row.id +
      '" data-field="category">' +
      CATEGORIES.map(function (cat) {
        return "<option " + (row.category === cat ? "selected" : "") + ">" + cat + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function typeSelect(row) {
    return (
      '<select data-edit="' +
      row.id +
      '" data-field="type"><option value="gider"' +
      (row.type !== "gelir" ? " selected" : "") +
      ">" +
      t("expense") +
      '</option><option value="gelir"' +
      (row.type === "gelir" ? " selected" : "") +
      ">" +
      t("income") +
      "</option></select>"
    );
  }

  function whoSelect(current, rowId) {
    const name = rowId ? 'data-edit="' + rowId + '" data-field="who"' : 'name="who"';
    return (
      "<select " +
      name +
      '><option value="aile"' +
      (!current || current === "aile" ? " selected" : "") +
      ">" +
      t("allFamily") +
      "</option>" +
      state.sisters
        .map(function (sister) {
          return (
            '<option value="' +
            sister.id +
            '"' +
            (current === sister.id ? " selected" : "") +
            ">" +
            escapeHtml(sister.name) +
            "</option>"
          );
        })
        .join("") +
      "</select>"
    );
  }

  function modalHtml() {
    if (modal.type === "event") return eventModal();
    if (modal.type === "entry") return entryModal();
    if (modal.type === "cal") return calModal();
    return "";
  }

  function field(label, control) {
    return '<label class="field"><span>' + label + "</span>" + control + "</label>";
  }

  function calWhoSelect(current) {
    const opts = [
      ["genel", t("whoGenel")],
      ["girls", t("whoGirls")],
      ["ablalar", t("whoAblalar")],
      ["abiler", t("whoAbiler")],
    ];
    return (
      '<select name="who">' +
      opts
        .map(function (opt) {
          return (
            '<option value="' +
            opt[0] +
            '"' +
            (current === opt[0] ? " selected" : "") +
            ">" +
            opt[1] +
            "</option>"
          );
        })
        .join("") +
      "</select>"
    );
  }

  function calModal() {
    const event = modal.event;
    return (
      '<div class="modal-back"><form class="modal" id="modal-form"><h2>' +
      t("addEvent") +
      "</h2>" +
      field(t("title"), '<input name="title" required value="' + escapeHtml(event.title) + '" />') +
      '<div class="form-grid">' +
      field(t("date"), '<input name="start" type="date" value="' + escapeHtml(event.start || "") + '" />') +
      field(t("endDate"), '<input name="end" type="date" value="' + escapeHtml(event.end || event.start || "") + '" />') +
      "</div>" +
      field(t("who"), calWhoSelect(event.who || "genel")) +
      field(t("notes"), '<textarea name="note">' + escapeHtml(event.note || "") + "</textarea>") +
      '<div class="row"><button class="btn" type="submit">' +
      t("save") +
      '</button><button class="btn light" type="button" id="close-modal">' +
      t("cancel") +
      "</button>" +
      (event.id
        ? '<button class="btn danger" type="button" id="del-cal" data-id="' + event.id + '">' + t("delete") + "</button>"
        : "") +
      "</div></form></div>"
    );
  }

  function eventModal() {
    const event = modal.event;
    return (
      '<div class="modal-back"><form class="modal" id="modal-form"><h2>' +
      t("addEvent") +
      "</h2>" +
      field(t("title"), '<input name="title" required value="' + escapeHtml(event.title) + '" />') +
      '<div class="form-grid">' +
      field(t("date"), '<input name="date" type="date" required value="' + escapeHtml(event.date) + '" />') +
      field(t("time"), '<input name="time" type="time" value="' + escapeHtml(event.time) + '" />') +
      "</div>" +
      field(t("who"), whoSelect(event.who)) +
      field(t("place"), '<input name="place" value="' + escapeHtml(event.place) + '" />') +
      field(t("notes"), '<textarea name="notes">' + escapeHtml(event.notes) + "</textarea>") +
      '<div class="row"><button class="btn" type="submit">' +
      t("save") +
      '</button><button class="btn light" type="button" id="close-modal">' +
      t("cancel") +
      "</button></div></form></div>"
    );
  }

  function entryModal() {
    const row = modal.entry;
    return (
      '<div class="modal-back"><form class="modal" id="modal-form"><h2>' +
      t("addRow") +
      "</h2><div class=\"form-grid\">" +
      field(t("date"), '<input name="date" type="date" required value="' + escapeHtml(row.date) + '" />') +
      field(t("amount"), '<input name="amount" type="number" step="0.01" required value="' + escapeHtml(row.amount) + '" />') +
      "</div>" +
      field(t("desc"), '<input name="desc" required value="' + escapeHtml(row.desc) + '" />') +
      '<div class="form-grid">' +
      field(
        t("category"),
        "<select name=\"category\">" +
          CATEGORIES.map(function (cat) {
            return "<option " + (row.category === cat ? "selected" : "") + ">" + cat + "</option>";
          }).join("") +
          "</select>"
      ) +
      field(t("who"), whoSelect(row.who)) +
      "</div>" +
      field(
        t("type"),
        '<select name="type"><option value="gider">' +
          t("expense") +
          '</option><option value="gelir"' +
          (row.type === "gelir" ? " selected" : "") +
          ">" +
          t("income") +
          "</option></select>"
      ) +
      '<div class="row"><button class="btn" type="submit">' +
      t("save") +
      '</button><button class="btn light" type="button" id="close-modal">' +
      t("cancel") +
      "</button></div></form></div>"
    );
  }

  function bind(view, sister) {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.onclick = function () {
        state.lang = btn.getAttribute("data-lang");
        save();
        render();
      };
    });

    const weekly = document.getElementById("weekly-goal");
    if (weekly) {
      weekly.oninput = function () {
        state.weeklyGoal = weekly.value;
        save();
        growBox(weekly);
        flashSaved(weekly);
      };
    }

    function copyVeliLink() {
      const url = veliUrl();
      const box = document.getElementById("home-veli-url");
      if (box) box.value = url;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      } else {
        prompt(t("copyVeli"), url);
      }
    }
    document.querySelectorAll("[data-copy-veli], #copy-veli").forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        copyVeliLink();
        flashSaved(btn);
      };
    });

    document.querySelectorAll("[data-istisare]").forEach(function (box) {
      box.oninput = function () {
        state.istisare[box.getAttribute("data-istisare")] = box.value;
        save();
        growBox(box);
        flashSaved(box);
      };
    });

    document.querySelectorAll("[data-mentor-text]").forEach(function (box) {
      box.oninput = function () {
        const week = box.getAttribute("data-mentor-text");
        state.mentorGoals[week] = Object.assign({ text: "", done: false }, state.mentorGoals[week], { text: box.value });
        save();
        growBox(box);
      };
    });

    document.querySelectorAll("[data-mentor-done]").forEach(function (box) {
      box.onchange = function () {
        const week = box.getAttribute("data-mentor-done");
        state.mentorGoals[week] = Object.assign({ text: "", done: false }, state.mentorGoals[week], { done: box.checked });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-muf-title]").forEach(function (box) {
      box.oninput = function () {
        const date = box.getAttribute("data-muf-title");
        mufredatEntry(date).title = box.value;
        save();
        growBox(box);
      };
    });

    document.querySelectorAll("[data-muf-notes]").forEach(function (box) {
      box.oninput = function () {
        const date = box.getAttribute("data-muf-notes");
        const row = mufredatEntry(date);
        row.notes = box.value;
        save();
        growBox(box);
        const hint = document.querySelector('[data-saved="' + date + '"]');
        if (hint) {
          hint.textContent = t("saved");
          hint.classList.add("on");
          clearTimeout(box._saved);
          box._saved = setTimeout(function () {
            hint.classList.remove("on");
          }, 1400);
        }
      };
    });

    document.querySelectorAll("[data-muf-done]").forEach(function (box) {
      box.onchange = function () {
        mufredatEntry(box.getAttribute("data-muf-done")).done = box.checked;
        save();
        render();
      };
    });

    document.querySelectorAll("[data-muf-add]").forEach(function (form) {
      const box = form.querySelector("input, textarea");
      if (box) box.oninput = function () { growBox(box); };
      form.onsubmit = function (e) {
        e.preventDefault();
        const date = form.getAttribute("data-muf-add");
        const title = String(new FormData(form).get("title") || "").trim();
        if (!title) return;
        mufredatEntry(date).extras.push({ id: uid(), title: title });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-muf-extra]").forEach(function (box) {
      box.oninput = function () {
        const date = box.getAttribute("data-week");
        const id = box.getAttribute("data-muf-extra");
        const note = mufredatEntry(date).extras.find(function (item) {
          return item.id === id;
        });
        if (note) {
          note.title = box.value;
          save();
        }
        growBox(box);
      };
    });

    document.querySelectorAll("[data-muf-del]").forEach(function (btn) {
      btn.onclick = function () {
        const date = btn.getAttribute("data-week");
        const id = btn.getAttribute("data-muf-del");
        const row = mufredatEntry(date);
        row.extras = row.extras.filter(function (item) {
          return item.id !== id;
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-add]").forEach(function (form) {
      const box = form.querySelector("textarea, input");
      if (box) {
        box.oninput = function () {
          growBox(box);
        };
        box.onkeydown = function (e) {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
          }
        };
      }
      form.onsubmit = function (e) {
        e.preventDefault();
        const key = form.getAttribute("data-add");
        const title = String(new FormData(form).get("title") || "").trim();
        if (!title) return;
        state[key].push({ id: uid(), title: title, done: false, pinned: false });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-check]").forEach(function (box) {
      box.onchange = function () {
        const list = state[box.getAttribute("data-check")];
        const item = list.find(function (x) {
          return x.id === box.getAttribute("data-id");
        });
        if (item) {
          item.done = box.checked;
          save();
          render();
        }
      };
    });

    document.querySelectorAll("[data-title]").forEach(function (input) {
      input.oninput = function () {
        const list = state[input.getAttribute("data-title")];
        const item = list.find(function (x) {
          return x.id === input.getAttribute("data-id");
        });
        if (item) {
          item.title = input.value;
          save();
          flashSaved(input);
        }
        growBox(input);
      };
    });

    document.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.onclick = function () {
        const key = btn.getAttribute("data-del");
        const id = btn.getAttribute("data-id");
        if (id === VELI_NOTE_ID) return;
        state[key] = state[key].filter(function (x) {
          return x.id !== id;
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-contact]").forEach(function (el) {
      const apply = function () {
        const group = el.getAttribute("data-group");
        const id = el.getAttribute("data-contact");
        const field = el.getAttribute("data-field");
        const list = state.contacts[group] || [];
        const row = list.find(function (item) {
          return item.id === id;
        });
        if (row) {
          row[field] = el.value;
          save();
        }
        if (field === "homeschool" || field === "kuran") render();
        else growBox(el);
      };
      if (el.tagName === "SELECT") el.onchange = apply;
      else el.oninput = apply;
    });

    const addContact = document.getElementById("add-contact");
    if (addContact) {
      addContact.onclick = function () {
        const group = addContact.getAttribute("data-group");
        if (!state.contacts[group]) state.contacts[group] = [];
        state.contacts[group].push({
          id: uid(),
          student: "",
          parent: "",
          phone: "",
          notes: "",
          homeschool: "",
          kuran: "",
        });
        save();
        render();
      };
    }

    const exportContacts = document.getElementById("export-contacts");
    if (exportContacts) {
      exportContacts.onclick = function () {
        exportContactsCsv(exportContacts.getAttribute("data-group"));
      };
    }

    document.querySelectorAll("[data-del-contact]").forEach(function (btn) {
      btn.onclick = function () {
        const group = btn.getAttribute("data-group");
        const id = btn.getAttribute("data-del-contact");
        state.contacts[group] = (state.contacts[group] || []).filter(function (row) {
          return row.id !== id;
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-rename]").forEach(function (input) {
      input.onchange = function () {
        const found = sisterById(input.getAttribute("data-rename"));
        if (found) {
          found.name = input.value.trim() || found.name;
          save();
          render();
        }
      };
    });

    document.querySelectorAll("[data-open-event]").forEach(function (btn) {
      btn.onclick = function () {
        openEvent({ who: btn.getAttribute("data-open-event") || (sister && sister.id) || "aile" });
      };
    });

    document.querySelectorAll("[data-edit-event]").forEach(function (btn) {
      btn.onclick = function () {
        const event = state.events.find(function (item) {
          return item.id === btn.getAttribute("data-edit-event");
        });
        if (event) openEvent(event);
      };
    });

    document.querySelectorAll("[data-del-event]").forEach(function (btn) {
      btn.onclick = function () {
        state.events = state.events.filter(function (item) {
          return item.id !== btn.getAttribute("data-del-event");
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-open-entry]").forEach(function (btn) {
      btn.onclick = function () {
        openEntry({ who: btn.getAttribute("data-open-entry") || "aile" });
      };
    });

    document.querySelectorAll("[data-del-entry]").forEach(function (btn) {
      btn.onclick = function () {
        state.entries = state.entries.filter(function (item) {
          return item.id !== btn.getAttribute("data-del-entry");
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-edit]").forEach(function (input) {
      input.onchange = function () {
        const row = state.entries.find(function (item) {
          return item.id === input.getAttribute("data-edit");
        });
        if (!row) return;
        row[input.getAttribute("data-field")] = input.value;
        save();
        render();
      };
    });

    const search = document.getElementById("search");
    if (search) {
      search.oninput = function () {
        const q = search.value.toLowerCase();
        document.querySelectorAll("tbody tr").forEach(function (tr) {
          tr.style.display = tr.textContent.toLowerCase().indexOf(q) === -1 ? "none" : "";
        });
      };
    }

    const exportBtn = document.getElementById("export");
    if (exportBtn) exportBtn.onclick = exportCsv;
    const importBtn = document.getElementById("import");
    if (importBtn) importBtn.onclick = importCsv;

    const close = document.getElementById("close-modal");
    if (close) {
      close.onclick = function () {
        modal = null;
        render();
      };
    }

    document.querySelectorAll("[data-cal]").forEach(function (btn) {
      btn.onclick = function () {
        const act = btn.getAttribute("data-cal");
        if (act === "prev") {
          viewMonth -= 1;
          if (viewMonth < 0) {
            viewMonth = 11;
            viewYear -= 1;
          }
        } else if (act === "next") {
          viewMonth += 1;
          if (viewMonth > 11) {
            viewMonth = 0;
            viewYear += 1;
          }
        } else {
          const now = new Date();
          viewYear = now.getFullYear();
          viewMonth = now.getMonth();
          selectedDay = today();
        }
        render();
      };
    });

    document.querySelectorAll("[data-day]").forEach(function (el) {
      el.onclick = function (e) {
        if (e.target.closest("[data-edit-cal]")) return;
        selectedDay = el.getAttribute("data-day");
        render();
      };
    });

    document.querySelectorAll("[data-open-cal]").forEach(function (btn) {
      btn.onclick = function () {
        openCal({ start: selectedDay, end: selectedDay });
      };
    });

    document.querySelectorAll("[data-edit-cal]").forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        const event = (state.calendarEvents || []).find(function (item) {
          return item.id === btn.getAttribute("data-edit-cal");
        });
        if (event) openCal(event);
      };
    });

    document.querySelectorAll("[data-pin-note]").forEach(function (btn) {
      btn.onclick = function () {
        const note = (state.gundemNotes || []).find(function (item) {
          return item.id === btn.getAttribute("data-pin-note");
        });
        if (note) {
          note.pinned = !note.pinned;
          save();
          render();
        }
      };
    });

    const delCal = document.getElementById("del-cal");
    if (delCal) {
      delCal.onclick = function () {
        const id = delCal.getAttribute("data-id");
        state.calendarEvents = (state.calendarEvents || []).filter(function (item) {
          return item.id !== id;
        });
        modal = null;
        save();
        render();
      };
    }

    const form = document.getElementById("modal-form");
    if (form) {
      form.onsubmit = function (e) {
        e.preventDefault();
        const data = new FormData(form);
        if (modal.type === "event") {
          const next = {
            id: modal.event.id || uid(),
            title: String(data.get("title") || "").trim(),
            date: String(data.get("date") || today()),
            time: String(data.get("time") || ""),
            who: String(data.get("who") || "aile"),
            place: String(data.get("place") || ""),
            notes: String(data.get("notes") || ""),
          };
          const idx = state.events.findIndex(function (item) {
            return item.id === next.id;
          });
          if (idx >= 0) state.events[idx] = next;
          else state.events.push(next);
        } else if (modal.type === "cal") {
          const start = String(data.get("start") || "").trim();
          const end = String(data.get("end") || start).trim() || start;
          const next = {
            id: modal.event.id || uid(),
            title: String(data.get("title") || "").trim(),
            start: start,
            end: end,
            who: String(data.get("who") || "genel"),
            note: String(data.get("note") || ""),
            tbd: !start,
          };
          if (!state.calendarEvents) state.calendarEvents = [];
          const idx = state.calendarEvents.findIndex(function (item) {
            return item.id === next.id;
          });
          if (idx >= 0) state.calendarEvents[idx] = next;
          else state.calendarEvents.push(next);
        } else {
          const next = {
            id: modal.entry.id || uid(),
            date: String(data.get("date") || today()),
            desc: String(data.get("desc") || "").trim(),
            category: String(data.get("category") || "Diğer"),
            who: String(data.get("who") || "aile"),
            type: String(data.get("type") || "gider"),
            amount: Number(data.get("amount") || 0),
          };
          const idx = state.entries.findIndex(function (item) {
            return item.id === next.id;
          });
          if (idx >= 0) state.entries[idx] = next;
          else state.entries.push(next);
        }
        modal = null;
        save();
        render();
      };
    }

    growAll();
  }

  function openCal(partial) {
    modal = {
      type: "cal",
      event: Object.assign(
        { id: "", title: "", start: selectedDay, end: selectedDay, who: "genel", note: "", tbd: false },
        partial || {}
      ),
    };
    render();
  }

  function openEvent(partial) {
    modal = {
      type: "event",
      event: Object.assign({ id: uid(), title: "", date: today(), time: "", who: "aile", place: "", notes: "" }, partial || {}),
    };
    render();
  }

  function openEntry(partial) {
    modal = {
      type: "entry",
      entry: Object.assign({ id: uid(), date: today(), desc: "", category: "Diğer", who: "aile", type: "gider", amount: "" }, partial || {}),
    };
    render();
  }

  function exportContactsCsv(groupId) {
    const group = groupById(groupId);
    const header = ["student", "parent", "afterschool", "kuran", "phone", "notes"];
    const fields = ["student", "parent", "homeschool", "kuran", "phone", "notes"];
    const lines = [header.join(",")].concat(
      ((state.contacts[group.id] || []).filter(function (row) {
        return row.student || row.parent || row.phone || row.notes || row.homeschool || row.kuran;
      })).map(function (row) {
        return fields
          .map(function (key) {
            return csvEscape(row[key]);
          })
          .join(",");
      })
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = group.id + "-rehber.csv";
    a.click();
  }

  function csvEscape(value) {
    const text = String(value == null ? "" : value);
    if (/[",\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  }

  function exportCsv() {
    const header = ["date", "desc", "category", "who", "type", "amount"];
    const lines = [header.join(",")].concat(
      state.entries.map(function (row) {
        return header
          .map(function (key) {
            return csvEscape(row[key]);
          })
          .join(",");
      })
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cetele.csv";
    a.click();
  }

  function importCsv() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".csv,text/csv";
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);
      fileInput.onchange = function () {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
          String(reader.result)
            .split(/\r?\n/)
            .slice(1)
            .forEach(function (line) {
              if (!line.trim()) return;
              const parts = line.split(",").map(function (part) {
                return part.replace(/^"|"$/g, "").replace(/""/g, '"');
              });
              state.entries.push({
                id: uid(),
                date: parts[0] || today(),
                desc: parts[1] || "",
                category: parts[2] || "Diğer",
                who: parts[3] || "aile",
                type: parts[4] === "gelir" ? "gelir" : "gider",
                amount: Number(parts[5] || 0),
              });
            });
          save();
          render();
        };
        reader.readAsText(file);
        fileInput.value = "";
      };
    }
    fileInput.click();
  }

  function drawCharts(sisterId, isHome) {
    if (typeof Chart === "undefined") return;
    const rows = entriesFor(isHome ? null : sisterId);
    const catCanvas = document.getElementById("home-cat") || document.getElementById("s-cat") || document.getElementById("l-cat");
    const monthCanvas = document.getElementById("home-month") || document.getElementById("s-month") || document.getElementById("l-month");
    if (!catCanvas || !monthCanvas) return;
    const byCat = {};
    const byMonth = {};
    rows.forEach(function (row) {
      if (row.type === "gelir") return;
      const amount = Math.abs(Number(row.amount) || 0);
      byCat[row.category || "Diğer"] = (byCat[row.category || "Diğer"] || 0) + amount;
      const month = (row.date || "").slice(0, 7) || "—";
      byMonth[month] = (byMonth[month] || 0) + amount;
    });
    const colors = ["#ffc2c7", "#ffd7c2", "#cfeedd", "#ffe9a8", "#e25c5c", "#7a706c", "#2f7a4f"];
    charts.push(
      new Chart(catCanvas, {
        type: "doughnut",
        data: { labels: Object.keys(byCat), datasets: [{ data: Object.values(byCat), backgroundColor: colors }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
      })
    );
    const months = Object.keys(byMonth).sort();
    charts.push(
      new Chart(monthCanvas, {
        type: "bar",
        data: {
          labels: months,
          datasets: [{ label: t("expense"), data: months.map(function (k) { return byMonth[k]; }), backgroundColor: "#ffc2c7" }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      })
    );
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("resize", growAll);
  render();
})();
