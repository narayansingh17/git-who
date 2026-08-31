import { Star, GitFork } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function Repositories({ repos }) {
  const [languageBytes, setLanguageBytes] = useState({});

  const topFiveRepos = useMemo(() => {
    return repos
      .slice()
      .sort((a, b) => Number(b.stargazers_count) - Number(a.stargazers_count))
      .slice(0, 5);
  }, [repos]);
  let totalStars = 0;
  let totalForks = 0;

  repos.map((repo) => {
    //if (!repo.fork) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    //}
  });

  console.log(topFiveRepos);

  useEffect(() => {
    let isMounted = true;
    async function getLanguages(topFiveRepos) {
      try {
        const languageData = {};

        //fetch all top 5 repo languages concurrently
        const fetchPromises = topFiveRepos.map(async (repo) => {
          if (!repo.full_name) return null;
          const res = await fetch(
            `https://api.github.com/repos/${repo.full_name}/languages`,
          );
          if (!res.ok) return null;
          return res.json();
        });

        const results = await Promise.all(fetchPromises);

        if (!isMounted) return;

        results.forEach((langs) => {
          if (langs) {
            for (const [lang, bytes] of Object.entries(langs)) {
              languageData[lang] = (languageData[lang] || 0) + bytes;
            }
          }
        });

        setLanguageBytes(languageData);
      } catch (err) {
        console.error("Error fetching repository languages: ", err);
      }
    }
    if (topFiveRepos.length > 0) {
      getLanguages();
    }
    return () => {
      isMounted = false;
    };
  }, [topFiveRepos]);
  console.log(languageBytes);
  return (
    <div className="repositories">
      <span style={{ fontWeight: "500", fontSize: "larger" }}>
        Repository insights:
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
          {topFiveRepos.map((repo) => {
            return (
              <div className="top-five-repo">
                {repo.name}
                <div style={{ fontWeight: "400", fontSize: "medium" }}>
                  {repo.description}
                </div>
                <div
                  style={{
                    fontWeight: "400",
                    fontSize: "15px",
                    margin: "5px 0px",
                    color: "lightgrey",
                  }}
                >
                  Stars: {repo.stargazers_count} &middot; Forks:{" "}
                  {repo.forks_count}
                </div>
                <div
                  style={{
                    fontWeight: "400",
                    fontSize: "15px",
                    margin: "5px 0px",
                    color: "lightgrey",
                  }}
                >
                  Primary Language: {repo.language}
                </div>
                <div
                  style={{
                    fontWeight: "400",
                    fontSize: "15px",
                    margin: "5px 0px",
                    color: "lightgrey",
                  }}
                >
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
        Language breakdown:
        <div>{}</div>
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
