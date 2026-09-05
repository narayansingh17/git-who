// src/api/githubGraphQL.js
//
// GraphQL helper for the GitHub Contribution Calendar API.
//
// ─── ARCHITECTURE NOTE ────────────────────────────────────────────────────────
//
//   React/Vite
//       │
//       │  username
//       ▼
//   getContributions(username)         ← YOU ARE HERE
//       │
//       │  ← AUTHENTICATION / BACKEND STARTS HERE
//       ▼
//   POST https://api.github.com/graphql
//       │
//       ▼
//   Contribution Calendar data
//
//  This function deliberately does NOT include a GitHub token.
//  The GitHub GraphQL API requires authentication (a personal access token
//  sent in the "Authorization" header).  That part is left for the user
//  to implement — either via a backend/serverless function, or by supplying
//  the token themselves.
//
//  See the AUTHENTICATION PLACEHOLDER comment inside the function body for
//  exactly where the token header must be added.
//
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// The GraphQL query.
// $login is a variable — the username is never interpolated into the query
// string itself.  It is passed separately through the "variables" field of
// the request body (see below).  This is the safe, canonical way to pass
// dynamic values to a GraphQL API.
const CONTRIBUTION_QUERY = `
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

/**
 * Fetches the GitHub contribution calendar for a given username
 * using the GitHub GraphQL API.
 *
 * @param {string} username  A GitHub login name (e.g. "torvalds")
 * @returns {Promise<{
 *   totalContributions: number,
 *   weeks: Array<{
 *     contributionDays: Array<{
 *       date: string,             // "YYYY-MM-DD"
 *       contributionCount: number,
 *       contributionLevel: string // "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"
 *     }>
 *   }>
 * } | null>}
 *
 * Returns `null` if the user does not exist.
 * Throws an Error for HTTP failures or GraphQL-level errors.
 */
export async function getContributions(username) {
    // ── 1. Build the request ──────────────────────────────────────────────────
    const requestBody = {
        query: CONTRIBUTION_QUERY,
        variables: { login: username }, // username goes into the $login variable
    };

    // ── 2. Send the request ───────────────────────────────────────────────────
    //
    // AUTHENTICATION PLACEHOLDER
    // ─────────────────────────────────────────────────────────────────────────
    // The GitHub GraphQL API requires a personal access token.
    // When you implement authentication, add the Authorization header here:
    //
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${YOUR_TOKEN_FROM_BACKEND}`,
    //   }
    //
    // Do NOT put the token in a VITE_* env variable — it would be exposed in
    // the browser bundle.  Retrieve it from your own backend/serverless function
    // instead, and pass it here (or have the backend make this request itself).
    // ─────────────────────────────────────────────────────────────────────────
    let response;
    try {
        response = await fetch(GITHUB_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer <token-from-your-backend>`,  // ← ADD HERE
            },
            body: JSON.stringify(requestBody),
        });
    } catch (networkError) {
        // fetch() itself rejected — network is down, DNS failed, CORS block, etc.
        throw new Error(
            `Network error while contacting GitHub GraphQL API: ${networkError.message}`
        );
    }

    // ── 3. Handle HTTP-level errors ───────────────────────────────────────────
    // GraphQL always responds with HTTP 200 when the *transport* succeeds.
    // Any non-200 here means something went wrong before GraphQL could run
    // (e.g. 401 Unauthorized, 403 Forbidden, 500 Internal Server Error).
    if (!response.ok) {
        throw new Error(
            `GitHub GraphQL API returned HTTP ${response.status} (${response.statusText}). ` +
            `This usually means authentication is missing or the token is invalid.`
        );
    }

    // ── 4. Parse the JSON body ────────────────────────────────────────────────
    let json;
    try {
        json = await response.json();
    } catch {
        throw new Error(
            "GitHub GraphQL API returned a response that could not be parsed as JSON."
        );
    }

    // ── 5. Handle GraphQL-level errors ───────────────────────────────────────
    // Even with HTTP 200, GraphQL can return an "errors" array in the body
    // (e.g. malformed query, rate-limit exceeded, insufficient token scopes).
    if (json.errors && json.errors.length > 0) {
        const messages = json.errors.map((e) => e.message).join("; ");
        throw new Error(`GitHub GraphQL returned errors: ${messages}`);
    }

    // ── 6. Handle malformed / unexpected response shape ───────────────────────
    if (!json.data) {
        throw new Error(
            "GitHub GraphQL API returned a response with no 'data' field. " +
            "This may indicate an authentication problem or an unexpected API change."
        );
    }

    // ── 7. Handle nonexistent user ────────────────────────────────────────────
    // When the login does not exist, GitHub GraphQL sets data.user to null
    // rather than returning an error.
    if (json.data.user === null) {
        return null; // caller can check for null and show a "user not found" message
    }

    // ── 8. Validate the expected shape ────────────────────────────────────────
    const calendar =
        json.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
        throw new Error(
            "The GitHub GraphQL response was missing the expected 'contributionCalendar' field."
        );
    }

    // ── 9. Return clean, ready-to-use data ───────────────────────────────────
    // Shape:
    // {
    //   totalContributions: number,
    //   weeks: [
    //     {
    //       contributionDays: [
    //         { date: "YYYY-MM-DD", contributionCount: number, contributionLevel: string },
    //         ...  (7 entries, one per day of the week)
    //       ]
    //     },
    //     ...  (~53 weeks, covering the last full year)
    //   ]
    // }
    return calendar;
}
