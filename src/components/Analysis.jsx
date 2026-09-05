import { useState, useEffect, useRef } from "react";
import Profile from "./Profile";
import Repositories from "./Repositories";
import Activity from "./Activity";
import ContributionHeatmap from "./ContributionHeatmap";
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
    <main className="main-layout" style={{ backgroundColor: "#151d29" }} ref={analysisRef}>
      <nav className="tabs">
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
          <div
            key={i}
            style={
              activeTab === i + 1
                ? { backgroundColor: "#2a3038", cursor: "pointer" }
                : { cursor: "pointer" }
            }
            className={activeTab === 1 ? "profile-div" : ""}
            onClick={() => handleActive(i + 1)}
          >
            {tab}
          </div>
        ))}
      </nav>
      {activeTab == 1 && <Profile user={user} />}
      {activeTab === 2 && <Repositories repos={repos} />}
      {activeTab === 3 && <Activity events={events} contributions={contributions} />}
      {activeTab === 4 && <Summary user={user} repos={repos} events={events} contributions={contributions} />}
    </main>
  );
}
