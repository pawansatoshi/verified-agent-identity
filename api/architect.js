export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ---------- GET ----------
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "The Billions Architect",
      status: "active",
      capabilities: ["search", "analysis", "generate", "summarize", "reasoning"]
    });
  }

  // ---------- POST ----------
  if (req.method === 'POST') {
    const { action, input } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: "action required" });
    }

    let result;

    switch (action) {
      case "analysis":
        result = `Analyzed: ${input}`;
        break;

      case "search":
        result = `Results for: ${input}`;
        break;

      case "summarize":
        result = (input || "").slice(0, 50);
        break;

      case "generate":
        result = `Generated: ${input}`;
        break;

      case "reasoning":
        result = "Logical reasoning completed";
        break;

      default:
        result = `Processed: ${input}`;
    }

    return res.status(200).json({
      success: true,
      action,
      result
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
  }
