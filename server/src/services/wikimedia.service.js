const fetch = require("node-fetch");

const WIKIPEDIA_SUMMARY_API =
  "https://en.wikipedia.org/api/rest_v1/page/summary";

const fetchWikipediaSummary = async (species) => {
  if (!species) {
    throw new Error("Species is required");
  }

  const title = encodeURIComponent(species);

  const response = await fetch(
    `${WIKIPEDIA_SUMMARY_API}/${title}`,
    {
      headers: {
        "Api-User-Agent": "eidos/1.0 (contact@example.com)",
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Wikipedia summary");
  }

  return response.json();
};

module.exports = { fetchWikipediaSummary };
