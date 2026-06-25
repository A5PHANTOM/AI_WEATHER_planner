ACTIVITY_RULES = {
    'running': {
        'temperature': 0.20,
        'humidity': 0.15,
        'rain': 0.15,
        'wind': 0.10,
        'uv': 0.10,
        'aqi': 0.15,
        'thunderstorm': 0.15,
        'temp_ideal_min': 12,
        'temp_ideal_max': 25,
    },
    'cycling': {
        'temperature': 0.15,
        'humidity': 0.05,
        'rain': 0.15,
        'wind': 0.25,
        'gusts': 0.15,
        'uv': 0.05,
        'aqi': 0.10,
        'thunderstorm': 0.10,
        'temp_ideal_min': 10,
        'temp_ideal_max': 30,
    },
    'cricket': {
        'temperature': 0.25,
        'humidity': 0.05,
        'rain': 0.20,
        'wind': 0.10,
        'uv': 0.15,
        'thunderstorm': 0.25,
        'temp_ideal_min': 18,
        'temp_ideal_max': 32,
    },
    'football': {
        'temperature': 0.20,
        'humidity': 0.10,
        'rain': 0.20,
        'wind': 0.10,
        'uv': 0.05,
        'aqi': 0.05,
        'thunderstorm': 0.30,
        'temp_ideal_min': 10,
        'temp_ideal_max': 28,
    },
    'trekking': {
        'temperature': 0.20,
        'humidity': 0.05,
        'rain': 0.20,
        'wind': 0.10,
        'gusts': 0.05,
        'uv': 0.10,
        'aqi': 0.10,
        'thunderstorm': 0.20,
        'temp_ideal_min': 10,
        'temp_ideal_max': 28,
    },
    'beach trip': {
        'temperature': 0.20,
        'humidity': 0.10,
        'rain': 0.15,
        'wind': 0.10,
        'gusts': 0.05,
        'uv': 0.25,
        'thunderstorm': 0.15,
        'temp_ideal_min': 22,
        'temp_ideal_max': 35,
    },
    'picnic': {
        'temperature': 0.20,
        'humidity': 0.05,
        'rain': 0.30,
        'wind': 0.15,
        'uv': 0.10,
        'thunderstorm': 0.20,
        'temp_ideal_min': 18,
        'temp_ideal_max': 30,
    },
    'outdoor event': {
        'temperature': 0.15,
        'humidity': 0.10,
        'rain': 0.25,
        'wind': 0.10,
        'gusts': 0.05,
        'thunderstorm': 0.35,
        'temp_ideal_min': 15,
        'temp_ideal_max': 30,
    },
}

GENERIC_RULES = {
    'temperature': 0.15,
    'humidity': 0.10,
    'rain': 0.25,
    'wind': 0.15,
    'uv': 0.10,
    'aqi': 0.10,
    'thunderstorm': 0.15,
    'temp_ideal_min': 10,
    'temp_ideal_max': 30,
}


def _get_activity_rules(activity):
    key = activity.strip().lower()
    for act_key, rules in ACTIVITY_RULES.items():
        if act_key in key or key in act_key:
            return rules
    return GENERIC_RULES


def _score_temperature(temp, rules):
    ideal_min = rules.get('temp_ideal_min', 10)
    ideal_max = rules.get('temp_ideal_max', 30)
    if temp is None:
        return 0
    if ideal_min <= temp <= ideal_max:
        return 0
    if temp < ideal_min:
        diff = ideal_min - temp
        if diff >= 15:
            return 100
        return (diff / 15) * 100
    diff = temp - ideal_max
    if diff >= 15:
        return 100
    return (diff / 15) * 100


def _score_humidity(humidity):
    if humidity is None:
        return 0
    if humidity <= 50:
        return 0
    if humidity <= 70:
        return (humidity - 50) / 20 * 40
    if humidity <= 90:
        return 40 + (humidity - 70) / 20 * 40
    return 80 + (humidity - 90) / 10 * 20


