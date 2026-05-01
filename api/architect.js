export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const capabilities = [
    "search",
    "analysis",
    "generate",
    "summarize",
    "reasoning"
  ];

  const skills = [
    "blockchain_analysis",
    "information_retrieval",
    "data_analysis",
    "structured_reasoning",
    "text_generation",
    "query_processing"
  ];

  // ---------- GET ----------
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "The Billions Architect",
      version: "2.0",
      status: "active",
      capabilities,
      skills,
      health: {
        status: "healthy",
        uptime: "stable",
        latency: "low"
      }
    });
  }

  // ---------- POST ----------
  if (req.method === 'POST') {
    const { action, input } = req.body || {};

    if (!action) {
      return res.status(400).json({
        error: "action required",
        supported: capabilities
      });
    }

    let output;

    switch (action) {
      case "analysis":
        output = {
          insight: `Analyzed: ${input}`,
          confidence: 0.92
        };
        break;

      case "search":
        output = {
          query: input,
          results: [`Relevant info about ${input}`]
        };
        break;

      case "summarize":
        output = (input || "").split(" ").slice(0, 12).join(" ");
        break;

      case "generate":
        output = `Generated response for: ${input}`;
        break;

      case "reasoning":
        output = {
          conclusion: "Logical inference derived",
          steps: ["input parsed", "pattern matched", "output generated"]
        };
        break;

      default:
        output = `Processed: ${input}`;
    }

    return res.status(200).json({
      success: true,
      action,
      capabilities,
      skills,
      timestamp: Date.now(),
      meta: {
        agent: "billions_architect",
        version: "2.0"
      },
      output
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
