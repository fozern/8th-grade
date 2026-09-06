(function (root) {
  const STORE = "core-es-ziyaret-v1";
  const LAST_KEY = "core-es-ziyaret-last";
  const CLOUD_URL = "https://mantledb.sh/v2/coreesziyaret/board";
  const CLOUD_KEY = "9990098c2410c4282831917e773f023e1cde6246b01e2cd2dc16fd9c26de3a93";
  const ABLAS = [
    { id: "asli", name: "Asli", short: "Asli" },
    { id: "nazlican", name: "Nazlican", short: "Nazlican" },
    { id: "yagmur", name: "Yağmur Sena", short: "Yağmur" },
  ];
  const DEFAULT_TIMES = {
    asli: ["10:00", "11:00", "12:00"],
    nazlican: ["13:00", "14:00", "15:00"],
    yagmur: ["16:00", "17:00", "18:00"],
  };
  const I18N = {
    tr: {
      title: "Veli Ziyareti",
      tag: "parent / mentor ziyaret günleri",
      pickDay: "Renkli bir güne dokun, saatini seç, ismini yaz.",
      adminTag: "Ablayı seç, günlere dokun — her ablanın rengi ve 3 saati olsun",
      today: "Bugün",
      copy: "Veli linkini kopyala",
      copied: "kopyalandı ✓",
      export: "Excel'e aktar",
      empty: "bu ay henüz ziyaret günü yok",
      noVisit: "bu günde ziyaret yok",
      past: "geçmiş gün",
      full: "Dolu",
      open: "Müsait",
      pickTime: "3 saatten birini seç",
      veliSlots: "Veliler bunlardan birini seçer",
      parent: "Veli adı",
      student: "Öğrenci adı",
      phone: "Telefon (isteğe bağlı)",
      book: "Kaydol",
      booked: "Kaydın alındı",
      cancelMine: "Kayıdımı sil",
      assign: "Bu günü kime boyayalım?",
      times: "Bu günün 3 saati",
      hourN: ". saat",
      note: "Gün notu (veliler görür)",
      saveDay: "Günü kaydet",
      clearDay: "Günü kaldır",
      remove: "Sil",
      capacity: "Her saatte kaç veli?",
      defaults: "Abla saatleri",
      list: "Kayıtlar",
      wa: "WhatsApp ile bildir",
      share: "WhatsApp'tan gönder",
      needLink: "Bu sayfa eksik. Ablalarından doğru veli linkini iste.",
      syncOn: "kayıtlar paylaşılıyor",
      syncOff: "paylaşım bağlanıyor…",
      taken: "bu saat dolu — başka saat seç",
      needName: "veli ve öğrenci adını yaz",
      slotsLeft: "boş",
      paint: "Boyamak için bir abla seç",
      painting: "boyuyor",
      switchAbla: "Ablayı değiştir",
      addTime: "+ saat",
      prune: "Boş geçmiş günleri sil",
      print: "Yazdır",
      search: "ara: veli / öğrenci / abla",
      url: "Veli linki — sadece bunu gönder",
      mine: "Benim kayıtlarım",
      allFull: "dolu",
      jump: "Ay",
      preparing: "link hazırlanıyor…",
      saved: "kaydedildi ✓",
    },
    en: {
      title: "Parent visits",
      tag: "parent / mentor visit days",
      pickDay: "Tap a colored day, pick a time, write your name.",
      adminTag: "Pick an abla, tap days — each gets her color and 3 times",
      today: "Today",
      copy: "Copy parent link",
      copied: "copied ✓",
      export: "Export Excel",
      empty: "no visit days this month yet",
      noVisit: "no visit this day",
      past: "past day",
      full: "Full",
      open: "Open",
      pickTime: "Pick one of the 3 times",
      veliSlots: "Parents pick one of these",
      parent: "Parent name",
      student: "Student name",
      phone: "Phone (optional)",
      book: "Sign up",
      booked: "You’re booked",
      cancelMine: "Cancel my signup",
      assign: "Who is this day for?",
      times: "This day's 3 times",
      hourN: ". time",
      note: "Day note (parents see this)",
      saveDay: "Save day",
      clearDay: "Remove day",
      remove: "Remove",
      capacity: "Families per time?",
      defaults: "Abla hours",
      list: "Signups",
      wa: "Notify on WhatsApp",
      share: "Send on WhatsApp",
      needLink: "This page is missing the shared link. Ask for the parent link.",
      syncOn: "signups are shared",
      syncOff: "connecting…",
      taken: "that time is full — pick another",
      needName: "write parent and student names",
      slotsLeft: "open",
      paint: "Pick an abla to paint days",
      painting: "painting",
      switchAbla: "Change abla",
      addTime: "+ time",
      prune: "Clear empty past days",
      print: "Print",
      search: "search: parent / student / abla",
      url: "Parent link — send only this",
      mine: "My bookings",
      allFull: "full",
      jump: "Month",
      preparing: "preparing link…",
      saved: "saved ✓",
    },
  };

  let board = defaultBoard();
  let viewYear = 2026;
  let viewMonth = 8;
  let selected = "";
  let pickedTime = "";
  let paintAbla = "";
  let queryText = "";
  let admin = false;
  let host = null;
  let poll = null;
  let lang = "tr";
  let toastTimer = 0;
  let mine = loadMine();
  let lastNames = loadLast();
  let cloudOk = false;
  let pushAgain = false;
  let pushChain = Promise.resolve();

  function t(key) {
    return (I18N[lang] || I18N.tr)[key] || key;
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function today() {
    return iso(new Date());
  }

  function ym(y, m) {
    return y + "-" + String(m + 1).padStart(2, "0");
  }

  function ablaById(id) {
    return (
      ABLAS.find(function (a) {
        return a.id === id;
      }) || ABLAS[0]
    );
  }

  function defaultBoard() {
    return {
      capacity: 1,
      times: JSON.parse(JSON.stringify(DEFAULT_TIMES)),
      days: {},
      updated: 0,
    };
  }

  function queryBoard() {
    try {
      return new URLSearchParams(location.search).get("b") || "";
    } catch (e) {
      return "";
    }
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) board = Object.assign(defaultBoard(), JSON.parse(raw));
      if (!board.times) board.times = JSON.parse(JSON.stringify(DEFAULT_TIMES));
      if (!board.days) board.days = {};
      if (!board.capacity) board.capacity = 1;
    } catch (e) {}
  }

  function saveLocal() {
    board.updated = Date.now();
    try {
      localStorage.setItem(STORE, JSON.stringify(board));
    } catch (e) {}
  }

  function loadMine() {
    try {
      return JSON.parse(localStorage.getItem(STORE + "-mine") || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveMine() {
    localStorage.setItem(STORE + "-mine", JSON.stringify(mine));
  }

  function loadLast() {
    try {
      return JSON.parse(localStorage.getItem(LAST_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveLast() {
    localStorage.setItem(LAST_KEY, JSON.stringify(lastNames));
  }

  function siteDir() {
    let dir = location.pathname.replace(/index\.html$/i, "").replace(/ziyaret\.html$/i, "");
    if (!dir.endsWith("/")) dir += "/";
    return location.origin + dir;
  }

  function isShared() {
    return cloudOk;
  }

  function veliLink() {
    return siteDir() + "ziyaret.html";
  }

  function encodeConfig() {
    const compact = { c: board.capacity, t: board.times, d: {} };
    Object.keys(board.days).forEach(function (k) {
      const day = board.days[k];
      compact.d[k] = [day.abla, (day.times || []).join(","), day.note || ""];
    });
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(compact))))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
    } catch (e) {
      return "";
    }
  }

  function decodeConfig(raw) {
    if (!raw) return null;
    try {
      const pad = raw + "===".slice((raw.length + 3) % 4);
      const json = decodeURIComponent(escape(atob(pad.replace(/-/g, "+").replace(/_/g, "/"))));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function applyConfig(compact) {
    if (!compact) return;
    if (compact.c) board.capacity = Number(compact.c) || 1;
    if (compact.t) board.times = Object.assign(board.times, compact.t);
    Object.keys(compact.d || {}).forEach(function (k) {
      const row = compact.d[k];
      if (!board.days[k]) {
        board.days[k] = {
          abla: row[0],
          times: String(row[1] || "")
            .split(",")
            .filter(Boolean),
          note: row[2] || "",
          signups: [],
        };
      } else {
        board.days[k].abla = row[0];
        board.days[k].times = String(row[1] || "")
          .split(",")
          .filter(Boolean);
        if (row[2]) board.days[k].note = row[2];
        if (!board.days[k].signups) board.days[k].signups = [];
      }
    });
  }

  function dayOf(dateStr) {
    return board.days[dateStr] || null;
  }

  function ensureDay(dateStr, ablaId) {
    if (!board.days[dateStr]) {
      board.days[dateStr] = {
        abla: ablaId,
        times: (board.times[ablaId] || DEFAULT_TIMES.asli).slice(),
        note: "",
        signups: [],
      };
    } else {
      board.days[dateStr].abla = ablaId;
      if (!board.days[dateStr].times || !board.days[dateStr].times.length) {
        board.days[dateStr].times = (board.times[ablaId] || DEFAULT_TIMES.asli).slice();
      }
      if (!board.days[dateStr].signups) board.days[dateStr].signups = [];
    }
    return board.days[dateStr];
  }

  function normTime(value) {
    const m = String(value || "").match(/^(\d{1,2}):(\d{2})/);
    if (!m) return "";
    return String(Number(m[1])).padStart(2, "0") + ":" + m[2];
  }

  function timeChoices(current) {
    const out = [];
    let h;
    let m;
    for (h = 8; h <= 22; h++) {
      for (m = 0; m < 60; m += 30) {
        out.push(String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"));
      }
    }
    const cur = normTime(current);
    if (cur && out.indexOf(cur) < 0) out.unshift(cur);
    return out;
  }

  function timeSelect(i, value) {
    const cur = normTime(value);
    return (
      '<label class="zv-timesel"><span>' +
      (i + 1) +
      t("hourN") +
      '</span><select data-zv-edit-time="' +
      i +
      '">' +
      timeChoices(cur)
        .map(function (tm) {
          return '<option value="' + tm + '"' + (tm === cur ? " selected" : "") + ">" + tm + "</option>";
        })
        .join("") +
      "</select></label>"
    );
  }

  function adminTimesHtml(day) {
    const editTimes = (day.times && day.times.length ? day.times : ["10:00", "11:00", "12:00"]).slice();
    while (editTimes.length < 3) editTimes.push("16:00");
    return (
      '<p class="zv-lab">' +
      t("times") +
      '</p><div class="zv-timegrid">' +
      editTimes
        .map(function (time, i) {
          return timeSelect(i, time);
        })
        .join("") +
      '</div><button type="button" class="btn light tiny" id="zv-add-time">' +
      t("addTime") +
      "</button>"
    );
  }

  function taken(dateStr, time) {
    const day = dayOf(dateStr);
    if (!day) return 0;
    return (day.signups || []).filter(function (s) {
      return s.time === time;
    }).length;
  }

  function isFull(dateStr, time) {
    return taken(dateStr, time) >= (board.capacity || 1);
  }

  function dayFull(dateStr) {
    const day = dayOf(dateStr);
    if (!day || !(day.times || []).length) return false;
    return day.times.every(function (time) {
      return isFull(dateStr, time);
    });
  }

  function firstOpen(dateStr) {
    const day = dayOf(dateStr);
    if (!day) return "";
    let i;
    for (i = 0; i < (day.times || []).length; i++) {
      if (!isFull(dateStr, day.times[i])) return day.times[i];
    }
    return "";
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

  function prettyDate(dateStr) {
    return new Date(dateStr + "T12:00:00").toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  function monthName() {
    return new Date(viewYear, viewMonth, 1).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      month: "long",
      year: "numeric",
    });
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function dots(dateStr) {
    const day = dayOf(dateStr);
    if (!day) return "";
    return (day.times || [])
      .map(function (time) {
        return '<i class="zv-dot' + (isFull(dateStr, time) ? " full" : "") + '"></i>';
      })
      .join("");
  }

  function toast(msg) {
    const el = host && host.querySelector(".zv-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("on");
    }, 1800);
  }

  function busy() {
    const el = document.activeElement;
    return !!(host && el && host.contains(el) && /INPUT|TEXTAREA|SELECT/.test(el.tagName));
  }

  function boardSig() {
    return JSON.stringify({
      c: board.capacity,
      t: board.times,
      d: board.days,
      u: board.updated,
    });
  }

  function allSignups() {
    const rows = [];
    Object.keys(board.days)
      .sort()
      .forEach(function (dateStr) {
        const day = board.days[dateStr];
        (day.signups || []).forEach(function (s) {
          rows.push({
            date: dateStr,
            abla: day.abla,
            time: s.time,
            parent: s.parent,
            student: s.student,
            phone: s.phone || "",
            id: s.id,
          });
        });
      });
    return rows;
  }

  function mySignup(dateStr, time) {
    return mine.find(function (m) {
      return m.date === dateStr && (!time || m.time === time);
    });
  }

  function waLink(dateStr, row) {
    const day = dayOf(dateStr) || { abla: "asli" };
    const text =
      "Veli ziyareti: " +
      prettyDate(dateStr) +
      " " +
      row.time +
      " — " +
      ablaById(day.abla).name +
      " Abla. Veli: " +
      row.parent +
      " / Öğrenci: " +
      row.student;
    return "https://wa.me/?text=" + encodeURIComponent(text);
  }

  function render() {
    if (!host) return;
    const now = today();
    const weekdays =
      lang === "tr" ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const cells = monthCells(viewYear, viewMonth);
    const visits = Object.keys(board.days).filter(function (k) {
      return k.slice(0, 7) === ym(viewYear, viewMonth);
    });

    host.innerHTML =
      '<div class="zv-wrap' +
      (admin ? " admin" : " veli") +
      (paintAbla ? " painting" : "") +
      '"><div class="zv-top"><div><h2>' +
      t("title") +
      '</h2><p class="quiet">' +
      (admin ? t("adminTag") : t("pickDay")) +
      '</p></div><div class="lang">' +
      '<button type="button" data-zv-lang="tr" class="' +
      (lang === "tr" ? "active" : "") +
      '">TR</button><button type="button" data-zv-lang="en" class="' +
      (lang === "en" ? "active" : "") +
      '">EN</button></div></div>' +
      '<div class="zv-legend">' +
      ABLAS.map(function (a) {
        return (
          '<button type="button" class="zv-pill ' +
          a.id +
          (paintAbla === a.id ? " on" : "") +
          '" data-zv-paint="' +
          a.id +
          '"' +
          (admin ? "" : " disabled") +
          ">" +
          esc(a.name) +
          (paintAbla === a.id ? " · " + t("painting") : "") +
          "</button>"
        );
      }).join("") +
      '<span class="zv-sync">' +
      (isShared() ? t("syncOn") : t("syncOff")) +
      "</span></div>" +
      (admin
        ? '<p class="quiet zv-hint">' +
          (paintAbla ? ablaById(paintAbla).name + " · " + t("painting") : t("paint")) +
          "</p>"
        : "") +
      (admin ? toolsHtml() : "") +
      '<div class="zv-layout"><section class="zv-cal card"><div class="cal-nav"><button type="button" class="btn light tiny" data-zv-nav="-1">‹</button><b>' +
      esc(monthName()) +
      '</b><button type="button" class="btn light tiny" data-zv-nav="1">›</button><input class="zv-month" id="zv-month" type="month" value="' +
      ym(viewYear, viewMonth) +
      '" aria-label="' +
      t("jump") +
      '" /><button type="button" class="btn light tiny" id="zv-today">' +
      t("today") +
      "</button></div><div class=\"cal-week\">" +
      weekdays
        .map(function (d) {
          return "<span>" + d + "</span>";
        })
        .join("") +
      '</div><div class="zv-grid">' +
      cells
        .map(function (n) {
          if (!n) return '<div class="zv-cell empty"></div>';
          const dateStr = iso(new Date(viewYear, viewMonth, n));
          const day = dayOf(dateStr);
          const past = dateStr < now;
          const packed = day && dayFull(dateStr);
          return (
            '<button type="button" class="zv-cell' +
            (dateStr === now ? " today" : "") +
            (dateStr === selected ? " on" : "") +
            (day ? " " + day.abla : "") +
            (past ? " past" : "") +
            (packed ? " packed" : "") +
            '" data-zv-day="' +
            dateStr +
            '"' +
            (!admin && !day ? " disabled" : "") +
            '><span class="cal-num">' +
            n +
            "</span>" +
            (day
              ? '<span class="zv-abla">' +
                esc(ablaById(day.abla).short) +
                "</span><span class=\"zv-dots\">" +
                dots(dateStr) +
                "</span>" +
                (packed ? '<span class="zv-fullmark">' + t("allFull") + "</span>" : "")
              : "") +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      (visits.length ? "" : '<p class="empty">' + t("empty") + "</p>") +
      "</section>" +
      panelHtml(now) +
      "</div>" +
      mineHtml() +
      (admin ? settingsHtml() + listHtml() : "") +
      '<div class="zv-toast"></div></div>';
    bindUi();
  }

  function toolsHtml() {
    return (
      '<div class="zv-tools"><div class="row"><button type="button" class="btn" id="zv-copy">' +
      t("copy") +
      '</button><a class="btn pink" id="zv-share" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=' +
      encodeURIComponent("Veli ziyareti kaydı: " + veliLink()) +
      '">' +
      t("share") +
      '</a><button type="button" class="btn light" id="zv-export">' +
      t("export") +
      '</button><button type="button" class="btn light" id="zv-print">' +
      t("print") +
      '</button><button type="button" class="btn light" id="zv-prune">' +
      t("prune") +
      '</button></div><label class="field zv-linkbox"><span>' +
      t("url") +
      '</span><input id="zv-url" readonly value="' +
      esc(veliLink()) +
      '" /></label></div>'
    );
  }

  function panelHtml(now) {
    if (!selected) {
      return '<aside class="zv-panel card"><p class="quiet">' + t("pickDay") + "</p></aside>";
    }
    const day = dayOf(selected);
    const past = selected < now;
    if (!day && !admin) {
      return (
        '<aside class="zv-panel card"><b>' +
        esc(prettyDate(selected)) +
        '</b><p class="quiet">' +
        t("noVisit") +
        "</p></aside>"
      );
    }
    if (!day && admin) {
      return (
        '<aside class="zv-panel card"><b>' +
        esc(prettyDate(selected)) +
        "</b><p>" +
        t("assign") +
        '</p><div class="zv-ablas">' +
        ABLAS.map(function (a) {
          return '<button type="button" class="zv-pick ' + a.id + '" data-zv-assign="' + a.id + '">' + esc(a.name) + "</button>";
        }).join("") +
        "</div></aside>"
      );
    }
    const abla = ablaById(day.abla);
    let html =
      '<aside class="zv-panel card ' +
      day.abla +
      '"><div class="zv-kicker">' +
      esc(abla.name) +
      " Abla</div><h3>" +
      esc(prettyDate(selected)) +
      "</h3>" +
      (day.note ? '<p class="quiet">' + esc(day.note) + "</p>" : "") +
      (past && !admin ? '<p class="quiet">' + t("past") + "</p>" : "") +
      (admin
        ? '<p class="zv-lab">' +
          t("switchAbla") +
          '</p><div class="zv-ablas zv-mini">' +
          ABLAS.map(function (a) {
            return (
              '<button type="button" class="zv-pick ' +
              a.id +
              (day.abla === a.id ? " on" : "") +
              '" data-zv-assign="' +
              a.id +
              '">' +
              esc(a.short) +
              "</button>"
            );
          }).join("") +
          "</div>" +
          adminTimesHtml(day)
        : "") +
      '<p class="zv-lab">' +
      (admin ? t("veliSlots") : t("pickTime")) +
      '</p><div class="zv-slots">';
    (day.times || []).forEach(function (time) {
      const count = taken(selected, time);
      const full = count >= (board.capacity || 1);
      const names = (day.signups || [])
        .filter(function (s) {
          return s.time === time;
        })
        .map(function (s) {
          return s.parent + (s.student ? " · " + s.student : "");
        });
      html +=
        '<button type="button" class="zv-slot' +
        (full ? " full" : "") +
        (pickedTime === time ? " on" : "") +
        '" data-zv-time="' +
        esc(time) +
        '"' +
        (full && !admin ? " disabled" : "") +
        "><b>" +
        esc(time) +
        "</b><span>" +
        (full ? t("full") : t("open") + " · " + (board.capacity - count) + " " + t("slotsLeft")) +
        "</span>" +
        (admin && names.length ? "<small>" + esc(names.join(" · ")) + "</small>" : "") +
        "</button>";
    });
    html += "</div>";
    if (admin) {
      html +=
        '<label class="field" style="margin-top:12px"><span>' +
        t("note") +
        '</span><input id="zv-note" value="' +
        esc(day.note || "") +
        '" /></label><div class="row" style="margin-top:8px"><button type="button" class="btn light" id="zv-clear-day">' +
        t("clearDay") +
        "</button></div>";
      (day.signups || []).forEach(function (s) {
        html +=
          '<div class="item"><div><b>' +
          esc(s.parent) +
          '</b><div class="quiet">' +
          esc(s.student) +
          " · " +
          esc(s.time) +
          (s.phone ? " · " + esc(s.phone) : "") +
          "</div></div><button type=\"button\" class=\"btn light tiny\" data-zv-del-s=\"" +
          s.id +
          '">' +
          t("remove") +
          "</button></div>";
      });
    } else if (!past) {
      const mineHere = mySignup(selected);
      if (mineHere) {
        html +=
          '<div class="zv-ok"><b>' +
          t("booked") +
          "</b><p>" +
          esc(mineHere.time) +
          " · " +
          esc(mineHere.parent) +
          " · " +
          esc(mineHere.student) +
          '</p><div class="row"><a class="btn pink" target="_blank" rel="noopener noreferrer" href="' +
          esc(waLink(selected, mineHere)) +
          '">' +
          t("wa") +
          '</a><button type="button" class="btn light" id="zv-cancel">' +
          t("cancelMine") +
          "</button></div></div>";
      } else {
        html +=
          '<form class="zv-form" id="zv-form"><input name="parent" autocomplete="name" required placeholder="' +
          t("parent") +
          '" value="' +
          esc(lastNames.parent || "") +
          '" /><input name="student" required placeholder="' +
          t("student") +
          '" value="' +
          esc(lastNames.student || "") +
          '" /><input name="phone" inputmode="tel" placeholder="' +
          t("phone") +
          '" value="' +
          esc(lastNames.phone || "") +
          '" /><button class="btn pink" type="submit">' +
          t("book") +
          "</button></form>";
      }
    }
    return html + "</aside>";
  }

  function settingsHtml() {
    return (
      '<section class="card zv-settings"><div class="toolbar"><h3 style="margin:0">' +
      t("defaults") +
      '</h3><label class="quiet">' +
      t("capacity") +
      ' <input id="zv-cap" type="number" min="1" max="8" value="' +
      (board.capacity || 1) +
      '" /></label></div><div class="zv-defaults">' +
      ABLAS.map(function (a) {
        const times = board.times[a.id] || DEFAULT_TIMES[a.id];
        return (
          '<div class="zv-def ' +
          a.id +
          '"><b>' +
          esc(a.name) +
          "</b>" +
          [0, 1, 2]
            .map(function (i) {
              return (
                '<select data-zv-def="' +
                a.id +
                '" data-i="' +
                i +
                '">' +
                timeChoices(times[i])
                  .map(function (tm) {
                    return '<option value="' + tm + '"' + (tm === normTime(times[i]) ? " selected" : "") + ">" + tm + "</option>";
                  })
                  .join("") +
                "</select>"
              );
            })
            .join("") +
          "</div>"
        );
      }).join("") +
      "</div></section>"
    );
  }

  function filteredSignups() {
    const q = queryText.trim().toLowerCase();
    return allSignups().filter(function (r) {
      if (r.date < today()) return false;
      if (!q) return true;
      return (
        (r.parent || "").toLowerCase().indexOf(q) >= 0 ||
        (r.student || "").toLowerCase().indexOf(q) >= 0 ||
        (r.phone || "").toLowerCase().indexOf(q) >= 0 ||
        ablaById(r.abla).name.toLowerCase().indexOf(q) >= 0 ||
        r.date.indexOf(q) >= 0
      );
    });
  }

  function listInner() {
    const rows = filteredSignups();
    if (!rows.length) return '<p class="empty">' + t("empty") + "</p>";
    return (
      '<div class="list">' +
      rows
        .map(function (r) {
          return (
            '<div class="item"><div><b>' +
            esc(r.parent) +
            " · " +
            esc(r.student) +
            '</b><div class="quiet">' +
            esc(prettyDate(r.date)) +
            " · " +
            esc(r.time) +
            " · " +
            esc(ablaById(r.abla).name) +
            "</div></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function listHtml() {
    return (
      '<section class="card zv-listcard" style="margin-top:12px"><div class="toolbar"><h3 style="margin:0">' +
      t("list") +
      '</h3><input id="zv-q" placeholder="' +
      t("search") +
      '" value="' +
      esc(queryText) +
      '" /></div><div id="zv-list">' +
      listInner() +
      "</div></section>"
    );
  }

  function mineHtml() {
    if (admin) return "";
    const rows = mine
      .filter(function (m) {
        return m.date >= today() && dayOf(m.date);
      })
      .sort(function (a, b) {
        return (a.date + a.time).localeCompare(b.date + b.time);
      });
    if (!rows.length) return "";
    return (
      '<section class="card zv-mine"><h3 style="margin:0 0 10px">' +
      t("mine") +
      "</h3><div class=\"list\">" +
      rows
        .map(function (r) {
          const day = dayOf(r.date);
          return (
            '<div class="item"><div><b>' +
            esc(prettyDate(r.date)) +
            " · " +
            esc(r.time) +
            '</b><div class="quiet">' +
            esc(ablaById(day.abla).name) +
            " Abla · " +
            esc(r.student) +
            "</div></div></div>"
          );
        })
        .join("") +
      "</div></section>"
    );
  }

  function bindUi() {
    host.querySelectorAll("[data-zv-lang]").forEach(function (btn) {
      btn.onclick = function () {
        lang = btn.getAttribute("data-zv-lang");
        render();
      };
    });
    host.querySelectorAll("[data-zv-nav]").forEach(function (btn) {
      btn.onclick = function () {
        viewMonth += Number(btn.getAttribute("data-zv-nav"));
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear -= 1;
        }
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear += 1;
        }
        render();
      };
    });
    const monthInput = host.querySelector("#zv-month");
    if (monthInput) {
      monthInput.onchange = function () {
        const parts = (monthInput.value || "").split("-");
        if (parts.length === 2) {
          viewYear = Number(parts[0]);
          viewMonth = Number(parts[1]) - 1;
          render();
        }
      };
    }
    const todayBtn = host.querySelector("#zv-today");
    if (todayBtn) {
      todayBtn.onclick = function () {
        const n = new Date();
        viewYear = n.getFullYear();
        viewMonth = n.getMonth();
        selected = today();
        render();
      };
    }
    host.querySelectorAll("[data-zv-paint]").forEach(function (btn) {
      btn.onclick = function () {
        if (!admin) return;
        const id = btn.getAttribute("data-zv-paint");
        paintAbla = paintAbla === id ? "" : id;
        render();
      };
    });
    host.querySelectorAll("[data-zv-day]").forEach(function (btn) {
      btn.onclick = function () {
        selected = btn.getAttribute("data-zv-day");
        pickedTime = "";
        if (admin && paintAbla) {
          ensureDay(selected, paintAbla);
          persist();
        }
        if (!admin) pickedTime = firstOpen(selected);
        render();
      };
    });
    host.querySelectorAll("[data-zv-assign]").forEach(function (btn) {
      btn.onclick = function () {
        ensureDay(selected, btn.getAttribute("data-zv-assign"));
        persist();
        render();
      };
    });
    host.querySelectorAll("[data-zv-time]").forEach(function (btn) {
      btn.onclick = function () {
        if (admin) return;
        pickedTime = btn.getAttribute("data-zv-time");
        render();
      };
    });
    const form = host.querySelector("#zv-form");
    if (form) {
      form.onsubmit = function (e) {
        e.preventDefault();
        const data = new FormData(form);
        const parent = String(data.get("parent") || "").trim();
        const student = String(data.get("student") || "").trim();
        const phone = String(data.get("phone") || "").trim();
        if (!parent || !student) return toast(t("needName"));
        if (!pickedTime) return toast(t("pickTime"));
        if (isFull(selected, pickedTime)) return toast(t("taken"));
        const day = dayOf(selected);
        if (!day) return;
        const row = { id: uid(), time: pickedTime, parent: parent, student: student, phone: phone, at: Date.now() };
        day.signups.push(row);
        mine.push({ id: row.id, date: selected, time: pickedTime, parent: parent, student: student });
        lastNames = { parent: parent, student: student, phone: phone };
        saveLast();
        saveMine();
        persist();
        toast(t("booked"));
        render();
      };
    }
    const cancel = host.querySelector("#zv-cancel");
    if (cancel) {
      cancel.onclick = function () {
        const mineHere = mySignup(selected);
        if (!mineHere) return;
        const day = dayOf(selected);
        if (day) {
          day.signups = (day.signups || []).filter(function (s) {
            return s.id !== mineHere.id;
          });
        }
        mine = mine.filter(function (m) {
          return m.id !== mineHere.id;
        });
        saveMine();
        persist();
        render();
      };
    }
    const noteBox = host.querySelector("#zv-note");
    if (noteBox) {
      noteBox.oninput = function () {
        const day = dayOf(selected);
        if (!day) return;
        day.note = noteBox.value;
        persist();
      };
    }
    host.querySelectorAll("[data-zv-edit-time]").forEach(function (input) {
      input.onchange = function () {
        const day = dayOf(selected);
        if (!day) return;
        const times = [];
        host.querySelectorAll("[data-zv-edit-time]").forEach(function (box) {
          const val = normTime(box.value);
          if (val) times.push(val);
        });
        if (times.length) day.times = times;
        persist();
        toast(t("saved"));
        render();
      };
    });
    const addTime = host.querySelector("#zv-add-time");
    if (addTime) {
      addTime.onclick = function () {
        const day = dayOf(selected);
        if (!day) return;
        day.times = (day.times || []).concat(["16:00"]);
        persist();
        render();
      };
    }
    const clearDay = host.querySelector("#zv-clear-day");
    if (clearDay) {
      clearDay.onclick = function () {
        delete board.days[selected];
        persist();
        render();
      };
    }
    host.querySelectorAll("[data-zv-del-s]").forEach(function (btn) {
      btn.onclick = function () {
        const day = dayOf(selected);
        const id = btn.getAttribute("data-zv-del-s");
        day.signups = (day.signups || []).filter(function (s) {
          return s.id !== id;
        });
        persist();
        render();
      };
    });
    const cap = host.querySelector("#zv-cap");
    if (cap) {
      cap.onchange = function () {
        board.capacity = Math.max(1, Number(cap.value) || 1);
        persist();
      };
    }
    host.querySelectorAll("[data-zv-def]").forEach(function (input) {
      input.onchange = function () {
        const id = input.getAttribute("data-zv-def");
        const i = Number(input.getAttribute("data-i"));
        if (!board.times[id]) board.times[id] = DEFAULT_TIMES[id].slice();
        board.times[id][i] = input.value;
        persist();
      };
    });
    const q = host.querySelector("#zv-q");
    if (q) {
      q.oninput = function () {
        queryText = q.value;
        const box = host.querySelector("#zv-list");
        if (box) box.innerHTML = listInner();
      };
    }
    const urlBox = host.querySelector("#zv-url");
    if (urlBox) {
      urlBox.onclick = function () {
        urlBox.select();
      };
    }
    const copy = host.querySelector("#zv-copy");
    if (copy) {
      copy.onclick = function () {
        toast(t("preparing"));
        ensureCloud().then(function () {
          const url = veliLink();
          if (urlBox) urlBox.value = url;
          const share = host.querySelector("#zv-share");
          if (share) share.href = "https://wa.me/?text=" + encodeURIComponent("Veli ziyareti kaydı: " + url);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              toast(t("copied"));
            });
          } else {
            prompt(t("copy"), url);
          }
          render();
        });
      };
    }
    const exp = host.querySelector("#zv-export");
    if (exp) exp.onclick = exportCsv;
    const printBtn = host.querySelector("#zv-print");
    if (printBtn) {
      printBtn.onclick = function () {
        window.print();
      };
    }
    const prune = host.querySelector("#zv-prune");
    if (prune) {
      prune.onclick = function () {
        const now = today();
        Object.keys(board.days).forEach(function (k) {
          if (k < now && !(board.days[k].signups || []).length) delete board.days[k];
        });
        persist();
        render();
      };
    }
  }

  function exportCsv() {
    const rows = [["date", "abla", "time", "parent", "student", "phone"]].concat(
      allSignups().map(function (r) {
        return [r.date, ablaById(r.abla).name, r.time, r.parent, r.student, r.phone];
      })
    );
    const csv = rows
      .map(function (r) {
        return r
          .map(function (c) {
            return '"' + String(c || "").replace(/"/g, '""') + '"';
          })
          .join(",");
      })
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = "veli-ziyaret.csv";
    a.click();
  }

  function mergeBoards(remote, local) {
    if (!remote || !remote.days) return local;
    const remoteNewer = (remote.updated || 0) >= (local.updated || 0);
    const base = JSON.parse(JSON.stringify(remoteNewer ? remote : local));
    const other = remoteNewer ? local : remote;
    if (!base.times) base.times = JSON.parse(JSON.stringify(DEFAULT_TIMES));
    if (other.times) base.times = Object.assign(base.times, other.times);
    if (!base.days) base.days = {};
    Object.keys(other.days || {}).forEach(function (k) {
      const od = other.days[k];
      if (!base.days[k]) {
        if (!remoteNewer) base.days[k] = od;
        return;
      }
      const seen = {};
      const signups = [];
      (base.days[k].signups || []).concat(od.signups || []).forEach(function (s) {
        if (!s || !s.id || seen[s.id]) return;
        seen[s.id] = true;
        signups.push(s);
      });
      base.days[k].signups = signups;
      if (remoteNewer && remote.days[k]) {
        base.days[k].abla = remote.days[k].abla;
        base.days[k].times = remote.days[k].times;
        base.days[k].note = remote.days[k].note;
      }
    });
    if (remoteNewer && remote.capacity) base.capacity = remote.capacity;
    return base;
  }

  function persist() {
    saveLocal();
    try {
      localStorage.setItem("core-es-veli-url", veliLink());
    } catch (e) {}
    pushCloud();
  }

  function cloudHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Mantle-Key": CLOUD_KEY,
    };
  }

  function unwrapBoard(json) {
    if (!json) return null;
    if (json.days) return json;
    if (json.data && json.data.days) return json.data;
    return null;
  }

  function pullCloud(cb) {
    fetch(CLOUD_URL, { headers: cloudHeaders() })
      .then(function (res) {
        if (!res.ok) throw new Error("cloud");
        return res.json();
      })
      .then(function (json) {
        const data = unwrapBoard(json);
        if (!data) throw new Error("cloud");
        const before = boardSig();
        board = mergeBoards(data, board);
        cloudOk = true;
        saveLocal();
        if (cb) cb(true);
        else if (boardSig() !== before && !busy()) render();
      })
      .catch(function () {
        if (cb) cb(false);
      });
  }

  function runPush() {
    if (!pushAgain) return Promise.resolve();
    pushAgain = false;
    return fetch(CLOUD_URL, { headers: cloudHeaders() })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (json) {
        const remote = unwrapBoard(json);
        if (remote) {
          board = mergeBoards(remote, board);
          saveLocal();
        }
        return fetch(CLOUD_URL, {
          method: "POST",
          headers: cloudHeaders(),
          body: JSON.stringify(board),
        });
      })
      .then(function (res) {
        if (res && res.ok) cloudOk = true;
      })
      .catch(function () {})
      .then(function () {
        if (pushAgain) return runPush();
      });
  }

  function pushCloud() {
    pushAgain = true;
    pushChain = pushChain.then(runPush);
    return pushChain;
  }

  function ensureCloud() {
    return pushCloud();
  }

  function startPoll() {
    clearInterval(poll);
    poll = setInterval(function () {
      pullCloud();
    }, 5000);
  }

  function mount(el, opts) {
    if (!el) return;
    const keep = !!host && admin === !!(opts && opts.admin);
    const prev = {
      selected: selected,
      viewMonth: viewMonth,
      viewYear: viewYear,
      pickedTime: pickedTime,
      paintAbla: paintAbla,
      queryText: queryText,
      lang: lang,
    };
    host = el;
    admin = !!(opts && opts.admin);
    if (opts && opts.lang) lang = opts.lang;
    if (keep) {
      selected = prev.selected;
      viewMonth = prev.viewMonth;
      viewYear = prev.viewYear;
      pickedTime = prev.pickedTime;
      paintAbla = prev.paintAbla;
      queryText = prev.queryText;
      if (!(opts && opts.lang)) lang = prev.lang;
      render();
      return;
    }
    loadLocal();
    const compact = decodeConfig(new URLSearchParams(location.search).get("d") || "");
    if (compact) applyConfig(compact);
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    selected = "";
    pickedTime = "";
    paintAbla = "";
    render();
    pullCloud(function () {
      render();
    });
    startPoll();
  }

  function destroy() {
    clearInterval(poll);
    poll = null;
    host = null;
  }

  root.Ziyaret = { mount: mount, destroy: destroy, veliLink: veliLink };

  loadLocal();
  const boot = document.getElementById("ziyaret");
  if (boot) {
    mount(boot, { admin: false });
  }
})(window);
