(function () {
  const STORAGE_KEY = "core-es-v2";
  const OLD_KEY = "sule-aile-hub-v1";
  const SITE = "8th grade CORE - ES";
  const HADITH =
    "Amellerin Allah’a en sevimli olanı, az da olsa devamlı (istikrarlı) olanıdır.";
  const CATEGORIES = ["Market", "Fatura", "Sağlık", "Ulaşım", "Hediye", "Yemek", "Diğer"];
  const WEEKS = fridaysUntilDec();

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
    },
  };

  function fridaysUntilDec() {
    const out = [];
    const d = new Date(2026, 8, 4);
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

  function defaultState() {
    return {
      lang: "tr",
      sisters: [
        { id: "s1", name: "Abla 1" },
        { id: "s2", name: "Abla 2" },
        { id: "s3", name: "Abla 3" },
      ],
      events: [],
      entries: [],
      istisare: {},
      weeklyGoal: "",
      mentorGoals: {},
      agenda: [],
      work: [],
      ideas: [],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  let state = load();
  let modal = null;
  let charts = [];
  let fileInput = null;

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

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
    if (page === "abla") return { page: "sister", sisterId: parts[1] };
    if (page === "cetele") return { page: "ledger", sisterId: parts[1] || null };
    if (page === "etkinlikler") return { page: "events" };
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
      (page === "family" && (view.page === "family" || view.page === "events" || view.page === "ledger" || view.page === "sister"));
    return '<a class="tab' + (on ? " on" : "") + '" href="' + href + '">' + label + "</a>";
  }

  function render() {
    destroyCharts();
    const view = route();
    const sister = view.sisterId ? sisterById(view.sisterId) : null;
    const app = document.getElementById("app");
    app.innerHTML =
      '<div class="shell">' +
      header() +
      tabs() +
      (view.page === "home" || view.page === "" ? homeView() : "") +
      (view.page === "istisare" ? istisareView() : "") +
      (view.page === "mentor" ? mentorView() : "") +
      (view.page === "gundemler" ? checklistView("agenda", t("agenda"), t("agendaPrompt")) : "") +
      (view.page === "upcoming" ? checklistView("work", t("workOn"), t("workPrompt")) : "") +
      (view.page === "ideas" ? ideasView() : "") +
      (view.page === "family" ? familyView() : "") +
      (view.page === "sister" ? sisterView(sister) : "") +
      (view.page === "events" ? eventsView() : "") +
      (view.page === "ledger" ? ledgerView(view.sisterId) : "") +
      "</div>" +
      (modal ? modalHtml() : "");
    bind(view, sister);
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
      navLink("#/gundemler", "gundemler", t("agenda")) +
      navLink("#/upcoming", "upcoming", t("upcoming")) +
      navLink("#/ideas", "ideas", t("ideas")) +
      navLink("#/family", "family", t("family")) +
      "</nav>"
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
      '</p><textarea id="weekly-goal" placeholder="' +
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
      state.agenda.length +
      "</b></a>" +
      '<a class="card jump butter" href="#/upcoming"><span class="quiet">' +
      t("upcoming") +
      "</span><b>" +
      state.work.filter(function (x) {
        return !x.done;
      }).length +
      "</b></a></div>"
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
        '"><div class="week-top"><b>' +
        escapeHtml(formatWeek(week)) +
        "</b>" +
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
      '</p><textarea id="weekly-goal" placeholder="' +
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

  function ideasView() {
    return (
      "<h2>" +
      t("ideas") +
      '</h2><form class="addbar" data-add="ideas"><textarea name="title" rows="1" placeholder="' +
      t("ideaPrompt") +
      '" required></textarea><button class="btn pink" type="submit">' +
      t("add") +
      "</button></form>" +
      (state.ideas.length
        ? '<div class="home-grid">' +
          state.ideas
            .map(function (item) {
              return (
                '<div class="pin-wrap"><span class="pin"></span><textarea data-title="ideas" data-id="' +
                item.id +
                '">' +
                escapeHtml(item.title) +
                '</textarea><button class="btn light tiny" data-del="ideas" data-id="' +
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
    return "";
  }

  function field(label, control) {
    return '<label class="field"><span>' + label + "</span>" + control + "</label>";
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
      };
    }

    document.querySelectorAll("[data-istisare]").forEach(function (box) {
      box.oninput = function () {
        state.istisare[box.getAttribute("data-istisare")] = box.value;
        save();
        growBox(box);
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

    document.querySelectorAll("[data-add]").forEach(function (form) {
      const box = form.querySelector("textarea, input");
      if (box) {
        box.oninput = function () {
          growBox(box);
        };
      }
      form.onsubmit = function (e) {
        e.preventDefault();
        const key = form.getAttribute("data-add");
        const title = String(new FormData(form).get("title") || "").trim();
        if (!title) return;
        state[key].push({ id: uid(), title: title, done: false });
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
        }
        growBox(input);
      };
    });

    document.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.onclick = function () {
        const key = btn.getAttribute("data-del");
        state[key] = state[key].filter(function (x) {
          return x.id !== btn.getAttribute("data-id");
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
