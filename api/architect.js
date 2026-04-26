export default function handler(req, res) {
  // CORS headers (important for 8004scan fetch)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Main response
  return res.status(200).json({
    agent_identity: {
      name: "The Billions Architect",
      id: "16275",
      status: "OPERATIONAL",
      network: "Billions Mainnet"
    },

    identity: {
      did: "did:iden3:billions:main:2VmAkXrihYaLEnXRr3N5EAtwhR5e37xRet8v4taRCs",
      verified: true,
      provider: "billions-network",
      type: "iden3"
    },

    service: {
      endpoint: "https://verified-agent-identity-4iw5.vercel.app/api/architect",
      type: "OASF"
    },

    metadata: {
      version: "v0.8.0",
      timestamp: new Date().toISOString()
    }
  });
    }
