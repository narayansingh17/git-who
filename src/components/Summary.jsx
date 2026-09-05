// Summary.jsx
// The analytical tab of GitWho.
//
// Props (all already fetched in App.jsx — no new API calls):
//   user          — GitHub REST user object
//   repos         — array of repo objects (up to 100)
//   events        — array of public event objects (up to 100)
//   contributions — { contributionCalendar: { totalContributions, weeks[] } }

import { useMemo } from "react";

// ─── Helper functions ────────────────────────────────────────────────────────

// Return the key whose value is highest in a Map.
function maxKey(map) {
  let bestKey = null;
  let bestVal = -1;
  map.forEach((val, key) => {
    if (val > bestVal) {
      bestVal = val;
      bestKey = key;
    }
  });
  return bestKey;
}

// Format a date string like "Sep 2024".
function formatMonthYear(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// How many months ago was this date?
function monthsAgo(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return (
    (now.getFullYear() - then.getFullYear()) * 12 +
    (now.getMonth() - then.getMonth())
  );
}

// ─── Derived data hook ───────────────────────────────────────────────────────

function useSummaryData(user, repos, events, contributions) {
  return useMemo(() => {
    // ── Repos ────────────────────────────────────────────────────────────────
    const safeRepos = Array.isArray(repos) ? repos : [];

    let totalStars = 0;
    let totalForks = 0;
    let mostStarredRepo = null;
    let mostForkedRepo = null;
    let mostRecentRepo = null;
    let activeCount = 0;
    let inactiveCount = 0;
    let archivedCount = 0;
    let originalCount = 0;
    let forkedCount = 0;
    const languageMap = new Map(); // language -> repo count

    safeRepos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      if (!mostStarredRepo || repo.stargazers_count > mostStarredRepo.stargazers_count) {
        mostStarredRepo = repo;
      }
      if (!mostForkedRepo || repo.forks_count > mostForkedRepo.forks_count) {
        mostForkedRepo = repo;
      }
      if (!mostRecentRepo || new Date(repo.pushed_at) > new Date(mostRecentRepo.pushed_at)) {
        mostRecentRepo = repo;
      }

      if (repo.archived) {
        archivedCount++;
      } else if (monthsAgo(repo.pushed_at) <= 2) {
        activeCount++;
      } else {
        inactiveCount++;
      }

      if (repo.fork) {
        forkedCount++;
      } else {
        originalCount++;
      }

      if (repo.language) {
        languageMap.set(
          repo.language,
          (languageMap.get(repo.language) || 0) + 1
        );
      }
    });

    const avgStars =
      safeRepos.length > 0
        ? (totalStars / safeRepos.length).toFixed(1)
        : "0";

    // Top languages sorted by repo count (show up to 6)
    const sortedLanguages = [...languageMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const reposWithLanguage = safeRepos.filter((r) => r.language).length;
    const primaryLanguage = sortedLanguages.length > 0 ? sortedLanguages[0][0] : null;

    // ── Events ───────────────────────────────────────────────────────────────
    const safeEvents = Array.isArray(events) ? events : [];

    const eventTypeMap = new Map();
    const repoEventMap = new Map(); // repo name -> event count

    safeEvents.forEach((event) => {
      const type = event.type || "Unknown";
      eventTypeMap.set(type, (eventTypeMap.get(type) || 0) + 1);

      const repoName = event.repo?.name;
      if (repoName) {
        repoEventMap.set(repoName, (repoEventMap.get(repoName) || 0) + 1);
      }
    });

    const mostActiveRepoName = maxKey(repoEventMap);
    // Strip "owner/" prefix for display
    const mostActiveRepoShort = mostActiveRepoName
      ? mostActiveRepoName.split("/").pop()
      : null;

    const mostCommonEventType = maxKey(eventTypeMap);
    const mostCommonEventLabel = mostCommonEventType
      ? mostCommonEventType.replace("Event", "")
      : null;

    const lastEventDate =
      safeEvents.length > 0 ? safeEvents[0].created_at : null;

    // ── Contributions ────────────────────────────────────────────────────────
    const calendar = contributions?.contributionCalendar;
    const weeks = calendar?.weeks;
    const totalContributions = calendar?.totalContributions ?? null;

    let mostActiveMonth = null;
    let longestStreak = 0;
    let currentStreak = 0;
    let recentThirtyDayTotal = 0;

    if (Array.isArray(weeks)) {
      // Flatten all days once — we need them for streak and recent totals
      const allDays = weeks.flatMap((w) => w.contributionDays);

      // Most active month: sum contributionCount by "YYYY-MM"
      const monthTotals = new Map();
      allDays.forEach((day) => {
        const month = day.date.slice(0, 7); // "YYYY-MM"
        monthTotals.set(month, (monthTotals.get(month) || 0) + day.contributionCount);
      });
      const bestMonth = maxKey(monthTotals);
      mostActiveMonth = bestMonth ? formatMonthYear(bestMonth + "-01") : null;

      // Longest streak
      allDays.forEach((day) => {
        if (day.contributionCount > 0) {
          currentStreak++;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });

      // Recent 30-day total
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      allDays.forEach((day) => {
        if (new Date(day.date) >= thirtyDaysAgo) {
          recentThirtyDayTotal += day.contributionCount;
        }
      });
    }


    return {
      // Repo stats
      totalStars,
      totalForks,
      avgStars,
      mostStarredRepo,
      mostForkedRepo,
      mostRecentRepo,
      activeCount,
      inactiveCount,
      archivedCount,
      originalCount,
      forkedCount,
      repoCount: safeRepos.length,
      // Language
      sortedLanguages,
      reposWithLanguage,
      primaryLanguage,
      // Activity / events
      mostActiveRepoShort,
      mostCommonEventLabel,
      lastEventDate,
      eventCount: safeEvents.length,
      // Contributions
      totalContributions,
      mostActiveMonth,
      longestStreak,
      recentThirtyDayTotal,
    };
  }, [user, repos, events, contributions]);
}

// ─── Summary paragraph builder ──────────────────────────────────────────────
// Builds JSX with <strong> around the key values so they stand out

function buildSummaryJSX(data) {
  const nodes = []; // array of strings and JSX elements

  // Helper: push a text node
  function t(str) { nodes.push(str); }
  // Helper: push a <strong> node
  function b(str) { nodes.push(<strong key={nodes.length}>{str}</strong>); }

  if (data.primaryLanguage) {
    const topLangs = data.sortedLanguages.slice(0, 2).map((l) => l[0]);
    t("Primarily works with ");
    topLangs.forEach((lang, i) => {
      b(lang);
      if (i < topLangs.length - 2) t(", ");
      if (i === topLangs.length - 2) t(" and ");
    });
  }

  if (data.repoCount > 0) {
    t(nodes.length > 0 ? ", with " : "");
    b(String(data.repoCount));
    t(` public ${data.repoCount === 1 ? "repository" : "repositories"}`);
  }

  if (data.totalStars > 0) {
    t(" and ");
    b(data.totalStars.toLocaleString());
    t(` total ${data.totalStars === 1 ? "star" : "stars"}`);
  }

  if (data.mostStarredRepo && data.mostStarredRepo.stargazers_count > 0) {
    t(". Most popular project is ");
    b(data.mostStarredRepo.name);
  }

  if (data.mostActiveRepoShort) {
    t(", most recent activity in ");
    b(data.mostActiveRepoShort);
  }

  if (data.totalContributions !== null) {
    t(" — ");
    b(data.totalContributions.toLocaleString());
    t(` ${data.totalContributions === 1 ? "contribution" : "contributions"} in the last year`);
  }

  if (nodes.length === 0) return null;

  nodes.push(".");
  return nodes;
}

// ─── Small presentational helpers ────────────────────────────────────────────

// Stat card — matches the visual style of .repository-stat
function StatCard({ label, value }) {
  return (
    <span className="repository-stat" style={{ flexDirection: "column", fontSize: "13px" }}>
      <span style={{ fontWeight: "600", fontSize: "20px" }}>{value}</span>
      {label}
    </span>
  );
}

// A key–value insight row — like the activity trend rows
function InsightRow({ label, value }) {
  return (
    <div className="activity-trend-item">
      <span className="trend-label">{label}</span>
      <span className="trend-value">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Summary({ user, repos, events, contributions }) {
  const data = useSummaryData(user, repos, events, contributions);

  // Guard: no repos fetched yet
  if (!Array.isArray(repos)) {
    return <div className="summary">Loading summary…</div>;
  }

  if (repos.length === 0) {
    return (
      <div className="summary">
        <p>No public repositories found for this user — summary is unavailable.</p>
      </div>
    );
  }

  const hasContributions =
    contributions?.contributionCalendar != null &&
    data.totalContributions !== null;

  const hasEvents = data.eventCount > 0;

  return (
    <div className="summary">

      {/* ── 1. Human-readable summary paragraph ── */}
      {buildSummaryJSX(data) && (
        <div className="summary-paragraph">{buildSummaryJSX(data)}</div>
      )}

      {/* ── 2. Developer overview ── */}
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Developer overview:
      </span>
      <div className="repository-stats" style={{ flexWrap: "wrap" }}>
        <StatCard label="Public repos" value={data.repoCount} />

        <StatCard label="Avg stars / repo" value={data.avgStars} />
        {data.primaryLanguage && (
          <StatCard label="Primary language" value={data.primaryLanguage} />
        )}
        {hasContributions && (
          <StatCard
            label="Contributions (year)"
            value={data.totalContributions.toLocaleString()}
          />
        )}
      </div>

      <div className="activity-trends">
        {data.mostStarredRepo && data.mostStarredRepo.stargazers_count > 0 && (
          <InsightRow
            label="Most popular repository"
            value={
              <a
                href={data.mostStarredRepo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "white" }}
              >
                {data.mostStarredRepo.name} ({data.mostStarredRepo.stargazers_count.toLocaleString()} ★)
              </a>
            }
          />
        )}
        {data.mostForkedRepo && data.mostForkedRepo.forks_count > 0 && (
          <InsightRow
            label="Most forked repository"
            value={
              <a
                href={data.mostForkedRepo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "white" }}
              >
                {data.mostForkedRepo.name} ({data.mostForkedRepo.forks_count.toLocaleString()} forks)
              </a>
            }
          />
        )}
        {data.mostRecentRepo && (
          <InsightRow
            label="Recently active repository"
            value={
              <a
                href={data.mostRecentRepo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "white" }}
              >
                {data.mostRecentRepo.name} (pushed {formatMonthYear(data.mostRecentRepo.pushed_at)})
              </a>
            }
          />
        )}
        {hasEvents && data.mostActiveRepoShort && (
          <InsightRow
            label="Most active repository (recent events)"
            value={data.mostActiveRepoShort}
          />
        )}
      </div>

      {/* ── 3. Language profile ── */}
      {data.sortedLanguages.length > 0 && (
        <>
          <span style={{ fontWeight: "500", fontSize: "larger" }}>
            Language profile:
          </span>
          <div className="summary-section">
            {data.sortedLanguages.map(([lang, count]) => {
              const pct =
                data.reposWithLanguage > 0
                  ? Math.round((count / data.reposWithLanguage) * 100)
                  : 0;
              return (
                <div key={lang} className="language-info">
                  <span>{lang}</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span style={{ color: "lightgrey", fontSize: "12px" }}>
                    {count} {count === 1 ? "repo" : "repos"} · {pct}%
                  </span>
                </div>
              );
            })}
            <span style={{ color: "lightgrey", fontSize: "12px" }}>
              Based on primary language of each repository.
            </span>
          </div>
        </>
      )}

      {/* ── 4. Repository behaviour ── */}
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Repository behaviour:
      </span>
      <div className="activity-trends">
        <InsightRow label="Original repositories" value={data.originalCount} />
        <InsightRow label="Forked repositories" value={data.forkedCount} />
        <InsightRow
          label="Active (pushed within 6 months)"
          value={data.activeCount}
        />
        <InsightRow
          label="Inactive (not pushed in 6+ months)"
          value={data.inactiveCount}
        />
        <InsightRow label="Archived repositories" value={data.archivedCount} />
      </div>

      {/* ── 5. Activity insights ── */}
      {(hasContributions || hasEvents) && (
        <>
          <span style={{ fontWeight: "500", fontSize: "larger" }}>
            Activity insights:
          </span>
          <div className="activity-trends">
            {hasEvents && data.lastEventDate && (
              <InsightRow
                label="Last public event"
                value={new Date(data.lastEventDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            )}
            {hasEvents && data.mostCommonEventLabel && (
              <InsightRow
                label="Most common activity type"
                value={data.mostCommonEventLabel}
              />
            )}
            {hasContributions && data.mostActiveMonth && (
              <InsightRow
                label="Most active month (last year)"
                value={data.mostActiveMonth}
              />
            )}
            {hasContributions && (
              <InsightRow
                label="Contributions in last 30 days"
                value={data.recentThirtyDayTotal}
              />
            )}
            {hasContributions && data.longestStreak > 0 && (
              <InsightRow
                label="Longest contribution streak (last year)"
                value={`${data.longestStreak} ${data.longestStreak === 1 ? "day" : "days"}`}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
