// =====================================================================
// progress.js — saves what you learned, and runs spaced repetition.
// Everything is stored in localStorage (inside your browser).
// =====================================================================

const STORAGE_KEY = "prompt-english-progress";
const PASS_SCORE = 60; // you need 60% to pass a lesson

// Spaced repetition: how many days until the next review, for each level.
// Level 1 → 1 day, Level 2 → 3 days, ... Level 5 → 30 days.
const INTERVALS = [1, 3, 7, 14, 30];

function defaultProgress() {
  return {
    xp: 0,
    streak: 0,
    lastActive: null,
    lessons: {},    // { 1: { best: 80, passed: true } }
    words: {},      // { clarify: { box: 0, due: "2026-10-16", lapses: 0 } }
    challenges: {}, // { c1: { draft: "...", attempts: 2, done: true } }
    journal: [],    // [ { date, learned, forgot, next } ]
  };
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return Object.assign(defaultProgress(), saved);
  } catch (error) {
    // localStorage is blocked or the data is broken: start fresh.
  }
  return defaultProgress();
}

let progress = loadProgress();

function saveProgress() {
  progress.savedAt = Date.now(); // used to find the newest copy (browser vs online)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {}

  // Also save online, if cloud.js is loaded and you are logged in.
  if (typeof cloudScheduleUpload === "function") cloudScheduleUpload();
}

function resetProgress() {
  progress = defaultProgress();
  saveProgress();
}

// ---------- BACKUP (export / import) ----------

// Turns your progress into text and downloads it as a .json file.
function exportProgress() {
  progress.lastBackup = today();
  saveProgress();

  const text = JSON.stringify(progress, null, 2); // null, 2 = nice formatting
  const file = new Blob([text], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "prompt-english-backup-" + today() + ".json";
  link.click(); // pretend to click the link → the browser downloads the file
  URL.revokeObjectURL(link.href);
}

// Replaces your progress with the data from a backup file.
// Returns false if the file is not a real backup.
function importProgress(text) {
  try {
    const data = JSON.parse(text);
    if (typeof data.xp !== "number" || typeof data.lessons !== "object") return false;
    progress = Object.assign(defaultProgress(), data);
    saveProgress();
    return true;
  } catch (error) {
    return false; // the file is not valid JSON
  }
}

// ---------- DATES ----------
// We store dates as "YYYY-MM-DD" text. This kind of text can be
// compared with < and > because the biggest unit (year) comes first.
function dateText(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

function today() {
  return dateText(new Date());
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateText(date);
}

// ---------- XP + STREAK ----------
function markActive() {
  if (progress.lastActive === today()) return;
  if (progress.lastActive === addDays(-1)) {
    progress.streak = progress.streak + 1; // you came back the next day
  } else {
    progress.streak = 1; // first day, or you missed a day
  }
  progress.lastActive = today();
}

function addXP(amount) {
  progress.xp = progress.xp + amount;
  markActive();
  saveProgress();
}

function level() {
  return Math.floor(progress.xp / 100) + 1;
}

// ---------- LESSONS ----------
function isLessonDone(id) {
  return Boolean(progress.lessons[id] && progress.lessons[id].passed);
}

// Lesson 1 is always open. Every other lesson needs the one before it.
function isLessonUnlocked(id) {
  return id === 1 || isLessonDone(id - 1);
}

// Saves the score. Returns true if this is the FIRST time you passed.
function finishLesson(lesson, percent) {
  const before = progress.lessons[lesson.id] || { best: 0, passed: false };
  const passed = before.passed || percent >= PASS_SCORE;
  const firstPass = passed && !before.passed;

  progress.lessons[lesson.id] = { best: Math.max(before.best, percent), passed: passed };

  // Unlock the lesson's words: first review is tomorrow.
  if (passed) {
    lesson.words.forEach(function (id) {
      if (!progress.words[id]) {
        progress.words[id] = { box: 0, due: addDays(1), lapses: 0 };
      }
    });
  }

  saveProgress();
  return firstPass;
}

// ---------- WORDS (spaced repetition) ----------
function dueWords() {
  return Object.keys(progress.words).filter(function (id) {
    return progress.words[id].due <= today();
  });
}

function reviewWord(id, remembered) {
  const card = progress.words[id];
  if (remembered) {
    card.box = Math.min(card.box + 1, INTERVALS.length - 1); // move up a level
  } else {
    card.box = 0; // back to level 1
    card.lapses = card.lapses + 1; // count it as a difficult word
  }
  card.due = addDays(INTERVALS[card.box]);
  saveProgress();
}

// ---------- CHALLENGES ----------
function challengeData(id) {
  if (!progress.challenges[id]) {
    progress.challenges[id] = { draft: "", attempts: 0, done: false };
  }
  return progress.challenges[id];
}

function isChallengeUnlocked(challenge) {
  return isLessonDone(challenge.lesson);
}

function isChallengeDone(challenge) {
  return Boolean(progress.challenges[challenge.id] && progress.challenges[challenge.id].done);
}
