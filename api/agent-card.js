export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    name: "The-Billions-Architect",
    description: "Autonomous Web3 agent with verified identity on Billions Network",
    version: "1.0.0",
    protocol: "a2a",
    endpoints: {
      chat: "https://verified-agent-identity-4iws.vercel.app/api/architect"
    },
    capabilities: ["chat", "analysis"]
  });
}
