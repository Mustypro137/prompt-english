---
name: add-grammar
description: Turn a grammar topic into a new lesson in the Prompt English Grammar course (rule, examples, common mistake, timeline for tenses, 6 exercises) and add it to js/grammar-data.js. Use when the user runs /add-grammar or asks to add a grammar lesson.
argument-hint: grammar topic (e.g. "used to", "comparatives", "first conditional")
---

# Add a grammar lesson to Prompt English

The user gives you a grammar topic: `$ARGUMENTS`

Your job: add ONE new lesson to `GRAMMAR_LESSONS` in `js/grammar-data.js`. The site reads that file, so the lesson appears after a page refresh. Do not change any other file.

## The learner

Mustapha is a beginner front-end developer and an English learner (A2–B1). Write in **simple English**: short sentences, simple words. Mix two kinds of examples: **web / freelance work** (clients, websites, AI prompts, his brother's clothing shop) and **daily life** (family, food, the market, routines).

## Steps

1. **Read `js/grammar-data.js`.** Note:
   - the highest lesson id (`glN`) → the new id is `gl(N+1)`
   - the titles of the existing lessons. If the topic is already covered, stop and tell the user which lesson covers it.
   - `GRAMMAR_UNITS` and which unit fits the topic best
2. **Choose the unit.** Use an existing unit if the topic fits. Otherwise add a new unit to the end of `GRAMMAR_UNITS` (`{ id, title, goal }`).
3. **Add the lesson to the END of `GRAMMAR_LESSONS`** (lessons unlock in array order). Use the same style and key order as the existing lessons:

   `{ id, unit, title, timeline?, goal, pattern, rule, examples: [3–4], mistake: { wrong, right, why }, verbs?, exercises: [6] }`
   - `pattern`: a short formula, e.g. `"used to + verb"`
   - `rule`: 2–4 simple sentences
   - `timeline`: only for tense-like topics. Use one of: `now`, `habit`, `past`, `past-in-progress`, `past-to-now`, `future`.
   - `verbs`: only if the topic needs NEW irregular verbs. Each id must exist in `IRREGULAR_VERBS`. If you add a verb there, use `{ id, base, past, participle, example }` (use `/` for two correct forms, e.g. `"got/gotten"`). Never repeat a verb that another lesson already unlocks.
   - exactly **6 exercises**, in this order:
     1. `{ type: "choice", question: "... ___ ...", options: [3], answer: 0-based index, explain }`
     2. `{ type: "choice", ... }`. Use a different correct index from exercise 1.
     3. `{ type: "fill", sentence: "... ___ ... (hint)", answer: ["..."], explain }` (answer is ALWAYS an array; add contractions as extra answers)
     4. `{ type: "fix", wrong: "A sentence with ONE typical mistake.", answer: ["The corrected sentence.", "other correct forms"], explain }`
     5. `{ type: "order", answer: "One sentence of 6–10 words using the pattern." }` (single spaces, ends with . or ?)
     6. `{ type: "write", task, example, checks: [2–3] }`
        - each check uses ONLY one of: `{ label, any: [...] }`, `{ label, minWords: n }`, `{ label, count: { text, n } }`
        - `any` keywords are lowercase (the checker lowercases the text). Keep them loose: the learner writes freely.
        - `example` MUST pass every check.
   - `explain`: one short sentence that gives the reason, e.g. `"After did, use the simple verb."`
4. **Optional:** if the topic is a tense, add it to `TENSE_HELPER` only if it fits the decision tree clearly. Otherwise leave the helper as it is.
5. **Check your work:**
   - `choice.answer` is a valid index, and only one option is correct
   - `fill` sentences contain `___`
   - the `fix` answers are different from `wrong` (and differ by more than punctuation, because the checker ignores `.,!?` and capital letters)
   - the `order` answer has no double spaces
   - the `write` example passes every check
   - ids are unique; escape `"` inside strings as `\"`
   - run `node --check js/grammar-data.js`
6. **Tell the user** in simple English:
   - the lesson title, its unit, and its number in the course
   - "Refresh the page. It unlocks after you pass the lesson before it."
   - Add one short English tip about the topic.
   - Do NOT commit. The user will decide.
