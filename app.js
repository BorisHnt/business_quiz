const texts = {
  heroEyebrow: "Sessions de quiz",
  heroTitle: "Quiz business",
  heroDesc: "Choisissez un thème, lancez une session de 10, 20 ou 40 questions.",
  start: "Lancer une session",
  dataLoading: "Chargement des questions…",
  dataReady: (count) => `${count} questions prêtes.`,
  dataError: "Impossible de charger les questions.",
  quizEyebrow: "En cours",
  quizPlaceholder: "Choisissez une session et appuyez sur « Lancer ».",
  next: "Suivant",
  finish: "Terminer",
  mainMenu: "Menu principal",
  selectAnswerPrompt: "Choisissez une réponse pour continuer.",
  summaryTitle: "Session terminée",
  summarySubtitle: "Votre note",
  gridHint: "Touchez un carré rouge pour voir la correction.",
  mistakesTitle: "Toutes les réponses",
  mistakesEmpty: "Aucune question dans cette session.",
  historyEmpty: "Aucun questionnaire complété pour l’instant.",
  scoreOn: (score, total) => `${score}/${total}`,
  tooltipTitleWrong: "Correction",
  tooltipYourAnswer: "Votre réponse",
  tooltipCorrect: "Bonne réponse",
  tooltipExplanation: "Pourquoi",
  sessionLabel: (size) => `Session ${size} questions`,
  revisionLabel: "Mode fiches de révision",
  wrongShort: "Faux",
  correctShort: "Juste",
  loading: "Chargement…",
  percent: (p) => `${p}%`,
  dateLabel: "Date",
  questionOf: (n, total) => `Question ${n} / ${total}`,
  flashReveal: "Afficher la suite",
  flashHide: "Masquer la suite",
  flashOnly: "Ce thème est uniquement en flashcards. Utilisez le lecteur ci-dessous.",
  flashPlaceholder: "Choisissez une session et appuyez sur « Lancer ».",
  flashSummaryTitle: "Session flashcards terminée",
  flashListTitle: "Cartes lues",
  flashNoCards: "Aucune carte dans cette session."
};

const themesConfig = [
  { id: "mix", color: "#72c2f0", label: "Mix des thèmes", short: "Mix des thèmes" },
  { id: "c1", color: "#7dd3fc", label: "Catégorie 1 — Travail / classes / orga", short: "Travail / classes" },
  { id: "c2", color: "#f472b6", label: "Catégorie 2 — Pouvoir / gouvernance / décision", short: "Gouvernance" },
  { id: "c3", color: "#f97316", label: "Catégorie 3 — Argent / capital / valeur", short: "Argent & valeur" },
  { id: "c4", color: "#a78bfa", label: "Catégorie 4 — Temps / stratégie / transformation", short: "Temps & strat." },
  { id: "c5", color: "#34d399", label: "Catégorie 5 — Industrie / flux / matériel", short: "Industrie / flux" },
  { id: "c6", color: "#facc15", label: "Catégorie 6 — État / intérêts / symboles", short: "État & symboles" },
  { id: "c7", color: "#fb7185", label: "Catégorie 7 — Anglicismes & acronymes", short: "Anglicismes" }
];

const flashThemes = [
  { id: "fc1", color: "#8b5cf6", label: "Catégorie 1 — Phrases & citations", short: "Phrases & citations" }
];

