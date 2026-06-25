from flask import Blueprint, request, jsonify
from flask_cors import CORS
from config import Config
from utils.validators import validate_activity, validate_location, validate_date
from services.recommendation_service import get_recommendation, compare_locations, handle_follow_up

weather_bp = Blueprint('weather', __name__)

origins = Config.CORS_ORIGINS
if origins != '*':
    origins = origins.split(',')
CORS(weather_bp, resources={r'/*': {'origins': origins}})


@weather_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body required'}), 400

    location = data.get('location', '')
    activity = data.get('activity', '')
    date = data.get('date', 'Today')

    valid, result = validate_location(location)
    if not valid:
        return jsonify({'error': result}), 400
    location = result

    valid, result = validate_activity(activity)
    if not valid:
        return jsonify({'error': result}), 400
    activity = result

    valid, result = validate_date(date)
    if not valid:
        return jsonify({'error': result}), 400
    date = result

    try:
        recommendation = get_recommendation(location, activity, date)
        return jsonify(recommendation)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        if Config.DEBUG:
            return jsonify({'error': str(e)}), 500
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500


@weather_bp.route('/compare', methods=['POST'])
def compare():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body required'}), 400

    locations = data.get('locations', [])
    if not isinstance(locations, list) or len(locations) < 2:
        return jsonify({'error': 'At least two locations are required'}), 400
    if len(locations) > 5:
        return jsonify({'error': 'Maximum 5 locations allowed'}), 400

    activity = data.get('activity', '')
    date = data.get('date', 'Today')

    valid, result = validate_activity(activity)
    if not valid:
        return jsonify({'error': result}), 400
    activity = result

    valid, result = validate_date(date)
    if not valid:
        return jsonify({'error': result}), 400
    date = result

    validated_locs = []
    for loc in locations:
        v, r = validate_location(loc)
        if v:
            validated_locs.append(r)

    if len(validated_locs) < 2:
        return jsonify({'error': 'At least two valid locations are required'}), 400

    try:
        results = compare_locations(validated_locs, activity, date)
        return jsonify({'locations': results, 'activity': activity, 'date': date})
    except Exception as e:
        if Config.DEBUG:
            return jsonify({'error': str(e)}), 500
        return jsonify({'error': 'Comparison failed. Please try again.'}), 500


@weather_bp.route('/follow-up', methods=['POST'])
def follow_up():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body required'}), 400

    question = data.get('question', '').strip()
    if not question:
        return jsonify({'error': 'Question is required'}), 400

    context = {
        'location': data.get('location', ''),
        'activity': data.get('activity', ''),
        'date': data.get('date', 'Today'),
    }

    try:
        response = handle_follow_up(None, question, context)
        return jsonify(response)
    except Exception as e:
        if Config.DEBUG:
            return jsonify({'error': str(e)}), 500
        return jsonify({'error': 'Follow-up failed. Please try again.'}), 500
