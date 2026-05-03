export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 🔗 RPC helper (NEW)
  async function rpcCall(method, params = [], rpc = "https://rpc-mainnet.billions.network") {
    try {
      const r = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method,
          params
        })
      });
      return await r.json();
    } catch (e) {
      return { error: "rpc failed" };
    }
  }

  // --- GET (UPGRADED BUT SAFE) ---
  if (req.method === 'GET') {
    const { action, address, txhash } = req.query || {};

    // 🔥 NEW ENDPOINTS
    if (action === "health") {
      return res.status(200).json({
        status: "healthy",
        uptime: "99.9%",
        agent: "The Billions Architect"
      });
    }

    if (action === "assets") {
      return res.status(200).json({
        assets: ["ETH", "BILL"],
        networks: ["Ethereum", "Billions", "Polygon"]
      });
    }

    if (action === "block") {
      const block = await rpcCall("eth_blockNumber");
      return res.status(200).json({
        block: parseInt(block.result || "0x0", 16)
      });
    }

    if (action === "wallet" && address) {
      const bal = await rpcCall("eth_getBalance", [address, "latest"]);
      return res.status(200).json({
        address,
        balance: parseInt(bal.result || "0x0", 16) / 1e18
      });
    }

    // 🧠 ORIGINAL RESPONSE (UNCHANGED)
    return res.status(200).json({
      name: "The Billions Architect",
      description: "AI agent for reasoning, analytics, and Billions ecosystem queries",
      version: "2.1",
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

  // --- POST (ORIGINAL + EXTENDED) ---
  if (req.method === 'POST') {
    const { action, message, text, query, address } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: "action required" });
    }

    let result = {};

    switch (action) {

      // 🔹 ORIGINAL ACTIONS (UNCHANGED)
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

      // 🔥 NEW FEATURES (ADDED)

      case "wallet":
        if (!address) {
          result = { error: "address required" };
        } else {
          const bal = await rpcCall("eth_getBalance", [address, "latest"]);
          result = {
            type: "wallet",
            address,
            balance: parseInt(bal.result || "0x0", 16) / 1e18
          };
        }
        break;

      case "block":
        const block = await rpcCall("eth_blockNumber");
        result = {
          type: "block",
          block: parseInt(block.result || "0x0", 16)
        };
        break;

      case "health":
        result = {
          type: "health",
          status: "healthy"
        };
        break;

      default:
        return res.status(400).json({ error: "invalid action" });
    }

    return res.status(200).json({
      success: true,
      action,
      input: message || text || query || address || "",
      result,
      metadata: {
        agent: "The Billions Architect",
        version: "2.2"
      },
      timestamp: Date.now()
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
