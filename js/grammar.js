// =====================================================================
// grammar.js — the Grammar course pages:
//   Course (units + lessons), Verbs trainer, and "Which tense?" helper.
// The lesson player itself is shared with Prompt English (in app.js).
// Content lives in grammar-data.js.
// =====================================================================

let verbReviewState = null; // the verb review you are doing right now
let helperNode = "start";   // where you are in the "Which tense?" helper

// The pages that belong to the Grammar menu.
const GRAMMAR_PAGES = ["grammar-en", "verbs", "verb-review", "tense-helper"];

function findGrammarLesson(id) { return GRAMMAR_LESSONS.find((l) => l.id === id); }
function findVerb(id) { return IRREGULAR_VERBS.find((v) => v.id === id); }

// "gl5" → 5 (its place in the course, starting at 1)
function grammarNumber(lesson) { return GRAMMAR_LESSONS.indexOf(lesson) + 1; }

function nextGrammarLesson() {
  return GRAMMAR_LESSONS.find((l) => isGrammarUnlocked(l.id) && !isGrammarDone(l.id));
}

function startGrammarLesson(id) {
  lessonState = { lesson: findGrammarLesson(id), kind: "grammar", step: -1, score: 0 };
  go("lesson");
}

// ---------- TIMELINES ----------
// Positions are % from the left. NOW is in the middle (50%).
const TIMELINES = {
  now: { marks: [{ from: 44, to: 56 }], caption: "Happening now (or around now)." },
  habit: { marks: [{ dot: 12 }, { dot: 26 }, { dot: 40 }, { dot: 60 }, { dot: 74 }, { dot: 88 }], caption: "Again and again: habits, routines, facts." },
  past: { marks: [{ dot: 25 }], caption: "Finished, at a finished time." },
  "past-in-progress": { marks: [{ from: 14, to: 36 }, { dot: 28, hit: true }], caption: "In progress in the past… then something happened." },
  "past-to-now": { marks: [{ from: 18, to: 50 }, { dot: 18 }], caption: "Started in the past, connected to now." },
  future: { marks: [{ dot: 76 }], caption: "Later: plans, promises, predictions." },
};

function timelineHTML(type) {
  const t = TIMELINES[type];
  const marks = t.marks.map(function (m) {
    if (m.from !== undefined) {
      return `<span class="tl-range" style="left:${m.from}%;width:${m.to - m.from}%"></span>`;
    }
    return `<span class="tl-dot ${m.hit ? "hit" : ""}" style="left:${m.dot}%"></span>`;
  }).join("");

  return `
    <div class="card timeline-card">
      <div class="timeline" aria-hidden="true">
        <span class="tl-line"></span>
        <span class="tl-now">NOW</span>
        ${marks}
        <span class="tl-label left">past</span>
        <span class="tl-label right">future</span>
      </div>
      <p class="muted small">${t.caption}</p>
    </div>`;
}

// =====================================================================
// PAGE: GRAMMAR COURSE (units + lessons)
// =====================================================================

function renderGrammarHome() {
  const done = GRAMMAR_LESSONS.filter((l) => isGrammarDone(l.id)).length;
  const due = dueVerbs().length;
  const next = nextGrammarLesson();

  const units = GRAMMAR_UNITS.map(function (unit) {
    const lessons = GRAMMAR_LESSONS.filter((l) => l.unit === unit.id);
    if (!lessons.length) return "";
    const unitDone = lessons.filter((l) => isGrammarDone(l.id)).length;
    return `
      <section class="phase">
        <p class="tag">Unit ${unit.id} · ${unitDone}/${lessons.length} done</p>
        <h2>${unit.title}</h2>
        <p class="muted">${unit.goal}</p>
        <div class="grid">${lessons.map(grammarLessonCard).join("")}</div>
      </section>`;
  }).join("");

  return `
    <section class="page-head">
      <p class="tag">Grammar</p>
      <h1>Grammar course</h1>
      <p class="lead">Short lessons, step by step. Learn the rule, then use it. You need ${PASS_SCORE}% to open the next lesson.</p>
      <div class="row">
        ${next ? `<button class="btn" data-action="start-grammar" data-id="${next.id}">Continue: ${next.title}</button>` : ""}
        ${due ? `<button class="btn secondary" data-action="start-verb-review">Review ${due} verb${due > 1 ? "s" : ""}</button>` : ""}
        <button class="btn secondary" data-action="go" data-view="tense-helper">Which tense? 🤔</button>
      </div>
    </section>
    <div class="stats">
      <div class="stat"><strong>✅ ${done}/${GRAMMAR_LESSONS.length}</strong><span>lessons done</span></div>
      <div class="stat"><strong>🔁 ${Object.keys(progress.verbs).length}/${IRREGULAR_VERBS.length}</strong><span>verbs unlocked</span></div>
      <div class="stat"><strong>⭐ Lv ${level()}</strong><span>${progress.xp} XP</span></div>
    </div>
    ${units}`;
}

