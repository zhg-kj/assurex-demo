const xrpl = require("xrpl");

const destination = xrpl.Wallet.fromSeed("sEd7qASxZPBSjMnQ5kuDEX2SACfTeqZ")

export async function sendXRP(seed, amount) {
  try {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect()
    const source = xrpl.Wallet.fromSeed(seed)
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": source.address,
      "Amount": xrpl.xrpToDrops(amount),
      "Destination": destination.address
    })
    const signed = source.sign(prepared);
    const txHash = await client.submitAndWait(signed.tx_blob);

    console.log('Transaction Hash:', txHash.result.hash);
    client.disconnect()
    return txHash.result.hash
  } catch (error) {
    console.error('Error sending XRP:', error);
  }
}

export async function addAccount() {
  try {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect()
    const fund_result = await client.fundWallet({amount: "10000"})
    const new_account = fund_result.wallet
    console.log(fund_result)
    client.disconnect()
    return new_account.seed
  } catch (error) {
    console.error('Error adding account:', error);
  }
}

export async function getWalletDetails(seed) {
  try {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect()
    const wallet = xrpl.Wallet.fromSeed(seed)
    const balance = await client.getXrpBalance(wallet.address)
    const res = {
      wallet: wallet,
      balance: balance
    }
    client.disconnect()
    return res
  } catch (error) {
    console.error('Error getting wallet details:', error);
  }
}