import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const fromWallet = getKeypairFromEnvironment("SECRET_KEY");

    const toWallet = getKeypairFromEnvironment("SECRET_KEY_1");

    // Use existing token mint
    const mint = new PublicKey("7yrcWPayujif46vPFM9TpcqkBL1SnrFHN6pDLN3MbjsB");

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet.publicKey);

    await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        10000000000
    ).then((signature) => {
        console.log(
            `Transferring 10 tokens from ${fromWallet.publicKey.toBase58()} to ${toWallet.publicKey.toBase58()} Transaction Signature: ${signature}`
        );
    });
})();
