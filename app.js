(function () {
  const STORAGE_KEY = "sule-aile-hub-v1";
  const CATEGORIES = ["Market", "Fatura", "Sağlık", "Ulaşım", "Hediye", "Yemek", "Diğer"];

  const I18N = {
    tr: {
      family: "Aile",
      subtitle: "Etkinlikler, cetele ve grafikler — çok basit.",
      events: "Etkinlikler",
      ledger: "Cetele",
      upcoming: "Yaklaşanlar",
      recent: "Son hareketler",
      emptyEvents: "Henüz etkinlik yok. Bir tane ekleyin.",
      emptyLedger: "Henüz kayıt yok. Excel gibi satır ekleyin.",
      addEvent: "Etkinlik ekle",
      addRow: "Satır ekle",
      save: "Kaydet",
      cancel: "Vazgeç",
      delete: "Sil",
      back: "Geri",
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
      herPage: "Sayfasına gir",
      herEvents: "Etkinlikleri",
      herLedger: "Cetelesi",
      byCategory: "Kategoriye göre",
      byMonth: "Aylara göre",
      open: "Aç",
    },
    en: {
      family: "Family",
      subtitle: "Events, ledger and charts — kept very simple.",
      events: "Events",
      ledger: "Ledger",
      upcoming: "Coming up",
      recent: "Recent rows",
      emptyEvents: "No events yet. Add one.",
      emptyLedger: "No rows yet. Add a line like Excel.",
      addEvent: "Add event",
      addRow: "Add row",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      back: "Back",
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
      herPage: "Open her page",
      herEvents: "Her events",
      herLedger: "Her ledger",
      byCategory: "By category",
      byMonth: "By month",
      open: "Open",
    },
  };

  const defaultState = function () {
    return {
      lang: "tr",
      title: "Aile Merkezi",
      sisters: [
        { id: "s1", name: "Abla 1" },
        { id: "s2", name: "Abla 2" },
        { id: "s3", name: "Abla 3" },
      ],
      events: [],
      entries: [],
    };
  };

  let state = load();
  let modal = null;
  let charts = [];
  let fileInput = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const data = JSON.parse(raw);
      return Object.assign(defaultState(), data);
    } catch (e) {
      return defaultState();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function t(key) {
    return (I18N[state.lang] || I18N.tr)[key] || key;
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function money(n) {
    const value = Number(n) || 0;
    return value.toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US", {
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
    const hash = (location.hash || "#/").replace(/^#/, "");
    const parts = hash.split("/").filter(Boolean);
    if (parts[0] === "etkinlikler") return { page: "events" };
    if (parts[0] === "cetele") return { page: "ledger", sisterId: parts[1] || null };
    if (parts[0] === "abla" && parts[1]) return { page: "sister", sisterId: parts[1] };
    return { page: "home" };
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

  function render() {
    destroyCharts();
    const view = route();
    const app = document.getElementById("app");
    const sister = view.sisterId ? sisterById(view.sisterId) : null;

    app.innerHTML =
      '<div class="shell">' +
      topbar(view, sister) +
      (view.page === "home" ? homeView() : "") +
      (view.page === "sister" ? sisterView(sister) : "") +
      (view.page === "events" ? eventsView() : "") +
      (view.page === "ledger" ? ledgerView(view.sisterId) : "") +
      "</div>" +
      (modal ? modalHtml() : "");

    bind(view, sister);
    if (view.page === "home" || view.page === "sister" || view.page === "ledger") {
      drawCharts(view.sisterId || null, view.page === "home");
    }
  }

  function topbar(view, sister) {
    const heading =
      view.page === "home"
        ? escapeHtml(state.title)
        : view.page === "events"
          ? t("events")
          : view.page === "ledger"
            ? t("ledger")
            : sister
              ? escapeHtml(sister.name)
              : t("family");

    return (
      '<div class="topbar">' +
      '<a class="brand" href="#/">' +
      '<div class="logo">A</div>' +
      "<div><h1>" +
      heading +
      "</h1><p>" +
      t("subtitle") +
      "</p></div></a>" +
      '<div class="row">' +
      '<div class="lang">' +
      '<button data-lang="tr" class="' +
      (state.lang === "tr" ? "active" : "") +
      '">TR</button>' +
      '<button data-lang="en" class="' +
      (state.lang === "en" ? "active" : "") +
      '">EN</button></div>' +
      (view.page !== "home"
        ? '<a class="btn secondary small" href="#/">' + t("back") + "</a>"
        : "") +
      "</div></div>"
    );
  }

  function homeView() {
    const next = upcomingEvents().slice(0, 5);
    const recent = entriesFor().slice(0, 5);
    const sum = totals(entriesFor());

    return (
      '<section class="hero">' +
      '<input class="title-input" id="family-title" value="' +
      escapeHtml(state.title) +
      '" />' +
      "<p class=\"lede\">" +
      t("subtitle") +
      "</p>" +
      '<div class="row" style="margin-top:16px">' +
      '<a class="btn" href="#/etkinlikler">' +
      t("events") +
      "</a>" +
      '<a class="btn secondary" href="#/cetele">' +
      t("ledger") +
      "</a></div></section>" +
      '<div class="grid">' +
      state.sisters
        .map(function (sister, i) {
          const hers = totals(entriesFor(sister.id));
          return (
            '<div class="card sister s' +
            (i + 1) +
            '">' +
            '<div class="kicker">' +
            t("herPage") +
            "</div>" +
            '<input class="name-input" data-rename="' +
            sister.id +
            '" value="' +
            escapeHtml(sister.name) +
            '" />' +
            '<div class="stat">' +
            t("balance") +
            ": " +
            money(hers.balance) +
            '</div><a class="btn small" href="#/abla/' +
            sister.id +
            '">' +
            t("open") +
            "</a></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="cards">' +
      '<section class="card"><div class="kicker">' +
      t("upcoming") +
      "</div>" +
      eventList(next) +
      "</section>" +
      '<section class="card"><div class="kicker">' +
      t("recent") +
      "</div>" +
      '<div class="totals" style="grid-template-columns:1fr">' +
      totalCard(t("balance"), sum.balance) +
      "</div>" +
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
      '<section class="hero">' +
      '<input class="title-input" data-rename="' +
      sister.id +
      '" value="' +
      escapeHtml(sister.name) +
      '" />' +
      '<div class="row" style="margin-top:16px">' +
      '<button class="btn" data-open-event="' +
      sister.id +
      '">' +
      t("addEvent") +
      "</button>" +
      '<a class="btn secondary" href="#/cetele/' +
      sister.id +
      '">' +
      t("ledger") +
      "</a></div></section>" +
      totalsRow(sum) +
      '<div class="cards">' +
      '<section class="card"><div class="kicker">' +
      t("herEvents") +
      "</div>" +
      eventList(next) +
      "</section>" +
      '<section class="card"><div class="kicker">' +
      t("herLedger") +
      "</div>" +
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
      '<div class="toolbar"><h2 class="page-title">' +
      t("events") +
      '</h2><button class="btn" data-open-event="">' +
      t("addEvent") +
      "</button></div>" +
      '<section class="card">' +
      (list.length ? eventList(list, true) : '<p class="empty">' + t("emptyEvents") + "</p>") +
      "</section>"
    );
  }

  function ledgerView(sisterId) {
    const rows = entriesFor(sisterId);
    const sum = totals(rows);
    return (
      '<div class="toolbar"><h2 class="page-title">' +
      t("ledger") +
      (sisterId ? " · " + escapeHtml(personLabel(sisterId)) : "") +
      "</h2>" +
      '<div class="row">' +
      '<input id="search" placeholder="' +
      t("search") +
      '" />' +
      '<button class="btn" data-open-entry="' +
      (sisterId || "") +
      '">' +
      t("addRow") +
      "</button>" +
      '<button class="btn secondary" id="export">' +
      t("exportCsv") +
      "</button>" +
      '<button class="btn ghost" id="import">' +
      t("importCsv") +
      "</button></div></div>" +
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
    const cls = value < 0 ? "neg" : "pos";
    return (
      '<div class="total"><span class="kicker">' +
      label +
      '</span><b class="money ' +
      cls +
      '">' +
      money(value) +
      "</b></div>"
    );
  }

  function chartCard(id, label) {
    return (
      '<section class="card"><div class="kicker">' +
      label +
      '</div><div class="chart-box"><canvas id="' +
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
            '<div class="item">' +
            "<div><b>" +
            escapeHtml(event.title) +
            "</b><span class=\"muted\">" +
            escapeHtml(event.date) +
            (event.time ? " · " + escapeHtml(event.time) : "") +
            " · " +
            escapeHtml(personLabel(event.who)) +
            (event.place ? " · " + escapeHtml(event.place) : "") +
            "</span></div>" +
            (withActions
              ? '<div class="row"><button class="btn ghost small" data-edit-event="' +
                event.id +
                '">✎</button><button class="btn danger small" data-del-event="' +
                event.id +
                '">' +
                t("delete") +
                "</button></div>"
              : '<a class="btn ghost small" href="#/etkinlikler">' + t("open") + "</a>") +
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
            '</b><span class="muted">' +
            escapeHtml(row.date) +
            " · " +
            escapeHtml(row.category || "") +
            '</span></div><div class="money ' +
            (signed < 0 ? "neg" : "pos") +
            '">' +
            money(signed) +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function tableHtml(rows) {
    if (!rows.length) return '<p class="empty">' + t("emptyLedger") + "</p>";
    return (
      '<div class="table-wrap"><table><thead><tr>' +
      "<th>" + t("date") + "</th>" +
      "<th>" + t("desc") + "</th>" +
      "<th>" + t("category") + "</th>" +
      "<th>" + t("who") + "</th>" +
      "<th>" + t("type") + "</th>" +
      "<th>" + t("amount") + "</th>" +
      "<th></th></tr></thead><tbody>" +
      rows
        .map(function (row) {
          return (
            "<tr data-row=\"" +
            row.id +
            '">' +
            cellInput(row.id, "date", row.date, "date") +
            cellInput(row.id, "desc", row.desc, "text") +
            "<td>" +
            categorySelect(row) +
            "</td>" +
            "<td>" +
            whoSelect(row.who, row.id) +
            "</td>" +
            "<td>" +
            typeSelect(row) +
            "</td>" +
            cellInput(row.id, "amount", row.amount, "number") +
            '<td><button class="btn danger small" data-del-entry="' +
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

  function cellInput(id, field, value, type) {
    return (
      "<td><input data-edit=\"" +
      id +
      '" data-field="' +
      field +
      '" type="' +
      type +
      '" value="' +
      escapeHtml(value) +
      '" /></td>'
    );
  }

  function categorySelect(row) {
    return (
      '<select data-edit="' +
      row.id +
      '" data-field="category">' +
      CATEGORIES.map(function (cat) {
        return (
          '<option ' +
          (row.category === cat ? "selected" : "") +
          ">" +
          cat +
          "</option>"
        );
      }).join("") +
      "</select>"
    );
  }

  function typeSelect(row) {
    return (
      '<select data-edit="' +
      row.id +
      '" data-field="type">' +
      '<option value="gider" ' +
      (row.type !== "gelir" ? "selected" : "") +
      ">" +
      t("expense") +
      "</option>" +
      '<option value="gelir" ' +
      (row.type === "gelir" ? "selected" : "") +
      ">" +
      t("income") +
      "</option></select>"
    );
  }

  function whoSelect(current, rowId) {
    const name = rowId ? "data-edit=\"" + rowId + '" data-field="who"' : 'name="who"';
    return (
      "<select " +
      name +
      ">" +
      '<option value="aile"' +
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

  function eventModal() {
    const event = modal.event;
    return (
      '<div class="modal-back"><form class="modal" id="modal-form">' +
      "<h2 class=\"page-title\">" +
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
      '<div class="row">' +
      '<button class="btn" type="submit">' +
      t("save") +
      '</button><button class="btn ghost" type="button" id="close-modal">' +
      t("cancel") +
      "</button></div></form></div>"
    );
  }

  function entryModal() {
    const row = modal.entry;
    return (
      '<div class="modal-back"><form class="modal" id="modal-form">' +
      "<h2 class=\"page-title\">" +
      t("addRow") +
      "</h2>" +
      '<div class="form-grid">' +
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
      '</button><button class="btn ghost" type="button" id="close-modal">' +
      t("cancel") +
      "</button></div></form></div>"
    );
  }

  function field(label, control) {
    return '<label class="field"><span>' + label + "</span>" + control + "</label>";
  }

  function bind(view, sister) {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.onclick = function () {
        state.lang = btn.getAttribute("data-lang");
        save();
        render();
      };
    });

    const title = document.getElementById("family-title");
    if (title) {
      title.onchange = function () {
        state.title = title.value.trim() || "Aile Merkezi";
        save();
      };
    }

    document.querySelectorAll("[data-rename]").forEach(function (input) {
      input.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
      };
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
    if (close) close.onclick = function () {
      modal = null;
      render();
    };

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
  }

  function openEvent(partial) {
    modal = {
      type: "event",
      event: Object.assign(
        { id: uid(), title: "", date: today(), time: "", who: "aile", place: "", notes: "" },
        partial || {}
      ),
    };
    render();
  }

  function openEntry(partial) {
    modal = {
      type: "entry",
      entry: Object.assign(
        { id: uid(), date: today(), desc: "", category: "Diğer", who: "aile", type: "gider", amount: "" },
        partial || {}
      ),
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
        return header.map(function (key) {
          return csvEscape(row[key]);
        }).join(",");
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
      const cat = row.category || "Diğer";
      byCat[cat] = (byCat[cat] || 0) + amount;
      const month = (row.date || "").slice(0, 7) || "—";
      byMonth[month] = (byMonth[month] || 0) + amount;
    });

    const colors = ["#c45c2c", "#4d6b50", "#3b6584", "#b8922a", "#9b2f23", "#6e6558", "#2f6b46"];
    charts.push(
      new Chart(catCanvas, {
        type: "doughnut",
        data: {
          labels: Object.keys(byCat),
          datasets: [{ data: Object.values(byCat), backgroundColor: colors }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
      })
    );
    charts.push(
      new Chart(monthCanvas, {
        type: "bar",
        data: {
          labels: Object.keys(byMonth).sort(),
          datasets: [{ label: t("expense"), data: Object.keys(byMonth).sort().map(function (k) { return byMonth[k]; }), backgroundColor: "#c45c2c" }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      })
    );
  }

  window.addEventListener("hashchange", render);
  render();
})();
