from dotenv import load_dotenv
import os

load_dotenv()

import requests

from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled ,NoTranscriptFound

FRED_API_KEY=os.getenv("FRED_API_KEY")
FRED_BASE="https://api.stlouisfed.org/fred/series/observations"

app = Flask(__name__)
CORS(app)

def fetch_fred_series(series_id):
    url = FRED_BASE
    params = {
        "api_key": FRED_API_KEY,
        "series_id": series_id,
        "file_type": "json",
        "sort_order": "desc",
        "limit": 1,
    }
    response = requests.get(url, params=params)
    data = response.json()
    obs = data["observations"][0]
    return {
        "value": obs["value"],
        "date": obs["date"]
    }
    
@app.route("/economy", methods=["GET"])
def get_economy_data():
    data = {
        "unemployment_rate": fetch_fred_series("UNRATE"),
        "nonfarm_payrolls": fetch_fred_series("PAYEMS"),
        "gdp_growth_qoq": fetch_fred_series("A191RL1Q225SBEA")
    }
    return jsonify(data)

def get_video_id(youtube_url):
    parsed = urlparse(youtube_url)
    if parsed.hostname == 'youtu.be':
        return parsed.path.lstrip('/')
    if parsed.hostname in ('www.youtube.com', 'youtube.com'):
        return parse_qs(parsed.query).get('v', [None])[0]
    return None

@app.route('/transcript', methods=['POST'])
def transcript():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'Missing YouTube URL'}), 400

    try:
        video_id = get_video_id(url)
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=['en'])
        text = " ".join([t.text.strip() for t in transcript])
        return jsonify({'transcript': text})
    except TranscriptsDisabled:
        return jsonify({'error': 'This video has captions disabled'}), 400
    except NoTranscriptFound:
        return jsonify({'error': 'No transcript found for this video'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
