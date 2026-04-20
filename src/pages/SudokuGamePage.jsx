import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SudokuProvider from "../components/SudokuProvider";
import SudokuBoard from "../components/SudokuBoard";

export default function SudokuGamePage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [username, setUsername] = useState("");
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
    let ignore = false;

    async function loadAuthState() {
      try {
        const authResponse = await fetch("/api/user/isLoggedIn", {
          credentials: "include",
        });
        const authData = await authResponse.json().catch(() => ({}));

        if (!ignore && authResponse.ok && authData.username) {
          setUsername(authData.username);
        }
      } catch {
        if (!ignore) {
          setUsername("");
        }
      }
    }

    loadAuthState();
    loadGame();

    return () => {
      ignore = true;
    };
  }, [loadGame]);

  const isLoggedIn = Boolean(username);
  const isCompletedForUser = useMemo(() => {
    if (!game || !username) {
      return false;
    }

    return game.completedBy?.includes(username);
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
          {" "}
          <span>TODO-JEFF: wire this to the final auth/session API contract.</span>
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
