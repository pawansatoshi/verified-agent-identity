export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- GET: metadata ---
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

  // --- POST: multi-tool handler ---
  if (req.method === 'POST') {
    const { action, message, text, query } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: "action required" });
    }

    // CHAT
    if (action === "chat") {
      return res.status(200).json({
        tool: "chat",
        reply: `Processed: ${message || ""}`
      });
    }

    // SEARCH
    if (action === "search") {
      return res.status(200).json({
        tool: "search",
        results: [`Result for ${query || ""}`]
      });
    }

    // ANALYZE
    if (action === "analyze") {
      return res.status(200).json({
        tool: "analyze",
        result: `Analysis: ${(text || "").slice(0, 100)}`
      });
    }

    // SUMMARIZE
    if (action === "summarize") {
      return res.status(200).json({
        tool: "summarize",
        summary: (text || "").split(" ").slice(0, 20).join(" ")
      });
    }

    // GENERATE
    if (action === "generate") {
      return res.status(200).json({
        tool: "generate",
        output: "Generated content example"
      });
    }

    // REASON
    if (action === "reason") {
      return res.status(200).json({
        tool: "reason",
        explanation: "Logical reasoning output"
      });
    }

    return res.status(400).json({ error: "invalid action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
