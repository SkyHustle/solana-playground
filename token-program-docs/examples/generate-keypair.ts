import { Keypair } from "@solana/web3.js";

// Generate a new random keypair
const keypair = Keypair.generate();

console.log(`The public key `, keypair.publicKey);
console.log(`The public key in Base58 is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);

// Get the public and secret keys of this key pair
let publicKey = keypair.publicKey;
let secretKey = keypair.secretKey;

// Create a new key pair from the secret key
let sameKeypair = Keypair.fromSecretKey(secretKey);

// The public key of the new key pair should be the same as the original
console.assert(sameKeypair.publicKey.toString() === publicKey.toString());
