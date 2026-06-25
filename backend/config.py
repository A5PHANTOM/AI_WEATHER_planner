import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
    PORT = int(os.getenv('PORT', '5001'))
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
    GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
    REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', '30'))
    CACHE_TTL = int(os.getenv('CACHE_TTL', '600'))
    MAX_ACTIVITY_LENGTH = 100
    MIN_ACTIVITY_LENGTH = 2
