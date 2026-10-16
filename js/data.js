// =====================================================================
// data.js — ALL the learning content lives here.
// To add a new word, lesson, or challenge, you only change this file.
// The other files (progress.js and app.js) read these arrays.
// =====================================================================

// ---------- PHASES (your 8-week plan) ----------
const PHASES = [
  { id: 1, title: "Build your vocabulary", weeks: "Week 1–2", goal: "Find the right words instead of getting stuck." },
  { id: 2, title: "Learn to think in prompts", weeks: "Week 3–4", goal: "Know what to include and what you might forget." },
  { id: 3, title: "Practise real conversations", weeks: "Week 5–6", goal: "Talk with clients without AI writing every message." },
  { id: 4, title: "Build independent skills", weeks: "Week 7–8", goal: "Judge AI answers and solve problems yourself." },
];

// ---------- OTHER ENGLISH SKILLS (top menu) ----------
// These pages say "Coming soon" for now. The "id" must match the
// data-view="..." of its button in index.html.
// (Grammar is ready now: its content is in grammar-data.js.)
const SKILLS = [
  { id: "reading", icon: "📖", title: "Reading", text: "Short texts with questions." },
  { id: "listening", icon: "🎧", title: "Listening", text: "Listen and answer." },
  { id: "pronunciation", icon: "🗣️", title: "Pronunciation", text: "Say words clearly." },
];

// ---------- WORDS ----------
// "lesson" = which lesson unlocks this word.
// The example sentence MUST contain the word (the review hides it).
const WORDS = [
  // Lesson 1
  { id: "requirement", word: "requirement", type: "noun", lesson: 1, meaning: "Something a project must have or do.", example: "One requirement is a WhatsApp button on every page." },
  { id: "audience", word: "audience", type: "noun", lesson: 1, meaning: "The people you want to reach.", example: "The audience for this website is young parents." },
  { id: "clarify", word: "clarify", type: "verb", lesson: 1, meaning: "To make something clearer or easier to understand.", example: "Can you clarify what you mean by modern?" },
  // Lesson 2
  { id: "responsive", word: "responsive", type: "adjective", lesson: 2, meaning: "Works well on every screen size: phone, tablet and computer.", example: "Please make the menu responsive so it works on phones." },
  { id: "layout", word: "layout", type: "noun", lesson: 2, meaning: "How things are arranged on a page.", example: "I like the layout of this page because it is simple." },
  { id: "wireframe", word: "wireframe", type: "noun", lesson: 2, meaning: "A simple drawing that plans a page before design and code.", example: "I drew a wireframe before I wrote any code." },
  // Lesson 3
  { id: "constraint", word: "constraint", type: "noun", lesson: 3, meaning: "A rule or limit you must work within.", example: "Our biggest constraint is time: we only have one week." },
  { id: "assumption", word: "assumption", type: "noun", lesson: 3, meaning: "Something you believe is true but have not checked.", example: "My assumption was wrong: he wanted a shop, not a blog." },
  { id: "edge-case", word: "edge case", type: "noun", lesson: 3, meaning: "An unusual situation that might break something.", example: "An empty form is an edge case you should test." },
  // Lesson 4
  { id: "context", word: "context", type: "noun", lesson: 4, meaning: "Background information that helps someone understand.", example: "Give the AI some context about your business." },
  { id: "specify", word: "specify", type: "verb", lesson: 4, meaning: "To say something exactly and clearly.", example: "Please specify the colors you want." },
  { id: "format", word: "format", type: "noun", lesson: 4, meaning: "The shape of an answer: a list, a table, code, an email…", example: "Return the answer in a table format." },
  // Lesson 5
  { id: "refine", word: "refine", type: "verb", lesson: 5, meaning: "To improve something that already exists, in small steps.", example: "Let's refine the headline to make it shorter." },
  { id: "iterate", word: "iterate", type: "verb", lesson: 5, meaning: "To repeat a process and make it better each time.", example: "We will iterate on the design after your feedback." },
  { id: "validate", word: "validate", type: "verb", lesson: 5, meaning: "To check that something is correct or works.", example: "Always validate the form before you send it." },
  // Lesson 6
  { id: "scope", word: "scope", type: "noun", lesson: 6, meaning: "What a project includes and does not include.", example: "A logo is outside the scope of this project." },
  { id: "deadline", word: "deadline", type: "noun", lesson: 6, meaning: "The latest time something must be finished.", example: "What is the deadline for the first version?" },
  { id: "budget", word: "budget", type: "noun", lesson: 6, meaning: "The amount of money available for something.", example: "What is your budget for this website?" },
  // Lesson 7
  { id: "progress", word: "progress", type: "noun", lesson: 7, meaning: "Movement toward finishing something.", example: "I made good progress on the homepage today." },
  { id: "estimate", word: "estimate", type: "noun", lesson: 7, meaning: "A careful guess about time, cost or size.", example: "My estimate is three days for the contact page." },
  { id: "delay", word: "delay", type: "noun", lesson: 7, meaning: "When something happens later than planned.", example: "Sorry for the delay; I had a problem with the images." },
  // Lesson 8
  { id: "evaluate", word: "evaluate", type: "verb", lesson: 8, meaning: "To judge how good or useful something is.", example: "Evaluate the AI answer before you copy it." },
  { id: "accurate", word: "accurate", type: "adjective", lesson: 8, meaning: "Correct and without mistakes.", example: "Is this information accurate?" },
  { id: "feedback", word: "feedback", type: "noun", lesson: 8, meaning: "Comments about what is good and what to improve.", example: "Thank you for your feedback on the design." },
];

