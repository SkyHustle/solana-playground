import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`Connection object is: `, connection);

console.log(`✅ Connected!`);