const elements = {
  app: document.querySelector(".app-shell"),
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.getElementById("theme-icon"),
  themeSelector: document.getElementById("theme-selector"),
  sessionButtons: Array.from(document.querySelectorAll(".session-btn")),
  startBtn: document.getElementById("start-btn"),
  startLabel: document.getElementById("start-label"),
  dataStatus: document.getElementById("data-status"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroDesc: document.getElementById("hero-desc"),
  revisionToggle: document.getElementById("revision-toggle"),
  revisionLabel: document.getElementById("revision-label"),
  quizEyebrow: document.getElementById("quiz-eyebrow"),
  quizTitle: document.getElementById("quiz-title"),
  quizBody: document.getElementById("quiz-body"),
  quizPlaceholder: document.getElementById("quiz-placeholder"),
  progressBadge: document.getElementById("progress-badge"),
  menuBtn: document.getElementById("menu-btn"),
  menuLabel: document.getElementById("menu-label"),
  nextBtn: document.getElementById("next-btn"),
  nextLabel: document.getElementById("next-label"),
  historyEyebrow: document.getElementById("history-eyebrow"),
  historyTitle: document.getElementById("history-title"),
  historyBody: document.getElementById("history-body"),
  historyPlaceholder: document.getElementById("history-placeholder"),
  historyCount: document.getElementById("history-count"),
  historyClear: document.getElementById("history-clear"),
  flashThemeSelector: document.getElementById("flash-theme-selector"),
  flashSessionButtons: Array.from(document.querySelectorAll(".flash-session-btn")),
  flashStartBtn: document.getElementById("flash-start-btn"),
  flashStartLabel: document.getElementById("flash-start-label"),
  flashBody: document.getElementById("flash-body"),
  flashCard: document.querySelector(".flash-card"),
  flashPlaceholder: document.getElementById("flash-placeholder"),
  flashProgress: document.getElementById("flash-progress"),
  flashTitle: document.getElementById("flash-title"),
  flashNextBtn: document.getElementById("flash-next-btn"),
  flashNextLabel: document.getElementById("flash-next-label"),
  flashMenuBtn: document.getElementById("flash-menu-btn"),
  tooltip: document.getElementById("tooltip"),
  snackbar: document.getElementById("snackbar")
};

const state = {
  theme: localStorage.getItem("biz-theme") || "light",
  selectedTheme: "mix",
  sessionSize: 10,
  revisionMode: localStorage.getItem("biz-revision") === "1",
  reviewPause: false,
  allQuestions: [],
  flashcards: [],
  session: [],
  currentIndex: 0,
  answers: {},
  finished: false,
  history: loadHistory(),
  route: "home",
  flashSelectedTheme: "fc1",
  flashSessionSize: 10,
  flashSession: [],
  flashCurrentIndex: 0,
  flashFinished: false
};

function t(key, ...args) {
  const value = texts[key];
  if (typeof value === "function") return value(...args);
  return value ?? key;
}

function getThemeById(id) {
  return themesConfig.find((t) => t.id === id) || themesConfig[0];
}

function getFlashThemeById(id) {
  return flashThemes.find((t) => t.id === id) || flashThemes[0];
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  localStorage.setItem("biz-theme", state.theme);
  document.documentElement.dataset.theme = state.theme;
  elements.app.dataset.theme = state.theme;
  elements.themeIcon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
}

function setRoute(route) {
  const wantsQuizz = route === "quizz";
  const wantsFlash = route === "flash";
  const hasSession = state.session.length > 0;
  const hasFlashSession = state.flashSession.length > 0;
  if (wantsQuizz && hasSession) {
    state.route = "quizz";
  } else if (wantsFlash && hasFlashSession) {
    state.route = "flash";
  } else {
    state.route = "home";
  }
  document.body.dataset.route = state.route;
  if (state.route === "quizz") {
    if (window.location.hash !== "#/quizz") history.replaceState({}, "", "#/quizz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (state.route === "flash") {
    if (window.location.hash !== "#/flash") history.replaceState({}, "", "#/flash");
    const flashCard = elements.flashCard || document.querySelector(".flash-card");
    if (flashCard) {
      const top = flashCard.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else if (window.location.hash !== "#/") {
    history.replaceState({}, "", "#/");
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem("biz-history");
    if (!raw) return [];
    return JSON.parse(raw) ?? [];
  } catch (e) {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem("biz-history", JSON.stringify(state.history.slice(0, 25)));
}

async function loadQuestions() {
  elements.dataStatus.textContent = t("dataLoading");
  try {
    const res = await fetch("data/questions.json");
    if (!res.ok) throw new Error("fetch failed");
    const json = await res.json();
    state.allQuestions = normalizeQuestions(json);
    elements.dataStatus.textContent = t("dataReady", state.allQuestions.length);
  } catch (e) {
    elements.dataStatus.textContent = t("dataError");
    showSnackbar(t("dataError"));
  }
}

async function loadFlashcards() {
  try {
    const res = await fetch("data/flashcards.json");
    if (!res.ok) throw new Error("flash fetch failed");
    const json = await res.json();
    state.flashcards = json.map((c, idx) => ({ ...c, themeId: c.themeId || "fc1", id: c.id || `f${idx + 1}` }));
    renderFlashPlaceholder();
  } catch (e) {
    if (elements.flashBody) elements.flashBody.innerHTML = `<p class="muted">Impossible de charger les flashcards.</p>`;
  }
}

function normalizeQuestions(data) {
  if (!Array.isArray(data)) return [];
  return data
    .map((q, idx) => {
      const options = Array.isArray(q.options)
        ? q.options
            .map((opt) => ({
              key: String(opt.key || "").toLowerCase(),
              text: String(opt.text || "").trim()
            }))
            .filter((opt) => opt.key && opt.text)
        : [];
      const answerLetter = String(q.answerLetter || "").toLowerCase();
      return {
        id: q.id || `q${idx + 1}`,
        prompt: String(q.prompt || "").trim(),
        options,
        answerLetter,
        explanation: String(q.explanation || "").trim(),
        category: String(q.category || "Business").trim(),
        themeId: q.themeId || "mix"
      };
    })
    .filter((q) => q.prompt && q.options.length >= 2 && q.answerLetter);
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function remapOptions(question) {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const shuffled = shuffle(question.options.map((opt) => ({ ...opt })));
  let newAnswer = "";
  const remapped = shuffled.map((opt, idx) => {
    const key = letters[idx] || letters[letters.length - 1];
    if (opt.key.toLowerCase() === question.answerLetter?.toLowerCase()) newAnswer = key;
    return { ...opt, key };
  });
  if (!newAnswer && remapped.length) newAnswer = remapped[0].key;
  return { ...question, options: remapped, answerLetter: newAnswer };
}

function getThemePool(themeId) {
  if (themeId === "mix") return state.allQuestions;
  const theme = getThemeById(themeId);
  if (theme?.flashcards) return [];
  return state.allQuestions.filter((q) => q.themeId === themeId);
}

function startSession() {
  const selectedConf = getThemeById(state.selectedTheme);
  if (selectedConf?.flashcards) {
    showSnackbar(t("flashOnly"));
    state.finished = false;
    state.session = [];
    renderQuestion();
    renderFlashcard();
    return;
  }
  if (!state.allQuestions.length) {
    showSnackbar(t("dataError"));
    loadQuestions();
    return;
  }
  const pool = getThemePool(state.selectedTheme);
  if (!pool.length) {
    showSnackbar("Aucune question pour ce thème.");
    return;
  }
  const size = Math.min(state.sessionSize, pool.length);
  state.session = shuffle(pool)
    .slice(0, size)
    .map((q) => remapOptions(q));
  state.currentIndex = 0;
  state.answers = {};
  state.finished = false;
  state.reviewPause = false;
  setRoute("quizz");
  renderQuestion();
}

function renderQuestion() {
  elements.quizBody.innerHTML = "";
  elements.quizPlaceholder.textContent = "";
  const quizCard = document.querySelector(".quiz-card");
  if (!state.session.length) {
    if (quizCard) quizCard.classList.add("hidden");
    elements.quizTitle.textContent = "";
    elements.progressBadge.textContent = "";
    elements.nextBtn.disabled = true;
    if (elements.menuBtn) elements.menuBtn.style.display = "none";
    return;
  }
  if (quizCard) quizCard.classList.remove("hidden");

  if (state.finished) {
    renderSummary();
    return;
  }

  const question = state.session[state.currentIndex];
  const total = state.session.length;
  setQuizTitleWithDot(t("questionOf", state.currentIndex + 1, total), question);
  elements.progressBadge.textContent = `${state.currentIndex + 1} / ${total}`;

  const container = document.createElement("div");
  container.className = "question-container";

  const progress = document.createElement("div");
  progress.className = "progress";
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  bar.style.width = `${((state.currentIndex + 1) / total) * 100}%`;
  progress.appendChild(bar);

  const title = document.createElement("p");
  title.className = "question-title";
  title.innerHTML = question.prompt;

  const category = document.createElement("p");
  category.className = "muted";
  category.textContent = question.category;

  const options = document.createElement("div");
  options.className = "options";
  question.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    if (state.reviewPause) btn.disabled = true;
    if (state.answers[question.id] === opt.key) {
      btn.classList.add("selected");
    }

    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = opt.key.toUpperCase();

    const text = document.createElement("span");
    text.innerHTML = opt.text;

    btn.append(letter, text);
    btn.addEventListener("click", () => {
      if (state.reviewPause) return;
      state.answers[question.id] = opt.key;
      state.reviewPause = false;
      renderQuestion();
    });
    options.appendChild(btn);
  });

  container.append(progress, title, category, options);

  const feedback = buildRevisionFeedback(question);
  if (feedback) container.append(feedback);

  elements.quizBody.append(container);
  updateNavButtons();
}

function updateNavButtons() {
  if (state.finished) {
    elements.nextLabel.textContent = t("start");
    elements.nextBtn.disabled = false;
    if (elements.menuBtn) {
      elements.menuBtn.style.display = "";
      elements.menuBtn.disabled = false;
    }
  } else {
    elements.nextLabel.textContent = state.currentIndex === state.session.length - 1 ? t("finish") : t("next");
    elements.nextBtn.disabled = !state.session.length;
    if (elements.menuBtn) elements.menuBtn.style.display = "none";
  }
}

function nextStep() {
  if (!state.session.length || state.finished) return;
  const question = state.session[state.currentIndex];
  if (state.revisionMode && state.reviewPause) {
    state.reviewPause = false;
    if (state.currentIndex === state.session.length - 1) {
      finalizeSession();
    } else {
      state.currentIndex += 1;
      renderQuestion();
    }
    return;
  }
  if (!state.answers[question.id]) {
    showSnackbar(t("selectAnswerPrompt"));
    return;
  }
  const isCorrect = state.answers[question.id].toLowerCase() === question.answerLetter?.toLowerCase();
  if (state.revisionMode && !isCorrect) {
    state.reviewPause = true;
    renderQuestion();
    return;
  }
  if (state.currentIndex === state.session.length - 1) {
    finalizeSession();
  } else {
    state.currentIndex += 1;
    renderQuestion();
  }
}

function finalizeSession() {
  state.finished = true;
  const total = state.session.length;
  const results = state.session.map((q) => {
    const userAnswer = state.answers[q.id];
    const correct = userAnswer && userAnswer.toLowerCase() === q.answerLetter?.toLowerCase();
    return { question: q, userAnswer, correct, explanation: q.explanation };
  });
  const score = results.filter((r) => r.correct).length;
  const percent = Math.round((score / total) * 100);
  state.history.unshift({ id: Date.now(), score, total, percent, date: new Date().toISOString() });
  saveHistory();
  renderSummary();
  renderHistory();
  state.reviewPause = false;
}

function renderSummary() {
  const total = state.session.length;
  const results = state.session.map((q) => {
    const userAnswer = state.answers[q.id];
    const correct = userAnswer && userAnswer.toLowerCase() === q.answerLetter?.toLowerCase();
    return { question: q, userAnswer, correct, explanation: q.explanation };
  });
  const score = results.filter((r) => r.correct).length;
  const percent = Math.round((score / total) * 100);

  elements.quizBody.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = "summary";

  const title = document.createElement("h3");
  title.textContent = t("summaryTitle");

  const scoreRow = document.createElement("div");
  scoreRow.className = "score";
  const main = document.createElement("span");
  main.className = "main";
  main.textContent = t("scoreOn", score, total);
  const sub = document.createElement("span");
  sub.className = "sub";
  sub.textContent = t("percent", percent);
  scoreRow.append(main, sub);

  const hint = document.createElement("p");
  hint.className = "muted";
  hint.textContent = t("gridHint");

  const grid = document.createElement("div");
  grid.className = "result-grid";
  results.forEach((res, idx) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "result-cell " + (res.correct ? "ok" : "ko");
    cell.textContent = `${idx + 1}`;
    if (!res.correct) {
      cell.addEventListener("click", () => showTooltip(buildTooltip(res)));
    } else {
      cell.title = t("correctShort");
    }
    grid.appendChild(cell);
  });

  const reviewBlock = document.createElement("div");
  reviewBlock.className = "mistake-list";
  const reviewTitle = document.createElement("h4");
  reviewTitle.textContent = t("mistakesTitle");
  reviewBlock.appendChild(reviewTitle);
  if (!results.length) {
    const ok = document.createElement("p");
    ok.className = "muted";
    ok.textContent = t("mistakesEmpty");
    reviewBlock.appendChild(ok);
  } else {
    results.forEach((item, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "mistake-item";
      const status = document.createElement("span");
      status.className = "status-dot " + (item.correct ? "ok" : "ko");
      const qTitle = document.createElement("p");
      qTitle.className = "question-title small";
      qTitle.innerHTML = `${idx + 1}. ${item.question.prompt}`;
      const answerLine = document.createElement("p");
      answerLine.className = "muted";
      const userOpt = item.question.options.find((o) => o.key === item.userAnswer);
      answerLine.innerHTML = `<strong>${t("tooltipYourAnswer")}:</strong> ${userOpt ? userOpt.text : "—"}`;
      const correctLine = document.createElement("p");
      correctLine.className = "muted";
      const correctOpt = item.question.options.find((o) => o.key === item.question.answerLetter);
      correctLine.innerHTML = `<strong>${t("tooltipCorrect")}:</strong> ${correctOpt ? correctOpt.text : "—"}`;
      const expl = document.createElement("p");
      expl.className = "muted";
      expl.innerHTML = item.explanation || "";
      wrap.append(status, qTitle, answerLine, correctLine, expl);
      reviewBlock.appendChild(wrap);
    });
  }

  summary.append(title, scoreRow, hint, grid, reviewBlock);
  elements.quizBody.appendChild(summary);
  setQuizTitleWithDot(t("summarySubtitle"));
  elements.progressBadge.textContent = t("scoreOn", score, total);
  updateNavButtons();
}

function buildTooltip(res) {
  const userOpt = res.question.options.find((o) => o.key === res.userAnswer);
  const correctOpt = res.question.options.find((o) => o.key === res.question.answerLetter);
  return `
    <strong>${t("tooltipTitleWrong")}</strong><br/>
    ${res.question.prompt}<br/><br/>
    ${t("tooltipYourAnswer")}: ${userOpt ? userOpt.text : "—"}<br/>
    ${t("tooltipCorrect")}: ${correctOpt ? correctOpt.text : "—"}<br/>
    ${t("tooltipExplanation")}: ${res.explanation || ""}
  `;
}

function buildRevisionFeedback(question) {
  if (!state.revisionMode || !state.reviewPause) return null;
  const userAnswer = state.answers[question.id];
  if (!userAnswer) return null;
  const isCorrect = userAnswer.toLowerCase() === question.answerLetter?.toLowerCase();
  if (isCorrect) return null;
  const wrap = document.createElement("div");
  wrap.className = "revision-feedback";
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = t("tooltipTitleWrong");
  const your = document.createElement("div");
  your.className = "muted";
  const userOpt = question.options.find((o) => o.key === userAnswer);
  your.innerHTML = `<strong>${t("tooltipYourAnswer")}:</strong> ${userOpt ? userOpt.text : "—"}`;
  const correct = document.createElement("div");
  correct.className = "muted";
  const correctOpt = question.options.find((o) => o.key === question.answerLetter);
  correct.innerHTML = `<strong>${t("tooltipCorrect")}:</strong> ${correctOpt ? correctOpt.text : "—"}`;
  const expl = document.createElement("div");
  expl.className = "muted";
  expl.innerHTML = question.explanation || "";
  wrap.append(title, your, correct, expl);
  return wrap;
}

let tooltipTimeout;
function showTooltip(html) {
  elements.tooltip.innerHTML = html;
  elements.tooltip.classList.remove("hidden");
  clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => elements.tooltip.classList.add("hidden"), 6000);
}

let snackbarTimeout;
function showSnackbar(message) {
  elements.snackbar.textContent = message;
  elements.snackbar.classList.remove("hidden");
  clearTimeout(snackbarTimeout);
  snackbarTimeout = setTimeout(() => elements.snackbar.classList.add("hidden"), 2800);
}

function renderHistory() {
  elements.historyBody.innerHTML = "";
  elements.historyCount.textContent = state.history.length;
  if (!state.history.length) {
    elements.historyBody.appendChild(elements.historyPlaceholder);
    elements.historyPlaceholder.textContent = t("historyEmpty");
    return;
  }
  state.history.slice(0, 12).forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    const meta = document.createElement("div");
    meta.className = "meta";
    const title = document.createElement("strong");
    title.textContent = t("sessionLabel", item.total);
    const date = document.createElement("span");
    date.className = "muted";
    date.textContent = formatDate(item.date);
    meta.append(title, date);

    const chip = document.createElement("div");
    chip.className = "score-chip";
    chip.textContent = `${item.score}/${item.total} · ${item.percent}%`;
    row.append(meta, chip);
    elements.historyBody.appendChild(row);
  });
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  } catch (e) {
    return dateStr;
  }
}

