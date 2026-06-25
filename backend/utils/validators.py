from config import Config


def validate_activity(activity):
    if not activity or not activity.strip():
        return False, 'Activity is required.'
    cleaned = activity.strip()
    if len(cleaned) < Config.MIN_ACTIVITY_LENGTH:
        return False, f'Activity must be at least {Config.MIN_ACTIVITY_LENGTH} characters.'
    if len(cleaned) > Config.MAX_ACTIVITY_LENGTH:
        return False, f'Activity must be {Config.MAX_ACTIVITY_LENGTH} characters or fewer.'
    return True, cleaned


def validate_location(location):
    if not location or not location.strip():
        return False, 'Location is required.'
    cleaned = location.strip()
    if len(cleaned) < 1:
        return False, 'Location is required.'
    if len(cleaned) > 200:
        return False, 'Location is too long.'
    return True, cleaned


def validate_date(date):
    allowed = {'today', 'tomorrow', 'best day'}
    if not date or not date.strip():
        return True, 'Today'
    cleaned = date.strip().lower()
    if cleaned in allowed:
        return True, cleaned.capitalize()
    return False, 'Date must be Today, Tomorrow, or Best Day.'
