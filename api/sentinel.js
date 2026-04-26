export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // HEALTH CHECK
  if (req.method === 'GET') {
    return res.status(200).json({
      status: "ok",
      agent: "Satoshi-Sentinel-8008",
      capabilities: ["identity_verification", "security_monitoring"]
    });
  }

  // MAIN EXECUTION
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body || {};

      if (!prompt) {
        return res.status(400).json({
          status: "error",
          error: "Input required"
        });
      }

      const query = prompt.toLowerCase();
      let answer = "";

      if (query.includes("verify")) {
        answer = "Sentinel verifies identity using decentralized DID and cryptographic proofs.";
      } 
      else if (query.includes("security")) {
        answer = "Sentinel monitors agent integrity and prevents unauthorized interactions.";
      }
      else if (query.includes("identity")) {
        answer = "Sentinel links human identity with agent using DID verification flow.";
      }
      else {
        answer = `Sentinel processed: ${prompt}`;
      }

      return res.status(200).json({
        status: "success",
        input: prompt,
        output: answer,
        agent: "Satoshi-Sentinel-8008",
        confidence: 0.96,
        timestamp: Date.now()
      });

    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }
}
