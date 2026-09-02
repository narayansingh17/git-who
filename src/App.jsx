import "./App.css";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Analysis from "./components/Analysis";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(query) {
    setLoading(true);
    const response = await fetch(`https://api.github.com/users/${query}`);
    const data = await response.json();
    const response_r = await fetch(
      `https://api.github.com/users/${query}/repos`,
    );
    const repoData = await response_r.json();

    setUser(data);
    setRepos(repoData);
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
      {user && <Analysis user={user} repos={repos} query={query} />}
    </div>
  );
}

export default App;
