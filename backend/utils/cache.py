import time
from functools import wraps

_cache_store = {}


def cached(ttl=600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = (func.__name__, args, tuple(sorted(kwargs.items())))
            now = time.time()
            entry = _cache_store.get(key)
            if entry and (now - entry['time']) < ttl:
                return entry['value']
            result = func(*args, **kwargs)
            _cache_store[key] = {'value': result, 'time': now}
            return result
        return wrapper
    return decorator


def clear_cache():
    _cache_store.clear()