// ---------- GRAMMAR PATTERNS ----------
// One pattern per lesson. "practice" answers are arrays (more than one can be correct).
const GRAMMAR = [
  {
    id: "g1", lesson: 1, title: "need to … before I …",
    pattern: "I need to + verb + before I + verb.",
    rule: "Use \"need to + verb\" for something necessary. Use \"before I + verb\" to show what comes first.",
    examples: ["I need to clarify the requirements before I start.", "I need to ask some questions before I design the page."],
    mistake: { wrong: "I need clarify before I starting.", right: "I need to clarify before I start.", why: "After \"need\", use \"to + verb\". After \"before I\", use the simple verb (start), not -ing." },
    practice: [
      { sentence: "I need ___ my brother. (talk to)", answer: ["to talk to"] },
      { sentence: "Before I ___, I need more details. (start)", answer: ["start"] },
    ],
  },
  {
    id: "g2", lesson: 2, title: "Instructions (imperatives)",
    pattern: "Verb + thing: Create… / Make… / Use… / Add…",
    rule: "To give instructions to AI or to a person, start the sentence with the verb. Don't start with \"you\".",
    examples: ["Create a responsive layout.", "Use blue and white colors.", "Add a contact form at the bottom."],
    mistake: { wrong: "You create website and you make it responsive.", right: "Create a website and make it responsive.", why: "Instructions start with the verb. Also, put \"a\" before one thing (a website)." },
    practice: [
      { sentence: "___ a menu at the top of the page. (add)", answer: ["add"] },
      { sentence: "___ the text bigger. (make)", answer: ["make"] },
    ],
  },
  {
    id: "g3", lesson: 3, title: "Polite requests: Could you…?",
    pattern: "Could you + verb …?",
    rule: "\"Could you\" is softer and more polite than \"Can you\". It is great for clients.",
    examples: ["Could you clarify the deadline?", "Could you send me some photos?"],
    mistake: { wrong: "Could you to send me the logo?", right: "Could you send me the logo?", why: "After could / can / should / will, never use \"to\"." },
    practice: [
      { sentence: "Could you ___ me the photos? (send)", answer: ["send"] },
      { sentence: "Could you ___ what \"modern\" means for you? (explain)", answer: ["explain"] },
    ],
  },
  {
    id: "g4", lesson: 4, title: "Act as… / I want you to…",
    pattern: "Act as a/an + job. I want you to + verb.",
    rule: "Give the AI a role with \"Act as a/an + job\". Say what you want with \"I want you to + verb\".",
    examples: ["Act as an experienced web designer.", "I want you to write the HTML for a landing page."],
    mistake: { wrong: "Act as web designer. I want you write code.", right: "Act as a web designer. I want you to write the code.", why: "Use a/an before a job. After \"want you\", add \"to\"." },
    practice: [
      { sentence: "Act as ___ English teacher. (a / an)", answer: ["an"] },
      { sentence: "I want you ___ check my prompt.", answer: ["to"] },
    ],
  },
  {
    id: "g5", lesson: 5, title: "Comparing: shorter / more modern",
    pattern: "short → shorter · modern → more modern",
    rule: "Short adjectives add -er (big → bigger). Long adjectives use \"more\" (professional → more professional).",
    examples: ["Make the title shorter.", "Make the design more professional."],
    mistake: { wrong: "Make it more simpler.", right: "Make it simpler.", why: "Don't use \"more\" and \"-er\" together." },
    practice: [
      { sentence: "Make the button ___. (big)", answer: ["bigger"] },
      { sentence: "Make the colors ___. (colorful)", answer: ["more colorful", "more colourful"] },
    ],
  },
  {
    id: "g6", lesson: 6, title: "Asking questions with do / does",
    pattern: "Question word + do/does + person + verb?",
    rule: "Add do (I/you/we/they) or does (he/she/it) after What / When / Where / How. (Not needed with \"is/are\".)",
    examples: ["What do you need on the homepage?", "When does your brother need it?", "Who are your customers?"],
    mistake: { wrong: "What you need on the website?", right: "What do you need on the website?", why: "Questions need \"do/does\" before the person." },
    practice: [
      { sentence: "What ___ you want the website to do?", answer: ["do"] },
      { sentence: "When ___ your brother need it?", answer: ["does"] },
    ],
  },
  {
    id: "g7", lesson: 7, title: "Updates: I have finished… / … yet",
    pattern: "have/has + past participle (+ yet / already)",
    rule: "Use it for updates about work that is done now. Use \"yet\" for things that are not done.",
    examples: ["I have finished the homepage.", "I haven't added the gallery yet.", "Have you sent the photos?"],
    mistake: { wrong: "I have finish the homepage yesterday.", right: "I finished the homepage yesterday. / I have finished the homepage.", why: "Use the past participle (finished). With an exact time like \"yesterday\", use simple past." },
    practice: [
      { sentence: "I have ___ the contact page. (finish)", answer: ["finished"] },
      { sentence: "I ___ received the photos yet. (have not)", answer: ["haven't", "have not"] },
    ],
  },
  {
    id: "g8", lesson: 8, title: "should / should be able to",
    pattern: "should + verb · should be able to + verb",
    rule: "\"should + verb\" gives advice. \"should be able to + verb\" talks about a skill you expect to have.",
    examples: ["You should check the code before you use it.", "By the end of this week, I should be able to write a full prompt."],
    mistake: { wrong: "I should to check the answer.", right: "I should check the answer.", why: "No \"to\" after should." },
    practice: [
      { sentence: "You ___ test the site on a phone.", answer: ["should"] },
      { sentence: "By next month, I should be able ___ write emails alone.", answer: ["to"] },
    ],
  },
];

