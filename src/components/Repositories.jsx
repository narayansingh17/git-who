import { Star, GitFork } from "lucide-react";

export default function Repositories({ repos }) {
  let totalStars = 0;
  let totalForks = 0;
  repos.map((repo) => {
    //if (!repo.fork) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    //}
  });
  const sortedRepos = repos
    .slice()
    .sort((a, b) => Number(b.stargazers_count) - Number(a.stargazers_count));
  const topFiveRepos = sortedRepos.slice(0, 5);
  console.log(topFiveRepos);

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
