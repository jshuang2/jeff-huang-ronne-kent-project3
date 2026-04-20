import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Homepage from "./pages/Homepage";
import GamePage from "./pages/GamePage";
import Rules from "./pages/Rules";
import HighScore from "./pages/HighScore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SudokuGamePage from "./pages/SudokuGamePage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/game/:gameId" element={<SudokuGamePage />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/scores" element={<HighScore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
