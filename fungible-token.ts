import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";

const payer = getKeypairFromEnvironment("SECRET_KEY");
console.log(`Payer: ${payer}`);
const mintAuthority = Keypair.generate();
console.log(`Mint Authority: ${mintAuthority}`);
const freezeAuthority = Keypair.generate();
console.log(`Freeze Authority: ${freezeAuthority}`);

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log(`Connection: ${connection}`);

const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // We are using 9 to match the CLI decimal default exactly
);

console.log(mint.toBase58());
// AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM
