import "./App.css";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Analysis from "./components/Analysis";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useState(null);
  const [error, setError] = useState(null); // null means no error

  async function handleSubmit(query) {
    // ── Guard: do nothing if the username field is empty ─────────────────────
    if (!query.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setError(null);
    setUser(null);
    setLoading(true);

    // ── 1. Fetch user profile (with error handling — reference pattern) ───────
    //
    // Step 1: Call fetch(). This only fails if the network itself is down.
    //         It does NOT throw on 404 or other HTTP errors — we must check manually.
    const response = await fetch(`http://localhost:5000/api/github/user/${query}`);

    // Step 2: Parse the JSON body regardless of status.
    //         GitHub's API always returns JSON, even for errors (e.g. { message: "Not Found" }).
    const data = await response.json();

    // Step 3: Check the HTTP status code.
    //         response.ok is true for 200–299, false for 404, 403, 500, etc.
    if (!response.ok) {
      // data.error is set by our server (see server/index.js)
      setError(data.error || "User not found.");
      setLoading(false);
      return; // Stop here — no point fetching repos/events for a non-existent user
    }

    // ── 2-4. Remaining fetches (no error handling yet — same pattern applies) ─
    const response_r = await fetch(
      `http://localhost:5000/api/github/user/${query}/repos?per_page=100`,
    );
    const repoData = await response_r.json();
    const response_e = await fetch(
      `http://localhost:5000/api/github/user/${query}/events/public?per_page=100`,
    );
    const eventData = await response_e.json();
    const response_c = await fetch(`http://localhost:5000/api/github/user/${query}/contributions`);
    const contributionsData = await response_c.json();

    setUser(data);
    setRepos(repoData);
    setEvents(eventData);
    setContributions(contributionsData);
    setLoading(false);
  }

  return (
    <div className="app-container">
      <Navbar />
      <LandingPage
        query={query}
        onSetQuery={setQuery}
        handleSubmit={handleSubmit}
      />
      {/* Show error message if a search failed */}
      {error && (
        <p style={{ textAlign: "center", color: "#f87171", marginTop: "16px" }}>
          {error}
        </p>
      )}
      {loading && <p style={{ textAlign: "center", color: "#ffffffff", marginTop: "16px" }}>Loading...</p>}
      {user && <Analysis user={user} repos={repos} events={events} query={query} contributions={contributions} />}
    </div>
  );
}

export default App;
