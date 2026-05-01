export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  return res.status(200).json({
    name: "The Billions Architect",
    version: "0.8.0",
    skills: [
      "analytical_skills/data_analysis/blockchain_analysis",
      "natural_language_processing/information_retrieval_synthesis/search",
      "reasoning/logical_reasoning",
      "natural_language_processing/text_generation"
    ],
    domains: [
      "technology/blockchain",
      "technology/ai_agents",
      "analytics"
    ]
  });
}
