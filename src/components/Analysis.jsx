import { MapPin, Calendar, Building, Globe } from "lucide-react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Analysis({ user }) {
  const [activeTab, setActiveTab] = useState(1);
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
      <div className="profile">
        <img src={user.avatar_url} className="profile-picture"></img>
        <div
          className="profile-details"
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <span style={{ fontSize: "27px", fontWeight: "600" }}>
            {user.name}
          </span>
          <span style={{ color: "lightgrey" }}>@{user.login}</span>
          <span>{user.bio} </span>
        </div>
      </div>
      <div className="key-stats">
        <div style={{ borderLeft: "2px solid #30363d" }}>
          Repositories: {user.public_repos}
        </div>
        <div>Followers: {user.followers}</div>
        <div>Following: {user.following}</div>
      </div>
      <div className="extra-info">
        {user.location && (
          <div style={{ display: "flex" }}>
            <MapPin />
            {user.location}
          </div>
        )}
        {user.created_at && (
          <div style={{ display: "flex" }}>
            <Calendar />
            <span style={{ fontWeight: "450", marginRight: "4px" }}>
              Date of joining:
            </span>{" "}
            {new Date(user.created_at).toLocaleDateString("en-GB")}
          </div>
        )}
        {user.company && (
          <div style={{ display: "flex" }}>
            <Building />
            {user.company}
          </div>
        )}
        {user.blog && (
          <a
            href={user.blog}
            target="_blank"
            style={{ display: "flex", color: "white" }}
          >
            <span>
              <Globe />
            </span>
            Website
          </a>
        )}
      </div>
      <div className="links">
        <div>Other links:</div>
        <div>
          <FaGithub />{" "}
          <a href={user.html_url} style={{ color: "white" }}>
            GitHub
          </a>
        </div>
        {user.twitter_username && (
          <div>
            <FaXTwitter />{" "}
            <a
              href={`https://x.com/${user.twitter_username}`}
              style={{ color: "white" }}
            >
              Twitter
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
