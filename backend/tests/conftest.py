import pytest


@pytest.fixture
def sample_hour():
    return {
        'time': '2026-06-24T14:00',
        'temperature': 28,
        'humidity': 65,
        'precipitation_probability': 30,
        'precipitation': 0.5,
        'wind_speed': 4.2,
        'wind_gusts': 8.1,
        'uv_index': 6.5,
        'weather_code': 2,
        'description': 'Partly cloudy',
        'is_thunderstorm': False,
    }


@pytest.fixture
def bad_hour():
    return {
        'time': '2026-06-24T14:00',
        'temperature': 38,
        'humidity': 92,
        'precipitation_probability': 85,
        'precipitation': 8.0,
        'wind_speed': 18.0,
        'wind_gusts': 28.0,
        'uv_index': 9.0,
        'weather_code': 95,
        'description': 'Thunderstorm',
        'is_thunderstorm': True,
    }


@pytest.fixture
def sample_daily():
    return {
        'date': '2026-06-24',
        'temp_max': 30,
        'temp_min': 22,
        'precipitation_sum': 1.0,
        'precipitation_probability_max': 35,
        'wind_speed_max': 5.0,
        'wind_gusts_max': 10.0,
        'uv_index_max': 7.0,
        'weather_code': 2,
        'description': 'Partly cloudy',
        'is_thunderstorm': False,
    }


@pytest.fixture
def sample_weather_data():
    return {
        'location': 'London',
        'country': 'United Kingdom',
        'current': {
            'temperature': 20,
            'feels_like': 18,
            'humidity': 60,
            'wind_speed': 3.5,
            'wind_gusts': 6.0,
            'precipitation': 0,
            'uv_index': 3.0,
            'weather_code': 2,
            'description': 'Partly cloudy',
            'is_thunderstorm': False,
        },
        'aqi': {
            'european_aqi': 35,
            'us_aqi': 30,
            'pm2_5': 10.5,
            'pm10': 22.0,
            'ozone': 45.0,
        },
        'daily': [],
    }
