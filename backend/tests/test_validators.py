from utils.validators import validate_activity, validate_location, validate_date


class TestValidateActivity:
    def test_valid_activity(self):
        valid, result = validate_activity('Running')
        assert valid
        assert result == 'Running'

    def test_empty_activity(self):
        valid, result = validate_activity('')
        assert not valid

    def test_whitespace_activity(self):
        valid, result = validate_activity('   ')
        assert not valid

    def test_too_short_activity(self):
        valid, result = validate_activity('A')
        assert not valid

    def test_too_long_activity(self):
        valid, result = validate_activity('A' * 101)
        assert not valid

    def test_custom_activity(self):
        valid, result = validate_activity('Outdoor photography with family')
        assert valid
        assert result == 'Outdoor photography with family'


class TestValidateLocation:
    def test_valid_location(self):
        valid, result = validate_location('Mumbai')
        assert valid
        assert result == 'Mumbai'

    def test_empty_location(self):
        valid, result = validate_location('')
        assert not valid

    def test_too_long_location(self):
        valid, result = validate_location('A' * 201)
        assert not valid


class TestValidateDate:
    def test_today(self):
        valid, result = validate_date('Today')
        assert valid
        assert result == 'Today'

    def test_tomorrow(self):
        valid, result = validate_date('Tomorrow')
        assert valid

    def test_best_day(self):
        valid, result = validate_date('Best Day')
        assert valid

    def test_case_insensitive(self):
        valid, result = validate_date('best day')
        assert valid

    def test_invalid_date(self):
        valid, result = validate_date('Next week')
        assert not valid

    def test_default(self):
        valid, result = validate_date('')
        assert valid
        assert result == 'Today'
