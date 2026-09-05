import { Star, GitFork } from "lucide-react";
import { useMemo } from "react";

export default function Repositories({ repos = [] }) {
  if (repos === null) {
    return <div className="activity-tab">Loading repositories…</div>;
  }
  if (!Array.isArray(repos)) {
    return <div className="activity-tab">Could not load repository data.</div>;
  }


  if (repos.length === 0) {
    return (
      <div className="activity-tab">
        No public repositories found for this user.
      </div>
    );
  }
  const topFiveRepos = useMemo(() => {
    if (!Array.isArray(repos)) return [];
    return repos
      .slice()
      .sort((a, b) => Number(b.stargazers_count) - Number(a.stargazers_count))
      .slice(0, 5);
  }, [repos]);
  let totalStars = 0;
  let totalForks = 0;
  const languages = new Map();
  repos.forEach((repo) => {
    //if (!repo.fork) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.language) {
      languages.has(repo.language)
        ? languages.set(repo.language, languages.get(repo.language) + 1)
        : languages.set(repo.language, 1);
    }
    //}
  });
  const boxStyle = {
    fontWeight: "400",
    fontSize: "15px",
    margin: "5px 0px",
    color: "lightgrey",
  };
  const sortedLanguagesArray = [...languages.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  console.log(sortedLanguagesArray);
  console.log(topFiveRepos);

  // useEffect(() => {
  //   // 1. Defensive Guard: GitHub API requires 'owner/repo' format (full_name).
  //   // Prevents querying undefined endpoints if a repo object is incomplete.
  //   let isMounted = true;
  //   if (!topFiveRepos || topFiveRepos.length === 0) {
  //     return;
  //   }
  //   async function getLanguages(topFiveRepos) {
  //     try {
  //       const languageData = {};

  //       //fetch all top 5 repo languages concurrently
  //       const fetchPromises = topFiveRepos.map(async (repo) => {
  //         if (!repo.full_name) return null;
  //         const res = await fetch(
  //           `https://api.github.com/repos/${repo.full_name}/languages`,
  //         );
  //         if (!res.ok) return null;
  //         return res.json();
  //       });
  //       // 2. Parallel Requests: Promise.all dispatches all 5 API calls simultaneously
  //       // rather than sequentially (waterfall), reducing total fetch wait time.
  //       const results = await Promise.all(fetchPromises);
  //       // 3. Race Condition & Unmount Guard: If a new query starts or the component
  //       // unmounts before requests finish, isMounted ensures slow/stale network responses
  //       // are discarded instead of overwriting current state.
  //       if (!isMounted) return;

  //       results.forEach((langs) => {
  //         if (langs) {
  //           for (const [lang, bytes] of Object.entries(langs)) {
  //             languageData[lang] = (languageData[lang] || 0) + bytes;
  //           }
  //         }
  //       });
  //       console.log(languageData);
  //       setLanguageBytes(languageData);
  //     } catch (err) {
  //       console.error("Error fetching repository languages: ", err);
  //     }
  //   }

  //   getLanguages(topFiveRepos);

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [topFiveRepos]);

  return (
    <div className="repositories">
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Repository overview:
      </span>
      <div className="repository-stats">
        <Stat>Repositories: {repos.length}</Stat>
        <Stat>
          Stars <Star size={16} />: {totalStars}
        </Stat>
        <Stat>
          Forks
          <GitFork size={16} />: {totalForks}
        </Stat>
      </div>
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Top 5 repositories:
        <div className="top-five">
          {topFiveRepos.map((repo, i) => {
            return (
              <div className="top-five-repo" key={repo.name}>
                {repo.name}{" "}
                {i == 0 && repo.stargazers_count != 0 ? <Star size={16} /> : ""}
                {repo.description && <div style={{ fontWeight: "400", fontSize: "medium" }}>
                  {repo.description}
                </div>}
                <div style={boxStyle}>
                  Stars: {repo.stargazers_count} &middot; Forks:{" "}
                  {repo.forks_count}
                </div>
                <div style={boxStyle}>Primary Language: {repo.language ? repo.language : "Not specified"}</div>
                <div style={boxStyle}>
                  Last updated:{" "}
                  {new Date(repo.updated_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  style={{
                    fontWeight: "400",
                    fontSize: "15px",
                    margin: "5px 0px",
                    color: "white",
                  }}
                >
                  Link to repository↗
                </a>
              </div>
            );
          })}
        </div>
      </span>
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Language breakdown (top languages):
        <div className="languages">
          {sortedLanguagesArray.map((lang) => {
            return <span className="langs" key={lang[0]}>{lang[0]}</span>;
          })}
        </div>
      </span>
    </div>
  );
}
function Stat({ children, style }) {
  return (
    <span className="repository-stat" style={style}>
      {children}
    </span>
  );
}
