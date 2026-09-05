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
  const [error, setError] = useState(null);

  async function handleSubmit(query) {
    try {
      if (!query.trim()) {
        setError("Please enter a GitHub username.");
        return;
      }

      setError(null);
      setUser(null);
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/github/user/${query}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "User not found.");
        setLoading(false);
        return;
      }


      const response_r = await fetch(
        `http://localhost:5000/api/github/user/${query}/repos?per_page=100`,
      );
      const repoData = await response_r.json();
      if (!response_r.ok) {
        setError(repoData.error || "User not found.");
        setLoading(false);
        return;
      }

      const response_e = await fetch(
        `http://localhost:5000/api/github/user/${query}/events/public?per_page=100`,
      );
      const eventData = await response_e.json();
      if (!response_e.ok) {
        setError(eventData.error || "User not found.");
        setLoading(false);
        return;
      }

      const response_c = await fetch(`http://localhost:5000/api/github/user/${query}/contributions`);
      const contributionsData = await response_c.json();
      if (!response_c.ok) {
        setError(contributionsData.error || "User not found.");
        setLoading(false);
        return;
      }

      setUser(data);
      setRepos(repoData);
      setEvents(eventData);
      setContributions(contributionsData);
      setLoading(false);
    }
    catch (error) {
      setError("An error occurred while fetching user data.");
      setLoading(false);
    }
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
