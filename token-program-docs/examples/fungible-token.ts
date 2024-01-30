import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";

const payer = getKeypairFromEnvironment("SECRET_KEY");
console.log(`Payer : ${payer.publicKey.toBase58()}`);
const mintAuthority = Keypair.generate();
console.log(`Mint Authority: ${mintAuthority.publicKey.toBase58()}`);
const freezeAuthority = Keypair.generate();
console.log(`Freeze Authority: ${freezeAuthority.publicKey.toBase58()}`);

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("connection ", connection);

const mint = await createMint(
  connection,
  payer,
  mintAuthority.publicKey,
  freezeAuthority.publicKey,
  9 // We are using 9 to match the CLI decimal default exactly
);

console.log(`Mint: ${mint.toBase58()}`);

const mintInfo = await getMint(connection, mint);

console.log(`Mint Info Supply: ${mintInfo.supply}`);

const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

const tokenAccountInfo = await getAccount(connection, tokenAccount.address);

console.log(`Token Account Info: ${tokenAccountInfo.amount}`);

await mintTo(
  connection,
  payer,
  mint,
  tokenAccount.address,
  mintAuthority,
  100000000000 // because decimals for the mint are set to 9
);

const updatedMintInfo = await getMint(connection, mint);

console.log(`Updated Mint Info Supply: ${updatedMintInfo.supply}`);

const updatedTokenAccountInfo = await getAccount(connection, tokenAccount.address);

console.log(`Updated Token Account Info: ${updatedTokenAccountInfo.amount}`);
