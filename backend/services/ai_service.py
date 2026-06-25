import os
import json
import re
import requests
from config import Config

GROQ_API_KEY = Config.GROQ_API_KEY
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

SYSTEM_PROMPT = (
    "You are a weather intelligence assistant. You receive weather data, a computed risk score, "
    "and risk breakdown. Based on this data, you produce a helpful explanation, gear recommendations, "
    "safety warnings, and alternative suggestions. "
    "You do NOT change the risk score or decision — those are already computed by the system. "
    "Return ONLY valid JSON with no markdown formatting, no code fences."
)


def build_prompt(activity, weather_data, risk_result, best_time, best_day):
    return f"""Based on the following data, generate a recommendation explanation.

Activity: {activity}
Risk Score: {risk_result['risk_score']}/100
Decision: {risk_result['decision']}
Risk Breakdown: {json.dumps(risk_result['breakdown'], indent=2)}
Best Time: {json.dumps(best_time) if best_time else 'Not available'}
Best Day: {json.dumps(best_day) if best_day else 'Not available'}

Weather Summary:
- Location: {weather_data.get('location', 'Unknown')}
- Current: {json.dumps(weather_data.get('current', {}), indent=2)}
- 7-Day Forecast: {json.dumps(weather_data.get('daily', [])[:3], indent=2)}
- Air Quality: {json.dumps(weather_data.get('aqi'), indent=2) if weather_data.get('aqi') else 'Not available'}

Respond with this exact JSON structure (no markdown, no code blocks):
{{
    "explanation": "2-3 sentence explanation grounded in the real weather data above",
    "recommended_gear": ["item1", "item2", "item3"],
    "safety_warnings": ["warning1", "warning2"],
    "alternative_suggestions": [{{"activity": "Alternative activity", "reason": "Brief reason"}}]
}}
"""


def validate_ai_response(data):
    required_keys = {'explanation', 'recommended_gear', 'safety_warnings', 'alternative_suggestions'}
    if not isinstance(data, dict):
        return False
    if not required_keys.issubset(data.keys()):
        return False
    if not isinstance(data.get('explanation'), str) or len(data['explanation']) < 10:
        return False
    if not isinstance(data.get('recommended_gear'), list):
        return False
    if not isinstance(data.get('safety_warnings'), list):
        return False
    if not isinstance(data.get('alternative_suggestions'), list):
        return False
    for alt in data['alternative_suggestions']:
        if not isinstance(alt, dict) or 'activity' not in alt or 'reason' not in alt:
            return False
    return True


_DEFAULT_EXPLANATION = "Conditions have been analyzed based on current weather data."

_DEFAULT_GEAR = []

_DEFAULT_WARNINGS = []

_DEFAULT_ALTERNATIVES = []


def _fallback_response():
    return {
        'explanation': _DEFAULT_EXPLANATION,
        'recommended_gear': _DEFAULT_GEAR,
        'safety_warnings': _DEFAULT_WARNINGS,
        'alternative_suggestions': _DEFAULT_ALTERNATIVES,
    }


def analyze_weather(activity, weather_data, risk_result, best_time, best_day):
    if not GROQ_API_KEY:
        return _fallback_response()

    prompt = build_prompt(activity, weather_data, risk_result, best_time, best_day)
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json',
    }
    payload = {
        'model': Config.GROQ_MODEL,
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': prompt},
        ],
        'temperature': 0.3,
        'max_tokens': 1024,
    }

    try:
        resp = requests.post(GROQ_URL, json=payload, headers=headers, timeout=Config.REQUEST_TIMEOUT)
        resp.raise_for_status()
        content = resp.json()['choices'][0]['message']['content'].strip()

        content = re.sub(r'^```(?:json)?\s*', '', content)
        content = re.sub(r'\s*```$', '', content)

        parsed = json.loads(content)

        if validate_ai_response(parsed):
            return parsed

        return _fallback_response()
    except Exception:
        return _fallback_response()
