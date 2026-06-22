from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.weather_service import get_weather
from services.ai_service import analyze_weather

weather_bp = Blueprint('weather', __name__)
CORS(weather_bp, resources={r'/*': {'origins': '*'}})

ACTIVITIES = [
    'Cricket', 'Football', 'Running', 'Cycling',
    'Trekking', 'Beach Trip', 'Picnic', 'Outdoor Event'
]

@weather_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body required'}), 400
    location = data.get('location', '').strip()
    activity = data.get('activity', '').strip()
    date = data.get('date', 'Today').strip()
    if not location:
        return jsonify({'error': 'Location is required'}), 400
    if not activity or activity not in ACTIVITIES:
        return jsonify({'error': f'Activity must be one of: {", ".join(ACTIVITIES)}'}), 400
    if date not in ('Today', 'Tomorrow'):
        return jsonify({'error': 'Date must be Today or Tomorrow'}), 400
    try:
        weather = get_weather(location, date)
        ai_result = analyze_weather(activity, weather)
        return jsonify({
            'decision': ai_result['decision'],
            'risk_score': ai_result['risk_score'],
            'best_time': ai_result['best_time'],
            'analysis': ai_result['analysis'],
            'gear': ai_result['gear'],
            'weather': weather
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
