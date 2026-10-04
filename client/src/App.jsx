import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import Players from "./pages/Players";
import Bracket from "./pages/Bracket";
import Ranking from "./pages/Ranking";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/players" element={<Players />} />
        <Route path="/bracket" element={<Bracket />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;