// ---------- LESSONS ----------
// Exercise types:
//   choice → pick one option (answer = index, starting at 0)
//   fill   → type the missing word (answer = array of correct answers)
//   order  → put the words in the right order (answer = the full sentence)
//   use    → write your OWN sentence with a word (produce English from memory)
const LESSONS = [
  {
    id: 1, phase: 1, title: "Talking about a project", grammar: "g1",
    goal: "Ask for the information you need before you start a website.",
    words: ["requirement", "audience", "clarify"],
    exercises: [
      { type: "choice", question: "\"Who will visit the website?\" is a question about the…", options: ["audience", "requirement", "clarify"], answer: 0, explain: "Audience = the people the website is for." },
      { type: "choice", question: "What does \"clarify\" mean?", options: ["Make something clearer", "Delete something", "Build something fast"], answer: 0, explain: "Clarify = make something easier to understand." },
      { type: "fill", sentence: "A contact form is one ___ of the website.", answer: ["requirement"], explain: "A requirement is something the project must have." },
      { type: "order", answer: "I need to clarify the requirements before I start." },
      { type: "use", word: "clarify" },
    ],
  },
  {
    id: 2, phase: 1, title: "Website words", grammar: "g2",
    goal: "Describe how a website should look and work.",
    words: ["responsive", "layout", "wireframe"],
    exercises: [
      { type: "choice", question: "A site that looks good on a phone AND a computer is…", options: ["responsive", "a wireframe", "a requirement"], answer: 0, explain: "Responsive = it adapts to every screen size." },
      { type: "choice", question: "Before coding, you draw a simple plan of the page. That is a…", options: ["wireframe", "audience", "layout"], answer: 0, explain: "A wireframe is the plan. The layout is how things are arranged." },
      { type: "fill", sentence: "I like the ___ of this page: the menu is at the top and the photos are in a grid.", answer: ["layout"], explain: "Layout = how things are arranged." },
      { type: "order", answer: "Make the layout responsive on mobile phones." },
      { type: "use", word: "responsive" },
    ],
  },
  {
    id: 3, phase: 1, title: "Limits and problems", grammar: "g3",
    goal: "Talk about rules, limits, and things that can go wrong.",
    words: ["constraint", "assumption", "edge-case"],
    exercises: [
      { type: "choice", question: "\"We only have one week\" is a…", options: ["constraint", "audience", "layout"], answer: 0, explain: "A constraint is a limit — here, time." },
      { type: "choice", question: "You thought your brother wanted a blog, but he wanted a shop. Your ___ was wrong.", options: ["assumption", "wireframe", "requirement"], answer: 0, explain: "An assumption is something you believed without checking." },
      { type: "fill", sentence: "A user types a name with 200 letters. That is an ___.", answer: ["edge case"], explain: "Edge case = an unusual situation that can break things." },
      { type: "order", answer: "Could you clarify the constraints of this project?" },
      { type: "use", word: "assumption" },
    ],
  },
  {
    id: 4, phase: 2, title: "The 6-part prompt", grammar: "g4",
    goal: "Give AI a role, context, and an exact output format.",
    words: ["context", "specify", "format"],
    exercises: [
      { type: "choice", question: "\"I sell handmade bags online to young women.\" This sentence gives the AI…", options: ["context", "a format", "a deadline"], answer: 0, explain: "Context = background information." },
      { type: "choice", question: "\"Answer in a table with 3 columns\" tells the AI the…", options: ["format", "audience", "scope"], answer: 0, explain: "Format = the shape of the answer." },
      { type: "fill", sentence: "Please ___ the colors you want: blue, white or black?", answer: ["specify"], explain: "Specify = say exactly." },
      { type: "order", answer: "Act as an experienced web designer and give me the code." },
      { type: "use", word: "context" },
    ],
  },
  {
    id: 5, phase: 2, title: "Improving AI results", grammar: "g5",
    goal: "Ask AI to improve an answer step by step.",
    words: ["refine", "iterate", "validate"],
    exercises: [
      { type: "choice", question: "You change the AI answer a little, many times, to make it better. You…", options: ["iterate", "clarify", "specify"], answer: 0, explain: "Iterate = repeat and improve each time." },
      { type: "choice", question: "\"Validate\" means…", options: ["check that it is correct or works", "make it bigger", "send it to a client"], answer: 0, explain: "Validate = check." },
      { type: "fill", sentence: "The headline is good, but let's ___ it to make it shorter.", answer: ["refine"], explain: "Refine = improve something that already exists." },
      { type: "order", answer: "Make the design simpler and the text more professional." },
      { type: "use", word: "refine" },
    ],
  },
  {
    id: 6, phase: 3, title: "Questions for a client", grammar: "g6",
    goal: "Ask the right questions before a project starts.",
    words: ["scope", "deadline", "budget"],
    exercises: [
      { type: "choice", question: "\"What is your budget?\" is a question about…", options: ["money", "time", "people"], answer: 0, explain: "Budget = money available." },
      { type: "choice", question: "The client wants a logo too, but you only agreed to build the website. The logo is outside the…", options: ["scope", "layout", "format"], answer: 0, explain: "Scope = what the project includes." },
      { type: "fill", sentence: "What is the ___? When do you need the website finished?", answer: ["deadline"], explain: "Deadline = the latest time to finish." },
      { type: "order", answer: "What do you need on the homepage?" },
      { type: "use", word: "scope" },
    ],
  },
  {
    id: 7, phase: 3, title: "Giving updates", grammar: "g7",
    goal: "Tell a client or your brother how the work is going.",
    words: ["progress", "estimate", "delay"],
    exercises: [
      { type: "choice", question: "\"I think it will take 3 days\" is an…", options: ["estimate", "delay", "edge case"], answer: 0, explain: "Estimate = a careful guess." },
      { type: "choice", question: "Pick the correct sentence.", options: ["I have finished the homepage.", "I have finish the homepage.", "I finished have the homepage."], answer: 0, explain: "have + past participle (finished)." },
      { type: "fill", sentence: "Sorry for the ___. The images took longer than I expected.", answer: ["delay"], explain: "Delay = later than planned." },
      { type: "order", answer: "I have finished the homepage but I haven't added the gallery yet." },
      { type: "use", word: "progress" },
    ],
  },
  {
    id: 8, phase: 4, title: "Judging AI answers", grammar: "g8",
    goal: "Check AI answers and give clear feedback.",
    words: ["evaluate", "accurate", "feedback"],
    exercises: [
      { type: "choice", question: "You decide how good and useful an AI answer is. You…", options: ["evaluate it", "delay it", "format it"], answer: 0, explain: "Evaluate = judge the quality." },
      { type: "choice", question: "Information with no mistakes is…", options: ["accurate", "responsive", "a constraint"], answer: 0, explain: "Accurate = correct." },
      { type: "fill", sentence: "Thank you for your ___. I will change the colors today.", answer: ["feedback"], explain: "Feedback = comments to help you improve." },
      { type: "order", answer: "You should check the code before you use it." },
      { type: "use", word: "evaluate" },
    ],
  },
];

