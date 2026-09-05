import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



app.get("/api/github/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "GitHub API request failed",
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error",
        });
    }
});

app.get("/api/github/user/:username/repos", async (req, res) => {
    const { username } = req.params;

    // GitHub's maximum is 100 per page.
    // We loop through pages until the response has fewer than PER_PAGE items,
    // which means we've reached the last page.
    // MAX_PAGES is a safety cap so we never make more than 10 GitHub requests
    // for one user (covers up to 1,000 repos).
    const PER_PAGE = 100;
    const MAX_PAGES = 10;

    try {
        const allRepos = [];
        let page = 1;

        while (page <= MAX_PAGES) {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?per_page=${PER_PAGE}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                        Accept: "application/vnd.github+json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({
                    error: data.message || "GitHub API request failed",
                });
            }

            allRepos.push(...data);

            // Fewer than PER_PAGE results means this was the last page.
            if (data.length < PER_PAGE) {
                break;
            }

            page++;
        }

        res.json(allRepos);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error",
        });
    }
});


app.get("/api/github/user/:username/events/public", async (req, res) => {
    const { username } = req.params;
    const { per_page } = req.query;

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=${per_page || 30}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "GitHub API request failed",
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error",
        });
    }
});

app.get("/api/github/user/:username/contributions", async (req, res) => {
    const { username } = req.params;

    const query = `
        query($login: String!) {
            user(login: $login) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                                contributionLevel
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: {
                    login: username,
                },
            }),
        });

        const data = await response.json();

        if (data.errors) {
            return res.status(400).json({
                error: data.errors[0].message,
            });
        }

        // GitHub returns data.user as null when the user exists but
        // their contributions are not accessible (e.g. suspended account).
        if (!data.data?.user) {
            return res.status(404).json({
                error: "Contribution data not available for this user.",
            });
        }

        res.json(data.data.user.contributionsCollection);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch contributions",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});