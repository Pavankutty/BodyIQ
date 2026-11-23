import { useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  getProgress,
  getLatestProgress,
  createProgress,
  logoutUser,
} from "../services/api";

const today = () => new Date().toISOString().slice(0, 10);

function formatDate(value) {
  if (!value) return "—";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
    undefined,
    { day: "numeric", month: "short", year: "numeric" }
  );
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Progress() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    date: today(),
    weight_kg: "",
    steps: "",
    calories_consumed: "",
    calories_burned: "",
    workout_completed: false,
    notes: "",
  });

  const loadProgress = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileResult, progressResult, latestResult] = await Promise.all([
        getCurrentUser().catch(() => null),
        getProgress(),
        getLatestProgress().catch(() => null),
      ]);
      setUser(profileResult);
      const list = Array.isArray(progressResult)
        ? progressResult
        : Array.isArray(progressResult?.items)
          ? progressResult.items
          : Array.isArray(progressResult?.progress)
            ? progressResult.progress
            : [];
      setEntries([...list].sort((a, b) => String(b.date).localeCompare(String(a.date))));
      setLatest(latestResult || list[0] || null);
    } catch (err) {
      setError(err.message || "Unable to load progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const stats = useMemo(() => {
    const weights = entries
      .map((entry) => number(entry.weight_kg))
      .filter((weight) => weight > 0);
    const first = weights.length ? weights[weights.length - 1] : null;
    const current = number(latest?.weight_kg) || (weights.length ? weights[0] : 0);
    return {
      current,
      change: first !== null && current ? current - first : null,
      loggedDays: entries.length,
      totalSteps: entries.reduce((sum, entry) => sum + number(entry.steps), 0),
    };
  }, [entries, latest]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitProgress = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!form.date || !form.weight_kg || number(form.weight_kg) <= 0) {
      setError("Please enter a valid date and weight.");
      return;
    }

    const payload = {
      date: form.date,
      weight_kg: number(form.weight_kg),
      workout_completed: form.workout_completed,
      ...(form.steps !== "" ? { steps: number(form.steps) } : {}),
      ...(form.calories_consumed !== "" ? { calories_consumed: number(form.calories_consumed) } : {}),
      ...(form.calories_burned !== "" ? { calories_burned: number(form.calories_burned) } : {}),
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
    };

    setSaving(true);
    try {
      await createProgress(payload);
      setNotice("Your progress entry has been saved.");
      setForm((current) => ({
        ...current,
        date: today(),
        weight_kg: "",
        steps: "",
        calories_consumed: "",
        calories_burned: "",
        workout_completed: false,
        notes: "",
      }));
      await loadProgress();
    } catch (err) {
      setError(err.message || "Could not save your progress entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page progress-page">
      <div className="dashboard-background" />
      <div className="dashboard-overlay" />
      <nav className="dashboard-nav">
        <a className="dashboard-logo" href="/dashboard">⚡ BodyIQ</a>
        <div className="dashboard-nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/workout">Workout</a>
          <a href="/nutrition">Nutrition</a>
          <a className="active" href="/progress">Progress</a>
        </div>
        <div className="progress-user">
          <span>{user?.name || "BodyIQ Member"}</span>
          <button onClick={() => { logoutUser(); window.location.href = "/login"; }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="progress-container">
        <div className="progress-heading">
          <div>
            <a className="progress-back" href="/dashboard">← Back to dashboard</a>
            <p className="progress-eyebrow">BODYIQ TRACKER</p>
            <h1>Your fitness progress</h1>
            <p className="progress-subtitle">Track your daily measurements and stay consistent.</p>
          </div>
          <button className="progress-refresh" onClick={loadProgress} disabled={loading}>
            ↻ Refresh
          </button>
        </div>

        {error && <div className="progress-alert error">{error}</div>}
        {notice && <div className="progress-alert success">{notice}</div>}

        <section className="progress-stats">
          <article className="progress-card">
            <span>Current weight</span>
            <strong>{stats.current ? `${stats.current.toFixed(1)} kg` : "—"}</strong>
            <small>{latest?.date ? `Latest entry · ${formatDate(latest.date)}` : "Add your first entry"}</small>
          </article>
          <article className="progress-card">
            <span>Weight change</span>
            <strong>{stats.change === null ? "—" : `${stats.change > 0 ? "+" : ""}${stats.change.toFixed(1)} kg`}</strong>
            <small>Latest compared with earliest logged weight</small>
          </article>
          <article className="progress-card">
            <span>Days recorded</span>
            <strong>{stats.loggedDays}</strong>
            <small>Total progress entries</small>
          </article>
          <article className="progress-card">
            <span>Total steps logged</span>
            <strong>{stats.totalSteps.toLocaleString()}</strong>
            <small>Across recorded days</small>
          </article>
        </section>

        <section className="progress-content">
          <article className="progress-panel">
            <div className="progress-panel-heading">
              <div>
                <p className="progress-eyebrow">DAILY CHECK-IN</p>
                <h2>Log today's progress</h2>
              </div>
            </div>
            <form className="progress-form" onSubmit={submitProgress}>
              <label>Date<input type="date" name="date" value={form.date} onChange={updateField} required /></label>
              <label>Weight (kg)<input type="number" name="weight_kg" min="1" max="500" step="0.1" placeholder="e.g. 67.5" value={form.weight_kg} onChange={updateField} required /></label>
              <label>Steps<input type="number" name="steps" min="0" placeholder="e.g. 8000" value={form.steps} onChange={updateField} /></label>
              <label>Calories consumed<input type="number" name="calories_consumed" min="0" placeholder="kcal" value={form.calories_consumed} onChange={updateField} /></label>
              <label>Calories burned<input type="number" name="calories_burned" min="0" placeholder="kcal" value={form.calories_burned} onChange={updateField} /></label>
              <label className="progress-notes">Notes<textarea name="notes" rows="3" placeholder="How did today go?" value={form.notes} onChange={updateField} /></label>
              <label className="progress-check"><input type="checkbox" name="workout_completed" checked={form.workout_completed} onChange={updateField} /> Workout completed today</label>
              <button className="progress-submit" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save progress"}
              </button>
            </form>
          </article>

          <article className="progress-panel">
            <div className="progress-panel-heading">
              <div>
                <p className="progress-eyebrow">YOUR HISTORY</p>
                <h2>Recent entries</h2>
              </div>
              <span className="progress-count">{entries.length} records</span>
            </div>
            {loading ? (
              <p className="progress-empty">Loading your progress...</p>
            ) : entries.length === 0 ? (
              <p className="progress-empty">No progress entries yet. Add your first daily check-in.</p>
            ) : (
              <div className="progress-history">
                {entries.slice(0, 12).map((entry) => (
                  <div className="progress-history-row" key={entry.id ?? `${entry.date}-${entry.weight_kg}`}>
                    <div>
                      <strong>{formatDate(entry.date)}</strong>
                      <small>
                        {entry.workout_completed ? "Workout completed" : "No workout marked"}
                        {entry.steps != null ? ` · ${number(entry.steps).toLocaleString()} steps` : ""}
                      </small>
                    </div>
                    <div className="progress-history-values">
                      <strong>{number(entry.weight_kg).toFixed(1)} kg</strong>
                      {entry.calories_consumed != null && <small>{number(entry.calories_consumed).toLocaleString()} kcal in</small>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
        <p className="progress-footnote">Progress insights are based on the entries saved to your BodyIQ account.</p>
      </main>

      <style>{`
        .progress-page { min-height:100vh; color:#eef7ff; position:relative; }
        .progress-page .dashboard-nav { position:relative; z-index:2; }
        .progress-user { display:flex; align-items:center; gap:14px; font-size:12px; }
        .progress-user button,.progress-refresh { border:1px solid rgba(80,211,245,.35); color:#bdefff; background:rgba(8,35,49,.8); border-radius:9px; padding:9px 13px; cursor:pointer; }
        .progress-container { position:relative; z-index:1; width:min(1120px,92%); margin:34px auto 60px; }
        .progress-heading { display:flex; justify-content:space-between; align-items:flex-end; gap:20px; margin-bottom:24px; }
        .progress-back { display:inline-block; color:#80dff5; text-decoration:none; font-size:12px; margin-bottom:18px; }
        .progress-eyebrow { color:#42d9f5; letter-spacing:1.6px; font-size:10px; font-weight:800; margin:0 0 8px; }
        .progress-heading h1 { font-size:clamp(28px,4vw,40px); margin:0 0 7px; }
        .progress-subtitle { color:#a9bdca; margin:0; font-size:13px; }
        .progress-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-bottom:18px; }
        .progress-card,.progress-panel { background:rgba(8,23,37,.88); border:1px solid rgba(130,190,220,.19); border-radius:15px; box-shadow:0 12px 35px rgba(0,0,0,.16); }
        .progress-card { padding:19px; display:flex; flex-direction:column; gap:9px; min-height:112px; }
        .progress-card span,.progress-card small,.progress-history small { color:#9eb3c2; font-size:11px; }
        .progress-card strong { font-size:27px; }
        .progress-content { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; }
        .progress-panel { padding:20px; min-width:0; }
        .progress-panel-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
        .progress-panel h2 { font-size:19px; margin:0; }
        .progress-count { color:#9eb3c2; font-size:11px; }
        .progress-form { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
        .progress-form label { display:flex; flex-direction:column; gap:7px; color:#c8d8e2; font-size:11px; }
        .progress-form input:not([type=checkbox]),.progress-form textarea { width:100%; box-sizing:border-box; color:#eef7ff; background:rgba(2,12,22,.8); border:1px solid rgba(130,190,220,.23); border-radius:8px; padding:11px; outline:none; font:inherit; }
        .progress-form input:focus,.progress-form textarea:focus { border-color:#35c9ed; }
        .progress-notes { grid-column:1/-1; }
        .progress-check { grid-column:1/-1; flex-direction:row!important; align-items:center; }
        .progress-check input { accent-color:#27c7e8; }
        .progress-submit { grid-column:1/-1; border:0; border-radius:9px; padding:12px; color:#04131d; font-weight:800; background:linear-gradient(90deg,#37d5ef,#7b9cff); cursor:pointer; }
        .progress-submit:disabled { opacity:.6; cursor:wait; }
        .progress-alert { padding:11px 14px; border-radius:9px; margin-bottom:14px; font-size:12px; white-space:pre-line; }
        .progress-alert.error { background:rgba(160,40,55,.18); border:1px solid rgba(255,100,120,.35); color:#ffb8c1; }
        .progress-alert.success { background:rgba(35,150,105,.16); border:1px solid rgba(80,220,160,.3); color:#8ff0c3; }
        .progress-history { display:flex; flex-direction:column; }
        .progress-history-row { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid rgba(130,190,220,.13); }
        .progress-history-row:last-child { border-bottom:0; }
        .progress-history-row>div,.progress-history-values { display:flex; flex-direction:column; gap:5px; }
        .progress-history-row strong { font-size:12px; }
        .progress-history-values { text-align:right; }
        .progress-empty { color:#9eb3c2; font-size:12px; line-height:1.6; padding:20px 0; }
        .progress-footnote { color:#8da2b1; font-size:10px; margin-top:14px; }
        @media(max-width:800px) { .progress-stats { grid-template-columns:repeat(2,minmax(0,1fr)); } .progress-content { grid-template-columns:1fr; } }
        @media(max-width:560px) { .progress-heading { align-items:flex-start; flex-direction:column; } .progress-form { grid-template-columns:1fr; } .progress-notes,.progress-check,.progress-submit { grid-column:auto; } .progress-user { gap:6px; } .progress-user span { display:none; } }
      `}</style>
    </div>
  );
}
