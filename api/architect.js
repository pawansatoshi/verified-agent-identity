export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: "ok",
      agent: "architect"
    });
  }

  if (req.method === 'POST') {
    const { prompt } = req.body || {};

    return res.status(200).json({
      output: "Architect response: " + prompt
    });
  }
}
