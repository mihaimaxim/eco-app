import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import GlobalNews from "./components/news/News";
import TranscriptTool from "./components/transcript/Transcript";
import LaborSection from "./components/labor/Labor";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<GlobalNews />} />
          <Route path="/news" element={<GlobalNews />} />
          <Route path="/transcript" element={<TranscriptTool />} />
          <Route path="/labor" element={<LaborSection />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
