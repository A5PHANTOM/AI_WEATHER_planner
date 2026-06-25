from services.ai_service import validate_ai_response, _fallback_response


class TestValidateAIResponse:
    def test_valid_response(self):
        data = {
            'explanation': 'Good weather for running with mild temperatures.',
            'recommended_gear': ['Water bottle', 'Cap'],
            'safety_warnings': ['Stay hydrated'],
            'alternative_suggestions': [
                {'activity': 'Indoor gym', 'reason': 'Too hot outside'},
            ],
        }
        assert validate_ai_response(data)

    def test_missing_key(self):
        assert not validate_ai_response({'explanation': 'Test', 'recommended_gear': [], 'safety_warnings': []})

    def test_wrong_types(self):
        assert not validate_ai_response({
            'explanation': 'Test',
            'recommended_gear': 'not a list',
            'safety_warnings': [],
            'alternative_suggestions': [],
        })

    def test_short_explanation(self):
        assert not validate_ai_response({
            'explanation': 'Short',
            'recommended_gear': [],
            'safety_warnings': [],
            'alternative_suggestions': [],
        })

    def test_invalid_alternative(self):
        assert not validate_ai_response({
            'explanation': 'Good conditions overall for outdoor activity.',
            'recommended_gear': [],
            'safety_warnings': [],
            'alternative_suggestions': [{'wrong_key': 'value'}],
        })

    def test_not_dict(self):
        assert not validate_ai_response('not a dict')


class TestFallbackResponse:
    def test_contains_required_keys(self):
        fb = _fallback_response()
        for key in ('explanation', 'recommended_gear', 'safety_warnings', 'alternative_suggestions'):
            assert key in fb

    def test_is_safe(self):
        fb = _fallback_response()
        assert isinstance(fb['explanation'], str)
        assert isinstance(fb['recommended_gear'], list)
        assert isinstance(fb['safety_warnings'], list)
        assert isinstance(fb['alternative_suggestions'], list)
