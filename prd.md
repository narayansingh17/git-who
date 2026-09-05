# GitWho — Product Requirements Document

## 1. Project Overview

GitWho is a React-based GitHub profile analyzer.

The user enters a GitHub username and GitWho fetches publicly available GitHub data and presents it through four tabs:

1. Profile
2. Repositories
3. Activity
4. Summary

The goal is to help users understand a GitHub developer at a glance instead of manually going through their GitHub profile and repositories.

---

# 2. Current Project Status

The following parts have already been implemented manually by the developer and MUST be treated as original authored work:

## Landing / Search
- GitHub username search
- GitHub API integration
- User/profile fetching
- Search UI
- Existing visual design

## Profile Tab
Currently displays:
- Profile avatar
- Name
- Username
- Bio
- Repository count
- Followers
- Following
- Location
- GitHub joining date
- Company
- Website
- GitHub profile link
- X/Twitter link
- Appropriate icons
- Conditional handling of optional profile information

## Repository Tab
Currently displays:
- Total repositories
- Total stars
- Total forks
- Top 5 repositories
- Repository name
- Description
- Stars
- Forks
- Primary language
- Last updated date
- Repository link
- Language breakdown

The existing design is intentionally dark and minimal.

---

# 3. CRITICAL DEVELOPMENT RULES

## Preserve Existing Work

The existing code is the developer's original implementation.

DO NOT:
- Rewrite existing components unnecessarily
- Replace existing logic with a different implementation
- Change existing component structure without a strong reason
- Change existing API logic unless required
- Change the visual design unnecessarily
- Rename existing variables/components merely for style
- Replace working code with a library-based solution
- Remove functionality that already works
- Introduce unnecessary abstractions

The objective is to EXTEND the existing application, not rebuild it.

If existing code can be reused, reuse it.

If a new implementation is required, integrate it around the existing code instead of replacing the existing implementation.

---

# 4. Technology Constraints

Prefer the technologies already present in the project.

Do not introduce a new framework, state-management library, data-fetching library, charting library, or major dependency unless it provides a clear benefit and is genuinely necessary.

Avoid unnecessary complexity.

The implementation should remain understandable to a developer who is currently learning React and JavaScript.

Do not over-engineer.

---

# 5. GitHub API Rules

Use the GitHub REST API where appropriate.

Do not invent API fields or endpoints.

Before implementing a feature:
- Inspect the existing API calls
- Reuse already fetched data whenever possible
- Avoid duplicate API requests
- Handle pagination where necessary
- Handle API errors
- Handle missing/optional data
- Respect GitHub API limitations

If a requested piece of information is not directly available from the existing API response, determine the appropriate GitHub API endpoint before implementing it.

---

# PHASE 1 — Activity Tab

## Goal

Build the Activity tab so that it communicates how actively the developer uses GitHub.

## Features

Implement:

### 1. Activity overview
Display useful high-level activity metrics such as:
- Recent activity
- Commits
- Pull requests
- Issues
- Other meaningful public GitHub activity where reliably available

Do not display metrics that cannot be reliably obtained from GitHub's public API.

### 2. Recent activity

Display a concise list/timeline of recent public GitHub activity.

Each activity item should provide useful context, such as:
- Event/activity type
- Repository
- Date/time
- Relevant action

Keep this readable rather than dumping raw API data.

### 3. Activity trends

Where the available data supports it, derive useful information such as:
- Most active period
- Activity frequency
- Recent activity trend

Derived metrics must be based on actual fetched data.

### 4. Contribution/activity visualization

If reliable public data is available, create a contribution/activity visualization similar in concept to a GitHub contribution heatmap.

Do NOT fake contribution numbers.

If GitHub's REST API does not provide the required contribution graph data directly, use an appropriate alternative based on publicly available GitHub data rather than inventing data.

## Requirements

- Reuse the existing GitHub username/profile data.
- Keep API calls efficient.
- Keep the UI consistent with the existing application.
- Do not redesign the existing Profile or Repository tabs.

## Completion condition

The Activity tab should be functional with real GitHub data and should handle:
- Empty activity
- API errors
- Missing data
- Different types of GitHub users

STOP after completing Phase 1.

Do not begin Phase 2 automatically.

---

# PHASE 2 — Summary Tab

## Goal

Turn GitHub data into meaningful developer-level insights.

The Summary tab should be the main analytical feature of GitWho.

## Features

### 1. Developer overview

