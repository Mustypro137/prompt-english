// =====================================================================
// cloud.js — saves your progress online with Supabase, so you can
// learn anywhere. If you don't add your keys, the site still works
// offline with localStorage only.
// =====================================================================

// 👉 Paste your values from Supabase: Project Settings → API (or "Connect").
// The anon / publishable key is SAFE in the browser because Row Level
// Security protects your data. NEVER put the "service_role" / secret key here.
const SUPABASE_URL = "https://lwscahtfmkcqvqoupdbs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3c2NhaHRmbWtjcXZxb3VwZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODE0MjksImV4cCI6MjEwNzY1NzQyOX0.DA2Xa2UA9y9h0Bm0NUqpLVYBy9s8-5uq39kP-jHVAl0";

// "db" is null when Supabase is not set up (or you are offline).
const db =
  window.supabase && SUPABASE_URL.startsWith("https://")
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

let cloudUser = null;   // the logged-in user, or null
let cloudStatus = "";   // a short message shown on the Progress page
let uploadTimer = null;

// Updates only the status text (so we don't redraw the page while you type).
function showCloudStatus(message) {
  cloudStatus = message;
  const el = document.querySelector("#cloud-status");
  if (el) el.textContent = message;
}

// ---------- UPLOAD / DOWNLOAD ----------

async function cloudUpload() {
  if (!cloudUser) return;
  const { error } = await db.from("progress").upsert({
    user_id: cloudUser.id,
    data: progress,
    updated_at: new Date().toISOString(),
  });
  showCloudStatus(error ? "❌ Not synced: " + error.message : "✓ Synced at " + new Date().toLocaleTimeString());
}

// Called by saveProgress(). Waits 2 seconds, so typing doesn't upload
// after every letter. This trick is called "debouncing".
function cloudScheduleUpload() {
  if (!cloudUser) return;
  clearTimeout(uploadTimer);
  uploadTimer = setTimeout(cloudUpload, 2000);
}

async function cloudDownload() {
  const { data, error } = await db
    .from("progress")
    .select("data")
    .eq("user_id", cloudUser.id)
    .maybeSingle(); // one row, or null if you have never synced
  if (error) throw error;
  return data ? data.data : null;
}

// Decides which data to keep: the online copy or this browser's copy.
// askUser = true right after you log in (a new device might have different data).
async function cloudSync(askUser) {
  try {
    showCloudStatus("Syncing…");
    const online = await cloudDownload();

    if (!online) {
      await cloudUpload(); // first time: send this browser's data up
      return;
    }

    const onlineTime = online.savedAt || 0;
    const localTime = progress.savedAt || 0;

    if (askUser && progress.xp > 0 && onlineTime !== localTime) {
      const useOnline = confirm(
        "You have progress in two places:\n\n" +
        "ONLINE: " + online.xp + " XP\n" +
        "THIS BROWSER: " + progress.xp + " XP\n\n" +
        "OK = use the ONLINE data\nCancel = use THIS BROWSER's data"
      );
      if (useOnline) importProgress(JSON.stringify(online));
      else await cloudUpload();
    } else if (progress.xp === 0 || onlineTime > localTime) {
      importProgress(JSON.stringify(online)); // online is newer → use it
    } else {
      await cloudUpload(); // this browser is newer → send it up
    }
    showCloudStatus("✓ Synced at " + new Date().toLocaleTimeString());
  } catch (error) {
    showCloudStatus("❌ Sync failed: " + error.message);
  }
}

// ---------- LOGIN / SIGN UP / LOGOUT ----------

async function cloudLogin(email, password) {
  showCloudStatus("Logging in…");
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) return showCloudStatus("❌ " + error.message);
  cloudUser = data.user;
  await cloudSync(true);
}

async function cloudSignUp(email, password) {
  showCloudStatus("Creating account…");
  const { data, error } = await db.auth.signUp({ email, password });
  if (error) return showCloudStatus("❌ " + error.message);
  if (data.session) {
    cloudUser = data.user; // email confirmation is OFF → logged in now
    await cloudSync(true);
  } else {
    showCloudStatus("📧 Check your email and click the link. Then come back and log in.");
  }
}

async function cloudLogout() {
  await db.auth.signOut();
  cloudUser = null;
  showCloudStatus("Logged out. Your progress is still in this browser.");
}

// Runs when the page opens: are you still logged in from last time?
async function cloudInit() {
  if (!db) return;
  try {
    const { data } = await db.auth.getSession();
    cloudUser = data.session ? data.session.user : null;
    if (cloudUser) await cloudSync(false);
  } catch (error) {
    showCloudStatus("❌ Offline — progress saved in this browser only.");
  }
}
