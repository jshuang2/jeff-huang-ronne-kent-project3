export default function HomePage() {
  return (
    <>
      <h1>Math, But Annoying</h1>
      <p>
        Welcome to the time-honored tradition of doing math, doing it
        incorrectly, doing it again, and then giving up.
      </p>

      <div>
        <img
          src={`${import.meta.env.BASE_URL}assets/homepage_art.png`}
          alt="sudoku pic"
          className="homepage-img"
        />
      </div>
    </>
  );
}