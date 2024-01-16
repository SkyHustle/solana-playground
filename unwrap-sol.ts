import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { closeAccount, NATIVE_MINT, getAssociatedTokenAddress } from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const wallet = getKeypairFromEnvironment("SECRET_KEY_1");

    const walletBalance = await connection.getBalance(wallet.publicKey);

    console.log(`SOL Balance before unwrapping 1 WSOL: ${walletBalance}`);

    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey);

    await closeAccount(connection, wallet, associatedTokenAccount, wallet.publicKey, wallet);

    const walletBalancePostClose = await connection.getBalance(wallet.publicKey);

    console.log(`SOL Balance after unwrapping 1 WSOL: ${walletBalancePostClose}`);
})();

/*
Balance before unwrapping 1 WSOL: 997950720
Balance after unwrapping 1 WSOL: 1999985000
*/