function grammarLessonCard(lesson) {
  const n = grammarNumber(lesson);
  if (!isGrammarUnlocked(lesson.id)) {
    return lockedCard(n + ". " + lesson.title, "Finish lesson " + (n - 1) + " first.");
  }
  const saved = progress.grammar[lesson.id];
  const status = isGrammarDone(lesson.id)
    ? `<p class="ok-text">✓ Done · best score ${saved.best}%</p>`
    : saved ? `<p class="muted">Best score ${saved.best}% — try again!</p>` : `<p class="new-text">New</p>`;

  return `
    <article class="card">
      <span class="num">${n}</span>
      <h3>${lesson.title}</h3>
      <p class="muted">${lesson.goal}</p>
      ${status}
      <button class="btn small" data-action="start-grammar" data-id="${lesson.id}">
        ${isGrammarDone(lesson.id) ? "Practise again" : "Start"}
      </button>
    </article>`;
}

// =====================================================================
// GRAMMAR LESSON: intro + results (the exercises use the shared player)
// =====================================================================

function grammarIntro(lesson) {
  const unit = GRAMMAR_UNITS.find((u) => u.id === lesson.unit);
  return `
    <section class="page-head">
      <p class="tag">Grammar · Unit ${unit.id}: ${unit.title} · Lesson ${grammarNumber(lesson)}</p>
      <h1>${lesson.title}</h1>
      <p class="lead">🎯 Goal: ${lesson.goal}</p>
    </section>
    ${lesson.timeline ? timelineHTML(lesson.timeline) : ""}
    ${grammarBox(lesson)}
    <p class="muted small space">Read the examples out loud. Then try the exercises.</p>
    <button class="btn" data-action="lesson-next" data-focus>Start exercises →</button>`;
}

function renderGrammarResults() {
  const s = lessonState;
  const lesson = s.lesson;
  const passed = s.percent >= PASS_SCORE;
  const next = GRAMMAR_LESSONS[GRAMMAR_LESSONS.indexOf(lesson) + 1];

  const unlocks = s.firstPass ? `
    <div class="card unlocks">
      <h3>🔓 You unlocked</h3>
      <ul>
        ${lesson.verbs ? `<li>🔁 Irregular verbs: ${lesson.verbs.join(", ")} (first review tomorrow)</li>` : ""}
        ${next ? `<li>➡️ Lesson ${grammarNumber(next)}: ${next.title}</li>` : `<li>🎓 You finished the whole course!</li>`}
      </ul>
      <p class="ok-text">+20 XP bonus</p>
    </div>` : "";

  return `
    <section class="page-head center">
      <h1>${passed ? "🎉 Lesson complete!" : "Almost there!"}</h1>
      <p class="big">${s.score} / ${lesson.exercises.length} · ${s.percent}%</p>
      <p class="lead">${passed ? "Great work. Now use this grammar in a real message today." : `You need ${PASS_SCORE}% to pass. Read the rule again and try once more.`}</p>
    </section>
    ${unlocks}
    <div class="row">
      ${!passed ? `<button class="btn" data-action="start-grammar" data-id="${lesson.id}" data-focus>Try again</button>` : ""}
      ${passed && next ? `<button class="btn" data-action="start-grammar" data-id="${next.id}" data-focus>Next lesson</button>` : ""}
      ${passed && lesson.verbs ? `<button class="btn secondary" data-action="go" data-view="verbs">See the verbs</button>` : ""}
      <button class="btn secondary" data-action="go" data-view="grammar-en">Back to the course</button>
    </div>`;
}

// ---------- NEW EXERCISE TYPES ----------

function renderFix(exercise, s) {
  // Start with the wrong sentence in the box, so you only change what is wrong.
  const value = s.input || exercise.wrong;
  return `
    <h2>Fix the mistake</h2>
    <p class="sentence">❌ ${exercise.wrong}</p>
    <p class="muted small">Change the sentence in the box so it is correct.</p>
    <input id="fix-input" class="input" autocomplete="off" value="${esc(value)}"
      data-enter="check-fix" ${s.answered ? "disabled" : "data-focus"} />
    ${s.answered ? "" : `<button class="btn" data-action="check-fix">Check</button>`}`;
}

