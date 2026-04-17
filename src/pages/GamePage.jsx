import { Link } from "react-router-dom";

export default function GamesPage() {
  return (
    <div className="content">
      <h1>Pick Your Level</h1>
      <p>All roads lead to frustration.</p>

      <ul className="selection-list">
        <li className="selection-item">
          <Link className="game-links" to="/games/easy">
            Easy Peazy Lemon Squeezy
          </Link>
          <br />
          <span className="game-author">Author: Lemony Snickett</span>
        </li>

        <li className="selection-item">
          <Link className="game-links" to="/games/normal">
            Life Could Be A Dream
          </Link>
          <br />
          <span className="game-author">Author: John Lennon</span>
        </li>

        <li className="selection-item">
          <Link className="game-links" to="/games/normal">
            Potato PotAAAAAHHHHHHHHHHHHHHto
          </Link>
          <br />
          <span className="game-author">Author: JK Rolling-on-the-floor</span>
        </li>

        <li className="selection-item">
          <Link className="game-links" to="/games/normal">
            I&apos;m Not Playing Around
          </Link>
          <br />
          <span className="game-author">Author: Shiver Me Timbers</span>
        </li>
      </ul>
    </div>
  );
}