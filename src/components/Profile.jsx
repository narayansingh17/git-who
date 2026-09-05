import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MapPin, Calendar, Building, Globe } from "lucide-react";

export default function Profile({ user }) {
  return (
    <>
      <div className="profile">
        <img src={user.avatar_url} className="profile-picture"></img>
        <div
          className="profile-details"
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <span style={{ fontSize: "27px", fontWeight: "600" }}>
            {user.name || user.login}
          </span>
          <span style={{ color: "lightgrey" }}>@{user.login}</span>
          {user.bio && <span>{user.bio} </span>}
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
            href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
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
    </>
  );
}
