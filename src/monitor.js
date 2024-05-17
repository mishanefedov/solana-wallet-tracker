import { Connection, PublicKey } from '@solana/web3.js';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');


const wallets = JSON.parse(readFileSync('wallets.json', 'utf-8'));
const walletAddresses = Object.values(wallets).map(address => new PublicKey(address));
const walletMap = new Map(Object.entries(wallets).map(([name, address]) => [address, name]));

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        }),
    });
    return response.json();
}

async function monitorWallet(wallet) {
    let lastSignature = null;
    const walletAddress = wallet.toString();
    const walletName = walletMap.get(walletAddress);

    while (true) {
        try {
            const options = { limit: 1, maxSupportedTransactionVersion: 0};
            const transactions = await connection.getConfirmedSignaturesForAddress2(wallet, options);
            if (transactions.length > 0) {
                const newSignature = transactions[0].signature;
                if (newSignature !== lastSignature) {
                    lastSignature = newSignature;
                    const confirmedTransaction = await connection.getConfirmedTransaction(newSignature);
                    console.log(
                        'instructions', (confirmedTransaction.transaction.instructions)
                    )
                    const blockTime = confirmedTransaction.blockTime;
                    const date = new Date(blockTime * 1000); // Convert to milliseconds
                    // const message = `Tx time: [${date.toISOString()}], wallet: ${walletAddress} (${walletName})\n\n${JSON.stringify(confirmedTransaction, null, 2)}`;
                    const message = `Tx time: [${date.toISOString()}], wallet: ${walletAddress} (${walletName})\n\nhttps://solscan.io/account/${walletAddress}`;
                    console.log(message);
                    await sendTelegramMessage(message);
                } else {
                    console.log('new signature is same as old')
                }
            } else {
                console.log('transactions length = 0')
            }
        } catch (error) {
            console.error(`Error monitoring wallet ${walletAddress}:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

export async function monitorWallets() {
    const monitorPromises = walletAddresses.map(wallet => monitorWallet(wallet));
    await Promise.all(monitorPromises);
}