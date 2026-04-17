import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Homepage from "./pages/Homepage";
import GamePage from "./pages/GamePage";
import EasyGame from "./pages/EasyGame";
import NormalGame from "./pages/NormalGame";
import Rules from "./pages/Rules";
import HighScore from "./pages/HighScore";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/games/easy" element={<EasyGame />} />
        <Route path="/games/normal" element={<NormalGame />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/scores" element={<HighScore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}