// ---------- REAL-LIFE CHALLENGES ----------
// Each checklist item is checked automatically:
//   any: [...]       → passes if your text contains ANY of these words
//   minWords: n      → passes if your text has at least n words
//   count: {text, n} → passes if "text" appears at least n times
const CHALLENGES = [
  {
    id: "c1", lesson: 1, title: "Reply to your brother",
    situation: "Your brother says: \"Build a website for my clothing business. Can you start today?\"",
    task: "Tell him you need more information first. Ask at least two questions.",
    checklist: [
      { label: "At least 20 words", minWords: 20 },
      { label: "Ask a question (?)", any: ["?"] },
      { label: "Say you need more information", any: ["information", "details", "more info", "know more", "clarify", "a few things", "some questions"] },
      { label: "Ask about his customers (audience)", any: ["customer", "audience", "who will", "people"] },
      { label: "Use the pattern \"need to…\"", any: ["need to"] },
    ],
    model: "Yes, I'd love to help! But I need to clarify a few things before I start. Who are your main customers? Do you want people to buy online, or contact you on WhatsApp? Do you have photos of your clothes?",
  },
  {
    id: "c2", lesson: 2, title: "Prompt for a clothing website",
    situation: "You want an AI coding assistant to build your brother's clothing shop website.",
    task: "Write the prompt. Include a role, the customers, what the site must show, and how it should work on phones.",
    checklist: [
      { label: "At least 40 words", minWords: 40 },
      { label: "Give the AI a role (Act as…)", any: ["act as", "you are"] },
      { label: "Mention the customers / audience", any: ["customer", "audience"] },
      { label: "Ask for product photos or prices", any: ["photo", "image", "price"] },
      { label: "Ask for contact info or WhatsApp", any: ["contact", "whatsapp", "phone number"] },
      { label: "Make it responsive", any: ["responsive", "mobile"] },
    ],
    model: "Act as an experienced web designer. Create a website for my brother's small clothing shop. The audience is local customers aged 18–35 who want to see new clothes and order on WhatsApp. Requirements: a homepage with product photos and prices, an About section, and a contact section with a WhatsApp button. Make the layout responsive and simple. Use only HTML, CSS and JavaScript. Give me the complete code and explain how to run it.",
  },
  {
    id: "c3", lesson: 3, title: "The client wants everything tomorrow",
    situation: "A client writes: \"I need a 10-page shop with online payments by tomorrow.\"",
    task: "Reply politely. Explain the constraint and suggest a smaller first version.",
    checklist: [
      { label: "At least 30 words", minWords: 30 },
      { label: "Be polite (thank you / sorry / unfortunately…)", any: ["thank", "sorry", "unfortunately", "happy to", "love to"] },
      { label: "Explain the time limit", any: ["time", "not possible", "isn't possible", "can't", "cannot", "constraint"] },
      { label: "Suggest a solution", any: ["first version", "instead", "suggest", "start with", "one page", "one-page", "smaller"] },
      { label: "Use \"Could you / Could we…?\"", any: ["could you", "could we"] },
    ],
    model: "Thank you for choosing me for this project! Unfortunately, a 10-page shop with online payments is not possible by tomorrow — the main constraint is time. Instead, I suggest we start with a one-page version that shows your products and a WhatsApp button. Could we plan the full shop for next week?",
  },
  {
    id: "c4", lesson: 4, title: "A complete 6-part prompt",
    situation: "A restaurant owner wants a website where people can see the menu and book a table.",
    task: "Write ONE prompt that has all six parts: role, goal, audience, requirements, constraints, output.",
    checklist: [
      { label: "Role (Act as…)", any: ["act as", "you are"] },
      { label: "Goal (create / build…)", any: ["create", "build", "make", "design"] },
      { label: "Audience", any: ["customer", "audience", "visitor", "people"] },
      { label: "Requirements (menu, booking…)", any: ["menu", "book", "price", "include", "must"] },
      { label: "Constraints (HTML only, responsive…)", any: ["html", "only", "responsive", "mobile", "do not", "don't"] },
      { label: "Output (give me / format…)", any: ["give me", "provide", "return", "explain", "format"] },
    ],
    model: "Act as an experienced web designer. I want you to create a website for a family restaurant. The audience is local families and office workers who want to see the menu and book a table quickly. Requirements: a menu with prices, opening hours, a booking form, and a map. Constraints: use only HTML, CSS and JavaScript, make it responsive, and keep the design warm and simple. Output: give me the complete code in three files and explain how to run it.",
  },
  {
    id: "c5", lesson: 5, title: "Fix a bad AI result",
    situation: "AI built your portfolio page, but the text is too long, the colors are too dark, and it doesn't work on phones.",
    task: "Write a follow-up prompt that refines the result. Keep what is good.",
    checklist: [
      { label: "Ask to improve, not restart (refine / keep / change…)", any: ["refine", "improve", "change", "update", "keep"] },
      { label: "Shorter text", any: ["shorter", "less text", "fewer words"] },
      { label: "Fix the colors", any: ["color", "colour", "lighter", "brighter"] },
      { label: "Make it work on phones", any: ["responsive", "mobile", "phone"] },
      { label: "Use a comparison (more… / -er)", any: ["shorter", "lighter", "brighter", "bigger", "simpler", "more "] },
    ],
    model: "Thanks, this is a good start. Let's refine it: 1) Make the text shorter — maximum two sentences per section. 2) Make the colors lighter and more friendly. 3) Make the layout responsive so it works on phones. Keep the same structure and only change these three things.",
  },
  {
    id: "c6", lesson: 6, title: "Questions for a new client",
    situation: "A new client says: \"I want a website for my gym.\"",
    task: "Write a message with at least four questions before you start.",
    checklist: [
      { label: "At least 4 questions", count: { text: "?", n: 4 } },
      { label: "Ask about the budget", any: ["budget", "cost", "pay", "price"] },
      { label: "Ask about the deadline", any: ["deadline", "when", "date"] },
      { label: "Ask about pages / features (scope)", any: ["feature", "page", "scope", "include", "need"] },
      { label: "Ask about the members / customers", any: ["customer", "member", "audience", "who"] },
    ],
    model: "Great, thank you for contacting me! Before I start, I have a few questions. Who are your members — beginners, athletes, or both? What do you need on the website: class times, prices, online sign-up? When is your deadline? What is your budget for this project?",
  },
  {
    id: "c7", lesson: 7, title: "Give your brother an update",
    situation: "Your brother asks: \"How is my website going?\"",
    task: "Tell him what you have finished, what you haven't done yet, and when it will be ready.",
    checklist: [
      { label: "At least 25 words", minWords: 25 },
      { label: "What you have finished (I have…)", any: ["have finished", "'ve finished", "have done", "have made", "have added", "have built", "have created"] },
      { label: "What is not done (yet / haven't)", any: ["yet", "haven't", "have not"] },
      { label: "When it will be ready (estimate)", any: ["estimate", "will be ready", "should be ready", "days", "tomorrow", "next week"] },
    ],
    model: "Hi! I have made good progress. I have finished the homepage and the product section, but I haven't added the WhatsApp button yet. My estimate is two more days, so it should be ready on Friday. Could you send me your logo?",
  },
  {
    id: "c8", lesson: 8, title: "Give feedback to the AI",
    situation: "You asked AI for a contact form. It works, but there is no email check, the button says \"Click\", and the code has no comments.",
    task: "Write feedback for the AI: what is good, what is wrong, and what it should change.",
    checklist: [
      { label: "Say something positive", any: ["good", "great", "thank", "like"] },
      { label: "Name the problems (but / missing…)", any: ["but", "however", "problem", "missing", "wrong", "doesn't", "does not"] },
      { label: "Ask it to validate the email", any: ["validate", "validation", "check the email", "email check"] },
      { label: "Use \"should\"", any: ["should"] },
      { label: "Make a clear request", any: ["change", "add", "please", "make"] },
    ],
    model: "Thanks, the form works and the layout is good. However, there are three problems. First, it should validate the email before sending. Second, the button text should say \"Send message\" instead of \"Click\". Third, please add short comments to the code so I can learn from it.",
  },
];

