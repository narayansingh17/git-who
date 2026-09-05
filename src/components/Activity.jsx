// Activity.jsx
// Receives the `events` array fetched from:
// GET https://api.github.com/users/{username}/events/public
// (up to 100 most-recent public events, last ~90 days)
import ContributionHeatmap from "./ContributionHeatmap";
export default function Activity({ events, contributions }) {
  // --- Loading state ---
  if (events === null) {
    return <div className="activity-tab">Loading activity…</div>;
  }

  // --- API error state (GitHub returns { message: "..." } on errors) ---
  if (!Array.isArray(events)) {
    return <div className="activity-tab">Could not load activity data.</div>;
  }

  // --- Empty state ---
  if (events.length === 0) {
    return (
      <div className="activity-tab">
        No public activity found for this user.
      </div>
    );
  }

  // ─── Derived counts ──────────────────────────────────────────────────────
  let pushCount = 0;
  let prCount = 0;
  let issueCount = 0;

  events.forEach((event) => {
    if (event.type === "PushEvent") pushCount++;
    if (event.type === "PullRequestEvent") prCount++;
    if (event.type === "IssuesEvent") issueCount++;
  });

  // ─── Timeline: last 10 events ─────────────────────────────────────────────
  const recentEvents = events.slice(0, 10);

  // Human-readable labels for event types
  function describeEvent(event) {
    const repo = event.repo?.name || "unknown repo";
    switch (event.type) {
      case "PushEvent": {
        const commitCount = event.payload?.commits?.length || 1;
        return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repo}`;
      }
      case "PullRequestEvent": {
        const action = event.payload?.action || "opened";
        return `${capitalize(action)} a pull request in ${repo}`;
      }
      case "IssuesEvent": {
        const action = event.payload?.action || "opened";
        return `${capitalize(action)} an issue in ${repo}`;
      }
      case "IssueCommentEvent":
        return `Commented on an issue in ${repo}`;
      case "WatchEvent":
        return `Starred ${repo}`;
      case "ForkEvent":
        return `Forked ${repo}`;
      case "CreateEvent": {
        const refType = event.payload?.ref_type || "repository";
        return `Created a ${refType} in ${repo}`;
      }
      case "DeleteEvent": {
        const refType = event.payload?.ref_type || "branch";
        return `Deleted a ${refType} in ${repo}`;
      }
      case "PublicEvent":
        return `Made ${repo} public`;
      case "MemberEvent":
        return `Added a collaborator to ${repo}`;
      case "ReleaseEvent":
        return `Published a release in ${repo}`;
      case "PullRequestReviewEvent":
        return `Reviewed a pull request in ${repo}`;
      case "PullRequestReviewCommentEvent":
        return `Commented on a pull request in ${repo}`;
      default:
        return `${event.type.replace("Event", "")} in ${repo}`;
    }
  }

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="activity-tab">
      {/* 1. Overview stat boxes - same style as Repository overview */}
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Recent activity overview:
      </span>
      <div className="repository-stats">
        <span
          className="repository-stat"
          style={{ flexDirection: "column", fontSize: "13px" }}
        >
          <span style={{ fontWeight: "600", fontSize: "20px" }}>
            {events.length}
          </span>
          Recent events
        </span>
        <span
          className="repository-stat"
          style={{ flexDirection: "column", fontSize: "13px" }}
        >
          <span style={{ fontWeight: "600", fontSize: "20px" }}>
            {pushCount}
          </span>
          Pushes
        </span>
        <span
          className="repository-stat"
          style={{ flexDirection: "column", fontSize: "13px" }}
        >
          <span style={{ fontWeight: "600", fontSize: "20px" }}>{prCount}</span>
          Pull Requests
        </span>
        <span
          className="repository-stat"
          style={{ flexDirection: "column", fontSize: "13px" }}
        >
          <span style={{ fontWeight: "600", fontSize: "20px" }}>
            {issueCount}
          </span>
          Issues
        </span>
      </div>

      {/* 2. Activity heatmap - reuses existing .activity-grid / .activity / .level-N CSS
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Activity (last 70 days):
      </span>
      <div className="activity-heatmap-wrapper">
        <div className="activity-grid activity-grid--large">
          {heatmapDays.map((dateKey) => (
            <div
              key={dateKey}
              className={`activity level-${countToLevel(dateCounts[dateKey])}`}
              title={`${dateKey}: ${dateCounts[dateKey] || 0} event${dateCounts[dateKey] !== 1 ? "s" : ""}`}
            />
          ))}
        </div>
      </div> */}

      <ContributionHeatmap contributions={contributions} />

      {/* 4. Recent activity timeline */}
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Recent activity:
      </span>
      <div className="activity-timeline">
        {recentEvents.map((event) => (
          <div className="activity-timeline-item" key={event.id}>
            <span className="timeline-description">{describeEvent(event)}</span>
            <span className="timeline-date">
              {formatDate(event.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