function syncTexts() {
  elements.heroEyebrow.textContent = t("heroEyebrow");
  elements.heroTitle.textContent = t("heroTitle");
  elements.heroDesc.textContent = t("heroDesc");
  elements.revisionLabel.textContent = t("revisionLabel");
  elements.revisionToggle.textContent = t("revisionLabel");
  elements.startLabel.textContent = t("start");
  const themeLabel = document.getElementById("theme-label");
  const sizeLabel = document.getElementById("size-label");
  if (themeLabel) themeLabel.textContent = "Thèmes";
  if (sizeLabel) sizeLabel.textContent = "Nombre de questions";
  elements.quizEyebrow.textContent = t("quizEyebrow");
  elements.quizPlaceholder.textContent = t("quizPlaceholder");
  elements.nextLabel.textContent = t("next");
  elements.menuLabel.textContent = t("mainMenu");
  elements.historyEyebrow.textContent = "Historique";
  elements.historyTitle.textContent = "Vos dernières notes";
  elements.historyPlaceholder.textContent = "Aucun questionnaire complété pour l’instant.";
  if (elements.flashStartLabel) elements.flashStartLabel.textContent = t("start");
  if (elements.flashNextLabel) elements.flashNextLabel.textContent = t("next");
  if (elements.flashPlaceholder) elements.flashPlaceholder.textContent = t("flashPlaceholder");
}

