import { Search } from "lucide-react";

export default function Hero({ query, onSetQuery, handleSubmit }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(event.key);
      handleSubmit(query);
    }
  };
  return (
    <section className="hero-left" aria-labelledby="landing-title">
      <p className="hero-eyebrow">GitHub profile analytics</p>
      <h1 id="landing-title" className="landing-title">GitHub profiles, clearly analyzed</h1>
      <p className="landing-description">
        Analyze repositories, coding activity, languages, and developer patterns
        from a single GitHub username.
      </p>
      <div className="search-box">
        <Search className="search-icon" size={20} aria-hidden="true" />
        <input
          type="text"
          placeholder="Enter GitHub username"
          className="search-bar"
          value={query}
          onChange={(e) => {
            onSetQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          aria-label="GitHub username"
          autoComplete="off"
        />
        <button
          className="search-button"
          type="button"
          onClick={() => handleSubmit(query)}
          aria-label="Analyze GitHub profile"
        >
          <Search aria-hidden="true" />
        </button>
      </div>
      <p className="search-hint">Enter a public GitHub username to begin.</p>
    </section>
  );
}
