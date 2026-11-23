
const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("bodyiq_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail
          .map((error) => {
            const field = error.loc?.[error.loc.length - 1] || "field";
            return `${field}: ${error.msg}`;
          })
          .join("\n")
      : typeof data.detail === "string"
        ? data.detail
        : "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return data;
}

// AUTHENTICATION

export const registerUser = async (userData) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = async (credentials) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!data.access_token) {
    throw new Error("Login succeeded without an access token.");
  }

  localStorage.setItem("bodyiq_token", data.access_token);
  return data;
};

export const getCurrentUser = async () =>
  apiRequest("/auth/me");

export const logoutUser = () => {
  localStorage.removeItem("bodyiq_token");
};

// FITNESS

export const getFitnessMetrics = async () =>
  apiRequest("/fitness/metrics");

export const getWorkout = async () =>
  apiRequest("/fitness/workout");

export const getNutrition = async () =>
  apiRequest("/fitness/nutrition");

export const getDiet = async () =>
  apiRequest("/fitness/diet");

// DAILY PROGRESS

export const getProgress = async () =>
  apiRequest("/progress");

export const getLatestProgress = async () =>
  apiRequest("/progress/latest");

// WORKOUT SESSION TRACKING

export const getTodayWorkout = async () =>
  apiRequest("/workouts/today");

export const getWorkoutHistory = async (limit = 10) =>
  apiRequest(`/workouts/history?limit=${limit}`);

export const startWorkout = async (workoutData) =>
  apiRequest("/workouts/start", {
    method: "POST",
    body: JSON.stringify(workoutData),
  });

export const updateCompletedSets = async (
  sessionId,
  exerciseId,
  completedSets
) =>
  apiRequest(
    `/workouts/${sessionId}/exercises/${exerciseId}/sets`,
    {
      method: "PATCH",
      body: JSON.stringify({
        completed_sets: completedSets,
      }),
    }
  );

export const finishWorkout = async (sessionId) =>
  apiRequest(`/workouts/${sessionId}/finish`, {
    method: "POST",
  });

  export const createProgress = async (progressData) =>
  apiRequest("/progress", {
    method: "POST",
    body: JSON.stringify(progressData),
  });