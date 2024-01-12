import { PublicKey, Connection, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// program that increments a counter each time it has been pinged
const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
// program stores it's data in a specific account at the address
const PING_PROGRAM_DATA_ADDRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

const pingProgramId = new PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

const payer = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const instruction = new TransactionInstruction({
    keys: [
        {
            pubkey: pingProgramDataId,
            isSigner: false,
            isWritable: true,
        },
    ],
    programId: pingProgramId,
});

const transaction = new Transaction();
console.log(`Transaction Created `, transaction);

transaction.add(instruction);
console.log(`Instruction added to transaction `, transaction);

const latestBlockHash = await connection.getLatestBlockhash();
console.log(`Latest Blockhash `, latestBlockHash);

transaction.recentBlockhash = latestBlockHash.blockhash;
console.log(`Transaction with latest blockhash `, transaction);

transaction.feePayer = payer.publicKey;
console.log(`Transaction with payer `, transaction);

// Serialize the transaction message to get its size
const compiledMessage = transaction.compileMessage();
console.log(`Transaction compiled message `, compiledMessage);

const fee = await connection.getFeeForMessage(compiledMessage);
console.log(`Transaction fee `, fee);

const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);

console.log(`✅ Transaction completed! Signature is ${signature}`);
