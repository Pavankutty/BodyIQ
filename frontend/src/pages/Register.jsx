import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleNext = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    navigate("/profile", {
      state: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    });
  };

  return (
    <main className="bodyiq-login">

      {/* BACKGROUND */}
      <div className="hero-image" />
      <div className="hero-overlay" />
      <div className="hero-gradient" />

      {/* NAVBAR */}
      <nav className="top-nav">

        <Link to="/login" className="bodyiq-logo">
          <img
            src="/bodyiq-icon.png"
            alt="BodyIQ"
            className="bodyiq-logo-image"
          />

          <span className="bodyiq-logo-text">
            Body<span>IQ</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/login">
            Home
          </Link>

          <a href="/login#features">
            Features
          </a>

          <a href="/login#how-it-works">
            How it works
          </a>

          <a href="/login#pricing">
            Pricing
          </a>

          <a href="/login#about">
            About
          </a>
        </div>

      </nav>

      {/* MAIN CONTENT */}
      <section className="hero-content">

        {/* LEFT SIDE */}
        <div className="hero-copy">

          <div className="ai-label">
            <span className="ai-dot" />
            AI-POWERED FITNESS
          </div>

          <h1>
            Build
            <br />
            Your
            <br />
            <span className="gradient-text">
              Best Self.
            </span>
          </h1>

          <p className="hero-description">
            Create your BodyIQ account and let AI build a
            fitness journey around your body, your goals,
            and your lifestyle.
          </p>

          <div className="hero-stats">

            <div className="hero-stat">
              <Sparkles size={20} />

              <div>
                <strong>AI</strong>
                <span>Personalized</span>
              </div>
            </div>

            <div className="stat-divider" />

            <div className="hero-stat">
              <Sparkles size={20} />

              <div>
                <strong>24/7</strong>
                <span>Guidance</span>
              </div>
            </div>

            <div className="stat-divider" />

            <div className="hero-stat">
              <Sparkles size={20} />

              <div>
                <strong>100%</strong>
                <span>Your Journey</span>
              </div>
            </div>

          </div>

        </div>

        {/* REGISTER PANEL */}
        <div className="login-panel">

          <div className="panel-glow" />

          <div className="login-panel-content">

            <div className="welcome-label">
              GET STARTED
            </div>

            <h2>
              Create your <span>account.</span>
            </h2>

            <p className="login-subtitle">
              Start your personalized fitness journey with BodyIQ.
            </p>

            <form onSubmit={handleNext}>

              {/* NAME */}
              <div className="field">

                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

              </div>

              {/* EMAIL */}
              <div className="field">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>

              {/* PASSWORD */}
              <div className="field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-input">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="field">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="password-input">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONTINUE */}
              <button
                type="submit"
                className="sign-in-button"
              >
                <span>
                  Continue
                </span>

                <ArrowRight size={19} />
              </button>

            </form>

            {/* LOGIN LINK */}
            <div className="register-line">

              <span>
                Already have a BodyIQ account?
              </span>

              <Link to="/login">
                Sign in
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE JOURNEY */}
        <div className="register-ai-journey">

          <div className="journey-label">
            <span className="ai-dot" />
            YOUR BODYIQ JOURNEY
          </div>

          <h3>
            Your body.
            <br />
            <span>
              Your plan.
            </span>
          </h3>

          <p>
            AI adapts your fitness journey as you progress.
          </p>

          {/* STEP 01 */}
          <div className="journey-card active">

            <span>01</span>

            <div>
              <strong>
                Body Analysis
              </strong>

              <small>
                Understand your body & goals
              </small>
            </div>

          </div>

          <div className="journey-line" />

          {/* STEP 02 */}
          <div className="journey-card">

            <span>02</span>

            <div>
              <strong>
                Smart Workout
              </strong>

              <small>
                Personalized training plan
              </small>
            </div>

          </div>

          <div className="journey-line" />

          {/* STEP 03 */}
          <div className="journey-card">

            <span>03</span>

            <div>
              <strong>
                AI Nutrition
              </strong>

              <small>
                Fuel your progress
              </small>
            </div>

          </div>

          <div className="journey-line" />

          {/* STEP 04 */}
          <div className="journey-card">

            <span>04</span>

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

      </section>

      <div className="bottom-fade" />

    </main>
  );
}

export default Register;