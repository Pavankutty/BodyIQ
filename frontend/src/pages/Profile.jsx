import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Flame,
  Dumbbell,
  Target,
  Sparkles,
  Utensils,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const registrationData = location.state || {};

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    goal: "",
    activity_level: "",
    fitness_level: "",
    diet_type: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  /* =========================================================
     LIVE BODY METRICS
     ========================================================= */

  const height = Number(formData.height_cm);
  const weight = Number(formData.weight_kg);
  const age = Number(formData.age);

  const hasBodyData =
    height > 0 &&
    weight > 0 &&
    age > 0 &&
    formData.gender;

  let bmi = null;
  let bmiLabel = "--";

  if (height > 0 && weight > 0) {
    bmi = weight / ((height / 100) * (height / 100));

    if (bmi < 18.5) {
      bmiLabel = "Underweight";
    } else if (bmi < 25) {
      bmiLabel = "Healthy";
    } else if (bmi < 30) {
      bmiLabel = "Overweight";
    } else {
      bmiLabel = "High";
    }
  }

  let calories = "--";
  let protein = "--";

  if (hasBodyData) {
    let bmr;

    if (formData.gender === "Male") {
      bmr =
        10 * weight +
        6.25 * height -
        5 * age +
        5;
    } else {
      bmr =
        10 * weight +
        6.25 * height -
        5 * age -
        161;
    }

    const activityMultipliers = {
      Sedentary: 1.2,
      Light: 1.375,
      Moderate: 1.55,
      Active: 1.725,
      "Very Active": 1.9,
    };

    const multiplier =
      activityMultipliers[formData.activity_level] || 1.2;

    const tdee = bmr * multiplier;

    let calorieTarget = tdee;

    if (formData.goal === "Muscle Gain") {
      calorieTarget += 300;
    } else if (
      formData.goal === "Weight Loss" ||
      formData.goal === "Fat Loss"
    ) {
      calorieTarget -= 400;
    }

    calories = Math.round(calorieTarget);

    protein = Math.round(weight * 1.8);
  }

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.age ||
      !formData.gender ||
      !formData.height_cm ||
      !formData.weight_kg ||
      !formData.goal ||
      !formData.activity_level ||
      !formData.fitness_level ||
      !formData.diet_type
    ) {
      setError("Please complete all profile fields.");
      return;
    }

    const payload = {
      name: registrationData.name,
      email: registrationData.email,
      password: registrationData.password,

      age: Number(formData.age),
      gender: formData.gender,
      height_cm: Number(formData.height_cm),
      weight_kg: Number(formData.weight_kg),
      goal: formData.goal,
      activity_level: formData.activity_level,
      fitness_level: formData.fitness_level,
      diet_type: formData.diet_type,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail
              .map((item) => item.msg)
              .join(", ")
          : data.detail || "Registration failed.";

        setError(message);
        return;
      }

      alert("Account created successfully! 🎉");
      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to BodyIQ server. Please make sure the backend is running."
      );
    }
  };

  return (
    <main className="profile-page">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="profile-background" />
      <div className="profile-overlay" />

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <nav className="profile-nav">

        <button
          type="button"
          className="profile-back"
          onClick={() => navigate("/register")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="profile-logo">

          <img
            src="/bodyiq-icon.png"
            alt="BodyIQ"
          />

          <span>
            Body<span>IQ</span>
          </span>

        </div>

      </nav>

      {/* =====================================================
          MAIN PROFILE AREA
          ===================================================== */}

      <section className="profile-container">

        {/* ===================================================
            LEFT — BODY ANALYSIS
            =================================================== */}

        <aside className="profile-side left-side">

          <div className="side-label">
            <span className="side-dot" />
            BODY ANALYSIS
          </div>

          <h2>
            Your body.
            <br />
            <span>Your insights.</span>
          </h2>

          <p className="side-description">
            BodyIQ turns your basic information into
            personalized fitness insights.
          </p>

          <div className="analysis-card">

            <div className="analysis-icon">
              <Activity size={18} />
            </div>

            <div className="analysis-info">
              <span>BMI</span>

              <strong>
                {bmi ? bmi.toFixed(1) : "--"}
              </strong>

              <small>
                {bmiLabel}
              </small>
            </div>

          </div>

          <div className="analysis-card">

            <div className="analysis-icon">
              <Flame size={18} />
            </div>

            <div className="analysis-info">
              <span>DAILY CALORIES</span>

              <strong>
                {calories === "--"
                  ? "--"
                  : `${calories}`}
              </strong>

              <small>
                {calories === "--"
                  ? "Enter your details"
                  : "Estimated target"}
              </small>
            </div>

          </div>

          <div className="analysis-card">

            <div className="analysis-icon">
              <Dumbbell size={18} />
            </div>

            <div className="analysis-info">
              <span>DAILY PROTEIN</span>

              <strong>
                {protein === "--"
                  ? "--"
                  : `${protein}g`}
              </strong>

              <small>
                {protein === "--"
                  ? "Based on body weight"
                  : "Muscle support target"}
              </small>
            </div>

          </div>

          <div className="side-note">
            <Sparkles size={15} />
            <span>
              AI calculations update as you complete
              your profile.
            </span>
          </div>

        </aside>

        {/* ===================================================
            CENTER — PROFILE FORM
            =================================================== */}

        <div className="profile-card">

          <div className="profile-glow" />

          <div className="profile-content">

            {/* HEADER */}

            <div className="profile-header">

              <div className="profile-label">
                <span className="profile-dot" />
                YOUR PROFILE
              </div>

              <h1>
                Tell us about
                <br />
                <span>you.</span>
              </h1>

              <p>
                Help BodyIQ personalize your fitness journey.
              </p>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* AGE */}

              <div className="profile-field">

                <label htmlFor="age">
                  Age
                </label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="13"
                  max="100"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* GENDER */}

              <div className="profile-field">

                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* HEIGHT */}

              <div className="profile-field">

                <label htmlFor="height_cm">
                  Height (cm)
                </label>

                <input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="e.g. 188"
                  value={formData.height_cm}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* WEIGHT */}

              <div className="profile-field">

                <label htmlFor="weight_kg">
                  Weight (kg)
                </label>

                <input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  placeholder="e.g. 78"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* GOAL */}

              <div className="profile-field">

                <label htmlFor="goal">
                  Fitness goal
                </label>

                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select your goal
                  </option>

                  <option value="Muscle Gain">
                    Muscle Gain
                  </option>

                  <option value="Weight Loss">
                    Weight Loss
                  </option>

                  <option value="Fat Loss">
                    Fat Loss
                  </option>

                  <option value="Maintain Weight">
                    Maintain Weight
                  </option>

                  <option value="Improve Fitness">
                    Improve Fitness
                  </option>
                </select>

              </div>

              {/* ACTIVITY */}

              <div className="profile-field">

                <label htmlFor="activity_level">
                  Activity level
                </label>

                <select
                  id="activity_level"
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select activity level
                  </option>

                  <option value="Sedentary">
                    Sedentary
                  </option>

                  <option value="Light">
                    Light
                  </option>

                  <option value="Moderate">
                    Moderate
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Very Active">
                    Very Active
                  </option>
                </select>

              </div>

              {/* FITNESS LEVEL */}

              <div className="profile-field">

                <label htmlFor="fitness_level">
                  Fitness level
                </label>

                <select
                  id="fitness_level"
                  name="fitness_level"
                  value={formData.fitness_level}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select fitness level
                  </option>

                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>

              </div>

              {/* DIET */}

              <div className="profile-field">

                <label htmlFor="diet_type">
                  Diet type
                </label>

                <select
                  id="diet_type"
                  name="diet_type"
                  value={formData.diet_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select diet type
                  </option>

                  <option value="Veg">
                    Vegetarian
                  </option>

                  <option value="Non-Veg">
                    Non-Vegetarian
                  </option>

                  <option value="Vegan">
                    Vegan
                  </option>
                </select>

              </div>

              {/* ERROR */}

              {error && (
                <div className="profile-error">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="profile-submit"
              >
                <span>
                  Complete Profile
                </span>

                <ArrowRight size={19} />
              </button>

            </form>

            <div className="profile-footer">
              BodyIQ will use this information to personalize
              your workouts, nutrition and progress.
            </div>

          </div>

        </div>

        {/* ===================================================
            RIGHT — BODYIQ JOURNEY
            =================================================== */}

        <aside className="profile-side right-side">

          <div className="side-label">
            <span className="side-dot pink" />
            YOUR BODYIQ JOURNEY
          </div>

          <h2>
            Your plan.
            <br />
            <span>Starts here.</span>
          </h2>

          <p className="side-description">
            Complete your profile and BodyIQ will build
            your personalized fitness experience.
          </p>

          <div className="journey-list">

            <div className="journey-item active">

              <div className="journey-number">
                01
              </div>

              <div>
                <strong>
                  Body Analysis
                </strong>

                <small>
                  Understand your body
                </small>
              </div>

            </div>

            <div className="journey-connector" />

            <div className="journey-item">

              <div className="journey-number">
                02
              </div>

              <div>
                <strong>
                  Smart Workout
                </strong>

                <small>
                  Personalized training
                </small>
              </div>

            </div>

            <div className="journey-connector" />

            <div className="journey-item">

              <div className="journey-number">
                03
              </div>

              <div>
                <strong>
                  AI Nutrition
                </strong>

                <small>
                  Fuel your progress
                </small>
              </div>

            </div>

            <div className="journey-connector" />

            <div className="journey-item">

              <div className="journey-number">
                04
              </div>

              <div>
                <strong>
                  Track Progress
                </strong>

                <small>
                  Improve every day
                </small>
              </div>

            </div>

          </div>

          <div className="journey-tip">

            <Target size={17} />

            <div>
              <strong>
                Your goal matters.
              </strong>

              <span>
                BodyIQ adapts your recommendations
                around what you want to achieve.
              </span>
            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default Profile;