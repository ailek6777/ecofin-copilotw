// Server-side proxy for the Anthropic API.
// Keeps ANTHROPIC_API_KEY out of the browser bundle entirely.
// Set ANTHROPIC_API_KEY in your Netlify site's environment variables
// (Site settings -> Environment variables) — never commit it to the repo.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured on the server." }),
    };
  }

  let prompt;
  try {
    ({ prompt } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }
  if (!prompt || typeof prompt !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing 'prompt' string." }) };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Upstream request failed." }) };
  }
}
