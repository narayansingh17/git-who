export default function Hero() {
  return (
    <div className="hero-left">
      <h1 style={{ fontSize: "50px", textAlign: "center" }}>
        <span style={{ display: "block", textAlign: "center" }}>
          Understand any GitHub
        </span>{" "}
        profile at a glance
      </h1>
      <p>
        Analyze repositories, coding activity, languages, and developer patterns
        from a single GitHub username.
      </p>
      <input
        type="text"
        placeholder="Enter profile name."
        className="search-bar"
      ></input>
    </div>
  );
}