// ---------- WORD LEVELS (how well do you know these words?) ----------
// The tabs on the "Word levels" page, from easy to hard. "mine" = words you add yourself.
const WORD_GROUPS = [
  { id: "beginner", icon: "🌱", title: "Beginner", note: "A1–A2 · everyday words" },
  { id: "intermediate", icon: "🌿", title: "Intermediate", note: "B1 · work and clients" },
  { id: "advanced", icon: "🌳", title: "Advanced", note: "B2–C1 · professional English" },
  { id: "mine", icon: "⭐", title: "My words", note: "Words you add yourself" },
];

// The words for each level. To add a word, copy one line and change it.
const CHECK_WORDS = {
  beginner: [
    { word: "price", meaning: "How much money something costs.", example: "What is the price of a simple website?" },
    { word: "order", meaning: "A request to buy something.", example: "My brother got ten new orders today." },
    { word: "customer", meaning: "A person who buys from a shop or business.", example: "A customer asked for a bigger size." },
    { word: "message", meaning: "Words you send to someone.", example: "I sent the client a message on WhatsApp." },
    { word: "problem", meaning: "Something that is wrong or difficult.", example: "There is a problem with the menu on phones." },
    { word: "answer", meaning: "What you say or write back to a question.", example: "I am waiting for his answer." },
    { word: "change", meaning: "To make something different.", example: "Can you change the color to blue?" },
    { word: "choose", meaning: "To pick one thing from many.", example: "Please choose one of these two designs." },
    { word: "explain", meaning: "To make something clear so people understand.", example: "Can you explain what you want on the homepage?" },
    { word: "finish", meaning: "To come to the end of something.", example: "I will finish the page tonight." },
    { word: "important", meaning: "Something that matters a lot.", example: "Speed is important for a shop website." },
    { word: "easy", meaning: "Not difficult.", example: "The new menu is easy to use." },
    { word: "busy", meaning: "Having a lot to do.", example: "I am busy today, but I can call tomorrow." },
    { word: "simple", meaning: "Not complicated; plain.", example: "The client wants a simple design." },
    { word: "ready", meaning: "Finished and prepared to use.", example: "The first version is ready." },
    { word: "cheap", meaning: "It does not cost a lot of money.", example: "This hosting plan is cheap." },
    { word: "quick", meaning: "Fast; it takes a short time.", example: "Can we have a quick call?" },
    { word: "share", meaning: "To give or show something to other people.", example: "Please share the photos with me." },
    { word: "meeting", meaning: "When people come together to talk.", example: "We have a meeting at 10 a.m." },
    { word: "idea", meaning: "A thought or plan in your mind.", example: "I have an idea for the logo." },
  ],
  intermediate: [
    { word: "notice", meaning: "To see or become aware of something.", example: "Did you notice the bug on the contact page?" },
    { word: "approach", meaning: "A way of doing something.", example: "Let's try a different approach to the layout." },
    { word: "issue", meaning: "A problem or a topic to discuss.", example: "The client reported an issue with the form." },
    { word: "priority", meaning: "The most important thing to do first.", example: "Our first priority is the mobile version." },
    { word: "suggest", meaning: "To give an idea for someone to consider.", example: "I suggest a darker color for the buttons." },
    { word: "require", meaning: "To need something.", example: "This page requires a login." },
    { word: "available", meaning: "Free to use, buy or talk to.", example: "Are you available for a call on Friday?" },
    { word: "consider", meaning: "To think carefully about something.", example: "Please consider adding a FAQ page." },
    { word: "improve", meaning: "To make something better.", example: "I want to improve my English writing." },
    { word: "mention", meaning: "To say something quickly, without many details.", example: "You didn't mention the deadline." },
    { word: "purpose", meaning: "The reason why something exists or is done.", example: "What is the purpose of this website?" },
    { word: "solution", meaning: "An answer to a problem.", example: "I found a solution for the slow images." },
    { word: "option", meaning: "One thing you can choose.", example: "Here are three options for the header." },
    { word: "detail", meaning: "A small piece of information.", example: "Can you send me more details?" },
    { word: "confirm", meaning: "To say that something is true or final.", example: "Please confirm the meeting time." },
    { word: "request", meaning: "To ask for something politely.", example: "The client requested a new page." },
    { word: "response", meaning: "An answer or reaction.", example: "Thank you for your quick response." },
    { word: "avoid", meaning: "To stay away from something; to not do it.", example: "Avoid long text on the homepage." },
    { word: "achieve", meaning: "To succeed in doing something.", example: "We achieved our goal this week." },
    { word: "previous", meaning: "Before this one.", example: "I liked the previous version better." },
  ],
  advanced: [
    { word: "assumption", meaning: "Something you believe is true but have not checked.", example: "My assumption was wrong: he wanted a shop, not a blog." },
    { word: "judgment", meaning: "Your ability to decide well; an opinion after thinking.", example: "Use your judgment before you copy the AI answer." },
    { word: "efficient", meaning: "Working well without wasting time or energy.", example: "This code is shorter and more efficient." },
    { word: "reliable", meaning: "You can trust it to work well every time.", example: "We need reliable hosting for the shop." },
    { word: "appropriate", meaning: "Right or suitable for the situation.", example: "Is this tone appropriate for a client email?" },
    { word: "significant", meaning: "Big or important enough to notice.", example: "The new images made a significant difference." },
    { word: "ensure", meaning: "To make sure something happens.", example: "Please ensure the form works on all phones." },
    { word: "involve", meaning: "To include something as a part.", example: "The project involves design and coding." },
    { word: "opportunity", meaning: "A good chance to do something.", example: "This client is a great opportunity for me." },
    { word: "recommend", meaning: "To say that something is good and should be used.", example: "I recommend a simple one-page site." },
    { word: "consistent", meaning: "Always the same, in the same style.", example: "Keep the button colors consistent on every page." },
    { word: "accessible", meaning: "Easy for everyone to use, including people with disabilities.", example: "Add alt text to make the site accessible." },
    { word: "prioritize", meaning: "To decide what is most important and do it first.", example: "Let's prioritize the checkout page." },
    { word: "comprehensive", meaning: "Complete; including everything.", example: "The AI gave me a comprehensive answer." },
    { word: "feasible", meaning: "Possible and realistic to do.", example: "Is a one-week deadline feasible?" },
    { word: "leverage", meaning: "To use something to get a better result.", example: "We can leverage Instagram to get more customers." },
    { word: "ambiguous", meaning: "Not clear; it can have more than one meaning.", example: "Your prompt is ambiguous, so the AI got confused." },
    { word: "trade-off", meaning: "Losing one good thing to get another.", example: "There is a trade-off between speed and design." },
    { word: "scalable", meaning: "It can grow bigger without problems.", example: "We need a scalable shop for more products." },
    { word: "maintain", meaning: "To keep something working well.", example: "Who will maintain the website after launch?" },
  ],
};

