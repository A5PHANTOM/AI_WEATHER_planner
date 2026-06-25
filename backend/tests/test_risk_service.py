from services.risk_service import (
    score_hourly,
    find_best_time_window,
    find_best_day,
    _score_temperature,
    _score_humidity,
    _score_rain,
    _score_wind,
    _score_gusts,
    _score_uv,
    _score_thunderstorm,
    _score_aqi,
    _get_activity_rules,
)


class TestScoringFunctions:
    def test_temperature_ideal(self):
        rules = _get_activity_rules('Running')
        assert _score_temperature(20, rules) == 0

    def test_temperature_too_hot(self):
        rules = _get_activity_rules('Running')
        assert _score_temperature(40, rules) > 80

    def test_temperature_too_cold(self):
        rules = _get_activity_rules('Running')
        assert _score_temperature(0, rules) > 50

    def test_temperature_none(self):
        assert _score_temperature(None, {'temp_ideal_min': 10, 'temp_ideal_max': 30}) == 0

    def test_humidity_low(self):
        assert _score_humidity(30) == 0

    def test_humidity_high(self):
        assert _score_humidity(95) > 80

    def test_humidity_none(self):
        assert _score_humidity(None) == 0

    def test_rain_low(self):
        assert _score_rain(5) == 0

    def test_rain_high(self):
        assert _score_rain(95) > 85

    def test_rain_none_with_precip(self):
        assert _score_rain(None, 5.0) > 60

    def test_wind_calm(self):
        assert _score_wind(2) == 0

    def test_wind_strong(self):
        assert _score_wind(20) > 70

    def test_gusts_light(self):
        assert _score_gusts(3) == 0

    def test_gusts_extreme(self):
        assert _score_gusts(35) > 90

    def test_uv_low(self):
        assert _score_uv(1) == 0

    def test_uv_high(self):
        assert _score_uv(10) > 80

    def test_uv_none(self):
        assert _score_uv(None) == 0

    def test_thunderstorm_clear(self):
        assert _score_thunderstorm(0) == 0

    def test_thunderstorm_active(self):
        assert _score_thunderstorm(95) == 100
        assert _score_thunderstorm(99) == 100

    def test_aqi_good(self):
        assert _score_aqi(15) == 0

    def test_aqi_hazardous(self):
        assert _score_aqi(200) > 90

    def test_aqi_none(self):
        assert _score_aqi(None) == 0


class TestScoreHourly:
    def test_good_hour_running(self, sample_hour):
        result = score_hourly(sample_hour, 'Running')
        assert 0 <= result['risk_score'] <= 100
        assert result['decision'] in ('Proceed', 'Proceed with Caution', 'Not Recommended')
        assert len(result['breakdown']) > 0

    def test_bad_hour_running(self, bad_hour):
        result = score_hourly(bad_hour, 'Running')
        assert result['risk_score'] > 50
        assert result['decision'] == 'Not Recommended'

    def test_all_activities(self, sample_hour):
        activities = ['Running', 'Cycling', 'Cricket', 'Football', 'Trekking', 'Beach Trip', 'Picnic', 'Outdoor Event', 'Custom activity']
        for activity in activities:
            result = score_hourly(sample_hour, activity)
            assert 0 <= result['risk_score'] <= 100
            assert result['decision'] in ('Proceed', 'Proceed with Caution', 'Not Recommended')

    def test_factor_breakdown_structure(self, sample_hour):
        result = score_hourly(sample_hour, 'Running')
        for factor in result['breakdown']:
            assert 'factor' in factor
            assert 'score' in factor
            assert 'weight' in factor
            assert 'contribution' in factor
            assert 'severity' in factor
            assert 'value' in factor

    def test_aqi_affects_running_score(self, sample_hour):
        no_aqi = score_hourly(sample_hour, 'Running', aqi_data=None)
        bad_aqi = score_hourly(sample_hour, 'Running', aqi_data={'european_aqi': 150})
        assert bad_aqi['risk_score'] >= no_aqi['risk_score']

    def test_thunderstorm_always_high(self, bad_hour):
        result = score_hourly(bad_hour, 'Running')
        thunder = [f for f in result['breakdown'] if f['factor'] == 'Thunderstorm']
        assert len(thunder) > 0
        assert thunder[0]['score'] == 100


class TestBestTimeWindow:
    def test_finds_window(self, sample_hour):
        hours = [sample_hour.copy() for _ in range(10)]
        for i, h in enumerate(hours):
            h['time'] = f'2026-06-24T{i:02d}:00'
        result, score = find_best_time_window(hours, 'Running')
        assert result is not None
        assert 'start' in result
        assert 'end' in result
        assert 'label' in result
        assert 0 <= result['risk_score'] <= 100

    def test_empty_hours(self):
        result, score = find_best_time_window([], 'Running')
        assert result is None
        assert score == 999


class TestBestDay:
    def test_finds_best_day(self, sample_daily):
        days = [sample_daily.copy() for _ in range(5)]
        for i, d in enumerate(days):
            d['date'] = f'2026-06-{24 + i}'
        result = find_best_day(days, 'Running')
        assert result is not None
        assert 'date' in result
        assert 'risk_score' in result
        assert 'decision' in result

    def test_empty_daily(self):
        assert find_best_day([], 'Running') is None


class TestActivityRules:
    def test_running_rules(self):
        rules = _get_activity_rules('Running')
        assert 'temperature' in rules
        assert rules['temperature'] == 0.20

    def test_custom_activity(self):
        rules = _get_activity_rules('Photography')
        for key in ('temperature', 'rain', 'wind', 'thunderstorm'):
            assert key in rules

    def test_case_insensitive(self):
        running = _get_activity_rules('RUNNING')
        Run = _get_activity_rules('cricket')
        assert running is not None
        assert Run is not None
