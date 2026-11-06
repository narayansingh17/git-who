import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MapPin, Calendar, Building, Globe } from "lucide-react";

function formatJoinedDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function Profile({ user }) {
  const website = user.blog
    ? user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`
    : null;

  return (
    <section className="profile-panel" aria-label={`${user.login} profile`}>
      <div className="profile-hero">
        <img
          src={user.avatar_url}
          className="profile-picture"
          alt={`${user.login}'s GitHub avatar`}
        />
        <div className="profile-details">
          <p className="profile-kicker">GitHub profile</p>
          <h1 className="profile-name">{user.name || user.login}</h1>
          <a className="profile-handle" href={user.html_url} target="_blank" rel="noreferrer">
            @{user.login}
          </a>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
        <a className="profile-github-link" href={user.html_url} target="_blank" rel="noreferrer">
          <FaGithub aria-hidden="true" />
          <span>View GitHub profile</span>
        </a>
      </div>

      <div className="profile-metrics" aria-label="Profile statistics">
        <div className="profile-metric profile-metric--featured">
          <span className="profile-metric-value">{Number(user.public_repos || 0).toLocaleString()}</span>
          <span className="profile-metric-label">Public repositories</span>
        </div>
        <div className="profile-metric">
          <span className="profile-metric-value">{Number(user.followers || 0).toLocaleString()}</span>
          <span className="profile-metric-label">Followers</span>
        </div>
        <div className="profile-metric">
          <span className="profile-metric-value">{Number(user.following || 0).toLocaleString()}</span>
          <span className="profile-metric-label">Following</span>
        </div>
      </div>

      <div className="profile-information">
        <h2 className="section-title">Profile details</h2>
        <div className="profile-info-grid">
          {user.location && <div className="profile-info-item"><MapPin aria-hidden="true" /><span>{user.location}</span></div>}
          {user.company && <div className="profile-info-item"><Building aria-hidden="true" /><span>{user.company}</span></div>}
          {user.created_at && <div className="profile-info-item"><Calendar aria-hidden="true" /><span>Joined {formatJoinedDate(user.created_at)}</span></div>}
          {website && <a className="profile-info-item profile-info-link" href={website} target="_blank" rel="noreferrer"><Globe aria-hidden="true" /><span>{user.blog.replace(/^https?:\/\//, "")}</span></a>}
          {user.twitter_username && <a className="profile-info-item profile-info-link" href={`https://x.com/${user.twitter_username}`} target="_blank" rel="noreferrer"><FaXTwitter aria-hidden="true" /><span>@{user.twitter_username}</span></a>}
        </div>
      </div>
    </section>
  );
}