def _score_rain(prob, precip_mm=None):
    if prob is None:
        if precip_mm is None or precip_mm == 0:
            return 0
        if precip_mm <= 0.5:
            return 10
        if precip_mm <= 2:
            return 30
        if precip_mm <= 10:
            return 70
        return 100
    if prob <= 10:
        return 0
    if prob <= 30:
        return (prob - 10) / 20 * 20
    if prob <= 60:
        return 20 + (prob - 30) / 30 * 40
    if prob <= 85:
        return 60 + (prob - 60) / 25 * 25
    return 85 + (prob - 85) / 15 * 15


def _score_wind(speed):
    if speed is None:
        return 0
    if speed <= 3:
        return 0
    if speed <= 8:
        return (speed - 3) / 5 * 30
    if speed <= 15:
        return 30 + (speed - 8) / 7 * 40
    if speed <= 25:
        return 70 + (speed - 15) / 10 * 25
    return 95


def _score_gusts(gusts):
    if gusts is None:
        return 0
    if gusts <= 5:
        return 0
    if gusts <= 12:
        return (gusts - 5) / 7 * 30
    if gusts <= 20:
        return 30 + (gusts - 12) / 8 * 40
    if gusts <= 30:
        return 70 + (gusts - 20) / 10 * 25
    return 95


def _score_uv(uv):
    if uv is None:
        return 0
    if uv <= 2:
        return 0
    if uv <= 5:
        return (uv - 2) / 3 * 25
    if uv <= 8:
        return 25 + (uv - 5) / 3 * 40
    return 65 + min(uv - 8, 3) / 3 * 35


def _score_thunderstorm(weather_code):
    if weather_code is None:
        return 0
    if weather_code >= 95:
        return 100
    return 0


def _score_aqi(aqi_value):
    if aqi_value is None:
        return 0
    if aqi_value <= 20:
        return 0
    if aqi_value <= 40:
        return (aqi_value - 20) / 20 * 25
    if aqi_value <= 60:
        return 25 + (aqi_value - 40) / 20 * 25
    if aqi_value <= 100:
        return 50 + (aqi_value - 60) / 40 * 25
    if aqi_value <= 150:
        return 75 + (aqi_value - 100) / 50 * 20
    return 95


def _pick_aqi_value(aqi_data):
    if not aqi_data:
        return None
    return aqi_data.get('european_aqi') or aqi_data.get('us_aqi')


class FactorResult:
    def __init__(self, name, score, weight, contribution, severity, value):
        self.name = name
        self.score = round(score, 1)
        self.weight = weight
        self.contribution = round(contribution, 1)
        self.severity = severity
        self.value = value

    def to_dict(self):
        return {
            'factor': self.name,
            'score': self.score,
            'weight': self.weight,
            'contribution': self.contribution,
            'severity': self.severity,
            'value': self.value,
        }


def _get_severity(score):
    if score <= 20:
        return 'low'
    if score <= 50:
        return 'moderate'
    if score <= 75:
        return 'high'
    return 'extreme'


