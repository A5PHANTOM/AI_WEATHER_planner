import requests
from datetime import datetime, timezone, timedelta
from utils.cache import cached
from config import Config

GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

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


def is_thunderstorm(code):
    return code >= 95


def is_precipitation(code):
    return code >= 51


@cached(ttl=3600)
def geocode_location(location):
    params = {'name': location, 'count': 1, 'language': 'en', 'format': 'json'}
    resp = requests.get(GEO_URL, params=params, timeout=Config.REQUEST_TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    if not data.get('results'):
        raise ValueError(f'Location "{location}" not found.')
    r = data['results'][0]
    return r['latitude'], r['longitude'], r.get('name', location), r.get('country', '')


@cached(ttl=600)
def fetch_forecast(lat, lon):
    params = {
        'latitude': lat,
        'longitude': lon,
        'current': ('temperature_2m,relative_humidity_2m,apparent_temperature,'
                     'precipitation,weather_code,wind_speed_10m,wind_gusts_10m,uv_index'),
        'hourly': ('temperature_2m,relative_humidity_2m,precipitation_probability,'
                   'precipitation,wind_speed_10m,wind_gusts_10m,uv_index,weather_code'),
        'daily': ('temperature_2m_max,temperature_2m_min,precipitation_sum,'
                  'precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,'
                  'uv_index_max,weather_code'),
        'wind_speed_unit': 'ms',
        'forecast_days': 7,
        'timezone': 'auto',
    }
    resp = requests.get(FORECAST_URL, params=params, timeout=Config.REQUEST_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


@cached(ttl=600)
def fetch_aqi(lat, lon):
    params = {
        'latitude': lat,
        'longitude': lon,
        'current': 'european_aqi,us_aqi,pm2_5,pm10,ozone',
    }
    try:
        resp = requests.get(AQI_URL, params=params, timeout=Config.REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return None


def extract_current(data):
    c = data['current']
    wc = c.get('weather_code', 0)
    return {
        'temperature': round(c['temperature_2m']),
        'feels_like': round(c['apparent_temperature']),
        'humidity': c['relative_humidity_2m'],
        'wind_speed': round(c['wind_speed_10m'], 1),
        'wind_gusts': round(c.get('wind_gusts_10m', 0), 1),
        'precipitation': round(c.get('precipitation', 0), 1),
        'uv_index': round(c['uv_index'], 1),
        'weather_code': wc,
        'description': get_wmo_description(wc),
        'is_thunderstorm': is_thunderstorm(wc),
    }


def extract_aqi(aqi_raw):
    if not aqi_raw or 'current' not in aqi_raw:
        return None
    c = aqi_raw['current']
    return {
        'european_aqi': c.get('european_aqi'),
        'us_aqi': c.get('us_aqi'),
        'pm2_5': round(c.get('pm2_5', 0), 1) if c.get('pm2_5') else None,
        'pm10': round(c.get('pm10', 0), 1) if c.get('pm10') else None,
        'ozone': round(c.get('ozone', 0), 1) if c.get('ozone') else None,
    }


def extract_hourly(data, day_offset=0):
    hourly = data['hourly']
    times = hourly['time']
    day_prefix = times[0][:10] if day_offset == 0 else _get_day_prefix(times, day_offset)
    indices = [i for i, t in enumerate(times) if t.startswith(day_prefix)]
    result = []
    for i in indices:
        wc = hourly['weather_code'][i]
        result.append({
            'time': hourly['time'][i],
            'temperature': round(hourly['temperature_2m'][i]),
            'humidity': hourly['relative_humidity_2m'][i],
            'precipitation_probability': hourly['precipitation_probability'][i],
            'precipitation': round(hourly['precipitation'][i], 1),
            'wind_speed': round(hourly['wind_speed_10m'][i], 1),
            'wind_gusts': round(hourly['wind_gusts_10m'][i], 1),
            'uv_index': round(hourly['uv_index'][i], 1),
            'weather_code': wc,
            'description': get_wmo_description(wc),
            'is_thunderstorm': is_thunderstorm(wc),
        })
    return result


def _get_day_prefix(times, offset):
    seen = set()
    for t in times:
        day = t[:10]
        if day not in seen:
            seen.add(day)
            if len(seen) == offset + 1:
                return day
    return times[0][:10]


def extract_daily(data):
    d = data['daily']
    result = []
    for i in range(len(d['time'])):
        wc = d['weather_code'][i]
        result.append({
            'date': d['time'][i],
            'temp_max': round(d['temperature_2m_max'][i]),
            'temp_min': round(d['temperature_2m_min'][i]),
            'precipitation_sum': round(d['precipitation_sum'][i], 1),
            'precipitation_probability_max': d['precipitation_probability_max'][i],
            'wind_speed_max': round(d['wind_speed_10m_max'][i], 1),
            'wind_gusts_max': round(d['wind_gusts_10m_max'][i], 1),
            'uv_index_max': round(d['uv_index_max'][i], 1),
            'weather_code': wc,
            'description': get_wmo_description(wc),
            'is_thunderstorm': is_thunderstorm(wc),
        })
    return result


def get_today_hourly(data):
    return extract_hourly(data, 0)


def get_tomorrow_hourly(data):
    return extract_hourly(data, 1)


def get_weather(location, date):
    lat, lon, resolved_name, country = geocode_location(location)

    raw = fetch_forecast(lat, lon)
    aqi_raw = fetch_aqi(lat, lon)

    current = extract_current(raw)
    daily = extract_daily(raw)
    aqi = extract_aqi(aqi_raw)

    date_lower = date.lower()

    response = {
        'location': resolved_name,
        'country': country,
        'current': current,
        'daily': daily,
        'aqi': aqi,
    }

    if date_lower == 'today':
        response['hourly'] = get_today_hourly(raw)
    elif date_lower == 'tomorrow':
        response['hourly'] = get_tomorrow_hourly(raw)
    else:
        response['hourly'] = get_today_hourly(raw)

    return response


def get_all_hourly(data):
    hourly = data['hourly']
    result = []
    for i in range(len(hourly['time'])):
        wc = hourly['weather_code'][i]
        result.append({
            'time': hourly['time'][i],
            'temperature': round(hourly['temperature_2m'][i]),
            'humidity': hourly['relative_humidity_2m'][i],
            'precipitation_probability': hourly['precipitation_probability'][i],
            'precipitation': round(hourly['precipitation'][i], 1),
            'wind_speed': round(hourly['wind_speed_10m'][i], 1),
            'wind_gusts': round(hourly['wind_gusts_10m'][i], 1),
            'uv_index': round(hourly['uv_index'][i], 1),
            'weather_code': wc,
            'description': get_wmo_description(wc),
            'is_thunderstorm': is_thunderstorm(wc),
        })
    return result
