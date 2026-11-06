import { useState, useEffect, useRef } from "react";
import Profile from "./Profile";
import Repositories from "./Repositories";
import Activity from "./Activity";
import Summary from "./Summary";

export default function Analysis({ user, repos, events, contributions }) {
  const [activeTab, setActiveTab] = useState(1);
  const tabs = ["Profile", "Repositories", "Activity", "Summary"];
  const analysisRef = useRef(null);

  function handleActive(number) {
    setActiveTab(number);
  }


  useEffect(() => {
    if (user) {
      analysisRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [user])

  return (
    <main className="main-layout" ref={analysisRef}>
      <nav className="tabs" aria-label="Profile analysis sections" role="tablist">
        {/* <div style={{ backgroundColor: "grey" }} onClick={handleActive(1)}>Profile</div> */}
        {/* <div
          style={{ backgroundColor: "grey" }}
          onClick={() => handleActive(1)}
          className="profile-div"
        >
          Profile
        </div>
        <div>Repsitories</div>
        <div>Activity</div>
        <div>Summary</div> */}
        {tabs.map((tab, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={activeTab === i + 1}
            aria-controls="analysis-panel"
            id={`analysis-tab-${i + 1}`}
            className={`analysis-tab${activeTab === i + 1 ? " is-active" : ""}`}
            onClick={() => handleActive(i + 1)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="analysis-panel" role="tabpanel" tabIndex={0} id="analysis-panel" aria-labelledby={`analysis-tab-${activeTab}`} key={activeTab}>
        {activeTab === 1 && <Profile user={user} />}
        {activeTab === 2 && <Repositories repos={repos} />}
        {activeTab === 3 && <Activity events={events} contributions={contributions} />}
        {activeTab === 4 && <Summary user={user} repos={repos} events={events} contributions={contributions} />}
      </div>
    </main>
  );
}
