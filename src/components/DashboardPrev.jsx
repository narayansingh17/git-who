import octocat from "../assets/Octocat.jpg";

const languages = [
  { name: "JavaScript", percentage: 48 },
  { name: "CSS", percentage: 31 },
  { name: "HTML", percentage: 21 },
];
const activityLevels = [
  1, 3, 0, 2, 4, 2, 3, 2, 2, 0, 2, 3, 1, 2, 4, 0, 3, 0, 2, 3, 1, 0, 3, 1, 2, 0,
  0, 1, 4, 0,
];

export default function DashboardPrev() {
  return (
    <div className="dashboard-preview">
      <div className="mock-profile">
        <img src={octocat} className="mock-pic"></img>
        <div className="username">
          <span style={{ fontSize: "20px" }}>OctoCat</span>
          <span style={{ color: "lightgrey", fontSize: "14px" }}>@octo67</span>
        </div>
      </div>
      <div className="prev-box">
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          42 Repos &#183; 128 Stars &#183; 18 Forks
        </span>
      </div>

      <div className="languages">
        {languages.map((language) => (
          <div className="language-info" key={language.name}>
            <span style={{ fontSize: "18px" }}>{language.name}</span>

            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: `${language.percentage}%` }}
              ></div>
            </div>

            <span>{language.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="activity-grid">
        {activityLevels.map((level, index) => (
          <div key={index} className={`activity level-${level}`}></div>
        ))}
      </div>
    </div>
  );
}
