import {
    NATIVE_MINT,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createSyncNativeInstruction,
    getAccount,
} from "@solana/spl-token";
import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const wallet = getKeypairFromEnvironment("SECRET_KEY_1");

    // const airdropSignature = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);

    // const txConfirmation = await connection.confirmTransaction(airdropSignature);
    // console.log(`Transaction Confirmation : ${txConfirmation}`);

    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey);
    console.log(`Associated Token Address: ${associatedTokenAccount.toBase58()}`);

    // Create token account to hold your wrapped SOL
    const createTokenAccountTx = new Transaction().add(
        createAssociatedTokenAccountInstruction(wallet.publicKey, associatedTokenAccount, wallet.publicKey, NATIVE_MINT)
    );
    console.log(`Creating Token Account: ${associatedTokenAccount.toBase58()}`);

    await sendAndConfirmTransaction(connection, createTokenAccountTx, [wallet]);

    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    const solTransferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: associatedTokenAccount,
            lamports: LAMPORTS_PER_SOL,
        }),
        createSyncNativeInstruction(associatedTokenAccount)
    );

    await sendAndConfirmTransaction(connection, solTransferTransaction, [wallet]);

    const accountInfo = await getAccount(connection, associatedTokenAccount);

    console.log(
        `Native Account Info: ${accountInfo}, isNative: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`
    );
})();
