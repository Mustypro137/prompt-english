---
name: add-words
description: Turn new English words into a full Prompt English lesson (word cards, examples, grammar pattern, 5 exercises, real-life challenge) and add it to js/data.js. Use when the user runs /add-words or asks to add new words to the site.
argument-hint: word1, word2, word3
---

# Add words to Prompt English

The user gives you new English words: `$ARGUMENTS`

Your job: turn them into new lessons in `js/data.js`. The site reads the arrays in that file, so new content appears after a page refresh. Do not change any other file.

## The learner

Mustapha is a beginner front-end developer and an English learner. He builds websites (for example, a clothing shop for his brother), talks with clients, and writes prompts for AI. Write everything in **simple English** (A2–B1). Short sentences. Real situations from his life: his brother, clients, websites, AI prompts.

## Steps

1. **Read `js/data.js`.** Note:
   - the highest lesson `id` in `LESSONS`, the highest `gN` in `GRAMMAR`, and the highest `cN` in `CHALLENGES`
   - every `id` and `word` already in `WORDS`
2. **Clean the list.** Split on commas. Trim spaces. Remove duplicates. If a word already exists in `WORDS`, skip it and tell the user. If no words are left, stop.
3. **Group the words in sets of 3**, in the order given. The last group can have 1 or 2 words. Each group = **one new lesson**.
4. **For each group, add to the end of each array** (keep the existing style: one-line objects for words, the same keys, the same comment headers like `// Lesson 9`):

   **`WORDS`**
   `{ id, word, type, lesson, meaning, example }`
   - `id`: lowercase, spaces → `-` (e.g. `"follow-up"`)
   - `type`: noun / verb / adjective / adverb / phrase
   - `meaning`: one simple sentence
   - `example`: MUST contain the exact `word` text (the review hides it with a regex). Do not change the word's form (for "negotiate", write "negotiate", not "negotiated").

   **`GRAMMAR`** — one pattern that fits these words naturally
   `{ id: "gN", lesson, title, pattern, rule, examples: [2+], mistake: { wrong, right, why }, practice: [2 items] }`
   - each `practice` item: `{ sentence: "... ___ ...", answer: ["..."] }` (answer is ALWAYS an array; add other correct forms like contractions)
   - Do not repeat a pattern that already exists in `GRAMMAR`.

   **`LESSONS`**
   `{ id, phase, title, grammar: "gN", goal, words: [ids], exercises: [5] }`
   - `phase`: use the phase that fits best (1–4 in `PHASES`). Only add a new phase to `PHASES` if the topic clearly does not fit.
   - exactly **5 exercises**, in this order:
     1. `{ type: "choice", question, options: [3], answer: 0-based index, explain }`
     2. `{ type: "choice", ... }` (vary the correct index, not always 0)
     3. `{ type: "fill", sentence: "... ___ ...", answer: ["word"], explain }`
     4. `{ type: "order", answer: "One short sentence using the grammar pattern." }` (6–12 words, single spaces, ends with . or ?)
     5. `{ type: "use", word: "<one of the word ids>" }`
   - Use each new word at least once across the exercises.

   **`CHALLENGES`**
   `{ id: "cN", lesson, title, situation, task, checklist: [4–6], model }`
   - `situation`: a real message from his brother, a client, or an AI result
   - `checklist` items use ONLY one of: `{ label, any: [...] }`, `{ label, minWords: n }`, `{ label, count: { text, n } }`. The keywords in `any` must be lowercase (the checker lowercases the text).
   - include at least one item that checks a new word or the grammar pattern
   - `model`: a natural answer of 30–70 words that passes EVERY checklist item

5. **Check your work** before you finish:
   - every `example` contains its `word` (case-insensitive)
   - every `choice.answer` is a valid index of `options`
   - every `fill` sentence and grammar `practice` sentence contains `___`
   - the `order` answer has no double spaces
   - the `model` passes every checklist item (check `any` keywords are really in the lowercased model, count `minWords`, count `?` for `count`)
   - all new ids are unique
   - run `node --check js/data.js` (if `node` is missing, read the edited part again carefully for missing commas and quotes)
   - inside strings, escape `"` as `\"`

6. **Tell the user** in simple English:
   - which lesson(s), grammar pattern(s), and challenge(s) you added (with titles)
   - which words were skipped (already there)
   - "Refresh the page. Lesson N unlocks after you pass Lesson N-1."
   - Do NOT commit. The user will decide.
