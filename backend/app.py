from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r'/api/*': {'origins': '*'}})

from routes.weather import weather_bp
app.register_blueprint(weather_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
