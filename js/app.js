// =====================================================================
// app.js — draws every page and reacts to your clicks.
//
// How it works:
//   1. Each page has a render function that RETURNS an HTML string.
//   2. render() puts that string inside <main id="app">.
//   3. Buttons have data-action="..." — one click listener reads it
//      and calls the matching function in the "actions" object.
// =====================================================================

const app = document.querySelector("#app");

let currentView = "today";
let lessonState = null;    // the lesson you are doing right now
let reviewState = null;    // the word review you are doing right now
let challengeState = null; // the challenge you are doing right now

// ---------- SMALL HELPERS ----------

// Makes user text safe to put inside HTML (so "<" doesn't break the page).
function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Makes answers easy to compare: "  Start. " and "start" become equal.
function norm(text) {
  return text.toLowerCase().replace(/[’]/g, "'").replace(/[.!?,]/g, "").replace(/\s+/g, " ").trim();
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Mixes an array into random order (Fisher–Yates shuffle).
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function findWord(id) { return WORDS.find((w) => w.id === id); }
function findLesson(id) { return LESSONS.find((l) => l.id === id); }
function findGrammar(id) { return GRAMMAR.find((g) => g.id === id); }
function findChallenge(id) { return CHALLENGES.find((c) => c.id === id); }

function nextLesson() {
  return LESSONS.find((l) => isLessonUnlocked(l.id) && !isLessonDone(l.id));
}

function nextChallenge() {
  return CHALLENGES.find((c) => isChallengeUnlocked(c) && !isChallengeDone(c));
}

// ---------- NAVIGATION ----------

function go(view) {
  currentView = view;
  render();
  window.scrollTo(0, 0);
}

function render() {
  const views = {
    today: renderToday,
    lessons: renderLessons,
    words: renderWords,
    grammar: renderGrammar,
    challenges: renderChallenges,
    progress: renderProgress,
    lesson: renderLessonPlayer,
    review: renderReview,
    challenge: renderChallenge,
  };
  app.innerHTML = views[currentView]();
  updateHeader();

  // Put the cursor in the right input (or on the "Next" button).
  const focusMe = app.querySelector("[data-focus]");
  if (focusMe) focusMe.focus();
}

function updateHeader() {
  // The lesson player belongs to "Lessons", the review to "Words", etc.
  const parent = { lesson: "lessons", review: "words", challenge: "challenges" };
  const active = parent[currentView] || currentView;

  document.querySelectorAll("#nav button").forEach(function (button) {
    button.classList.toggle("active", button.dataset.view === active);
  });

  document.querySelector("#xp-badge").textContent =
    "🔥 " + progress.streak + "  ·  Lv " + level() + "  ·  " + progress.xp + " XP" + (cloudUser ? "  ·  ☁️" : "");
}

// ---------- SHARED PIECES OF HTML ----------

function statsRow() {
  const lessonsDone = LESSONS.filter((l) => isLessonDone(l.id)).length;
  return `
    <div class="stats">
      <div class="stat"><strong>🔥 ${progress.streak}</strong><span>day streak</span></div>
      <div class="stat"><strong>⭐ Lv ${level()}</strong><span>${progress.xp} XP</span></div>
      <div class="stat"><strong>📚 ${Object.keys(progress.words).length}/${WORDS.length}</strong><span>words unlocked</span></div>
      <div class="stat"><strong>✅ ${lessonsDone}/${LESSONS.length}</strong><span>lessons done</span></div>
    </div>`;
}

function levelDots(box) {
  let dots = "";
  for (let i = 0; i < INTERVALS.length; i++) {
    dots += `<span class="${i <= box ? "on" : ""}"></span>`;
  }
  return `<div class="dots" title="Memory level ${box + 1} of ${INTERVALS.length}">${dots}</div>`;
}

function wordCard(word) {
  const saved = progress.words[word.id];
  return `
    <article class="card word">
      <div class="word-head"><h3>${word.word}</h3><span class="pill">${word.type}</span></div>
      <p>${word.meaning}</p>
      <p class="example">${word.example}</p>
      ${saved ? levelDots(saved.box) + `<p class="muted small">Next review: ${saved.due}</p>` : ""}
    </article>`;
}

function grammarBox(g) {
  return `
    <div class="grammar">
      <p class="pattern"><code>${g.pattern}</code></p>
      <p>${g.rule}</p>
      <ul class="examples">${g.examples.map((e) => `<li>${e}</li>`).join("")}</ul>
      <div class="mistake">
        <p>❌ ${g.mistake.wrong}</p>
        <p>✅ ${g.mistake.right}</p>
        <p class="muted small">${g.mistake.why}</p>
      </div>
    </div>`;
}

function checklistHTML(checks) {
  return `<ul class="checklist">${checks
    .map((c) => `<li class="${c.ok ? "ok" : "no"}">${c.ok ? "✅" : "⬜"} ${c.label}</li>`)
    .join("")}</ul>`;
}

function lockedCard(title, reason) {
  return `<article class="card locked"><h3>🔒 ${title}</h3><p class="muted">${reason}</p></article>`;
}

// =====================================================================
// PAGE: TODAY (your 20-minute routine)
// =====================================================================

function renderToday() {
  const due = dueWords().length;
  const unlocked = Object.keys(progress.words).length;
  const lesson = nextLesson();
  const challenge = nextChallenge();
  const wroteToday = progress.journal.some((j) => j.date === today());

  // Step 1 — Recall
  let recall = `<p class="muted">Finish Lesson 1 to unlock your first words.</p>`;
  if (due > 0) {
    recall = `<button class="btn" data-action="start-review">Review ${due} word${due > 1 ? "s" : ""}</button>`;
  } else if (unlocked > 0) {
    recall = `<p class="ok-text">Nothing due today ✓</p>
      <button class="btn secondary" data-action="extra-practice">Extra practice</button>`;
  }

  // Step 2 — Learn
  const learn = lesson
    ? `<p><strong>Lesson ${lesson.id}:</strong> ${lesson.title}</p>
       <button class="btn" data-action="start-lesson" data-id="${lesson.id}">Start lesson</button>`
    : `<p class="ok-text">All lessons done! 🎉</p>`;

  // Step 3 — Practise
  const practise = challenge
    ? `<p><strong>${challenge.title}</strong></p>
       <button class="btn" data-action="open-challenge" data-id="${challenge.id}">Open challenge</button>`
    : `<p class="muted">${lesson ? "Finish a lesson to unlock a real-life challenge." : "All challenges done! 🎉"}</p>`;

  return `
    <section class="page-head">
      <p class="tag">Today · ${today()}</p>
      <h1>Your 20-minute routine</h1>
      <p class="lead">Recall → Learn → Practise → Reflect. Do them in order.</p>
    </section>

    ${statsRow()}

    <div class="grid routine">
      <article class="card step"><span class="time">5 min</span><h3>1. Recall</h3>
        <p class="muted">Remember old words without looking.</p>${recall}</article>
      <article class="card step"><span class="time">5 min</span><h3>2. Learn</h3>
        <p class="muted">2–3 new words and one grammar pattern.</p>${learn}</article>
      <article class="card step"><span class="time">7 min</span><h3>3. Practise</h3>
        <p class="muted">Write in a real situation.</p>${practise}</article>
    </div>

    <section class="card journal">
      <span class="time">3 min</span>
      <h3>4. Reflect ${wroteToday ? `<span class="ok-text small">✓ saved today</span>` : ""}</h3>
      <p class="muted">Write in English. Short answers are fine.</p>
      <label>What did I learn today?<textarea id="j-learned" rows="2"></textarea></label>
      <label>What did I forget or find difficult?<textarea id="j-forgot" rows="2"></textarea></label>
      <label>What will I review tomorrow?<textarea id="j-next" rows="2"></textarea></label>
      <button class="btn" data-action="save-journal">Save reflection</button>
    </section>`;
}

// =====================================================================
// PAGE: LESSONS (list)
// =====================================================================

function renderLessons() {
  const phases = PHASES.map(function (phase) {
    const cards = LESSONS.filter((l) => l.phase === phase.id).map(lessonCard).join("");
    return `
      <section class="phase">
        <p class="tag">${phase.weeks}</p>
        <h2>Phase ${phase.id} — ${phase.title}</h2>
        <p class="muted">${phase.goal}</p>
        <div class="grid">${cards}</div>
      </section>`;
  }).join("");

  return `
    <section class="page-head">
      <h1>Lessons</h1>
      <p class="lead">Each lesson unlocks new words, a grammar pattern, a challenge, and the next lesson. You need ${PASS_SCORE}% to pass.</p>
    </section>
    ${phases}`;
}

function lessonCard(lesson) {
  if (!isLessonUnlocked(lesson.id)) {
    return lockedCard("Lesson " + lesson.id + ": " + lesson.title, "Finish Lesson " + (lesson.id - 1) + " first.");
  }
  const saved = progress.lessons[lesson.id];
  const status = isLessonDone(lesson.id)
    ? `<p class="ok-text">✓ Done · best score ${saved.best}%</p>`
    : saved ? `<p class="muted">Best score ${saved.best}% — try again!</p>` : `<p class="new-text">New</p>`;

  return `
    <article class="card">
      <span class="num">${lesson.id}</span>
      <h3>${lesson.title}</h3>
      <p class="muted">${lesson.goal}</p>
      ${status}
      <button class="btn small" data-action="start-lesson" data-id="${lesson.id}">
        ${isLessonDone(lesson.id) ? "Practise again" : "Start"}
      </button>
    </article>`;
}

// =====================================================================
// PAGE: LESSON PLAYER (intro → exercises → results)
// =====================================================================

function startLesson(id) {
  lessonState = { lesson: findLesson(id), step: -1, score: 0 };
  go("lesson");
}

// Moves to the next exercise and clears the old answer.
function nextStep() {
  const s = lessonState;
  s.step = s.step + 1;
  s.answered = false;
  s.correct = false;
  s.feedback = "";
  s.input = "";
  s.chosen = null;

  const exercise = s.lesson.exercises[s.step];
  if (exercise && exercise.type === "order") {
    s.pool = shuffle(exercise.answer.split(" "));
    s.picked = []; // positions in s.pool, in the order you clicked them
  }

  // Finished the last exercise → save the result once.
  if (s.step === s.lesson.exercises.length) {
    s.percent = Math.round((s.score / s.lesson.exercises.length) * 100);
    s.firstPass = finishLesson(s.lesson, s.percent);
    if (s.firstPass) addXP(20);
  }
  render();
}

function renderLessonPlayer() {
  const s = lessonState;
  const lesson = s.lesson;
  const back = `<button class="link" data-action="go" data-view="lessons">← All lessons</button>`;

  // 1. Intro: teach before testing
  if (s.step === -1) {
    return `
      ${back}
      <section class="page-head">
        <p class="tag">Lesson ${lesson.id} · Phase ${lesson.phase}</p>
        <h1>${lesson.title}</h1>
        <p class="lead">🎯 Goal: ${lesson.goal}</p>
      </section>
      <h2>New words</h2>
      <p class="muted">Read each word. Say the example out loud.</p>
      <div class="grid">${lesson.words.map((id) => wordCard(findWord(id))).join("")}</div>
      <h2 class="space">Grammar pattern</h2>
      ${grammarBox(findGrammar(lesson.grammar))}
      <button class="btn space" data-action="lesson-next" data-focus>Start exercises →</button>`;
  }

  // 3. Results
  if (s.step >= lesson.exercises.length) return renderLessonResults();

  // 2. One exercise
  const exercise = lesson.exercises[s.step];
  const total = lesson.exercises.length;
  const bar = `<div class="bar"><span style="width:${(s.step / total) * 100}%"></span></div>
    <p class="muted small">Exercise ${s.step + 1} of ${total}</p>`;

  const exerciseHTML = {
    choice: renderChoice,
    fill: renderFill,
    order: renderOrder,
    use: renderUse,
  }[exercise.type](exercise, s);

  const feedback = s.answered
    ? `<div class="feedback ${s.correct ? "ok" : "no"}">${s.feedback}</div>
       <button class="btn" data-action="lesson-next" data-focus>${s.step === total - 1 ? "See results" : "Next →"}</button>`
    : "";

  return `${back}${bar}<section class="exercise">${exerciseHTML}${feedback}</section>`;
}

function renderChoice(exercise, s) {
  const buttons = exercise.options.map(function (option, i) {
    let state = "";
    if (s.answered && i === exercise.answer) state = "right";
    else if (s.answered && i === s.chosen) state = "wrong";
    return `<button class="option ${state}" data-action="choice" data-i="${i}" ${s.answered ? "disabled" : ""}>${option}</button>`;
  });
  return `<h2>${exercise.question}</h2><div class="options">${buttons.join("")}</div>`;
}

function renderFill(exercise, s) {
  return `
    <h2>Fill in the blank</h2>
    <p class="sentence">${exercise.sentence.replace("___", "<span class='blank'>_____</span>")}</p>
    <input id="fill-input" class="input" autocomplete="off" placeholder="Type the missing word"
      value="${esc(s.input)}" data-enter="check-fill" ${s.answered ? "disabled" : "data-focus"} />
    ${s.answered ? "" : `<button class="btn" data-action="check-fill">Check</button>`}`;
}

function renderOrder(exercise, s) {
  const picked = s.picked
    .map((poolIndex, position) =>
      `<button class="chip" data-action="order-remove" data-i="${position}" ${s.answered ? "disabled" : ""}>${esc(s.pool[poolIndex])}</button>`)
    .join("");
  const pool = s.pool
    .map((word, i) => s.picked.includes(i) ? "" :
      `<button class="chip" data-action="order-add" data-i="${i}">${esc(word)}</button>`)
    .join("");

  return `
    <h2>Build the sentence</h2>
    <p class="muted">Click the words in the right order. Click a word again to remove it.</p>
    <div class="answer-line">${picked || `<span class="muted">Your sentence appears here…</span>`}</div>
    ${s.answered ? "" : `<div class="chips">${pool}</div>
      <button class="btn" data-action="check-order" ${s.picked.length < s.pool.length ? "disabled" : ""}>Check</button>`}`;
}

function renderUse(exercise, s) {
  const word = findWord(exercise.word);
  return `
    <h2>Use it in your own sentence</h2>
    <p>Write one sentence with <strong>${word.word}</strong>. Think about your real life: your brother, a client, or your website.</p>
    <p class="muted small">Don't scroll up. Produce it from memory.</p>
    <textarea id="use-input" rows="3" ${s.answered ? "disabled" : "data-focus"}>${esc(s.input)}</textarea>
    ${s.answered ? "" : `<button class="btn" data-action="check-use">Check</button>`}`;
}

function useChecks(text, word) {
  const t = text.trim();
  return [
    { label: `Uses the word "${word.word}"`, ok: t.toLowerCase().includes(word.word.toLowerCase().slice(0, 5)) },
    { label: "At least 6 words", ok: countWords(t) >= 6 },
    { label: "Starts with a capital letter", ok: /^[A-Z]/.test(t) },
    { label: "Ends with . ? or !", ok: /[.?!]$/.test(t) },
  ];
}

// Called after every exercise answer.
function answerExercise(correct, feedback) {
  const s = lessonState;
  s.answered = true;
  s.correct = correct;
  s.feedback = feedback;
  if (correct) {
    s.score = s.score + 1;
    addXP(10);
  }
  render();
}

function renderLessonResults() {
  const s = lessonState;
  const lesson = s.lesson;
  const passed = s.percent >= PASS_SCORE;
  const next = findLesson(lesson.id + 1);
  const challenge = CHALLENGES.find((c) => c.lesson === lesson.id);

  const unlocks = s.firstPass ? `
    <div class="card unlocks">
      <h3>🔓 You unlocked</h3>
      <ul>
        <li>📚 Words: ${lesson.words.map((id) => findWord(id).word).join(", ")} (first review tomorrow)</li>
        <li>✏️ Grammar: ${findGrammar(lesson.grammar).title}</li>
        ${challenge ? `<li>💬 Challenge: ${challenge.title}</li>` : ""}
        ${next ? `<li>➡️ Lesson ${next.id}: ${next.title}</li>` : ""}
      </ul>
      <p class="ok-text">+20 XP bonus</p>
    </div>` : "";

  return `
    <section class="page-head center">
      <h1>${passed ? "🎉 Lesson complete!" : "Almost there!"}</h1>
      <p class="big">${s.score} / ${lesson.exercises.length} · ${s.percent}%</p>
      <p class="lead">${passed ? "Great work. Mistakes are information — they show you what to practise." : `You need ${PASS_SCORE}% to pass. Read the words again and try once more.`}</p>
    </section>
    ${unlocks}
    <div class="row">
      ${passed && challenge ? `<button class="btn" data-action="open-challenge" data-id="${challenge.id}" data-focus>Try the challenge</button>` : ""}
      ${!passed ? `<button class="btn" data-action="start-lesson" data-id="${lesson.id}" data-focus>Try again</button>` : ""}
      ${passed && next ? `<button class="btn secondary" data-action="start-lesson" data-id="${next.id}">Next lesson</button>` : ""}
      <button class="btn secondary" data-action="go" data-view="today">Back to Today</button>
    </div>`;
}

// =====================================================================
// PAGE: WORDS (all words + spaced repetition review)
// =====================================================================

function renderWords() {
  const due = dueWords().length;
  const unlocked = Object.keys(progress.words).length;

  const groups = LESSONS.map(function (lesson) {
    const cards = lesson.words.map(function (id) {
      return progress.words[id]
        ? wordCard(findWord(id))
        : lockedCard("? ? ?", "Finish Lesson " + lesson.id + " to unlock.");
    }).join("");
    return `<h3 class="space">Lesson ${lesson.id}: ${lesson.title}</h3><div class="grid">${cards}</div>`;
  }).join("");

  return `
    <section class="page-head">
      <h1>Your words</h1>
      <p class="lead">Words unlock when you pass lessons. Review them on the right day and they move into long-term memory.</p>
      <div class="row">
        ${due ? `<button class="btn" data-action="start-review">Review ${due} due word${due > 1 ? "s" : ""}</button>` : ""}
        ${unlocked ? `<button class="btn secondary" data-action="extra-practice">Extra practice</button>` : ""}
      </div>
    </section>
    <div class="card info">
      <strong>How memory levels work</strong>
      <p class="muted">Remember a word → it moves up a level and comes back later: 1 day → 3 → 7 → 14 → 30 days.
      Forget it → back to level 1, and you see it tomorrow. ${levelDots(2)}</p>
    </div>
    ${groups}`;
}

function startReview(extra) {
  const ids = extra ? shuffle(Object.keys(progress.words)).slice(0, 8) : shuffle(dueWords());
  reviewState = { queue: ids, index: 0, correct: 0, extra: extra, answered: false, hint: false, input: "" };
  go("review");
}

// Hides the word inside its example sentence: "Can you _____ what you mean?"
function blankExample(word) {
  return word.example.replace(new RegExp(word.word, "i"), "<span class='blank'>_____</span>");
}

function renderReview() {
  const r = reviewState;
  const total = r.queue.length;

  if (r.index >= total) {
    return `
      <section class="page-head center">
        <h1>Review finished 🧠</h1>
        <p class="big">${r.correct} / ${total}</p>
        <p class="lead">${r.extra ? "Extra practice doesn't change your schedule." : "Words you forgot will come back tomorrow."}</p>
        <div class="row center">
          <button class="btn" data-action="go" data-view="today" data-focus>Back to Today</button>
          <button class="btn secondary" data-action="go" data-view="words">See all words</button>
        </div>
      </section>`;
  }

  const word = findWord(r.queue[r.index]);
  let feedback = "";
  if (r.answered) {
    const saved = progress.words[word.id];
    const when = r.extra ? "" : r.lastCorrect
      ? ` Next review in ${INTERVALS[saved.box]} days.`
      : " You'll see it again tomorrow.";
    feedback = `
      <div class="feedback ${r.lastCorrect ? "ok" : "no"}">
        ${r.lastCorrect ? "✅ Correct!" : `❌ The word is <strong>${word.word}</strong>.`}${when}
        <p class="small">💡 Now say a NEW sentence with "${word.word}" out loud.</p>
      </div>
      <button class="btn" data-action="review-next" data-focus>Next →</button>`;
  }

  return `
    <button class="link" data-action="go" data-view="words">← Words</button>
    <div class="bar"><span style="width:${(r.index / total) * 100}%"></span></div>
    <p class="tag">${r.extra ? "Extra practice" : "Review"} · ${r.index + 1} of ${total}</p>
    <h1>Which word is it?</h1>
    <div class="card recall">
      <p class="meaning">${word.meaning}</p>
      <p class="sentence">${blankExample(word)}</p>
      ${r.hint ? `<p class="muted">Hint: starts with "<strong>${word.word[0]}</strong>" · ${word.word.length} letters</p>` : ""}
    </div>
    <input id="review-input" class="input" autocomplete="off" placeholder="Type the word"
      value="${esc(r.input)}" data-enter="review-check" ${r.answered ? "disabled" : "data-focus"} />
    ${r.answered ? feedback : `
      <div class="row">
        <button class="btn" data-action="review-check">Check</button>
        ${r.hint ? "" : `<button class="btn secondary" data-action="review-hint">Hint</button>`}
      </div>`}`;
}

// =====================================================================
// PAGE: GRAMMAR
// =====================================================================

function renderGrammar() {
  const cards = GRAMMAR.map(function (g) {
    if (!isLessonDone(g.lesson)) {
      return lockedCard(g.title, "Finish Lesson " + g.lesson + " to unlock.");
    }
    const practice = g.practice.map((p, i) => `
      <label class="practice-row">
        <span>${p.sentence}</span>
        <input class="input small" data-gi="${i}" autocomplete="off" />
        <span class="mark"></span>
      </label>`).join("");

    return `
      <article class="card" data-grammar="${g.id}">
        <p class="tag">From Lesson ${g.lesson}</p>
        <h3>${g.title}</h3>
        ${grammarBox(g)}
        <h4>Quick practice</h4>
        ${practice}
        <button class="btn small" data-action="grammar-check" data-id="${g.id}">Check</button>
      </article>`;
  }).join("");

  return `
    <section class="page-head">
      <h1>Grammar patterns</h1>
      <p class="lead">Don't memorize sentences. Learn a pattern, then fill it with your own ideas.</p>
    </section>
    <div class="stack">${cards}</div>`;
}

// =====================================================================
// PAGE: CHALLENGES (real-life writing)
// =====================================================================

function renderChallenges() {
  const cards = CHALLENGES.map(function (c) {
    if (!isChallengeUnlocked(c)) {
      return lockedCard(c.title, "Finish Lesson " + c.lesson + " to unlock.");
    }
    return `
      <article class="card">
        <p class="tag">After Lesson ${c.lesson}</p>
        <h3>${c.title}</h3>
        <p class="muted">${c.situation}</p>
        ${isChallengeDone(c) ? `<p class="ok-text">✓ Completed</p>` : `<p class="new-text">Open</p>`}
        <button class="btn small" data-action="open-challenge" data-id="${c.id}">${isChallengeDone(c) ? "Write again" : "Start"}</button>
      </article>`;
  }).join("");

  return `
    <section class="page-head">
      <h1>Real-life challenges</h1>
      <p class="lead">Real situations with your brother, clients and AI. Write first — then check, rewrite, and compare.</p>
    </section>
    <div class="grid">${cards}</div>`;
}

function openChallenge(id) {
  challengeState = { id: id, checks: null, showModel: false };
  go("challenge");
}

function checkChallengeItem(item, text) {
  const t = text.toLowerCase();
  if (item.minWords) return countWords(text) >= item.minWords;
  if (item.count) return t.split(item.count.text).length - 1 >= item.count.n;
  return item.any.some((keyword) => t.includes(keyword));
}

function renderChallenge() {
  const c = findChallenge(challengeState.id);
  const saved = challengeData(c.id);
  const checks = challengeState.checks;

  let result = "";
  if (checks) {
    const passed = checks.every((x) => x.ok);
    result = `
      <div class="feedback ${passed ? "ok" : "no"}">
        <strong>${passed ? "🎉 Everything is there!" : "Good try! Fix the empty boxes and check again."}</strong>
        ${checklistHTML(checks)}
        <p class="small">The checklist checks WHAT you included. For grammar correction, copy your answer to your AI coach.</p>
      </div>`;
  }

  const model = challengeState.showModel
    ? `<div class="card model"><h4>One possible answer</h4><p>${esc(c.model)}</p>
       <p class="muted small">Compare — don't copy. Which words or patterns can you steal for next time?</p></div>`
    : "";

  return `
    <button class="link" data-action="go" data-view="challenges">← All challenges</button>
    <section class="page-head">
      <p class="tag">Real-life challenge</p>
      <h1>${c.title}</h1>
    </section>
    <div class="card situation">
      <p>💬 ${c.situation}</p>
      <p><strong>Your task:</strong> ${c.task}</p>
    </div>
    <p class="muted small">Write first. Don't ask AI to write it for you. Mistakes are OK.</p>
    <textarea id="challenge-input" rows="8" placeholder="Write your answer here…">${esc(saved.draft)}</textarea>
    <p class="muted small">Words: <span id="word-count">${countWords(saved.draft)}</span> · Saved automatically</p>
    <div class="row">
      <button class="btn" data-action="check-challenge">Check my writing</button>
      ${saved.attempts > 0 ? `<button class="btn secondary" data-action="show-model">${challengeState.showModel ? "Hide" : "Show"} model answer</button>` : ""}
      <button class="btn secondary" data-action="copy-coach">Copy for AI coach</button>
    </div>
    ${result}
    ${model}`;
}

// =====================================================================
// PAGE: PROGRESS
// =====================================================================

function renderProgress() {
  const phases = PHASES.map(function (phase) {
    const lessons = LESSONS.filter((l) => l.phase === phase.id);
    const done = lessons.filter((l) => isLessonDone(l.id)).length;
    return `
      <div class="phase-row">
        <span>Phase ${phase.id}: ${phase.title}</span>
        <div class="bar"><span style="width:${(done / lessons.length) * 100}%"></span></div>
        <span class="muted small">${done}/${lessons.length}</span>
      </div>`;
  }).join("");

  // Words you forgot the most = your difficult words
  const difficult = Object.keys(progress.words)
    .filter((id) => progress.words[id].lapses > 0)
    .sort((a, b) => progress.words[b].lapses - progress.words[a].lapses)
    .slice(0, 8)
    .map((id) => `<li><strong>${findWord(id).word}</strong> — forgotten ${progress.words[id].lapses}×</li>`)
    .join("");

  const journal = progress.journal.slice().reverse().map((j) => `
    <article class="card">
      <p class="tag">${j.date}</p>
      ${j.learned ? `<p><strong>Learned:</strong> ${esc(j.learned)}</p>` : ""}
      ${j.forgot ? `<p><strong>Difficult:</strong> ${esc(j.forgot)}</p>` : ""}
      ${j.next ? `<p><strong>Review:</strong> ${esc(j.next)}</p>` : ""}
    </article>`).join("");

  return `
    <section class="page-head"><h1>Your progress</h1></section>
    ${statsRow()}

    <h2 class="space">8-week plan</h2>
    <div class="card">${phases}</div>

    <h2 class="space">Difficult words</h2>
    ${difficult ? `<ul class="card list">${difficult}</ul>` : `<p class="muted">No difficult words yet. They appear here when you forget a word in a review.</p>`}

    <h2 class="space">Your AI coach prompt</h2>
    <p class="muted">Paste this at the start of a chat with Claude or ChatGPT. It turns the AI into your personal teacher.</p>
    <textarea id="coach-prompt" rows="8" readonly>${esc(COACH_PROMPT)}</textarea>
    <button class="btn secondary" data-action="copy-prompt">Copy coach prompt</button>

    <h2 class="space">Reflection journal</h2>
    <div class="stack">${journal || `<p class="muted">No reflections yet. Write one on the Today page.</p>`}</div>

    <h2 class="space">Online sync ☁️</h2>
    ${cloudSection()}

    <h2 class="space">Backup</h2>
    <div class="card">
      <p class="muted">Your progress lives only in this browser. Download a backup file and keep it
      safe — email it to yourself or put it in Google Drive. You can load it on any computer.</p>
      <p class="small">Last backup: <strong>${progress.lastBackup || "never"}</strong></p>
      <div class="row">
        <button class="btn" data-action="export-progress">⬇ Export backup</button>
        <button class="btn secondary" data-action="import-progress">⬆ Import backup</button>
      </div>
      <!-- Hidden file picker. The Import button "clicks" it for you. -->
      <input type="file" id="import-file" accept=".json,application/json" hidden />
    </div>

    <h2 class="space">Start again</h2>
    <button class="btn danger" data-action="reset">Delete all progress</button>`;
}

// The "Online sync" box has 3 states: not set up, logged out, logged in.
function cloudSection() {
  if (!db) {
    return `<div class="card">
      <p class="muted">Not connected yet. Add your Supabase URL and key in <code>js/cloud.js</code>.
      (If you already did, check your internet connection.)</p></div>`;
  }

  if (!cloudUser) {
    return `<div class="card cloud">
      <p class="muted">Log in to save your progress online and learn on any device.</p>
      <input id="cloud-email" class="input" type="email" placeholder="Email" autocomplete="email" />
      <input id="cloud-password" class="input" type="password" placeholder="Password (6+ characters)"
        autocomplete="current-password" data-enter="cloud-login" />
      <div class="row">
        <button class="btn" data-action="cloud-login">Log in</button>
        <button class="btn secondary" data-action="cloud-signup">Create account</button>
      </div>
      <p id="cloud-status" class="small">${esc(cloudStatus)}</p>
    </div>`;
  }

  return `<div class="card cloud">
    <p>Logged in as <strong>${esc(cloudUser.email)}</strong></p>
    <p class="muted small">Your progress saves online automatically.</p>
    <p id="cloud-status" class="small">${esc(cloudStatus)}</p>
    <div class="row">
      <button class="btn secondary" data-action="cloud-sync">Sync now</button>
      <button class="btn secondary" data-action="cloud-logout">Log out</button>
    </div>
  </div>`;
}

// Reads the email + password boxes. Returns null if one is empty.
function cloudForm() {
  const email = document.querySelector("#cloud-email").value.trim();
  const password = document.querySelector("#cloud-password").value;
  if (!email || !password) {
    showCloudStatus("Please type your email and password.");
    return null;
  }
  return { email, password };
}

// ---------- COPY TO CLIPBOARD ----------
function copyText(text, button) {
  const done = () => { button.textContent = "Copied ✓"; };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

// Older way to copy: put the text in a hidden textarea and copy it.
function fallbackCopy(text, done) {
  const box = document.createElement("textarea");
  box.value = text;
  document.body.appendChild(box);
  box.select();
  try { document.execCommand("copy"); done(); } catch (error) {}
  box.remove();
}

// =====================================================================
// ACTIONS — every data-action="..." in the HTML has a function here.
// =====================================================================

const actions = {
  go: (el) => go(el.dataset.view),

  // Lessons
  "start-lesson": (el) => startLesson(Number(el.dataset.id)),
  "lesson-next": () => nextStep(),

  choice: function (el) {
    const s = lessonState;
    const exercise = s.lesson.exercises[s.step];
    s.chosen = Number(el.dataset.i);
    const correct = s.chosen === exercise.answer;
    answerExercise(correct, (correct ? "✅ Correct! " : "❌ Not quite. ") + exercise.explain);
  },

  "check-fill": function () {
    const s = lessonState;
    const exercise = s.lesson.exercises[s.step];
    s.input = document.querySelector("#fill-input").value;
    if (!s.input.trim()) return;
    const correct = exercise.answer.some((a) => norm(a) === norm(s.input));
    answerExercise(correct, correct
      ? "✅ Correct! " + exercise.explain
      : `❌ The answer is <strong>${exercise.answer[0]}</strong>. ${exercise.explain}`);
  },

  "order-add": function (el) {
    lessonState.picked.push(Number(el.dataset.i));
    render();
  },

  "order-remove": function (el) {
    lessonState.picked.splice(Number(el.dataset.i), 1);
    render();
  },

  "check-order": function () {
    const s = lessonState;
    const exercise = s.lesson.exercises[s.step];
    const sentence = s.picked.map((i) => s.pool[i]).join(" ");
    const correct = norm(sentence) === norm(exercise.answer);
    answerExercise(correct, correct
      ? "✅ Perfect sentence! Now say it out loud."
      : `❌ The correct order is: <strong>${exercise.answer}</strong>`);
  },

  "check-use": function () {
    const s = lessonState;
    const word = findWord(s.lesson.exercises[s.step].word);
    s.input = document.querySelector("#use-input").value;
    if (!s.input.trim()) return;
    const checks = useChecks(s.input, word);
    const correct = checks[0].ok && checks[1].ok; // the word + enough words
    answerExercise(correct,
      checklistHTML(checks) +
      (correct ? "✅ Great — you produced English from memory!" : "❌ Use the word in a full sentence (6+ words).") +
      `<p class="small">Example: <em>${word.example}</em></p>`);
  },

  // Word review
  "start-review": () => startReview(false),
  "extra-practice": () => startReview(true),

  "review-hint": function () {
    reviewState.input = document.querySelector("#review-input").value;
    reviewState.hint = true;
    render();
  },

  "review-check": function () {
    const r = reviewState;
    const id = r.queue[r.index];
    r.input = document.querySelector("#review-input").value;
    if (!r.input.trim()) return;
    r.lastCorrect = norm(r.input) === norm(findWord(id).word);
    r.answered = true;
    if (r.lastCorrect) r.correct = r.correct + 1;
    if (!r.extra) reviewWord(id, r.lastCorrect);
    addXP(r.lastCorrect ? (r.extra ? 2 : 5) : 0);
    render();
  },

  "review-next": function () {
    const r = reviewState;
    r.index = r.index + 1;
    r.answered = false;
    r.hint = false;
    r.input = "";
    render();
  },

  // Grammar (checks in place, no re-render)
  "grammar-check": function (el) {
    const g = findGrammar(el.dataset.id);
    const card = el.closest("[data-grammar]");
    card.querySelectorAll("[data-gi]").forEach(function (input) {
      const p = g.practice[Number(input.dataset.gi)];
      const ok = p.answer.some((a) => norm(a) === norm(input.value));
      input.nextElementSibling.textContent = ok ? "✅" : "❌ " + p.answer[0];
    });
  },

  // Challenges
  "open-challenge": (el) => openChallenge(el.dataset.id),

  "check-challenge": function () {
    const c = findChallenge(challengeState.id);
    const saved = challengeData(c.id);
    saved.draft = document.querySelector("#challenge-input").value;
    if (!saved.draft.trim()) return;
    saved.attempts = saved.attempts + 1;

    challengeState.checks = c.checklist.map((item) => ({ label: item.label, ok: checkChallengeItem(item, saved.draft) }));
    const passed = challengeState.checks.every((x) => x.ok);
    if (passed && !saved.done) {
      saved.done = true;
      addXP(30);
    } else {
      addXP(0); // still counts as activity for your streak
    }
    render();
  },

  "show-model": function () {
    challengeState.showModel = !challengeState.showModel;
    render();
  },

  "copy-coach": function (el) {
    const c = findChallenge(challengeState.id);
    const answer = document.querySelector("#challenge-input").value;
    const text = COACH_CORRECTION + "\n\nSituation: " + c.situation + "\nMy task: " + c.task + "\n\nMy answer:\n" + answer;
    copyText(text, el);
  },

  "copy-prompt": (el) => copyText(COACH_PROMPT, el),

  // Today + Progress
  "save-journal": function () {
    const entry = {
      date: today(),
      learned: document.querySelector("#j-learned").value.trim(),
      forgot: document.querySelector("#j-forgot").value.trim(),
      next: document.querySelector("#j-next").value.trim(),
    };
    if (!entry.learned && !entry.forgot && !entry.next) return;
    const firstToday = !progress.journal.some((j) => j.date === today());
    progress.journal.push(entry);
    addXP(firstToday ? 10 : 0);
    render();
  },

  "export-progress": function () {
    exportProgress();
    render(); // shows the new "Last backup" date
  },

  "import-progress": function () {
    document.querySelector("#import-file").click();
  },

  // Online sync — "async" functions finish later, so we render() after them.
  "cloud-login": function () {
    const form = cloudForm();
    if (form) cloudLogin(form.email, form.password).then(() => cloudUser && render());
  },

  "cloud-signup": function () {
    const form = cloudForm();
    if (form) cloudSignUp(form.email, form.password).then(() => cloudUser && render());
  },

  "cloud-sync": () => cloudSync(false).then(render),
  "cloud-logout": () => cloudLogout().then(render),

  reset: function () {
    if (confirm("Delete ALL your progress? This cannot be undone.")) {
      resetProgress();
      go("today");
    }
  },
};

// ---------- EVENT LISTENERS (only four for the whole site!) ----------

// 1. Clicks: find the closest element with data-action and run it.
document.addEventListener("click", function (event) {
  const el = event.target.closest("[data-action]");
  if (el && !el.disabled && actions[el.dataset.action]) {
    actions[el.dataset.action](el);
  }
});

// 2. Enter key inside an input runs its data-enter action.
document.addEventListener("keydown", function (event) {
  const action = event.target.dataset && event.target.dataset.enter;
  if (event.key === "Enter" && action) {
    event.preventDefault();
    actions[action](event.target);
  }
});

// 3. Typing in a challenge saves the draft and updates the word count.
document.addEventListener("input", function (event) {
  if (event.target.id === "challenge-input") {
    challengeData(challengeState.id).draft = event.target.value;
    saveProgress();
    document.querySelector("#word-count").textContent = countWords(event.target.value);
  }
});

// 4. You chose a backup file → read it and load it.
document.addEventListener("change", function (event) {
  if (event.target.id !== "import-file") return;
  const file = event.target.files[0];
  event.target.value = ""; // so you can pick the same file again later
  if (!file) return;
  if (!confirm("Replace your current progress with this backup?")) return;

  file.text().then(function (text) {
    if (importProgress(text)) {
      alert("Backup loaded ✓");
      go("progress");
    } else {
      alert("This file is not a Prompt English backup.");
    }
  });
});

// Start the app! Draw the page now, then again after checking the online data.
render();
cloudInit().then(render);
