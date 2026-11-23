import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {

  getCurrentUser,

  getFitnessMetrics,

  getWorkout,

  getNutrition,

  getProgress,

  getLatestProgress,

  logoutUser,
} from "../services/api";

import {

  Activity,

  ArrowRight,

  Bell,

  Bot,

  ChevronDown,

  Flame,

  Footprints,

  Dumbbell,

  Menu,

  MessageCircle,

  Play,

  Target,

  TrendingUp,

  Utensils,

  X,

} from "lucide-react";

const unwrap = (value) => {

  if (!value || typeof value !== "object") return value;

  return value.data ?? value.result ?? value;

};

const readNumber = (sources, keys, fallback = null) => {

  for (const source of sources) {

    if (!source || typeof source !== "object") continue;

    for (const key of keys) {

      const raw = source[key];

      const value = typeof raw === "object" && raw !== null

        ? raw.value ?? raw.amount ?? raw.total

        : raw;

      if (value !== undefined && value !== null && value !== "") {

        const number = Number(String(value).replace(/,/g, "").replace(/[^0-9.-]/g, ""));

        if (Number.isFinite(number)) return number;

      }

    }

  }

  return fallback;

};

const readText = (sources, keys, fallback = "") => {

  for (const source of sources) {

    if (!source || typeof source !== "object") continue;

    for (const key of keys) {

      const value = source[key];

      if (typeof value === "string" && value.trim()) return value;

    }

  }

  return fallback;

};

const asObject = (value) => {

  const unwrapped = unwrap(value);

  if (Array.isArray(unwrapped)) return {};

  return unwrapped && typeof unwrapped === "object" ? unwrapped : {};

};

const asRecords = (value) => {

  const unwrapped = unwrap(value);

  if (Array.isArray(unwrapped)) return unwrapped;

  if (Array.isArray(unwrapped?.items)) return unwrapped.items;

  if (Array.isArray(unwrapped?.records)) return unwrapped.records;

  if (Array.isArray(unwrapped?.progress)) return unwrapped.progress;

  return [];

};

