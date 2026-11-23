import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Utensils,
  RefreshCw,
  Salad,
} from "lucide-react";
import { getCurrentUser, getNutrition, getDiet, logoutUser } from "../services/api";

const number = (value, digits = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed.toLocaleString("en-IN", { maximumFractionDigits: digits })
    : "—";
};

function Nutrition() {
  const [user, setUser] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNutrition = async () => {
    setLoading(true);
    setError("");
    try {
      const [userResult, nutritionResult, dietResult] = await Promise.all([
        getCurrentUser().catch(() => null),
        getNutrition(),
        getDiet(),
      ]);

      setUser(userResult?.user ?? userResult?.profile ?? userResult ?? null);
      setNutrition(nutritionResult?.nutrition ?? nutritionResult?.data ?? nutritionResult);
      setDiet(dietResult?.diet ?? dietResult?.data ?? dietResult);
    } catch (err) {
      setError(err.message || "Unable to load your nutrition plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  const calorieTarget = nutrition?.calorie_target ?? diet?.calorie_target;
  const proteinTarget = nutrition?.protein_g ?? diet?.protein_target_g;
  const carbsTarget = nutrition?.carbohydrates_g;
  const fatTarget = nutrition?.fat_g;
  const meals = Array.isArray(diet?.meals) ? diet.meals : [];

  const handleLogout = () => {
    logoutUser();
    window.location.replace("/login");
  };

  return (
    <main className="dashboard-page" style={{ minHeight: "100vh", color: "#eef7fb" }}>
      <div className="dashboard-background" />
      <div className="dashboard-overlay" />

      <style>{`
        .nutrition-page-content {
          position: relative;
          z-index: 2;
          width: min(1180px, 92%);
          margin: 0 auto;
          padding: 38px 0 64px;
        }
        .nutrition-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          flex-wrap: wrap;
          margin: 28px 0;
        }
        .nutrition-eyebrow {
          color: #55d9f5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }
        .nutrition-heading h1 {
          margin: 8px 0;
          color: #f4f8fb;
          font-size: clamp(30px, 4vw, 42px);
        }
        .nutrition-heading p {
          color: #9aabb7;
          margin: 0;
          line-height: 1.6;
        }
        .nutrition-target-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }
        .nutrition-target-card, .nutrition-meal-card, .nutrition-plan-summary {
          background: rgba(11, 25, 39, .82);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 18px;
          box-shadow: 0 14px 36px rgba(0,0,0,.16);
        }
        .nutrition-target-card { padding: 20px; }
        .nutrition-target-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(85,217,245,.12);
          color: #55d9f5;
          margin-bottom: 16px;
        }
        .nutrition-target-card strong {
          display: block;
          font-size: clamp(23px, 2.5vw, 30px);
          color: #f4f8fb;
          margin-bottom: 5px;
        }
        .nutrition-target-card span { color: #9aabb7; font-size: 12px; }
        .nutrition-plan-summary {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .nutrition-plan-summary h2 { margin: 5px 0; font-size: 20px; }
        .nutrition-plan-summary p { margin: 0; color: #9aabb7; font-size: 13px; }
        .nutrition-diet-pill {
          border: 1px solid rgba(101,230,165,.35);
          background: rgba(101,230,165,.10);
          color: #83efb7;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 12px;
          font-weight: 700;
        }
        .nutrition-section-title {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 12px;
          flex-wrap: wrap;
          margin: 30px 0 16px;
        }
        .nutrition-section-title h2 { margin: 5px 0 0; font-size: 24px; }
        .nutrition-section-title p { margin: 0; color: #9aabb7; font-size: 13px; }
        .nutrition-meals-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }
        .nutrition-meal-card { padding: 20px; }
        .nutrition-meal-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }
        .nutrition-meal-number {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 12px;
          color: #55d9f5;
          background: rgba(85,217,245,.12);
          font-weight: 800;
          font-size: 13px;
        }
        .nutrition-meal-top h3 { margin: 0; font-size: 17px; }
        .nutrition-meal-card ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }
        .nutrition-meal-card li {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #c7d5df;
          font-size: 14px;
        }
        .nutrition-meal-card li::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #65e6a5;
          flex: 0 0 6px;
        }
        .nutrition-note {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 12px;
          color: #aebfca;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.08);
          font-size: 12px;
          line-height: 1.6;
        }
        .nutrition-action {
          border: 1px solid rgba(85,217,245,.28);
          background: rgba(85,217,245,.10);
          color: #8ceaff;
          border-radius: 10px;
          padding: 9px 13px;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .nutrition-error {
          padding: 14px 16px;
          color: #ffb4c7;
          background: rgba(255,80,100,.09);
          border: 1px solid rgba(255,113,133,.25);
          border-radius: 12px;
        }
        @media (max-width: 850px) {
          .nutrition-target-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 600px) {
          .nutrition-meals-grid { grid-template-columns: 1fr; }
          .nutrition-page-content { padding-top: 24px; }
        }
      `}</style>

      <nav className="dashboard-nav">
        <Link to="/dashboard" className="dashboard-logo">
          <img src="/bodyiq-icon.png" alt="BodyIQ" className="dashboard-logo-image" />
          <span className="dashboard-logo-text">Body<span>IQ</span></span>
        </Link>

        <div className="dashboard-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/workout">Workout</Link>
          <Link to="/nutrition" className="active">Nutrition</Link>
          <Link to="/progress">Progress</Link>
        </div>

        <div className="dashboard-nav-actions">
          <span className="user-info" style={{ color: "#eef7fb" }}>
            {user?.name || "BodyIQ Member"}
          </span>
          <button type="button" className="dashboard-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="nutrition-page-content">
        <Link to="/dashboard" className="nutrition-action">
          <ArrowLeft size={15} /> Back to dashboard
        </Link>

        <div className="nutrition-heading">
          <div>
            <div className="nutrition-eyebrow">BODYIQ NUTRITION</div>
            <h1>Your nutrition plan</h1>
            <p>Daily targets and meal guidance based on your current fitness profile.</p>
          </div>
          <button type="button" className="nutrition-action" onClick={loadNutrition} disabled={loading}>
            <RefreshCw size={15} /> {loading ? "Refreshing..." : "Refresh plan"}
          </button>
        </div>

        {error && <div className="nutrition-error" role="alert">{error}</div>}

        {loading ? (
          <p role="status" style={{ color: "#9aabb7" }}>Loading your nutrition plan...</p>
        ) : (
          <>
            <div className="nutrition-target-grid">
              <article className="nutrition-target-card">
                <div className="nutrition-target-icon"><Flame size={19} /></div>
                <strong>{number(calorieTarget, 1)}</strong>
                <span>Daily calories · kcal</span>
              </article>
              <article className="nutrition-target-card">
                <div className="nutrition-target-icon"><Beef size={19} /></div>
                <strong>{number(proteinTarget, 1)} g</strong>
                <span>Protein target</span>
              </article>
              <article className="nutrition-target-card">
                <div className="nutrition-target-icon"><Wheat size={19} /></div>
                <strong>{number(carbsTarget, 1)} g</strong>
                <span>Carbohydrate target</span>
              </article>
              <article className="nutrition-target-card">
                <div className="nutrition-target-icon"><Droplets size={19} /></div>
                <strong>{number(fatTarget, 1)} g</strong>
                <span>Fat target</span>
              </article>
            </div>

            <div className="nutrition-plan-summary">
              <div>
                <div className="nutrition-eyebrow">YOUR CURRENT PLAN</div>
                <h2>{diet?.goal || user?.goal || "Personalized fitness"}</h2>
                <p>Meal recommendations generated from your BodyIQ diet profile.</p>
              </div>
              <span className="nutrition-diet-pill">
                <Salad size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                {diet?.diet_type || user?.diet_type || "Diet preference not set"}
              </span>
            </div>

            <div className="nutrition-section-title">
              <div>
                <div className="nutrition-eyebrow">DAILY MEAL SCHEDULE</div>
                <h2><Utensils size={20} style={{ verticalAlign: "middle", marginRight: 8, color: "#55d9f5" }} />Your five meals</h2>
              </div>
              <p>{meals.length} meals in your current plan</p>
            </div>

            {meals.length ? (
              <div className="nutrition-meals-grid">
                {meals.map((meal, index) => (
                  <article className="nutrition-meal-card" key={`${meal.meal || "meal"}-${index}`}>
                    <div className="nutrition-meal-top">
                      <span className="nutrition-meal-number">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{meal.meal || `Meal ${index + 1}`}</h3>
                    </div>
                    <ul>
                      {(Array.isArray(meal.foods) ? meal.foods : []).map((food, foodIndex) => (
                        <li key={`${food}-${foodIndex}`}>{food}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <div className="nutrition-meal-card">
                Your diet API did not return meal details. Refresh or check your diet profile.
              </div>
            )}

            <p className="nutrition-note">
              These values are daily targets, not a live food diary. Your current API provides meal suggestions
              but does not provide per-meal calories, food quantities, or logged food intake yet.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default Nutrition;
