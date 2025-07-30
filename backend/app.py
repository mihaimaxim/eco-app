from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app)

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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
