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
  document.getElementById("ethBalance").innerText =
    ethers.utils.formatEther(ethBal);

  const abi = ["function balanceOf(address) view returns(uint256)"];
  const contract = new ethers.Contract(TOKENS.BILL.address, abi, rpc);

  const billBal = await contract.balanceOf(user);
  document.getElementById("billBalance").innerText =
    ethers.utils.formatUnits(billBal, 18);
}

async function sendTx(){
  const to = document.getElementById("to").value;
  const amount = document.getElementById("amount").value;

  const tx = await signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount)
  });

  document.getElementById("txStatus").innerText = "Pending...";
  await tx.wait();
  document.getElementById("txStatus").innerText = "Success";
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
