# WeatherMind AI

WeatherMind AI is a full-stack outdoor planning intelligence platform. It combines real-time weather data, air quality data, and a deterministic risk scoring engine with AI-powered explanations to provide actionable outdoor activity recommendations.

## Features

- **Hourly Forecast Analysis** — Fetches 168 hours of data (temperature, humidity, precipitation probability, rain, wind speed, gusts, UV index, weather codes) to find the best time window for any activity.
- **7-Day Multi-Day Planning** — "Best Day" mode scans 7 days to recommend the optimal day for an activity.
- **Deterministic Risk Scoring** — Activity-specific rules for Running, Cycling, Cricket, Football, Trekking, Beach Trip, Picnic, Outdoor Event, and custom activities. Risk is computed from real weather data, not AI guesswork.
- **Air Quality & Health Safety** — AQI, PM2.5, PM10, and ozone data used in risk scoring for running, cycling, and sensitive users.
- **Risk Breakdown** — Each factor's contribution (temperature, rain, wind, UV, AQI, thunderstorm) with severity labels.
- **AI-Powered Explanations** — AI generates polished explanations, gear recommendations, safety warnings, and alternative suggestions — but does NOT decide the risk score or recommendation.
- **Premium Dashboard UI** — Weather metrics, risk breakdown bar chart, best time windows, safety warnings, interactive gear checklist, alternative suggestions.
- **Typed Activity Input** — Free-form text with autocomplete suggestions; supports custom activities.

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React
- React Hot Toast

### Backend
- Python + Flask
- Open-Meteo (Forecast + Geocoding + Air Quality APIs)
- Groq API with Llama 3.3
- pytest

## Project Structure

```text
Weather/
├── backend/
│   ├── routes/
│   │   └── weather.py            # API route (POST /api/analyze)
│   ├── services/
│   │   ├── weather_service.py    # Open-Meteo forecast, geocoding, AQI, caching
│   │   ├── risk_service.py       # Deterministic risk scoring engine
│   │   ├── ai_service.py         # AI explanation generator (Groq)
│   │   └── recommendation_service.py  # Orchestrator
│   ├── utils/
│   │   ├── cache.py              # TTL cache decorator
│   │   └── validators.py         # Input validation helpers
│   ├── tests/
│   │   ├── test_validators.py
│   │   ├── test_risk_service.py
│   │   └── test_ai_service.py
│   ├── config.py                 # Central config (env vars)
│   ├── .env.example
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundEffects.jsx     # Particle canvas + atmosphere
│   │   │   ├── Hero.jsx                  # Header/branding
│   │   │   ├── InputForm.jsx             # Location/activity/date form
│   │   │   ├── LoadingAnimation.jsx      # Multi-step loading animation
│   │   │   ├── WeatherMetrics.jsx        # Weather metric cards
│   │   │   ├── DecisionCard.jsx          # Decision + risk score + explanation
│   │   │   ├── RiskBreakdownCard.jsx     # Factor-by-factor breakdown
│   │   │   ├── BestTimeCard.jsx          # Best time/day display
│   │   │   ├── SafetyWarningsCard.jsx    # Safety warnings
│   │   │   ├── GearChecklist.jsx         # Interactive gear checklist
│   │   │   ├── AlternativeSuggestions.jsx # Alternative activity cards
│   │   │   └── ResultDashboard.jsx       # Composes all result components
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer
- npm
- A [Groq API key](https://console.groq.com/keys)

Open-Meteo does not require an API key.

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Weather
```

### 2. Configure and run the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add your Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
DEBUG=true
PORT=5001
CORS_ORIGINS=*
CACHE_TTL=600
```

Start the Flask server:

```bash
python app.py
```

The backend will run at `http://localhost:5001`.

### 3. Configure and run the frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will run at `http://localhost:3000`.

## Running Tests

```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

## API Reference

### Analyze weather for an activity

```http
POST /api/analyze
Content-Type: application/json
```

**Request:**

```json
{
  "location": "Mumbai",
  "activity": "Running",
  "date": "Today"
}
```

`date` can be `"Today"`, `"Tomorrow"`, or `"Best Day"`. When `"Best Day"` is selected, the backend scans the 7-day forecast and returns the best day for the activity.

The activity is a free-form text input (2–100 characters). Common activities appear as autocomplete suggestions.

**Response:**

```json
{
  "decision": "Proceed with Caution",
  "risk_score": 42,
  "confidence_score": 85,
  "best_time": {
    "start": "2026-06-24T06:00",
    "end": "2026-06-24T08:00",
    "label": "6 AM - 8 AM",
    "risk_score": 28
  },
  "best_day": null,
  "risk_breakdown": [
    {
      "factor": "Temperature",
      "score": 10,
      "weight": 0.2,
      "contribution": 2,
      "severity": "low",
      "value": 22
    }
  ],
  "weather_summary": {
    "location": "Mumbai",
    "country": "India",
    "current": {
      "temperature": 29,
      "feels_like": 33,
      "humidity": 78,
      "wind_speed": 4.2,
      "wind_gusts": 8.0,
      "precipitation": 0,
      "uv_index": 6.1,
      "weather_code": 2,
      "description": "Partly cloudy",
      "is_thunderstorm": false
    },
    "aqi": {
      "european_aqi": 42,
      "us_aqi": 38,
      "pm2_5": 12.5,
      "pm10": 28.0,
      "ozone": 35.0
    }
  },
  "explanation": "Moderate temperatures and low wind make running comfortable, but high UV and moderate air quality suggest caution during peak sun hours.",
  "recommended_gear": ["Quick-dry shirt", "Sunblock SPF 50", "Cap", "Water bottle"],
  "safety_warnings": ["High UV index between 11 AM - 3 PM — avoid prolonged exposure", "Moderate air quality — consider a mask if sensitive"],
  "alternative_suggestions": [
    { "activity": "Indoor gym workout", "reason": "High UV and moderate AQI levels" }
  ]
}
```

## Architecture: How the Recommendation Is Built

1. **Weather Service** fetches hourly forecast, 7-day daily data, and AQI from Open-Meteo (cached for 10 minutes).
2. **Risk Service** scores each hour using activity-specific rules (temperature comfort, rain, wind, gusts, UV, AQI, thunderstorms). Scores are deterministic — same input always produces the same output. Finds the best 2-hour time window.
3. **AI Service** receives the computed risk score, breakdown, weather summary, and best time. It generates only the explanation, gear list, safety warnings, and alternatives — it does NOT alter the risk score or decision.
4. **Recommendation Service** orchestrates the above three services and assembles the final response.

## Production Build

```bash
cd frontend
npm run build      # Outputs to frontend/dist
```

For production:
- Serve the frontend build through a static host or web server.
- Run Flask behind a production WSGI server (e.g., gunicorn).
- Set `VITE_API_URL` to the deployed backend URL before building.
- Set `CORS_ORIGINS` to the comma-separated frontend domain(s).
- Set `DEBUG=false` and use a proper WSGI server.
- Keep the Groq API key only on the backend — never expose it in frontend code.

## Security

- `backend/.env` is gitignored — never commit secrets.
- In production, restrict `CORS_ORIGINS` to your frontend domain.
- Validation is performed on both frontend and backend.
- AI response validation ensures malformed LLM output is caught with safe fallbacks.
