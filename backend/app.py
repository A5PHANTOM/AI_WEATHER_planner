from flask import Flask
from flask_cors import CORS
from config import Config

app = Flask(__name__)

origins = Config.CORS_ORIGINS
if origins != '*':
    origins = origins.split(',')
CORS(app, resources={r'/api/*': {'origins': origins}})

from routes.weather import weather_bp
app.register_blueprint(weather_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=Config.DEBUG, port=Config.PORT)