function setQuizTitleWithDot(text, question) {
  elements.quizTitle.textContent = "";
  if (state.selectedTheme === "mix" && question?.themeId) {
    const dot = document.createElement("span");
    dot.className = "question-dot header-dot";
    const themeConf = getThemeById(question.themeId) || themesConfig[0];
    dot.style.background = themeConf.color || themesConfig[0].color;
    elements.quizTitle.appendChild(dot);
  }
  elements.quizTitle.appendChild(document.createTextNode(text || ""));
}

function setActiveSessionButton(size) {
  elements.sessionButtons.forEach((btn) => {
    const value = Number(btn.dataset.size);
    const allowed = getAllowedSizes().includes(value);
    btn.style.display = allowed ? "" : "none";
    btn.classList.toggle("active", value === size && allowed);
  });
}

function renderThemeButtons() {
  if (!elements.themeSelector) return;
  const buttons = Array.from(elements.themeSelector.querySelectorAll(".theme-btn"));
  buttons.forEach((btn) => {
    const id = btn.dataset.theme || "mix";
    const conf = getThemeById(id);
    const dot = btn.querySelector(".theme-dot");
    if (dot) dot.style.background = conf.color || themesConfig[0].color;
    const label = btn.querySelector("span:last-child");
    if (label) label.textContent = conf.short;
    btn.classList.toggle("active", state.selectedTheme === id);
  });
}