function Dashboard() {
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    setMobileMenu(false);
    window.location.replace("/login");
  };

  const [mobileMenu, setMobileMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [activitySuccess, setActivitySuccess] = useState("");

  const [savingActivity, setSavingActivity] = useState(false);

  const [activityError, setActivityError] = useState("");

  const [activitySteps, setActivitySteps] = useState("0");

  const [activityCalories, setActivityCalories] = useState("0");
  const [workoutSession, setWorkoutSession] = useState(null);
  const [workoutIntensity, setWorkoutIntensity] = useState("moderate");
  const [workoutBusy, setWorkoutBusy] = useState(false);
  const [workoutError, setWorkoutError] = useState("");
  const [workoutMessage, setWorkoutMessage] = useState("");
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Hi! I'm your BodyIQ Coach. Ask me about workouts, nutrition, recovery, or your fitness goals. 💪" },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiSending, setAiSending] = useState(false);
  const [aiError, setAiError] = useState("");


  useEffect(() => {
    const sectionByRoute = {
      "/workout": "bodyiq-workout-section",
      "/nutrition": "bodyiq-nutrition-section",
      "/progress": "bodyiq-progress-section",
    };

    const sectionId = sectionByRoute[location.pathname];
    if (!sectionId) return;

    // Wait for the route render before scrolling to the section.
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.pathname]);

  const [dashboardData, setDashboardData] = useState({

    profile: {},

    metrics: {},

    workout: {},

    nutrition: {},

    progress: [],

    latestProgress: {},

  });

  useEffect(() => {

    let active = true;

    const safelyLoad = async (request) => {

      try {

        return await request();

      } catch {

        return null;

      }

    };

    const loadDashboard = async () => {

      setLoading(true);

      const loadTodayWorkout = async () => {
        const token = localStorage.getItem("bodyiq_token");
        if (!token) return null;
        const response = await fetch("http://127.0.0.1:8000/workouts/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Could not load today's workout session.");
        return response.json();
      };

      const loadWorkoutHistory = async () => {
        const token = localStorage.getItem("bodyiq_token");
        if (!token) return [];
        const response = await fetch("http://127.0.0.1:8000/workouts/history?limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Could not load workout history.");
        return response.json();
      };

      const [profileResult, metricsResult, workoutResult, nutritionResult, progressResult, latestResult, todayWorkoutResult, historyResult] =
        await Promise.all([
          safelyLoad(getCurrentUser),
          safelyLoad(getFitnessMetrics),
          safelyLoad(getWorkout),
          safelyLoad(getNutrition),
          safelyLoad(getProgress),
          safelyLoad(getLatestProgress),
          safelyLoad(loadTodayWorkout),
          safelyLoad(loadWorkoutHistory),
        ]);

      if (!active) return;

      const profile = asObject(profileResult?.user ?? profileResult?.profile ?? profileResult);

      const metrics = asObject(metricsResult?.metrics ?? metricsResult);

      const workout = asObject(workoutResult?.workout ?? workoutResult);

      const nutrition = asObject(nutritionResult?.nutrition ?? nutritionResult);

      const progress = asRecords(progressResult);

      const latestProgress = asObject(latestResult);

      const hasAnyData = [profileResult, metricsResult, workoutResult, nutritionResult, progressResult, latestResult]

        .some((result) => result !== null);

      setDashboardData({ profile, metrics, workout, nutrition, progress, latestProgress });
      setWorkoutSession(todayWorkoutResult ?? null);
      setWorkoutHistory(Array.isArray(historyResult) ? historyResult : []);

      setLoadError(hasAnyData ? "" : "Unable to load live dashboard data. Check that the backend is running and you are signed in.");

      setLoading(false);

    };

    loadDashboard();

    return () => {

      active = false;

    };

  }, []);

  const profile = dashboardData.profile;

  const metrics = dashboardData.metrics;

  const workoutData = asObject(dashboardData.workout.workout ?? dashboardData.workout);

  const nutrition = asObject(dashboardData.nutrition.nutrition ?? dashboardData.nutrition);

  const latestProgress = asObject(

    dashboardData.latestProgress.progress ?? dashboardData.latestProgress.record ?? dashboardData.latestProgress

  );

  const progressRecords = dashboardData.progress;

  const todayDate = new Date();

  const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  const todayProgress = progressRecords.find((record) => record?.date === todayKey) ?? {};
  const workoutCompletedToday = workoutSession?.status === "completed";
  const workoutCompletionPercent = Number(workoutSession?.completion_percent ?? 0);

  useEffect(() => {
    // Wait until the API request has finished before initializing the inputs.
    // This prevents the initial empty progress array from resetting saved values.
    if (loading) return;

    const todayRecord = dashboardData.progress.find(
      (record) => String(record?.date).slice(0, 10) === todayKey
    );

    setActivitySteps(String(todayRecord?.steps ?? 0));
    setActivityCalories(String(todayRecord?.calories_burned ?? 0));
  }, [dashboardData.progress, todayKey, loading]);

  const saveDailyProgress = async (changes) => {

    setSavingActivity(true);

    setActivityError("");

    setActivitySuccess("");

    try {

      const token = localStorage.getItem("bodyiq_token");

      if (!token) {

        throw new Error("Please log in again before saving progress.");

      }

      const response = await fetch(

        `http://127.0.0.1:8000/progress/${todayKey}`,

        {

          method: "PATCH",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

          },

          body: JSON.stringify(changes),

        }

      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {

        const detail =

          typeof result.detail === "string"

            ? result.detail

            : "Could not save today's activity.";

        throw new Error(detail);

      }

      setDashboardData((current) => {

        const withoutToday = current.progress.filter(

          (record) => record?.date !== todayKey

        );

        return {

          ...current,

          progress: [result, ...withoutToday],

          latestProgress: result,

        };

      });

      setActivitySteps(String(result.steps ?? 0));

      setActivityCalories(String(result.calories_burned ?? 0));

      setActivitySuccess("Today's activity saved successfully!");

    } catch (error) {

      setActivityError(

        error.message || "Could not save today's activity."

      );

    } finally {

      setSavingActivity(false);

    }

  };

  const workoutApi = async (path, options = {}) => {
    const token = localStorage.getItem("bodyiq_token");
    if (!token) throw new Error("Please log in again before using workout tracking.");
    const response = await fetch(`http://127.0.0.1:8000${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof result.detail === "string" ? result.detail : "Workout request failed.");
    return result;
  };

  const refreshDailyProgress = async () => {
    const [progressResult, latestResult] = await Promise.all([
      getProgress().catch(() => []),
      getLatestProgress().catch(() => ({})),
    ]);
    const records = asRecords(progressResult);
    setDashboardData((current) => ({
      ...current,
      progress: records,
      latestProgress: asObject(latestResult),
    }));
  };

  const startWorkout = async () => {
    setWorkoutBusy(true);
    setWorkoutError("");
    setWorkoutMessage("");
    try {
      const plannedExercises = selectedPlanExercises;
      if (isRestDay) {
        throw new Error("Today is a recovery day. Enjoy your rest and resume on your next training day.");
      }
      if (!plannedExercises.length) {
        throw new Error("Your workout plan does not contain exercises for today's session.");
      }

      // Convert the plan's exercise-name strings into the workout API payload.
      const payload = {
        workout_name: workoutTitle,
        intensity: workoutIntensity,
        exercises: plannedExercises.map((exercise) => {
          if (typeof exercise === "string") {
            const isCardio = /walking|running|cycling|cardio|treadmill|rowing|elliptical|burpees|mountain climbers/i.test(exercise);
            return {
              exercise_name: exercise.trim(),
              planned_sets: isCardio ? 1 : 3,
              planned_reps: isCardio ? 1 : 10,
            };
          }
          return {
            exercise_name: exercise.exercise_name ?? exercise.name ?? exercise.title,
            planned_sets: Number(exercise.planned_sets ?? exercise.sets ?? 3),
            planned_reps: Number(exercise.planned_reps ?? exercise.reps ?? 10),
          };
        }).filter((exercise) => exercise.exercise_name),
      };
      if (!payload.exercises.length) throw new Error("Your workout plan has no valid exercise names.");

      const session = await workoutApi("/workouts/start", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setWorkoutSession(session);
      setWorkoutMessage("Workout started. Log each set as you complete it.");
    } catch (error) {
      setWorkoutError(error.message);
    } finally {
      setWorkoutBusy(false);
    }
  };

  const updateExerciseSets = async (exerciseId, completedSets) => {
    if (!workoutSession) return;
    setWorkoutBusy(true);
    setWorkoutError("");
    setWorkoutMessage("");
    try {
      const session = await workoutApi(
        `/workouts/${workoutSession.id}/exercises/${exerciseId}/sets`,
        { method: "PATCH", body: JSON.stringify({ completed_sets: completedSets }) }
      );
      setWorkoutSession(session);
    } catch (error) {
      setWorkoutError(error.message);
    } finally {
      setWorkoutBusy(false);
    }
  };

  const finishWorkout = async () => {
    if (!workoutSession) return;
    setWorkoutBusy(true);
    setWorkoutError("");
    setWorkoutMessage("");
    try {
      const session = await workoutApi(`/workouts/${workoutSession.id}/finish`, { method: "POST" });
      setWorkoutSession(session);
      setWorkoutMessage(`Workout completed! Estimated ${Math.round(session.calories_burned ?? 0)} kcal burned.`);
      setActivityCalories(String(Math.round(session.calories_burned ?? 0)));
      await refreshDailyProgress();
      const token = localStorage.getItem("bodyiq_token");
      const historyResponse = await fetch("http://127.0.0.1:8000/workouts/history?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (historyResponse.ok) setWorkoutHistory(await historyResponse.json());
    } catch (error) {
      setWorkoutError(error.message);
    } finally {
      setWorkoutBusy(false);
    }
  };

  const sendAIMessage = async (event) => {
    event.preventDefault();
    const message = aiInput.trim();
    if (!message || aiSending) return;

    const token = localStorage.getItem("bodyiq_token");
    if (!token) {
      setAiError("Please log in again to use BodyIQ AI.");
      return;
    }

    setAiMessages((previous) => [...previous, { role: "user", text: message }]);
    setAiInput("");
    setAiError("");
    setAiSending(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || `BodyIQ AI request failed (${response.status}).`);
      }
      if (typeof data.response !== "string" || !data.response.trim()) {
        throw new Error("BodyIQ AI returned an empty response.");
      }
      setAiMessages((previous) => [...previous, { role: "assistant", text: data.response }]);
    } catch (error) {
      setAiError(error.message || "Unable to connect to BodyIQ AI.");
    } finally {
      setAiSending(false);
    }
  };

  const sources = [metrics, nutrition, todayProgress, profile];

  const heightCm = readNumber(sources, ["height_cm", "height", "height_in_cm"]);

  const weightKg = readNumber(sources, ["weight_kg", "weight", "current_weight"]);

  const calculatedBmi = heightCm && weightKg ? weightKg / ((heightCm / 100) ** 2) : null;

  const bmiValue = readNumber(sources, ["bmi", "body_mass_index"], calculatedBmi ?? 22.3);

  const caloriesValue = readNumber(

    [metrics, nutrition, profile],

    ["target_calories", "daily_calories", "calories_target", "calorie_target", "calories", "tdee"],

    3168

  );

  const proteinValue = readNumber(

    [nutrition, metrics, profile],

    ["protein_target_g", "daily_protein_g", "protein_g", "protein_target", "protein"],

    140

  );

  const goal = readText([profile, metrics], ["goal", "fitness_goal"], "Fitness");



  const name = readText([profile], ["name", "full_name", "username"], "there");

  const recentProgress = progressRecords.slice(0, 7);

  const completedWorkouts = recentProgress.filter((record) => record?.workout_completed === true).length;

  const workoutProgress = recentProgress.length

    ? `${Math.round((completedWorkouts / recentProgress.length) * 100)}%`

    : "—";

  const user = {

    name,

    bmi: bmiValue.toFixed(1),

    bmiStatus: bmiValue < 18.5 ? "Underweight" : bmiValue < 25 ? "Healthy" : bmiValue < 30 ? "Overweight" : "High BMI",

    calories: Math.round(caloriesValue).toLocaleString("en-US"),

    protein: `${Math.round(proteinValue)}g`,

    workoutProgress,

    goal,

  };

  // The workout API returns a weekly plan in workoutData.sessions.
  const workoutSessions = Array.isArray(workoutData.sessions) ? workoutData.sessions : [];
  const localDayNumber = ((new Date().getDay() + 6) % 7) + 1; // Monday=1 ... Sunday=7
  const selectedWorkoutDay =
    workoutSessions.find((session) => Number(session.day) === localDayNumber) ??
    workoutSessions.find((session) => Array.isArray(session.exercises) && session.exercises.length > 0) ??
    workoutSessions[0] ??
    null;

  const selectedPlanExercises = Array.isArray(selectedWorkoutDay?.exercises)
    ? selectedWorkoutDay.exercises
    : [];
  const isRestDay = Boolean(
    selectedWorkoutDay &&
    selectedPlanExercises.length === 0 &&
    /rest|recovery/i.test(selectedWorkoutDay.focus ?? "")
  );

  const bodyiqNotifications = [
    {
      id: "workout",
      title: workoutCompletedToday ? "Workout completed" : "Your workout is ready",
      description: workoutCompletedToday
        ? "Great work! Your workout has been recorded for today."
        : isRestDay
          ? "Today is a recovery day. Rest and recharge."
          : "Open your workout plan and start today's session.",
      icon: <Dumbbell size={16} />,
    },
    {
      id: "progress",
      title: "Keep your progress updated",
      description: todayProgress?.date
        ? "Your daily progress entry is saved. Keep tracking consistently."
        : "Add today's weight, steps and activity in Progress.",
      icon: <TrendingUp size={16} />,
    },
    {
      id: "nutrition",
      title: "Nutrition targets",
      description: `Your current goal is ${goal}. Check your daily nutrition targets.`,
      icon: <Utensils size={16} />,
    },
  ];

  const workoutTitle = selectedWorkoutDay?.focus ||
    readText([workoutData], ["title", "name", "workout_name", "focus", "muscle_group"], "Today's Workout");
  const workoutDescription = isRestDay
    ? "Today is scheduled for recovery. Rest, hydrate, and let your muscles recover."
    : readText(
      [selectedWorkoutDay, workoutData],
      ["description", "summary", "details"],
      "Build strength with today's personalized session."
    );

  const exercises = selectedPlanExercises;
  const exerciseCount = exercises.length;
  const durationMinutes = readNumber(
    [selectedWorkoutDay, workoutData],
    ["duration_minutes", "duration", "minutes"],
    exercises.length ? 45 : 0
  );

  const workoutCalories = workoutSession?.calories_burned ?? 0;

  const stepsValue = readNumber([todayProgress], ["steps", "step_count"], 0);

  const caloriesBurnedValue = readNumber([todayProgress], ["calories_burned", "burned_calories"], 0);

  const stepsTarget = 8000;

  const caloriesBurnedTarget = 500;

  const stepsPercent = Math.min(100, Math.round((stepsValue / stepsTarget) * 100));

  const burnedPercent = Math.min(100, Math.round((caloriesBurnedValue / caloriesBurnedTarget) * 100));

  // Use actual saved progress records; ignore entries without a valid weight.
  const weightChartRecords = [...progressRecords]
    .filter((record) => record?.date && Number.isFinite(Number(record.weight_kg)) && Number(record.weight_kg) > 0)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-7)
    .map((record) => ({
      date: String(record.date).slice(0, 10),
      label: new Date(`${String(record.date).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: Number(record.weight_kg),
    }));

  const weightValues = weightChartRecords.map((record) => record.weight);
  const rawWeightMin = weightValues.length ? Math.min(...weightValues) : 0;
  const rawWeightMax = weightValues.length ? Math.max(...weightValues) : 1;
  const weightPadding = Math.max((rawWeightMax - rawWeightMin) * 0.2, 0.5);
  const weightChartMin = rawWeightMin - weightPadding;
  const weightChartMax = rawWeightMax + weightPadding;
  const weightChartPoints = weightChartRecords.map((record, index) => {
    const x = weightChartRecords.length === 1 ? 300 : 48 + (index * 524) / (weightChartRecords.length - 1);
    const y = 185 - ((record.weight - weightChartMin) / (weightChartMax - weightChartMin || 1)) * 150;
    return `${x},${y}`;
  }).join(" ");
  const weightChange = weightChartRecords.length >= 2
    ? weightChartRecords[weightChartRecords.length - 1].weight - weightChartRecords[0].weight
    : 0;

  return (

    <main className="dashboard-page">

      {/* Background */}

      <div className="dashboard-background" />

      <div className="dashboard-overlay" />

      <style>{`
        .dashboard-logout-button,
        .dashboard-mobile-logout {
          border: 1px solid rgba(255, 113, 133, 0.35);
          background: rgba(255, 80, 100, 0.10);
          color: #ff8da1;
          border-radius: 10px;
          padding: 9px 14px;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }
        .dashboard-logout-button:hover,
        .dashboard-mobile-logout:hover {
          background: rgba(255, 80, 100, 0.20);
          border-color: rgba(255, 113, 133, 0.65);
          transform: translateY(-1px);
        }
        .dashboard-mobile-logout {
          width: 100%;
          text-align: left;
          margin-top: 8px;
        }
        @media (max-width: 760px) {
          .dashboard-logout-button { display: none; }
        }
      `}</style>

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-nav">

        <Link to="/dashboard" className="dashboard-logo">

          <img

            src="/bodyiq-icon.png"

            alt="BodyIQ"

            className="dashboard-logo-image"

          />

          <span className="dashboard-logo-text">

            Body<span>IQ</span>

          </span>

        </Link>

        <div className="dashboard-nav-links">

          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            Dashboard
          </Link>

          <Link to="/workout" className={location.pathname === "/workout" ? "active" : ""}>
            Workout
          </Link>

          <Link to="/nutrition" className={location.pathname === "/nutrition" ? "active" : ""}>
            Nutrition
          </Link>

          <Link to="/progress" className={location.pathname === "/progress" ? "active" : ""}>
            Progress
          </Link>

        </div>

        <div className="dashboard-nav-actions">

          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="notification-button"
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setProfileMenuOpen(false);
              }}
              aria-label="Open notifications"
              aria-expanded={notificationsOpen}
              title="Notifications"
            >
              <Bell size={19} />
              {!notificationsRead && <span />}
            </button>

            {notificationsOpen && (
              <div
                role="dialog"
                aria-label="Notifications"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  width: "min(340px, calc(100vw - 32px))",
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid rgba(85,217,245,0.22)",
                  background: "rgba(7,18,31,0.98)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
                  zIndex: 1000,
                  color: "#e8f2f7",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <strong style={{ fontSize: 15 }}>Notifications</strong>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Close notifications"
                    style={{ border: 0, background: "transparent", color: "#a9bdc9", cursor: "pointer", padding: 4 }}
                  >
                    <X size={17} />
                  </button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {bodyiqNotifications.map((notification) => (
                    <div key={notification.id} style={{ display: "flex", gap: 10, padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.055)" }}>
                      <span style={{ color: "#55d9f5", paddingTop: 2 }}>{notification.icon}</span>
                      <div>
                        <strong style={{ display: "block", fontSize: 12, marginBottom: 3 }}>{notification.title}</strong>
                        <span style={{ display: "block", color: "#9aabb7", fontSize: 11, lineHeight: 1.5 }}>{notification.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsRead(true);
                    setNotificationsOpen(false);
                  }}
                  style={{ width: "100%", marginTop: 12, padding: "9px 12px", borderRadius: 9, border: "1px solid rgba(85,217,245,0.3)", background: "rgba(85,217,245,0.1)", color: "#8deaff", fontWeight: 700, cursor: "pointer" }}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="dashboard-user"
              onClick={() => {
                setProfileMenuOpen((open) => !open);
                setNotificationsOpen(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={profileMenuOpen}
              style={{ border: 0, background: "transparent", color: "inherit", font: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}
            >
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <div className="user-info">
                <strong>{user.name}</strong>
                <small>{user.goal}</small>
              </div>
              <ChevronDown size={16} style={{ transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 160ms ease" }} />
            </button>

            {profileMenuOpen && (
              <div
                role="menu"
                aria-label="Profile menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  width: 210,
                  padding: 8,
                  borderRadius: 13,
                  border: "1px solid rgba(85,217,245,0.22)",
                  background: "rgba(7,18,31,0.98)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
                  zIndex: 1000,
                }}
              >
                <div style={{ padding: "9px 10px 11px", borderBottom: "1px solid rgba(255,255,255,0.09)", marginBottom: 5 }}>
                  <strong style={{ display: "block", color: "#e8f2f7", fontSize: 13 }}>{user.name}</strong>
                  <small style={{ color: "#9aabb7", fontSize: 11 }}>{user.goal}</small>
                </div>
                {[
                  { label: "View Profile", to: "/profile" },
                  { label: "Dashboard", to: "/dashboard" },
                  { label: "Workout", to: "/workout" },
                  { label: "Nutrition", to: "/nutrition" },
                  { label: "Progress", to: "/progress" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{ display: "block", padding: "9px 10px", borderRadius: 8, color: "#c5d2dc", textDecoration: "none", fontSize: 12 }}
                    onMouseEnter={(event) => { event.currentTarget.style.background = "rgba(85,217,245,0.1)"; }}
                    onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  style={{ width: "100%", textAlign: "left", marginTop: 5, padding: "9px 10px", border: "1px solid rgba(255,113,133,0.25)", borderRadius: 8, background: "rgba(255,80,100,0.08)", color: "#ff8da1", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="dashboard-logout-button"
            onClick={handleLogout}
            aria-label="Log out of BodyIQ"
            title="Log out"
          >
            Logout
          </button>

          <button

            className="dashboard-menu-button"

            onClick={() => setMobileMenu(!mobileMenu)}

          >

            {mobileMenu ? <X size={21} /> : <Menu size={21} />}

          </button>

        </div>

      </nav>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (

        <div className="dashboard-mobile-menu">

          <Link to="/dashboard" onClick={() => setMobileMenu(false)}>
            Dashboard
          </Link>

          <Link to="/workout" onClick={() => setMobileMenu(false)}>
            Workout
          </Link>

          <Link to="/nutrition" onClick={() => setMobileMenu(false)}>
            Nutrition
          </Link>

          <Link to="/progress" onClick={() => setMobileMenu(false)}>
            Progress
          </Link>

          <button
            type="button"
            className="dashboard-mobile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      )}

      {/* ================= MAIN CONTENT ================= */}

      <section className="dashboard-content">

        {loading && (

          <p role="status" style={{ color: "#8fa3ad", marginBottom: 12 }}>

            Loading your BodyIQ data...

          </p>

        )}

        {loadError && (

          <p role="alert" style={{ color: "#ffb4c7", marginBottom: 12 }}>

            {loadError}

          </p>

        )}

        {/* Header */}

        <div className="dashboard-welcome">

          <div>

            <div className="dashboard-eyebrow">

              <span className="dashboard-status-dot" />

              BODYIQ DASHBOARD

            </div>

            <h1>

              Good evening,{" "}

              <span>{user.name}</span>

              <span className="wave">👋</span>

            </h1>

            <p>

              Here's your fitness snapshot for today.

              Keep showing up. Your progress is building.

            </p>

          </div>

          <div className="today-badge">

            <Activity size={17} />

            <span>Today's Focus</span>

            <strong>{user.goal}</strong>

          </div>

        </div>

        {/* ================= METRICS ================= */}

        <div id="bodyiq-nutrition-section" className="dashboard-metrics" style={{ scrollMarginTop: 100 }}>

          {/* BMI */}

          <div className="metric-card">

            <div className="metric-top">

              <div className="metric-icon">

                <Activity size={20} />

              </div>

              <span className="metric-label">

                BMI

              </span>

            </div>

            <div className="metric-value">

              {user.bmi}

            </div>

            <div className="metric-bottom">

              <span className="healthy-dot" />

              {user.bmiStatus}

            </div>

          </div>

          {/* Calories */}

          <div className="metric-card">

            <div className="metric-top">

              <div className="metric-icon pink">

                <Flame size={20} />

              </div>

              <span className="metric-label">

                DAILY CALORIES

              </span>

            </div>

            <div className="metric-value">

              {user.calories}

              <small> kcal</small>

            </div>

            <div className="metric-bottom">

              <TrendingUp size={14} />

              Daily target

            </div>

          </div>

          {/* Protein */}

          <div className="metric-card">

            <div className="metric-top">

              <div className="metric-icon">

                <Utensils size={20} />

              </div>

              <span className="metric-label">

                DAILY PROTEIN

              </span>

            </div>

            <div className="metric-value">

              {user.protein}

            </div>

            <div className="metric-bottom">

              Muscle support target

            </div>

          </div>

          {/* Workout */}

          <div className="metric-card">

            <div className="metric-top">

              <div className="metric-icon pink">

                <Dumbbell size={20} />

              </div>

              <span className="metric-label">

                WORKOUT

              </span>

            </div>

            <div className="metric-value">

              {user.workoutProgress}

            </div>

            <div className="metric-bottom">

              This week's consistency

            </div>

          </div>

        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="dashboard-main-grid">

          {/* TODAY'S WORKOUT */}

          <div id="bodyiq-workout-section" className="workout-card" style={{ scrollMarginTop: 100 }}>

            <div className="card-heading">

              <div>

                <span className="card-eyebrow">

                  TODAY'S WORKOUT

                </span>

                <h2>

                  {workoutTitle}

                </h2>

                <p>

                  {workoutDescription}

                </p>

              </div>

              <div className="workout-icon">

                <Dumbbell size={24} />

              </div>

            </div>

            <div className="workout-stats">

              <div>

                <strong>{exerciseCount}</strong>

                <span>Exercises</span>

              </div>

              <div className="workout-divider" />

              <div>

                <strong>{durationMinutes}</strong>

                <span>Minutes</span>

              </div>

              <div className="workout-divider" />

              <div>

                <strong>{Math.round(workoutCalories)}</strong>

                <span>Calories</span>

              </div>

            </div>

            <div style={{ marginTop: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 13, opacity: 0.82 }}>Workout completion</span>
                <strong style={{ fontSize: 14, color: workoutCompletedToday ? "#65e6a5" : "inherit" }}>
                  {workoutCompletionPercent}%
                </strong>
              </div>
              <div role="progressbar" aria-label="Workout completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={workoutCompletionPercent}
                style={{ height: 7, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.12)" }}>
                <div style={{ width: `${workoutCompletionPercent}%`, height: "100%", borderRadius: 999, background: "#65e6a5", transition: "width 250ms ease" }} />
              </div>
            </div>

            {!workoutSession && (
              <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                {isRestDay ? (
                  <p style={{ color: "#65e6a5", fontSize: 14, margin: 0 }}>
                    <strong>Recovery day</strong> — no workout session is scheduled today.
                  </p>
                ) : exercises.length > 0 ? (
                  <>
                    <div style={{ display: "grid", gap: 7 }}>
                      <span style={{ fontSize: 13, color: "#c5d2dc" }}>Today's planned exercises</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {exercises.map((exercise, index) => (
                          <span key={`${String(exercise)}-${index}`} style={{ fontSize: 12, padding: "6px 9px", borderRadius: 8, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)" }}>
                            {typeof exercise === "string" ? exercise : exercise.exercise_name ?? exercise.name ?? exercise.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    <label style={{ display: "grid", gap: 6, fontSize: 13, color: "#c5d2dc" }}>
                      Workout intensity
                      <select value={workoutIntensity} onChange={(event) => setWorkoutIntensity(event.target.value)}
                        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(10,20,35,.8)", color: "white" }}>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="vigorous">Vigorous</option>
                      </select>
                    </label>
                    <button type="button" className="primary-dashboard-button" onClick={startWorkout} disabled={workoutBusy || loading}>
                      <Play size={17} fill="currentColor" /> {workoutBusy ? "Starting..." : "Start Workout"} <ArrowRight size={17} />
                    </button>
                  </>
                ) : (
                  <p style={{ color: "#ffb4c7", fontSize: 13, margin: 0 }}>
                    No training session is configured for today in your workout plan.
                  </p>
                )}
              </div>
            )}

            {workoutSession && (
              <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 13 }}>
                  <span>Intensity: <strong>{workoutSession.intensity}</strong></span>
                  <span>Status: <strong>{workoutSession.status}</strong></span>
                </div>
                {(workoutSession.exercises ?? []).map((exercise) => (
                  <div key={exercise.id} style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                      <strong>{exercise.exercise_name}</strong>
                      <span style={{ fontSize: 12, opacity: .8 }}>{exercise.completed_sets}/{exercise.planned_sets} sets</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Array.from({ length: exercise.planned_sets }, (_, index) => {
                        const checked = index < exercise.completed_sets;
                        return (
                          <button key={index} type="button" disabled={workoutBusy || workoutSession.status !== "in_progress" || index > exercise.completed_sets}
                            onClick={() => updateExerciseSets(exercise.id, checked ? index : index + 1)}
                            aria-pressed={checked}
                            style={{ minWidth: 42, padding: "8px 10px", borderRadius: 9, border: "1px solid rgba(255,255,255,.2)", background: checked ? "#16794b" : "rgba(255,255,255,.08)", color: "white", cursor: "pointer" }}>
                            {checked ? "✓" : `Set ${index + 1}`}
                          </button>
                        );
                      })}
                    </div>
                    <small style={{ display: "block", marginTop: 8, opacity: .75 }}>{exercise.planned_reps} reps per set</small>
                  </div>
                ))}
                {workoutSession.status === "in_progress" && (
                  <button type="button" className="primary-dashboard-button" onClick={finishWorkout}
                    disabled={workoutBusy || workoutSession.completion_percent !== 100}>
                    {workoutBusy ? "Finishing..." : "Finish Workout"} <ArrowRight size={17} />
                  </button>
                )}
                {workoutSession.status === "completed" && (
                  <>
                    <p role="status" style={{ color: "#65e6a5", fontSize: 13 }}>
                      Completed · {workoutSession.duration_minutes ?? 0} min · {Math.round(workoutSession.calories_burned ?? 0)} estimated kcal burned
                    </p>
                    <button
                      type="button"
                      className="primary-dashboard-button"
                      onClick={() => { setWorkoutSession(null); setWorkoutError(""); setWorkoutMessage("Ready for your next workout. Choose intensity and start when ready."); }}
                      disabled={workoutBusy}
                    >
                      <Play size={17} fill="currentColor" /> Start Another Workout <ArrowRight size={17} />
                    </button>
                  </>
                )}
              </div>
            )}
            {workoutMessage && <p role="status" style={{ color: "#65e6a5", fontSize: 13, marginTop: 10 }}>{workoutMessage}</p>}
            {workoutError && <p role="alert" style={{ color: "#ff8da1", fontSize: 13, marginTop: 10 }}>{workoutError}</p>}

          </div>

          {/* AI COACH */}

          <div className="ai-coach-card">

            <div className="ai-coach-glow" />

            <div className="ai-coach-header">

              <div className="ai-coach-icon">

                <Bot size={24} />

              </div>

              <div>

                <span className="card-eyebrow">

                  BODYIQ AI

                </span>

                <h2>

                  Your AI Coach

                </h2>

              </div>

              <span className="ai-online">

                <span />

                Online

              </span>

            </div>

            <div
              className="ai-chat-messages"
              aria-live="polite"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxHeight: 320,
                overflowY: "auto",
                padding: "12px 2px",
                marginTop: 8,
              }}
            >
              {aiMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "92%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: message.role === "user"
                      ? "rgba(44, 190, 230, 0.18)"
                      : "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e8f2f7",
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {message.role === "user" ? (
                    message.text
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p style={{ margin: "0 0 9px" }}>{children}</p>,
                        h1: ({ children }) => <h3 style={{ color: "#55d9f5", margin: "12px 0 8px" }}>{children}</h3>,
                        h2: ({ children }) => <h3 style={{ color: "#55d9f5", margin: "12px 0 8px" }}>{children}</h3>,
                        h3: ({ children }) => <h4 style={{ color: "#55d9f5", margin: "10px 0 6px" }}>{children}</h4>,
                        strong: ({ children }) => <strong style={{ color: "#ffffff" }}>{children}</strong>,
                        ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: "6px 0 10px" }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ paddingLeft: 20, margin: "6px 0 10px" }}>{children}</ol>,
                        li: ({ children }) => <li style={{ marginBottom: 5 }}>{children}</li>,
                        code: ({ children }) => <code style={{ background: "rgba(85,217,245,0.12)", padding: "2px 5px", borderRadius: 4, color: "#55d9f5" }}>{children}</code>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
              ))}
              {aiSending && (
                <p role="status" style={{ color: "#55d9f5", fontSize: 13, margin: 0 }}>
                  BodyIQ is thinking...
                </p>
              )}
            </div>

            {aiError && (
              <p role="alert" style={{ color: "#ff8da1", fontSize: 12, margin: "4px 0" }}>
                {aiError}
              </p>
            )}

            <form
              onSubmit={sendAIMessage}
              style={{ display: "flex", gap: 8, marginTop: 10 }}
            >
              <input
                type="text"
                value={aiInput}
                onChange={(event) => setAiInput(event.target.value)}
                placeholder="Ask BodyIQ anything..."
                aria-label="Message BodyIQ AI"
                disabled={aiSending}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "11px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(85,217,245,0.3)",
                  background: "rgba(10,20,35,0.8)",
                  color: "white",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="ai-chat-button"
                disabled={aiSending || !aiInput.trim()}
                style={{ opacity: aiSending || !aiInput.trim() ? 0.55 : 1, cursor: aiSending ? "wait" : "pointer" }}
              >
                {aiSending ? "Sending..." : "Send"}
                <ArrowRight size={17} />
              </button>
            </form>

          </div>

        </div>

        {/* ================= WORKOUT HISTORY ================= */}
        <section className="progress-card" style={{ marginTop: 18, marginBottom: 18 }}>
          <div className="section-heading">
            <div>
              <span className="card-eyebrow">YOUR TRAINING RECORD</span>
              <h2>Workout History</h2>
            </div>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Latest 10 sessions</span>
          </div>
          {workoutHistory.length === 0 ? (
            <p style={{ color: "#9aabb7", fontSize: 13 }}>No previous workouts found yet. Complete your first session to build your history.</p>
          ) : (
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              {workoutHistory.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", padding: 14, borderRadius: 12, background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.09)" }}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong>{item.workout_name || "Workout"}</strong>
                    <small style={{ color: "#9aabb7" }}>{item.completed_at ? new Date(item.completed_at).toLocaleString() : item.started_at ? new Date(item.started_at).toLocaleString() : "Date unavailable"} · {item.duration_minutes ?? "—"} min · {item.intensity || "moderate"}</small>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <strong style={{ color: item.calories_burned == null ? "#9aabb7" : "#65e6a5" }}>
                      {item.calories_burned == null ? "Not recorded" : `${Math.round(item.calories_burned)} kcal`}
                    </strong>
                    <span style={{ fontSize: 12, color: item.status === "completed" ? "#65e6a5" : "#f4c36a" }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= LOWER GRID ================= */}

        <div id="bodyiq-progress-section" className="dashboard-lower-grid" style={{ scrollMarginTop: 100 }}>

          {/* WEIGHT PROGRESS — LIVE DATA */}
          <div className="progress-card">
            <div className="section-heading">
              <div>
                <span className="card-eyebrow">YOUR PROGRESS</span>
                <h2>Weight Overview</h2>
              </div>
              <span className="period-button">Last 7 entries</span>
            </div>

            {weightChartRecords.length >= 2 ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", margin: "16px 0 10px" }}>
                  <div>
                    <div style={{ color: "#9aabb7", fontSize: 12 }}>Latest weight</div>
                    <strong style={{ fontSize: 25 }}>{weightChartRecords[weightChartRecords.length - 1].weight.toFixed(1)} kg</strong>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#9aabb7", fontSize: 12 }}>Change from first entry</div>
                    <strong style={{ fontSize: 18, color: weightChange <= 0 ? "#65e6a5" : "#55d9f5" }}>
                      {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
                    </strong>
                  </div>
                </div>
                <div style={{ width: "100%", overflow: "hidden" }}>
                  <svg viewBox="0 0 600 230" role="img" aria-label="Weight trend based on your saved progress entries" style={{ width: "100%", height: "auto", display: "block" }}>
                    {[35, 85, 135, 185].map((y) => (
                      <line key={y} x1="42" y1={y} x2="580" y2={y} stroke="rgba(255,255,255,0.10)" strokeDasharray="4 6" />
                    ))}
                    <polyline
                      points={weightChartPoints}
                      fill="none"
                      stroke="#55d9f5"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {weightChartRecords.map((record, index) => {
                      const x = weightChartRecords.length === 1 ? 300 : 48 + (index * 524) / (weightChartRecords.length - 1);
                      const y = 185 - ((record.weight - weightChartMin) / (weightChartMax - weightChartMin || 1)) * 150;
                      return (
                        <g key={`${record.date}-${index}`}>
                          <circle cx={x} cy={y} r="6" fill="#55d9f5" stroke="#102033" strokeWidth="3" />
                          <text x={x} y="215" textAnchor="middle" fill="#9aabb7" fontSize="12">{record.label}</text>
                          <text x={x} y={Math.max(20, y - 13)} textAnchor="middle" fill="#e8f2f7" fontSize="12">{record.weight.toFixed(1)}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p style={{ color: "#9aabb7", fontSize: 12, margin: "8px 0 0" }}>
                  Based on your saved weight entries. Add progress updates to keep this chart current.
                </p>
              </>
            ) : (
              <div style={{ padding: "34px 12px", textAlign: "center", color: "#9aabb7" }}>
                <TrendingUp size={28} style={{ marginBottom: 10, opacity: 0.75 }} />
                <p style={{ margin: 0, color: "#e8f2f7", fontWeight: 600 }}>Not enough weight entries yet</p>
                <p style={{ fontSize: 13, margin: "8px 0 0" }}>Save your weight on at least two different dates to see your progress trend here.</p>
              </div>
            )}
          </div>

          {/* QUICK STATS */}

          <div className="quick-stats-card">

            <div className="section-heading">

              <div>

                <span className="card-eyebrow">

                  TODAY

                </span>

                <h2>

                  Activity

                </h2>

              </div>

              <Target size={21} />

            </div>

            <div className="activity-item">

              <div className="activity-icon">

                <Footprints size={19} />

              </div>

              <div className="activity-info">

                <strong>Steps</strong>

                <span>{stepsValue.toLocaleString("en-US")} / {stepsTarget.toLocaleString("en-US")}</span>

              </div>

              <strong className="activity-percent">

                {stepsPercent}%

              </strong>

            </div>

            <div className="activity-progress">

              <span style={{ width: `${stepsPercent}%` }} />

            </div>

            <div className="activity-item">

              <div className="activity-icon pink">

                <Flame size={19} />

              </div>

              <div className="activity-info">

                <strong>Calories burned</strong>

                <span>{Math.round(caloriesBurnedValue).toLocaleString("en-US")} / {caloriesBurnedTarget} kcal</span>

              </div>

              <strong className="activity-percent">

                {burnedPercent}%

              </strong>

            </div>

            <div className="activity-progress">

              <span style={{ width: `${burnedPercent}%` }} />

            </div>

            <div className="activity-manual-entry" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>

              <label style={{ display: "grid", gap: 6, color: "#c5d2dc", fontSize: 13 }}>

                Steps recorded

                <input type="number" min="0" step="1" value={activitySteps} onChange={(event) => setActivitySteps(event.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(10,20,35,.65)", color: "white" }} />

              </label>

              <div style={{ display: "grid", gap: 6, color: "#c5d2dc", fontSize: 13 }}>
                Calories burned (automatic)
                <div style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(10,20,35,.65)", color: "white" }}>
                  {Math.round(caloriesBurnedValue).toLocaleString("en-US")} kcal
                </div>
              </div>

            </div>

            <button type="button" className="view-progress" disabled={savingActivity || loading} onClick={() => saveDailyProgress({ steps: Math.max(0, Math.floor(Number(activitySteps) || 0)) })} style={{ marginTop: 12, background: "transparent", border: 0, cursor: savingActivity ? "wait" : "pointer", opacity: savingActivity ? 0.6 : 1 }}>

              {savingActivity ? "Saving activity..." : "Save today's activity"}

              <ArrowRight size={15} />

            </button>

            {activitySuccess && (

              <p

                role="status"

                style={{ color: "#65e6a5", marginTop: 10, fontSize: 13 }}

              >

                {activitySuccess}

              </p>

            )}

            {activityError && (

              <p

                role="alert"

                style={{ color: "#ff8da1", marginTop: 10, fontSize: 13 }}

              >

                {activityError}

              </p>

            )}

            <Link

              to="/progress"

              className="view-progress"

            >

              View full progress

              <ArrowRight size={15} />

            </Link>

          </div>

        </div>

      </section>

    </main>

  );

}

export default Dashboard;

