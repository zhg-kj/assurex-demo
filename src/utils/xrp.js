const xrpl = require("xrpl");

const source = xrpl.Wallet.fromSeed("shUrA8WBncLS5BEnzDydVYJH5LTQJ")
const destination = xrpl.Wallet.fromSeed("sEd7qASxZPBSjMnQ5kuDEX2SACfTeqZ")

export default async function sendXRP(amount) {
  try {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect()
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": source.address,
      "Amount": xrpl.xrpToDrops(`${amount}`),
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