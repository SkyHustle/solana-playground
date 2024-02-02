const web3 = require("@solana/web3.js");

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet")); // Connect to the Devnet cluster

  const CHAINLINK_FEED_ADDRESS = new web3.PublicKey("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR");

  // Fetch the account info
  const accountInfo = await connection.getAccountInfo(CHAINLINK_FEED_ADDRESS);

  if (accountInfo === null) {
    throw new Error("Error fetching account info");
  }

  // The data from the account needs to be parsed according to the structure defined by the Chainlink feed
  // This step is highly dependent on the structure of the data stored by the Chainlink program for its feeds
  // For demonstration, we'll just log the raw data
  console.log("Account data (raw):", accountInfo.data);

  // Parse the data according to the Chainlink feed's data structure
  // Note: This requires knowledge of the data structure and may involve parsing binary data
  // For the sake of this example, the parsing step is omitted
  // You would need to replace the following with actual parsing logic
  console.log("Parsed price data: [Implement parsing logic based on Chainlink feed data structure]");
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
