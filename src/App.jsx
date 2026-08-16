import "./App.css";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Analysis from "./components/Analysis";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(query) {
    setLoading(true);
    const response = await fetch(`https://api.github.com/users/${query}`);
    const data = await response.json();
    console.log(data);
    setUser(data);
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
      {user && <Analysis user={user} query={query} />}
    </div>
  );
}

export default App;