function renderWrite(exercise, s) {
  return `
    <h2>Write your own sentence</h2>
    <p>${exercise.task}</p>
    <p class="muted small">Think about your real life: your family, a client, or your website.</p>
    <textarea id="write-input" rows="3" ${s.answered ? "disabled" : "data-focus"}>${esc(s.input)}</textarea>
    ${s.answered ? "" : `<button class="btn" data-action="check-write">Check</button>`}`;
}

// =====================================================================
// PAGE: VERBS (irregular verbs + spaced repetition)
// =====================================================================

function renderVerbs() {
  const due = dueVerbs().length;
  const unlocked = Object.keys(progress.verbs).length;

  const groups = GRAMMAR_LESSONS.filter((l) => l.verbs).map(function (lesson) {
    const title = `From lesson ${grammarNumber(lesson)}: ${lesson.title}`;
    if (!isGrammarDone(lesson.id)) {
      return lockedCard(title, lesson.verbs.length + " verbs. Pass this lesson to unlock them.");
    }
    const rows = lesson.verbs.map(function (id) {
      const verb = findVerb(id);
      const saved = progress.verbs[id];
      return `<tr><td>${verb.base}</td><td>${verb.past}</td><td>${verb.participle}</td><td>${saved ? levelDots(saved.box) : ""}</td></tr>`;
    }).join("");
    return `
      <article class="card">
        <h3>${title}</h3>
        <table class="verb-table">
          <thead><tr><th>Verb</th><th>Past</th><th>Past participle</th><th>Memory</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </article>`;
  }).join("");

  return `
    <section class="page-head">
      <p class="tag">Grammar</p>
      <h1>Irregular verbs</h1>
      <p class="lead">These verbs don't use -ed. You need the past (I <strong>went</strong>) and the past participle (I have <strong>gone</strong>).</p>
      <div class="row">
        ${due ? `<button class="btn" data-action="start-verb-review">Review ${due} due verb${due > 1 ? "s" : ""}</button>` : ""}
        ${unlocked ? `<button class="btn secondary" data-action="verb-practice">Extra practice</button>` : ""}
      </div>
    </section>
    <div class="card info">
      <strong>How it works</strong>
      <p class="muted">Verbs unlock when you pass some grammar lessons. Like your words, each verb comes back
      after 1 → 3 → 7 → 14 → 30 days. Forget it → you see it again tomorrow.</p>
    </div>
    <div class="stack">${groups}</div>`;
}

function startVerbReview(extra) {
  const ids = extra ? shuffle(Object.keys(progress.verbs)).slice(0, 8) : shuffle(dueVerbs());
  verbReviewState = { queue: ids, index: 0, correct: 0, extra: extra, answered: false, past: "", participle: "" };
  go("verb-review");
}

// "was/were" accepts "was", "were" or "was/were".
function matchesForm(input, form) {
  return norm(input) === norm(form) || form.split("/").some((f) => norm(f) === norm(input));
}

function renderVerbReview() {
  const r = verbReviewState;
  const total = r.queue.length;

  if (r.index >= total) {
    return `
      <section class="page-head center">
        <h1>Review finished 🧠</h1>
        <p class="big">${r.correct} / ${total}</p>
        <p class="lead">${r.extra ? "Extra practice doesn't change your schedule." : "Verbs you forgot will come back tomorrow."}</p>
        <div class="row center">
          <button class="btn" data-action="go" data-view="grammar-en" data-focus>Back to the course</button>
          <button class="btn secondary" data-action="go" data-view="verbs">See all verbs</button>
        </div>
      </section>`;
  }

  const verb = findVerb(r.queue[r.index]);
  let feedback = "";
  if (r.answered) {
    const saved = progress.verbs[verb.id];
    const when = r.extra ? "" : r.lastCorrect
      ? ` Next review in ${INTERVALS[saved.box]} days.`
      : " You'll see it again tomorrow.";
    feedback = `
      <div class="feedback ${r.lastCorrect ? "ok" : "no"}">
        ${r.lastCorrect ? "✅ Correct!" : "❌ Not quite."}
        <strong>${verb.base} → ${verb.past} → ${verb.participle}</strong>.${when}
        <p class="example">${verb.example}</p>
        <p class="small">💡 Now say your own sentence with "${verb.past.split("/")[0]}" out loud.</p>
      </div>
      <button class="btn" data-action="verb-next" data-focus>Next →</button>`;
  }

  return `
    <button class="link" data-action="go" data-view="verbs">← Verbs</button>
    <div class="bar"><span style="width:${(r.index / total) * 100}%"></span></div>
    <p class="tag">${r.extra ? "Extra practice" : "Review"} · ${r.index + 1} of ${total}</p>
    <h1>${verb.base} → ? → ?</h1>
    <div class="verb-inputs">
      <label>Past <span class="muted small">(yesterday I…)</span>
        <input id="verb-past" class="input" autocomplete="off" value="${esc(r.past)}" ${r.answered ? "disabled" : "data-focus"} /></label>
      <label>Past participle <span class="muted small">(I have…)</span>
        <input id="verb-participle" class="input" autocomplete="off" value="${esc(r.participle)}" data-enter="verb-check" ${r.answered ? "disabled" : ""} /></label>
    </div>
    ${r.answered ? feedback : `<button class="btn" data-action="verb-check">Check</button>`}`;
}

