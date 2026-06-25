import time
import threading
from services.weather_service import (
    get_weather,
    get_all_hourly,
    fetch_forecast,
    geocode_location,
)
from services.risk_service import (
    score_hourly,
    find_best_time_window,
    find_best_day,
    _score_daily,
    compute_hourly_timeline,
    compute_severity_alerts,
)
from services.ai_service import analyze_weather

_session_store = {}
_session_lock = threading.Lock()


def _compute_decision(risk_score):
    if risk_score <= 30:
        return 'Proceed'
    if risk_score <= 60:
        return 'Proceed with Caution'
    return 'Not Recommended'


def _compute_confidence(risk_score, weather_data, hourly_count):
    confidence = 85
    if risk_score > 50:
        confidence -= 10
    if risk_score > 75:
        confidence -= 10
    if hourly_count < 12:
        confidence -= 10
    if weather_data.get('aqi') is None:
        confidence -= 5
    if not weather_data.get('daily') or len(weather_data['daily']) < 2:
        confidence -= 5
    return max(30, min(99, confidence))


def _find_hour_for_time(hourly_data, target_time):
    for h in hourly_data:
        if h['time'] == target_time:
            return h
    return None


def get_recommendation(location, activity, date):
    weather_data = get_weather(location, date)
    hourly_data = weather_data.get('hourly', [])
    daily_data = weather_data.get('daily', [])
    aqi_data = weather_data.get('aqi')
    is_multi = date.lower() == 'best day'

    if is_multi:
        raw = fetch_forecast(*geocode_location(location)[:2])
        hourly_data = get_all_hourly(raw)

    best_day = None
    if is_multi and daily_data:
        best_day = find_best_day(daily_data, activity, aqi_data)

    best_time, _ = find_best_time_window(hourly_data, activity, aqi_data)
    hourly_timeline = compute_hourly_timeline(hourly_data, activity, aqi_data)
    severity_alerts = compute_severity_alerts(hourly_timeline)

    if best_day:
        risk_score = best_day['risk_score']
        overall_decision = best_day['decision']
        day_idx = next((i for i, d in enumerate(daily_data) if d['date'] == best_day['date']), 0)
        day_for_breakdown = daily_data[day_idx] if day_idx < len(daily_data) else daily_data[0]
        daily_result = _score_daily(day_for_breakdown, activity, aqi_data)
        risk_breakdown = daily_result['breakdown']
    elif best_time and hourly_data:
        risk_score = best_time['risk_score']
        overall_decision = _compute_decision(risk_score)
        start_hour = _find_hour_for_time(hourly_data, best_time['start'])
        if start_hour:
            breakdown_result = score_hourly(start_hour, activity, aqi_data)
            risk_breakdown = breakdown_result['breakdown']
        else:
            breakdown_result = score_hourly(hourly_data[0], activity, aqi_data)
            risk_breakdown = breakdown_result['breakdown']
    elif hourly_data:
        first_result = score_hourly(hourly_data[0], activity, aqi_data)
        risk_score = first_result['risk_score']
        overall_decision = first_result['decision']
        risk_breakdown = first_result['breakdown']
    else:
        risk_score = 50
        overall_decision = 'Proceed with Caution'
        risk_breakdown = []

    confidence = _compute_confidence(risk_score, weather_data, len(hourly_data))

    ai_result = analyze_weather(activity, weather_data, {
        'risk_score': risk_score,
        'decision': overall_decision,
        'breakdown': risk_breakdown,
    }, best_time, best_day)

    weather_summary = {
        'location': weather_data.get('location'),
        'country': weather_data.get('country'),
        'current': weather_data.get('current'),
        'aqi': weather_data.get('aqi'),
        'daily': daily_data[:7] if daily_data else [],
    }

    result = {
        'decision': overall_decision,
        'risk_score': risk_score,
        'confidence_score': confidence,
        'best_time': best_time,
        'best_day': best_day,
        'risk_breakdown': risk_breakdown,
        'weather_summary': weather_summary,
        'hourly_timeline': hourly_timeline,
        'severity_alerts': severity_alerts,
        'explanation': ai_result.get('explanation', ''),
        'recommended_gear': ai_result.get('recommended_gear', []),
        'safety_warnings': ai_result.get('safety_warnings', []),
        'alternative_suggestions': ai_result.get('alternative_suggestions', []),
    }

    _save_session(location, activity, date, result)
    return result


