import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// more details about the associated accounts
(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey("EiryZW515JhpSFLLAerrtgL6oHoyyRLnEhPWdZUNPnim"),
        { programId: TOKEN_PROGRAM_ID }
    );

    const detailedAccounts = tokenAccounts.value.map((tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        return {
            accountAddress: tokenAccount.pubkey.toString(),
            mintAddress: new PublicKey(accountData.mint).toString(),
            amount: accountData.amount.toString(),
            // Include other details here as needed
        };
    });

    console.log(JSON.stringify(detailedAccounts, null, 2));
})();
