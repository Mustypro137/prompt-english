# Prompt English

Learn English by writing better AI prompts.

A learning website built with plain HTML, CSS and JavaScript:

- **Lessons** in 4 phases that unlock step by step
- **Words** with spaced repetition (1 → 3 → 7 → 14 → 30 days)
- **Grammar patterns** with common mistakes and practice
- **Real-life challenges** (clients, family, AI prompts) with automatic checklists
- **Daily routine**: Recall → Learn → Practise → Reflect
- **Progress** saved in the browser, with export/import backup and optional online sync (Supabase)

## Files

| File | What it does |
|---|---|
| `index.html` | Page shell (header + empty `<main>`) |
| `styles.css` | Design |
| `js/data.js` | All content: words, lessons, grammar, challenges |
| `js/progress.js` | Saving, unlocking, spaced repetition |
| `js/cloud.js` | Online sync with Supabase |
| `js/app.js` | Draws the pages and handles clicks |
| `supabase-setup.sql` | Creates the database table (run once in Supabase) |

> The Supabase key in `js/cloud.js` is the public **anon** key. It is safe to publish because Row Level Security only lets each user read their own data.