def score_hourly(hour, activity, aqi_data=None):
    rules = _get_activity_rules(activity)
    factors = []

    temp_score = _score_temperature(hour.get('temperature'), rules)
    factors.append(FactorResult(
        'Temperature', temp_score,
        rules.get('temperature', 0),
        temp_score * rules.get('temperature', 0),
        _get_severity(temp_score), hour.get('temperature'),
    ))

    humidity_score = _score_humidity(hour.get('humidity'))
    w = rules.get('humidity', 0)
    if w > 0:
        factors.append(FactorResult(
            'Humidity', humidity_score, w,
            humidity_score * w, _get_severity(humidity_score), hour.get('humidity'),
        ))

    rain_score = _score_rain(
        hour.get('precipitation_probability'),
        hour.get('precipitation'),
    )
    w = rules.get('rain', 0)
    if w > 0:
        factors.append(FactorResult(
            'Rain', rain_score, w,
            rain_score * w, _get_severity(rain_score),
            hour.get('precipitation_probability'),
        ))

    wind_score = _score_wind(hour.get('wind_speed'))
    w = rules.get('wind', 0)
    if w > 0:
        factors.append(FactorResult(
            'Wind', wind_score, w,
            wind_score * w, _get_severity(wind_score), hour.get('wind_speed'),
        ))

    gusts_score = _score_gusts(hour.get('wind_gusts'))
    w = rules.get('gusts', 0)
    if w > 0:
        factors.append(FactorResult(
            'Wind Gusts', gusts_score, w,
            gusts_score * w, _get_severity(gusts_score), hour.get('wind_gusts'),
        ))

    uv_score = _score_uv(hour.get('uv_index'))
    w = rules.get('uv', 0)
    if w > 0:
        factors.append(FactorResult(
            'UV Index', uv_score, w,
            uv_score * w, _get_severity(uv_score), hour.get('uv_index'),
        ))

    ts_score = _score_thunderstorm(hour.get('weather_code'))
    w = rules.get('thunderstorm', 0)
    if w > 0:
        factors.append(FactorResult(
            'Thunderstorm', ts_score, w,
            ts_score * w, _get_severity(ts_score),
            'Yes' if ts_score > 0 else 'No',
        ))

    aqi_val = _pick_aqi_value(aqi_data)
    aqi_score = _score_aqi(aqi_val)
    w = rules.get('aqi', 0)
    if w > 0:
        factors.append(FactorResult(
            'Air Quality', aqi_score, w,
            aqi_score * w, _get_severity(aqi_score), aqi_val,
        ))

    total_weight = sum(f.weight for f in factors)
    if total_weight > 0:
        overall = sum(f.contribution for f in factors) / total_weight
    else:
        overall = 0

    overall = min(100, max(0, round(overall)))

    if overall <= 30:
        decision = 'Proceed'
    elif overall <= 60:
        decision = 'Proceed with Caution'
    else:
        decision = 'Not Recommended'

    return {
        'risk_score': overall,
        'decision': decision,
        'breakdown': [f.to_dict() for f in factors],
    }


def compute_hourly_timeline(hourly_data, activity, aqi_data=None):
    result = []
    for hour in hourly_data:
        r = score_hourly(hour, activity, aqi_data)
        result.append({
            'time': hour['time'],
            'risk_score': r['risk_score'],
            'decision': r['decision'],
            'temperature': hour.get('temperature'),
            'precipitation_probability': hour.get('precipitation_probability'),
            'wind_speed': hour.get('wind_speed'),
            'uv_index': hour.get('uv_index'),
            'weather_code': hour.get('weather_code'),
            'description': hour.get('description'),
        })
    return result


def compute_severity_alerts(hourly_timeline):
    high_risk_periods = []
    in_period = False
    start = None
    for h in hourly_timeline:
        if h['risk_score'] > 50 and not in_period:
            start = h['time']
            in_period = True
        elif h['risk_score'] <= 50 and in_period:
            high_risk_periods.append({'from': start, 'to': h['time']})
            in_period = False
    if in_period:
        high_risk_periods.append({'from': start, 'to': hourly_timeline[-1]['time']})
    return high_risk_periods


def find_best_time_window(hourly_data, activity, aqi_data=None, window_size=2):
    if not hourly_data:
        return None, 999
    scored = []
    for hour in hourly_data:
        result = score_hourly(hour, activity, aqi_data)
        scored.append({
            'time': hour['time'],
            'risk_score': result['risk_score'],
            'decision': result['decision'],
        })

    best_score = 999
    best_window = None
    for i in range(len(scored) - window_size + 1):
        window = scored[i:i + window_size]
        avg = sum(h['risk_score'] for h in window) / window_size
        if avg < best_score:
            best_score = avg
            best_window = window

    if best_window:
        start_time = best_window[0]['time']
        end_time = best_window[-1]['time']
        start_label = _format_time(start_time)
        end_label = _format_time(end_time)
        return {
            'start': start_time,
            'end': end_time,
            'label': f'{start_label} - {end_label}',
            'risk_score': round(best_score),
        }, best_score
    return None, 999


