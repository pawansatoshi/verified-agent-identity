export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 🔹 GET (health)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: "ok",
      agent: "The-Billions-Architect",
      capabilities: ["text_generation", "question_answering"]
    });
  }

  // 🔹 POST (main logic)
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        status: "error",
        error: "Input required"
      });
    }

    let answer = "";

    try {
      // 🔥 FREE AI (OpenRouter)
      const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "system", content: "You are a Web3 AI agent on Billions Network." },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await aiRes.json();
      answer = data.choices?.[0]?.message?.content || "";

    } catch (err) {
      answer = "";
    }

    // 🔹 fallback (अगर AI fail हो जाए)
    if (!answer) {
      const query = prompt.toLowerCase();

      if (query.includes("kyc")) {
        answer = "Billions uses ZK-based identity verification instead of traditional KYC.";
      } 
      else if (query.includes("token")) {
        answer = "FAIAR rewards are based on agent execution and trust.";
      }
      else if (query.includes("rank")) {
        answer = "Ranking depends on execution, trust signals, and real usage.";
      }
      else {
        answer = `Processed query: ${prompt}`;
      }
    }

    return res.status(200).json({
  status: "success",
  input: prompt,
  output: answer,
  agent: "The-Billions-Architect",
  confidence: 0.95,
  timestamp: Date.now()
});

  return res.status(405).json({ error: "Method not allowed" });
}
