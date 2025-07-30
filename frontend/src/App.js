import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const fetchTranscript = async () => {
    setTranscript("");
    setError("");
    try {
      const res = await fetch("http://localhost:5000/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setTranscript(data.transcript);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <div className="App">
      <h2>YouTube Transcript Generator</h2>
      <input
        type="text"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={fetchTranscript}>Get Transcript</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {transcript && <textarea rows={45} value={transcript} readOnly />}
      <button onClick={() => navigator.clipboard.writeText(transcript)}>
        copy transcript
      </button>
    </div>
  );
}

export default App;
