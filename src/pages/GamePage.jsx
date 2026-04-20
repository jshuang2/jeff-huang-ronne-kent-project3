import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingDifficulty, setCreatingDifficulty] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadGames() {
      try {
        const response = await fetch("/api/sudoku");
        const data = await response.json();

        if (!ignore) {
          if (!response.ok) {
            throw new Error(data.error || "Unable to load games.");
          }

          setGames(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreateGame(difficulty) {
    setCreatingDifficulty(difficulty);
    setError("");

    try {
      const response = await fetch("/api/sudoku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ difficulty }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create game.");
      }

      navigate(`/game/${data.gameId}`);
    } catch (createError) {
      setError(createError.message);
    } finally {
      setCreatingDifficulty("");
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="content">
      <h1>Pick Your Level</h1>
      <p>Make a new puzzle or jump back into one from the archive.</p>

      <div className="game-actions">
        <button
          type="button"
          onClick={() => handleCreateGame("normal")}
          disabled={creatingDifficulty !== ""}
        >
          {creatingDifficulty === "normal" ? "Creating..." : "Create Normal Game"}
        </button>
        <button
          type="button"
          onClick={() => handleCreateGame("easy")}
          disabled={creatingDifficulty !== ""}
        >
          {creatingDifficulty === "easy" ? "Creating..." : "Create Easy Game"}
        </button>
      </div>

      {error && <p className="page-error">{error}</p>}
      {loading && <p>Loading games...</p>}

      <ul className="selection-list">
        {!loading && games.length === 0 && (
          <li className="selection-item">No games yet. Create the first one.</li>
        )}
        {games.map((game) => (
          <li className="selection-item" key={game.id}>
            <Link className="game-links" to={`/game/${game.id}`}>
              {game.name}
            </Link>
            <br />
            <span className="game-author">
              {game.difficulty} game by {game.createdBy} on {formatDate(game.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