Generate factual insights such as:
- Primary language
- Number of repositories
- Total stars
- Total forks
- Most popular repository
- Most active repository
- Recently active repository

### 2. Language profile

Analyze repository language data.

Display:
- Most-used languages
- Relative distribution
- Number of repositories per language where appropriate

Avoid presenting misleading percentages if the available data does not support them.

### 3. Repository behavior

Derive useful portfolio-level information such as:
- Active vs inactive repositories
- Archived repositories
- Most starred repository
- Most forked repository
- Recently updated repository
- Average stars per repository

### 4. Activity insights

Use Activity-tab data to derive meaningful observations where possible.

Examples:
- Recent activity level
- Most active period
- Commit/activity trends

Do not make subjective claims such as "expert", "beginner", "excellent developer", etc. unless there is a clearly defined scoring methodology.

### 5. Human-readable summary

Provide a concise factual summary of the developer.

Example style:

"Primarily works with JavaScript and TypeScript, with 12 public repositories and 340 total stars. Their most popular project is X, while most recent activity is concentrated around Y."

The summary must be generated from actual data.

Do not use an LLM/API for this unless explicitly requested later.

---

# PHASE 3 — Robustness & Edge Cases

## Goal

Make GitWho reliable for arbitrary public GitHub usernames.

Test and handle:

- Invalid username
- Non-existent user
- User with no repositories
- User with no followers
- User with no website
- User with no company
- User with no location
- User with no X/Twitter username
- Repositories without descriptions
- Repositories without a primary language
- Repositories with zero stars
- Users with many repositories
- Forked repositories
- Archived repositories
- Empty activity
- GitHub API errors
- API rate-limit errors where detectable

## Rules

Optional data should not produce:
- `undefined`
- `null`
- broken links
- broken UI
- empty labels with no purpose

Do not crash the application because one optional GitHub field is missing.

STOP after Phase 3.

---

# PHASE 4 — Performance & Code Quality

## Goal

Improve the implementation without rewriting the developer's existing work.

Inspect for:

- Unnecessary API calls
- Duplicate fetching
- Unnecessary re-renders
- Incorrect useEffect dependencies
- Mutating arrays/state accidentally
- Unnecessary `.sort()` mutations
- Missing loading states
- Missing error states
- Poor component boundaries

Only make changes where they provide a real benefit.

Do NOT perform a broad refactor.

Do NOT rewrite working components just to make them "cleaner".

STOP after Phase 4.

---

# PHASE 5 — Final UI Polish

## Goal

Polish the completed application while preserving the existing visual identity.

Check:

- Consistent spacing
- Typography
- Borders
- Active tab styling
- Loading states
- Error states
- Empty states
- Responsive behavior
- Long repository names
- Long descriptions
- Long usernames
- Different screen sizes

The existing dark theme should remain.

Do not introduce unnecessary gradients, animations, or decorative elements.

Do not redesign the application.

Only make changes that improve usability or consistency.

STOP after Phase 5.

---

# 6. Learning Protocol

This project is also being used as a learning exercise.

After completing EACH phase:

1. STOP coding.
2. Do not proceed to the next phase.
3. Explain what was implemented.
4. List every new file created.
5. List every existing file modified.
6. Explain every important API endpoint used.
7. Explain the data flow:
   GitHub API → state/data → components → UI
8. Explain important React concepts introduced or used.
9. Explain any non-obvious JavaScript logic.
10. Explain why each significant implementation decision was made.
11. Mention anything that was changed from the existing implementation and why.
12. Provide 3–5 questions that the developer should be able to answer before continuing.

Wait for explicit approval before starting the next phase.

---

# 7. Coding Style

Prefer:
- Simple JavaScript
- Straightforward React
- Existing project patterns
- Small, understandable functions
- Reusable components where genuinely useful
- Clear variable names

Avoid:
- Over-abstraction
- Premature optimization
- Complex design patterns
- Unnecessary custom hooks
- Unnecessary dependencies
- Code that the developer cannot reasonably understand

The priority is:

1. Correctness
2. Maintainability
3. Understandability
4. Performance
5. Visual polish

---

# 8. Definition of Done

GitWho is considered complete when:

- Profile tab works with arbitrary public GitHub users
- Repository tab works with arbitrary public GitHub users
- Activity tab provides useful real GitHub activity data
- Summary tab provides meaningful factual analysis
- API errors are handled
- Missing data is handled
- No existing functionality has been unnecessarily replaced
- The application remains visually consistent
- The developer understands the major parts of the implementation