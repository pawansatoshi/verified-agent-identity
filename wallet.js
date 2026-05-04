// wallet.js

const NETWORKS = {
  billions: {
    chainId: "0xafe2",
    name: "Billions Network",
    rpc: "https://rpc-mainnet.billions.network",
    explorer: "https://explorer.billions.network"
  }
};

const TOKENS = {
  BILL: {
    address: "0xb1110919016846972056AB995054D65560D5f05E",
    decimals: 18
  }
};

let provider, signer, user;

async function connectWallet(){
  if(!window.ethereum) return alert("Install wallet");

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  signer = provider.getSigner();
  user = await signer.getAddress();

  document.getElementById("walletStatus").innerText =
    user.slice(0,6) + "..." + user.slice(-4);

  loadBalance();
}

async function switchToBillions(){
  try{
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORKS.billions.chainId }]
    });
  }catch{
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: NETWORKS.billions.chainId,
        chainName: NETWORKS.billions.name,
        rpcUrls: [NETWORKS.billions.rpc],
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18
        },
        blockExplorerUrls: [NETWORKS.billions.explorer]
      }]
    });
  }
}

async function loadBalance(){
  const rpc = new ethers.providers.JsonRpcProvider(NETWORKS.billions.rpc);

  const ethBal = await rpc.getBalance(user);
  if(document.getElementById("ethBalance")){
     document.getElementById("ethBalance").innerText = ethers.utils.formatEther(ethBal);
  }

  const abi = ["function balanceOf(address) view returns(uint256)"];
  const contract = new ethers.Contract(TOKENS.BILL.address, abi, rpc);

  const billBal = await contract.balanceOf(user);
  if(document.getElementById("billBalance")){
     document.getElementById("billBalance").innerText = ethers.utils.formatUnits(billBal, 18);
  }
}

async function sendTx(){
  const to = document.getElementById("to").value;
  const amount = document.getElementById("amount").value;

  try {
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount)
    });

    if(document.getElementById("txStatus")) document.getElementById("txStatus").innerText = "Pending...";
    
    const receipt = await tx.wait(); // ✅ receipt get किया ताकि gas used निकाल सकें
    
    if(document.getElementById("txStatus")) document.getElementById("txStatus").innerText = "Success";

    // ✅ LEVEL 2 UPGRADE: Call the advanced render function here!
    if (window.renderAdvancedTxSuccess) {
      window.renderAdvancedTxSuccess(tx.hash, receipt.gasUsed.toString());
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    if(document.getElementById("txStatus")) document.getElementById("txStatus").innerText = "Failed";
  }
}

function openLedger(){
  window.open(
    NETWORKS.billions.explorer + "/address/" + user,
    "_blank"
  );
}

function openBridge(){
  window.open("https://bridge.billions.network", "_blank");
}

function openSwap(){
  window.open("https://app.uniswap.org", "_blank");
}


// =========================================================
// LEVEL 2 MASTER UPGRADE ENGINE (OBSERVABILITY & UI)
// =========================================================

// --- ADVANCED WALLET UX (Transaction Link) ---
window.renderAdvancedTxSuccess = function(txHash, gasUsed = "Auto") {
  const el = document.getElementById('tx-interaction-panel');
  if (!el) return;

  el.innerHTML = `
    <div style="border-left:4px solid #00ff00; padding:10px; margin-top: 10px; background: rgba(0,255,0,0.05);">
      <p style="margin:5px 0;"><strong>Tx Hash:</strong> ${txHash.slice(0,6)}...${txHash.slice(-4)}
         <button onclick="navigator.clipboard.writeText('${txHash}')" style="margin-left: 10px; cursor:pointer; background:#333; color:#fff; border:none; padding:4px 8px; border-radius:4px;">Copy</button>
      </p>
      <p style="margin:5px 0;">
        <a href="https://explorer.billions.network/tx/${txHash}" target="_blank" style="color: #00A3FF; text-decoration: none;">
          🔍 View on Billions Explorer
        </a>
      </p>
      <p style="margin:5px 0; font-size: 0.9em; opacity: 0.8;">Gas Used: ${gasUsed}</p>
    </div>
  `;
};

// --- AGENT MEMORY (LOCAL) ---
function saveMemory(action, result) {
  let memory = JSON.parse(localStorage.getItem('agent_memory') || '[]');
  memory.unshift({ action, result, timestamp: new Date().getTime() });
  if (memory.length > 10) memory.pop();
  localStorage.setItem('agent_memory', JSON.stringify(memory));
  
  const lastActionEl = document.getElementById('last-action');
  const lastResultEl = document.getElementById('last-result');
  if(lastActionEl) lastActionEl.innerText = `Action: ${action}`;
  if(lastResultEl) lastResultEl.innerText = `Result: ${JSON.stringify(result).substring(0, 40)}...`;
}

// --- PERFORMANCE TRACKING ---
let agentStats = JSON.parse(localStorage.getItem('agent_stats') || '{"calls":0,"successes":0,"totalTime":0}');

function updateAgentStats(success, execTime) {
  agentStats.calls += 1;
  if (success) agentStats.successes += 1;
  agentStats.totalTime += execTime;
  localStorage.setItem('agent_stats', JSON.stringify(agentStats));
  renderStats();
}

function renderStats() {
  const callsEl = document.getElementById('stat-calls');
  const srEl = document.getElementById('stat-sr');
  const timeEl = document.getElementById('stat-time');

  if(callsEl) callsEl.innerText = agentStats.calls;
  if(srEl) srEl.innerText = agentStats.calls > 0 ? Math.round((agentStats.successes / agentStats.calls) * 100) + '%' : '0%';
  if(timeEl) timeEl.innerText = agentStats.calls > 0 ? Math.round(agentStats.totalTime / agentStats.calls) + 'ms' : '0ms';
}

// --- AUTO FEEDBACK INTEGRATION ---
// (This is triggered from your UI script when the API responds)
window.logInteraction = async function(apiResponse) {
  if(!apiResponse) return;
  saveMemory(apiResponse.action || 'unknown', apiResponse.result || '');
  updateAgentStats(apiResponse.success, apiResponse.execution_time || 0);
}

// --- LIVE SYSTEM STATUS & AUTO REFRESH ---
function checkSystemHealth() {
  const apiStatus = document.getElementById('status-api');
  const walletStatus = document.getElementById('status-wallet');
  const netStatus = document.getElementById('status-network');

  const isConnected = window.ethereum && window.ethereum.selectedAddress;
  if(walletStatus) walletStatus.style.color = isConnected ? '#00ff00' : '#ff0000';
  if(apiStatus) apiStatus.style.color = '#00ff00'; 
  if(netStatus) netStatus.style.color = isConnected ? '#00ff00' : '#ff0000';
}

// Auto-refresh loop
setInterval(() => {
  renderStats();
  checkSystemHealth();

  if(user){
    loadBalance(); // existing (RPC direct)

    // ✅ NEW: agent-based balance sync
    fetchWalletBalance(user);
  }

}, 5000);

// --- WALLET BALANCE SYNC VIA AGENT API ---
async function fetchWalletBalance(address) {
  try {
    const res = await fetch('/api/architect', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "wallet_balance",
        payload: address
      })
    });

    const data = await res.json();

    if (window.logInteraction) {
      window.logInteraction(data);
    }

    console.log("Wallet Balance (Agent):", data);

  } catch (err) {
    console.error("Balance error:", err);
  }
      }
