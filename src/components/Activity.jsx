// Activity.jsx
// Receives the `events` array fetched from:
// GET https://api.github.com/users/{username}/events/public
<<<<<<< HEAD
// (up to 100 most-recent public events, last ~90 days)
import ContributionHeatmap from "./ContributionHeatmap";
export default function Activity({ events, contributions }) {
=======
// (up to 30 most-recent public events, last ~90 days)

export default function Activity({ events }) {
>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc
  // --- Loading state ---
  if (events === null) {
    return <div className="activity-tab">Loading activity…</div>;
  }

  // --- API error state (GitHub returns { message: "..." } on errors) ---
  if (!Array.isArray(events)) {
<<<<<<< HEAD
    return <div className="activity-tab">Could not load activity data.</div>;
=======
    return (
      <div className="activity-tab">
        Could not load activity data.
      </div>
    );
>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc
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

<<<<<<< HEAD
=======
  // ─── Most active repository ───────────────────────────────────────────────
  // Count how many events each repo appears in, pick the highest.
  const repoCounts = {};
  events.forEach((event) => {
    const name = event.repo?.name;
    if (name) {
      repoCounts[name] = (repoCounts[name] || 0) + 1;
    }
  });
  const mostActiveRepo = Object.entries(repoCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // ─── Most active day of the week ─────────────────────────────────────────
  const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // index 0 = Sunday
  events.forEach((event) => {
    const day = new Date(event.created_at).getDay();
    dayCounts[day]++;
  });
  console.log(events.length)
  const mostActiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const mostActiveDay = DAY_NAMES[mostActiveDayIndex];

  // ─── Recent trend: last 7 days vs 7-30 days ──────────────────────────────
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  console.log(events.length)

  const last7 = events.filter(
    (e) => new Date(e.created_at) >= sevenDaysAgo
  ).length;
  console.log(last7)
  const prev7to30 = events.filter((e) => {
    const d = new Date(e.created_at);
    return d >= thirtyDaysAgo && d < sevenDaysAgo;
  }).length;

  let trendLabel;
  if (last7 > prev7to30) {
    trendLabel = "More active recently (last 7 days)";
  } else if (last7 < prev7to30) {
    trendLabel = "Less active recently (last 7 days)";
  } else {
    trendLabel = "Steady activity";
  }

  // ─── Heatmap: 10 weeks x 7 days = 70 cells ───────────────────────────────
  // Build a map of "YYYY-MM-DD" -> count from event dates.
  const dateCounts = {};
  events.forEach((event) => {
    // Slice to get just the date portion, e.g. "2025-08-15"
    const dateKey = event.created_at.slice(0, 10);
    dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
  });

  // Generate the last 70 days as an array of date strings, oldest first.
  const heatmapDays = [];
  for (let i = 69; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    // Build "YYYY-MM-DD" without timezone shifting
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    heatmapDays.push(key);
  }

  // Map event count to a visual level 0-4 (matches existing CSS classes)
  function countToLevel(count) {
    if (!count || count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  }

>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc
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
<<<<<<< HEAD
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
=======

      {/* 1. Overview stat boxes - same style as Repository overview */}
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Activity overview:
      </span>
      <div className="repository-stats">
        <span className="repository-stat" style={{ flexDirection: "column", fontSize: "13px" }}>
          <span style={{ fontWeight: "600", fontSize: "20px" }}>{events.length}</span>
          Recent events
        </span>
        <span className="repository-stat" style={{ flexDirection: "column", fontSize: "13px" }}>
          <span style={{ fontWeight: "600", fontSize: "20px" }}>{pushCount}</span>
          Pushes
        </span>
        <span className="repository-stat" style={{ flexDirection: "column", fontSize: "13px" }}>
          <span style={{ fontWeight: "600", fontSize: "20px" }}>{prCount}</span>
          Pull Requests
        </span>
        <span className="repository-stat" style={{ flexDirection: "column", fontSize: "13px" }}>
          <span style={{ fontWeight: "600", fontSize: "20px" }}>{issueCount}</span>
>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc
          Issues
        </span>
      </div>

<<<<<<< HEAD
      {/* 2. Activity heatmap - reuses existing .activity-grid / .activity / .level-N CSS
=======
      {/* 2. Activity heatmap - reuses existing .activity-grid / .activity / .level-N CSS */}
>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc
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
<<<<<<< HEAD
      </div> */}

      <ContributionHeatmap contributions={contributions} />
=======
      </div>


>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc

      {/* 4. Recent activity timeline */}
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Recent activity:
      </span>
      <div className="activity-timeline">
        {recentEvents.map((event) => (
          <div className="activity-timeline-item" key={event.id}>
            <span className="timeline-description">{describeEvent(event)}</span>
<<<<<<< HEAD
            <span className="timeline-date">
              {formatDate(event.created_at)}
            </span>
          </div>
        ))}
      </div>
=======
            <span className="timeline-date">{formatDate(event.created_at)}</span>
          </div>
        ))}
      </div>

>>>>>>> b57bdb31de2e427d6795fd24894189c43c1723cc
    </div>
  );
}