function getAllowedSizes() {
  return [10, 20, 40];
}

function setActiveFlashSessionButton(size) {
  elements.flashSessionButtons.forEach((btn) => {
    const value = Number(btn.dataset.size);
    btn.classList.toggle("active", value === size);
  });
}

function renderFlashThemeButtons() {
  if (!elements.flashThemeSelector) return;
  const buttons = Array.from(elements.flashThemeSelector.querySelectorAll(".theme-btn"));
  buttons.forEach((btn) => {
    const id = btn.dataset.theme || flashThemes[0].id;
    const conf = getFlashThemeById(id);
    const dot = btn.querySelector(".theme-dot");
    if (dot) dot.style.background = conf.color || flashThemes[0].color;
    const label = btn.querySelector("span:last-child");
    if (label) label.textContent = conf.label;
    btn.classList.toggle("active", state.flashSelectedTheme === id);
  });
}

function renderFlashPlaceholder() {
  if (elements.flashProgress) elements.flashProgress.textContent = "0 / 0";
  if (elements.flashBody && elements.flashPlaceholder) {
    elements.flashBody.innerHTML = "";
    elements.flashBody.appendChild(elements.flashPlaceholder);
    elements.flashPlaceholder.textContent = t("flashPlaceholder");
  }
  if (elements.flashMenuBtn) elements.flashMenuBtn.style.display = "none";
  if (elements.flashNextBtn) elements.flashNextBtn.disabled = true;
}