// The three lists. "id" is what is saved in your progress.
const CHECK_LEVELS = [
  { id: "write", icon: "✍️", label: "I know it and can write it", short: "Can write" },
  { id: "know", icon: "👀", label: "I know it, but I can't write it yet", short: "Know, can't write" },
  { id: "new", icon: "❓", label: "I don't know it", short: "Don't know" },
];

// ---------- AI COACH PROMPTS ----------
// Short version: added before your answer when you click "Copy for AI coach".
const COACH_CORRECTION = `Act as my English and prompt-writing coach. I wrote the answer below myself, without help.
1. Tell me the 2–3 most important mistakes and explain them in simple English.
2. Teach me 1–2 useful words or sentence patterns I was missing.
3. Do NOT rewrite everything for me yet. First ask me to rewrite it myself.
4. After my rewrite, show me a natural version.`;

// Long version: your full personal coach prompt (from your learning programme).
const COACH_PROMPT = `Act as my long-term English teacher, prompt engineering instructor, memory coach, and practical communication trainer.

My situation:
I am learning English. Sometimes I understand sentences when I read them but cannot produce similar sentences by myself. I want to think, write and communicate independently — in everyday English and in professional English for programming, AI, business and clients. My goal is not to receive correct answers. My goal is to learn how to produce them myself.

How you should teach me:
1. Make me think first. Give me real situations and let me write before you show the answer.
2. Teach reusable sentence patterns (I want to learn how to…, Could you explain why…?, Before I start, I need to clarify…).
3. After teaching a pattern, ask me to produce a similar sentence without looking. Reduce hints as I improve.
4. Correct my English: explain the most important mistakes, give a natural version, and ask me to rewrite it myself.
5. Notice when I struggle to express an idea and teach me the exact words I am missing.
6. Teach prompt engineering through real tasks: websites, Python, problem-solving, my brother and clients. Help me find missing context, goals, requirements, constraints, examples and outputs.
7. Use active recall, spaced repetition and short reviews. Revisit words I struggled with.
8. Don't rewrite everything for me. Give hints and a second chance first.
9. Start simple and increase difficulty when I can use a pattern alone.
10. One main concept at a time. Track my recurring mistakes.

Learning cycle: real situation → I write → find my main difficulty → teach the words/pattern → I rewrite → test me without looking → review later in a new situation.`;
