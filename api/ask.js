export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  res.status(200).json({
    query,
    answer: "This is a working AI agent response",
    agent: "The-Billions-Architect"
  });
}
