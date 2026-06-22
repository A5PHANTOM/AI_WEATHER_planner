import os
import json
import requests

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

SYSTEM_PROMPT = (
    "You are an expert weather intelligence agent. "
    "Analyze the weather data and activity to produce a decision. "
    "Return ONLY valid JSON with no markdown formatting, no code fences."
)

def build_prompt(activity, weather_data):
    return f"""Analyze this weather for the activity: {activity}

Weather Data:
{json.dumps(weather_data, indent=2)}

Respond with this exact JSON structure (no markdown, no code blocks):
{{
    "decision": "Proceed" or "Proceed with Caution" or "Not Recommended",
    "risk_score": 0-100,
    "best_time": "e.g. 6 PM - 8 PM",
    "analysis": "2-3 sentence explanation",
    "gear": ["item1", "item2"]
}}
"""
def analyze_weather(activity, weather_data):
    prompt = build_prompt(activity, weather_data)
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'llama-3.3-70b-versatile',
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.3,
        'max_tokens': 1024
    }
    resp = requests.post(GROQ_URL, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    content = resp.json()['choices'][0]['message']['content'].strip()
    if content.startswith('```'):
        content = content.split('\n', 1)[-1]
        content = content.rsplit('```', 1)[0]
    return json.loads(content)