// =====================================================================
// PAGE: "WHICH TENSE?" HELPER
// =====================================================================

function renderTenseHelper() {
  const node = TENSE_HELPER[helperNode];
  const head = `
    <section class="page-head">
      <p class="tag">Grammar</p>
      <h1>Which tense? 🤔</h1>
      <p class="lead">Think of your sentence. Answer the questions, and the helper tells you which tense to use.</p>
    </section>`;

  if (node.q) {
    return `${head}
      <div class="card helper">
        <h2>${node.q}</h2>
        <div class="row">
          <button class="btn" data-action="helper" data-next="${node.yes}" data-focus>Yes</button>
          <button class="btn secondary" data-action="helper" data-next="${node.no}">No</button>
        </div>
      </div>
      ${helperNode !== "start" ? `<button class="link space" data-action="helper" data-next="start">↺ Start again</button>` : ""}`;
  }

  // An answer
  const lesson = findGrammarLesson(node.lesson);
  const open = isGrammarUnlocked(lesson.id)
    ? `<button class="btn" data-action="start-grammar" data-id="${lesson.id}">Open the lesson: ${lesson.title}</button>`
    : `<p class="muted">🔒 The lesson "${lesson.title}" unlocks later in the course.</p>`;

  return `${head}
    <div class="card helper">
      <p class="tag">Use this tense</p>
      <h2>${node.tense}</h2>
      <p>${node.use}</p>
      <p class="example">${node.example}</p>
    </div>
    ${timelineHTML(node.timeline)}
    <div class="row">
      ${open}
      <button class="btn secondary" data-action="helper" data-next="start">↺ Start again</button>
    </div>`;
}

// =====================================================================
// GRAMMAR ACTIONS — app.js adds these to its "actions" object.
// =====================================================================

const grammarActions = {
  "start-grammar": (el) => startGrammarLesson(el.dataset.id),

  "check-fix": function () {
    const s = lessonState;
    const exercise = s.lesson.exercises[s.step];
    s.input = document.querySelector("#fix-input").value;
    if (!s.input.trim()) return;
    const correct = exercise.answer.some((a) => norm(a) === norm(s.input));
    answerExercise(correct, correct
      ? "✅ Correct! " + exercise.explain
      : `❌ The correct sentence is: <strong>${exercise.answer[0]}</strong> ${exercise.explain}`);
  },

  "check-write": function () {
    const s = lessonState;
    const exercise = s.lesson.exercises[s.step];
    s.input = document.querySelector("#write-input").value;
    if (!s.input.trim()) return;
    const checks = exercise.checks.map((item) => ({ label: item.label, ok: checkChallengeItem(item, s.input) }));
    const correct = checks.every((c) => c.ok);
    answerExercise(correct,
      checklistHTML(checks) +
      (correct ? "✅ Great — you used the grammar in your own sentence!" : "❌ Look at the empty boxes and remember the rule.") +
      `<p class="small">Example: <em>${exercise.example}</em></p>
       <p class="small">💡 For a full grammar check, paste your sentence into your AI coach.</p>`);
  },

  // Verbs
  "start-verb-review": () => startVerbReview(false),
  "verb-practice": () => startVerbReview(true),

  "verb-check": function () {
    const r = verbReviewState;
    const verb = findVerb(r.queue[r.index]);
    r.past = document.querySelector("#verb-past").value;
    r.participle = document.querySelector("#verb-participle").value;
    if (!r.past.trim() || !r.participle.trim()) return;
    r.lastCorrect = matchesForm(r.past, verb.past) && matchesForm(r.participle, verb.participle);
    r.answered = true;
    if (r.lastCorrect) r.correct = r.correct + 1;
    if (!r.extra) reviewVerb(verb.id, r.lastCorrect);
    addXP(r.lastCorrect ? (r.extra ? 2 : 5) : 0);
    render();
  },

  "verb-next": function () {
    const r = verbReviewState;
    r.index = r.index + 1;
    r.answered = false;
    r.past = "";
    r.participle = "";
    render();
  },

  // "Which tense?" helper
  helper: function (el) {
    helperNode = el.dataset.next;
    render();
  },
};