function startFlashSession() {
  if (!state.flashcards.length) {
    showSnackbar(t("dataError"));
    loadFlashcards();
    return;
  }
  const pool = state.flashcards.filter((c) => c.themeId === state.flashSelectedTheme);
  if (!pool.length) {
    showSnackbar("Aucune carte pour ce thème.");
    return;
  }
  const size = Math.min(state.flashSessionSize, pool.length);
  state.flashSession = shuffle(pool).slice(0, size);
  state.flashCurrentIndex = 0;
  state.flashFinished = false;
  setRoute("flash");
  renderFlashCard();
}

function renderFlashCard() {
  if (!elements.flashBody) return;
  elements.flashBody.innerHTML = "";
  if (!state.flashSession.length) {
    renderFlashPlaceholder();
    updateFlashNavButtons();
    return;
  }

  if (state.flashFinished) {
    renderFlashSummary();
    return;
  }

  const card = state.flashSession[state.flashCurrentIndex];
  const total = state.flashSession.length;
  if (elements.flashTitle) elements.flashTitle.textContent = `Carte ${state.flashCurrentIndex + 1} / ${total}`;
  if (elements.flashProgress) elements.flashProgress.textContent = `${state.flashCurrentIndex + 1} / ${total}`;

  const container = document.createElement("div");
  container.className = "question-container";

  const progress = document.createElement("div");
  progress.className = "progress";
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  bar.style.width = `${((state.flashCurrentIndex + 1) / total) * 100}%`;
  progress.appendChild(bar);

  const title = document.createElement("p");
  title.className = "question-title";
  title.textContent = card.phrase;

  const details = document.createElement("div");
  details.className = "flash-details";
  const addRow = (label, value) => {
    if (!value) return;
    const row = document.createElement("p");
    row.innerHTML = `<strong>${label} :</strong> ${value}`;
    details.appendChild(row);
  };
  addRow("Sens littéral", card.literal);
  addRow("Sous-texte", card.subtext);
  addRow("Conséquence probable", card.consequence);
  addRow("Réponse safe", card.response);
  addRow("Contexte / repère", card.context);

  container.append(progress, title, details);
  elements.flashBody.append(container);
  updateFlashNavButtons();
}

