import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SudokuProvider from "../components/SudokuProvider";
import SudokuBoard from "../components/SudokuBoard";
import { useAuth } from "../context/AuthContext";

export default function SudokuGamePage() {
  const { gameId } = useParams();
  const { username } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGame = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/sudoku/${gameId}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load game.");
      }

      setGame(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const isLoggedIn = Boolean(username);
  const isCompletedForUser = useMemo(() => {
    if (!game || !username) {
      return false;
    }
    return Boolean(game.isCompleted || game.completedBy?.includes(username));
  }, [game, username]);

  const allowInteraction = isLoggedIn && !isCompletedForUser;
  const showSolution = isCompletedForUser;

  async function handleBoardChange(payload) {
    if (!allowInteraction) {
      return;
    }

    try {
      const response = await fetch(`/api/sudoku/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save game.");
      }

      if (data) {
        setGame(data);
      }
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  function renderStatusMessage() {
    if (!isLoggedIn) {
      return (
        <p className="game-status">
          Logged-out users can browse games, but interaction is disabled until login.
        </p>
      );
    }

    if (isCompletedForUser) {
      return (
        <p className="game-status">
          You already completed this game, so the solved board is shown in read-only mode.
        </p>
      );
    }

    return (
      <p className="game-status">
        Fill the board without repeating values in any row, column, or sub-grid.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="content">
        <h1>Loading Game...</h1>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="content">
        <h1>Unable to Open Game</h1>
        <p className="page-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="content">
      <h1>{game.name}</h1>
      <p className="game-meta">
        {game.difficulty} puzzle created by {game.createdBy}
      </p>
      {error && <p className="page-error">{error}</p>}
      {renderStatusMessage()}

      <SudokuProvider
        game={game}
        mode={game.difficulty}
        allowInteraction={allowInteraction}
        showSolution={showSolution}
        onBoardChange={handleBoardChange}
      >
        <SudokuBoard />
      </SudokuProvider>
    </div>
  );
}