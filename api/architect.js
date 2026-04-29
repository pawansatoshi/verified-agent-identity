export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "The Billions Architect",
      description: "AI agent for structured reasoning, analytics, and Billions ecosystem queries",
      version: "1.0",
      status: "active",
      tools: [
        { name: "search", description: "Search data from Billions ecosystem" },
        { name: "analyze", description: "Analyze structured data" }
      ],
      prompts: [
        { name: "ask", description: "Ask anything about Billions network" }
      ]
    });
  }

  if (req.method === 'POST') {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt required" });
    }

    return res.status(200).json({
      status: "success",
      output: "Processed: " + prompt
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
      }
