import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, getMint } from "@solana/spl-token";

(async () => {
    // Connect to cluster
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new wallet keypair and airdrop SOL
    // const fromWallet = Keypair.generate();
    // const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

    const fromWallet = getKeypairFromEnvironment("SECRET_KEY");

    // Wait for airdrop confirmation
    // await connection.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    // const toWallet = Keypair.generate();

    const toWallet = getKeypairFromEnvironment("SECRET_KEY_1");

    // Create new token mint
    // const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);

    // Use existing token mint
    const mint = new PublicKey("7yrcWPayujif46vPFM9TpcqkBL1SnrFHN6pDLN3MbjsB");

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet.publicKey);

    // Mint 1 new token to the "fromTokenAccount" account we just created
    // let signature = await mintTo(
    //     connection,
    //     fromWallet,
    //     mint,
    //     fromTokenAccount.address,
    //     fromWallet.publicKey,
    //     1000000000
    // );
    // console.log("mint tx:", signature);

    const amountInTokens = 9.99999999; // Amount in tokens you want to transfer
    let amountInSmallestUnit = amountInTokens * Math.pow(10, 9); // Convert to smallest unit, decimal precision of mint is 9

    // Round to the nearest integer
    amountInSmallestUnit = Math.round(amountInSmallestUnit);

    console.log(`Amount in smallest unit: ${amountInSmallestUnit}`);

    // Transfer the new token to the "toTokenAccount" we just created
    await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        amountInSmallestUnit
    ).then((signature) => {
        console.log(
            `Transferring 10 tokens from ${fromWallet.publicKey.toBase58()} to ${toWallet.publicKey.toBase58()} Transaction Signature: ${signature}`
        );
    });
})();
