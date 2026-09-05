How GitWho Works

GitWho is a React + Vite app that turns a public GitHub username into a readable developer profile, using only GitHub's public REST API — no login or private data required.

1. Enter a GitHub Username

The user types a GitHub username into the search bar. GitWho validates the input and calls the GitHub REST API to fetch that user's public profile data.

2. Data Fetching

GitWho calls the GitHub API to pull:

Public profile info (avatar, name, bio, followers, following, location, company, website, join date, social links)
Public repositories (name, description, stars, forks, primary language, last updated date, repo link)
Public activity/events (recent commits, pull requests, issues, and other public GitHub events)

All calls respect GitHub's API rate limits and handle missing/optional fields gracefully (no broken UI for users with no bio, no website, no company, etc.).

3. Four Tabs of Insight

Once data is fetched, it's organized into four tabs:

Tab	What it shows
Profile	Avatar, name, bio, followers/following, location, company, join date, links
Repositories	Total repos, total stars/forks, top repositories, language breakdown
Activity	Recent public activity timeline, activity trends, contribution-style visualization
Summary	Auto-generated, factual analysis — primary language, most popular/active repo, language distribution, a plain-language written summary
4. Analysis, Not Guesswork

The Summary tab doesn't use AI or make subjective claims (like "expert" or "beginner"). It only derives insights directly from the fetched data — e.g., most-used language, total stars, most active repository — and presents them as a short factual write-up.