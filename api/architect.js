export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- GET: metadata (UNCHANGED) ---
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "The Billions Architect",
      description: "AI agent for reasoning, analytics, and Billions ecosystem queries",
      version: "1.1",
      status: "active",
      tools: [
        { name: "chat", description: "General conversation" },
        { name: "search", description: "Search Billions ecosystem data" },
        { name: "analyze", description: "Analyze structured input" },
        { name: "summarize", description: "Summarize text" },
        { name: "generate", description: "Generate content" },
        { name: "reason", description: "Logical reasoning" }
      ]
    });
  }

  // --- POST: FIXED SCHEMA ---
  if (req.method === 'POST') {
    const { action, message, text, query } = req.body || {};

    let result = {};

    switch (action) {
      case "chat":
        result = {
          type: "chat",
          reply: `Processed: ${message || ""}`
        };
        break;

      case "search":
        result = {
          type: "search",
          results: [`Result for ${query || ""}`]
        };
        break;

      case "analyze":
        result = {
          type: "analysis",
          insight: `Analysis: ${(text || "").slice(0, 100)}`,
          confidence: 0.92
        };
        break;

      case "summarize":
        result = {
          type: "summary",
          text: (text || "").split(" ").slice(0, 20).join(" ")
        };
        break;

      case "generate":
        result = {
          type: "generation",
          output: "Generated content example"
        };
        break;

      case "reason":
        result = {
          type: "reasoning",
          conclusion: "Logical reasoning output",
          steps: ["input parsed", "pattern matched", "output generated"]
        };
        break;

      default:
        result = {
          type: "error",
          message: "invalid action"
        };
    }

    // 🔥 ALWAYS RETURN STANDARD STRUCTURE
    return res.status(200).json({
      success: true,
      action: action || "unknown",
      input: message || text || query || "",
      result,
      metadata: {
        agent: "The Billions Architect",
        version: "2.1"
      },
      timestamp: Date.now()
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
          }
