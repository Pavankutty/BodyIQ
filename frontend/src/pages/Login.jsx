import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";

import {

  ArrowRight,

  Dumbbell,

  Eye,

  EyeOff,

  Flame,

  Play,

  Target,

  Users,

  Utensils,

} from "lucide-react";



function Login() {

  const navigate = useNavigate();



  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const [formData, setFormData] = useState({

    email: "",

    password: "",

  });



  const handleChange = (event) => {

    setFormData({

      ...formData,

      [event.target.name]: event.target.value,

    });

  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      await loginUser({
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="bodyiq-login">

      {/* Cinematic background */}

      <div className="hero-image" />

      <div className="hero-overlay" />

      <div className="hero-gradient" />



      {/* ================= NAVBAR ================= */}



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

          <a className="active" href="#home">Home</a>



          <a href="#features">Features</a>

          <a href="#how-it-works">How it works</a>

          <a href="#pricing">Pricing</a>

          <a href="#about">About</a>

        </div>

      </nav>



      {/* ================= MAIN ================= */}



      <section className="hero-content" id="home">

        {/* LEFT CONTENT */}



        <div className="hero-copy">

          <div className="ai-label">

            <span className="ai-dot" />

            AI-POWERED FITNESS

          </div>



          <h1>

            Train

            <br />

            Smarter.

            <br />

            <span className="gradient-text">Become Stronger.</span>

          </h1>



          <p className="hero-description">

            Your personalized fitness companion that understands your body,

            your goals, and your journey.

          </p>



          <button className="watch-button" type="button" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>

            <span className="play-icon">

              <Play size={16} fill="currentColor" />

            </span>



            <span>Watch how it works</span>

          </button>



          {/* Stats */}



          <div className="hero-stats">

            <div className="hero-stat">

              <Users size={20} />



              <div>

                <strong>10K+</strong>

                <span>Active Users</span>

              </div>

            </div>



            <div className="stat-divider" />



            <div className="hero-stat">

              <Target size={20} />



              <div>

                <strong>4.8</strong>

                <span>User Rating</span>

              </div>

            </div>



            <div className="stat-divider" />



            <div className="hero-stat">

              <Dumbbell size={20} />



              <div>

                <strong>100%</strong>

                <span>Personalized</span>

              </div>

            </div>

          </div>

        </div>



        {/* ================= FLOATING DATA ================= */}



        <div className="floating-data">

          {/* Calories */}



          <div className="floating-card calories-card">

            <div className="card-icon blue">

              <Flame size={18} />

            </div>



            <div className="card-content">

              <span>Today's Calories</span>

              <strong>2,450 kcal</strong>



              <div className="progress-line">

                <span style={{ width: "78%" }} />

              </div>

            </div>



            <small>78%</small>

          </div>



          {/* Weekly progress */}



          <div className="floating-card weekly-card">

            <div className="mini-card-header">

              <span>Weekly Progress</span>

              <strong>↗ 12%</strong>

            </div>



            <div className="weekly-bars">

              <i style={{ height: "28%" }} />

              <i style={{ height: "42%" }} />

              <i style={{ height: "58%" }} />

              <i style={{ height: "72%" }} />

              <i style={{ height: "88%" }} />

              <i style={{ height: "42%" }} />

              <i style={{ height: "24%" }} />

            </div>



            <div className="days">

              <span>Mon</span>

              <span>Tue</span>

              <span>Wed</span>

              <span>Thu</span>

              <span>Fri</span>

              <span>Sat</span>

              <span>Sun</span>

            </div>

          </div>



          {/* Workout streak */}



          <div className="floating-card streak-card">

            <div className="card-icon pink">

              <Dumbbell size={17} />

            </div>



            <div>

              <span>Workout Streak</span>

              <strong>12 Days</strong>

            </div>



            <div className="streak-dots">

              <i />

              <i />

              <i />

              <i />

              <i />

              <i />

              <i />

            </div>

          </div>



          {/* Protein */}



          <div className="floating-card protein-card">

            <div className="card-icon cyan">

              <Utensils size={17} />

            </div>



            <div className="card-content">

              <span>Protein Intake</span>



              <strong>

                108 <small>/ 140 g</small>

              </strong>



              <div className="progress-line">

                <span style={{ width: "77%" }} />

              </div>

            </div>



            <small>77%</small>

          </div>

        </div>



        {/* ================= LOGIN ================= */}



        <div className="login-panel">

          <div className="panel-glow" />



          <div className="login-panel-content">

            <div className="welcome-label">WELCOME BACK</div>



            <h2>

              Ready to <span>train?</span>

            </h2>



            <p className="login-subtitle">

              Sign in to continue your fitness journey.

            </p>



            <form onSubmit={handleSubmit}>

              <div className="field">

                <label htmlFor="email">Email address</label>



                <input

                  id="email"

                  name="email"

                  type="email"

                  placeholder="you\@example.com"

                  value={formData.email}

                  onChange={handleChange}

                  required

                />

              </div>



              <div className="field">

                <div className="field-label-row">

                  <label htmlFor="password">Password</label>



                  <button

                    type="button"

                    className="forgot-link"

                    onClick={() =>

                      alert("Password reset coming soon.")

                    }

                  >

                    Forgot password?

                  </button>

                </div>



                <div className="password-input">

                  <input

                    id="password"

                    name="password"

                    type={showPassword ? "text" : "password"}

                    placeholder="Enter your password"

                    value={formData.password}

                    onChange={handleChange}

                    required

                  />



                  <button

                    type="button"

                    onClick={() => setShowPassword(!showPassword)}

                    className="eye-button"

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



              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="sign-in-button"
                disabled={loading}
              >
                <span>{loading ? "Signing in..." : "Sign in"}</span>
                {!loading && <ArrowRight size={19} />}
              </button>

            </form>



            <div className="or-divider">

              <span />

              <small>OR</small>

              <span />

            </div>



            <div className="social-buttons">

              <button type="button" disabled aria-disabled="true" title="Google sign-in is not connected yet">

                <span className="google-icon">G</span>

                Google sign-in coming soon

              </button>



              <button type="button" disabled aria-disabled="true" title="Apple sign-in is not connected yet">

                <span className="apple-icon">●</span>

                Apple sign-in coming soon

              </button>

            </div>



            <div className="register-line">

              <span>Don't have a BodyIQ account?</span>



              <Link to="/register">

                Create account

                <ArrowRight size={15} />

              </Link>

            </div>

          </div>

        </div>

      </section>




      {/* ================= BODYIQ FEATURES ================= */}
      <section id="features" className="bodyiq-info-section">
        <div className="bodyiq-section-inner">
          <p className="bodyiq-section-kicker">BUILT AROUND YOUR GOALS</p>
          <h2>Everything you need to <span>level up.</span></h2>
          <p className="bodyiq-section-intro">
            One intelligent fitness space to plan your training, understand your nutrition,
            and stay consistent with your goals.
          </p>
          <div className="bodyiq-feature-grid">
            <article className="bodyiq-info-card">
              <div className="bodyiq-info-icon"><Dumbbell size={22} /></div>
              <h3>Personalized workouts</h3>
              <p>Follow workout plans shaped around your fitness goal, experience level, and training schedule.</p>
            </article>
            <article className="bodyiq-info-card">
              <div className="bodyiq-info-icon"><Utensils size={22} /></div>
              <h3>Smart nutrition</h3>
              <p>Understand your daily calorie and protein targets and organize meals around your diet preference.</p>
            </article>
            <article className="bodyiq-info-card">
              <div className="bodyiq-info-icon"><Flame size={22} /></div>
              <h3>AI fitness coach</h3>
              <p>Ask questions about workouts, food, recovery, and your fitness journey with the BodyIQ AI Coach.</p>
            </article>
            <article className="bodyiq-info-card">
              <div className="bodyiq-info-icon"><Target size={22} /></div>
              <h3>Progress tracking</h3>
              <p>Record your activity and workout sessions to see your consistency and progress over time.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ================= HOW BODYIQ WORKS ================= */}
      <section id="how-it-works" className="bodyiq-info-section bodyiq-section-alt">
        <div className="bodyiq-section-inner">
          <p className="bodyiq-section-kicker">YOUR JOURNEY, SIMPLIFIED</p>
          <h2>Four steps. <span>One stronger you.</span></h2>
          <p className="bodyiq-section-intro">Start with your details, get a plan, take action, and keep improving.</p>
          <div className="bodyiq-steps-grid">
            <article className="bodyiq-step-card"><span className="bodyiq-step-number">01</span><h3>Create your account</h3><p>Sign up and add your basic fitness profile.</p></article>
            <article className="bodyiq-step-card"><span className="bodyiq-step-number">02</span><h3>Set your goal</h3><p>Choose your goal, activity level, and food preference.</p></article>
            <article className="bodyiq-step-card"><span className="bodyiq-step-number">03</span><h3>Follow your plan</h3><p>Use your workout guidance, nutrition targets, and AI coach.</p></article>
            <article className="bodyiq-step-card"><span className="bodyiq-step-number">04</span><h3>Track your progress</h3><p>Log your sessions and daily activity as you build consistency.</p></article>
          </div>
          <Link to="/register" className="bodyiq-section-cta">Get started <ArrowRight size={17} /></Link>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="bodyiq-info-section">
        <div className="bodyiq-section-inner">
          <p className="bodyiq-section-kicker">SIMPLE ACCESS</p>
          <h2>Choose your <span>fitness journey.</span></h2>
          <p className="bodyiq-section-intro">Start with the core BodyIQ experience. Additional Pro features are being prepared.</p>
          <div className="bodyiq-pricing-grid">
            <article className="bodyiq-price-card">
              <p className="bodyiq-price-label">STARTER</p><h3>Free</h3>
              <p className="bodyiq-price-description">The essentials to begin building healthy habits.</p>
              <ul><li>Personal fitness profile</li><li>Workout plan access</li><li>Daily fitness metrics</li><li>Workout and activity tracking</li></ul>
              <Link to="/register" className="bodyiq-price-button">Create free account <ArrowRight size={16} /></Link>
            </article>
            <article className="bodyiq-price-card bodyiq-price-card-pro">
              <p className="bodyiq-price-label">COMING SOON</p><h3>BodyIQ Pro</h3>
              <p className="bodyiq-price-description">A planned premium experience for deeper nutrition support.</p>
              <ul><li>Enhanced diet management</li><li>Vegetarian and non-vegetarian meal guidance</li><li>More personalized planning</li><li>Premium features as they launch</li></ul>
              <button type="button" className="bodyiq-price-button bodyiq-price-button-disabled" disabled>Pro access coming soon</button>
            </article>
          </div>
          <p className="bodyiq-pricing-note">No payment is collected on this page. Pro subscriptions are not enabled yet.</p>
        </div>
      </section>

      {/* ================= ABOUT BODYIQ ================= */}
      <section id="about" className="bodyiq-info-section bodyiq-section-alt">
        <div className="bodyiq-section-inner bodyiq-about-content">
          <p className="bodyiq-section-kicker">WHY BODYIQ</p>
          <h2>Fitness should feel <span>personal.</span></h2>
          <p className="bodyiq-section-intro">
            BodyIQ brings fitness guidance, workout tracking, nutrition targets, and AI assistance
            together in one place. Our goal is to make it easier to understand your body, stay
            accountable, and make steady progress—one day at a time.
          </p>
          <Link to="/register" className="bodyiq-section-cta">Start your journey <ArrowRight size={17} /></Link>
        </div>
      </section>

      <footer className="bodyiq-footer">
        <Link to="/login" className="bodyiq-footer-brand">Body<span>IQ</span></Link>
        <p>Train smarter. Become stronger.</p>
        <span>© {new Date().getFullYear()} BodyIQ. All rights reserved.</span>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        .bodyiq-info-section { position: relative; z-index: 2; padding: 88px 6vw; color: #eef7fb; background: rgba(3,12,19,.96); scroll-margin-top: 86px; border-top: 1px solid rgba(85,217,255,.10); }
        .bodyiq-section-alt { background: rgba(7,18,28,.98); }
        .bodyiq-section-inner { width: min(1120px,100%); margin: 0 auto; }
        .bodyiq-section-kicker { margin: 0 0 12px; color: #55d9f5; font-size: 11px; font-weight: 800; letter-spacing: 2.4px; }
        .bodyiq-section-inner h2 { margin: 0; color: #f4f8fb; font-size: clamp(30px,4vw,46px); line-height: 1.12; letter-spacing: -1.5px; }
        .bodyiq-section-inner h2 span { background: linear-gradient(90deg,#55d9ff,#e8a5d4); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .bodyiq-section-intro { max-width: 660px; margin: 16px 0 34px; color: #9eafb9; font-size: 15px; line-height: 1.8; }
        .bodyiq-feature-grid,.bodyiq-steps-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 16px; }
        .bodyiq-info-card,.bodyiq-step-card,.bodyiq-price-card { padding: 24px; border-radius: 18px; background: linear-gradient(145deg,rgba(15,35,48,.92),rgba(5,17,26,.96)); border: 1px solid rgba(120,194,220,.15); box-shadow: 0 14px 35px rgba(0,0,0,.16); }
        .bodyiq-info-icon { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 13px; color: #55d9f5; background: rgba(85,217,245,.10); border: 1px solid rgba(85,217,245,.2); }
        .bodyiq-info-card h3,.bodyiq-step-card h3 { margin: 18px 0 9px; color: #f2f7fa; font-size: 17px; }
        .bodyiq-info-card p,.bodyiq-step-card p,.bodyiq-price-description { margin: 0; color: #9eafb9; font-size: 13px; line-height: 1.75; }
        .bodyiq-step-number { color: #55d9f5; font-size: 13px; font-weight: 800; letter-spacing: 1px; }
        .bodyiq-section-cta,.bodyiq-price-button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; margin-top: 28px; padding: 12px 18px; border-radius: 11px; color: #06131b; background: linear-gradient(90deg,#55d9f5,#a5d7f7); text-decoration: none; font-size: 13px; font-weight: 800; border: 0; cursor: pointer; }
        .bodyiq-pricing-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; max-width: 800px; }
        .bodyiq-price-card { padding: 30px; }
        .bodyiq-price-card-pro { border-color: rgba(226,155,211,.35); }
        .bodyiq-price-label { margin: 0 0 10px; color: #55d9f5; font-size: 11px; font-weight: 800; letter-spacing: 1.8px; }
        .bodyiq-price-card h3 { margin: 0 0 10px; font-size: 28px; color: #f4f8fb; }
        .bodyiq-price-card ul { padding-left: 19px; color: #c1cdd4; font-size: 13px; line-height: 2.1; }
        .bodyiq-price-button { width: 100%; box-sizing: border-box; }
        .bodyiq-price-button-disabled { color: #9eafb9; background: rgba(255,255,255,.08); cursor: not-allowed; }
        .bodyiq-pricing-note { margin: 18px 0 0; color: #7f929e; font-size: 12px; }
        .bodyiq-about-content { max-width: 820px; }
        .bodyiq-footer { position: relative; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding: 25px 6vw; color: #81939e; background: #030a10; border-top: 1px solid rgba(85,217,245,.12); font-size: 12px; }
        .bodyiq-footer p { margin: 0; }
        .bodyiq-footer-brand { color: #f4f8fb; font-size: 20px; font-weight: 900; text-decoration: none; }
        .bodyiq-footer-brand span { color: #55d9f5; }
        .social-buttons button:disabled { opacity: .55; cursor: not-allowed; }
        @media (max-width:900px) { .bodyiq-feature-grid,.bodyiq-steps-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
        @media (max-width:600px) { .bodyiq-info-section { padding: 64px 5vw; } .bodyiq-feature-grid,.bodyiq-steps-grid,.bodyiq-pricing-grid { grid-template-columns: 1fr; } .bodyiq-footer { flex-direction: column; align-items: flex-start; } }
      `}</style>

            <div className="bottom-fade" />

    </main>

  );

}



export default Login;