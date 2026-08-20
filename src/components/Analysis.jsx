import { useState } from "react";
import Profile from "./Profile";
import Repositories from "./Repositories";

export default function Analysis({ user, repos }) {
  const [activeTab, setActiveTab] = useState(2);
  const tabs = ["Profile", "Repositories", "Activity", "Summary"];

  function handleActive(number) {
    setActiveTab(number);
  }

  return (
    <main className="main-layout" style={{ backgroundColor: "#151d29" }}>
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
            style={activeTab === i + 1 ? { backgroundColor: "#2a3038" } : {}}
            className={activeTab === 1 ? "profile-div" : ""}
            onClick={() => handleActive(i + 1)}
          >
            {tab}
          </div>
        ))}
      </nav>
      {activeTab == 1 && <Profile user={user} />}
      {activeTab === 2 && <Repositories repos={repos} />}
    </main>
  );
}
