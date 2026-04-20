import { useEffect, useState } from "react";

export default function HighScore() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadScores() {
      try {
        const response = await fetch("/api/highscore");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load scores.");
        }

        if (!ignore) {
          setScores(Array.isArray(data) ? data : []);
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

    loadScores();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="content">
      <h1>Are You Better Than Everyone Else?</h1>
      <p className="space-bottom-paragraph">
        See where you stand in the world of Math, But Annoying
      </p>

      {error && <p className="page-error">{error}</p>}
      {loading && <p>Loading scores...</p>}
      {!loading && scores.length === 0 && (
        <p className="space-bottom-paragraph">
          No completed games yet. Finish a puzzle to claim the top spot.
        </p>
      )}

      <table className="scores-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score.username}>
              <td>{index + 1}</td>
              <td>{score.username}</td>
              <td>{score.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
