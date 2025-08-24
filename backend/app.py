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

def fetch_fred_series(series_id, limit=300):
    url = FRED_BASE
    params = {
        "api_key": FRED_API_KEY,
        "series_id": series_id,
        "file_type": "json",
        "sort_order": "desc",
        "limit": limit,
    }
    response = requests.get(url, params=params)
    data = response.json()
    # obs = data["observations"][0]
    return [{
        "value": obs["value"],
        "date": obs["date"]
    }
            for obs in data["observations"]
            if obs["value"] != "."]
    
@app.route("/economy", methods=["GET"])
def get_economy_data():
    data = {
        "unemployment_rate": fetch_fred_series("UNRATE"),
        "nonfarm_payrolls": fetch_fred_series("PAYEMS"),
        "gdp_growth_qoq": fetch_fred_series("A191RL1Q225SBEA"),
        "initial_jobless_claims": fetch_fred_series("ICSA"),
        "continuing_jobless_claims": fetch_fred_series("CCSA")
    }
    return jsonify(data)

@app.route("/unemployment-trend",methods=["GET"])
def unemployment_trend():
    data = fetch_fred_series("UNRATE", limit=36)
    return jsonify(data)

@app.route("/nonfarm-payrolls", methods=["GET"])
def nonfarm_payrolls_trend():
    data = fetch_fred_series("PAYEMS", limit=72)
    return jsonify(data)

@app.route("/nonfarm-payrolls-change", methods=["GET"])
def nonfarm_payrolls_change():
    raw = fetch_fred_series("PAYEMS", limit=37)  # one extra for N-1 diffs
    import pandas as pd

    df = pd.DataFrame(raw)
    df["date"]  = pd.to_datetime(df["date"], errors="coerce")
    # convert strings like "159466" (or "159,466") to numbers
    df["value"] = (
        df["value"]
        .astype(str)
        .str.replace(",", "", regex=False)
        .pipe(pd.to_numeric, errors="coerce")
    )

    df = df.sort_values("date").dropna(subset=["date", "value"])
    df["change"] = df["value"].diff()

    out = df[["date","change"]].dropna().tail(72)
    return jsonify([
        {"date": d.strftime("%Y-%m-%d"), "value": float(v)}
        for d, v in zip(out["date"], out["change"])
    ])
    
@app.route("/initial-jobless-claims", methods=["GET"])    
def initial_jobless_claims():
    data = fetch_fred_series("ICSA", limit=52)
    return jsonify(data)


@app.route("/continuing-claims-trend", methods=["GET"])
def continuing_claims_trend():
    data = fetch_fred_series("CCSA", limit=52)
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