function updateFlashNavButtons() {
  if (!elements.flashNextLabel || !elements.flashNextBtn) return;
  if (state.flashFinished) {
    elements.flashNextLabel.textContent = t("start");
    elements.flashNextBtn.disabled = false;
    if (elements.flashMenuBtn) {
      elements.flashMenuBtn.style.display = "";
      elements.flashMenuBtn.disabled = false;
    }
  } else {
    elements.flashNextLabel.textContent =
      state.flashSession.length && state.flashCurrentIndex === state.flashSession.length - 1 ? t("finish") : t("next");
    elements.flashNextBtn.disabled = !state.flashSession.length;
    if (elements.flashMenuBtn) elements.flashMenuBtn.style.display = "none";
  }
}

function nextFlashStep() {
  if (!state.flashSession.length || state.flashFinished) return;
  if (state.flashCurrentIndex === state.flashSession.length - 1) {
    finalizeFlashSession();
  } else {
    state.flashCurrentIndex += 1;
    renderFlashCard();
  }
}

function finalizeFlashSession() {
  state.flashFinished = true;
  renderFlashSummary();
}

function renderFlashSummary() {
  if (!elements.flashBody) return;
  const total = state.flashSession.length;
  elements.flashBody.innerHTML = "";
  if (elements.flashTitle) elements.flashTitle.textContent = t("flashSummaryTitle");
  if (elements.flashProgress) elements.flashProgress.textContent = `${total} / ${total}`;

  const summary = document.createElement("div");
  summary.className = "summary";

  const title = document.createElement("h3");
  title.textContent = t("flashListTitle");

  summary.appendChild(title);

  if (!total) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = t("flashNoCards");
    summary.appendChild(empty);
  } else {
    state.flashSession.forEach((card, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "mistake-item";
      const qTitle = document.createElement("p");
      qTitle.className = "question-title small";
      qTitle.textContent = `${idx + 1}. ${card.phrase}`;
      const details = document.createElement("div");
      details.className = "flash-details";
      const addRow = (label, value) => {
        if (!value) return;
        const row = document.createElement("p");
        row.innerHTML = `<strong>${label} :</strong> ${value}`;
        details.appendChild(row);
      };
      addRow("Sens littéral", card.literal);
      addRow("Sous-texte", card.subtext);
      addRow("Conséquence probable", card.consequence);
      addRow("Réponse safe", card.response);
      addRow("Contexte / repère", card.context);
      wrap.append(qTitle, details);
      summary.appendChild(wrap);
    });
  }

  elements.flashBody.append(summary);
  updateFlashNavButtons();
}

