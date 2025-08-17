import { useState } from "react";

function GlobalNews() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const fetchTranscript = async () => {
    setTranscript("");
    setError("");
    // try {
    //   const res = await fetch(
    //     "https://eco-backend-qmv1.onrender.com/transcript",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ url }),
    //     }
    //   );
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
    <section>
      {/* <p>pending</p> */}
      <h2>YouTube Transcript Generator</h2>
      {/* <p>
        daca se poate... un copy paste la un youtube url, o sa arunce o eroare -
        si daca se poate... o solutie solida si gratis
      </p> */}
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
      {transcript && <textarea rows={30} value={transcript} readOnly />}
      <button
        onClick={() => navigator.clipboard.writeText(transcript) && setUrl("")}
      >
        copy transcript
      </button>
    </section>
  );
}

export default GlobalNews;
