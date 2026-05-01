cat << 'EOF' > integrations/signedLogger.js
const fs = require('fs');
const crypto = require('crypto');
const { ethers } = require('ethers');

function hash(obj) {
  return crypto.createHash('sha256')
    .update(JSON.stringify(obj))
    .digest('hex');
}

async function signAndLog(action) {
  const pk = process.env.PRIVATE_KEY;
  const h = hash(action);

  let signature = null, address = null;

  if (pk) {
    const wallet = new ethers.Wallet(pk);
    signature = await wallet.signMessage(h);
    address = wallet.address;
  }

  const record = {
    ...action,
    hash: h,
    signature,
    address,
    ts: Date.now()
  };

  fs.appendFileSync('./data/signed_actions.log', JSON.stringify(record) + '\n');
  console.log("signed:", record.agent, record.hash.slice(0,8));
}

module.exports = signAndLog;
EOF
