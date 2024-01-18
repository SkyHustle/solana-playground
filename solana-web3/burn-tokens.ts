import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createBurnInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

async function burnToken() {
    // Connect to Solana DevNet cluster
    const connection = new Connection("https://api.devnet.solana.com");

    // Your wallet/Private key
    const wallet = getKeypairFromEnvironment("SECRET_KEY");

    // Token details
    const mintAddress = new PublicKey("7yrcWPayujif46vPFM9TpcqkBL1SnrFHN6pDLN3MbjsB");
    const burnAmount = 1000000000;

    // Get the associated token account for the wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(mintAddress, wallet.publicKey);

    // Create a new transaction
    let transaction = new Transaction();

    // Add the burn instruction
    transaction.add(
        createBurnInstruction(
            associatedTokenAddress, // token account address
            mintAddress, // mint address
            wallet.publicKey, // owner of token account
            burnAmount, // amount to burn
            [], // multiSigners, if any
            TOKEN_PROGRAM_ID
        )
    );

    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log(`Transaction signature: ${signature}`);
}

// Run the burn function
burnToken().catch(console.error);
