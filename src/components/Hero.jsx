import { Search } from "lucide-react";

export default function Hero({ query, onSetQuery, handleSubmit }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(event.key);
      handleSubmit(query);
    }
  };
  return (
    <div className="hero-left">
      <h1 style={{ fontSize: "50px", textAlign: "center" }}>
        <span style={{ display: "block", textAlign: "center" }}>
          Understand any GitHub
        </span>{" "}
        profile at a glance
      </h1>
      <p style={{ display: "block", textAlign: "center" }}>
        Analyze repositories, coding activity, languages, and developer patterns
        from a single GitHub username.
      </p>
      <div className="search-box">
        <Search className="search-icon" size={20} color="#000000" />
        <input
          type="text"
          placeholder="Enter GitHub username"
          className="search-bar"
          value={query}
          onChange={(e) => {
            onSetQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        ></input>
        <button
          className="search-button"
          onClick={() => handleSubmit(query)}
        >
          <Search />
        </button>
      </div>
    </div>
  );
}
