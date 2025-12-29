const { fetchWikipediaSummary } = require("../services/wikimedia.service");

const predictSpecies = async (req, res) => {
  try {
    const { species } = req.body;

    if (!species) {
      return res.status(400).json({ msg: "Species is required" });
    }

    const data = await fetchWikipediaSummary(species.toLowerCase());

    return res.status(200).json({
      species,
      description: data.extract || "Description not available",
      wikipediaUrl: data.content_urls?.desktop?.page || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Failed to fetch species information",
    });
  }
};

module.exports = { predictSpecies };
