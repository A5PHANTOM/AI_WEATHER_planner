import requests
from datetime import datetime

GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

WMO_CODES = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
}

def get_wmo_description(code):
    return WMO_CODES.get(code, 'Unknown')

def geocode_location(location):
    params = {'name': location, 'count': 1, 'language': 'en', 'format': 'json'}
    resp = requests.get(GEO_URL, params=params)
    resp.raise_for_status()
    data = resp.json()
    if not data.get('results'):
        raise ValueError(f'Location "{location}" not found.')
    r = data['results'][0]
    return r['latitude'], r['longitude'], r.get('name', location)

def fetch_forecast(lat, lon):
    params = {
        'latitude': lat,
        'longitude': lon,
        'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index',
        'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,weather_code',
        'hourly': 'relative_humidity_2m',
        'forecast_days': 2,
        'timezone': 'auto',
    }
    resp = requests.get(FORECAST_URL, params=params)
    resp.raise_for_status()
    return resp.json()

def extract_current(data):
    c = data['current']
    d = data['daily']
    return {
        'temperature': round(c['temperature_2m']),
        'feels_like': round(c['apparent_temperature']),
        'humidity': c['relative_humidity_2m'],
        'wind_speed': round(c['wind_speed_10m'], 1),
        'rain_probability': d['precipitation_probability_max'][0],
        'uv_index': round(c['uv_index'], 1),
        'description': get_wmo_description(c['weather_code']),
    }

def extract_tomorrow(data):
    d = data['daily']
    tomorrow = d['time'][1]
    hourly = data['hourly']
    tomorrow_humidities = [
        h for i, h in enumerate(hourly['relative_humidity_2m'])
        if hourly['time'][i].startswith(tomorrow)
    ]
    avg_humidity = round(sum(tomorrow_humidities) / len(tomorrow_humidities)) if tomorrow_humidities else 0
    temp_max = d['temperature_2m_max'][1]
    temp_min = d['temperature_2m_min'][1]
    avg_temp = round((temp_max + temp_min) / 2)
    return {
        'temperature': avg_temp,
        'feels_like': avg_temp,
        'humidity': avg_humidity,
        'wind_speed': round(d['wind_speed_10m_max'][1], 1),
        'rain_probability': d['precipitation_probability_max'][1],
        'uv_index': round(d['uv_index_max'][1], 1),
        'description': get_wmo_description(d['weather_code'][1]),
    }

def get_weather(location, date):
    lat, lon, resolved_name = geocode_location(location)
    raw = fetch_forecast(lat, lon)
    if date.lower() == 'today':
        data = extract_current(raw)
    else:
        data = extract_tomorrow(raw)
    data['location'] = resolved_name
    return data
