import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createSetAuthorityInstruction,
    AuthorityType,
    getAccount,
    getMint,
} from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const wallet = getKeypairFromEnvironment("SECRET_KEY");

    // Create the token type with zero decimal place
    const mint = await createMint(connection, wallet, wallet.publicKey, wallet.publicKey, 0);

    // then create an account to hold tokens of this new type
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);

    // mint only 1 token into the account
    await mintTo(connection, wallet, mint, associatedTokenAccount.address, wallet.publicKey, 1);

    // disable future minting
    let transaction = new Transaction().add(
        createSetAuthorityInstruction(mint, wallet.publicKey, AuthorityType.MintTokens, null)
    );
    await sendAndConfirmTransaction(connection, transaction, [wallet]);

    const accountInfo = await getAccount(connection, associatedTokenAccount.address);

    console.log(`Account Info Amount ${accountInfo.amount}`);

    const mintInfo = await getMint(connection, mint);

    console.log(`Mint Info ${mintInfo}`);
})();