def compare_locations(locations, activity, date):
    results = []
    for loc in locations:
        try:
            w = get_weather(loc, date)
            daily_data = w.get('daily', [])
            aqi_data = w.get('aqi')
            hourly_data = w.get('hourly', [])

            is_multi = date.lower() == 'best day'
            best_day = None
            if is_multi and daily_data:
                best_day = find_best_day(daily_data, activity, aqi_data)

            best_time, _ = find_best_time_window(hourly_data, activity, aqi_data)

            if best_day:
                risk_score = best_day['risk_score']
                decision = best_day['decision']
            elif best_time:
                risk_score = best_time['risk_score']
                decision = _compute_decision(risk_score)
            elif hourly_data:
                first = score_hourly(hourly_data[0], activity, aqi_data)
                risk_score = first['risk_score']
                decision = first['decision']
            else:
                risk_score = 50
                decision = 'Proceed with Caution'

            results.append({
                'location': w.get('location', loc),
                'country': w.get('country', ''),
                'risk_score': risk_score,
                'decision': decision,
                'best_time': best_time,
                'best_day': best_day,
                'current': w.get('current'),
                'aqi': w.get('aqi'),
                'daily': daily_data[:3] if daily_data else [],
            })
        except Exception as e:
            results.append({
                'location': loc,
                'error': str(e),
            })

    results.sort(key=lambda r: r.get('risk_score', 999) if 'risk_score' in r else 999)
    return results


def _session_key(location, activity, date):
    return f'{location}|{activity}|{date}'


def _save_session(location, activity, date, result):
    key = _session_key(location, activity, date)
    with _session_lock:
        _session_store[key] = {
            'result': result,
            'time': time.time(),
        }
        if len(_session_store) > 100:
            oldest = min(_session_store.keys(), key=lambda k: _session_store[k]['time'])
            del _session_store[oldest]


def get_session(location, activity, date):
    key = _session_key(location, activity, date)
    with _session_lock:
        entry = _session_store.get(key)
        if entry and (time.time() - entry['time']) < 1800:
            return entry['result']
    return None


def handle_follow_up(session_id, question, context):
    question_lower = question.strip().lower()

    if 'compare' in question_lower or ' vs ' in question_lower:
        parts = question_lower.replace('compare', '').replace(' vs ', '|').strip()
        locs = [p.strip() for p in parts.split('|') if p.strip()]
        if len(locs) >= 2:
            return compare_locations(
                locs,
                context.get('activity', 'Running'),
                context.get('date', 'Today'),
            )

    time_hints = {
        '6 pm': 18, '6am': 6, '7 pm': 19, '7am': 7,
        '8 pm': 20, '8am': 8, '9 pm': 21, '9am': 9,
        '10 pm': 22, '10am': 10, '11 pm': 23, '11am': 11,
        'noon': 12, 'midnight': 0,
        'morning': 8, 'afternoon': 14, 'evening': 18, 'night': 21,
    }

    day_hints = {
        'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
        'friday': 4, 'saturday': 5, 'sunday': 6,
    }

    target_hour = None
    for keyword, hour in time_hints.items():
        if keyword in question_lower:
            target_hour = hour
            break

    target_day = None
    for day_name, idx in day_hints.items():
        if day_name in question_lower:
            target_day = day_name.capitalize()
            break

    if 'kid' in question_lower or 'child' in question_lower or 'safe for' in question_lower:
        result = _simulate_with_preferences(context, {'child_mode': True})
        return {'type': 'preference_check', 'recommendation': result}

    if 'wear' in question_lower or 'bring' in question_lower or 'gear' in question_lower:
        return {'type': 'gear_focus', 'message': 'Consider light, breathable clothing and sun protection. Check the gear section above for specifics.'}

    return {'type': 'fallback', 'message': 'I can help with: changing time, checking a different day, comparing locations, or gear advice. What would you like to know?'}


def _simulate_with_preferences(context, overrides):
    return {
        'note': 'Preferences applied',
        'overrides': overrides,
    }
