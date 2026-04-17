import "./RulesPageStyle.css";

export default function RulesPage() {
  return (
    <div className="content">
      <h1>Is this your first rodeo?</h1>
      <p>No worries, first step to endless frustration is just starting!</p>

      <h3>Official Sudoku Rules:</h3>
      <p>1. The puzzle is a 9x9 grid, sub-divided into nine 3x3 boxes.</p>
      <p>
        2. Each row, column, AND 3x3 grid must contain the numbers 1 through 9
        only and exactly once. There can be no repeating or there will be
        eternal shame and suffering.
      </p>
      <p className="space-bottom-paragraph">
        3. Your mission, should you choose to accept it, is to fill all empty
        cells based on the numbers already provided when you begin the game and
        complete the grid.
      </p>

      <p style={{ color: "#0707fad5" }}>note: hover over the image for a surprise</p>

      <div>
        <p className="space-bottom-paragraph"></p>
        <img
          src={`${import.meta.env.BASE_URL}assets/rules_art.png`}
          alt="rules pic"
          className="rules-img"
        />
      </div>

      <p className="space-bottom-paragraph">
        <a href="mailto:ronnekgrad@gmail.com">Email me</a>
      </p>

      <p className="space-bottom-paragraph">
        <a
          href="https://github.com/ronne-k"
          target="_blank"
          rel="noopener noreferrer"
        >
          Creator&apos;s GitHub
        </a>
      </p>

      <p>
        <a
          href="https://www.linkedin.com/in/satyanadella/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Creator&apos;s LinkedIn
        </a>
      </p>
    </div>
  );
}