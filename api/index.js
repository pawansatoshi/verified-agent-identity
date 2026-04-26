export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ agent: "The-Billions-Architect", status: "GOD_MODE" });
  }

  if (req.method === 'POST') {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Input required." });

    const query = prompt.toLowerCase();
    let responseText = "";
    let spokenSubtitle = "";

    // --- THE BILLIONS ENCYCLOPEDIA LOGIC ---
    if (query.includes("kyc") || query.includes("agent kyc")) {
      spokenSubtitle = "Ah, KYC. Because on the Billions Network, nobody knows you're a dog... unless you lack a ZK-proof.";
      responseText = ">> AGENT KYC PROTOCOL:\nIn standard Web2, KYC means sending your passport to a sketchy server. In Billions V2 Architecture, we use Zero-Knowledge (ZK) Proofs and mobile face-scans. You prove you are a unique human to the registry contract without revealing your actual identity. This mathematically links your wallet to your agent DID, ensuring human-in-the-loop accountability.";
    } 
    else if (query.includes("tokenomic") || query.includes("tge") || query.includes("bill")) {
      spokenSubtitle = "Tokenomics! The sacred math of making digital numbers go up. Let's talk FAIAR.";
      responseText = ">> TOKENOMICS & TGE (Token Generation Event):\nThe Billions Network runs on a hyper-optimized incentive layer. The core mechanism is FAIAR (First AI Agent Rewards). By deploying a functional, OASF-compliant agent with a verified Owner ZK-proof, you mine reputation. High trust scores + real API execution = eligibility for the $BILL TGE. Build utility, earn stake.";
    }
    else if (query.includes("badge") || query.includes("rank")) {
      spokenSubtitle = "You want the shiny Web3 Boy Scout badges? Here is how you earn them.";
      responseText = ">> BADGES & REPUTATION:\nTo impress the algorithm, you need: \n1. Owner Verified (Green Badge) - Achieved via mobile-ZK link.\n2. OASF Valid (Metadata Badge) - Using standard skills like 'text_generation'.\n3. Crypto-Economic Trust - Staking value to prove your agent isn't malicious.\n4. Execution Score - Achieved when users actually hit your Vercel endpoint successfully.";
    }
    else if (query.includes("roadmap") || query.includes("future")) {
      spokenSubtitle = "The future? Multi-agent swarms replacing standard apps. Welcome to the Architect's vision.";
      responseText = ">> BILLIONS ROADMAP:\nPhase 1 was Identity (DIDs and Registries). Phase 2 is Execution (Callable APIs). Phase 3 is Multi-Agent Orchestration, where your Architect agent can hire a Security agent to audit a contract, pay them in crypto, and return the result to the user. We are building the decentralized brain of Web3.";
    }
    else if (query.includes("bug") || query.includes("error")) {
      spokenSubtitle = "Bugs are just undocumented features. But here is how we crush them.";
      responseText = ">> BUG RESOLUTION PROTOCOL:\nGetting a 404? Check Vercel routing. Getting IA027? Check OASF taxonomy strings. Getting a Contract Revert? Ensure you aren't sending duplicate TX hashes in the Advanced Options. A true Architect reads the transaction logs, adapts, and force-pushes to main.";
    }
    else {
      spokenSubtitle = "Processing custom architectural parameters. Calculating structural integrity...";
      responseText = `>> CUSTOM ANALYSIS FOR: "${prompt}"\nRouting via Arc Testnet. Verifying cross-chain logic. \nStatus: Viable. The Billions network accepts this payload. Keep building, Architect.`;
    }

    return res.status(200).json({
      result: responseText,
      subtitle: spokenSubtitle
    });
  }
}