def _format_time(iso_time):
    try:
        parts = iso_time.split('T')
        if len(parts) > 1:
            time_part = parts[1]
            hour = int(time_part.split(':')[0])
            if hour == 0:
                return '12 AM'
            if hour < 12:
                return f'{hour} AM'
            if hour == 12:
                return '12 PM'
            return f'{hour - 12} PM'
    except Exception:
        pass
    return iso_time


def find_best_day(daily_data, activity, aqi_data=None):
    if not daily_data:
        return None
    daily_scores = []
    for day in daily_data:
        score = _score_daily(day, activity, aqi_data)
        daily_scores.append({**day, **score})

    daily_scores.sort(key=lambda x: x['risk_score'])
    best = daily_scores[0]
    return {
        'date': best['date'],
        'risk_score': best['risk_score'],
        'decision': best['decision'],
        'description': best.get('description', ''),
    }


def _score_daily(day, activity, aqi_data=None):
    rules = _get_activity_rules(activity)
    factors = []

    middle_temp = (day.get('temp_max', 25) + day.get('temp_min', 15)) / 2
    temp_score = _score_temperature(middle_temp, rules)
    factors.append(FactorResult('Temperature', temp_score, rules.get('temperature', 0),
                                temp_score * rules.get('temperature', 0),
                                _get_severity(temp_score), round(middle_temp)))

    rain_score = _score_rain(day.get('precipitation_probability_max'), day.get('precipitation_sum'))
    w = rules.get('rain', 0)
    if w > 0:
        factors.append(FactorResult('Rain', rain_score, w, rain_score * w,
                                    _get_severity(rain_score), day.get('precipitation_probability_max')))

    wind_score = _score_wind(day.get('wind_speed_max'))
    w = rules.get('wind', 0)
    if w > 0:
        factors.append(FactorResult('Wind', wind_score, w, wind_score * w,
                                    _get_severity(wind_score), day.get('wind_speed_max')))

    gusts_score = _score_gusts(day.get('wind_gusts_max'))
    w = rules.get('gusts', 0)
    if w > 0:
        factors.append(FactorResult('Wind Gusts', gusts_score, w, gusts_score * w,
                                    _get_severity(gusts_score), day.get('wind_gusts_max')))

    uv_score = _score_uv(day.get('uv_index_max'))
    w = rules.get('uv', 0)
    if w > 0:
        factors.append(FactorResult('UV Index', uv_score, w, uv_score * w,
                                    _get_severity(uv_score), day.get('uv_index_max')))

    ts_score = _score_thunderstorm(day.get('weather_code'))
    w = rules.get('thunderstorm', 0)
    if w > 0:
        factors.append(FactorResult('Thunderstorm', ts_score, w, ts_score * w,
                                    _get_severity(ts_score), 'Yes' if ts_score > 0 else 'No'))

    aqi_val = _pick_aqi_value(aqi_data)
    aqi_score = _score_aqi(aqi_val)
    w = rules.get('aqi', 0)
    if w > 0:
        factors.append(FactorResult('Air Quality', aqi_score, w, aqi_score * w,
                                    _get_severity(aqi_score), aqi_val))

    total_weight = sum(f.weight for f in factors)
    overall = sum(f.contribution for f in factors) / total_weight if total_weight > 0 else 0
    overall = min(100, max(0, round(overall)))

    if overall <= 30:
        decision = 'Proceed'
    elif overall <= 60:
        decision = 'Proceed with Caution'
    else:
        decision = 'Not Recommended'

    return {'risk_score': overall, 'decision': decision, 'breakdown': [f.to_dict() for f in factors]}
