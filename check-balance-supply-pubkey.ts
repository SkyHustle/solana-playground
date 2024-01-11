import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const suppliedPublicKey = process.argv[2];

if (!suppliedPublicKey) {
    throw new Error("Provide a public key to check the balance of!");
}

// check that public key has between 43 and 44 characters
if (suppliedPublicKey.length < 43 || suppliedPublicKey.length > 44) {
    throw new Error("Invalid public key, Too short or Too long!");
}

// check that supplied public key is of type PublicKey
if (!PublicKey.isOnCurve(suppliedPublicKey)) {
    throw new Error("Invalid public key!");
}

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const publicKey = new PublicKey(suppliedPublicKey);

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`✅ Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`);