function init() {
  setTheme(state.theme);
  renderThemeButtons();
  renderFlashThemeButtons();
  syncTexts();
  renderHistory();
  loadQuestions();
  loadFlashcards();
  const initialRoute = window.location.hash === "#/quizz" ? "quizz" : window.location.hash === "#/flash" ? "flash" : "home";
  setRoute(initialRoute);

  elements.sessionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.sessionSize = Number(btn.dataset.size);
      setActiveSessionButton(state.sessionSize);
    });
  });
  setActiveSessionButton(state.sessionSize);

  if (elements.themeSelector) {
    elements.themeSelector.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-btn");
      if (!btn) return;
      state.selectedTheme = btn.dataset.theme || "mix";
      renderThemeButtons();
      if (!getAllowedSizes().includes(state.sessionSize)) {
        state.sessionSize = getAllowedSizes()[0];
        setActiveSessionButton(state.sessionSize);
      }
      renderQuestion();
    });
  }

  elements.flashSessionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.flashSessionSize = Number(btn.dataset.size);
      setActiveFlashSessionButton(state.flashSessionSize);
    });
  });
  setActiveFlashSessionButton(state.flashSessionSize);

  if (elements.flashThemeSelector) {
    elements.flashThemeSelector.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-btn");
      if (!btn) return;
      state.flashSelectedTheme = btn.dataset.theme || flashThemes[0].id;
      renderFlashThemeButtons();
    });
  }

  elements.themeToggle.addEventListener("click", () => setTheme(state.theme === "light" ? "dark" : "light"));
  elements.startBtn.addEventListener("click", startSession);
  elements.nextBtn.addEventListener("click", () => {
    if (state.finished) {
      state.finished = false;
      startSession();
    } else {
      nextStep();
    }
  });
  if (elements.menuBtn) {
    elements.menuBtn.addEventListener("click", () => {
      state.finished = false;
      state.session = [];
      state.answers = {};
      state.currentIndex = 0;
      state.reviewPause = false;
      renderQuestion();
      setRoute("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (elements.revisionToggle) {
    const setRevisionUI = () => {
      elements.revisionToggle.classList.toggle("active", state.revisionMode);
      elements.revisionToggle.setAttribute("aria-pressed", state.revisionMode ? "true" : "false");
    };
    setRevisionUI();
    elements.revisionToggle.addEventListener("click", () => {
      state.revisionMode = !state.revisionMode;
      localStorage.setItem("biz-revision", state.revisionMode ? "1" : "0");
      setRevisionUI();
      state.reviewPause = false;
      renderQuestion();
    });
  }

  document.addEventListener("click", (e) => {
    if (!elements.tooltip.contains(e.target)) {
      elements.tooltip.classList.add("hidden");
    }
  });

  elements.historyClear.addEventListener("click", () => {
    state.history = [];
    saveHistory();
    renderHistory();
  });

  if (elements.flashStartBtn) elements.flashStartBtn.addEventListener("click", startFlashSession);
  if (elements.flashNextBtn) {
    elements.flashNextBtn.addEventListener("click", () => {
      if (state.flashFinished) {
        state.flashFinished = false;
        startFlashSession();
      } else {
        nextFlashStep();
      }
    });
  }
  if (elements.flashMenuBtn) {
    elements.flashMenuBtn.addEventListener("click", () => {
      state.flashFinished = false;
      state.flashSession = [];
      state.flashCurrentIndex = 0;
      setRoute("home");
      renderFlashPlaceholder();
    });
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash === "#/quizz") {
      setRoute("quizz");
    } else if (hash === "#/flash") {
      setRoute("flash");
    } else {
      setRoute("home");
    }
  });

  renderQuestion();
  renderFlashPlaceholder();
}

init();
