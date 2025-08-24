import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import GlobalNews from "./components/news/News";
import TranscriptTool from "./components/transcript/Transcript";

import "./App.css";
import EconomySection from "./components/economy/Economy";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<GlobalNews />} />
          <Route path="/news" element={<GlobalNews />} />
          <Route path="/transcript" element={<TranscriptTool />} />
          <Route path="/economy" element={<EconomySection />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
