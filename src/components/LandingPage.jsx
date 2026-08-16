import Hero from "./Hero";
import DashboardPrev from "./DashboardPrev";

export default function LandingPage({ query, handleSubmit, onSetQuery }) {
  return (
    <div className="landing-page">
      <Hero query={query} onSetQuery={onSetQuery} handleSubmit={handleSubmit} />
      <DashboardPrev />
    </div>
  );
}
