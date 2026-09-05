// ContributionHeatmap.jsx
// Renders the GitHub-style contribution calendar returned by:
// GET /api/github/user/:username/contributions
// (GraphQL `contributionsCollection.contributionCalendar`)

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// GitHub's GraphQL enum -> the level-N classes already used elsewhere on the page
const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function formatCount(count) {
  return `${count} contribution${count === 1 ? "" : "s"}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ContributionHeatmap({ contributions }) {
  // --- Loading state ---
  if (contributions === null || contributions === undefined) {
    return <div className="activity-tab">Loading contributions…</div>;
  }

  const calendar = contributions.contributionCalendar;
  const weeks = calendar?.weeks;

  // --- Error / malformed data state ---
  if (!calendar || !Array.isArray(weeks)) {
    return (
      <div className="activity-tab">Could not load contribution data.</div>
    );
  }

  // --- Empty state ---
  if (weeks.length === 0) {
    return <div className="activity-tab">No contribution data found.</div>;
  }

  const totalContributions = calendar.totalContributions ?? 0;

  // Group weeks by the month of their first day.
  // We parse "YYYY-MM-DD" directly to avoid timezone issues with new Date().
  const monthGroups = [];
  let currentGroup = null;

  weeks.forEach((week) => {
    const firstDay = week.contributionDays[0]?.date;
    if (!firstDay) return;
    const [year, monthIndex] = firstDay.split("-").map(Number);
    const month = monthIndex - 1; // convert "09" -> 8 (zero-based)

    if (!currentGroup || currentGroup.month !== month || currentGroup.year !== year) {
      currentGroup = {
        label: MONTH_NAMES[month],
        month,
        year,
        weeks: [],
      };
      monthGroups.push(currentGroup);
    }
    currentGroup.weeks.push(week);
  });

  return (
    <div className="heatmap-card">
      <div className="heatmap-card-header">
        <span style={{ fontWeight: "500", fontSize: "larger" }}>
          Contribution activity:
        </span>
        <span className="heatmap-total">
          {totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-inner">
          <div className="heatmap-body">
            {/* Weekday labels — padding-top aligns Mon/Wed/Fri with the day rows */}
            <div className="heatmap-day-labels">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* One group per month, with a gap between groups */}
            <div className="heatmap-months-container">
              {monthGroups.map((group) => (
                <div
                  className="heatmap-month-group"
                  key={`${group.year}-${group.month}`}
                >
                  <span className="heatmap-month-label">{group.label}</span>
                  <div className="heatmap">
                    {group.weeks.map((week, wi) => (
                      <div className="heatmap-week" key={wi}>
                        {week.contributionDays.map((day) => (
                          <div
                            className={`heatmap-day level-${LEVEL_MAP[day.contributionLevel] ?? 0}`}
                            key={day.date}
                            title={`${formatCount(day.contributionCount)} on ${formatDate(day.date)}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div className={`heatmap-day level-${level}`} key={level} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default ContributionHeatmap;
