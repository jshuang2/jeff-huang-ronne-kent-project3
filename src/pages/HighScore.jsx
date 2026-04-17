export default function HighScore() {
  return (
    <div className="content">
      <h1>Are You Better Than Everyone Else?</h1>
      <p className="space-bottom-paragraph">
        See where you stand in the world of Math, But Annoying
      </p>

      <table className="scores-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>I Am Groot</td>
            <td>1000000000000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Tony Stark</td>
            <td>780</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Thanos</td>
            <td>5</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}