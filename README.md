# WeatherMind AI

WeatherMind AI is a full-stack weather intelligence application that turns live forecasts into practical recommendations for outdoor activities.

Enter a location, describe any activity, and choose whether you are planning for today or tomorrow. The application combines real-time weather data with AI analysis to provide:

- A clear recommendation: **Proceed**, **Proceed with Caution**, or **Not Recommended**
- A weather risk score from 0 to 100
- A suggested time for the activity
- A short explanation of the conditions
- Recommended clothing or equipment
- Temperature, humidity, wind, rain, and UV metrics

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React
- React Hot Toast

### Backend

- Python
- Flask
- Flask-CORS
- Open-Meteo Geocoding and Forecast APIs
- Groq API with Llama 3.3

## Project Structure

```text
Weather/
├── backend/
│   ├── routes/
│   │   └── weather.py
│   ├── services/
│   │   ├── ai_service.py
│   │   └── weather_service.py
│   ├── .env.example
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

Install the following before running the project:

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
```

Start the Flask server:

```bash
python app.py
```

The backend will run at:

```text
http://localhost:5001
```

On Windows, activate the virtual environment with:

```powershell
venv\Scripts\activate
```

### 3. Configure and run the frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

The frontend environment file should contain:

```env
VITE_API_URL=http://localhost:5001
```

## How It Works

1. The user enters a location and activity.
2. The frontend sends the request to `POST /api/analyze`.
3. The backend uses Open-Meteo to resolve the location and retrieve weather data.
4. The weather data and activity are sent to the Groq language model.
5. The model returns a decision, risk score, suggested time, explanation, and gear list.
6. The frontend presents the result in an animated dashboard.

## API Reference

### Analyze weather for an activity

```http
POST /api/analyze
Content-Type: application/json
```

Example request:

```json
{
  "location": "Mumbai",
  "activity": "Outdoor photography",
  "date": "Today"
}
```

`date` must be either `Today` or `Tomorrow`. The activity can be any description up to 80 characters.

Example response:

```json
{
  "decision": "Proceed with Caution",
  "risk_score": 42,
  "best_time": "6 AM - 8 AM",
  "analysis": "Conditions are generally suitable, but rain may develop later in the day.",
  "gear": [
    "Water bottle",
    "Light rain jacket"
  ],
  "weather": {
    "location": "Mumbai",
    "temperature": 29,
    "feels_like": 33,
    "humidity": 78,
    "wind_speed": 14.2,
    "rain_probability": 45,
    "uv_index": 6.1,
    "description": "Partly cloudy"
  }
}
```

## Available Scripts

Run these commands from the `frontend` directory:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build
```

## Production Build

Build the frontend with:

```bash
cd frontend
npm run build
```

The generated application will be placed in `frontend/dist`.

For production deployment:

- Serve the frontend build through a static host or web server.
- Run Flask behind a production WSGI server instead of its development server.
- Set `VITE_API_URL` to the deployed backend URL before building.
- Restrict CORS to trusted frontend domains.
- Keep the Groq API key only on the backend.

## Troubleshooting

### `401 Unauthorized` from Groq

Check that `GROQ_API_KEY` exists in `backend/.env` and is valid. Restart the backend after changing the file.

### Frontend cannot connect to the backend

Confirm that:

- Flask is running on port `5001`.
- `frontend/.env` contains the correct `VITE_API_URL`.
- The frontend was restarted after changing its environment variables.

### Location not found

Try entering a more specific location, such as:

```text
Pune, India
London, United Kingdom
Austin, Texas
```

## Current Limitations

- Forecast analysis currently supports only today and tomorrow.
- AI-generated recommendations can occasionally vary between requests.
- The suggested best time is generated from summarized weather data rather than a complete hourly forecast.
- The project does not yet include an automated test suite.

## Security

- Never commit `backend/.env` or expose the Groq API key in frontend code.
- Use environment variables for production secrets.
- Validate AI-generated recommendations before relying on them for safety-critical activities.

## License

This project does not currently specify a license. Add a `LICENSE` file before distributing or accepting external contributions.

