# 💪 BodyIQ – AI-Powered Fitness & Wellness Platform

**Your Personal AI Fitness Coach – Train Smarter, Eat Better, Live Healthier.**

BodyIQ is an AI-powered fitness and wellness platform designed to help users achieve their fitness goals through personalized workout recommendations, nutrition planning, progress tracking, and an intelligent AI fitness coach.

The platform combines modern web technologies with AI capabilities to provide a personalized fitness experience based on individual body metrics, fitness goals, activity levels, and dietary preferences.

---

## 🚀 Key Features

### 🤖 AI Fitness Coach
- Intelligent fitness chatbot powered by Google Gemini AI.
- Provides personalized fitness guidance and recommendations.
- Answers questions related to workouts, nutrition, recovery, and fitness goals.

### 🏋️ Personalized Workout Management
- Personalized workout plans based on fitness goals.
- Daily workout recommendations.
- Workout intensity selection.
- Exercise and set tracking.
- Workout completion monitoring.
- Workout history management.

### 🥗 Nutrition & Diet Management
- Personalized daily calorie targets.
- Protein, carbohydrate, and fat recommendations.
- Vegetarian and non-vegetarian diet preferences.
- Goal-based meal recommendations.
- Nutrition planning for different fitness objectives.

### 📊 Fitness Progress Tracking
- Daily weight tracking.
- Step count monitoring.
- Calories consumed and burned tracking.
- Workout completion records.
- Weight progress visualization.
- Historical fitness records.

### 🔐 User Authentication
- User registration and login.
- Secure password hashing.
- Token-based authentication.
- Personalized user profiles.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Database Migration | Alembic |
| AI Integration | Google Gemini API |
| Authentication | JWT, Password Hashing |
| Development Tools | VS Code, Git, GitHub |

---

## 🏗️ Project Architecture

BodyIQ follows a frontend-backend architecture.

```text
BodyIQ/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── calculations/
│   │   ├── core/
│   │   ├── database/
│   │   ├── fitness/
│   │   ├── models/
│   │   ├── nutrition/
│   │   ├── schemas/
│   │   └── workouts/
│   │
│   ├── migrations/
│   ├── requirements.txt
│   ├── alembic.ini
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Python
- Node.js and npm
- PostgreSQL
- Git
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Pavankutty/BodyIQ.git
cd BodyIQ
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend directory using `.env.example` as a reference.

Configure your PostgreSQL database connection, JWT settings, and Google Gemini API credentials according to the backend configuration.

**Important:** Never upload your actual `.env` file or API keys to GitHub.

### 4. Database Migration

Run the database migrations:

```bash
python -m alembic upgrade head
```

### 5. Start the Backend Server

```bash
uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 6. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

---

## 🔗 Main API Modules

| Module | Endpoint | Method |
|---|---|---|
| Authentication | `/auth/register` | POST |
| Authentication | `/auth/login` | POST |
| User Profile | `/auth/me` | GET |
| Fitness Metrics | `/fitness/metrics` | GET |
| Workout Plan | `/fitness/workout` | GET |
| Nutrition | `/fitness/nutrition` | GET |
| Diet Plan | `/fitness/diet` | GET |
| AI Coach | `/ai/chat` | POST |
| Progress Tracking | `/progress` | GET |
| Latest Progress | `/progress/latest` | GET |
| Workout Tracking | `/workouts/start` | POST |
| Workout History | `/workouts/history` | GET |

For the complete API specification, run the backend and visit `/docs`.

---

## 🎯 Project Objectives

- Make personalized fitness guidance more accessible.
- Help users maintain consistent workout routines.
- Support informed nutrition and diet planning.
- Monitor fitness progress through daily records.
- Use AI to provide interactive fitness assistance.
- Build an integrated platform for fitness and wellness management.

---

## 🔮 Future Enhancements

- Wearable device and fitness tracker integration.
- Real-time step counting.
- Advanced fitness analytics and reports.
- AI-powered food recognition.
- Personalized fitness recommendations using historical progress.
- Subscription-based premium fitness features.
- Mobile application integration.

---

## 👨‍💻 Developer

**Pavan Kutty**

Artificial Intelligence & Data Science

Sri Dharmasthala Manjunatheshwara Institute of Technology

GitHub: [@Pavankutty](https://github.com/Pavankutty)

Project Repository: [BodyIQ](https://github.com/Pavankutty/BodyIQ)

---

## ⭐ Support

If you find this project interesting, consider giving the repository a star!

**BodyIQ – Your Fitness Journey, Powered by Intelligence.** 💙
